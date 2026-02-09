"""
Supabase Authentication Service.
Production-ready auth using Supabase only.
"""
from typing import Optional

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
    
    def __init__(self):
        if not SUPABASE_AUTH_AVAILABLE:
            raise Exception("Supabase not installed. Install with: pip install supabase")
            
        self.supabase_client = create_client(
            supabase_url=settings.SUPABASE_URL,
            supabase_key=settings.SUPABASE_ANON_KEY
        )
        logger.info("Supabase Auth initialized")
    
    async def sign_up(self, email: str, password: str, full_name: str, role: str) -> dict:
        """Register user with Supabase."""
        try:
            result = self.supabase_client.auth.sign_up({
                'email': email,
                'password': password,
                'options': {
                    'data': {
                        'full_name': full_name,
                        'role': role
                    }
                }
            })
            
            if result.user:
                # Create user record in database
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
                
                return {
                    'user': result.user,
                    'session': result.session
                }
            else:
                raise Exception("Registration failed")
                
        except Exception as e:
            logger.error(f"Supabase registration error: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Registration failed: {str(e)}"
            )
    
    async def sign_in(self, email: str, password: str) -> dict:
        """Sign in with Supabase."""
        try:
            result = self.supabase_client.auth.sign_in_with_password({
                'email': email,
                'password': password
            })
            
            if result.user and result.session:
                logger.info(f"Supabase user signed in: {email}")
                
                return {
                    'user': result.user,
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
        try:
            self.supabase_client.auth.sign_out()
            logger.info("Supabase user signed out")
        except Exception as e:
            logger.error(f"Supabase sign out error: {e}")
    
    async def get_user(self, access_token: str) -> Optional[dict]:
        """Get user from Supabase."""
        try:
            self.supabase_client.auth.set_session(access_token)
            user = self.supabase_client.auth.get_user()
            
            if user:
                # Get additional user data from database
                user_data = await supabase_service.get_user_by_email(user.email)
                if user_data:
                    user.update(user_data)
                
                return user
            return None
            
        except Exception as e:
            logger.error(f"Supabase get user error: {e}")
            return None
    
    async def refresh_token(self, refresh_token: str) -> dict:
        """Refresh Supabase token."""
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
