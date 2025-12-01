// src/pages/admin/Categories.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../services/axios.js';

export default function Categories(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ id:'', title:'' });

  async function load(){ try { const r = await axios.get('/categories'); setList(r.data || []); } catch(e){ setList([]); } }
  useEffect(()=>{ load(); }, []);

  async function save(){
    if(!form.id || !form.title) return alert('id & title required');
    await axios.post('/categories', form);
    setForm({ id:'', title:'' }); load();
  }

  async function remove(id){
    if(!confirm('Delete?')) return;
    await axios.delete(`/categories/${encodeURIComponent(id)}`);
    load();
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>

      <div className="bg-white p-4 rounded mb-4">
        <input placeholder="id e.g. glass" value={form.id} onChange={e=>setForm({...form, id:e.target.value})} className="border p-2 rounded mr-2" />
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="border p-2 rounded mr-2" />
        <button onClick={save} className="px-4 py-2 rounded" style={{background:'#8b5a3c', color:'#fff'}}>Save</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {list.map(c => (
          <div key={c.id} className="p-3 bg-white rounded flex items-center justify-between">
            <div>
              <div className="font-semibold">{c.title}</div>
              <div className="text-xs text-gray-500">{c.id}</div>
            </div>
            <div>
              <button onClick={()=>remove(c.id)} className="px-3 py-1 border rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
