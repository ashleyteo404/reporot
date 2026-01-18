"""Summarize README content into a brainrot-style script."""

import os
from google import genai
from google.genai import types


SYSTEM_PROMPT = """You are a Gen-Z content creator making viral TikTok/YouTube Shorts videos about GitHub repositories.

Your job is to take a README and turn it into a punchy, fast-paced, engaging script that sounds like a brainrot video.

Rules:
- Aim for a concise script of 100-400 words (this should result in a 30s - 2.5 min video)
- Be extremely detailed: cover the tech stack, main features, how it works, and a call to action
- Use casual, energetic language
- Start with a massive hook that grabs attention
- Explain the "vibe" of the repo
- Mention specific folders or code structure if interesting
- NO emojis in the text (this is for text-to-speech)
- NO markdown formatting
- Write it as continuous speech, not bullet points
- Use phrases like "yo", "literally", "no cap", "lowkey", "this is insane", "massive W", "chat is this real"
- Sound excited and slightly unhinged

Example style:
"Yo okay so you need to hear about this repo because it's literally insane. So basically what this does is..."

CRITICAL: If the input text is short, creatively expand on it by describing the features and potential use cases in detail to ensure the script is at least 100-300 words. Do not simply summarize a short input. YAP about it.
"""


def summarize_readme(readme_content: str, client: genai.Client | None = None) -> str:
    """
    Transform a README into a brainrot-style script with retry logic and validation.
    """
    if client is None:
        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

    import time
    
    # Try multiple times to get a valid length script
    # Try multiple times to get a valid length script
    max_attempts = 5
    for attempt in range(max_attempts):
        try:
            # Model switch: Use 2.0 Flash Exp for better stability/compliance
            # Retry loop for API errors
            response = None
            api_retries = 3
            
            # Dynamic prompting (Firm but professional)
            prompt_suffix = ""
            if attempt > 0:
                prompt_suffix = f"\n\nPREVIOUS SCRIPT WAS TOO SHORT. PLEASE EXPAND ON THE DETAILS. target 100-300 words. DO NOT BE CONCISE."

            for retry in range(api_retries):
                try:
                    response = client.models.generate_content(
                        model="gemini-2.0-flash-exp",
                        contents=f"{SYSTEM_PROMPT}\n\nTurn this README into a fast-paced brainrot video script (Target 100-300 words. Approx 40s - 2m duration). Attempt {attempt+1}/{max_attempts}:{prompt_suffix}\n\n{readme_content[:15000]}",
                        config=types.GenerateContentConfig(
                            max_output_tokens=2000, 
                            tools=[],
                            temperature=1.0, 
                        ),
                    )
                    break # Success
                except Exception as e:
                    if "503" in str(e) or "429" in str(e):
                        print(f"  API Error (503/429): {e}. Retrying in 2s...")
                        time.sleep(2)
                    else:
                        raise e # Fatal error
            
            if not response or not response.text:
                raise ValueError("Empty response from AI")

            script = response.text.strip()
            word_count = len(script.split())
            print(f"  Generated script length: {word_count} words")

            # Validation: Ensure it meets the absolute minimum for ~30s (approx 80 words)
            if word_count >= 80: 
                return script
            
            print(f"  Script too short ({word_count} words). Retrying...")
            
        except Exception as e:
            print(f"  Generation failed: {e}. Retrying...")
            time.sleep(1)

    # NO FALLBACK to short script. Fail explicitly so user knows.
    raise RuntimeError(f"Failed to generate video of sufficient length ({80} words minimum) after {max_attempts} attempts. Please provide more input text or try again.")


if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()

    # Quick test
    test_readme = """
    # My Cool Project

    A fast and efficient way to do amazing things.

    ## Features
    - Super fast
    - Easy to use
    - Works everywhere
    """

    script = summarize_readme(test_readme)
    print(script)
