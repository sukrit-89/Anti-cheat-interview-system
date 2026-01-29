const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  // Authentication endpoints
  auth: {
    login: (credentials: { email: string; password: string }) =>
      fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      }),
    
    register: (userData: { email: string; password: string; full_name: string; role: string }) =>
      fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      }),
    
    refreshToken: (token: string) =>
      fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }),
    
    logout: (token: string) =>
      fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }),

    me: (token: string) =>
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      }),
  },

  // Session endpoints
  sessions: {
    create: (sessionData: any, token: string) =>
      fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sessionData),
      }),
    
    list: (token: string) =>
      fetch(`${API_BASE_URL}/sessions`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      }),
    
    get: (id: string, token: string) =>
      fetch(`${API_BASE_URL}/sessions/${id}`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      }),
    
    join: (joinCode: string, token: string) =>
      fetch(`${API_BASE_URL}/sessions/join`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ join_code: joinCode }),
      }),
    
    start: (id: string, token: string) =>
      fetch(`${API_BASE_URL}/sessions/${id}/start`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      }),
    
    end: (id: string, token: string) =>
      fetch(`${API_BASE_URL}/sessions/${id}/end`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      }),
  },

  // WebSocket connection
  createWebSocket: (sessionId: string, token: string) => {
    const wsUrl = `ws://localhost:8000/api/ws/session/${sessionId}?token=${token}`;
    
    return new WebSocket(wsUrl);
  },
};
