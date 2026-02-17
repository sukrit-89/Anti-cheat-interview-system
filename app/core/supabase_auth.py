"""
Supabase Authentication Service.
Production-ready auth using Supabase only.
"""
from typing import Optional, Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import settings
from app.core.logging import logger

# Import Supabase
try:
    from supabase import create_client
    from app.services.supabase_service import supabase_service
    SUPABASE_AUTH_AVAILABLE = True
except ImportError:
    SUPABASE_AUTH_AVAILABLE = False


class SupabaseAuthService:
    """Supabase-only authentication service."""
    
    @staticmethod
    def _serialize_user(user: Any) -> dict:
        """Convert Supabase user object to serializable dict."""
        if not user:
            return {}
        
        user_dict = {
            'id': getattr(user, 'id', None),
            'email': getattr(user, 'email', None),
        }
        
        # Handle created_at datetime
        created_at = getattr(user, 'created_at', None)
        if created_at:
            user_dict['created_at'] = created_at.isoformat() if hasattr(created_at, 'isoformat') else str(created_at)
        
        # Handle updated_at datetime
        updated_at = getattr(user, 'updated_at', None)
        if updated_at:
            user_dict['updated_at'] = updated_at.isoformat() if hasattr(updated_at, 'isoformat') else str(updated_at)
        
        return user_dict
    
    def __init__(self):
        self.supabase_client = None
        
        if not SUPABASE_AUTH_AVAILABLE:
            logger.warning("Supabase not installed. Skipping Supabase auth.")
            return
        
        # Check if Supabase credentials are configured
        if not settings.SUPABASE_URL or settings.SUPABASE_URL == "" or not settings.SUPABASE_ANON_KEY or settings.SUPABASE_ANON_KEY == "":
            logger.info("Supabase credentials not configured. Skipping Supabase auth.")
            return
        
        try:
            self.supabase_client = create_client(
                supabase_url=settings.SUPABASE_URL,
                supabase_key=settings.SUPABASE_ANON_KEY
            )
            logger.info("Supabase Auth initialized")
        except Exception as e:
            logger.warning(f"Failed to initialize Supabase Auth: {e}. Auth will be disabled.")
            self.supabase_client = None
    
    async def sign_up(self, email: str, password: str, full_name: str, role: str) -> dict:
        """Register user with Supabase."""
        if not self.supabase_client:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Supabase authentication is not configured. Please configure SUPABASE_URL and SUPABASE_ANON_KEY."
            )
        
        try:
            # Disable email confirmation for development to avoid rate limits
            result = self.supabase_client.auth.sign_up({
                'email': email,
                'password': password,
                'options': {
                    'data': {
                        'full_name': full_name,
                        'role': role
                    },
                    'email_redirect_to': None  # Disable email confirmation for dev
                }
            })
            
            if result.user:
                # Try to create user record in database
                # If it already exists, that's okay - they might have registered before
                try:
                    user_data = {
                        'id': result.user.id,
                        'email': email,
                        'full_name': full_name,
                        'role': role,
                        'is_active': True,
                        'created_at': result.user.created_at
                    }
                    
                    await supabase_service.create_user(user_data)
                    logger.info(f"Supabase user registered: {email}")
                except Exception as db_error:
                    # If user already exists in database, that's fine
                    logger.warning(f"User record might already exist in database: {db_error}")
                
                return {
                    'user': self._serialize_user(result.user),
                    'session': result.session
                }
            else:
                raise Exception("Registration failed")
                
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Supabase registration error: {e}")
            
            # Provide more specific error message based on error type
            error_msg = str(e).lower()
            
            # Check for rate limit errors
            if 'rate limit' in error_msg or 'too many' in error_msg:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Email rate limit exceeded. Supabase limits email sending. Please wait a few minutes or disable email confirmation in Supabase dashboard (Authentication > Settings > Email Auth > Confirm email = OFF)."
                )
            
            # Check for duplicate user errors (multiple variations)
            elif any(phrase in error_msg for phrase in [
                'already registered',
                'already exists', 
                'already been registered',
                'user already exists',
                'email already',
                'duplicate',
                'unique constraint'
            ]):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="This email is already registered. If you registered recently, please try logging in instead. If you forgot your password, use the password reset option."
                )
            
            # Generic error
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Registration failed: {str(e)}"
            )
    
    async def sign_in(self, email: str, password: str) -> dict:
        """Sign in with Supabase."""
        if not self.supabase_client:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Supabase authentication is not configured. Please configure SUPABASE_URL and SUPABASE_ANON_KEY."
            )
        
        try:
            result = self.supabase_client.auth.sign_in_with_password({
                'email': email,
                'password': password
            })
            
            if result.user and result.session:
                logger.info(f"Supabase user signed in: {email}")
                
                return {
                    'user': self._serialize_user(result.user),
                    'session': result.session,
                    'access_token': result.session.access_token,
                    'refresh_token': result.session.refresh_token
                }
            else:
                raise Exception("Sign in failed")
                
        except Exception as e:
            logger.error(f"Supabase sign in error: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Authentication failed: {str(e)}"
            )
    
    async def sign_out(self, access_token: str) -> None:
        """Sign out from Supabase."""
        if not self.supabase_client:
            logger.warning("Supabase not configured, sign out skipped")
            return
        
        try:
            self.supabase_client.auth.sign_out()
            logger.info("Supabase user signed out")
        except Exception as e:
            logger.error(f"Supabase sign out error: {e}")
    
    async def get_user(self, access_token: str) -> Optional[dict]:
        """Get user from Supabase."""
        if not self.supabase_client:
            logger.warning("Supabase not configured, cannot get user")
            return None
        
        try:
            # Get user directly with the JWT token
            response = self.supabase_client.auth.get_user(access_token)
            
            if response and response.user:
                # Extract user metadata for role and full_name
                user_metadata = response.user.user_metadata or {}
                
                user_dict = {
                    'id': response.user.id,
                    'email': response.user.email,
                    'full_name': user_metadata.get('full_name', response.user.email.split('@')[0]),
                    'role': user_metadata.get('role', 'candidate'),
                    'is_active': True,
                    'created_at': response.user.created_at,
                }
                
                return user_dict
            return None
            
        except Exception as e:
            logger.error(f"Supabase get user error: {e}")
            return None
    
    async def refresh_token(self, refresh_token: str) -> dict:
        """Refresh Supabase token."""
        if not self.supabase_client:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Supabase authentication is not configured. Please configure SUPABASE_URL and SUPABASE_ANON_KEY."
            )
        
        try:
            result = self.supabase_client.auth.refresh_session(refresh_token)
            
            if result.session:
                logger.info("Supabase token refreshed")
                return {
                    'access_token': result.session.access_token,
                    'refresh_token': result.session.refresh_token,
                    'token_type': 'bearer'
                }
            else:
                raise Exception("Token refresh failed")
                
        except Exception as e:
            logger.error(f"Supabase refresh error: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token refresh failed: {str(e)}"
            )


# Supabase auth service instance
supabase_auth_service = SupabaseAuthService()


async def get_current_supabase_user(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())
) -> dict:
    """Get current user using Supabase auth."""
    
    token = credentials.credentials
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No authentication token provided",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = await supabase_auth_service.get_user(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user


async def get_current_recruiter(
    current_user: dict = Depends(get_current_supabase_user)
) -> dict:
    """Dependency to ensure current user is a recruiter."""
    
    if current_user.get('role') != 'recruiter':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Recruiter access required"
        )
    
    return current_user


async def get_current_candidate(
    current_user: dict = Depends(get_current_supabase_user)
) -> dict:
    """Dependency to ensure current user is a candidate."""
    
    if current_user.get('role') != 'candidate':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Candidate access required"
        )
    
    return current_user
