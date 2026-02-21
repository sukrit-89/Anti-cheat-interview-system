"""
Test authentication endpoints.
"""
import pytest
from httpx import AsyncClient

class TestAuthentication:
    """Test authentication endpoints."""
    
    @pytest.mark.asyncio
    async def test_health_check(self, client: AsyncClient):
        """Test health check endpoint."""
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "database" in data
        assert "redis" in data
    
    @pytest.mark.asyncio
    async def test_register_new_user(self, client: AsyncClient):
        """Test user registration."""
        user_data = {
            "email": "newuser@example.com",
            "password": "SecurePass123!",
            "full_name": "New User",
            "role": "recruiter"
        }
        
        response = await client.post("/api/auth/register", json=user_data)
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == user_data["email"]
        assert data["full_name"] == user_data["full_name"]
        assert data["role"] == user_data["role"]
        assert "id" in data
        assert "hashed_password" not in data
    
    @pytest.mark.asyncio
    async def test_register_duplicate_email(self, client: AsyncClient, test_user):
        """Test registration with duplicate email fails."""
        user_data = {
            "email": test_user.email,
            "password": "AnotherPass123!",
            "full_name": "Duplicate User",
            "role": "recruiter"
        }
        
        response = await client.post("/api/auth/register", json=user_data)
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"].lower()
    
    @pytest.mark.asyncio
    async def test_register_invalid_email(self, client: AsyncClient):
        """Test registration with invalid email fails."""
        user_data = {
            "email": "invalid-email",
            "password": "SecurePass123!",
            "full_name": "Test User",
            "role": "recruiter"
        }
        
        response = await client.post("/api/auth/register", json=user_data)
        assert response.status_code == 422
    
    @pytest.mark.asyncio
    async def test_register_weak_password(self, client: AsyncClient):
        """Test registration with weak password."""
        user_data = {
            "email": "weakpass@example.com",
            "password": "123",
            "full_name": "Test User",
            "role": "recruiter"
        }
        
        response = await client.post("/api/auth/register", json=user_data)
        assert response.status_code in [400, 422]
    
    @pytest.mark.asyncio
    async def test_login_success(self, client: AsyncClient, test_user):
        """Test successful login."""
        login_data = {
            "email": test_user.email,
            "password": "testpass123"
        }
        
        response = await client.post("/api/auth/login", json=login_data)
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
        assert "expires_in" in data
    
    @pytest.mark.asyncio
    async def test_login_wrong_password(self, client: AsyncClient, test_user):
        """Test login with wrong password fails."""
        login_data = {
            "email": test_user.email,
            "password": "wrongpassword"
        }
        
        response = await client.post("/api/auth/login", json=login_data)
        assert response.status_code == 401
        assert "invalid" in response.json()["detail"].lower()
    
    @pytest.mark.asyncio
    async def test_login_nonexistent_user(self, client: AsyncClient):
        """Test login with non-existent user fails."""
        login_data = {
            "email": "nonexistent@example.com",
            "password": "somepassword"
        }
        
        response = await client.post("/api/auth/login", json=login_data)
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_get_current_user(self, client: AsyncClient, test_user, auth_headers):
        """Test getting current user info."""
        response = await client.get("/api/auth/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == test_user.email
        assert data["full_name"] == test_user.full_name
    
    @pytest.mark.asyncio
    async def test_get_current_user_no_token(self, client: AsyncClient):
        """Test getting current user without token fails."""
        response = await client.get("/api/auth/me")
        assert response.status_code == 403
    
    @pytest.mark.asyncio
    async def test_get_current_user_invalid_token(self, client: AsyncClient):
        """Test getting current user with invalid token fails."""
        headers = {"Authorization": "Bearer invalid_token"}
        response = await client.get("/api/auth/me", headers=headers)
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_refresh_token(self, client: AsyncClient, test_user):
        """Test token refresh."""
        from app.core.auth import AuthService
        
        refresh_token = AuthService.create_refresh_token(test_user.id)
        
        response = await client.post(f"/api/auth/refresh?refresh_token={refresh_token}")
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    @pytest.mark.asyncio
    async def test_password_hashing(self):
        """Test password hashing and verification."""
        from app.core.auth import AuthService
        
        password = "TestPassword123!"
        hashed = AuthService.hash_password(password)
        
        assert hashed != password
        assert AuthService.verify_password(password, hashed)
        assert not AuthService.verify_password("WrongPassword", hashed)
    
    @pytest.mark.asyncio
    async def test_long_password_truncation(self):
        """Test password truncation for bcrypt compatibility."""
        from app.core.auth import AuthService
        
        long_password = "a" * 100
        hashed = AuthService.hash_password(long_password)
        
        assert AuthService.verify_password(long_password, hashed)
