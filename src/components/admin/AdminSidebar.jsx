// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const linkBase = 'block px-4 py-2 rounded-md transition';
const linkOff = `${linkBase} text-gray-700 hover:bg-clay-2`;
const linkOn = `${linkBase} bg-clay-4 text-white shadow`;

export default function AdminSidebar(){
  return (
    <aside className="hidden md:block w-64 bg-clay-1 border-r min-h-screen p-4">
      <div className="mb-6">
        <div className="text-2xl font-bold text-clay-4">Indieora Admin</div>
        <div className="text-xs text-gray-600 mt-1">Manage products, categories & site</div>
      </div>

      <nav className="space-y-1">
        <NavLink end to="/admin" className={({isActive}) => isActive ? linkOn : linkOff}>Dashboard</NavLink>
        <NavLink to="/admin/products" className={({isActive}) => isActive ? linkOn : linkOff}>Products</NavLink>
        <NavLink to="/admin/new" className={({isActive}) => isActive ? linkOn : linkOff}>Add Product</NavLink>
        <NavLink to="/admin/categories" className={({isActive}) => isActive ? linkOn : linkOff}>Categories</NavLink>
        <NavLink to="/admin/settings" className={({isActive}) => isActive ? linkOn : linkOff}>Settings</NavLink>
      </nav>
    </aside>
  );
}
