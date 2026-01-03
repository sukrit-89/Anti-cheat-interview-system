"""
Cloudinary Service for Satya Guard
Handles video and PDF report uploads to Cloudinary
"""

import os
import cloudinary
import cloudinary.uploader
import cloudinary.api
from dotenv import load_dotenv
from typing import Optional, Dict

# Load environment variables
load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET'),
    secure=True
)


class CloudinaryService:
    """Service for managing uploads to Cloudinary"""
    
    def __init__(self):
        """Initialize Cloudinary service"""
        self.cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
        if not self.cloud_name:
            raise ValueError("Cloudinary credentials not configured")
    
    def upload_video(self, file_path: str, public_id: Optional[str] = None) -> Dict:
        """
        Upload video file to Cloudinary
        
        Args:
            file_path: Path to video file
            public_id: Optional custom public ID
            
        Returns:
            Upload result with URL and public_id
        """
        try:
            result = cloudinary.uploader.upload(
                file_path,
                resource_type="video",
                public_id=public_id,
                folder="satya-guard/videos",
                chunk_size=6000000,  # 6MB chunks for large videos
                timeout=120
            )
            
            return {
                "url": result.get('secure_url'),
                "public_id": result.get('public_id'),
                "format": result.get('format'),
                "duration": result.get('duration'),
                "bytes": result.get('bytes')
            }
        except Exception as e:
            print(f"Error uploading video to Cloudinary: {e}")
            raise
    
    def upload_pdf(self, file_path: str, public_id: Optional[str] = None) -> Dict:
        """
        Upload PDF file to Cloudinary
        
        Args:
            file_path: Path to PDF file
            public_id: Optional custom public ID
            
        Returns:
            Upload result with URL and public_id
        """
        try:
            result = cloudinary.uploader.upload(
                file_path,
                resource_type="raw",
                public_id=public_id,
                folder="satya-guard/reports"
            )
            
            return {
                "url": result.get('secure_url'),
                "public_id": result.get('public_id'),
                "format": result.get('format'),
                "bytes": result.get('bytes')
            }
        except Exception as e:
            print(f"Error uploading PDF to Cloudinary: {e}")
            raise
    
    def get_video_url(self, public_id: str, signed: bool = False) -> str:
        """
        Get Cloudinary video URL
        
        Args:
            public_id: Cloudinary public ID
            signed: Whether to generate signed URL
            
        Returns:
            Video URL
        """
        if signed:
            return cloudinary.CloudinaryVideo(public_id).build_url(sign_url=True)
        else:
            return cloudinary.CloudinaryVideo(public_id).build_url()
    
    def get_pdf_url(self, public_id: str) -> str:
        """
        Get Cloudinary PDF URL
        
        Args:
            public_id: Cloudinary public ID
            
        Returns:
            PDF URL
        """
        return cloudinary.utils.cloudinary_url(
            public_id,
            resource_type="raw",
            secure=True
        )[0]
    
    def delete_resource(self, public_id: str, resource_type: str = "video") -> bool:
        """
        Delete resource from Cloudinary
        
        Args:
            public_id: Cloudinary public ID
            resource_type: Type of resource ('video', 'raw', 'image')
            
        Returns:
            True if deleted successfully
        """
        try:
            result = cloudinary.uploader.destroy(
                public_id,
                resource_type=resource_type
            )
            return result.get('result') == 'ok'
        except Exception as e:
            print(f"Error deleting resource from Cloudinary: {e}")
            return False
    
    def download_video(self, url: str, save_path: str) -> str:
        """
        Download video from Cloudinary URL to local file
        
        Args:
            url: Cloudinary video URL
            save_path: Local path to save video
            
        Returns:
            Path to downloaded video
        """
        import requests
        
        try:
            response = requests.get(url, stream=True)
            response.raise_for_status()
            
            with open(save_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            return save_path
        except Exception as e:
            print(f"Error downloading video from Cloudinary: {e}")
            raise
