// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../services/axios.js';
import AnalyticsChart from '../../components/admin/AnalyticsChart.jsx';

export default function Dashboard(){
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ products:0, categories:0, orders:0 });
  const [sales, setSales] = useState([]);
  const [latest, setLatest] = useState([]);

  async function load() {
    setLoading(true);
    try {
      const r = await axios.get('/admin/analytics');
      if (r?.data) {
        setTotals(r.data.totals || r.data.stats || { products:0, categories:0, orders:0 });
        setSales(r.data.sales || []);
        setLatest(r.data.latest || []);
      }
    } catch (err) {
      console.error('dashboard load', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ load(); }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="text-sm text-gray-500">Products</div>
          <div className="text-3xl font-bold text-clay-4">{loading ? '…' : totals.products}</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="text-sm text-gray-500">Categories</div>
          <div className="text-3xl font-bold text-clay-4">{loading ? '…' : totals.categories}</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="text-sm text-gray-500">Orders</div>
          <div className="text-3xl font-bold text-clay-4">{loading ? '…' : totals.orders}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart data={sales} />
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-semibold mb-4">Latest Products</h3>
          {latest.length === 0 ? <div className="text-gray-500">No recent products</div> : (
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
      </div>
    </div>
  );
}
