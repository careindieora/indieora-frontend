// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from '../services/axios.js';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handle(e){
    e.preventDefault();
    setLoading(true);
    try {
      const r = await axios.post('/auth/login', { email, password });
      localStorage.setItem('indieora_token', r.data.token);
      localStorage.setItem('indieora_user', JSON.stringify(r.data.user));
      toast.success('Logged in');
      nav('/profile');
    } catch (err){
      console.error(err);
      const msg = err?.response?.data?.message;
      if (msg && msg.toLowerCase().includes('verify')) {
        toast.error(msg);
        // optionally navigate to OTP verify flow
      } else {
        toast.error('Login failed');
      }
    } finally { setLoading(false); }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handle} className="space-y-3">
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-2 rounded" required />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border p-2 rounded" required />
          <div className="flex items-center justify-between">
            <button type="submit" disabled={loading} className="px-4 py-2 rounded" style={{background:'#8b5a3c', color:'#fff'}}>{loading ? 'Logging...' : 'Login'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
