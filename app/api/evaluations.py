"""
Evaluations API endpoints.
Retrieve evaluation results and trigger agent processing.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.models import Evaluation, Session, Candidate
from app.core.logging import logger

router = APIRouter(prefix="/evaluations", tags=["Evaluations"])


async def _verify_session_access(session_id: int, current_user: dict, db: AsyncSession) -> Session:
    """Verify user has access to the session's evaluation (recruiter or enrolled candidate)."""
    result = await db.execute(select(Session).where(Session.id == session_id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")

    user_id = current_user.get("id") or current_user.get("sub")
    role = current_user.get("role", "candidate")

    if role == "recruiter":
        if str(session.recruiter_id) != str(user_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorised for this session")
    else:
        candidate = await db.execute(
            select(Candidate).where(
                and_(Candidate.session_id == session_id, Candidate.user_id == str(user_id))
            )
        )
        if not candidate.scalar_one_or_none():
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enrolled in this session")

    return session


@router.get("/{session_id}")
async def get_evaluation(
    session_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
) -> dict:
    """Get the evaluation result for a session."""
    await _verify_session_access(session_id, current_user, db)

    result = await db.execute(
        select(Evaluation).where(Evaluation.session_id == session_id)
    )
    evaluation = result.scalar_one_or_none()

    if not evaluation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evaluation not found for this session"
        )

    return {
        "id": evaluation.id,
        "session_id": evaluation.session_id,
        "overall_score": evaluation.overall_score,
        "coding_score": evaluation.coding_score,
        "communication_score": evaluation.communication_score,
        "engagement_score": evaluation.engagement_score,
        "reasoning_score": evaluation.reasoning_score,
        "recommendation": evaluation.recommendation,
        "confidence_level": evaluation.confidence_level,
        "strengths": evaluation.strengths or [],
        "weaknesses": evaluation.weaknesses or [],
        "key_findings": evaluation.key_findings or [],
        "summary": evaluation.summary,
        "detailed_report": evaluation.detailed_report,
        "evaluated_at": evaluation.evaluated_at.isoformat() if evaluation.evaluated_at else None,
    }


@router.post("/{session_id}/trigger")
async def trigger_evaluation(
    session_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Trigger agent processing and evaluation for a session.
    Only the session recruiter can trigger evaluation.
    """
    session = await _verify_session_access(session_id, current_user, db)

    role = current_user.get("role", "candidate")
    if role != "recruiter":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can trigger evaluations"
        )

    existing = await db.execute(
        select(Evaluation).where(Evaluation.session_id == session_id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Evaluation already exists for this session"
        )

    try:
        from app.workers.agent_tasks import trigger_all_agents
        trigger_all_agents.delay(session_id)
        logger.info(f"Evaluation triggered for session {session_id}")
    except Exception as e:
        logger.error(f"Failed to trigger evaluation for session {session_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to trigger evaluation pipeline"
        )

    return {"status": "processing", "session_id": session_id}
