from src.fetcher import fetch_readme
import os
from dotenv import load_dotenv

load_dotenv()
print(f"TOKEN LOADED: {'YES' if os.getenv('GITHUB_TOKEN') else 'NO'}")

try:
    readme = fetch_readme("facebook/react")
    print(f"SUCCESS! Readme length: {len(readme)}")
except Exception as e:
    print(f"FAILED: {e}")
