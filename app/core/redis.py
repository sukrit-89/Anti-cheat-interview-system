"""
Redis client for caching and pub/sub.
Event-driven communication between services.
"""
import json
from typing import Any, Optional
from redis.asyncio import Redis, ConnectionPool

from app.core.config import settings
from app.core.logging import logger

class RedisClient:
    """Async Redis client wrapper."""
    
    def __init__(self):
        self.pool: Optional[ConnectionPool] = None
        self.client: Optional[Redis] = None
    
    async def connect(self):
        """Initialize Redis connection pool."""
        try:
            self.pool = ConnectionPool.from_url(
                settings.redis_url,
                decode_responses=True,
                max_connections=50
            )
            self.client = Redis(connection_pool=self.pool)
            await self.client.ping()
            logger.info("Redis connected")
        except Exception as e:
            logger.warning(f"Redis connection failed (non-fatal): {e}")
            self.client = None
            self.pool = None
    
    async def disconnect(self):
        """Close Redis connections."""
        if self.client:
            await self.client.close()
        if self.pool:
            await self.pool.disconnect()
        logger.info("Redis disconnected")
    
    async def get(self, key: str) -> Optional[str]:
        """Get value by key."""
        return await self.client.get(key)
    
    async def set(
        self,
        key: str,
        value: str,
        expire: Optional[int] = None
    ) -> bool:
        """Set key-value pair with optional expiration."""
        return await self.client.set(key, value, ex=expire)
    
    async def delete(self, key: str) -> int:
        """Delete key."""
        return await self.client.delete(key)
    
    async def publish(self, channel: str, message: dict[str, Any]) -> int:
        """Publish message to channel."""
        return await self.client.publish(channel, json.dumps(message))
    
    async def subscribe(self, *channels: str):
        """Subscribe to channels."""
        pubsub = self.client.pubsub()
        await pubsub.subscribe(*channels)
        return pubsub
    
    async def cache_get(self, key: str) -> Optional[Any]:
        """Get cached value (auto-deserialize JSON)."""
        value = await self.get(key)
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return value
        return None
    
    async def cache_set(
        self,
        key: str,
        value: Any,
        expire: int = 3600
    ) -> bool:
        """Cache value (auto-serialize to JSON)."""
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        return await self.set(key, value, expire)

redis_client = RedisClient()

async def get_redis() -> Redis:
    """Dependency for getting Redis client."""
    return redis_client.client
