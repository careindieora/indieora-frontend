// src/pages/admin/Categories.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../services/axios.js';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Categories(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ id:'', title:'', description:'', image:'', status:'active', seo:{ metaTitle:'', metaDescription:'', metaKeywords:[], ogImage:'' } });
  const [file, setFile] = useState(null);
  const [editing, setEditing] = useState(null);

  async function load(){
    try { const r = await axios.get('/categories'); setList(r.data.items || []); } catch(e){ setList([]); }
  }
  useEffect(()=>{ load(); }, []);

  async function uploadImage(){
    if(!file) return null;
    const fd = new FormData();
    fd.append('images', file); // backend upload expects 'images' array
    const r = await axios.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
    return r.data.uploaded?.[0]?.url || null;
  }

  async function save(){
    try {
      const url = await uploadImage();
      const payload = { ...form };
      if (url) { payload.image = url; payload.seo = { ...payload.seo, ogImage: payload.seo.ogImage || url }; }
      if (editing) {
        await axios.put(`/categories/${editing}`, payload);
      } else {
        await axios.post('/categories', payload);
      }
      setForm({ id:'', title:'', description:'', image:'', status:'active', seo:{ metaTitle:'', metaDescription:'', metaKeywords:[], ogImage:'' } });
      setFile(null);
      setEditing(null);
      load();
    } catch(err){ console.error(err); alert('Save failed'); }
  }

  function startEdit(cat){
    setEditing(cat.id);
    setForm({
      id: cat.id,
      title: cat.title,
      description: cat.description || '',
      image: cat.image || '',
      status: cat.status || 'active',
      seo: { ...(cat.seo || {}) }
    });
  }

  async function remove(id){
    if(!confirm('Delete category?')) return;
    await axios.delete(`/categories/${encodeURIComponent(id)}`);
    load();
  }

  // drag & drop reorder
  async function onDragEnd(result){
    if (!result.destination) return;
    const from = result.source.index;
    const to = result.destination.index;
    const items = Array.from(list);
    const [moved] = items.splice(from,1);
    items.splice(to,0,moved);
    setList(items);
    // send reorder ids to backend
    const ids = items.map(i=>i.id);
    await axios.post('/categories/reorder', { ids });
    load();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{editing ? 'Edit' : 'Add'} Category</h2>
      <div className="bg-white p-4 rounded mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input placeholder="id (slug) e.g. glass" value={form.id} onChange={e=>setForm({...form, id: e.target.value.trim()})} className="border p-2 rounded" />
          <input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="border p-2 rounded" />
          <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})} className="border p-2 rounded">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full border p-2 rounded mt-3" rows={3} />

        <div className="mt-3">
          <label className="block mb-1">Image</label>
          <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} />
          <div className="mt-2">
            {form.image && <img src={form.image} className="h-20 w-40 object-cover rounded" />}
          </div>
        </div>

        <div className="mt-3 p-3 border rounded">
          <div className="font-semibold mb-2">SEO</div>
          <input placeholder="Meta title" value={form.seo?.metaTitle || ''} onChange={e=>setForm({...form, seo:{...form.seo, metaTitle: e.target.value}})} className="w-full border p-2 rounded mb-2"/>
          <textarea placeholder="Meta description" value={form.seo?.metaDescription || ''} onChange={e=>setForm({...form, seo:{...form.seo, metaDescription: e.target.value}})} className="w-full border p-2 rounded mb-2" rows={3}></textarea>
          <input placeholder="Meta keywords (comma separated)" value={(form.seo?.metaKeywords || []).join(', ')} onChange={e=>setForm({...form, seo:{...form.seo, metaKeywords: e.target.value.split(',').map(x=>x.trim()).filter(Boolean)}})} className="w-full border p-2 rounded" />
        </div>

        <div className="mt-3 flex gap-2">
          <button onClick={save} className="px-4 py-2 rounded" style={{background:'#8b5a3c', color:'#fff'}}>Save</button>
          <button onClick={()=>{ setForm({ id:'', title:'', description:'', image:'', status:'active', seo:{ metaTitle:'', metaDescription:'', metaKeywords:[], ogImage:'' } }); setEditing(null); setFile(null); }} className="px-4 py-2 border rounded">Reset</button>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Categories (drag to reorder)</h3>

      <div className="bg-white p-3 rounded">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="cats">
            {(provided)=>(
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                {list.map((c, idx) => (
                  <Draggable key={c.id} draggableId={c.id} index={idx}>
                    {(p)=>(
                      <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} className="flex items-center justify-between border rounded p-3">
                        <div className="flex items-center gap-4">
                          {c.image ? <img src={c.image} className="h-16 w-24 object-cover rounded" /> : <div className="h-16 w-24 bg-gray-100 rounded" />}
                          <div>
                            <div className="font-semibold">{c.title}</div>
                            <div className="text-xs text-gray-500">{c.id} • {c.status}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={()=>startEdit(c)} className="px-3 py-1 border rounded">Edit</button>
                          <button onClick={()=>remove(c.id)} className="px-3 py-1 border rounded">Delete</button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
