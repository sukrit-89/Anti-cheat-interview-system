"""
LiveKit service for WebRTC room management.
Handles room creation, token generation, and participant management.
"""
from datetime import datetime, timedelta
from typing import Optional

from livekit import api

from app.core.config import settings
from app.core.logging import logger

class LiveKitService:
    """Service for LiveKit operations."""
    
    def __init__(self):
        self.api_key = settings.LIVEKIT_API_KEY
        self.api_secret = settings.LIVEKIT_API_SECRET
        self.ws_url = settings.LIVEKIT_WS_URL
    
    def generate_token(
        self,
        room_name: str,
        participant_identity: str,
        participant_name: str,
        can_publish: bool = True,
        can_subscribe: bool = True,
        valid_for_hours: int = 2
    ) -> str:
        """
        Generate LiveKit access token for a participant.
        
        Args:
            room_name: Name of the room
            participant_identity: Unique identifier for participant
            participant_name: Display name for participant
            can_publish: Whether participant can publish audio/video
            can_subscribe: Whether participant can subscribe to others
            valid_for_hours: Token validity duration
        
        Returns:
            JWT token string
        """
        token = api.AccessToken(self.api_key, self.api_secret)
        
        token.with_identity(participant_identity)
        token.with_name(participant_name)
        token.with_ttl(timedelta(hours=valid_for_hours))
        
        grants = api.VideoGrants(
            room_join=True,
            room=room_name,
            can_publish=can_publish,
            can_subscribe=can_subscribe,
            can_publish_data=True
        )
        token.with_grants(grants)
        
        jwt_token = token.to_jwt()
        
        logger.info(
            f"Generated LiveKit token for {participant_name} "
            f"(identity: {participant_identity}) in room {room_name}"
        )
        
        return jwt_token
    
    async def create_room(
        self,
        room_name: str,
        max_participants: int = 10,
        empty_timeout_seconds: int = 300
    ) -> dict:
        """
        Create a LiveKit room.
        
        Args:
            room_name: Unique room name
            max_participants: Maximum number of participants
            empty_timeout_seconds: Auto-close room after this many seconds empty
        
        Returns:
            Room information dict
        """
        try:
            room_service = api.RoomService()
            
            room = await room_service.create_room(
                api.CreateRoomRequest(
                    name=room_name,
                    max_participants=max_participants,
                    empty_timeout=empty_timeout_seconds
                )
            )
            
            logger.info(f"Created LiveKit room: {room_name}")
            
            return {
                "sid": room.sid,
                "name": room.name,
                "created_at": datetime.fromtimestamp(room.creation_time)
            }
            
        except Exception as e:
            logger.error(f"Failed to create LiveKit room: {e}")
            raise
    
    async def delete_room(self, room_name: str) -> None:
        """Delete a LiveKit room."""
        try:
            room_service = api.RoomService()
            await room_service.delete_room(api.DeleteRoomRequest(room=room_name))
            
            logger.info(f"Deleted LiveKit room: {room_name}")
            
        except Exception as e:
            logger.error(f"Failed to delete LiveKit room: {e}")
            raise
    
    async def list_participants(self, room_name: str) -> list:
        """List all participants in a room."""
        try:
            room_service = api.RoomService()
            participants = await room_service.list_participants(
                api.ListParticipantsRequest(room=room_name)
            )
            
            return [
                {
                    "identity": p.identity,
                    "name": p.name,
                    "joined_at": datetime.fromtimestamp(p.joined_at),
                    "is_publisher": p.permission.can_publish
                }
                for p in participants
            ]
            
        except Exception as e:
            logger.error(f"Failed to list participants: {e}")
            raise
