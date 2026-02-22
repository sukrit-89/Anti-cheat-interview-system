"""
Session management API endpoints.
Session lifecycle, join codes, room orchestration.
"""
import secrets
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.core.database import get_db
from app.core.auth import get_current_user, get_current_recruiter
from app.models.models import User, Session, Candidate, SessionStatus
from app.schemas.schemas import (
    SessionCreate,
    SessionUpdate,
    SessionResponse,
    SessionJoinRequest,
    SessionJoinResponse,
    CandidateResponse,
    RoomTokenResponse
)
from app.core.events import publish_session_created, publish_session_started
from app.services.livekit_service import LiveKitService
from app.core.logging import logger

router = APIRouter(prefix="/sessions", tags=["Sessions"])

def generate_session_code() -> str:
    """Generate unique 6-character session code."""
    return secrets.token_urlsafe(6)[:6].upper()

@router.post("", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    session_data: SessionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_recruiter)
) -> Session:
    """Create a new interview session (Recruiter only)."""
    
    session_code = generate_session_code()
    
    while True:
        result = await db.execute(
            select(Session).where(Session.session_code == session_code)
        )
        if result.scalar_one_or_none() is None:
            break
        session_code = generate_session_code()
    
    room_name = f"session-{session_code}-{int(datetime.utcnow().timestamp())}"
    
    livekit_service = LiveKitService()
    try:
        await livekit_service.create_room(
            room_name=room_name,
            max_participants=10,
            empty_timeout_seconds=300
        )
        logger.info(f"LiveKit room created: {room_name}")
    except Exception as e:
        logger.error(f"Failed to create LiveKit room {room_name}: {e}")
    
    new_session = Session(
        session_code=session_code,
        title=session_data.title,
        description=session_data.description,
        recruiter_id=current_user["id"],
        status=SessionStatus.SCHEDULED,
        scheduled_at=session_data.scheduled_at,
        room_name=room_name,
        metadata=session_data.metadata
    )
    
    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)
    
    logger.info(f"Session created: {new_session.id} by recruiter {current_user['id']}")
    
    await publish_session_created(
        session_id=new_session.id,
        data={
            "session_code": session_code,
            "recruiter_id": current_user["id"],
            "room_name": room_name
        }
    )
    
    return new_session

@router.post("/join", response_model=SessionJoinResponse)
async def join_session(
    join_data: SessionJoinRequest,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
) -> SessionJoinResponse:
    """Join a session using session code."""
    
    result = await db.execute(
        select(Session).where(Session.session_code == join_data.session_code)
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid session code"
        )
    
    if session.status == SessionStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session has already ended"
        )
    
    if session.status == SessionStatus.CANCELLED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session has been cancelled"
        )
    
    result = await db.execute(
        select(Candidate).where(
            and_(
                Candidate.session_id == session.id,
                Candidate.email == join_data.email
            )
        )
    )
    candidate = result.scalar_one_or_none()
    
    if not candidate:
        candidate = Candidate(
            session_id=session.id,
            user_id=current_user["id"],
            email=join_data.email,
            full_name=join_data.full_name,
            joined_at=datetime.utcnow(),
            is_present=True
        )
        db.add(candidate)
        await db.commit()
        await db.refresh(candidate)
        
        logger.info(f"Candidate {candidate.id} joined session {session.id}")
    else:
        candidate.joined_at = datetime.utcnow()
        candidate.is_present = True
        await db.commit()
    
    livekit_service = LiveKitService()
    room_token = livekit_service.generate_token(
        room_name=session.room_name,
        participant_identity=str(candidate.id),
        participant_name=candidate.full_name
    )
    
    return SessionJoinResponse(
        session=session,
        room_token=room_token,
        candidate_id=candidate.id
    )

@router.get("/{session_id}/token", response_model=RoomTokenResponse)
async def get_room_token(
    session_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
) -> RoomTokenResponse:
    """Get LiveKit room token for a session (for both recruiters and candidates)."""
    
    result = await db.execute(
        select(Session).where(Session.id == session_id)
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    from app.models.models import UserRole
    
    is_recruiter = (
        current_user.get("role") == UserRole.RECRUITER and 
        session.recruiter_id == current_user["id"]
    )
    
    is_candidate = False
    if not is_recruiter:
        result = await db.execute(
            select(Candidate).where(
                and_(
                    Candidate.session_id == session_id,
                    Candidate.user_id == current_user["id"]
                )
            )
        )
        is_candidate = result.scalar_one_or_none() is not None
    
    if not is_recruiter and not is_candidate:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this session"
        )
    
    livekit_service = LiveKitService()
    
    if is_recruiter:
        participant_name = f"Recruiter - {current_user.get('email', 'Unknown')}"
        participant_identity = f"recruiter-{current_user['id']}"
    else:
        participant_name = current_user.get("full_name", current_user.get("email", "Candidate"))
        participant_identity = f"candidate-{current_user['id']}"
    
    room_token = livekit_service.generate_token(
        room_name=session.room_name,
        participant_identity=participant_identity,
        participant_name=participant_name
    )
    
    logger.info(
        f"Generated room token for {participant_identity} in session {session_id}"
    )
    
    return RoomTokenResponse(
        room_token=room_token,
        room_name=session.room_name,
        participant_identity=participant_identity
    )

