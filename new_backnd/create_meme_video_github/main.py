#!/usr/bin/env python3
"""
Brainrot Video Generator

Create viral-style videos from GitHub repository README files.
"""

import argparse
import sys
import tempfile
from pathlib import Path

from dotenv import load_dotenv

from src.fetcher import fetch_readme
from src.summarizer import summarize_readme
from src.tts import generate_speech, VOICES, VOICE_MAPPING, DEFAULT_VOICE
from src.captions import generate_captions_from_script
from src.composer import compose_video, get_background_video


# Combine all valid voice options (Gemini voices + legacy OpenAI names)
ALL_VOICES = VOICES + list(VOICE_MAPPING.keys())


def main():
    parser = argparse.ArgumentParser(
        description="Generate brainrot videos from GitHub README files",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py https://github.com/facebook/react
  python main.py anthropics/claude-code --voice Puck
  python main.py --readme path/to/README.md
  python main.py -r oai_readme.md --output openai_brainrot.mp4

Available voices (Gemini TTS):
  Puck (Upbeat), Kore (Firm), Charon (Informative), Fenrir (Excitable),
  Leda (Youthful), Aoede (Breezy), Zephyr (Bright), and more...

Legacy OpenAI voice names are mapped to similar Gemini voices:
  nova -> Puck, alloy -> Kore, echo -> Charon, fable -> Aoede, etc.

Make sure to:
  1. Set GEMINI_API_KEY environment variable
  2. Add background videos to the backgrounds/ folder
        """,
    )

    parser.add_argument(
        "repo",
        nargs="?",
        help="GitHub repository URL or owner/repo format",
    )
    parser.add_argument(
        "--readme", "-r",
        help="Path to a local README file (instead of fetching from GitHub)",
    )
    parser.add_argument(
        "--voice",
        default=DEFAULT_VOICE,
        help=f"TTS voice to use (default: {DEFAULT_VOICE}). Use --list-voices to see all options.",
    )
    parser.add_argument(
        "--list-voices",
        action="store_true",
        help="List all available voices and exit",
    )
    parser.add_argument(
        "--output", "-o",
        help="Output filename (default: auto-generated in output/)",
    )
    parser.add_argument(
        "--backgrounds",
        default="backgrounds",
        help="Directory containing background videos (default: backgrounds/)",
    )
    parser.add_argument(
        "--skip-summary",
        action="store_true",
        help="Skip AI summarization, use raw README (not recommended)",
    )

    args = parser.parse_args()

    # Handle --list-voices
    if args.list_voices:
        print("Available Gemini TTS voices:")
        print("-" * 40)
        for voice in VOICES:
            print(f"  {voice}")
        print("\nLegacy OpenAI voice mappings:")
        print("-" * 40)
        for old, new in VOICE_MAPPING.items():
            print(f"  {old} -> {new}")
        sys.exit(0)

    # Load environment variables
    load_dotenv()

    # Create temp directory for intermediate files
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)

        # Step 1: Get README content
        if args.readme:
            # Read from local file
            readme_path = Path(args.readme)
            if not readme_path.exists():
                print(f"Error: README file not found: {args.readme}")
                sys.exit(1)
            print(f"Reading README from {args.readme}...")
            readme_content = readme_path.read_text()
            print(f"  Got {len(readme_content)} characters")
            # Use filename for output naming
            repo_name = readme_path.stem
        elif args.repo:
            # Fetch from GitHub
            print(f"Fetching README from {args.repo}...")
            try:
                readme_content = fetch_readme(args.repo)
                print(f"  Got {len(readme_content)} characters")
            except Exception as e:
                print(f"Error fetching README: {e}")
                sys.exit(1)
            repo_name = args.repo.split("/")[-1].replace(".git", "")
        else:
            print("Error: Must provide either a GitHub repo or --readme file")
            sys.exit(1)

        # Step 2: Summarize into script
        if args.skip_summary:
            script = readme_content[:2000]
            print("Using raw README content (truncated)...")
        else:
            print("Generating brainrot script with Gemini...")
            script = summarize_readme(readme_content)
            print(f"  Generated {len(script.split())} word script")

        print("\n--- Script Preview ---")
        print(script[:300] + "..." if len(script) > 300 else script)
        print("----------------------\n")

        # Step 3: Generate TTS audio (Gemini outputs WAV)
        audio_path = temp_path / "narration.wav"
        print(f"Generating speech with {args.voice} voice (Gemini TTS)...")
        generate_speech(script, audio_path, voice=args.voice)
        print(f"  Audio saved to {audio_path}")

        # Step 4: Generate captions from script (distributes words across audio duration)
        print("Generating captions from script...")
        words = generate_captions_from_script(script, audio_path)
        print(f"  Got {len(words)} word timestamps")

        # Step 5: Get background video
        backgrounds_dir = Path(args.backgrounds)
        try:
            background_path = get_background_video(backgrounds_dir)
            print(f"Using background: {background_path.name}")
        except FileNotFoundError as e:
            print(f"\nError: {e}")
            print("\nPlease add some background videos to the backgrounds/ folder.")
            print("Popular choices: Subway Surfers gameplay, Minecraft parkour, satisfying clips")
            sys.exit(1)

        # Step 6: Compose final video
        if args.output:
            output_path = Path(args.output)
        else:
            output_path = Path("output") / f"{repo_name}_brainrot.mp4"

        print(f"Composing final video to {output_path}...")
        compose_video(
            background_path=background_path,
            audio_path=audio_path,
            words=words,
            output_path=output_path,
        )

        print(f"\nDone! Video saved to: {output_path}")


if __name__ == "__main__":
    main()
