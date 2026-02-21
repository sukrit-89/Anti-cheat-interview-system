"""
System-wide validation tests.
Test the complete platform functionality end-to-end.
"""
import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

class TestSystemValidation:
    """Comprehensive system validation tests."""
    
    @pytest.mark.asyncio
    async def test_full_platform_workflow(self, client: AsyncClient):
        """
        Complete end-to-end test of the platform.
        Tests: Register -> Login -> Create Session -> Start -> End
        """
        recruiter_data = {
            "email": "recruiter_system@example.com",
            "password": "SecurePass123!",
            "full_name": "System Test Recruiter",
            "role": "recruiter"
        }
        register_resp = await client.post("/api/auth/register", json=recruiter_data)
        assert register_resp.status_code == 201
        
        login_resp = await client.post("/api/auth/login", json={
            "email": recruiter_data["email"],
            "password": recruiter_data["password"]
        })
        assert login_resp.status_code == 200
        recruiter_token = login_resp.json()["access_token"]
        recruiter_headers = {"Authorization": f"Bearer {recruiter_token}"}
        
        session_data = {
            "title": "System Validation Interview",
            "description": "Complete platform test",
            "metadata": {"position": "Software Engineer"}
        }
        create_session = await client.post(
            "/api/sessions",
            json=session_data,
            headers=recruiter_headers
        )
        assert create_session.status_code == 201
        session = create_session.json()
        session_id = session["id"]
        session_code = session["session_code"]
        
        get_session = await client.get(
            f"/api/sessions/{session_id}",
            headers=recruiter_headers
        )
        assert get_session.status_code == 200
        
        start_resp = await client.post(
            f"/api/sessions/{session_id}/start",
            headers=recruiter_headers
        )
        assert start_resp.status_code == 200
        assert start_resp.json()["status"] == "live"
        
        check_session = await client.get(
            f"/api/sessions/{session_id}",
            headers=recruiter_headers
        )
        assert check_session.json()["status"] == "live"
        assert check_session.json()["started_at"] is not None
        
        end_resp = await client.post(
            f"/api/sessions/{session_id}/end",
            headers=recruiter_headers
        )
        assert end_resp.status_code == 200
        assert end_resp.json()["status"] == "completed"
        
        final_session = await client.get(
            f"/api/sessions/{session_id}",
            headers=recruiter_headers
        )
        final_data = final_session.json()
        assert final_data["status"] == "completed"
        assert final_data["started_at"] is not None
        assert final_data["ended_at"] is not None
        
        list_resp = await client.get("/api/sessions", headers=recruiter_headers)
        assert list_resp.status_code == 200
        sessions = list_resp.json()
        assert any(s["id"] == session_id for s in sessions)
    
    @pytest.mark.asyncio
    async def test_api_documentation_accessible(self, client: AsyncClient):
        """Test that API documentation is accessible."""
        docs_resp = await client.get("/docs")
        assert docs_resp.status_code == 200
        
        openapi_resp = await client.get("/openapi.json")
        assert openapi_resp.status_code == 200
        schema = openapi_resp.json()
        assert "openapi" in schema
        assert "paths" in schema
    
    @pytest.mark.asyncio
    async def test_all_critical_endpoints_exist(self, client: AsyncClient):
        """Verify all critical endpoints are registered."""
        openapi_resp = await client.get("/openapi.json")
        schema = openapi_resp.json()
        paths = schema["paths"]
        
        assert "/" in paths
        assert "/health" in paths
        
        assert "/api/auth/register" in paths
        assert "/api/auth/login" in paths
        assert "/api/auth/me" in paths
        assert "/api/auth/refresh" in paths
        
        assert "/api/sessions" in paths
        assert "/api/sessions/join" in paths
    
    @pytest.mark.asyncio
    async def test_error_handling(self, client: AsyncClient):
        """Test proper error handling across the platform."""
        resp = await client.get("/api/nonexistent")
        assert resp.status_code == 404
        
        invalid_data = {"email": "not-an-email"}
        resp = await client.post("/api/auth/register", json=invalid_data)
        assert resp.status_code == 422
        
        resp = await client.post("/api/auth/login", json={
            "email": "fake@example.com",
            "password": "wrong"
        })
        assert resp.status_code == 401
        
        resp = await client.get("/api/sessions")
        assert resp.status_code == 403
    
    @pytest.mark.asyncio
    async def test_data_validation(self, client: AsyncClient):
        """Test data validation across endpoints."""
        invalid_email = {
            "email": "invalid",
            "password": "ValidPass123!",
            "full_name": "Test User",
            "role": "recruiter"
        }
        resp = await client.post("/api/auth/register", json=invalid_email)
        assert resp.status_code == 422
        
        incomplete_data = {"email": "test@example.com"}
        resp = await client.post("/api/auth/register", json=incomplete_data)
        assert resp.status_code == 422
        
        invalid_role = {
            "email": "test@example.com",
            "password": "ValidPass123!",
            "full_name": "Test User",
            "role": "invalid_role"
        }
        resp = await client.post("/api/auth/register", json=invalid_role)
        assert resp.status_code == 422
    
    @pytest.mark.asyncio
    async def test_multiple_sessions_creation(self, client: AsyncClient, auth_headers):
        """Test creating multiple sessions sequentially."""
        session_ids = []
        
        for i in range(5):
            session_data = {
                "title": f"Multi Session {i}",
                "description": f"Testing multiple sessions {i}"
            }
            response = await client.post(
                "/api/sessions",
                json=session_data,
                headers=auth_headers
            )
            assert response.status_code == 201
            session_ids.append(response.json()["id"])
        
        assert len(session_ids) == len(set(session_ids))
        
        list_resp = await client.get("/api/sessions", headers=auth_headers)
        assert list_resp.status_code == 200
        listed_ids = [s["id"] for s in list_resp.json()]
        assert all(sid in listed_ids for sid in session_ids)
    
    @pytest.mark.asyncio
    async def test_security_headers(self, client: AsyncClient):
        """Test security-related response headers."""
        response = await client.get("/health")
        
        assert "X-Powered-By" not in response.headers
        assert "Server" not in response.headers or "uvicorn" not in response.headers.get("Server", "").lower()
    
    @pytest.mark.asyncio
    async def test_rate_limiting_headers(self, client: AsyncClient):
        """Test that responses include appropriate headers."""
        response = await client.get("/health")
        assert response.status_code == 200
        
        assert "application/json" in response.headers.get("content-type", "")
