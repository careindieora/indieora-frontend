// src/pages/Register.jsx
import React, { useState } from 'react';
import axios from '../services/axios.js';
import { login } from '../services/auth.js';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Register(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [stage, setStage] = useState('form'); // 'form' or 'otp'
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handleRegister(e){
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/register', { name, email, password, phone });
      toast.success('Registered. OTP sent to your email.');
      setStage('otp');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Register failed');
    } finally { setLoading(false); }
  }

  async function handleVerify(e){
    e.preventDefault();
    setLoading(true);
    try {
      const r = await axios.post('/auth/verify-otp', { email, otp });
      // response includes token & user
      const token = r.data.token;
      if (token) {
        localStorage.setItem('indieora_token', token);
        localStorage.setItem('indieora_user', JSON.stringify(r.data.user));
        toast.success('Email verified and logged in');
        nav('/profile');
      } else {
        toast.success('Verified, please login');
        nav('/login');
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'OTP verify failed');
    } finally { setLoading(false); }
  }

  async function resendOtp(){
    try {
      await axios.post('/auth/send-otp', { email });
      toast.success('OTP resent');
    } catch (err){
      toast.error('Resend failed');
    }
  }

  if (stage === 'otp') {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">Verify your email</h2>
          <p className="text-sm mb-4">We sent a 6-digit code to <strong>{email}</strong>. Enter it below.</p>
          <form onSubmit={handleVerify} className="space-y-3">
            <input placeholder="6-digit code" value={otp} onChange={e=>setOtp(e.target.value)} className="w-full border p-2 rounded" required />
            <div className="flex items-center justify-between">
              <button type="submit" className="px-4 py-2 rounded" style={{background:'#8b5a3c', color:'#fff'}} disabled={loading}>{loading ? 'Verifying...' : 'Verify'}</button>
              <button type="button" onClick={resendOtp} className="text-sm text-gray-600">Resend</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Create account</h2>
        <form onSubmit={handleRegister} className="space-y-3">
          <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} className="w-full border p-2 rounded" required />
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-2 rounded" required />
          <input placeholder="Mobile number" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full border p-2 rounded" />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border p-2 rounded" required />
          <div className="flex items-center justify-between">
            <button type="submit" disabled={loading} className="px-4 py-2 rounded" style={{background:'#8b5a3c', color:'#fff'}}>{loading ? 'Creating...' : 'Create account'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
