// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { API_URL } from '../../services/api';

export default function AdminDashboard(){
  const [stats, setStats] = useState({ totalProducts: 0, categories: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load(){
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products?page=1&limit=6`);
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.items || []);
      setRecent(items);
      // total products: try data.total else length
      const total = data.total ?? (Array.isArray(data) ? data.length : items.length);
      // categories count: fetch categories
      const catsRes = await fetch(`${API_URL}/categories`);
      const cats = await catsRes.json();
      setStats({ totalProducts: total, categories: Array.isArray(cats) ? cats.length : 0 });
    } catch(err){
      console.error(err);
      setRecent([]);
    } finally { setLoading(false); }
  }

  useEffect(()=>{ load(); }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-gray-500 text-sm">Total Products</div>
          <div className="text-3xl font-bold mt-1">{loading ? '…' : stats.totalProducts}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-gray-500 text-sm">Categories</div>
          <div className="text-3xl font-bold mt-1">{loading ? '…' : stats.categories}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-gray-500 text-sm">Admin Status</div>
          <div className="text-3xl font-bold mt-1 text-green-600">Active</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Recent Products</h3>
        </div>
        {recent.length===0 ? <div className="text-gray-500">No recent products</div> : (
          <div className="space-y-4">
            {recent.map(p => (
              <div key={p._id || p.id} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <img src={(p.images && p.images[0]) || p.image || '/placeholder.png'} className="h-16 w-16 object-cover rounded" />
                  <div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm text-gray-500">₹ {p.price}</div>
                  </div>
                </div>
                <a href={`/admin/edit/${p._id || p.id}`} className="px-3 py-1 border rounded-md">Edit</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
