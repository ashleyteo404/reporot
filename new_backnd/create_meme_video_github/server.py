"""FastAPI server for brainrot video generation from GitHub repos.

Send a GitHub repo link and get back the generated video as:
- Multipart form response
- Base64 encoded stream
"""

import base64
import logging
import re
import tempfile
import uuid
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse, Response, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from dotenv import load_dotenv

from src.fetcher import fetch_readme
from src.summarizer import summarize_readme
from src.tts import generate_speech, VOICES, VOICE_MAPPING, DEFAULT_VOICE
from src.captions import generate_captions_from_script
from src.composer import compose_video, get_background_video
from src.r2_utils import uploader

# Configuration
BASE_DIR = Path(__file__).parent.resolve()

# Load environment variables
load_dotenv(BASE_DIR / ".env", override=True)
OUTPUT_DIR = BASE_DIR / "output"
OUTPUT_DIR.mkdir(exist_ok=True)
BACKGROUNDS_DIR = BASE_DIR / "backgrounds"

# Initialize FastAPI app
app = FastAPI(
    title="GitHub Meme Video Generator API",
    description="Generate brainrot-style videos from GitHub repository READMEs",
    version="1.0.0",
)

# CORS - Allow connections for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===========================================================================
#  Request/Response Models
# ===========================================================================

class GenerateVideoRequest(BaseModel):
    """Request to generate a video from a GitHub repo."""
    
    github_url: str = Field(
        ...,
        description="GitHub repository URL",
        examples=["https://github.com/facebook/react", "https://github.com/anthropics/claude-code"]
    )
    voice: str = Field(
        default=DEFAULT_VOICE,
        description=f"TTS voice to use. Options: {', '.join(VOICES[:5])}..."
    )
    subtitle_style: str = Field(
        default="brainrot",
        description="Subtitle style: 'brainrot' (large, rapid) or 'standard' (readable, bottom)"
    )
    
    @field_validator("github_url")
    @classmethod
    def validate_github_url(cls, v: str) -> str:
        """Sanitize and validate the GitHub URL."""
        # Strip whitespace
        v = v.strip()
        
        # Check for empty
        if not v:
            raise ValueError("GitHub URL cannot be empty")
        
        # Sanitize: remove any potential injection characters
        # Only allow alphanumeric, hyphens, underscores, slashes, colons, dots
        if not re.match(r'^[a-zA-Z0-9\-_/:.]+$', v):
            raise ValueError("GitHub URL contains invalid characters")
        
        # Parse and validate the URL format
        # Accept: full URL or owner/repo format
        if v.startswith("http://") or v.startswith("https://"):
            parsed = urlparse(v)
            if parsed.netloc not in ("github.com", "www.github.com"):
                raise ValueError("URL must be from github.com")
            
            # Extract path parts
            path_parts = [p for p in parsed.path.strip("/").split("/") if p]
            if len(path_parts) < 2:
                raise ValueError("URL must contain owner/repo")
        else:
            # Allow owner/repo format
            parts = v.split("/")
            if len(parts) != 2:
                raise ValueError("Must be a full GitHub URL or owner/repo format")
        
        return v


# ===========================================================================
#  Video Generation Logic
# ===========================================================================

def _generate_video_sync(github_url: str, voice: str, output_path: Path, subtitle_style: str = "brainrot") -> Path:
    """
    Synchronously generate a brainrot video from a GitHub repo.
    
    Args:
        github_url: Validated GitHub URL
        voice: TTS voice name
        output_path: Where to save the video
        
    Returns:
        Path to the generated video
    """
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        
        # 1. Fetch README
        print(f"Fetching README from {github_url}...")
        readme_content = fetch_readme(github_url)
        
        # 2. Generate brainrot script
        print("Generating brainrot script...")
        script = summarize_readme(readme_content)

        # Save script to file for inspection
        try:
            script_path = output_path.with_suffix(".txt")
            print(f"Saving script to {script_path}...")
            script_path.write_text(script, encoding="utf-8")
        except Exception as e:
            print(f"Warning: Could not save script file: {e}")
        
        # 3. Generate TTS audio
        print(f"Generating speech with {voice} voice...")
        audio_path = temp_path / "narration.wav"
        generate_speech(script, audio_path, voice=voice)
        
        # 4. Generate captions
        print("Generating captions...")
        words = generate_captions_from_script(script, audio_path)
        
        # 5. Get background video
        print("Getting background video...")
        background_path = get_background_video(BACKGROUNDS_DIR)
        
        # 6. Compose final video
        print(f"Composing video to {output_path}...")
        compose_video(
            background_path=background_path,
            audio_path=audio_path,
            words=words,
            output_path=output_path,
            subtitle_style=subtitle_style,
        )
        
        return output_path


