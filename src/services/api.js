import axios from 'axios';

// In local dev, Vite proxies /api → localhost:8000 (see vite.config.js)
// In production (Vercel/Netlify), VITE_API_URL points to the Render backend
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('meditwin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
};

export const reportsApi = {
  upload: (formData) => api.post('/reports/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  list: () => api.get('/reports/'),
  getDownloadUrl: (id) => `/api/reports/${id}/download-pdf`,
};

export const prescriptionsApi = {
  upload: (formData) => api.post('/prescriptions/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  confirm: (id, data) => api.post(`/prescriptions/${id}/confirm`, data),
  list: () => api.get('/prescriptions/'),
};

export const remindersApi = {
  list: () => api.get('/reminders/'),
  create: (data) => api.post('/reminders/', data),
  updateStatus: (id, status) => api.patch(`/reminders/${id}/status`, { status }),
};

export const chatApi = {
  send: (chat_id, message, imageData = null, generateImagePrompt = null) =>
    api.post('/chat/send', { chat_id, message, image_data: imageData, generate_image_prompt: generateImagePrompt }),
  listSessions: (query = '') => api.get(`/chat/sessions${query ? `?query=${encodeURIComponent(query)}` : ''}`),
  getSession: (id) => api.get(`/chat/session/${id}`),
  deleteSession: (id) => api.delete(`/chat/session/${id}`),
};

export const medicalImagesApi = {
  upload: (formData) => api.post('/medical-images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  list: () => api.get('/medical-images/'),
};

export const healthSummaryApi = {
  get: () => api.get('/health-summary/'),
};

export const doctorCopilotApi = {
  generateSheet: (symptoms) => api.post('/doctor-copilot/generate-sheet', symptoms, {
    responseType: 'blob'
  }),
};

export const timelineApi = {
  get: () => api.get('/timeline/'),
};

export const wellnessApi = {
  get: () => api.get('/wellness/'),
  update: (data) => api.put('/wellness/update', data),
};

export const emergencyApi = {
  getCard: () => api.get('/emergency/card'),
};

export const adminApi = {
  getStats: () => api.get('/admin/dashboard-stats'),
};

export default api;
