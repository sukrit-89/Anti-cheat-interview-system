import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; full_name: string; role: string }) =>
    api.post('/api/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  
  me: () => api.get('/api/auth/me'),
  
  refresh: (refresh_token: string) =>
    api.post('/api/auth/refresh', { refresh_token }),
}

// Session API
export const sessionAPI = {
  create: (data: { 
    title: string
    description?: string
    scheduled_at: string
    duration_minutes: number
  }) => api.post('/api/sessions', data),
  
  list: () => api.get('/api/sessions'),
  
  get: (id: number) => api.get(`/api/sessions/${id}`),
  
  join: (data: { session_code: string }) =>
    api.post('/api/sessions/join', data),
  
  start: (id: number) => api.post(`/api/sessions/${id}/start`),
  
  end: (id: number) => api.post(`/api/sessions/${id}/end`),
  
  update: (id: number, data: any) =>
    api.patch(`/api/sessions/${id}`, data),
}
