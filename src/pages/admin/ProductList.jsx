// src/pages/admin/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { API_URL, authHeader } from '../../services/api';
import { Link } from 'react-router-dom';

export default function ProductList(){
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;
  const [q, setQ] = useState('');

  async function fetchPage(p=1){
    try {
      const res = await fetch(`${API_URL}/products?page=${p}&limit=${limit}&search=${encodeURIComponent(q)}`);
      const data = await res.json();
      const arr = Array.isArray(data) ? data : (data.items || []);
      setItems(arr);
      setTotal(data.total ?? arr.length);
    } catch(err){ console.error(err); setItems([]); setTotal(0); }
  }

  useEffect(()=>{ fetchPage(page); }, [page, q]);

  async function remove(id){
    if (!confirm('Delete product?')) return;
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE', headers: { ...authHeader() } });
    fetchPage(page);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="flex gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." className="border px-3 py-2 rounded" />
          <Link to="/admin/new" className="px-4 py-2 bg-black text-white rounded">Add product</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(p => (
          <div key={p._id || p.id} className="bg-white p-4 rounded shadow">
            <img src={(p.images && p.images[0]) || p.image || '/placeholder.png'} className="h-40 w-full object-cover mb-2" />
            <h3 className="font-semibold">{p.title}</h3>
            <div className="mt-2 flex justify-between">
              <div>₹ {p.price}</div>
              <div className="flex gap-2">
                <Link to={`/admin/edit/${p._id || p.id}`} className="px-2 py-1 border rounded">Edit</Link>
                <button onClick={()=>remove(p._id || p.id)} className="px-2 py-1 border rounded">Delete</button>
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
