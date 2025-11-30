// src/services/api.js
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
