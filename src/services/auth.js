// src/services/auth.js
import { API_URL } from './api';

export async function loginRequest(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) {
    // normalize error message
    const msg = data?.message || data?.error || JSON.stringify(data);
    throw new Error(msg);
  }
  // expected { token, user }
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user || { email }));
  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getUser() {
  return JSON.parse(localStorage.getItem('user') || 'null');
}
