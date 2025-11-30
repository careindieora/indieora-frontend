// src/components/admin/AdminLayout.jsx
import React from "react";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 bg-gray-50 min-h-screen">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-xl font-semibold">Indieora Admin</h1>
        </header>

        <div className="p-6">
          {/* Render nested admin routes here */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
