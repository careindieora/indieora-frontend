// src/pages/admin/Settings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, authHeader } from "../../services/api";

export default function AdminSettings(){
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    announcement: "",
    logoUrl: "",
    nav: [{ title: "Home", href: "/" }],
    categories: [{ id: "glass", title: "Glass" }],
  });

  const navigate = useNavigate();

  useEffect(() => {
    (async ()=>{
      try{
        const res = await fetch(`${API_URL}/settings`);
        if (res.ok){
          const data = await res.json();
          if (data && Object.keys(data).length) setSettings({
            announcement: data.announcement || "",
            logoUrl: data.logoUrl || "",
            nav: data.nav && data.nav.length ? data.nav : [{ title: "Home", href: "/" }],
            categories: data.categories && data.categories.length ? data.categories : [{ id: "glass", title: "Glass" }],
          });
        }
      }catch(err){
        console.error(err);
      }finally{
        setLoading(false);
      }
    })();
  }, []);

  function updateNavItem(index, key, value){
    setSettings(s => {
      const copy = { ...s, nav: s.nav.map((n,i)=> i===index ? { ...n, [key]: value } : n) };
      return copy;
    });
  }
  function addNav(){ setSettings(s => ({ ...s, nav: [...s.nav, { title: "", href: "/" }] })); }
  function removeNav(i){ setSettings(s => ({ ...s, nav: s.nav.filter((_,idx)=>idx!==i) })); }

  function updateCategory(index, key, value){
    setSettings(s => {
      const copy = { ...s, categories: s.categories.map((c,i)=> i===index ? { ...c, [key]: value } : c) };
      return copy;
    });
  }
  function addCategory(){ setSettings(s => ({ ...s, categories: [...s.categories, { id: "", title: "" }] })); }
  function removeCategory(i){ setSettings(s => ({ ...s, categories: s.categories.filter((_,idx)=>idx!==i) })); }

  async function handleSave(e){
    e.preventDefault();
    setSaving(true);
    try{
      const res = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Save failed');
      }
      // show success and navigate back to admin dashboard
      alert('Settings saved');
      navigate('/admin');
    }catch(err){
      console.error(err);
      alert('Failed to save settings: ' + (err.message || err));
    }finally{
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6">Loading settings…</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Site Settings</h1>

      <form onSubmit={handleSave} className="space-y-6">

        <div>
          <label className="block text-sm font-medium text-gray-700">Announcement (top bar)</label>
          <input value={settings.announcement} onChange={e=>setSettings(s=>({...s, announcement: e.target.value}))}
                 className="mt-1 block w-full border rounded px-3 py-2" placeholder="Handmade pieces • Free shipping over ₹1999" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Logo URL</label>
          <input value={settings.logoUrl} onChange={e=>setSettings(s=>({...s, logoUrl: e.target.value}))}
                 className="mt-1 block w-full border rounded px-3 py-2" placeholder="https://..." />
          <p className="text-xs text-gray-500 mt-1">Optional. If empty header will show text logo.</p>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Navigation items</label>
            <button type="button" onClick={addNav} className="text-sm px-2 py-1 border rounded">Add</button>
          </div>
          <div className="mt-2 space-y-2">
            {settings.nav.map((n, i) => (
              <div key={i} className="flex gap-2">
                <input value={n.title} onChange={e=>updateNavItem(i,'title',e.target.value)} className="flex-1 border rounded px-2 py-1" placeholder="Title" />
                <input value={n.href} onChange={e=>updateNavItem(i,'href',e.target.value)} className="w-56 border rounded px-2 py-1" placeholder="/shop" />
                <button type="button" onClick={()=>removeNav(i)} className="px-2 py-1 border rounded">Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Categories</label>
            <button type="button" onClick={addCategory} className="text-sm px-2 py-1 border rounded">Add</button>
          </div>
          <div className="mt-2 space-y-2">
            {settings.categories.map((c, i)=>(
              <div key={i} className="flex gap-2">
                <input value={c.id} onChange={e=>updateCategory(i,'id',e.target.value)} className="w-40 border rounded px-2 py-1" placeholder="glass" />
                <input value={c.title} onChange={e=>updateCategory(i,'title',e.target.value)} className="flex-1 border rounded px-2 py-1" placeholder="Glass" />
                <button type="button" onClick={()=>removeCategory(i)} className="px-2 py-1 border rounded">Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-black text-white rounded">
            {saving ? 'Saving…' : 'Save settings'}
          </button>
          <button type="button" onClick={()=>navigate('/admin')} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
