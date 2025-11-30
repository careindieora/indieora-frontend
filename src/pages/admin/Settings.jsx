// src/pages/admin/Settings.jsx
import React, { useEffect, useState } from 'react';
import { API_URL, authHeader } from '../../services/api';
import { getUser } from '../../services/auth';
import AdminLayout from '../../components/admin/AdminLayout'; // adjust if your layout path differs

export default function AdminSettings() {
  const [form, setForm] = useState({ siteTitle: '', headerText: '', logoUrl: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      const res = await fetch(`${API_URL}/settings`);
      const data = await res.json();
      setForm({ siteTitle: data.siteTitle || '', headerText: data.headerText || '', logoUrl: data.logoUrl || '' });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { load(); }, []);

  async function uploadImage() {
    if (!file) return form.logoUrl;
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // upload route expects token
      body: fd
    });
    const data = await res.json();
    return data.url || form.logoUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const logoUrl = await uploadImage();
      const payload = { ...form, logoUrl };
      const res = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Save failed');
      const data = await res.json();
      setForm({ siteTitle: data.siteTitle, headerText: data.headerText, logoUrl: data.logoUrl });
      alert('Settings saved');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Site Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700">Site title</label>
            <input
              value={form.siteTitle}
              onChange={e => setForm({...form, siteTitle: e.target.value})}
              className="mt-1 block w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Header text / Tagline</label>
            <input
              value={form.headerText}
              onChange={e => setForm({...form, headerText: e.target.value})}
              className="mt-1 block w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Logo (current)</label>
            <div className="flex items-center gap-4 mt-2">
              {form.logoUrl ? (
                <img src={form.logoUrl} alt="logo" className="h-16 w-32 object-contain border" />
              ) : (
                <div className="h-16 w-32 bg-gray-100 flex items-center justify-center text-sm text-gray-500 border">No logo</div>
              )}
              <div className="text-sm text-gray-500">{form.logoUrl}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Upload new logo (or leave blank)</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="mt-2" />
            <div className="mt-2 text-sm text-gray-500">Or paste an image URL below</div>
            <input
              value={form.logoUrl}
              onChange={e => setForm({...form, logoUrl: e.target.value})}
              placeholder="https://..."
              className="mt-1 block w-full border p-2 rounded"
            />
          </div>

          <div className="flex gap-3">
            <button disabled={loading} className="px-4 py-2 bg-black text-white rounded">Save</button>
            <button type="button" onClick={load} className="px-4 py-2 border rounded">Reload</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
