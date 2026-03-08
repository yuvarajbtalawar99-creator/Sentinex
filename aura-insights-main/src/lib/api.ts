import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; // Dynamic API Endpoint

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('sentinex_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const auth = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

export const mood = {
    log: (data: { mood: string; intensity: number; note?: string; timestamp?: string }) => api.post('/mood/log-mood', data),
    history: (days = 30) => api.get(`/mood/history?days=${days}`),
    weekly: () => api.get('/mood/weekly'),
};

export const dashboard = {
    stats: () => api.get('/dashboard/stats'),
    risk: () => api.get('/dashboard/risk'),
    emotions: () => api.get('/dashboard/emotions'),
    forecast: () => api.get('/dashboard/forecast'),
    transparency: () => api.get('/dashboard/transparency'),
    toggleMonitoring: (enabled: boolean) => api.post('/dashboard/monitoring', { enabled }),
};

export const university = {
    metrics: () => api.get('/university/metrics'),
    heatmap: () => api.get('/university/heatmap'),
    impact: () => api.get('/university/impact'),
};

export const corporate = {
    metrics: () => api.get('/corporate/metrics'),
    heatmap: () => api.get('/corporate/heatmap'),
    impact: () => api.get('/corporate/impact'),
};

export const healthcare = {
    metrics: () => api.get('/healthcare/metrics'),
    heatmap: () => api.get('/healthcare/heatmap'),
    impact: () => api.get('/healthcare/impact'),
};

export const government = {
    metrics: () => api.get('/government/metrics'),
    heatmap: () => api.get('/government/heatmap'),
    impact: () => api.get('/government/impact'),
};

export const admin = {
    metrics: () => api.get('/admin/metrics'),
    organizations: () => api.get('/admin/organizations'),
    globalHeatmap: () => api.get('/admin/global-emotion-heatmap'),
    approveOrganization: (id: string) => api.post(`/admin/organizations/${id}/approve`),
    auditLogs: () => api.get('/admin/audit-logs'),
};

export const org = {
    metrics: () => api.get('/org/metrics'),
    heatmap: () => api.get('/org/heatmap'),
    alerts: () => api.get('/org/alerts'),
    trends: () => api.get('/org/trends'),
};

export const reports = {
    export: (type: string, format: 'pdf' | 'excel', data: any, title: string) =>
        api.post('/reports/export', { type, format, data, title }, { responseType: 'blob' }),
};

export default api;

