"""
Pytest configuration and shared fixtures.
"""
import asyncio
import uuid
import pytest
import pytest_asyncio
from typing import AsyncGenerator, Generator
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import NullPool

from app.main import app
from app.core.config import settings
from app.core.database import get_db, Base
from app.models.models import User, UserRole
from app.core.auth import AuthService


# Test database URL
TEST_DATABASE_URL = f"postgresql+asyncpg://interview_user:local_dev_password@localhost:5432/interview_test"


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def test_engine():
    """Create test database engine - recreate tables for each test function."""
    engine = create_async_engine(
        TEST_DATABASE_URL,
        poolclass=NullPool,
        echo=False
    )
    
    # Drop and recreate all tables for each test to ensure clean state
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    yield engine
    
    await engine.dispose()


@pytest_asyncio.fixture
async def db_session(test_engine) -> AsyncGenerator[AsyncSession, None]:
    """Create database session for tests."""
    async_session = async_sessionmaker(
        test_engine,
        class_=AsyncSession,
        expire_on_commit=False
    )
    
    async with async_session() as session:
        yield session


@pytest_asyncio.fixture
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Create test client with database override."""
    async def override_get_db():
        yield db_session
    
    app.dependency_overrides[get_db] = override_get_db
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    
    app.dependency_overrides.clear()


def _generate_unique_email(prefix: str) -> str:
    """Generate unique email for each test run."""
    return f"{prefix}_{uuid.uuid4().hex[:8]}@example.com"


@pytest_asyncio.fixture
async def test_user(db_session: AsyncSession) -> User:
    """Create test user (recruiter)."""
    user = User(
        email=_generate_unique_email("testuser"),
        hashed_password=AuthService.hash_password("testpass123"),
        full_name="Test User",
        role=UserRole.RECRUITER,
        is_active=True
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest_asyncio.fixture
async def test_admin(db_session: AsyncSession) -> User:
    """Create test admin user."""
    admin = User(
        email=_generate_unique_email("admin"),
        hashed_password=AuthService.hash_password("adminpass123"),
        full_name="Admin Test",
        role=UserRole.ADMIN,
        is_active=True
    )
    db_session.add(admin)
    await db_session.commit()
    await db_session.refresh(admin)
    return admin


@pytest_asyncio.fixture
async def test_candidate(db_session: AsyncSession) -> User:
    """Create test candidate user."""
    candidate = User(
        email=_generate_unique_email("candidate"),
        hashed_password=AuthService.hash_password("candidatepass123"),
        full_name="Test Candidate",
        role=UserRole.CANDIDATE,
        is_active=True
    )
    db_session.add(candidate)
    await db_session.commit()
    await db_session.refresh(candidate)
    return candidate


@pytest_asyncio.fixture
async def auth_headers(test_user: User) -> dict:
    """Create authorization headers for test user."""
    token = AuthService.create_access_token(test_user.id, test_user.email)
    return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture
async def admin_headers(test_admin: User) -> dict:
    """Create authorization headers for admin user."""
    token = AuthService.create_access_token(test_admin.id, test_admin.email)
    return {"Authorization": f"Bearer {token}"}
