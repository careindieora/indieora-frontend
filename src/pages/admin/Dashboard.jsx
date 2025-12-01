// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../services/axios.js';

export default function Dashboard(){
  const [stats, setStats] = useState({ products:0, categories:0, orders:0 });
  const [latest, setLatest] = useState([]);

  async function load(){
    try{
      const r = await axios.get('/admin/stats');
      setStats(r.data.stats || { products:0, categories:0, orders:0 });
      setLatest(r.data.latest || []);
    }catch(e){
      console.error(e);
    }
  }

  useEffect(()=>{ load(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 bg-white rounded-lg p-6 shadow" style={{background:'#fff'}}>
          <div className="text-sm text-gray-500">Total products</div>
          <div className="text-3xl font-bold text-clay-4">{stats.products}</div>
        </div>
        <div className="flex-1 bg-white rounded-lg p-6 shadow">
          <div className="text-sm text-gray-500">Categories</div>
          <div className="text-3xl font-bold text-clay-4">{stats.categories}</div>
        </div>
        <div className="flex-1 bg-white rounded-lg p-6 shadow">
          <div className="text-sm text-gray-500">Orders (placeholder)</div>
          <div className="text-3xl font-bold text-clay-4">{stats.orders}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-semibold mb-4">Latest Products</h3>
          {latest.length===0 ? <div className="text-gray-500">No recent products</div> : (
            <ul className="space-y-3">
              {latest.map(p => (
                <li key={p._id} className="flex items-center gap-4">
                  <img src={(p.images && p.images[0]) || p.image || '/placeholder.png'} className="h-16 w-20 object-cover rounded" />
                  <div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm text-gray-500">₹ {p.price}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="flex gap-2 flex-wrap">
            <a href="/admin/new" className="px-4 py-2 rounded bg-clay-3 text-white">Add product</a>
            <a href="/admin/products" className="px-4 py-2 rounded border">Manage products</a>
            <a href="/admin/categories" className="px-4 py-2 rounded border">Manage categories</a>
          </div>
          <div className="mt-6 text-sm text-gray-500">Sales chart placeholder — integrate analytics when ready.</div>
        </div>
      </div>
    </div>
  );
}
