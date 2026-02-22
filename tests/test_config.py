"""
Test configuration and environment settings.
"""
import pytest
from app.core.config import settings

class TestConfiguration:
    """Test application configuration."""
    
    def test_database_url_configured(self):
        """Test database URL is configured."""
        assert settings.POSTGRES_HOST is not None
        assert settings.POSTGRES_PORT is not None
        assert settings.POSTGRES_DB is not None
    
    def test_redis_configured(self):
        """Test Redis is configured."""
        assert settings.REDIS_HOST is not None
        assert settings.REDIS_PORT is not None
    
    def test_cors_origins_configured(self):
        """Test CORS origins are configured."""
        cors_list = settings.cors_origins_list
        assert isinstance(cors_list, list)
    
    def test_environment_settings(self):
        """Test environment-specific settings."""
        assert settings.ENVIRONMENT in ["development", "staging", "production"]
        assert isinstance(settings.DEBUG, bool)
    
    def test_storage_configuration(self):
        """Test storage configuration."""
        assert hasattr(settings, 'USE_LOCAL_STORAGE')
        if not settings.USE_LOCAL_STORAGE:
            assert hasattr(settings, 'S3_ENDPOINT_URL')
            assert hasattr(settings, 'S3_ACCESS_KEY_ID')
            assert hasattr(settings, 'S3_BUCKET_NAME')
    
    def test_ai_configuration(self):
        """Test AI service configuration."""
        has_openai = bool(settings.OPENAI_API_KEY)
        has_ollama = settings.USE_OLLAMA and settings.OLLAMA_BASE_URL
        
        assert has_openai or has_ollama, "At least one AI service should be configured"

class TestHealthEndpoints:
    """Test health and monitoring endpoints."""
    
    @pytest.mark.asyncio
    async def test_root_endpoint(self, client):
        """Test root endpoint."""
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "name" in data
        assert "status" in data
    
    @pytest.mark.asyncio
    async def test_api_info_endpoint(self, client):
        """Test API info endpoint."""
        response = await client.get("/api/info")
        assert response.status_code == 200
        data = response.json()
        assert "name" in data
        assert "version" in data
