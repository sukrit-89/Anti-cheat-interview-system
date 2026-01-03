"""
Helper functions for generating unique join codes
"""
import random
import string
from sqlalchemy.orm import Session
from backend import models


def generate_join_code(length: int = 6) -> str:
    """
    Generate a random alphanumeric join code
    
    Args:
        length: Length of the join code (default: 6)
        
    Returns:
        Random alphanumeric string
    """
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choice(characters) for _ in range(length))


def generate_unique_join_code(db: Session, length: int = 6, max_attempts: int = 10) -> str:
    """
    Generate a unique join code that doesn't exist in the database
    
    Args:
        db: Database session
        length: Length of the join code
        max_attempts: Maximum number of generation attempts
        
    Returns:
        Unique join code
        
    Raises:
        ValueError: If unable to generate unique code after max_attempts
    """
    for _ in range(max_attempts):
        code = generate_join_code(length)
        existing = db.query(models.Session).filter(models.Session.join_code == code).first()
        if not existing:
            return code
    
    raise ValueError("Unable to generate unique join code after multiple attempts")
