// src/components/ProductCard.jsx
import React from 'react';

export default function ProductCard({ product }) {
  const img = (product.images && product.images[0]) || product.image || product.img || '/placeholder.png';
  return (
    <article className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition bg-white">
      <div className="w-full h-48 bg-gray-100">
        <img src={img} alt={product.title} className="w-full h-48 object-cover" onError={(e)=>e.target.src='/placeholder.png'} />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{product.title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-lg font-bold">{product.currency || 'INR'} {product.price}</div>
          <button className="px-3 py-1 text-sm rounded-full border">Add</button>
        </div>
        <div className="mt-2 text-sm text-gray-500">{product.category}</div>
      </div>
    </article>
  )
}
