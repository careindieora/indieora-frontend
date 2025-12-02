// src/pages/Register.jsx
import React, { useState } from 'react';
import { register } from '../services/auth.js';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Register(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handle(e){
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(name, email, password);
      if (user) {
        toast.success('Account created');
        nav('/profile');
      } else {
        toast.success('Registered — please log in');
        nav('/login');
      }
    } catch (err){
      console.error(err);
      toast.error('Registration failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Create account</h2>
        <form onSubmit={handle} className="space-y-3">
          <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} className="w-full border p-2 rounded" required />
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-2 rounded" required />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border p-2 rounded" required />
          <div className="flex items-center justify-between">
            <button type="submit" disabled={loading} className="px-4 py-2 rounded" style={{background:'#8b5a3c', color:'#fff'}}>{loading ? 'Creating...' : 'Create account'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
