// src/components/Header.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Header component
 * - Responsive header inspired by potterykaari.com
 * - Loads dynamic `settings` from /api/settings (if available)
 * - Shows promo bar, logo, nav, category dropdown, search, cart, admin quick link
 *
 * Notes:
 * - Backend API: GET /api/settings  -> should return { announcement, nav: [{title,href}], categories: [...], logoUrl }
 * - Admin management: later we'll add an Admin -> Settings page to CRUD these values.
 */

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [settings, setSettings] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    let mounted = true;
    // try load settings from backend; fallback to defaults
    (async () => {
      try {
        const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/api$/, "");
        const res = await fetch(`${base}/api/settings`);
        if (!mounted) return;
        if (!res.ok) throw new Error("no settings");
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        // fallback defaults (safe)
        setSettings({
          announcement: "Handmade pieces • Free shipping over ₹1999",
          nav: [
            { title: "Home", href: "/" },
            { title: "Shop", href: "/shop" },
            { title: "About", href: "/about" },
            { title: "Contact", href: "/contact" }
          ],
          categories: [
            { id: "glass", title: "Glass" },
            { id: "clay", title: "Clay" },
            { id: "custom", title: "Custom" }
          ],
          logoUrl: ""
        });
      }
    })();

    return () => { mounted = false; };
  }, []);

  function onSearchSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    setMobileOpen(false);
  }

  return (
    <header className="w-full sticky top-0 z-40 bg-white shadow-sm">
      {/* top announcement bar */}
      <div className="bg-amber-50 text-amber-900 text-sm">
        <div className="container mx-auto px-4 py-2 flex items-center justify-center">
          <div className="text-center">
            {settings ? settings.announcement : "Handmade pieces • Free shipping over ₹1999"}
          </div>
        </div>
      </div>

      {/* main header */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">

        {/* left: logo + category (desktop) */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="Indieora" className="h-10 w-auto object-contain" />
            ) : (
              <div className="text-2xl font-bold">Indieora</div>
            )}
          </Link>

          {/* Category dropdown (visible md+) */}
          <div className="hidden md:block relative">
            <button
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
              className="px-3 py-2 rounded-md border text-gray-700 hover:bg-gray-50"
            >
              Categories ▾
            </button>

            {catOpen && (
              <div onMouseEnter={()=>setCatOpen(true)} onMouseLeave={()=>setCatOpen(false)} className="absolute mt-2 bg-white border rounded shadow-lg w-56">
                <div className="p-2">
                  {(settings?.categories || []).map(cat => (
                    <Link key={cat.id || cat.title} to={`/shop?category=${encodeURIComponent(cat.id || cat.title)}`} className="block px-3 py-2 rounded hover:bg-gray-50">
                      {cat.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* center: nav (desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-gray-700">
          {(settings?.nav || []).map(item => (
            <Link key={item.href} to={item.href} className="hover:text-gray-900">
              {item.title}
            </Link>
          ))}
        </nav>

        {/* right: search + cart + admin/account */}
        <div className="flex items-center gap-3">

          {/* search (desktop) */}
          <form onSubmit={onSearchSubmit} className="hidden md:flex items-center border rounded-md overflow-hidden">
            <input
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              placeholder="Search products..."
              className="px-3 py-2 w-56 focus:outline-none"
            />
            <button type="submit" className="px-3 py-2 bg-black text-white">Search</button>
          </form>

          {/* cart */}
          <Link to="/cart" className="px-3 py-2 border rounded-md text-gray-700 hover:bg-gray-50">
            🛒
            <span className="ml-2 hidden sm:inline">Cart</span>
          </Link>

          {/* admin / account */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/admin" className="px-3 py-2 border rounded-md text-sm">Dashboard</Link>
              <button onClick={()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/' }} className="px-3 py-2 border rounded-md text-sm">Logout</button>
            </div>
          ) : (
            <Link to="/admin/login" className="px-3 py-2 bg-black text-white rounded-md text-sm">Admin</Link>
          )}

          {/* mobile menu toggle */}
          <button onClick={()=>setMobileOpen(v=>!v)} className="md:hidden px-3 py-2 ml-2 border rounded-md">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3">
            <form onSubmit={onSearchSubmit} className="flex items-center gap-2 mb-3">
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search products..." className="flex-1 px-3 py-2 border rounded-md" />
              <button type="submit" className="px-3 py-2 bg-black text-white rounded-md">Search</button>
            </form>

            <div className="flex flex-col gap-2">
              {(settings?.nav || []).map(i => (
                <Link key={i.href} to={i.href} onClick={()=>setMobileOpen(false)} className="block px-3 py-2 rounded hover:bg-gray-50">{i.title}</Link>
              ))}

              <div className="border-t mt-2 pt-2">
                <div className="font-medium text-sm mb-1">Categories</div>
                {(settings?.categories || []).map(cat => (
                  <Link key={cat.id || cat.title} to={`/shop?category=${encodeURIComponent(cat.id || cat.title)}`} onClick={()=>setMobileOpen(false)} className="block px-3 py-2 rounded hover:bg-gray-50">{cat.title}</Link>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                <Link to="/cart" onClick={()=>setMobileOpen(false)} className="flex-1 px-3 py-2 border text-center rounded-md">Cart</Link>
                {user ? (
                  <button onClick={()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href='/'; }} className="flex-1 px-3 py-2 border rounded-md">Logout</button>
                ) : (
                  <Link to="/admin/login" onClick={()=>setMobileOpen(false)} className="flex-1 px-3 py-2 bg-black text-white text-center rounded-md">Admin</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