# ===========================================================================
#  API Endpoints
# ===========================================================================

@app.get("/", tags=["Health"])
async def root():
    """API root - health check."""
    return {
        "status": "ok",
        "message": "GitHub Meme Video Generator API",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
async def health():
    """Detailed health check."""
    bg_available = BACKGROUNDS_DIR.exists() and any(BACKGROUNDS_DIR.glob("*.mp4"))
    return {
        "status": "healthy",
        "backgrounds_available": bg_available,
        "output_dir_exists": OUTPUT_DIR.exists(),
    }


@app.get("/voices", tags=["Config"])
async def get_voices():
    """Get available TTS voices."""
    return {
        "voices": VOICES,
        "default": DEFAULT_VOICE,
        "legacy_mappings": VOICE_MAPPING,
    }


@app.post("/generate", tags=["Video Generation"])
async def generate_video(request: GenerateVideoRequest):
    """
    Generate a brainrot video from a GitHub repo and return it as a file download.
    
    This endpoint blocks until video generation is complete, then returns the video
    as an MP4 file for download.
    """
    job_id = str(uuid.uuid4())[:8]
    output_path = OUTPUT_DIR / f"{job_id}.mp4"
    
    try:
        _generate_video_sync(
            github_url=request.github_url,
            voice=request.voice,
            output_path=output_path,
            subtitle_style=request.subtitle_style,
        )
        
        if not output_path.exists():
            raise HTTPException(status_code=500, detail="Video generation failed - file not created")
        
        r2_url = uploader.upload_file(output_path)
        
        return FileResponse(
            path=str(output_path),
            media_type="video/mp4",
            filename=f"brainrot_{job_id}.mp4",
            headers={
                "Content-Disposition": f'attachment; filename="brainrot_{job_id}.mp4"',
                "X-R2-URL": r2_url or ""
            }
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            raise HTTPException(
                status_code=429, 
                detail="Daily AI limit reached. Please try again tomorrow or upgrade your plan."
            )
        raise HTTPException(status_code=500, detail=f"Video generation failed: {error_msg}")


@app.post("/generate/base64", tags=["Video Generation"])
async def generate_video_base64(request: GenerateVideoRequest):
    """
    Generate a brainrot video and return it as base64-encoded data.
    
    Returns JSON with the video encoded as a base64 string.
    This is suitable for API consumers that need the raw video data.
    """
    job_id = str(uuid.uuid4())[:8]
    output_path = OUTPUT_DIR / f"{job_id}.mp4"
    
    try:
        _generate_video_sync(
            github_url=request.github_url,
            voice=request.voice,
            output_path=output_path,
            subtitle_style=request.subtitle_style,
        )
        
        if not output_path.exists():
            raise HTTPException(status_code=500, detail="Video generation failed - file not created")
        
        # Upload to R2 before cleanup
        r2_url = uploader.upload_file(output_path)
        
        # Read and encode as base64
        video_bytes = output_path.read_bytes()
        video_base64 = base64.b64encode(video_bytes).decode("utf-8")
        
        # Clean up file after reading
        output_path.unlink()
        
        return {
            "job_id": job_id,
            "status": "completed",
            "content_type": "video/mp4",
            "video_base64": video_base64,
            "size_bytes": len(video_bytes),
            "r2_url": r2_url
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video generation failed: {str(e)}")


@app.post("/generate/stream", tags=["Video Generation"])
async def generate_video_stream(request: GenerateVideoRequest):
    """
    Generate a brainrot video and stream it back as a response.
    
    Returns the raw video bytes as a streaming response.
    This is the most efficient for large files.
    """
    job_id = str(uuid.uuid4())[:8]
    output_path = OUTPUT_DIR / f"{job_id}.mp4"
    
    try:
        _generate_video_sync(
            github_url=request.github_url,
            voice=request.voice,
            output_path=output_path,
            subtitle_style=request.subtitle_style,
        )
        
        if not output_path.exists():
            raise HTTPException(status_code=500, detail="Video generation failed - file not created")
        
        # Upload to R2
        r2_url = uploader.upload_file(output_path)
        
        def iterfile():
            with open(output_path, "rb") as f:
                while chunk := f.read(8192):  # 8KB chunks
                    yield chunk
            # Clean up after streaming
            output_path.unlink()
        
        file_size = output_path.stat().st_size
        
        return StreamingResponse(
            iterfile(),
            media_type="video/mp4",
            headers={
                "Content-Disposition": f'attachment; filename="brainrot_{job_id}.mp4"',
                "Content-Length": str(file_size),
                "X-Job-Id": job_id,
                "X-R2-URL": r2_url or ""
            }
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video generation failed: {str(e)}")


@app.post("/generate/multipart", tags=["Video Generation"])
async def generate_video_multipart(request: GenerateVideoRequest):
    """
    Generate a brainrot video and return it as multipart form data.
    
    This returns the video along with metadata in a multipart response,
    which is useful for Postman testing and form-based clients.
    """
    job_id = str(uuid.uuid4())[:8]
    output_path = OUTPUT_DIR / f"{job_id}.mp4"
    
    try:
        _generate_video_sync(
            github_url=request.github_url,
            voice=request.voice,
            output_path=output_path,
            subtitle_style=request.subtitle_style,
        )
        
        if not output_path.exists():
            raise HTTPException(status_code=500, detail="Video generation failed - file not created")
        
        # Upload to R2
        r2_url = uploader.upload_file(output_path)
        
        # Read video data
        video_bytes = output_path.read_bytes()
        
        # Create multipart boundary
        boundary = f"----BrainrotBoundary{job_id}"
        
        # Build multipart body
        body_parts = []
        
        # Part 1: Metadata (JSON)
        metadata = {
            "job_id": job_id,
            "status": "completed",
            "filename": f"brainrot_{job_id}.mp4",
            "size_bytes": len(video_bytes),
            "r2_url": r2_url
        }
        body_parts.append(f"--{boundary}\r\n")
        body_parts.append('Content-Disposition: form-data; name="metadata"\r\n')
        body_parts.append("Content-Type: application/json\r\n\r\n")
        body_parts.append(f'{{"job_id": "{job_id}", "status": "completed", "filename": "brainrot_{job_id}.mp4", "size_bytes": {len(video_bytes)}, "r2_url": "{r2_url}"}}\r\n')
        
        # Part 2: Video file
        body_parts.append(f"--{boundary}\r\n")
        body_parts.append(f'Content-Disposition: form-data; name="video"; filename="brainrot_{job_id}.mp4"\r\n')
        body_parts.append("Content-Type: video/mp4\r\n\r\n")
        
        # Combine text parts
        text_body = "".join(body_parts).encode("utf-8")
        end_boundary = f"\r\n--{boundary}--\r\n".encode("utf-8")
        
        # Full body: text header + video bytes + end boundary
        full_body = text_body + video_bytes + end_boundary
        
        # Clean up file
        output_path.unlink()
        
        return Response(
            content=full_body,
            media_type=f"multipart/form-data; boundary={boundary}",
            headers={
                "X-Job-Id": job_id,
                "X-R2-URL": r2_url or ""
            }
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video generation failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
