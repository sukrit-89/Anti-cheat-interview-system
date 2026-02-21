"""
Celery tasks for session management.
Background processing for session lifecycle events.
"""
from app.workers.celery_app import celery_app
from app.workers.agent_tasks import trigger_all_agents
from app.core.logging import logger

@celery_app.task(name="handle_session_ended", bind=True)
def handle_session_ended(self, session_id: int) -> None:
    """
    Handle session end event.
    Triggers agent processing pipeline.
    """
    logger.info(f"Handling session end for session {session_id}")
    
    trigger_all_agents.delay(session_id)
    
    logger.info(f"Agent processing initiated for session {session_id}")

@celery_app.task(name="cleanup_old_sessions", bind=True)
def cleanup_old_sessions(self) -> None:
    """
    Periodic task to clean up old sessions.
    Runs daily to archive/delete old data.
    """
    import asyncio
    from datetime import datetime, timedelta
    from sqlalchemy import select
    from app.models.models import Session, SessionStatus
    from app.core.database import AsyncSessionLocal
    
    async def _cleanup():
        async with AsyncSessionLocal() as db:
            cutoff_date = datetime.utcnow() - timedelta(days=90)
            
            result = await db.execute(
                select(Session).where(
                    Session.created_at < cutoff_date,
                    Session.status == SessionStatus.COMPLETED
                )
            )
            old_sessions = result.scalars().all()
            
            logger.info(f"Found {len(old_sessions)} sessions to archive")
            
            for session in old_sessions:
                logger.info(f"Would archive session {session.id}")
    
    asyncio.run(_cleanup())
