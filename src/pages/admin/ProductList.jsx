// src/pages/admin/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { API_URL, authHeader } from '../../services/api';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

export default function ProductList(){
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');

  useEffect(()=> { fetchPage(); }, [page]);

  async function fetchPage(){
    const res = await fetch(`${API_URL}/products?page=${page}&limit=12&search=${encodeURIComponent(q)}`);
    const data = await res.json();
    setItems(data.items || []);
    setTotal(data.total || 0);
  }

  async function del(id){
    if (!confirm('Delete product?')) return;
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE', headers: { ...authHeader() } });
    fetchPage();
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="flex gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." className="border px-3 py-2 rounded" />
          <button onClick={()=>{ setPage(1); fetchPage(); }} className="px-3 py-2 border rounded">Search</button>
          <Link to="/admin/new" className="px-4 py-2 bg-black text-white rounded">Add product</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(p => (
          <div key={p._id} className="bg-white rounded p-3 shadow">
            <img src={(p.images && p.images[0]) || '/placeholder.png'} alt={p.title} className="h-40 w-full object-cover rounded" />
            <h3 className="font-semibold mt-2">{p.title}</h3>
            <div className="flex items-center justify-between mt-2">
              <div>₹ {p.price}</div>
              <div className="flex gap-2">
                <Link to={`/admin/edit/${p._id}`} className="px-2 py-1 border rounded">Edit</Link>
                <button onClick={()=>del(p._id)} className="px-2 py-1 border rounded">Delete</button>
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
    </AdminLayout>
  );
}
