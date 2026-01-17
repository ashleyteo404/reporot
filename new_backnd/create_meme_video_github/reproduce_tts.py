"""Test Gemini TTS with the exact configuration from the server."""
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

def test_tts(text: str, voice: str = "Puck"):
    print(f"Testing TTS with text length {len(text)}...")
    print(f"Text preview: {text[:100]}...")
    
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-preview-tts",
            contents=text,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=voice,
                        )
                    )
                ),
            ),
        )
        print("✅ Success! Audio generated.")
        return True
    except Exception as e:
        print(f"❌ Failed: {e}")
        return False

if __name__ == "__main__":
    # Test 1: Simple text
    test_tts("Hello world, this is a test.")
    
    # Test 2: Long text (typical script)
    long_text = "Yo check this out. " * 50
    test_tts(long_text)
    
    # Test 3: Text with structural markers (which might confuse it)
    structured_text = "Script:\n\nYo this is the script."
    test_tts(structured_text)
