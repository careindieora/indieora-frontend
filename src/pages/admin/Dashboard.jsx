// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { API_URL } from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";

export default function AdminDashboard() {
  // productsList is always an array
  const [productsList, setProductsList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    try {
      setLoading(true);
      // request the first page with small limit for "recent" items
      const res = await fetch(`${API_URL}/products?page=1&limit=12`);
      const data = await res.json();

      // The backend returns either:
      // 1) { items: [...], total, page, limit }  OR
      // 2) an array of products [...], or 3) a single product object
      if (Array.isArray(data)) {
        setProductsList(data);
        setTotal(data.length);
      } else if (data && Array.isArray(data.items)) {
        setProductsList(data.items);
        setTotal(typeof data.total === "number" ? data.total : data.items.length);
      } else if (data && typeof data === "object") {
        // fallback: maybe API returned { ... } with product-like props — try to coerce
        setProductsList([]);
        setTotal(0);
      } else {
        setProductsList([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
      setProductsList([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // safe slice usage
  const recent = Array.isArray(productsList) ? productsList.slice(0, 5) : [];

  return (
    <AdminLayout>
      <div>
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-gray-500 text-sm">Total Products</div>
            <div className="text-3xl font-bold mt-1">{loading ? "…" : total}</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-gray-500 text-sm">Categories</div>
            <div className="text-3xl font-bold mt-1">3</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-gray-500 text-sm">Admin Status</div>
            <div className="text-3xl font-bold mt-1 text-green-600">Active</div>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Recent Products</h3>
            <button
              onClick={loadProducts}
              className="text-sm px-3 py-1 border rounded"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-sm text-gray-500">Loading…</div>
          ) : recent.length === 0 ? (
            <div className="text-gray-600">No products found.</div>
          ) : (
            <div className="space-y-4">
              {recent.map((p) => (
                <div
                  key={p._id || p.id || p.slug || Math.random()}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={(p.images && p.images[0]) || p.image || "/placeholder.png"}
                      alt={p.title || p.name || "Product"}
                      className="h-16 w-16 object-cover rounded"
                    />
                    <div>
                      <div className="font-semibold">{p.title || p.name || "Untitled"}</div>
                      <div className="text-sm text-gray-500">₹ {p.price ?? "-"}</div>
                    </div>
                  </div>

                  <div>
                    <a
                      href={`/admin/edit/${p._id || p.id}`}
                      className="px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
