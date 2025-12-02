// src/components/ProductFilters.jsx
import React from 'react';

export default function ProductFilters({ categories, selectedCategory, setSelectedCategory, q, setQ }) {
  return (
    <div className="space-y-3">
      <div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products..." className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="text-sm font-semibold block mb-2">Category</label>
        <select value={selectedCategory} onChange={e=>setSelectedCategory(e.target.value)} className="w-full border p-2 rounded">
          <option value="all">All categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>
    </div>
  );
}
