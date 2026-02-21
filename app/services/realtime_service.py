"""
Real-time Service using Supabase Realtime.
Handles live updates for interviews and coding sessions.
"""
import asyncio
import json
from datetime import datetime
from typing import Dict, Any, Callable, Optional

try:
    from app.services.supabase_service import supabase_service
    from app.core.config import settings
    SUPABASE_REALTIME_AVAILABLE = True
except ImportError:
    SUPABASE_REALTIME_AVAILABLE = False

from app.core.logging import logger

class RealtimeService:
    """Real-time service for live interview updates."""
    
    def __init__(self):
        self.active_subscriptions = {}
        self.use_supabase = settings.USE_SUPABASE and SUPABASE_REALTIME_AVAILABLE
        
        if self.use_supabase:
            logger.info("Supabase Realtime initialized")
        else:
            logger.info("Using Redis for real-time features")
    
    async def subscribe_to_session(self, session_id: int, callback: Callable) -> bool:
        """Subscribe to session updates."""
        
        if not self.use_supabase:
            return await self._redis_subscribe_session(session_id, callback)
        
        try:
            subscription = await supabase_service.subscribe_to_session(session_id, callback)
            if subscription:
                self.active_subscriptions[f"session_{session_id}"] = subscription
                logger.info(f"Subscribed to session {session_id} updates")
                return True
            return False
        except Exception as e:
            logger.error(f"Session subscription error: {e}")
            return False
    
    async def subscribe_to_coding_events(self, session_id: int, callback: Callable) -> bool:
        """Subscribe to coding events for a session."""
        
        if not self.use_supabase:
            return await self._redis_subscribe_coding(session_id, callback)
        
        try:
            subscription = await supabase_service.subscribe_to_coding_events(session_id, callback)
            if subscription:
                self.active_subscriptions[f"coding_{session_id}"] = subscription
                logger.info(f"Subscribed to coding events for session {session_id}")
                return True
            return False
        except Exception as e:
            logger.error(f"Coding events subscription error: {e}")
            return False
    
    async def broadcast_session_update(self, session_id: int, update_data: Dict[str, Any]) -> bool:
        """Broadcast session update to all connected clients."""
        
        if not self.use_supabase:
            return await self._redis_broadcast_session(session_id, update_data)
        
        try:
            await supabase_service.update_session(session_id, update_data)
            logger.info(f"Broadcasted session update for {session_id}")
            return True
        except Exception as e:
            logger.error(f"Session broadcast error: {e}")
            return False
    
    async def broadcast_coding_event(self, session_id: int, event_data: Dict[str, Any]) -> bool:
        """Broadcast coding event to all connected clients."""
        
        if not self.use_supabase:
            return await self._redis_broadcast_coding(session_id, event_data)
        
        try:
            from app.models.models import CodingEvent
            event_data['created_at'] = datetime.utcnow().isoformat()
            logger.info(f"Created coding event for session {session_id}")
            return True
        except Exception as e:
            logger.error(f"Coding event broadcast error: {e}")
            return False
    
    async def unsubscribe_from_session(self, session_id: int) -> bool:
        """Unsubscribe from session updates."""
        
        subscription_key = f"session_{session_id}"
        if subscription_key in self.active_subscriptions:
            subscription = self.active_subscriptions[subscription_key]
            
            if hasattr(subscription, 'unsubscribe'):
                try:
                    await subscription.unsubscribe()
                    del self.active_subscriptions[subscription_key]
                    logger.info(f"Unsubscribed from session {session_id}")
                    return True
                except Exception as e:
                    logger.error(f"Unsubscribe error: {e}")
                    return False
            else:
                del self.active_subscriptions[subscription_key]
                return True
        
        return False
    
    async def _redis_subscribe_session(self, session_id: int, callback: Callable) -> bool:
        """Fallback Redis subscription for session updates."""
        try:
            from app.core.redis import redis_client
            
            pubsub = redis_client.pubsub()
            await pubsub.subscribe(f"session:{session_id}")
            
            asyncio.create_task(self._redis_listener(pubsub, callback))
            logger.info(f"Redis subscribed to session {session_id}")
            return True
        except Exception as e:
            logger.error(f"Redis session subscription error: {e}")
            return False
    
    async def _redis_subscribe_coding(self, session_id: int, callback: Callable) -> bool:
        """Fallback Redis subscription for coding events."""
        try:
            from app.core.redis import redis_client
            
            pubsub = redis_client.pubsub()
            await pubsub.subscribe(f"coding:{session_id}")
            
            asyncio.create_task(self._redis_listener(pubsub, callback))
            logger.info(f"Redis subscribed to coding events for session {session_id}")
            return True
        except Exception as e:
            logger.error(f"Redis coding subscription error: {e}")
            return False
    
    async def _redis_broadcast_session(self, session_id: int, update_data: Dict[str, Any]) -> bool:
        """Fallback Redis broadcast for session updates."""
        try:
            from app.core.redis import redis_client
            
            message = json.dumps({
                'type': 'session_update',
                'session_id': session_id,
                'data': update_data
            })
            
            await redis_client.publish(f"session:{session_id}", message)
            return True
        except Exception as e:
            logger.error(f"Redis session broadcast error: {e}")
            return False
    
    async def _redis_broadcast_coding(self, session_id: int, event_data: Dict[str, Any]) -> bool:
        """Fallback Redis broadcast for coding events."""
        try:
            from app.core.redis import redis_client
            
            message = json.dumps({
                'type': 'coding_event',
                'session_id': session_id,
                'data': event_data
            })
            
            await redis_client.publish(f"coding:{session_id}", message)
            return True
        except Exception as e:
            logger.error(f"Redis coding broadcast error: {e}")
            return False
    
    async def _redis_listener(self, pubsub, callback: Callable):
        """Redis message listener."""
        while True:
            try:
                message = await pubsub.get_message(timeout=1.0)
                if message and message['type'] == 'message':
                    data = json.loads(message['data'])
                    await callback(data)
            except Exception as e:
                logger.error(f"Redis listener error: {e}")
                await asyncio.sleep(1)
    
    async def cleanup(self):
        """Clean up all active subscriptions."""
        for subscription_key, subscription in self.active_subscriptions.items():
            try:
                if hasattr(subscription, 'unsubscribe'):
                    await subscription.unsubscribe()
                logger.info(f"Cleaned up subscription: {subscription_key}")
            except Exception as e:
                logger.error(f"Cleanup error for {subscription_key}: {e}")
        
        self.active_subscriptions.clear()

realtime_service = RealtimeService()
