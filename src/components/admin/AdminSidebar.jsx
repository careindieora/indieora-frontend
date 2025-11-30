// src/components/admin/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const linkClass =
    "block px-4 py-2.5 rounded-md text-gray-700 hover:bg-gray-100 transition";

  const activeClass =
    "block px-4 py-2.5 rounded-md bg-black text-white transition";

  return (
    <aside className="w-60 h-screen border-r bg-white p-4 hidden md:block sticky top-0">
      <h2 className="text-xl font-bold mb-6 pl-2">Admin Panel</h2>

      <nav className="space-y-1">

        <NavLink
          to="/admin"
          end
          className={({ isActive }) => (isActive ? activeClass : linkClass)}
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) => (isActive ? activeClass : linkClass)}
        >
          📦 Products
        </NavLink>

        <NavLink
          to="/admin/new"
          className={({ isActive }) => (isActive ? activeClass : linkClass)}
        >
          ➕ Add Product
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) => (isActive ? activeClass : linkClass)}
        >
          ⚙️ Settings
        </NavLink>

      </nav>
    </aside>
  );
}
