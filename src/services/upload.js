// src/services/upload.js
import axios from './axios.js';

export async function uploadFiles(files){
  const fd = new FormData();
  for (const f of files) fd.append('images', f);
  const r = await axios.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
  return r.data.uploaded.map(u => u.url);
}
