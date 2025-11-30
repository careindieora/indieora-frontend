// src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { API_URL } from '../services/api';

export default function Home(){
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 9;

  useEffect(()=>{
    let mounted = true;
    fetch(`${API_URL}/products?page=1&limit=200`)
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : (data.items || []);
        if(mounted) setProducts(arr);
      }).catch(err => {
        console.error(err);
      });
    return ()=> mounted = false;
  },[]);

  const categories = useMemo(()=>['all', ...Array.from(new Set(products.map(p=>p.category).filter(Boolean)))], [products]);

  const filtered = useMemo(()=> {
    let arr = products || [];
    if (category !== 'all') arr = arr.filter(p=>p.category === category);
    if (q.trim()) {
      const qq = q.trim().toLowerCase();
      arr = arr.filter(p => (p.title||'').toLowerCase().includes(qq) || (p.description||'').toLowerCase().includes(qq) || (p.tags||[]).some(t=>t.toLowerCase().includes(qq)));
    }
    return arr;
  }, [products, q, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(()=> { if (page > totalPages) setPage(1); }, [totalPages]);

  const pageItems = filtered.slice((page-1)*perPage, page*perPage);

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-3xl font-bold">Welcome to Indieora</h1>
        <p className="mt-2 text-gray-600">Handmade glass, clay and custom products — crafted by you, made by me.</p>
      </section>

      <section className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products..." className="border p-2 rounded w-64" />
          <select value={category} onChange={e=>{ setCategory(e.target.value); setPage(1); }} className="border p-2 rounded">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="text-sm text-gray-600">{filtered.length} result{filtered.length!==1?'s':''}</div>
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageItems.map(p => <ProductCard key={p._id || p.id} product={p} />)}
        </div>

        <div className="mt-8 flex items-center justify-center space-x-2">
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 border rounded">Prev</button>
          <div className="px-3 py-1 border rounded">Page {page} / {totalPages}</div>
          <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-3 py-1 border rounded">Next</button>
        </div>
      </section>
    </div>
  )
}
