"""
Test session management endpoints.
"""
import pytest
from httpx import AsyncClient
from app.models.models import User


class TestSessions:
    """Test session management."""
    
    @pytest.mark.asyncio
    async def test_create_session(self, client: AsyncClient, auth_headers):
        """Test creating a new interview session."""
        session_data = {
            "title": "Backend Developer Interview",
            "description": "Technical interview for backend position",
            "scheduled_at": "2026-02-01T10:00:00",
            "metadata": {"position": "Senior Backend Developer"}
        }
        
        response = await client.post(
            "/api/sessions",
            json=session_data,
            headers=auth_headers
        )
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == session_data["title"]
        assert data["status"] == "scheduled"
        assert "id" in data
        assert "session_code" in data
        assert "room_name" in data
    
    @pytest.mark.asyncio
    async def test_create_session_unauthorized(self, client: AsyncClient):
        """Test creating session without authentication fails."""
        session_data = {
            "title": "Test Interview",
            "description": "Test"
        }
        
        response = await client.post("/api/sessions", json=session_data)
        assert response.status_code == 403
    
    @pytest.mark.asyncio
    async def test_list_sessions(self, client: AsyncClient, auth_headers):
        """Test listing sessions."""
        # Create a session first
        session_data = {
            "title": "Test Interview 1",
            "description": "First test interview"
        }
        await client.post("/api/sessions", json=session_data, headers=auth_headers)
        
        # List sessions
        response = await client.get("/api/sessions", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
    
    @pytest.mark.asyncio
    async def test_get_session_by_id(self, client: AsyncClient, auth_headers):
        """Test getting specific session by ID."""
        # Create session
        session_data = {
            "title": "Specific Session Test",
            "description": "Testing session retrieval"
        }
        create_response = await client.post(
            "/api/sessions",
            json=session_data,
            headers=auth_headers
        )
        session_id = create_response.json()["id"]
        
        # Get session
        response = await client.get(f"/api/sessions/{session_id}", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == session_id
        assert data["title"] == session_data["title"]
    
    @pytest.mark.asyncio
    async def test_get_nonexistent_session(self, client: AsyncClient, auth_headers):
        """Test getting non-existent session returns 404."""
        response = await client.get("/api/sessions/99999", headers=auth_headers)
        assert response.status_code == 404
    
    @pytest.mark.asyncio
    async def test_update_session(self, client: AsyncClient, auth_headers):
        """Test updating session details."""
        # Create session
        session_data = {
            "title": "Original Title",
            "description": "Original description"
        }
        create_response = await client.post(
            "/api/sessions",
            json=session_data,
            headers=auth_headers
        )
        session_id = create_response.json()["id"]
        
        # Update session
        update_data = {
            "title": "Updated Title",
            "description": "Updated description"
        }
        response = await client.patch(
            f"/api/sessions/{session_id}",
            json=update_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == update_data["title"]
        assert data["description"] == update_data["description"]
    
    @pytest.mark.asyncio
    async def test_start_session(self, client: AsyncClient, auth_headers):
        """Test starting a scheduled session."""
        # Create session
        session_data = {
            "title": "Session to Start",
            "description": "Testing session start"
        }
        create_response = await client.post(
            "/api/sessions",
            json=session_data,
            headers=auth_headers
        )
        session_id = create_response.json()["id"]
        
        # Start session
        response = await client.post(
            f"/api/sessions/{session_id}/start",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "live"
        assert data["started_at"] is not None
    
    @pytest.mark.asyncio
    async def test_end_session(self, client: AsyncClient, auth_headers):
        """Test ending an in-progress session."""
        # Create and start session
        session_data = {
            "title": "Session to End",
            "description": "Testing session end"
        }
        create_response = await client.post(
            "/api/sessions",
            json=session_data,
            headers=auth_headers
        )
        session_id = create_response.json()["id"]
        
        await client.post(f"/api/sessions/{session_id}/start", headers=auth_headers)
        
        # End session
        response = await client.post(
            f"/api/sessions/{session_id}/end",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "completed"
        assert data["ended_at"] is not None
    
    @pytest.mark.asyncio
    async def test_join_session(self, client: AsyncClient, auth_headers, test_candidate):
        """Test candidate joining a session."""
        from app.core.auth import AuthService
        
        # Create session as recruiter (using existing auth_headers)
        session_data = {
            "title": "Session to Join",
            "description": "Testing session join"
        }
        create_response = await client.post(
            "/api/sessions",
            json=session_data,
            headers=auth_headers
        )
        session_code = create_response.json()["session_code"]
        
        # Join as candidate
        candidate_token = AuthService.create_access_token(
            test_candidate.id,
            test_candidate.email
        )
        candidate_headers = {"Authorization": f"Bearer {candidate_token}"}
        
        join_data = {
            "session_code": session_code,
            "full_name": "Test Candidate",
            "email": test_candidate.email
        }
        response = await client.post(
            "/api/sessions/join",
            json=join_data,
            headers=candidate_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "room_token" in data
        assert "candidate_id" in data
        assert "session" in data
    
    @pytest.mark.asyncio
    async def test_filter_sessions_by_status(self, client: AsyncClient, auth_headers):
        """Test filtering sessions by status."""
        # Create multiple sessions
        for i in range(3):
            session_data = {
                "title": f"Session {i}",
                "description": f"Test session {i}"
            }
            await client.post("/api/sessions", json=session_data, headers=auth_headers)
        
        # Filter by status
        response = await client.get(
            "/api/sessions?status=scheduled",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert all(session["status"] == "scheduled" for session in data)
