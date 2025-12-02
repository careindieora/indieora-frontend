// src/pages/OrderSuccess.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function OrderSuccess(){
  const { id } = useParams();
  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-3">Thank you! Your order is placed</h1>
        <p className="text-sm mb-4">Order reference: <strong>{id || 'n/a'}</strong></p>
        <Link to="/shop" className="px-4 py-2 rounded" style={{background:'#8b5a3c', color:'#fff'}}>Continue shopping</Link>
      </div>
    </div>
  );
}
