"""Compose the final video with background, audio, and captions using FFmpeg."""

import json
import random
import subprocess
import tempfile
from pathlib import Path


def get_background_video(backgrounds_dir: str | Path) -> Path:
    """Get a random background video from the backgrounds directory."""
    backgrounds_dir = Path(backgrounds_dir)

    video_extensions = {".mp4", ".mov", ".avi", ".mkv", ".webm"}
    videos = [
        f for f in backgrounds_dir.iterdir()
        if f.suffix.lower() in video_extensions
    ]

    if not videos:
        raise FileNotFoundError(
            f"No video files found in {backgrounds_dir}. "
            "Please add some background videos (Subway Surfers, Minecraft parkour, etc.)"
        )

    return random.choice(videos)


def get_audio_duration(audio_path: str | Path) -> float:
    """Get duration of audio file using ffprobe."""
    result = subprocess.run(
        [
            "ffprobe", "-v", "quiet", "-show_entries", "format=duration",
            "-of", "json", str(audio_path)
        ],
        capture_output=True,
        text=True,
    )
    data = json.loads(result.stdout)
    return float(data["format"]["duration"])


def generate_ass_subtitles(words: list[dict], output_path: Path, video_width: int = 1080, video_height: int = 1920) -> None:
    """
    Generate ASS subtitle file with brainrot-style word-by-word captions.
    """
    # ASS header with style
    ass_content = f"""[Script Info]
Title: Brainrot Captions
ScriptType: v4.00+
PlayResX: {video_width}
PlayResY: {video_height}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,90,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,4,0,2,10,10,350,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

    for word_info in words:
        word = word_info["word"].strip().upper()
        start = word_info["start"]
        end = word_info["end"]

        # Format time as H:MM:SS.cc
        start_str = format_ass_time(start)
        end_str = format_ass_time(end)

        # Add the dialogue line
        ass_content += f"Dialogue: 0,{start_str},{end_str},Default,,0,0,0,,{word}\n"

    output_path.write_text(ass_content)


def format_ass_time(seconds: float) -> str:
    """Format seconds to ASS time format (H:MM:SS.cc)."""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    centisecs = int((seconds % 1) * 100)
    return f"{hours}:{minutes:02d}:{secs:02d}.{centisecs:02d}"


def compose_video(
    background_path: str | Path,
    audio_path: str | Path,
    words: list[dict],
    output_path: str | Path,
    target_resolution: tuple[int, int] = (1080, 1920),  # Vertical video
) -> Path:
    """
    Compose the final brainrot video using FFmpeg.

    Args:
        background_path: Path to background video
        audio_path: Path to narration audio
        words: Word timestamps from caption generation
        output_path: Where to save the final video
        target_resolution: Output resolution (width, height)

    Returns:
        Path to the output video
    """
    background_path = Path(background_path)
    audio_path = Path(audio_path)
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    width, height = target_resolution

    # Get audio duration
    audio_duration = get_audio_duration(audio_path)

    # Create temp subtitle file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.ass', delete=False) as f:
        subtitle_path = Path(f.name)

    generate_ass_subtitles(words, subtitle_path, width, height)

    # Build FFmpeg command
    # 1. Loop background video, scale/crop to target resolution
    # 2. Trim to audio duration
    # 3. Add audio
    # 4. Burn in subtitles

    filter_complex = (
        # Scale video to fill target resolution (crop to fit)
        f"[0:v]scale={width}:{height}:force_original_aspect_ratio=increase,"
        f"crop={width}:{height},"
        # Loop if needed
        f"loop=loop=-1:size=32767,"
        # Trim to audio duration
        f"trim=duration={audio_duration},"
        f"setpts=PTS-STARTPTS,"
        # Burn in subtitles
        f"ass='{subtitle_path}'[v]"
    )

    cmd = [
        "ffmpeg", "-y",
        "-i", str(background_path),
        "-i", str(audio_path),
        "-filter_complex", filter_complex,
        "-map", "[v]",
        "-map", "1:a",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        str(output_path),
    ]

    print(f"  Running FFmpeg...")
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"FFmpeg error: {result.stderr}")
        raise RuntimeError(f"FFmpeg failed: {result.stderr}")

    # Clean up temp subtitle file
    subtitle_path.unlink()

    return output_path


if __name__ == "__main__":
    print("Video composer module loaded.")
    print("Use compose_video() to create a brainrot video.")
