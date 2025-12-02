// src/components/Pagination.jsx
import React from 'react';

export default function Pagination({ page, setPage, limit, total }) {
  const totalPages = Math.max(1, Math.ceil((total || 0)/limit));
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page<=1} className="px-3 py-1 border rounded">Prev</button>
      <div className="px-3 py-1 border rounded">{page} / {totalPages}</div>
      <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page>=totalPages} className="px-3 py-1 border rounded">Next</button>
    </div>
  );
}
