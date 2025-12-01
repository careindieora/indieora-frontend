// src/services/settings.js
import axios from './axios.js';

export async function fetchSettings(){
  const r = await axios.get('/settings');
  return r.data;
}

export async function saveSettings(payload){
  const r = await axios.put('/settings', payload);
  return r.data;
}
