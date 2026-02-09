"""
Core configuration using Pydantic Settings.
All configuration is environment-driven.
"""
from functools import lru_cache
from typing import Optional
from pydantic import PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )
    
    # Application
    APP_NAME: str = "AI Interview Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 4
    
    # Security - Supabase handles authentication
    # No JWT needed - Supabase manages tokens
    
    # Database - Supabase Only
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str
    
    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_url(cls, v: Optional[str], info) -> str:
        if isinstance(v, str):
            return v
        
        # Always use Supabase URL
        return info.data.get("SUPABASE_URL")
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None
    
    @property
    def redis_url(self) -> str:
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
    
    # Celery
    CELERY_BROKER_URL: Optional[str] = None
    CELERY_RESULT_BACKEND: Optional[str] = None
    
    @field_validator("CELERY_BROKER_URL", mode="before")
    @classmethod
    def set_celery_broker(cls, v: Optional[str], info) -> str:
        if v:
            return v
        return info.data.get("redis_url", "redis://localhost:6379/0")
    
    @field_validator("CELERY_RESULT_BACKEND", mode="before")
    @classmethod
    def set_celery_backend(cls, v: Optional[str], info) -> str:
        if v:
            return v
        return info.data.get("redis_url", "redis://localhost:6379/0")
    
    # S3-Compatible Storage (Optional - falls back to local storage)
    S3_ENDPOINT_URL: Optional[str] = None  # For MinIO or other S3-compatible
    S3_ACCESS_KEY_ID: Optional[str] = None
    S3_SECRET_ACCESS_KEY: Optional[str] = None
    S3_BUCKET_NAME: str = "interview-recordings"
    S3_REGION: str = "us-east-1"
    USE_LOCAL_STORAGE: bool = True  # Fallback to local filesystem
    
    # LiveKit (or WebRTC provider) - Free tier available at cloud.livekit.io
    LIVEKIT_API_KEY: str = ""
    LIVEKIT_API_SECRET: str = ""
    LIVEKIT_WS_URL: str = ""
    
    # AI Services (100% FREE OPTIONS AVAILABLE)
    # Option 1: OpenAI (free tier: $5 credit for new users)
    OPENAI_API_KEY: Optional[str] = None
    # Option 2: Anthropic (optional, can skip)
    ANTHROPIC_API_KEY: Optional[str] = None
    # Option 3: Ollama (100% free, local LLM)
    USE_OLLAMA: bool = False
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama2"  # or codellama, mistral, phi
    # Whisper (free, runs locally)
    WHISPER_MODEL: str = "tiny"  # tiny/base/small (all free)
    USE_LOCAL_WHISPER: bool = True
    
    # Code Execution (FREE OPTIONS)
    # Judge0 Free Tier: 50 requests/day (no credit card at rapidapi.com)
    JUDGE0_API_URL: Optional[str] = None
    JUDGE0_API_KEY: Optional[str] = None
    CODE_EXECUTION_TIMEOUT: int = 30
    # Fallback: Rule-based code analysis (100% free, no execution)
    USE_RULE_BASED_CODE_ANALYSIS: bool = True
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://localhost:8000"
    
    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS_ORIGINS string into list"""
        if isinstance(self.CORS_ORIGINS, str):
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
        return self.CORS_ORIGINS
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Session Configuration
    MAX_SESSION_DURATION_MINUTES: int = 120
    SESSION_RECORDING_ENABLED: bool = True


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    Uses lru_cache to avoid reading .env file multiple times.
    """
    return Settings()


settings = get_settings()
