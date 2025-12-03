// src/components/Header.jsx
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../CartContext.jsx";
import CartDrawer from "./CartDrawer.jsx";
import { getUser, logout } from "../services/auth.js";

export default function Header() {
  const navigate = useNavigate();
  const { items = [] } = useCart() || {}; // safe fallback
  const [isCartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const user = getUser();
  const cartCount = Array.isArray(items)
    ? items.reduce((sum, item) => sum + (item.quantity || 1), 0)
    : 0;

  const handleAccountClick = () => {
    if (!user) {
      navigate("/account");
    } else {
      setMenuOpen((v) => !v);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center text-sm font-semibold">
              I
            </div>
            <span className="font-semibold text-lg tracking-wide">
              Indieora
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `hover:text-amber-800 ${
                  isActive ? "text-amber-800 font-medium" : "text-gray-700"
                }`
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hover:text-amber-800 ${
                  isActive ? "text-amber-800 font-medium" : "text-gray-700"
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `hover:text-amber-800 ${
                  isActive ? "text-amber-800 font-medium" : "text-gray-700"
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-full border border-gray-200 hover:border-amber-700 hover:text-amber-800 transition"
            >
              <span className="material-icons text-base">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account / Profile */}
            <div className="relative">
              <button
                type="button"
                onClick={handleAccountClick}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-amber-700 hover:text-amber-800 text-sm transition"
              >
                <span className="material-icons text-base">account_circle</span>
                <span className="hidden sm:inline">
                  {user ? user.name || "My account" : "Account"}
                </span>
              </button>

              {/* Dropdown when logged in */}
              {user && menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-2 text-sm">
                  <button
                    onClick={() => navigate("/account")}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button (optional) */}
            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="md:hidden p-2 text-gray-700"
            >
              <span className="material-icons text-base">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Cart drawer component */}
      <CartDrawer open={isCartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
