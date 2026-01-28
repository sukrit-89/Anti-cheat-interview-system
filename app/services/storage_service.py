"""
Storage Service - Handles video/audio recordings with S3/MinIO/Local fallback
Supports: AWS S3, MinIO (S3-compatible), and local filesystem (100% free)
"""
import os
import aiofiles
from pathlib import Path
from typing import Optional
from datetime import datetime, timedelta
import boto3
from botocore.client import Config
from botocore.exceptions import ClientError

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class StorageService:
    """
    Multi-backend storage service with automatic fallback:
    1. Try S3/MinIO if configured
    2. Fallback to local filesystem (always free)
    """
    
    def __init__(self):
        self.use_s3 = bool(settings.S3_ACCESS_KEY_ID and settings.S3_SECRET_ACCESS_KEY)
        self.local_storage_path = Path("uploads/recordings")
        
        if self.use_s3:
            try:
                self.s3_client = boto3.client(
                    's3',
                    endpoint_url=settings.S3_ENDPOINT_URL,
                    aws_access_key_id=settings.S3_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.S3_SECRET_ACCESS_KEY,
                    region_name=settings.S3_REGION,
                    config=Config(signature_version='s3v4')
                )
                # Test connection and create bucket if needed
                self._ensure_bucket_exists()
                logger.info(f"S3/MinIO storage initialized: {settings.S3_ENDPOINT_URL or 'AWS S3'}")
            except Exception as e:
                logger.warning(f"S3/MinIO unavailable, using local storage: {e}")
                self.use_s3 = False
        
        if not self.use_s3:
            self.local_storage_path.mkdir(parents=True, exist_ok=True)
            logger.info(f"Local storage initialized: {self.local_storage_path.absolute()}")
    
    def _ensure_bucket_exists(self):
        """Create S3 bucket if it doesn't exist"""
        try:
            self.s3_client.head_bucket(Bucket=settings.S3_BUCKET_NAME)
        except ClientError:
            try:
                self.s3_client.create_bucket(Bucket=settings.S3_BUCKET_NAME)
                logger.info(f"Created S3 bucket: {settings.S3_BUCKET_NAME}")
            except Exception as e:
                logger.error(f"Failed to create bucket: {e}")
                raise
    
    async def upload_file(
        self, 
        file_content: bytes, 
        file_name: str, 
        content_type: str = "application/octet-stream"
    ) -> str:
        """
        Upload file to S3/MinIO or local storage
        Returns: File URL or path
        """
        if self.use_s3:
            return await self._upload_to_s3(file_content, file_name, content_type)
        else:
            return await self._upload_to_local(file_content, file_name)
    
    async def _upload_to_s3(self, file_content: bytes, file_name: str, content_type: str) -> str:
        """Upload to S3/MinIO"""
        try:
            object_key = f"recordings/{datetime.utcnow().strftime('%Y/%m/%d')}/{file_name}"
            
            self.s3_client.put_object(
                Bucket=settings.S3_BUCKET_NAME,
                Key=object_key,
                Body=file_content,
                ContentType=content_type
            )
            
            # Return object URL
            if settings.S3_ENDPOINT_URL:
                # MinIO or custom endpoint
                return f"{settings.S3_ENDPOINT_URL}/{settings.S3_BUCKET_NAME}/{object_key}"
            else:
                # AWS S3
                return f"https://{settings.S3_BUCKET_NAME}.s3.{settings.S3_REGION}.amazonaws.com/{object_key}"
        
        except Exception as e:
            logger.error(f"S3 upload failed, falling back to local: {e}")
            return await self._upload_to_local(file_content, file_name)
    
    async def _upload_to_local(self, file_content: bytes, file_name: str) -> str:
        """Upload to local filesystem (free fallback)"""
        # Create date-based subdirectory
        date_path = self.local_storage_path / datetime.utcnow().strftime('%Y/%m/%d')
        date_path.mkdir(parents=True, exist_ok=True)
        
        file_path = date_path / file_name
        
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(file_content)
        
        logger.info(f"File saved locally: {file_path}")
        return str(file_path.absolute())
    
    async def get_download_url(self, file_path: str, expires_in: int = 3600) -> str:
        """
        Generate signed URL for S3 or return local path
        expires_in: seconds (default 1 hour)
        """
        if self.use_s3 and file_path.startswith("http"):
            # Extract object key from URL
            object_key = file_path.split(f"{settings.S3_BUCKET_NAME}/")[-1]
            
            try:
                url = self.s3_client.generate_presigned_url(
                    'get_object',
                    Params={
                        'Bucket': settings.S3_BUCKET_NAME,
                        'Key': object_key
                    },
                    ExpiresIn=expires_in
                )
                return url
            except Exception as e:
                logger.error(f"Failed to generate presigned URL: {e}")
                return file_path
        else:
            # Local file - return path (in production, serve via nginx)
            return file_path
    
    async def delete_file(self, file_path: str) -> bool:
        """Delete file from S3 or local storage"""
        if self.use_s3 and file_path.startswith("http"):
            object_key = file_path.split(f"{settings.S3_BUCKET_NAME}/")[-1]
            
            try:
                self.s3_client.delete_object(
                    Bucket=settings.S3_BUCKET_NAME,
                    Key=object_key
                )
                logger.info(f"Deleted S3 object: {object_key}")
                return True
            except Exception as e:
                logger.error(f"S3 deletion failed: {e}")
                return False
        else:
            # Local file
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    logger.info(f"Deleted local file: {file_path}")
                    return True
                return False
            except Exception as e:
                logger.error(f"Local deletion failed: {e}")
                return False
    
    async def list_session_files(self, session_id: int) -> list[str]:
        """List all files for a session"""
        prefix = f"recordings/{session_id}/"
        
        if self.use_s3:
            try:
                response = self.s3_client.list_objects_v2(
                    Bucket=settings.S3_BUCKET_NAME,
                    Prefix=prefix
                )
                
                if 'Contents' in response:
                    return [obj['Key'] for obj in response['Contents']]
                return []
            except Exception as e:
                logger.error(f"S3 list failed: {e}")
                return []
        else:
            # Local filesystem
            session_path = self.local_storage_path / str(session_id)
            if session_path.exists():
                return [str(f) for f in session_path.rglob("*") if f.is_file()]
            return []


# Singleton instance
storage_service = StorageService()
