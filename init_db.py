"""
Database initialization script.
Creates initial database schema and optional seed data.
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.database import init_db, AsyncSessionLocal
from app.core.config import settings
from app.core.logging import logger
from app.models.models import User, UserRole
from app.core.auth import AuthService


async def create_admin_user():
    """Create default admin user if not exists."""
    async with AsyncSessionLocal() as db:
        from sqlalchemy import select
        
        # Check if admin exists
        result = await db.execute(
            select(User).where(User.email == "admin@example.com")
        )
        existing_admin = result.scalar_one_or_none()
        
        if existing_admin:
            logger.info("Admin user already exists")
            return
        
        # Create admin user
        admin = User(
            email="admin@example.com",
            full_name="System Administrator",
            role=UserRole.ADMIN,
            hashed_password=AuthService.hash_password("admin123"),
            is_active=True
        )
        
        db.add(admin)
        await db.commit()
        
        logger.info("Admin user created: admin@example.com / admin123")
        logger.warning("CHANGE THE DEFAULT PASSWORD IN PRODUCTION!")


async def main():
    """Initialize database and create seed data."""
    logger.info("Initializing database...")
    
    # Create tables
    await init_db()
    
    # Create admin user if needed
    if settings.ENVIRONMENT != "production":
        await create_admin_user()
    
    logger.info("Database initialization complete!")


if __name__ == "__main__":
    asyncio.run(main())
