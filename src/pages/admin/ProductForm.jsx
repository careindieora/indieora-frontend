// src/pages/admin/ProductForm.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../services/axios.js';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProductForm(){
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({ title:'', description:'', price:'', currency:'INR', category:'', images:[], tags:[] });
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(()=>{
    axios.get('/categories').then(r=>setCategories(r.data || [])).catch(()=>setCategories([]));
    if(id) axios.get(`/products/${id}`).then(r=>setForm({...form, ...r.data})).catch(()=>{});
    // eslint-disable-next-line
  },[id]);

  async function uploadImage(){
    if(!file) return null;
    const fd = new FormData(); fd.append('image', file);
    const r = await axios.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
    return r.data.url;
  }

  async function save(e){
    e.preventDefault();
    try{
      const url = await uploadImage();
      const pay = { ...form };
      if(url) pay.images = [...(form.images||[]), url];
      if(id) await axios.put(`/products/${id}`, pay);
      else await axios.post('/products', pay);
      nav('/admin/products');
    }catch(err){ alert('Save failed'); console.error(err); }
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">{id ? 'Edit' : 'Add'} Product</h2>
      <form onSubmit={save} className="bg-white p-6 rounded shadow space-y-3">
        <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Title" className="w-full border p-2 rounded" />
        <input value={form.price} onChange={e=>setForm({...form, price:e.target.value})} placeholder="Price" className="w-48 border p-2 rounded" />
        <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="border p-2 rounded">
          <option value="">Select category</option>
          {categories.map(c=> <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>

        <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} placeholder="Description" className="w-full border p-2 rounded" rows={5} />

        <div>
          <label>Upload image</label>
          <input type="file" onChange={e=>setFile(e.target.files[0])} />
          <div className="mt-2 flex gap-2">
            {(form.images||[]).map((u,i)=> <img key={i} src={u} className="h-20 w-20 object-cover rounded" />)}
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 rounded text-white" style={{background:'#8b5a3c'}}>Save</button>
          <button type="button" onClick={()=>nav(-1)} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
