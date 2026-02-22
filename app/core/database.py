"""
Database connection and session management.
Async SQLAlchemy with proper lifecycle handling.
"""
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    create_async_engine,
    async_sessionmaker,
)
from sqlalchemy.orm import declarative_base
from sqlalchemy.pool import NullPool

from app.core.config import settings
from app.core.logging import logger

Base = declarative_base()

def get_database_url() -> str:
    """Get the database connection URL.
    
    Handles various DATABASE_URL formats from cloud providers
    (Railway, Supabase, Heroku) and converts them to asyncpg format.
    """
    import os
    db_url = os.getenv("DATABASE_URL")
    if db_url:
        # Convert postgres:// or postgresql:// to postgresql+asyncpg://
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif db_url.startswith("postgresql://"):
            db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif not db_url.startswith("postgresql+asyncpg://"):
            db_url = f"postgresql+asyncpg://{db_url}"
        return db_url
    
    postgres_user = os.getenv("POSTGRES_USER", "interview_user")
    postgres_password = os.getenv("POSTGRES_PASSWORD", "changeme")
    postgres_host = os.getenv("POSTGRES_HOST", "postgres")
    postgres_port = os.getenv("POSTGRES_PORT", "5432")
    postgres_db = os.getenv("POSTGRES_DB", "interview_platform")
    
    return f"postgresql+asyncpg://{postgres_user}:{postgres_password}@{postgres_host}:{postgres_port}/{postgres_db}"

engine = create_async_engine(
    get_database_url(),
    echo=settings.DEBUG,
    future=True,
    poolclass=NullPool if settings.ENVIRONMENT == "test" else None,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for getting database sessions.
    Properly handles session lifecycle and cleanup.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()
            logger.error(f"Database session error: {e}")
            raise
        finally:
            await session.close()

async def init_db() -> None:
    """Initialize database tables.
    
    Non-fatal: if the database is unreachable the app still starts
    in a degraded state so the health-check endpoint can report the
    issue instead of crashing the whole process.
    """
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database initialized")
    except Exception as e:
        logger.error(f"Database initialization failed (app will start degraded): {e}")
        logger.error(
            "Hint: Set DATABASE_URL to your Supabase *direct* connection string "
            "(Session mode, port 5432). Pooler / Transaction mode often causes "
            "'Tenant or user not found' errors with asyncpg."
        )

async def close_db() -> None:
    """Close database connections."""
    await engine.dispose()
    logger.info("Database connections closed")
