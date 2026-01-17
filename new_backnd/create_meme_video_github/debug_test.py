"""Minimal test to debug FFmpeg issue"""
import os
import sys
from pathlib import Path

# Add FFmpeg to PATH
ffmpeg_path = r"C:\Users\vince\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin"
os.environ["PATH"] = f"{ffmpeg_path};{os.environ['PATH']}"

from dotenv import load_dotenv
load_dotenv()

from src.fetcher import fetch_readme
from src.summarizer import summarize_readme
from src.tts import generate_speech
from src.captions import generate_captions_from_script
from src.composer import compose_video, get_background_video

print("Testing video generation...")

# Simple test
repo_url = "https://github.com/anthropics/claude-agent-sdk-typescript"

try:
    print(f"1. Fetching README from {repo_url}...")
    readme = fetch_readme(repo_url)
    print(f"   Got {len(readme)} characters")
    
    print("2. Generating script...")
    script = summarize_readme(readme)
    print(f"   Got {len(script)} characters")
    
    print("3. Generating speech...")
    audio_path = Path("test_audio.wav")
    generate_speech(script, audio_path, voice="Puck")
    print(f"   Audio saved to {audio_path}")
    
    print("4. Generating captions...")
    words = generate_captions_from_script(script, audio_path)
    print(f"   Got {len(words)} words")
    
    print("5. Getting background...")
    background = get_background_video(Path("backgrounds"))
    print(f"   Using {background}")
    
    print("6. Composing video...")
    output = Path("debug_output.mp4")
    compose_video(background, audio_path, words, output)
    print(f"   Video saved to {output}")
    
    print("\n✅ SUCCESS!")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
