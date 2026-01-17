from pathlib import Path
from dotenv import load_dotenv
import os

env_path = Path("new_backnd/create_meme_video_github/.env")
load_dotenv(env_path, override=True)

print(f"Account ID: {os.getenv('CLOUDFLARE_ACCOUNT_ID')}")
print(f"Access Key: {'Set' if os.getenv('R2_ACCESS_KEY_ID') != 'XXX' else 'XXX'}")
print(f"Secret: {'Set' if os.getenv('R2_SECRET_ACCESS_KEY') != 'XXX' else 'XXX'}")
