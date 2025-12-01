// src/components/admin/AdminLayout.jsx
import React from 'react';
import AdminSidebar from './AdminSidebar';
import { Outlet, Link } from 'react-router-dom';

export default function AdminLayout(){
  return (
    <div className="min-h-screen flex bg-clay-1">
      <AdminSidebar />
      <div className="flex-1">
        <header style={{background:'#fff'}} className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-lg font-bold text-clay-4">← Public site</Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">Admin</div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
