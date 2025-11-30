// src/services/auth.js
import { API_URL } from './api';

export async function login(email, password){
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Login failed');
  }
  const data = await res.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data.user;
}

export function logout(){
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getUser(){
  try { return JSON.parse(localStorage.getItem('user') || 'null'); }
  catch { return null; }
}
