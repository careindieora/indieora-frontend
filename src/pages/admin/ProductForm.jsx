// src/pages/admin/ProductForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL, authHeader } from '../../services/api';

export default function ProductForm(){
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({ title:'', description:'', price:'', currency:'INR', category:'', images:[], tags:[], seo:{metaTitle:'',metaDescription:''} });
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(()=> {
    fetch(`${API_URL}/categories`).then(r=>r.json()).then(setCategories).catch(()=>setCategories([]));
    if (id){
      fetch(`${API_URL}/products/${id}`).then(r=>r.json()).then(data => setForm({
        title: data.title||'', description: data.description||'', price:data.price||'', currency:data.currency||'INR',
        category:data.category||'', images:data.images||[], tags:data.tags||[], seo: data.seo||{metaTitle:'',metaDescription:''}
      }));
    }
  },[id]);

  async function uploadImage(){
    if (!file) return null;
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`${API_URL}/upload`, { method:'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, body: fd });
    const data = await res.json();
    return data.url;
  }

  async function save(e){
    e.preventDefault();
    try {
      const url = await uploadImage();
      const payload = { ...form };
      if (url) payload.images = [...(form.images||[]), url];
      const method = id ? 'PUT' : 'POST';
      const endpoint = id ? `${API_URL}/products/${id}` : `${API_URL}/products`;
      const res = await fetch(endpoint, { method, headers: {'Content-Type':'application/json', ...authHeader()}, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Save failed');
      nav('/admin/products');
    } catch(err){ alert('Save failed: ' + (err.message||err)); console.error(err); }
  }

  function addTagFromInput(e){
    if (e.key === 'Enter'){ e.preventDefault(); const v = e.target.value.trim(); if(v) setForm(s=>({...s, tags: [...(s.tags||[]), v]})); e.target.value=''; }
  }

  function removeTag(i){ setForm(s=>({...s, tags: s.tags.filter((_,idx)=>idx!==i)})); }

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={save} className="space-y-4 bg-white p-6 rounded shadow">
        <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Title" className="w-full border p-2 rounded" />
        <input value={form.price} onChange={e=>setForm({...form, price:e.target.value})} placeholder="Price" className="w-48 border p-2 rounded" />
        <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="border p-2 rounded">
          <option value="">Select category</option>
          {categories.map(c=> <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>

        <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} placeholder="Description" className="w-full border p-2 rounded" rows="5" />

        <div>
          <label className="block text-sm">Upload Image</label>
          <input type="file" onChange={e=>setFile(e.target.files[0])} />
          <div className="mt-2 flex gap-2">
            {(form.images||[]).map((u,i)=> <img key={i} src={u} className="h-20 w-20 object-cover rounded" />)}
          </div>
        </div>

        <div>
          <label className="block text-sm">Tags</label>
          <input onKeyDown={addTagFromInput} placeholder="Type a tag and press Enter" className="w-full border p-2 rounded" />
          <div className="mt-2 flex gap-2 flex-wrap">{(form.tags||[]).map((t,i)=>(<div key={i} className="px-3 py-1 bg-gray-100 rounded">{t} <button onClick={()=>removeTag(i)} className="ml-2 text-xs">x</button></div>))}</div>
        </div>

        <div className="p-3 border rounded">
          <div className="text-sm font-semibold mb-2">SEO</div>
          <input value={form.seo.metaTitle} onChange={e=>setForm({...form, seo:{...form.seo, metaTitle: e.target.value}})} placeholder="Meta title" className="w-full border p-2 rounded mb-2" />
          <textarea value={form.seo.metaDescription} onChange={e=>setForm({...form, seo:{...form.seo, metaDescription: e.target.value}})} placeholder="Meta description" className="w-full border p-2 rounded" />
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-black text-white rounded">Save</button>
          <button type="button" onClick={()=>nav('/admin/products')} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
