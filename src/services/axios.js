// src/services/axios.js
import axios from "axios";

// IMPORTANT: backend URL should match your Render backend
export const API_URL = "https://indieora-backend.onrender.com/api";

const instance = axios.create({
  baseURL: API_URL,
});

// Auto inject token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
