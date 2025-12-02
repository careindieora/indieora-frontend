// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { getUser, updateProfile } from '../services/auth.js';
import toast from 'react-hot-toast';

export default function Profile(){
  const [user, setUser] = useState(getUser() || {});
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ setUser(getUser() || {}); }, []);

  async function handleSave(e){
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await updateProfile({ name: user.name, email: user.email });
      setUser(updated);
      toast.success('Profile updated');
    } catch (err){
      console.error(err);
      toast.error('Update failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
        <form onSubmit={handleSave} className="space-y-3">
          <input placeholder="Full name" value={user.name || ''} onChange={e=>setUser({...user, name: e.target.value})} className="w-full border p-2 rounded" />
          <input type="email" placeholder="Email" value={user.email || ''} onChange={e=>setUser({...user, email: e.target.value})} className="w-full border p-2 rounded" />
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="px-4 py-2 rounded" style={{background:'#8b5a3c', color:'#fff'}}>{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
