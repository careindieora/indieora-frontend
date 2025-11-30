// src/pages/admin/Categories.jsx
import React, { useEffect, useState } from 'react';
import { API_URL, authHeader } from '../../services/api';

export default function Categories(){
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ id:'', title:'', description:'' });
  const [editingId, setEditingId] = useState(null);

  function fetchList(){ fetch(`${API_URL}/categories`).then(r=>r.json()).then(setItems).catch(()=>setItems([])); }
  useEffect(()=> fetchList(), []);

  async function save(){
    try{
      if(!form.id || !form.title) return alert('id & title required');
      const res = await fetch(`${API_URL}/categories`, { method:'POST', headers: {'Content-Type':'application/json', ...authHeader()}, body: JSON.stringify(form) });
      if(!res.ok) throw new Error('Failed');
      setForm({ id:'', title:'', description:'' });
      fetchList();
    }catch(e){ alert('Failed to save'); console.error(e); }
  }

  async function remove(id){
    if(!confirm('Delete category?')) return;
    await fetch(`${API_URL}/categories/${encodeURIComponent(id)}`, { method:'DELETE', headers: {...authHeader()} });
    fetchList();
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Categories</h2>
      </div>

      <div className="bg-white p-4 rounded mb-6">
        <input placeholder="id (glass)" value={form.id} onChange={e=>setForm({...form,id:e.target.value})} className="border p-2 rounded mr-2" />
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="border p-2 rounded mr-2" />
        <button onClick={save} className="px-4 py-2 bg-black text-white rounded">Save</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(c=>(
          <div key={c.id} className="bg-white p-4 rounded shadow flex items-center justify-between">
            <div>
              <div className="font-semibold">{c.title}</div>
              <div className="text-xs text-gray-500">{c.id}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>remove(c.id)} className="px-2 py-1 border rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
