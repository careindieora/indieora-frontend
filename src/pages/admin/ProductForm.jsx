// src/pages/admin/ProductForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL, authHeader } from '../../services/api';

export default function ProductForm(){
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: '', description:'', price:'', currency:'INR', category:'', images:[], tags:[], seo:{metaTitle:'', metaDescription:''}
  });
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(()=>{
    fetch(`${API_URL}/categories`).then(r=>r.json()).then(setCategories);
    if (id){
      fetch(`${API_URL}/products/${id}`).then(r=>r.json()).then(data => {
        // normalize
        setForm({
          title: data.title || '',
          description: data.description || '',
          price: data.price || '',
          currency: data.currency || 'INR',
          category: data.category || '',
          images: data.images || [],
          tags: data.tags || [],
          seo: data.seo || { metaTitle:'', metaDescription:'' }
        });
      });
    }
  },[id]);

  async function uploadImage(){
    if (!file) return null;
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`${API_URL}/upload`, { method:'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, body: fd });
    if (!res.ok) throw new Error('Upload failed');
    const j = await res.json();
    return j.url;
  }

  function addTag(t){
    if (!t) return;
    setForm(s=>({...s, tags: [...(s.tags||[]), t]}));
  }

  function removeTag(i){ setForm(s=>({...s, tags: s.tags.filter((_,idx)=>idx!==i)})); }

  async function handleSave(e){
    e.preventDefault();
    try {
      let imageUrl = null;
      if (file) {
        imageUrl = await uploadImage();
      }
      const payload = { ...form };
      if (imageUrl) payload.images = [...(form.images||[]), imageUrl];
      const method = id ? 'PUT' : 'POST';
      const url = id ? `${API_URL}/products/${id}` : `${API_URL}/products`;
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Save failed');
      }
      nav('/admin');
    } catch (err) {
      alert('Save failed: ' + (err.message || err));
      console.error(err);
    }
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">{ id ? 'Edit Product' : 'Add Product' }</h2>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm">Title</label>
          <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm">Price (INR)</label>
          <input type="number" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} className="w-48 border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm">Category</label>
          <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="w-64 border px-3 py-2 rounded">
            <option value="">Select category</option>
            {categories.map(c=> <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm">Description</label>
          <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} className="w-full border px-3 py-2 rounded" rows="5" />
        </div>

        <div>
          <label className="block text-sm">Image (upload)</label>
          <input type="file" onChange={e=>setFile(e.target.files[0])} />
          <div className="mt-2 flex gap-2">
            {(form.images||[]).map((u,i)=> <img key={i} src={u} className="h-20 w-20 object-cover rounded" />)}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm">Tags (comma separated)</label>
          <input onKeyDown={e=>{ if (e.key==='Enter'){ e.preventDefault(); addTag(e.target.value); e.target.value=''; }}} placeholder="Type tag and press Enter" className="w-full border px-3 py-2 rounded" />
          <div className="mt-2 flex gap-2 flex-wrap">
            {(form.tags||[]).map((t,i)=>(
              <div key={i} className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-2">
                <span className="text-sm">{t}</span>
                <button type="button" onClick={()=>removeTag(i)} className="text-xs">x</button>
              </div>
            ))}
          </div>
        </div>

        {/* SEO panel */}
        <div className="p-4 border rounded">
          <div className="text-sm font-semibold mb-2">SEO / Metadata</div>
          <div className="mb-2">
            <label className="block text-xs">Meta Title</label>
            <input value={form.seo?.metaTitle || ''} onChange={e=>setForm(s=>({...s, seo:{...s.seo, metaTitle: e.target.value}}))} className="w-full border px-2 py-1 rounded" />
          </div>
          <div>
            <label className="block text-xs">Meta Description</label>
            <textarea value={form.seo?.metaDescription || ''} onChange={e=>setForm(s=>({...s, seo:{...s.seo, metaDescription: e.target.value}}))} className="w-full border px-2 py-1 rounded" rows="3" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="px-4 py-2 bg-black text-white rounded">Save</button>
          <button type="button" onClick={()=>nav('/admin')} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
