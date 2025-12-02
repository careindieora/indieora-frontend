// src/pages/Shop.jsx
import React, { useEffect, useState } from 'react';
import axios from '../services/axios.js';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import Pagination from '../components/Pagination';

export default function Shop(){
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  async function loadCats(){
    try { const r = await axios.get('/categories'); setCategories(r.data.items || []); } catch(e){ setCategories([]); }
  }

  async function loadProducts(pageNum = 1){
    try {
      const res = await axios.get(`/products?page=${pageNum}&limit=${limit}&search=${encodeURIComponent(q)}&category=${selectedCategory}`);
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('shop load', err);
      setItems([]); setTotal(0);
    }
  }

  useEffect(()=>{ loadCats(); }, []);
  useEffect(()=>{ setPage(1); loadProducts(1); }, [q, selectedCategory]);
  useEffect(()=>{ loadProducts(page); }, [page]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <ProductFilters categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} q={q} setQ={setQ} />
        </aside>

        <section className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(p => <ProductCard key={p._id} product={p} />)}
          </div>

          <Pagination page={page} setPage={setPage} total={total} limit={limit} />
        </section>
      </div>
    </div>
  );
}
