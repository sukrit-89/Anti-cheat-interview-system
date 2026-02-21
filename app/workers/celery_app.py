"""
Celery configuration and app instance.
"""
from celery import Celery

from app.core.config import settings
from app.core.logging import logger

celery_app = Celery(
    "interview_platform",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=[
        "app.workers.agent_tasks",
        "app.workers.session_tasks"
    ]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,
    task_soft_time_limit=3000,
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=100,
)

celery_app.conf.task_routes = {
    "app.workers.agent_tasks.*": {"queue": "agents"},
    "app.workers.session_tasks.*": {"queue": "sessions"},
}

logger.info("Celery app configured")
