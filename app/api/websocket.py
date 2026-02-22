"""
WebSocket handlers for real-time session events.
Authenticated via token query parameter.
"""
from typing import Dict, Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.core.database import get_db, AsyncSessionLocal
from app.core.logging import logger
from app.models.models import Session, Candidate
from app.core.redis import redis_client
from app.core.events import EventType, EventSubscriber

router = APIRouter()

async def authenticate_websocket(websocket: WebSocket, session_id: int) -> Optional[dict]:
    """
    Authenticate WebSocket connection using token query parameter.
    Returns user dict or None if authentication fails.
    """
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=4001, reason="Missing authentication token")
        return None

    try:
        from app.core.config import settings
        if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY:
            from supabase import create_client
            supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
            user_response = supabase.auth.get_user(token)
            if not user_response or not user_response.user:
                await websocket.close(code=4003, reason="Invalid token")
                return None
            user = user_response.user
            return {
                "id": user.id,
                "email": user.email,
                "role": user.user_metadata.get("role", "candidate"),
            }
        else:
            await websocket.close(code=4003, reason="Auth service unavailable")
            return None
    except Exception as e:
        logger.error(f"WebSocket auth failed: {e}")
        await websocket.close(code=4003, reason="Authentication failed")
        return None

async def verify_session_membership(user: dict, session_id: int) -> bool:
    """Verify the authenticated user belongs to this session."""
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Session).where(Session.id == session_id)
        )
        session = result.scalar_one_or_none()
        if not session:
            return False

        if user.get("role") == "recruiter" and str(session.recruiter_id) == str(user["id"]):
            return True

        result = await db.execute(
            select(Candidate).where(
                and_(
                    Candidate.session_id == session_id,
                    Candidate.user_id == str(user["id"])
                )
            )
        )
        if result.scalar_one_or_none():
            return True

    return False

class ConnectionManager:
    """Manages WebSocket connections for real-time updates."""
    
    def __init__(self):
        self.active_connections: Dict[int, list[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, session_id: int):
        """Accept WebSocket connection and add to session room."""
        await websocket.accept()
        
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        
        self.active_connections[session_id].append(websocket)
        logger.info(f"WebSocket connected to session {session_id}")
    
    def disconnect(self, websocket: WebSocket, session_id: int):
        """Remove WebSocket connection."""
        if session_id in self.active_connections:
            if websocket in self.active_connections[session_id]:
                self.active_connections[session_id].remove(websocket)
            
            if not self.active_connections[session_id]:
                del self.active_connections[session_id]
        
        logger.info(f"WebSocket disconnected from session {session_id}")
    
    async def send_to_session(self, session_id: int, message: dict):
        """Send message to all connections in a session."""
        if session_id in self.active_connections:
            disconnected = []
            
            for connection in self.active_connections[session_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error sending message: {e}")
                    disconnected.append(connection)
            
            for conn in disconnected:
                self.disconnect(conn, session_id)
    
    async def broadcast(self, message: dict):
        """Broadcast message to all active connections."""
        for session_id in self.active_connections:
            await self.send_to_session(session_id, message)

manager = ConnectionManager()

@router.websocket("/ws/session/{session_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    session_id: int
):
    """
    WebSocket endpoint for real-time session updates.
    Requires ?token=<supabase_access_token> query parameter.
    """
    user = await authenticate_websocket(websocket, session_id)
    if not user:
        return

    if not await verify_session_membership(user, session_id):
        await websocket.close(code=4003, reason="Not authorized for this session")
        return

    await manager.connect(websocket, session_id)
    
    try:
        subscriber = EventSubscriber([
            EventType.CODE_CHANGED,
            EventType.CODE_EXECUTED,
            EventType.SPEECH_TRANSCRIBED,
            EventType.VISION_METRIC_CAPTURED,
            EventType.SESSION_ENDED
        ])
        
        await subscriber.subscribe()
        
        async for event in subscriber.listen():
            if event.session_id == session_id:
                await websocket.send_json({
                    "type": event.event_type.value,
                    "timestamp": event.timestamp.isoformat(),
                    "data": event.data
                })
        
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
        logger.info(f"Client disconnected from session {session_id}")
    
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket, session_id)

@router.websocket("/ws/live/{session_id}")
async def live_monitoring_endpoint(
    websocket: WebSocket,
    session_id: int
):
    """
    WebSocket endpoint for recruiter live monitoring dashboard.
    Requires ?token=<supabase_access_token> query parameter.
    Only accessible to the session's recruiter.
    """
    user = await authenticate_websocket(websocket, session_id)
    if not user:
        return

    if user.get("role") != "recruiter":
        await websocket.close(code=4003, reason="Recruiter access required")
        return

    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Session).where(Session.id == session_id)
        )
        session = result.scalar_one_or_none()
        if not session or str(session.recruiter_id) != str(user["id"]):
            await websocket.close(code=4003, reason="Not authorized for this session")
            return

    await manager.connect(websocket, session_id)
    
    try:
        while True:
            data = await websocket.receive_json()
            
            if data.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
            
            elif data.get("type") == "request_metrics":
                import asyncio
                from app.services.metrics_service import MetricsService
                
                metrics = await MetricsService.get_live_metrics(session_id)
                await websocket.send_json({
                    "type": "metrics_update",
                    "data": metrics
                })
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
    
    except Exception as e:
        logger.error(f"Live monitoring WebSocket error: {e}")
        manager.disconnect(websocket, session_id)
