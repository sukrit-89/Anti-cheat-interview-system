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
    
    APP_NAME: str = "Neeti AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 4
    
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None
    
    @property
    def redis_url(self) -> str:
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
    
    CELERY_BROKER_URL: Optional[str] = None
    CELERY_RESULT_BACKEND: Optional[str] = None
    
    @field_validator("CELERY_BROKER_URL", mode="before")
    @classmethod
    def set_celery_broker(cls, v: Optional[str], info) -> str:
        if v:
            return v
        redis_host = info.data.get("REDIS_HOST", "localhost")
        redis_port = info.data.get("REDIS_PORT", 6379)
        redis_db = info.data.get("REDIS_DB", 0)
        redis_password = info.data.get("REDIS_PASSWORD")
        
        if redis_password:
            return f"redis://:{redis_password}@{redis_host}:{redis_port}/{redis_db}"
        return f"redis://{redis_host}:{redis_port}/{redis_db}"
    
    @field_validator("CELERY_RESULT_BACKEND", mode="before")
    @classmethod
    def set_celery_backend(cls, v: Optional[str], info) -> str:
        if v:
            return v
        redis_host = info.data.get("REDIS_HOST", "localhost")
        redis_port = info.data.get("REDIS_PORT", 6379)
        redis_db = info.data.get("REDIS_DB", 0)
        redis_password = info.data.get("REDIS_PASSWORD")
        
        if redis_password:
            return f"redis://:{redis_password}@{redis_host}:{redis_port}/{redis_db}"
        return f"redis://{redis_host}:{redis_port}/{redis_db}"
    
    S3_ENDPOINT_URL: Optional[str] = None
    S3_ACCESS_KEY_ID: Optional[str] = None
    S3_SECRET_ACCESS_KEY: Optional[str] = None
    S3_BUCKET_NAME: str = "interview-recordings"
    S3_REGION: str = "us-east-1"
    USE_LOCAL_STORAGE: bool = True
    
    LIVEKIT_API_KEY: str = ""
    LIVEKIT_API_SECRET: str = ""
    LIVEKIT_WS_URL: str = ""
    
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    USE_OLLAMA: bool = False
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama2"
    WHISPER_MODEL: str = "tiny"
    USE_LOCAL_WHISPER: bool = True
    
    JUDGE0_API_URL: Optional[str] = None
    JUDGE0_API_KEY: Optional[str] = None
    CODE_EXECUTION_TIMEOUT: int = 30
    USE_RULE_BASED_CODE_ANALYSIS: bool = True
    
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://localhost:8000"
    
    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS_ORIGINS string into list"""
        if isinstance(self.CORS_ORIGINS, str):
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
        return self.CORS_ORIGINS
    
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    
    RATE_LIMIT_PER_MINUTE: int = 60
    
    USE_SUPABASE: bool = True
    
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
