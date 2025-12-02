// src/services/axios.js
import axios from 'axios';

// Base URL for your backend API. Set VITE_API_URL in .env (frontend).
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const instance = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

// Attach token automatically
instance.interceptors.request.use(cfg => {
  try {
    const token = localStorage.getItem('indieora_token');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  } catch (e) {
    // ignore
  }
  return cfg;
}, err => Promise.reject(err));

// Global response interceptor: handle 401
instance.interceptors.response.use(
  res => res,
  err => {
    const status = err?.response?.status;
    if (status === 401) {
      try {
        localStorage.removeItem('indieora_token');
        localStorage.removeItem('indieora_user');
      } catch (e) {}
      // redirect to login page (safe fallback)
      if (typeof window !== 'undefined') {
        // small delay so caller can process response if needed
        setTimeout(() => { window.location.href = '/login'; }, 50);
      }
    }
    return Promise.reject(err);
  }
);

export default instance;
