# GitHub Meme Video Generator API

A FastAPI server that generates brainrot-style meme videos from GitHub repository READMEs.

## Features

- **GitHub URL Sanitization**: Validates and sanitizes GitHub URLs to prevent injection attacks
- **Multiple Response Formats**: Choose how you want your video delivered
  - File download (standard)
  - Base64 encoded JSON
  - Streaming response
  - Multipart form data (Postman-friendly)

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up Environment

Create a `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Add Background Videos

Create a `backgrounds/` folder and add some MP4 videos (Subway Surfers, Minecraft parkour, etc.)

### 4. Run the Server

```bash
python server.py
```

Or with uvicorn:
```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

All endpoints accept POST requests with JSON body:
```json
{
  "github_url": "https://github.com/facebook/react",
  "voice": "Puck"
}
```

### Health Checks

- `GET /` - Simple health check
- `GET /health` - Detailed health status
- `GET /voices` - List available TTS voices

### Video Generation

#### `POST /generate` - File Download
Returns the video as a file download with `Content-Disposition: attachment`.

```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{"github_url": "https://github.com/facebook/react"}' \
  --output video.mp4
```

#### `POST /generate/base64` - Base64 Response
Returns JSON with the video encoded as base64.

```bash
curl -X POST http://localhost:8000/generate/base64 \
  -H "Content-Type: application/json" \
  -d '{"github_url": "https://github.com/facebook/react"}'
```

Response:
```json
{
  "job_id": "abc12345",
  "status": "completed",
  "content_type": "video/mp4",
  "video_base64": "AAAAHGZ0eXBpc29...",
  "size_bytes": 1234567
}
```

#### `POST /generate/stream` - Streaming Response
Streams the video bytes back as a response. Most efficient for large files.

```bash
curl -X POST http://localhost:8000/generate/stream \
  -H "Content-Type: application/json" \
  -d '{"github_url": "https://github.com/facebook/react"}' \
  --output video.mp4
```

#### `POST /generate/multipart` - Multipart Form Response
Returns the video along with metadata as multipart form data.
Best for Postman testing.

```bash
curl -X POST http://localhost:8000/generate/multipart \
  -H "Content-Type: application/json" \
  -d '{"github_url": "https://github.com/facebook/react"}'
```

## Testing with Postman

### File Download
1. Create a new POST request to `http://localhost:8000/generate`
2. Set body to raw JSON:
   ```json
   {
     "github_url": "https://github.com/facebook/react"
   }
   ```
3. Send the request
4. Use "Save Response" to save the MP4 file

### Base64 Response
1. POST to `http://localhost:8000/generate/base64`
2. Same JSON body
3. Response will include `video_base64` field with the encoded video

### Multipart Form
1. POST to `http://localhost:8000/generate/multipart`
2. Response contains both metadata and video file in multipart format

## Available Voices

Gemini TTS voices include:
- **Puck** (Upbeat) - Default
- **Kore** (Firm)
- **Charon** (Informative)
- **Fenrir** (Excitable)
- **Leda** (Youthful)
- **Zephyr** (Bright)
- And many more...

Legacy OpenAI voice names are also supported and mapped to similar voices:
- `nova` → Puck
- `alloy` → Kore
- `echo` → Charon
- `fable` → Aoede

## URL Validation

The API sanitizes GitHub URLs to prevent security issues:
- Only allows `github.com` domain
- Strips invalid characters
- Accepts both full URLs and `owner/repo` format:
  - `https://github.com/facebook/react` ✓
  - `facebook/react` ✓
  - `https://malicious-site.com/hack` ✗

## Interactive API Docs

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
