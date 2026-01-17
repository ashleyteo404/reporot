"""Generate captions/subtitles from audio."""

import json
import os
import subprocess
from pathlib import Path


def generate_captions(
    audio_path: str | Path,
    output_path: str | Path | None = None,
    use_openai: bool = False,
) -> list[dict]:
    """
    Generate word-level captions from audio.

    Args:
        audio_path: Path to the audio file
        output_path: Optional path to save SRT file
        use_openai: Use OpenAI Whisper API (requires OPENAI_API_KEY)

    Returns:
        List of caption segments with timing info
    """
    audio_path = Path(audio_path)

    if use_openai and os.environ.get("OPENAI_API_KEY"):
        words = _transcribe_with_openai(audio_path)
    else:
        words = _transcribe_with_estimation(audio_path)

    # Generate SRT if output path provided
    if output_path:
        output_path = Path(output_path)
        srt_content = generate_srt(words)
        output_path.write_text(srt_content)

    return words


def _transcribe_with_openai(audio_path: Path) -> list[dict]:
    """Use OpenAI Whisper API for accurate word-level timestamps."""
    from openai import OpenAI

    client = OpenAI()

    with open(audio_path, "rb") as audio_file:
        result = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            response_format="verbose_json",
            timestamp_granularities=["word"],
        )

    words = []
    if hasattr(result, "words") and result.words:
        for word_info in result.words:
            words.append({
                "word": word_info.word.strip(),
                "start": word_info.start,
                "end": word_info.end,
            })

    return words


def _transcribe_with_estimation(audio_path: Path) -> list[dict]:
    """
    Estimate word timings based on audio duration and assumed speech rate.
    Uses ffprobe to get audio duration, then distributes words evenly.
    """
    # Get audio duration using ffprobe
    duration = _get_audio_duration(audio_path)
    if duration is None:
        duration = 60.0  # Default fallback

    # Read the script from a companion file or use placeholder
    # Since we're generating from TTS, we don't have the original text here
    # We'll create placeholder words based on duration
    # Average speaking rate is about 150 words per minute (2.5 words/sec)
    words_per_second = 2.5
    estimated_word_count = int(duration * words_per_second)

    words = []
    time_per_word = duration / max(estimated_word_count, 1)

    for i in range(estimated_word_count):
        start = i * time_per_word
        end = (i + 1) * time_per_word
        words.append({
            "word": f"[word{i+1}]",  # Placeholder
            "start": start,
            "end": end,
        })

    return words


def _get_audio_duration(audio_path: Path) -> float | None:
    """Get audio duration using ffprobe."""
    try:
        result = subprocess.run(
            [
                "ffprobe",
                "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                str(audio_path)
            ],
            capture_output=True,
            text=True,
        )
        return float(result.stdout.strip())
    except (subprocess.CalledProcessError, ValueError):
        return None


def generate_captions_from_script(
    script: str,
    audio_path: str | Path,
    output_path: str | Path | None = None,
) -> list[dict]:
    """
    Generate word-level captions by distributing script words across audio duration.
    This is a fallback when Whisper API is not available.

    Args:
        script: The text that was spoken
        audio_path: Path to the audio file
        output_path: Optional path to save SRT file

    Returns:
        List of caption segments with timing info
    """
    audio_path = Path(audio_path)
    duration = _get_audio_duration(audio_path) or 60.0

    # Split script into words
    script_words = script.split()
    if not script_words:
        return []

    # Distribute words evenly across duration
    time_per_word = duration / len(script_words)

    words = []
    for i, word in enumerate(script_words):
        start = i * time_per_word
        end = min((i + 1) * time_per_word, duration)
        words.append({
            "word": word,
            "start": start,
            "end": end,
        })

    # Generate SRT if output path provided
    if output_path:
        output_path = Path(output_path)
        srt_content = generate_srt(words)
        output_path.write_text(srt_content)

    return words


def generate_srt(words: list[dict], words_per_caption: int = 3) -> str:
    """
    Generate SRT subtitle content from word timestamps.

    Groups words into chunks for readability.
    """
    srt_lines = []
    caption_num = 1

    for i in range(0, len(words), words_per_caption):
        chunk = words[i:i + words_per_caption]
        if not chunk:
            continue

        start_time = chunk[0]["start"]
        end_time = chunk[-1]["end"]
        text = " ".join(w["word"] for w in chunk)

        # Format timestamps as SRT format: HH:MM:SS,mmm
        start_srt = format_srt_time(start_time)
        end_srt = format_srt_time(end_time)

        srt_lines.append(f"{caption_num}")
        srt_lines.append(f"{start_srt} --> {end_srt}")
        srt_lines.append(text)
        srt_lines.append("")

        caption_num += 1

    return "\n".join(srt_lines)


def format_srt_time(seconds: float) -> str:
    """Convert seconds to SRT timestamp format (HH:MM:SS,mmm)."""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


def save_word_timestamps(words: list[dict], output_path: str | Path) -> None:
    """Save word timestamps as JSON for custom caption rendering."""
    output_path = Path(output_path)
    output_path.write_text(json.dumps(words, indent=2))


if __name__ == "__main__":
    # Quick test - requires an audio file
    import sys
    if len(sys.argv) > 1:
        words = generate_captions(sys.argv[1], "test_captions.srt")
        print(f"Generated {len(words)} word timestamps")
