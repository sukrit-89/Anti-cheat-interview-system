/**
 * Session State Management
 * Manages interview sessions and real-time updates
 */
import { create } from 'zustand';
import { sessionsApi } from '../lib/api';
import type { Session, SessionCreateRequest, SessionJoinRequest } from '../lib/api';

interface SessionState {
  sessions: Session[];
  currentSession: Session | null;
  roomToken: string | null;
  candidateId: number | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSessions: (status?: string) => Promise<void>;
  createSession: (data: SessionCreateRequest) => Promise<Session>;
  joinSession: (data: SessionJoinRequest) => Promise<void>;
  setCurrentSession: (session: Session | null) => void;
  startSession: (sessionId: number) => Promise<void>;
  endSession: (sessionId: number) => Promise<void>;
  fetchSession: (sessionId: number) => Promise<void>;
  clearError: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  currentSession: null,
  roomToken: null,
  candidateId: null,
  isLoading: false,
  error: null,

  fetchSessions: async (status) => {
    set({ isLoading: true, error: null });
    try {
      const sessions = await sessionsApi.listSessions(status);
      set({ sessions, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch sessions',
        isLoading: false,
      });
    }
  },

  fetchSession: async (sessionId: number) => {
    set({ isLoading: true, error: null });
    try {
      const session = await sessionsApi.getSession(sessionId);
      set({ currentSession: session, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch session',
        isLoading: false,
      });
    }
  },

  createSession: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const session = await sessionsApi.createSession(data);
      set((state) => ({
        sessions: [session, ...state.sessions],
        currentSession: session,
        isLoading: false,
      }));
      return session;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to create session',
        isLoading: false,
      });
      throw error;
    }
  },

  joinSession: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await sessionsApi.joinSession(data);
      set({
        currentSession: response.session,
        roomToken: response.room_token,
        candidateId: response.candidate_id,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to join session',
        isLoading: false,
      });
      throw error;
    }
  },

  setCurrentSession: (session) => {
    set({ currentSession: session });
  },

  startSession: async (sessionId) => {
    set({ isLoading: true, error: null });
    try {
      const session = await sessionsApi.startSession(sessionId);
      set((state) => ({
        currentSession: session,
        sessions: state.sessions.map((s) => (s.id === sessionId ? session : s)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to start session',
        isLoading: false,
      });
      throw error;
    }
  },

  endSession: async (sessionId) => {
    set({ isLoading: true, error: null });
    try {
      const session = await sessionsApi.endSession(sessionId);
      set((state) => ({
        currentSession: session,
        sessions: state.sessions.map((s) => (s.id === sessionId ? session : s)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to end session',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
