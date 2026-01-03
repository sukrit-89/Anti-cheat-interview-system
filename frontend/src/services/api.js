import { auth } from '../firebase';

// API configuration
const API_BASE_URL = '/api';

// Helper to get Firebase auth token
const getAuthToken = async () => {
    const user = auth.currentUser;
    if (user) {
        return await user.getIdToken();
    }
    return null;
};

// Helper for making API requests with auth
const apiRequest = async (endpoint, options = {}) => {
    const token = await getAuthToken();

    const headers = {
        ...options.headers,
    };

    // Add Authorization header if token exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }));
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response;
};

// Session API
export const sessionAPI = {
    getSessions: async () => {
        const response = await apiRequest('/sessions');
        return response.json();
    },

    getSession: async (sessionId) => {
        const response = await apiRequest(`/sessions/${sessionId}`);
        return response.json();
    },

    createSession: async (candidateId) => {
        const formData = new FormData();
        formData.append('candidate_id', candidateId);

        const response = await apiRequest('/sessions/create', {
            method: 'POST',
            body: formData
        });
        return response.json();
    },

    joinSession: async (joinCode) => {
        const response = await apiRequest('/sessions/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ join_code: joinCode })
        });
        return response.json();
    },

    getMyReports: async () => {
        const response = await apiRequest('/sessions/my-reports');
        return response.json();
    },

    deleteSession: async (sessionId) => {
        const response = await apiRequest(`/sessions/${sessionId}`, {
            method: 'DELETE'
        });
        return response.json();
    },

    uploadVideo: async (file, candidateId, onProgress) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('candidate_id', candidateId);

        const token = await getAuthToken();

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && onProgress) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    onProgress(percentComplete);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error('Upload failed'));
                }
            });

            xhr.addEventListener('error', () => reject(new Error('Upload failed')));

            xhr.open('POST', `${API_BASE_URL}/upload`);
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }
            xhr.send(formData);
        });
    },

    getPDFUrl: (sessionId) => `/api/reports/${sessionId}/pdf`
};

export default { sessionAPI };
