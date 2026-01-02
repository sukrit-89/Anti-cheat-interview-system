// src/services/api.js
import axios from 'axios';

// Use relative URL to work with Vite proxy
const API_BASE = '';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const sessionAPI = {
    // Get all sessions
    getSessions: () => api.get('/api/sessions'),

    // Get single session
    getSession: (id) => api.get(`/api/sessions/${id}`),

    // Create session
    createSession: (candidateId) =>
        api.post('/api/sessions', { candidate_id: candidateId }),

    // Delete session
    deleteSession: (id) => api.delete(`/api/sessions/${id}`),

    // Upload video
    uploadVideo: (file, candidateId, onProgress) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('candidate_id', candidateId);

        return api.post('/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(percentCompleted);
                }
            },
        });
    },

    // Get reports
    getJSONReport: (id) => api.get(`/api/reports/${id}/json`),
    getPDFReport: (id) => `/api/reports/${id}/pdf`,
};

export default api;
