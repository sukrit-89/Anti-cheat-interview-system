"""
Speech API endpoints.
Handle audio transcription and speech analysis.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.models import User, Session
from app.services.speech_service import speech_service
from app.core.logging import logger
from app.core.events import EventPublisher, Event, EventType

router = APIRouter(prefix="/speech", tags=["Speech"])


@router.post("/transcribe")
async def transcribe_audio(
    session_id: int = Form(...),
    audio: UploadFile = File(...),
    language: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Transcribe audio from interview.
    
    Accepts audio file upload and returns transcription.
    """
    
    # Verify session exists
    result = await db.execute(
        select(Session).where(Session.id == session_id)
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Read audio file
    try:
        audio_bytes = await audio.read()
    except Exception as e:
        logger.error(f"Failed to read audio file: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid audio file"
        )
    
    # Transcribe audio
    transcription_result = await speech_service.transcribe_audio(
        audio_file=audio_bytes,
        language=language
    )
    
    if not transcription_result["success"]:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=transcription_result.get("error", "Transcription failed")
        )
    
    # Publish speech event
    event = Event(
        event_type=EventType.SPEECH_TRANSCRIBED,
        session_id=session_id,
        data={
            "text": transcription_result["text"],
            "confidence": transcription_result["confidence"],
            "language": transcription_result.get("language")
        }
    )
    await EventPublisher.publish(event)
    
    logger.info(f"Audio transcribed for session {session_id}: {len(transcription_result['text'])} chars")
    
    return {
        "success": True,
        "text": transcription_result["text"],
        "confidence": transcription_result["confidence"],
        "language": transcription_result.get("language")
    }


@router.post("/analyze")
async def analyze_speech(
    session_id: int = Form(...),
    transcription: str = Form(...),
    duration: float = Form(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Analyze speech quality metrics.
    
    Args:
        session_id: Interview session ID
        transcription: Transcribed text
        duration: Audio duration in seconds
    """
    
    # Verify session exists
    result = await db.execute(
        select(Session).where(Session.id == session_id)
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Analyze speech quality
    analysis = await speech_service.analyze_speech_quality(
        transcription=transcription,
        audio_duration=duration
    )
    
    logger.info(
        f"Speech analyzed for session {session_id}: "
        f"Clarity={analysis['clarity_score']}, WPM={analysis['words_per_minute']}"
    )
    
    return {
        "success": True,
        **analysis
    }


@router.get("/status")
async def get_speech_status() -> dict:
    """Get speech service configuration status."""
    
    from app.core.config import settings
    
    status_info = {
        "configured": False,
        "service": "none",
        "model": None
    }
    
    if settings.USE_LOCAL_WHISPER:
        try:
            import whisper
            status_info["configured"] = True
            status_info["service"] = "whisper-local"
            status_info["model"] = settings.WHISPER_MODEL
        except ImportError:
            status_info["service"] = "whisper-local (not installed)"
    
    elif settings.OPENAI_API_KEY:
        status_info["configured"] = True
        status_info["service"] = "openai-whisper"
        status_info["model"] = "whisper-1"
    
    return status_info
