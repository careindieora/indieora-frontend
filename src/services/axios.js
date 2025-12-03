// src/services/axios.js
import axios from "axios";

// Backend API base URL
// Vercel env: VITE_API_URL=https://indieora-backend.onrender.com/api
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});

// ---- Request interceptor: attach token automatically ----
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // support both keys: 'indieora_token' and 'token'
      const token =
        localStorage.getItem("indieora_token") ||
        localStorage.getItem("token");

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response interceptor: handle 401 globally ----
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      try {
        localStorage.removeItem("indieora_token");
        localStorage.removeItem("token");
        localStorage.removeItem("indieora_user");
      } catch (e) {
        // ignore
      }

      // Redirect to account/login page
      setTimeout(() => {
        if (window.location.pathname !== "/account") {
          window.location.href = "/account";
        }
      }, 50);
    }

    return Promise.reject(error);
  }
);

// Default + named export (both work)
export default api;
export { api };
