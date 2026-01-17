"""Generate speech audio using Gemini TTS."""

import os
import wave
from pathlib import Path

from google import genai
from google.genai import types


# Gemini TTS voices with their characteristics
VOICES = [
    "Zephyr",       # Bright
    "Puck",         # Upbeat
    "Charon",       # Informative
    "Kore",         # Firm
    "Fenrir",       # Excitable
    "Leda",         # Youthful
    "Orus",         # Firm
    "Aoede",        # Breezy
    "Callirrhoe",   # Easy-going
    "Autonoe",      # Bright
    "Enceladus",    # Breathy
    "Iapetus",      # Clear
    "Umbriel",      # Easy-going
    "Algieba",      # Smooth
    "Despina",      # Smooth
    "Erinome",      # Clear
    "Algenib",      # Gravelly
    "Rasalgethi",   # Informative
    "Laomedeia",    # Upbeat
    "Achernar",     # Soft
    "Alnilam",      # Firm
    "Schedar",      # Even
    "Gacrux",       # Mature
    "Pulcherrima",  # Forward
    "Achird",       # Friendly
    "Zubenelgenubi",# Casual
    "Vindemiatrix", # Gentle
    "Sadachbia",    # Lively
    "Sadaltager",   # Knowledgeable
    "Sulafat",      # Warm
]

# For backwards compatibility, map old OpenAI voices to similar Gemini voices
VOICE_MAPPING = {
    "nova": "Puck",      # Upbeat
    "alloy": "Kore",     # Firm
    "echo": "Charon",    # Informative
    "fable": "Aoede",    # Breezy
    "onyx": "Orus",      # Firm
    "shimmer": "Leda",   # Youthful
}

DEFAULT_VOICE = "Puck"


def _save_wave_file(filename: Path, pcm_data: bytes, channels: int = 1, rate: int = 24000, sample_width: int = 2):
    """Save PCM data as a wave file."""
    with wave.open(str(filename), "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm_data)


def generate_speech(
    text: str,
    output_path: str | Path,
    voice: str = DEFAULT_VOICE,
    client: genai.Client | None = None,
) -> Path:
    """
    Generate speech audio from text using Gemini TTS.

    Args:
        text: The text to convert to speech
        output_path: Where to save the audio file (will be saved as .wav)
        voice: Voice to use (see VOICES list, or use old OpenAI voice names)
        client: Gemini client (creates one if not provided)

    Returns:
        Path to the generated audio file
    """
    if client is None:
        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

    # Map old OpenAI voice names to Gemini voices
    voice_name = VOICE_MAPPING.get(voice.lower(), voice)

    # Validate voice
    if voice_name not in VOICES:
        raise ValueError(f"Voice must be one of: {VOICES}")

    output_path = Path(output_path)
    # Gemini TTS outputs WAV format
    if output_path.suffix.lower() == ".mp3":
        output_path = output_path.with_suffix(".wav")

    output_path.parent.mkdir(parents=True, exist_ok=True)

    response = client.models.generate_content(
        model="gemini-2.5-flash-preview-tts",
        contents=text,
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name=voice_name,
                    )
                )
            ),
        ),
    )

    # Extract audio data from response
    audio_data = response.candidates[0].content.parts[0].inline_data.data

    # Save as wave file
    _save_wave_file(output_path, audio_data)

    return output_path


if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()

    # Quick test
    generate_speech(
        "Yo this is a test of the text to speech system and it sounds pretty fire no cap.",
        "test_audio.wav",
        voice="Puck"
    )
    print("Audio saved to test_audio.wav")
