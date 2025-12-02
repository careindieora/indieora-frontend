// src/components/CartDrawer.jsx
import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

export default function CartDrawer({ onClose }) {
  const { items, setQty, removeItem, subtotal } = useCart();
  const nav = useNavigate();

  return (
    <div className="fixed right-4 top-16 w-96 z-50 bg-white rounded shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Your cart</h3>
        <button onClick={onClose} className="text-sm text-gray-600">Close</button>
      </div>

      {items.length === 0 ? <div className="text-gray-500">Cart is empty</div> : (
        <div className="space-y-3 max-h-96 overflow-auto">
          {items.map(it => (
            <div key={it.key} className="flex gap-3 items-center">
              <img src={it.image || '/placeholder.png'} className="h-16 w-16 object-cover rounded" />
              <div className="flex-1">
                <div className="font-semibold">{it.title}</div>
                {it.variant && <div className="text-xs text-gray-500">{it.variant.title}</div>}
                <div className="text-sm">₹ {it.price}</div>
                <div className="mt-1 flex items-center gap-2">
                  <input type="number" value={it.qty} onChange={e=>setQty(it.key, e.target.value)} className="w-16 border p-1 rounded" min="1"/>
                  <button onClick={()=>removeItem(it.key)} className="text-xs text-red-600">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">Subtotal</div>
          <div className="font-semibold">₹ {subtotal}</div>
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={()=>nav('/checkout')} className="flex-1 px-3 py-2 rounded" style={{background:'#8b5a3c', color:'#fff'}}>Checkout</button>
          <Link to="/shop" className="px-3 py-2 border rounded">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
