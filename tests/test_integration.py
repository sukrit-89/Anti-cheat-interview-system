"""
Integration tests for complete workflows.
"""
import pytest
from httpx import AsyncClient


class TestIntegration:
    """Test complete user workflows."""
    
    @pytest.mark.asyncio
    async def test_complete_registration_and_login_flow(self, client: AsyncClient):
        """Test full registration and login workflow."""
        # Register new user
        register_data = {
            "email": "integration@example.com",
            "password": "IntegrationPass123!",
            "full_name": "Integration Test User",
            "role": "recruiter"
        }
        
        register_response = await client.post(
            "/api/auth/register",
            json=register_data
        )
        assert register_response.status_code == 201
        user_data = register_response.json()
        
        # Login with registered user
        login_data = {
            "email": register_data["email"],
            "password": register_data["password"]
        }
        
        login_response = await client.post("/api/auth/login", json=login_data)
        assert login_response.status_code == 200
        tokens = login_response.json()
        
        # Use token to access protected endpoint
        headers = {"Authorization": f"Bearer {tokens['access_token']}"}
        me_response = await client.get("/api/auth/me", headers=headers)
        assert me_response.status_code == 200
        assert me_response.json()["email"] == register_data["email"]
    
    @pytest.mark.asyncio
    async def test_complete_interview_session_workflow(self, client: AsyncClient, auth_headers):
        """Test complete interview session lifecycle."""
        # Create session
        session_data = {
            "title": "Full Stack Developer Interview",
            "description": "Complete interview workflow test",
            "metadata": {"position": "Full Stack Developer"}
        }
        
        create_response = await client.post(
            "/api/sessions",
            json=session_data,
            headers=auth_headers
        )
        assert create_response.status_code == 201
        session = create_response.json()
        session_id = session["id"]
        
        # Get session details
        get_response = await client.get(
            f"/api/sessions/{session_id}",
            headers=auth_headers
        )
        assert get_response.status_code == 200
        
        # Update session
        update_data = {"description": "Updated description for workflow test"}
        update_response = await client.patch(
            f"/api/sessions/{session_id}",
            json=update_data,
            headers=auth_headers
        )
        assert update_response.status_code == 200
        assert update_response.json()["description"] == update_data["description"]
        
        # Start session
        start_response = await client.post(
            f"/api/sessions/{session_id}/start",
            headers=auth_headers
        )
        assert start_response.status_code == 200
        assert start_response.json()["status"] == "live"
        
        # End session
        end_response = await client.post(
            f"/api/sessions/{session_id}/end",
            headers=auth_headers
        )
        assert end_response.status_code == 200
        assert end_response.json()["status"] == "completed"
        
        # List all sessions
        list_response = await client.get("/api/sessions", headers=auth_headers)
        assert list_response.status_code == 200
        sessions = list_response.json()
        assert any(s["id"] == session_id for s in sessions)
    
    @pytest.mark.asyncio
    async def test_multiple_concurrent_sessions(self, client: AsyncClient, auth_headers):
        """Test creating and managing multiple sessions."""
        sessions_created = []
        
        # Create 5 sessions
        for i in range(5):
            session_data = {
                "title": f"Concurrent Session {i+1}",
                "description": f"Testing concurrent session {i+1}"
            }
            
            response = await client.post(
                "/api/sessions",
                json=session_data,
                headers=auth_headers
            )
            assert response.status_code == 201
            sessions_created.append(response.json()["id"])
        
        # List sessions and verify all are present
        list_response = await client.get("/api/sessions", headers=auth_headers)
        assert list_response.status_code == 200
        all_sessions = list_response.json()
        
        for session_id in sessions_created:
            assert any(s["id"] == session_id for s in all_sessions)
    
    @pytest.mark.asyncio
    async def test_token_refresh_workflow(self, client: AsyncClient, test_user):
        """Test token refresh workflow."""
        from app.core.auth import AuthService
        
        # Create initial tokens
        access_token = AuthService.create_access_token(test_user.id, test_user.email)
        refresh_token = AuthService.create_refresh_token(test_user.id)
        
        # Use access token
        headers = {"Authorization": f"Bearer {access_token}"}
        me_response = await client.get("/api/auth/me", headers=headers)
        assert me_response.status_code == 200
        
        # Refresh token (using query parameter)
        refresh_response = await client.post(
            f"/api/auth/refresh?refresh_token={refresh_token}"
        )
        assert refresh_response.status_code == 200
        new_tokens = refresh_response.json()
        
        # Use new access token
        new_headers = {"Authorization": f"Bearer {new_tokens['access_token']}"}
        new_me_response = await client.get("/api/auth/me", headers=new_headers)
        assert new_me_response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_unauthorized_access_attempts(self, client: AsyncClient):
        """Test that unauthorized access is properly blocked."""
        # Try to create session without auth
        session_data = {
            "title": "Unauthorized Session",
            "description": "Test"
        }
        response = await client.post("/api/sessions", json=session_data)
        assert response.status_code == 403
        
        # Try to get current user without auth
        response = await client.get("/api/auth/me")
        assert response.status_code == 403
        
        # Try to list sessions without auth
        response = await client.get("/api/sessions")
        assert response.status_code == 403
    
    @pytest.mark.asyncio
    async def test_cross_user_session_access(
        self,
        client: AsyncClient,
        test_user,
        test_candidate
    ):
        """Test that users can only access their own sessions."""
        from app.core.auth import AuthService
        
        # User 1 creates session
        user1_token = AuthService.create_access_token(test_user.id, test_user.email)
        user1_headers = {"Authorization": f"Bearer {user1_token}"}
        
        session_data = {
            "title": "User 1 Session",
            "description": "Testing cross user access"
        }
        create_response = await client.post(
            "/api/sessions",
            json=session_data,
            headers=user1_headers
        )
        session_id = create_response.json()["id"]
        
        # User 2 tries to access User 1's session
        user2_token = AuthService.create_access_token(
            test_candidate.id,
            test_candidate.email
        )
        user2_headers = {"Authorization": f"Bearer {user2_token}"}
        
        # Should only see their own sessions (empty list)
        list_response = await client.get("/api/sessions", headers=user2_headers)
        assert list_response.status_code == 200
        sessions = list_response.json()
        assert not any(s["id"] == session_id for s in sessions)
