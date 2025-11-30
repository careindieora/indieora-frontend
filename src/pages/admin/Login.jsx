// src/pages/admin/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../../services/auth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    if (!email || !password) return setErr('Enter email and password');
    setBusy(true);
    try {
      await loginRequest(email, password);
      // success -> go to admin dashboard
      nav('/admin');
    } catch (error) {
      setErr(error.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 18, border: '1px solid #eee', borderRadius: 8 }}>
      <h2 style={{ marginBottom: 12 }}>Admin Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" className="input" style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
        {err && <div style={{ color: '#842029', background: '#f8d7da', padding: 8, borderRadius: 6 }}>{err}</div>}
        <button type="submit" disabled={busy} style={{ padding: 10, background: '#000', color: '#fff', borderRadius: 6 }}>
          {busy ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}