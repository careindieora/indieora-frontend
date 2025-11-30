// src/pages/admin/Categories.jsx
import React, { useEffect, useState } from 'react';
import { API_URL, authHeader } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Categories(){
  const [items, setItems] = useState([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ id:'', title:'', description:'' });

  useEffect(()=> fetchList(), []);

  function fetchList(){ fetch(`${API_URL}/categories`).then(r=>r.json()).then(setItems); }

  async function save(){
    try {
      if (!form.id || !form.title) return alert('id and title required');
      const res = await fetch(`${API_URL}/categories`, { method:'POST', headers: {'Content-Type':'application/json', ...authHeader() }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Failed');
      setForm({ id:'', title:'', description:'' });
      setCreating(false);
      fetchList();
    } catch (err) { alert('Save failed'); console.error(err); }
  }

  async function del(id){
    if (!confirm('Delete category?')) return;
    await fetch(`${API_URL}/categories/${encodeURIComponent(id)}`, { method:'DELETE', headers:{ ...authHeader() } });
    fetchList();
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Categories</h2>
          <button onClick={()=>setCreating(c=>!c)} className="px-3 py-2 border rounded">{creating ? 'Close' : 'New category'}</button>
        </div>

        {creating && (
          <div className="bg-white p-4 rounded mb-6">
            <input placeholder="id (e.g. glass)" value={form.id} onChange={e=>setForm({...form,id:e.target.value})} className="border px-3 py-2 rounded w-64" />
            <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="border px-3 py-2 rounded ml-2 w-64" />
            <div className="mt-2">
              <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full border px-3 py-2 rounded" />
            </div>
            <div className="mt-3">
              <button onClick={save} className="px-4 py-2 bg-black text-white rounded">Save</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map(c=>(
            <div key={c.id} className="bg-white p-4 rounded shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-xs text-gray-500">{c.id}</div>
                </div>
                <div className="flex gap-2">
                  {/* edit inline not implemented for brevity */}
                  <button onClick={()=>del(c.id)} className="px-2 py-1 border rounded">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
