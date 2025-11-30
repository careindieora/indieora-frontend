// src/components/admin/AdminLayout.jsx
import React from "react";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-1">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-lg font-semibold">Admin</h1>
          <div></div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
