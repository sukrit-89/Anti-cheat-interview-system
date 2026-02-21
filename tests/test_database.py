"""
Test database operations and models.
"""
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.models import User, Session, Candidate, UserRole, SessionStatus
from app.core.auth import AuthService

class TestDatabaseModels:
    """Test database models and relationships."""
    
    @pytest.mark.asyncio
    async def test_create_user(self, db_session: AsyncSession):
        """Test creating a user in database."""
        user = User(
            email="dbtest@example.com",
            hashed_password=AuthService.hash_password("password123"),
            full_name="DB Test User",
            role=UserRole.RECRUITER,
            is_active=True
        )
        
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)
        
        assert user.id is not None
        assert user.email == "dbtest@example.com"
        assert user.created_at is not None
    
    @pytest.mark.asyncio
    async def test_user_unique_email(self, db_session: AsyncSession):
        """Test that user email must be unique."""
        user1 = User(
            email="unique@example.com",
            hashed_password=AuthService.hash_password("password123"),
            full_name="User 1",
            role=UserRole.RECRUITER
        )
        db_session.add(user1)
        await db_session.commit()
        
        user2 = User(
            email="unique@example.com",
            hashed_password=AuthService.hash_password("password456"),
            full_name="User 2",
            role=UserRole.RECRUITER
        )
        db_session.add(user2)
        
        with pytest.raises(Exception):
            await db_session.commit()
    
    @pytest.mark.asyncio
    async def test_create_session(self, db_session: AsyncSession, test_user):
        """Test creating a session in database."""
        import uuid
        
        session = Session(
            session_code=f"TEST-{uuid.uuid4().hex[:6].upper()}",
            recruiter_id=test_user.id,
            title="Database Test Session",
            description="Testing session creation",
            status=SessionStatus.SCHEDULED,
            room_name=f"test-room-{uuid.uuid4().hex[:8]}"
        )
        
        db_session.add(session)
        await db_session.commit()
        await db_session.refresh(session)
        
        assert session.id is not None
        assert session.recruiter_id == test_user.id
        assert session.status == SessionStatus.SCHEDULED
    
    @pytest.mark.asyncio
    async def test_session_recruiter_relationship(self, db_session: AsyncSession, test_user):
        """Test session-recruiter relationship."""
        import uuid
        
        session = Session(
            session_code=f"TEST-{uuid.uuid4().hex[:6].upper()}",
            recruiter_id=test_user.id,
            title="Relationship Test",
            status=SessionStatus.SCHEDULED,
            room_name=f"test-room-{uuid.uuid4().hex[:8]}"
        )
        
        db_session.add(session)
        await db_session.commit()
        await db_session.refresh(session)
        
        stmt = select(Session).where(Session.id == session.id)
        result = await db_session.execute(stmt)
        loaded_session = result.scalar_one()
        
        await db_session.refresh(loaded_session, ["recruiter"])
        assert loaded_session.recruiter.id == test_user.id
        assert loaded_session.recruiter.email == test_user.email
    
    @pytest.mark.asyncio
    async def test_create_candidate(self, db_session: AsyncSession, test_user):
        """Test creating a candidate."""
        import uuid
        
        session = Session(
            session_code=f"TEST-{uuid.uuid4().hex[:6].upper()}",
            recruiter_id=test_user.id,
            title="Candidate Test Session",
            status=SessionStatus.SCHEDULED,
            room_name=f"test-room-{uuid.uuid4().hex[:8]}"
        )
        db_session.add(session)
        await db_session.commit()
        await db_session.refresh(session)
        
        candidate = Candidate(
            session_id=session.id,
            full_name="Test Candidate",
            email=f"candidate_{uuid.uuid4().hex[:6]}@example.com"
        )
        
        db_session.add(candidate)
        await db_session.commit()
        await db_session.refresh(candidate)
        
        assert candidate.id is not None
        assert candidate.session_id == session.id
        assert candidate.full_name == "Test Candidate"
    
    @pytest.mark.asyncio
    async def test_session_cascade_delete(self, db_session: AsyncSession, test_user):
        """Test that deleting session cascades to candidates."""
        import uuid
        
        session = Session(
            session_code=f"TEST-{uuid.uuid4().hex[:6].upper()}",
            recruiter_id=test_user.id,
            title="Cascade Test",
            status=SessionStatus.SCHEDULED,
            room_name=f"test-room-{uuid.uuid4().hex[:8]}"
        )
        db_session.add(session)
        await db_session.commit()
        await db_session.refresh(session)
        
        candidate = Candidate(
            session_id=session.id,
            full_name="Cascade Test Candidate",
            email=f"cascade_{uuid.uuid4().hex[:6]}@example.com"
        )
        db_session.add(candidate)
        await db_session.commit()
        
        candidate_id = candidate.id
        
        await db_session.delete(session)
        await db_session.commit()
        
        stmt = select(Candidate).where(Candidate.id == candidate_id)
        result = await db_session.execute(stmt)
        assert result.scalar_one_or_none() is None
    
    @pytest.mark.asyncio
    async def test_user_sessions_relationship(self, db_session: AsyncSession, test_user):
        """Test user can have multiple sessions."""
        import uuid
        
        for i in range(3):
            session = Session(
                session_code=f"TEST-{uuid.uuid4().hex[:6].upper()}",
                recruiter_id=test_user.id,
                title=f"Session {i}",
                status=SessionStatus.SCHEDULED,
                room_name=f"test-room-{uuid.uuid4().hex[:8]}"
            )
            db_session.add(session)
        
        await db_session.commit()
        
        stmt = select(Session).where(Session.recruiter_id == test_user.id)
        result = await db_session.execute(stmt)
        sessions = result.scalars().all()
        
        assert len(sessions) == 3
    
    @pytest.mark.asyncio
    async def test_session_status_enum(self, db_session: AsyncSession, test_user):
        """Test session status enum values."""
        import uuid
        
        statuses = [
            SessionStatus.SCHEDULED,
            SessionStatus.LIVE,
            SessionStatus.COMPLETED,
            SessionStatus.CANCELLED,
            SessionStatus.FAILED
        ]
        
        for status in statuses:
            session = Session(
                session_code=f"TEST-{uuid.uuid4().hex[:6].upper()}",
                recruiter_id=test_user.id,
                title=f"Status Test {status.value}",
                status=status,
                room_name=f"test-room-{uuid.uuid4().hex[:8]}"
            )
            db_session.add(session)
        
        await db_session.commit()
        
        stmt = select(Session).where(Session.recruiter_id == test_user.id)
        result = await db_session.execute(stmt)
        sessions = result.scalars().all()
        
        assert len(sessions) == len(statuses)
        session_statuses = [s.status for s in sessions]
        assert all(status in session_statuses for status in statuses)
