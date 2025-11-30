// src/pages/admin/List.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL, authHeader } from "../../services/api";

export default function AdminList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error(`Server error (${res.status})`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      setErr(error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { ...authHeader() }
      });
      if (!res.ok) {
        const body = await res.json().catch(()=>({}));
        throw new Error(body?.message || `Failed to delete (${res.status})`);
      }
      // optimistic update
      setProducts(prev => prev.filter(p => p._id !== id && p.id !== id));
    } catch (error) {
      alert(error.message || 'Delete failed');
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '36px auto', padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h1 style={{ fontSize: 24 }}>Manage Products</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={fetchProducts} style={{ padding: '8px 12px', borderRadius: 6 }}>Refresh</button>
          <Link to="/admin/new" style={{ background: '#111', color:'#fff', padding: '8px 12px', borderRadius: 6, textDecoration: 'none' }}>+ New</Link>
        </div>
      </div>

      {loading ? <div>Loading products…</div> : null}
      {err ? <div style={{ color: 'crimson', marginBottom: 12 }}>{err}</div> : null}

      {!loading && products.length === 0 && <div>No products yet — add your first product.</div>}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 16
      }}>
        {products.map(p => (
          <div key={p._id || p.id} style={{
            border: '1px solid #eee',
            borderRadius: 10,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
          }}>
            <div style={{ height: 160, background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {p.image ? (
                <img src={p.image} alt={p.title} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ color: '#999' }}>No image</div>
              )}
            </div>

            <div style={{ padding: 12, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontWeight: 700 }}>{p.title}</div>
              <div style={{ color: '#666', marginTop: 6 }}>{p.category || '—'}</div>
              <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
                <Link to={`/admin/edit/${p._id || p.id}`} style={{ padding: '8px 10px', border: '1px solid #ddd', borderRadius: 8, textDecoration: 'none' }}>Edit</Link>
                <button onClick={() => handleDelete(p._id || p.id)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #ddd', background: '#fff' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
