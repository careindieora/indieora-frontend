// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import CartDrawer from './CartDrawer.jsx';
import { getUser, logout } from '../services/auth.js';

export default function Header(){
  const { items } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = getUser();
  const nav = useNavigate();

  const cartCount = items.reduce((s,i)=>s+Number(i.qty||0), 0);

  function handleLogout(){
    logout();
    nav('/');
    // optionally refresh
    window.location.reload();
  }

  return (
    <>
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo192.png" alt="logo" className="h-10 w-10 object-contain" />
            <div className="text-lg font-bold">Indieora</div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/shop" className="text-gray-700 hover:text-gray-900">Shop</Link>
            <Link to="/about" className="text-gray-700 hover:text-gray-900">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Cart button */}
            <button
              onClick={()=>setDrawerOpen(true)}
              aria-label="Open cart"
              className="relative p-2 rounded hover:bg-gray-50"
            >
              {/* cart icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 6m13-6l2 6m-9 0a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z"/>
              </svg>

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">{cartCount}</span>
              )}
            </button>

            {/* Profile / Login button */}
            <div className="relative">
              <button onClick={()=>setMenuOpen(s=>!s)} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                {/* profile icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1119.88 6.196 9 9 0 015.12 17.804z" />
                  <path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden sm:inline text-sm text-gray-700">{ user ? user.name || user.email : 'Account' }</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow z-50">
                  {user ? (
                    <div className="py-2">
                      <Link to="/profile" onClick={()=>setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-50">Profile</Link>
                      <Link to="/orders" onClick={()=>setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-50">Orders</Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-50">Logout</button>
                    </div>
                  ) : (
                    <div className="py-2">
                      <Link to="/login" onClick={()=>setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-50">Login</Link>
                      <Link to="/register" onClick={()=>setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-50">Register</Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {drawerOpen && <CartDrawer onClose={()=>setDrawerOpen(false)} />}
    </>
  );
}
