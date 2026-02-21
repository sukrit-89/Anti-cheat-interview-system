"""
Main FastAPI application.
Production-grade configuration with proper lifecycle management.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.core.config import settings
from app.core.database import init_db, close_db
from app.core.redis import redis_client
from app.core.logging import logger
from app.api import supabase_auth, sessions, websocket, coding_events, speech

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager - handles startup and shutdown."""
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    
    await init_db()
    
    await redis_client.connect()
    
    logger.info("Application startup complete")
    
    yield
    
    logger.info("Shutting down application...")
    
    await redis_client.disconnect()
    await close_db()
    
    logger.info("Application shutdown complete")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="नीति · AI-Powered Technical Interview Platform",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

app.include_router(supabase_auth.router, prefix="/api")
app.include_router(sessions.router, prefix="/api")
app.include_router(websocket.router, prefix="/api")
app.include_router(coding_events.router, prefix="/api")
app.include_router(speech.router, prefix="/api")

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint with real service connectivity checks."""
    db_status = "connected"
    redis_status = "connected"
    
    try:
        from app.core.database import get_db
        from sqlalchemy import text
        async for db in get_db():
            await db.execute(text("SELECT 1"))
            break
    except Exception:
        db_status = "disconnected"
    
    try:
        if redis_client.client:
            await redis_client.client.ping()
        else:
            redis_status = "disconnected"
    except Exception:
        redis_status = "disconnected"
    
    overall = "healthy" if db_status == "connected" and redis_status == "connected" else "degraded"
    
    return {
        "status": overall,
        "environment": settings.ENVIRONMENT,
        "database": db_status,
        "redis": redis_status
    }

@app.get("/api/info")
async def api_info():
    """API information endpoint."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "endpoints": {
            "auth": "/api/auth",
            "sessions": "/api/sessions",
            "websocket": "/api/ws",
            "docs": "/docs" if settings.DEBUG else None
        }
    }

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
        workers=settings.WORKERS if not settings.DEBUG else 1
    )
