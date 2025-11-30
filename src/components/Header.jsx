// src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import { API_URL } from '../services/api';
import { Link } from 'react-router-dom';

export default function Header(){
  const [settings, setSettings] = useState({ siteTitle: 'Indieora', headerText: 'Handmade & Custom', logoUrl: '' });

  useEffect(()=>{
    fetch(`${API_URL}/settings`).then(r => r.json()).then(s => { if(s) setSettings(s); }).catch(()=>{});
  },[]);

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="logo" className="h-10 w-28 object-contain" onError={(e)=>e.target.style.display='none'} />
          ) : (
            <div className="text-xl font-bold">{settings.siteTitle}</div>
          )}
          <div className="text-sm text-gray-600 hidden sm:block">{settings.headerText}</div>
        </Link>

        <nav className="space-x-4">
          <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
          <Link to="/shop" className="text-gray-600 hover:text-gray-900">Shop</Link>
          <Link to="/admin" className="text-gray-600 hover:text-gray-900">Admin</Link>
        </nav>
      </div>
    </header>
  )
}
