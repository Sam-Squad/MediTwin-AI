import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Live deployed backend URL
export const API_URL = 'https://meditwin-ai-backend.onrender.com';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach auth token to all requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post('/api/auth/register', { name, email, password }),
};

export const chatAPI = {
  sendMessage: (message: string, chatId?: string) =>
    api.post('/api/chat/send', { message, chat_id: chatId }),
  getSessions: () =>
    api.get('/api/chat/sessions'),
};

export const uploadAPI = {
  uploadReport: (formData: FormData) =>
    api.post('/api/reports/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadPrescription: (formData: FormData) =>
    api.post('/api/prescriptions/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadMedicalImage: (formData: FormData) =>
    api.post('/api/medical-images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const healthAPI = {
  getSummary: () =>
    api.get('/api/health-summary/'),
};

export const heartRateAPI = {
  analyze: (bpm: number) =>
    api.post('/api/heart-rate/analyze', { bpm }),
};

export default api;
