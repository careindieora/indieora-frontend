// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const img = (product.images && product.images[0]) || product.image || '/placeholder.png';
  return (
    <article className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition">
      <Link to={`/product/${product.slug || product._id}`}>
        <img src={img} alt={product.title} className="w-full h-56 object-cover" />
      </Link>
      <div className="p-3">
        <Link to={`/product/${product.slug || product._id}`} className="block font-semibold">{product.title}</Link>
        <div className="text-sm text-gray-500">{product.category}</div>
        <div className="mt-2 flex items-center justify-between">
          <div className="font-bold">₹ {product.price}</div>
          <Link to={`/product/${product.slug || product._id}`} className="text-xs px-3 py-1 border rounded">View</Link>
        </div>
      </div>
    </article>
  );
}
