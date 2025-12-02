// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import axios from '../services/axios.js';
import { useNavigate } from 'react-router-dom';

export default function Checkout(){
  const { items, subtotal, clearCart } = useCart();
  const nav = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', phone:'', address:'' });
  const [loading, setLoading] = useState(false);

  async function placeOrder(e){
    e.preventDefault();
    if(items.length===0) return alert('Cart is empty');
    setLoading(true);
    try {
      const payload = {
        customer: { name: form.name, email: form.email, phone: form.phone, address: form.address },
        items: items.map(it => ({ productId: it.productId, title: it.title, qty: it.qty, price: it.price, variant: it.variant })),
        subtotal,
        status: 'pending',
        source: 'frontend'
      };
      // POST to backend
      const res = await axios.post('/orders', payload);
      // on success clear cart and navigate to order confirmation
      clearCart();
      nav(`/order-success/${res.data.orderId || res.data._id || ''}`);
    } catch (err) {
      console.error('placeOrder', err);
      alert('Order failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={placeOrder} className="col-span-2 bg-white p-4 rounded shadow space-y-3">
          <input placeholder="Full name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="border p-2 rounded" required />
          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="border p-2 rounded" required />
          <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} className="border p-2 rounded" />
          <textarea placeholder="Shipping address" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} className="border p-2 rounded" rows={4} required />

          <div className="mt-4">
            <button disabled={loading} className="px-4 py-2 rounded" style={{background:'#8b5a3c', color:'#fff'}}>{loading ? 'Placing order...' : 'Place order (stub)'}</button>
          </div>
        </form>

        <aside className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div className="space-y-2">
            {items.map(it => (
              <div key={it.key} className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{it.title}</div>
                  <div className="text-xs text-gray-500">{it.variant?.title || ''} x {it.qty}</div>
                </div>
                <div>₹ {it.price * it.qty}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">Subtotal</div>
            <div className="font-semibold">₹ {subtotal}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
