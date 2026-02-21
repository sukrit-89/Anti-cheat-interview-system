/**
 * API Client for Integrity AI Platform
 * Handles all HTTP requests to the backend
 */
import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { supabase } from './supabase';

// API Base URL - from environment or default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add Supabase auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token && config.headers) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401, try to refresh Supabase session
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();

        if (refreshError || !session) {
          // Refresh failed - sign out
          await supabase.auth.signOut();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
        }
        return apiClient(originalRequest);
      } catch {
        // Refresh failed - sign out
        await supabase.auth.signOut();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// AUTH API
// ============================================================================

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role: 'recruiter' | 'candidate';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/login', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};

// ============================================================================
// SESSIONS API
// ============================================================================

export interface SessionCreateRequest {
  title: string;
  description?: string;
  scheduled_at?: string;
  metadata?: Record<string, unknown>;
}

export interface Session {
  id: number;
  session_code: string;
  join_code?: string; // Optional: alias for session_code or UI display
  title: string;
  description?: string;
  recruiter_id: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  scheduled_at?: string;
  started_at?: string;
  ended_at?: string;
  room_name: string;
  created_at: string;
  updated_at?: string;
  evaluation_completed?: boolean; // Track if evaluation is complete
}

export interface SessionJoinRequest {
  session_code: string;
  email: string;
  full_name: string;
}

export interface SessionJoinResponse {
  session: Session;
  room_token: string;
  candidate_id: number;
}

export interface RoomTokenResponse {
  room_token: string;
  room_name: string;
  participant_identity: string;
}

export const sessionsApi = {
  createSession: async (data: SessionCreateRequest): Promise<Session> => {
    const response = await apiClient.post('/api/sessions', data);
    return response.data;
  },

  listSessions: async (status?: string): Promise<Session[]> => {
    const params = status ? { status_filter: status } : {};
    const response = await apiClient.get('/api/sessions', { params });
    return response.data;
  },

  getSession: async (sessionId: number): Promise<Session> => {
    const response = await apiClient.get(`/api/sessions/${sessionId}`);
    return response.data;
  },

  joinSession: async (data: SessionJoinRequest): Promise<SessionJoinResponse> => {
    const response = await apiClient.post('/api/sessions/join', data);
    return response.data;
  },

  getRoomToken: async (sessionId: number): Promise<RoomTokenResponse> => {
    const response = await apiClient.get(`/api/sessions/${sessionId}/token`);
    return response.data;
  },

  startSession: async (sessionId: number): Promise<Session> => {
    const response = await apiClient.post(`/api/sessions/${sessionId}/start`);
    return response.data;
  },

  endSession: async (sessionId: number): Promise<Session> => {
    const response = await apiClient.post(`/api/sessions/${sessionId}/end`);
    return response.data;
  },
};

// ============================================================================
// CODING EVENTS API
// ============================================================================

export interface CodingEventRequest {
  session_id: number;
  event_type: string;
  code_snapshot?: string;
  language?: string;
  execution_output?: string;
  execution_error?: string;
}

export const codingApi = {
  createEvent: async (data: CodingEventRequest): Promise<void> => {
    await apiClient.post('/api/coding-events', data);
  },

  executeCode: async (sessionId: number, code: string, language: string): Promise<{
    output?: string;
    error?: string;
    execution_time?: number;
    exit_code?: number;
  }> => {
    const response = await apiClient.post('/api/coding-events/execute', {
      session_id: sessionId,
      code,
      language,
    });
    return response.data;
  },
};

// ============================================================================
// EVALUATION API
// ============================================================================

export interface Evaluation {
  id: number;
  session_id: number;
  overall_score: number;
  coding_score?: number;
  communication_score?: number;
  engagement_score?: number;
  reasoning_score?: number;
  recommendation: string;
  confidence_level?: number;
  strengths: string[];
  weaknesses: string[];
  key_findings: unknown[];
  summary?: string;
  detailed_report?: string;
  evaluated_at: string;
}

export const evaluationApi = {
  getEvaluation: async (sessionId: number): Promise<Evaluation> => {
    const response = await apiClient.get(`/api/evaluations/${sessionId}`);
    return response.data;
  },

  triggerEvaluation: async (sessionId: number): Promise<void> => {
    await apiClient.post(`/api/evaluations/${sessionId}/trigger`);
  },
};

// Export default client
export default apiClient;
