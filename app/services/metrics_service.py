"""
Metrics service for real-time session monitoring.
"""
from typing import Any
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import CodingEvent, SpeechSegment, VisionMetric, Candidate
from app.core.database import AsyncSessionLocal
from app.core.logging import logger

class MetricsService:
    """Service for calculating real-time session metrics."""
    
    @staticmethod
    async def get_live_metrics(session_id: int) -> dict[str, Any]:
        """
        Get live metrics for a session.
        
        Returns aggregated metrics for recruiter dashboard.
        """
        async with AsyncSessionLocal() as db:
            candidate_result = await db.execute(
                select(Candidate).where(Candidate.session_id == session_id)
            )
            candidates = candidate_result.scalars().all()
            
            coding_result = await db.execute(
                select(func.count(CodingEvent.id))
                .where(CodingEvent.session_id == session_id)
            )
            coding_events_count = coding_result.scalar() or 0
            
            speech_result = await db.execute(
                select(
                    func.count(SpeechSegment.id),
                    func.sum(SpeechSegment.duration)
                )
                .where(SpeechSegment.session_id == session_id)
            )
            speech_data = speech_result.one()
            speech_segments_count = speech_data[0] or 0
            total_speech_duration = speech_data[1] or 0
            
            vision_result = await db.execute(
                select(func.count(VisionMetric.id))
                .where(VisionMetric.session_id == session_id)
            )
            vision_metrics_count = vision_result.scalar() or 0
            
            return {
                "session_id": session_id,
                "candidates": {
                    "total": len(candidates),
                    "present": sum(1 for c in candidates if c.is_present)
                },
                "activity": {
                    "coding_events": coding_events_count,
                    "speech_segments": speech_segments_count,
                    "speech_duration_seconds": float(total_speech_duration),
                    "vision_samples": vision_metrics_count
                },
                "status": "active" if coding_events_count > 0 or speech_segments_count > 0 else "idle"
            }
