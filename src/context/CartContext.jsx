// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export function useCart(){ return useContext(CartContext); }

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('indieora_cart') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('indieora_cart', JSON.stringify(items));
  }, [items]);

  function addToCart(product, qty = 1, variant = null){
    setItems(prev => {
      const copy = [...prev];
      const key = product._id + (variant ? `::${variant.sku||variant.title}` : '');
      const idx = copy.findIndex(i => i.key === key);
      if (idx >= 0) { copy[idx].qty += qty; }
      else {
        copy.push({ key, productId: product._id, title: product.title, price: product.price, image: (product.images && product.images[0]) || product.image, qty, variant });
      }
      return copy;
    });
  }

  function removeItem(key){
    setItems(prev => prev.filter(i => i.key !== key));
  }

  function setQty(key, qty){
    setItems(prev => prev.map(i => i.key === key ? ({...i, qty: Number(qty)}) : i));
  }

  function clearCart(){ setItems([]); }

  const subtotal = items.reduce((s, it) => s + (Number(it.price || 0) * Number(it.qty || 0)), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeItem, setQty, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}
