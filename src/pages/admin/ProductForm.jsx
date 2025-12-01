// src/pages/admin/ProductForm.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../services/axios.js';
import { useNavigate, useParams } from 'react-router-dom';
import slugify from '../../utils/slugify.js';

export default function ProductForm(){
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({
    title:'', slug:'', description:'', price:'', currency:'INR', category:'', images:[], thumbnail:'', inventory:0, variants:[], status:'draft',
    tags:[], seo:{ metaTitle:'', metaDescription:'', metaKeywords:[], ogImage:'' }
  });
  const [imagesToUpload, setImagesToUpload] = useState([]); // File[]
  const [categories, setCategories] = useState([]);
  const [newVariant, setNewVariant] = useState({ title:'', sku:'', price:'', inventory:'' });

  useEffect(()=>{
    axios.get('/categories').then(r=>setCategories(r.data || [])).catch(()=>setCategories([]));
    if (id) axios.get(`/products/${id}`).then(r=>setForm(prev => ({...prev, ...r.data}))).catch(()=>{});
  },[id]);

  function handleChange(e){
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function uploadImages(){
    if (imagesToUpload.length === 0) return [];
    const fd = new FormData();
    for (const f of imagesToUpload) fd.append('images', f);
    const res = await axios.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
    return res.data.uploaded.map(u => u.url);
  }

  async function save(e){
    e.preventDefault();
    try {
      // create slug if not present
      if (!form.slug && form.title) form.slug = slugify(form.title);

      const uploadedUrls = await uploadImages();
      const payload = { ...form };
      if (uploadedUrls.length) {
        payload.images = [...(payload.images||[]), ...uploadedUrls];
        if (!payload.thumbnail) payload.thumbnail = uploadedUrls[0];
      }
      // ensure metaKeywords array
      if (typeof payload.seo.metaKeywords === 'string') payload.seo.metaKeywords = payload.seo.metaKeywords.split(',').map(s=>s.trim()).filter(Boolean);

      if (id) await axios.put(`/products/${id}`, payload);
      else await axios.post('/products', payload);
      nav('/admin/products');
    } catch(err){ console.error('save product', err); alert('Save failed'); }
  }

  // fix accidental backtick typo in above: ensure correct POST endpoint
  // (will provide corrected code below to paste as complete file)

  function onFileChange(e){
    const files = Array.from(e.target.files || []);
    setImagesToUpload(files);
  }

  function addTag(value){
    if (!value) return;
    setForm(f => ({ ...f, tags: [...(f.tags||[]), value] }));
  }

  function removeTag(i){ setForm(f => ({ ...f, tags: f.tags.filter((_,idx)=>idx!==i) })); }

  function addVariant(){
    if (!newVariant.title) return alert('Variant title required');
    setForm(f=> ({ ...f, variants: [...(f.variants||[]), { ...newVariant, price: Number(newVariant.price||0), inventory: Number(newVariant.inventory||0) }] }));
    setNewVariant({ title:'', sku:'', price:'', inventory:'' });
  }

  function removeVariant(i){ setForm(f=> ({ ...f, variants: f.variants.filter((_,idx)=>idx!==i) })); }

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">{id ? 'Edit' : 'Add'} Product</h2>

      <form onSubmit={save} className="bg-white p-6 rounded shadow space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="title" value={form.title} onChange={(e)=>{ handleChange(e); if(!form.slug) setForm(s=>({...s, slug: slugify(e.target.value)})); }} placeholder="Title" className="border p-2 rounded" />
          <input name="slug" value={form.slug} onChange={(e)=>setForm(s=>({...s, slug: slugify(e.target.value)}))} placeholder="Slug (auto)" className="border p-2 rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="price" value={form.price} onChange={(e)=>setForm(s=>({...s, price: e.target.value}))} placeholder="Price" className="border p-2 rounded" />
          <input name="currency" value={form.currency} onChange={(e)=>setForm(s=>({...s, currency: e.target.value}))} placeholder="Currency" className="border p-2 rounded" />
        </div>

        <select name="category" value={form.category} onChange={handleChange} className="border p-2 rounded">
          <option value="">Select category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>

        <textarea name="description" value={form.description} onChange={handleChange} rows={6} placeholder="Description" className="border p-2 rounded" />

        <div>
          <label className="block mb-2">Images (choose multiple)</label>
          <input type="file" multiple accept="image/*" onChange={onFileChange} />
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {(form.images || []).map((u,i)=> <img key={i} src={u} className="h-24 w-24 object-cover rounded" alt="" />)}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="thumbnail" value={form.thumbnail || ''} onChange={handleChange} placeholder="Thumbnail URL (optional)" className="border p-2 rounded" />
          <input name="inventory" value={form.inventory} onChange={(e)=>setForm(s=>({...s, inventory: Number(e.target.value)}))} placeholder="Inventory" className="border p-2 rounded" />
        </div>

        <div className="p-3 border rounded space-y-2">
          <div className="font-semibold">Variants</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <input placeholder="Title" value={newVariant.title} onChange={e=>setNewVariant(v=>({...v, title:e.target.value}))} className="border p-2 rounded" />
            <input placeholder="SKU" value={newVariant.sku} onChange={e=>setNewVariant(v=>({...v, sku:e.target.value}))} className="border p-2 rounded" />
            <input placeholder="Price" value={newVariant.price} onChange={e=>setNewVariant(v=>({...v, price:e.target.value}))} className="border p-2 rounded" />
            <input placeholder="Inventory" value={newVariant.inventory} onChange={e=>setNewVariant(v=>({...v, inventory:e.target.value}))} className="border p-2 rounded" />
          </div>
          <div className="mt-2">
            <button type="button" onClick={addVariant} className="px-3 py-1 rounded" style={{background:'#8b5a3c', color:'#fff'}}>Add variant</button>
          </div>
          <div className="mt-2 space-y-2">
            {(form.variants || []).map((v, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1">{v.title} — SKU: {v.sku} — ₹{v.price} — {v.inventory}pcs</div>
                <button type="button" onClick={()=>removeVariant(i)} className="px-2 py-1 border rounded">Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          <input placeholder="Tags (type then press Enter)" onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); addTag(e.target.value); e.target.value=''; } }} className="border p-2 rounded" />

          <input placeholder="OG image URL (optional)" name="ogImage" value={form.seo?.ogImage || ''} onChange={e=>setForm(s=>({...s, seo:{...s.seo, ogImage: e.target.value}}))} className="border p-2 rounded" />
        </div>

        <div className="p-3 border rounded space-y-2">
          <div className="font-semibold">SEO</div>
          <input placeholder="Meta title" value={form.seo?.metaTitle || ''} onChange={e=>setForm(s=>({...s, seo:{...s.seo, metaTitle: e.target.value}}))} className="border p-2 rounded" />
          <textarea placeholder="Meta description" value={form.seo?.metaDescription || ''} onChange={e=>setForm(s=>({...s, seo:{...s.seo, metaDescription: e.target.value}}))} className="border p-2 rounded" rows={3} />
          <input placeholder="Meta keywords (comma separated)" value={(form.seo?.metaKeywords || []).join(', ')} onChange={e=>setForm(s=>({...s, seo:{...s.seo, metaKeywords: e.target.value.split(',').map(x=>x.trim()).filter(Boolean)}}))} className="border p-2 rounded" />
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 rounded text-white" style={{background:'#8b5a3c'}}>Save product</button>
          <button type="button" onClick={()=>nav('/admin/products')} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
