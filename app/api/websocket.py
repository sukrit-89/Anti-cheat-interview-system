"""
WebSocket handlers for real-time session events.
"""
from typing import Dict
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.logging import logger
from app.models.models import Session
from app.core.redis import redis_client
from app.core.events import EventType, EventSubscriber

router = APIRouter()

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
    
    Streams:
    - Coding events
    - Speech transcriptions
    - Vision metrics
    - Session status changes
    """
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
    
    Provides aggregated real-time metrics:
    - Candidate presence
    - Activity levels
    - Preliminary scores
    """
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
