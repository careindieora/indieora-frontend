// src/pages/admin/ProductList.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../services/axios.js';
import { Link } from 'react-router-dom';

export default function ProductList(){
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const limit = 12;

  async function fetchPage(p=1){
    try{
      const res = await axios.get(`/products?page=${p}&limit=${limit}&search=${encodeURIComponent(q)}`);
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
    }catch(e){ console.error(e); setItems([]); setTotal(0); }
  }

  useEffect(()=>{ fetchPage(page); }, [page, q]);

  function toggleSelect(id){
    setSelected(s=>{
      const c = new Set(s);
      if (c.has(id)) c.delete(id); else c.add(id);
      return c;
    });
  }

  async function bulkUpdate(status){
    if(selected.size===0) return alert('Select products first');
    const ids = Array.from(selected);
    await axios.put('/products/bulk/status', { ids, status });
    setSelected(new Set());
    fetchPage(page);
  }

  async function remove(id){
    if(!confirm('Delete?')) return;
    await axios.delete(`/products/${id}`);
    fetchPage(page);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="flex gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." className="border px-3 py-2 rounded" />
          <Link to="/admin/new" className="px-4 py-2 bg-clay-3 text-white rounded">Add product</Link>
        </div>
      </div>

      <div className="mb-3 flex gap-2">
        <button onClick={()=>bulkUpdate('published')} className="px-3 py-1 border rounded">Publish</button>
        <button onClick={()=>bulkUpdate('draft')} className="px-3 py-1 border rounded">Unpublish</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(p => (
          <div key={p._id} className="bg-white rounded shadow">
            <div className="relative">
              <img src={(p.images && p.images[0]) || p.image || '/placeholder.png'} className="h-48 w-full object-cover" />
              <input type="checkbox" checked={selected.has(p._id)} onChange={()=>toggleSelect(p._id)} className="absolute top-2 left-2 bg-white p-1" />
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-xs text-gray-500">{p.category} • {p.status}</div>
                </div>
                <div className="text-sm">₹ {p.price}</div>
              </div>

              <div className="mt-3 flex gap-2">
                <Link to={`/admin/edit/${p._id}`} className="px-3 py-1 border rounded">Edit</Link>
                <button onClick={()=>remove(p._id)} className="px-3 py-1 border rounded">Delete</button>
              </div>

              <div className="mt-2 text-xs text-gray-500">
                Stock: {p.inventory ?? (p.variants?.reduce((s,v)=>s+Number(v.inventory||0),0) || 0)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>Showing {items.length} of {total}</div>
        <div className="flex gap-2">
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 border rounded">Prev</button>
          <div className="px-3 py-1 border rounded">{page}</div>
          <button onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
}
