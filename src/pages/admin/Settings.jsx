// src/pages/admin/Settings.jsx
import React, { useEffect, useState } from 'react';
import { API_URL, authHeader } from '../../services/api';

export default function AdminSettings(){
  const [form, setForm] = useState({ siteTitle: '', headerText: '', logoUrl: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load(){
    const res = await fetch(`${API_URL}/settings`);
    const data = await res.json();
    setForm({ siteTitle: data.siteTitle||'', headerText: data.headerText||'', logoUrl: data.logoUrl||'' });
  }

  useEffect(()=>{ load(); }, []);

  async function uploadImage(){
    if(!file) return form.logoUrl;
    const fd = new FormData(); fd.append('image', file);
    const res = await fetch(`${API_URL}/upload`, { method:'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, body: fd });
    const j = await res.json(); return j.url;
  }

  async function save(e){
    e.preventDefault();
    try{
      setLoading(true);
      const logo = await uploadImage();
      const payload = { ...form, logoUrl: logo };
      const res = await fetch(`${API_URL}/settings`, { method:'PUT', headers:{ 'Content-Type':'application/json', ...authHeader() }, body: JSON.stringify(payload) });
      if(!res.ok) throw new Error('Failed');
      alert('Saved');
      load();
    }catch(err){ alert('Save failed'); console.error(err); } finally { setLoading(false); }
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <form onSubmit={save} className="bg-white p-6 rounded shadow space-y-3">
        <div>
          <label>Site title</label>
          <input value={form.siteTitle} onChange={e=>setForm({...form, siteTitle: e.target.value})} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Header text</label>
          <input value={form.headerText} onChange={e=>setForm({...form, headerText: e.target.value})} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Logo URL</label>
          <input value={form.logoUrl} onChange={e=>setForm({...form, logoUrl: e.target.value})} className="w-full border p-2 rounded" />
          <div className="mt-2">
            <input type="file" onChange={e=>setFile(e.target.files[0])} />
          </div>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-black text-white rounded">Save</button>
          <button type="button" onClick={load} className="px-4 py-2 border rounded">Reload</button>
        </div>
      </form>
    </div>
  );
}
