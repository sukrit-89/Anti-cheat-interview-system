"""
Supabase Service Integration.
Handles database, auth, storage, and real-time features.
"""
import os
from typing import Optional, Dict, Any, List
from datetime import datetime

try:
    from supabase import create_client, Client
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False

from app.core.config import settings
from app.core.logging import logger


class SupabaseService:
    """Service for Supabase operations."""
    
    def __init__(self):
        self.client = None
        
        if not SUPABASE_AVAILABLE:
            logger.warning("Supabase not installed. Install with: pip install supabase")
            return
        
        # Check if Supabase credentials are properly configured
        # Handle None, empty string, and whitespace-only values
        supabase_url = getattr(settings, 'SUPABASE_URL', None)
        supabase_anon_key = getattr(settings, 'SUPABASE_ANON_KEY', None)
        
        if not supabase_url or not str(supabase_url).strip():
            logger.info("Supabase URL not configured. Using local database only.")
            return
            
        if not supabase_anon_key or not str(supabase_anon_key).strip():
            logger.info("Supabase anon key not configured. Using local database only.")
            return
            
        try:
            # Initialize Supabase client
            self.client: Optional[Client] = create_client(
                supabase_url=supabase_url.strip(),
                supabase_key=supabase_anon_key.strip()
            )
            
            # Set auth header for admin operations
            service_role_key = getattr(settings, 'SUPABASE_SERVICE_ROLE_KEY', None)
            if service_role_key and str(service_role_key).strip():
                self.client.postgrest.auth(service_role_key)
            
            logger.info("Supabase client initialized successfully")
        except Exception as e:
            logger.warning(f"Failed to initialize Supabase client: {e}. Using local database only.")
            self.client = None
    
    async def get_client(self) -> Optional[Client]:
        """Get authenticated Supabase client."""
        if not self.client:
            return None
            
        # Use service role for admin operations
        if hasattr(settings, 'SUPABASE_SERVICE_ROLE_KEY'):
            self.client.postgrest.auth(settings.SUPABASE_SERVICE_ROLE_KEY)
            
        return self.client
    
    # Database Operations
    async def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create user in Supabase database."""
        client = await self.get_client()
        if not client:
            raise Exception("Supabase not available")
            
        try:
            result = client.table('users').insert(user_data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Supabase create user error: {e}")
            raise
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email from Supabase."""
        client = await self.get_client()
        if not client:
            return None
            
        try:
            result = client.table('users').select('*').eq('email', email).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Supabase get user error: {e}")
            return None
    
    async def update_user(self, user_id: int, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update user in Supabase."""
        client = await self.get_client()
        if not client:
            raise Exception("Supabase not available")
            
        try:
            result = client.table('users').update(updates).eq('id', user_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Supabase update user error: {e}")
            raise
    
    # Session Operations
    async def create_session(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create interview session."""
        client = await self.get_client()
        if not client:
            raise Exception("Supabase not available")
            
        try:
            result = client.table('sessions').insert(session_data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Supabase create session error: {e}")
            raise
    
    async def get_session(self, session_id: int) -> Optional[Dict[str, Any]]:
        """Get session by ID."""
        client = await self.get_client()
        if not client:
            return None
            
        try:
            result = client.table('sessions').select('*').eq('id', session_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Supabase get session error: {e}")
            return None
    
    async def update_session(self, session_id: int, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update session."""
        client = await self.get_client()
        if not client:
            raise Exception("Supabase not available")
            
        try:
            result = client.table('sessions').update(updates).eq('id', session_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Supabase update session error: {e}")
            raise
    
    # Storage Operations
    async def upload_file(self, bucket: str, file_path: str, file_content: bytes) -> str:
        """Upload file to Supabase storage."""
        client = await self.get_client()
        if not client:
            raise Exception("Supabase not available")
            
        try:
            result = client.storage.from_(bucket).upload(file_path, file_content)
            return result.data.get('path', '')
        except Exception as e:
            logger.error(f"Supabase upload error: {e}")
            raise
    
    async def get_file_url(self, bucket: str, file_path: str, expires_in: int = 3600) -> str:
        """Get public URL for file."""
        client = await self.get_client()
        if not client:
            return ""
            
        try:
            result = client.storage.from_(bucket).get_public_url(file_path, expires_in=expires_in)
            return result.data.get('publicUrl', '')
        except Exception as e:
            logger.error(f"Supabase get URL error: {e}")
            return ""
    
    # Real-time Operations
    async def subscribe_to_session(self, session_id: int, callback):
        """Subscribe to real-time session updates."""
        client = await self.get_client()
        if not client:
            return None
            
        try:
            return client.table('sessions').on_update(callback).eq('id', session_id)
        except Exception as e:
            logger.error(f"Supabase subscription error: {e}")
            return None
    
    async def subscribe_to_coding_events(self, session_id: int, callback):
        """Subscribe to coding events for a session."""
        client = await self.get_client()
        if not client:
            return None
            
        try:
            return client.table('coding_events').on_insert(callback).eq('session_id', session_id)
        except Exception as e:
            logger.error(f"Supabase coding events subscription error: {e}")
            return None
    
    # Analytics Operations
    async def create_evaluation(self, evaluation_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create evaluation record."""
        client = await self.get_client()
        if not client:
            raise Exception("Supabase not available")
            
        try:
            result = client.table('evaluations').insert(evaluation_data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Supabase create evaluation error: {e}")
            raise
    
    async def get_evaluation(self, session_id: int) -> Optional[Dict[str, Any]]:
        """Get evaluation for session."""
        client = await self.get_client()
        if not client:
            return None
            
        try:
            result = client.table('evaluations').select('*').eq('session_id', session_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Supabase get evaluation error: {e}")
            return None


# Singleton instance
supabase_service = SupabaseService()
