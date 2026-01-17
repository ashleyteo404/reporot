"""Summarize README content into a brainrot-style script."""

import os
from google import genai
from google.genai import types


SYSTEM_PROMPT = """You are a Gen-Z content creator making viral TikTok/YouTube Shorts videos about GitHub repositories.

Your job is to take a README and turn it into a punchy, fast-paced, engaging script that sounds like a brainrot video.

Rules:
- Aim for 200-250 words (about 60-90 seconds when spoken)
- Use casual, energetic language
- Start with a hook that grabs attention
- Explain what the repo does in simple terms
- Mention why it's cool or useful
- End with a call to action or memorable line
- NO emojis in the text (this is for text-to-speech)
- NO markdown formatting
- Write it as continuous speech, not bullet points
- Use phrases like "yo", "literally", "no cap", "lowkey", "this is insane"
- Sound excited and slightly unhinged

Example style:
"Yo okay so you need to hear about this repo because it's literally insane. So basically what this does is..."
"""


def summarize_readme(readme_content: str, client: genai.Client | None = None) -> str:
    """
    Transform a README into a brainrot-style script.

    Args:
        readme_content: The raw README markdown
        client: Gemini client (creates one if not provided)

    Returns:
        A punchy script ready for TTS
    """
    if client is None:
        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=f"{SYSTEM_PROMPT}\n\nTurn this README into a brainrot video script:\n\n{readme_content[:8000]}",
        config=types.GenerateContentConfig(
            max_output_tokens=1000,
            temperature=0.9,
        ),
    )

    return response.text.strip()


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