@router.get("", response_model=List[SessionResponse])
async def list_sessions(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
    status_filter: SessionStatus = None
) -> List[Session]:
    """List sessions for current user."""
    
    from app.models.models import UserRole
    
    if current_user.get("role") == UserRole.RECRUITER:
        query = select(Session).where(Session.recruiter_id == current_user["id"])
    else:
        query = (
            select(Session)
            .join(Candidate)
            .where(Candidate.user_id == current_user["id"])
        )
    
    if status_filter:
        query = query.where(Session.status == status_filter)
    
    query = query.order_by(Session.created_at.desc())
    
    result = await db.execute(query)
    sessions = result.scalars().all()
    
    return sessions

@router.get("/{session_id}", response_model=SessionResponse)
async def get_session(
    session_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
) -> Session:
    """Get session details."""
    
    result = await db.execute(select(Session).where(Session.id == session_id))
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    from app.models.models import UserRole
    
    if current_user.get("role") == UserRole.RECRUITER:
        if session.recruiter_id != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this session"
            )
    else:
        result = await db.execute(
            select(Candidate).where(
                and_(
                    Candidate.session_id == session_id,
                    Candidate.user_id == current_user["id"]
                )
            )
        )
        if not result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this session"
            )
    
    return session

@router.patch("/{session_id}", response_model=SessionResponse)
async def update_session(
    session_id: int,
    update_data: SessionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_recruiter)
) -> Session:
    """Update session (Recruiter only)."""
    
    result = await db.execute(select(Session).where(Session.id == session_id))
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    if session.recruiter_id != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this session"
        )
    
    update_dict = update_data.model_dump(exclude_unset=True)
    
    for field, value in update_dict.items():
        setattr(session, field, value)
    
    await db.commit()
    await db.refresh(session)
    
    logger.info(f"Session {session_id} updated by recruiter {current_user['id']}")
    
    return session

@router.post("/{session_id}/start", response_model=SessionResponse)
async def start_session(
    session_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_recruiter)
) -> Session:
    """Start a session (Recruiter only)."""
    
    result = await db.execute(select(Session).where(Session.id == session_id))
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    if session.recruiter_id != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to start this session"
        )
    
    if session.status == SessionStatus.LIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session is already live"
        )
    
    session.status = SessionStatus.LIVE
    session.started_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(session)
    
    logger.info(f"Session {session_id} started by recruiter {current_user['id']}")
    
    await publish_session_started(
        session_id=session.id,
        data={"started_at": session.started_at.isoformat()}
    )
    
    return session

@router.post("/{session_id}/end", response_model=SessionResponse)
async def end_session(
    session_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_recruiter)
) -> Session:
    """End a session (Recruiter only)."""
    
    result = await db.execute(select(Session).where(Session.id == session_id))
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    if session.recruiter_id != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to end this session"
        )
    
    if session.status == SessionStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session is already completed"
        )
    
    session.status = SessionStatus.COMPLETED
    session.ended_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(session)
    
    logger.info(f"Session {session_id} ended by recruiter {current_user['id']}")
    
    await publish_session_end_event(session_id, session)
    
    # Trigger agent processing pipeline via Celery
    from app.workers.session_tasks import handle_session_ended
    handle_session_ended.delay(session_id)
    logger.info(f"Agent processing triggered for session {session_id}")
    
    return session

@router.get("/{session_id}/candidates", response_model=List[CandidateResponse])
async def get_session_candidates(
    session_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_recruiter)
) -> List[Candidate]:
    """Get all candidates for a session (Recruiter only)."""
    
    result = await db.execute(select(Session).where(Session.id == session_id))
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    if session.recruiter_id != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view session candidates"
        )
    
    result = await db.execute(
        select(Candidate).where(Candidate.session_id == session_id)
    )
    candidates = result.scalars().all()
    
    return candidates

async def publish_session_end_event(session_id: int, session):
    """Publish event when session ends."""
    from app.core.events import publish_session_ended
    await publish_session_ended(
        session_id=session_id,
        data={"ended_at": session.ended_at.isoformat()}
    )
