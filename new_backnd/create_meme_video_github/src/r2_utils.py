import os
import logging
from pathlib import Path
import boto3
from botocore.config import Config
from dotenv import load_dotenv

# Ensure env is reloaded at runtime with absolute path
ENV_PATH = Path(__file__).parent.parent / ".env"
load_dotenv(ENV_PATH, override=True)

logger = logging.getLogger(__name__)

class R2Uploader:
    def __init__(self):
        self._initialize_client()

    def _initialize_client(self):
        # Reload env locally in case of mid-session changes
        logger.info(f"R2 Uploader: Loading environment from {ENV_PATH.absolute()}")
        load_dotenv(ENV_PATH, override=True)
        
        self.account_id = os.getenv("CLOUDFLARE_ACCOUNT_ID")
        self.access_key_id = os.getenv("R2_ACCESS_KEY_ID")
        self.secret_access_key = os.getenv("R2_SECRET_ACCESS_KEY")
        self.bucket_name = os.getenv("R2_BUCKET_NAME")
        self.public_domain = os.getenv("R2_PUBLIC_DOMAIN", "").strip("/")
        
        placeholders = {"XXX", "your-r2-public-domain.com", None}
        
        missing = [k for k, v in {
            "ACCOUNT_ID": self.account_id,
            "ACCESS_KEY": self.access_key_id, 
            "SECRET_KEY": self.secret_access_key,
            "BUCKET": self.bucket_name
        }.items() if not v or v in placeholders]
        
        if missing:
            logger.info(f"R2 Uploader: Standing by. Missing or placeholder values for: {', '.join(missing)}")
            self.s3_client = None
        else:
            try:
                # Masked display for debugging
                logger.info(f"R2 Uploader: Initializing with Account: {self.account_id[:4]}... Bucket: {self.bucket_name}")
                self.s3_client = boto3.client(
                    service_name="s3",
                    endpoint_url=f"https://{self.account_id}.r2.cloudflarestorage.com",
                    aws_access_key_id=self.access_key_id,
                    aws_secret_access_key=self.secret_access_key,
                    config=Config(signature_version="s3v4", connect_timeout=5, retries={'max_attempts': 2}),
                    region_name="auto"
                )
                logger.info("R2 Uploader: Client initialized successfully.")
            except Exception as e:
                logger.error(f"R2 Uploader: Initialization failed: {e}")
                self.s3_client = None

    def upload_file(self, file_path: Path) -> str:
        # Re-verify client if it wasn't initialized
        if not self.s3_client:
            self._initialize_client()
            
        if not self.s3_client:
            return None
            
        try:
            object_name = file_path.name
            logger.info(f"R2: Uploading {object_name}...")
            
            self.s3_client.upload_file(
                str(file_path), 
                self.bucket_name, 
                object_name,
                ExtraArgs={'ContentType': 'video/mp4' if file_path.suffix == '.mp4' else 'text/plain'}
            )
            
            url = f"https://{self.public_domain}/{object_name}" if self.public_domain else object_name
            logger.info(f"R2: Upload successful -> {url}")
            return url
        except Exception as e:
            logger.error(f"R2: Upload failed: {e}")
            return None

uploader = R2Uploader()
