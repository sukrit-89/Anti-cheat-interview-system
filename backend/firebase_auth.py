"""
Firebase Authentication Service for Satya Guard
Handles Firebase Admin SDK initialization and token verification
"""

import os
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from dotenv import load_dotenv

from backend.database import get_db
from backend import models

# Load environment variables
load_dotenv()

# Security scheme
security = HTTPBearer()

# Firebase initialization flag
_firebase_initialized = False


def initialize_firebase():
    """
    Initialize Firebase Admin SDK
    Should be called once at application startup
    """
    global _firebase_initialized
    
    if _firebase_initialized:
        return
    
    service_account_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH', './firebase-service-account.json')
    
    if not os.path.exists(service_account_path):
        raise FileNotFoundError(
            f"Firebase service account file not found at: {service_account_path}"
        )
    
    cred = credentials.Certificate(service_account_path)
    firebase_admin.initialize_app(cred)
    _firebase_initialized = True
    print("✅ Firebase Admin SDK initialized successfully")


def verify_firebase_token(token: str) -> dict:
    """
    Verify Firebase ID token and return decoded claims
    
    Args:
        token: Firebase ID token from frontend
        
    Returns:
        Decoded token claims containing user info
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token
    except firebase_auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except firebase_auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> models.User:
    """
    FastAPI dependency to get the current authenticated user from Firebase token
    
    Args:
        credentials: HTTP Authorization credentials
        db: Database session
        
    Returns:
        Current authenticated User object
        
    Raises:
        HTTPException: If authentication fails
    """
    token = credentials.credentials
    decoded_token = verify_firebase_token(token)
    
    firebase_uid = decoded_token.get("uid")
    if not firebase_uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing user ID",
        )
    
    # Find user in database by Firebase UID
    user = db.query(models.User).filter(
        models.User.firebase_uid == firebase_uid
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found in database. Please complete registration.",
        )
    
    return user


def require_role(allowed_roles: list):
    """
    Dependency factory to require specific user roles
    
    Args:
        allowed_roles: List of UserRole enums that are allowed
        
    Returns:
        Dependency function that checks user role
    """
    def role_checker(current_user: models.User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden. Required role: {[r.value for r in allowed_roles]}",
            )
        return current_user
    
    return role_checker


def get_firebase_user_by_email(email: str) -> Optional[dict]:
    """
    Get Firebase user by email
    
    Args:
        email: User email address
        
    Returns:
        Firebase user record or None if not found
    """
    try:
        user = firebase_auth.get_user_by_email(email)
        return {
            "uid": user.uid,
            "email": user.email,
            "display_name": user.display_name,
            "email_verified": user.email_verified
        }
    except firebase_auth.UserNotFoundError:
        return None
    except Exception as e:
        print(f"Error fetching Firebase user: {e}")
        return None
