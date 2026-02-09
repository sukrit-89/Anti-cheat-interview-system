"""
Coding events API endpoints.
Track and execute code during interviews.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.models import User, CodingEvent, Session
from app.schemas.schemas import CodingEventCreate, CodingEventResponse
from app.core.logging import logger
from app.core.events import publish_code_changed, publish_code_executed

router = APIRouter(prefix="/coding-events", tags=["Coding"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_coding_event(
    event_data: CodingEventCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Create a coding event (keystroke, execution, etc.)"""
    
    # Verify session exists
    result = await db.execute(
        select(Session).where(Session.id == event_data.session_id)
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Create event
    new_event = CodingEvent(
        session_id=event_data.session_id,
        event_type=event_data.event_type,
        code_snapshot=event_data.code_snapshot,
        language=event_data.language,
        execution_output=event_data.execution_output,
        execution_error=event_data.execution_error,
        metadata=event_data.metadata or {}
    )
    
    db.add(new_event)
    await db.commit()
    await db.refresh(new_event)
    
    logger.info(
        f"Coding event created: {new_event.event_type} "
        f"for session {event_data.session_id}"
    )
    
    # Publish event
    if event_data.event_type == "execute":
        await publish_code_executed(
            session_id=event_data.session_id,
            data={
                "language": event_data.language,
                "code": event_data.code_snapshot,
                "output": event_data.execution_output,
                "error": event_data.execution_error
            }
        )
    else:
        await publish_code_changed(
            session_id=event_data.session_id,
            data={
                "language": event_data.language,
                "code": event_data.code_snapshot
            }
        )
    
    return {"success": True, "event_id": new_event.id}


@router.post("/execute")
async def execute_code(
    event_data: CodingEventCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """
    Execute code in a sandbox using Judge0.
    Falls back to rule-based analysis if Judge0 not configured.
    """
    
    # Verify session exists
    result = await db.execute(
        select(Session).where(Session.id == event_data.session_id)
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Execute code using Judge0 service
    from app.services.judge0_service import judge0_service
    
    execution_result = await judge0_service.execute_code(
        code=event_data.code_snapshot,
        language=event_data.language,
        stdin=event_data.metadata.get("stdin") if event_data.metadata else None
    )
    
    output = execution_result.get("output")
    error = execution_result.get("error")
    
    # Track the execution event
    execution_event = CodingEvent(
        session_id=event_data.session_id,
        event_type="execute",
        code_snapshot=event_data.code_snapshot,
        language=event_data.language,
        execution_output=output,
        execution_error=error,
        metadata={
            **(event_data.metadata or {}),
            "execution_time": execution_result.get("time"),
            "memory_used": execution_result.get("memory"),
            "status": execution_result.get("status")
        }
    )
    
    db.add(execution_event)
    await db.commit()
    
    # Publish execution event
    await publish_code_executed(
        session_id=event_data.session_id,
        data={
            "language": event_data.language,
            "code": event_data.code_snapshot,
            "output": output,
            "error": error,
            "status": execution_result.get("status")
        }
    )
    
    return {
        "success": execution_result.get("success", False),
        "output": output,
        "error": error,
        "time": execution_result.get("time"),
        "memory": execution_result.get("memory"),
        "status": execution_result.get("status")
    }


@router.get("/{session_id}")
async def get_coding_events(
    session_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[CodingEventResponse]:
    """Get all coding events for a session."""
    
    result = await db.execute(
        select(CodingEvent)
        .where(CodingEvent.session_id == session_id)
        .order_by(CodingEvent.timestamp)
    )
    events = result.scalars().all()
    
    return events
