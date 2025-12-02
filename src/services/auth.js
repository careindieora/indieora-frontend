// src/services/auth.js
import axios from './axios.js';

const TOKEN_KEY = 'indieora_token';
const USER_KEY = 'indieora_user';

export async function login(email, password){
  const r = await axios.post('/auth/login', { email, password });
  if(!r?.data) throw new Error('Login failed');
  localStorage.setItem(TOKEN_KEY, r.data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(r.data.user));
  return r.data.user;
}

export async function register(name, email, password){
  const r = await axios.post('/auth/register', { name, email, password });
  // register route may not return token — attempt to login immediately
  try {
    await login(email, password);
    return getUser();
  } catch (e) {
    return null;
  }
}

export function logout(){
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken(){ return localStorage.getItem(TOKEN_KEY); }

export function getUser(){ 
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
}

// update profile - requires backend route support (see optional backend snippet below)
// returns updated user object and updates localStorage
export async function updateProfile(payload){
  // Try calling backend; if backend doesn't support, update only locally
  try {
    const r = await axios.put('/auth/profile', payload);
    if (r?.data?.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(r.data.user));
      return r.data.user;
    }
    // fallback
  } catch (err) {
    // ignore — fallback to local update
  }
  const cur = getUser() || {};
  const updated = { ...cur, ...payload };
  localStorage.setItem(USER_KEY, JSON.stringify(updated));
  return updated;
}
