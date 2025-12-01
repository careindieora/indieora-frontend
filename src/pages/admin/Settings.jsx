// src/pages/admin/Settings.jsx
import React, { useEffect, useState } from 'react';
import { fetchSettings, saveSettings } from '../../services/settings.js';
import { uploadFiles } from '../../services/upload.js';
import toast from 'react-hot-toast';

function LogoPreview({ logo, siteName }) {
  return (
    <div className="flex items-center gap-3">
      {logo ? <img src={logo} alt="logo" className="h-12 w-12 object-contain" /> :
        <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center text-sm">{siteName?.[0] || 'I'}</div>}
      <div>
        <div className="font-bold text-lg">{siteName}</div>
        <div className="text-sm text-gray-500">Live header preview</div>
      </div>
    </div>
  );
}

export default function AdminSettings(){
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);

  useEffect(()=>{
    (async ()=>{
      const s = await fetchSettings();
      setSettings(s);
    })();
  },[]);

  if (!settings) return <div>Loading...</div>;

  async function handleSave(e){
    e.preventDefault();
    setLoading(true);
    try {
      // handle uploads
      if (logoFile) {
        const urls = await uploadFiles([logoFile]);
        settings.logo = urls[0] || settings.logo;
      }
      if (faviconFile) {
        const urls = await uploadFiles([faviconFile]);
        settings.favicon = urls[0] || settings.favicon;
      }
      // send updated settings to backend
      const res = await saveSettings(settings);
      setSettings(res.settings || settings);
      toast.success('Settings saved');
    } catch (err) {
      console.error('save settings', err);
      toast.error('Save failed');
    } finally {
      setLoading(false);
      setLogoFile(null);
      setFaviconFile(null);
    }
  }

  function setHeaderMenuAt(idx, key, value){
    const menu = settings.header?.menu ? [...settings.header.menu] : [];
    menu[idx] = { ...(menu[idx]||{}), [key]: value };
    setSettings(s => ({ ...s, header: { ...(s.header||{}), menu } }));
  }
  function addHeaderLink(){ const menu = settings.header?.menu||[]; menu.push({ id: `link-${Date.now()}`, title: 'New link', url: '/', openInNewTab:false }); setSettings(s=>({...s, header:{...(s.header||{}), menu}})); }
  function removeHeaderLink(idx){ const menu = [...(settings.header?.menu||[])]; menu.splice(idx,1); setSettings(s=>({...s, header:{...(s.header||{}), menu}})); }

  function setFooterLinkAt(idx, key, value){
    const links = settings.footer?.links ? [...settings.footer.links] : [];
    links[idx] = { ...(links[idx]||{}), [key]: value };
    setSettings(s => ({ ...s, footer: { ...(s.footer||{}), links } }));
  }
  function addFooterLink(){ const links = settings.footer?.links||[]; links.push({ id:`link-${Date.now()}`, title:'New', url:'/', openInNewTab:false }); setSettings(s=>({...s, footer:{...(s.footer||{}), links}})); }
  function removeFooterLink(idx){ const links = [...(settings.footer?.links||[])]; links.splice(idx,1); setSettings(s=>({...s, footer:{...(s.footer||{}), links}})); }

  function setThemeColor(key, value){
    setSettings(s => ({ ...s, theme: { ...(s.theme||{}), colors: { ...(s.theme?.colors||{}), [key]: value }}}));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <div>
          <button onClick={handleSave} disabled={loading} className="px-4 py-2 rounded" style={{background:'#8b5a3c', color:'#fff'}}>
            {loading ? 'Saving...' : 'Save settings'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          {/* Basic info */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Basic</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={settings.siteName || ''} onChange={e=>setSettings(s=>({...s, siteName: e.target.value}))} placeholder="Site name" className="border p-2 rounded" />
              <input value={settings.tagline || ''} onChange={e=>setSettings(s=>({...s, tagline: e.target.value}))} placeholder="Tagline" className="border p-2 rounded" />
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm block mb-1">Logo (PNG/SVG)</label>
                <input type="file" accept="image/*" onChange={e=>setLogoFile(e.target.files[0])} />
                <div className="mt-2">
                  {settings.logo && <img src={settings.logo} className="h-16 object-contain" alt="logo" />}
                </div>
              </div>

              <div>
                <label className="text-sm block mb-1">Favicon</label>
                <input type="file" accept="image/*" onChange={e=>setFaviconFile(e.target.files[0])} />
                <div className="mt-2">
                  {settings.favicon && <img src={settings.favicon} className="h-10 object-contain" alt="favicon" />}
                </div>
              </div>
            </div>
          </div>

          {/* Header menu */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Header & Menu</h3>

            <div className="flex items-center gap-3 mb-3">
              <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.header?.showSearch} onChange={e=>setSettings(s=>({...s, header:{...(s.header||{}), showSearch: e.target.checked}}))} /> Show search</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={!!settings.header?.showCart} onChange={e=>setSettings(s=>({...s, header:{...(s.header||{}), showCart: e.target.checked}}))} /> Show cart</label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">Menu Links</div>
                <button onClick={addHeaderLink} className="px-3 py-1 border rounded">Add link</button>
              </div>

              {(settings.header?.menu || []).map((m, idx) => (
                <div key={m.id} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center border p-2 rounded">
                  <input value={m.title} onChange={e=>setHeaderMenuAt(idx, 'title', e.target.value)} className="border p-2 rounded col-span-2" />
                  <input value={m.url} onChange={e=>setHeaderMenuAt(idx, 'url', e.target.value)} className="border p-2 rounded col-span-2" />
                  <div className="flex gap-2 items-center">
                    <label className="text-sm"><input type="checkbox" checked={!!m.openInNewTab} onChange={e=>setHeaderMenuAt(idx, 'openInNewTab', e.target.checked)} /> new</label>
                    <button onClick={()=>removeHeaderLink(idx)} className="px-2 py-1 border rounded">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Footer</h3>

            <textarea value={settings.footer?.contentHtml || ''} onChange={e=>setSettings(s=>({...s, footer:{...(s.footer||{}), contentHtml: e.target.value}}))} rows={3} className="w-full border p-2 rounded mb-3" placeholder="Footer HTML or text"></textarea>

            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Footer Links</div>
              <button onClick={addFooterLink} className="px-3 py-1 border rounded">Add</button>
            </div>

            {(settings.footer?.links || []).map((l, idx) => (
              <div key={l.id} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center border p-2 rounded mb-2">
                <input value={l.title} onChange={e=>setFooterLinkAt(idx, 'title', e.target.value)} className="border p-2 rounded col-span-2" />
                <input value={l.url} onChange={e=>setFooterLinkAt(idx, 'url', e.target.value)} className="border p-2 rounded col-span-2" />
                <button onClick={()=>removeFooterLink(idx)} className="px-2 py-1 border rounded">Remove</button>
              </div>
            ))}

            <div className="mt-3">
              <label className="block mb-1">Contact email</label>
              <input value={settings.footer?.contact?.email || ''} onChange={e=>setSettings(s=>({...s, footer:{...(s.footer||{}), contact:{...(s.footer?.contact||{}), email: e.target.value}}}))} className="border p-2 rounded w-full" />
              <label className="block mb-1 mt-2">Phone</label>
              <input value={settings.footer?.contact?.phone || ''} onChange={e=>setSettings(s=>({...s, footer:{...(s.footer||{}), contact:{...(s.footer?.contact||{}), phone: e.target.value}}}))} className="border p-2 rounded w-full" />
              <label className="block mb-1 mt-2">Address</label>
              <input value={settings.footer?.contact?.address || ''} onChange={e=>setSettings(s=>({...s, footer:{...(s.footer||{}), contact:{...(s.footer?.contact||{}), address: e.target.value}}}))} className="border p-2 rounded w-full" />
            </div>
          </div>

          {/* Social */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Social links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input value={settings.social?.instagram || ''} onChange={e=>setSettings(s=>({...s, social:{...(s.social||{}), instagram: e.target.value}}))} placeholder="Instagram URL" className="border p-2 rounded" />
              <input value={settings.social?.facebook || ''} onChange={e=>setSettings(s=>({...s, social:{...(s.social||{}), facebook: e.target.value}}))} placeholder="Facebook URL" className="border p-2 rounded" />
              <input value={settings.social?.youtube || ''} onChange={e=>setSettings(s=>({...s, social:{...(s.social||{}), youtube: e.target.value}}))} placeholder="YouTube URL" className="border p-2 rounded" />
              <input value={settings.social?.whatsapp || ''} onChange={e=>setSettings(s=>({...s, social:{...(s.social||{}), whatsapp: e.target.value}}))} placeholder="WhatsApp URL / number" className="border p-2 rounded" />
            </div>
          </div>

          {/* Theme */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Theme</h3>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-sm">Clay 1<input type="color" value={settings.theme?.colors?.clay1 || '#f5efe7'} onChange={e=>setThemeColor('clay1', e.target.value)} className="ml-2" /></label>
              <label className="text-sm">Clay 2<input type="color" value={settings.theme?.colors?.clay2 || '#e6d3c1'} onChange={e=>setThemeColor('clay2', e.target.value)} className="ml-2" /></label>
              <label className="text-sm">Clay 3<input type="color" value={settings.theme?.colors?.clay3 || '#c79b7a'} onChange={e=>setThemeColor('clay3', e.target.value)} className="ml-2" /></label>
              <label className="text-sm">Clay 4<input type="color" value={settings.theme?.colors?.clay4 || '#8b5a3c'} onChange={e=>setThemeColor('clay4', e.target.value)} className="ml-2" /></label>
            </div>
          </div>
        </div>

        {/* RIGHT: Live preview */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <LogoPreview logo={settings.logo} siteName={settings.siteName} />
            <div className="mt-3 text-sm text-gray-500">{settings.tagline}</div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold mb-2">Header preview</h4>
            <div style={{ background: settings.theme?.colors?.clay1 || '#f5efe7' }} className="p-3 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {settings.logo ? <img src={settings.logo} className="h-10 object-contain" /> : <div className="h-10 w-10 bg-gray-100 rounded" />}
                  <div className="font-semibold">{settings.siteName}</div>
                </div>
                <div className="flex gap-3 items-center">
                  {settings.header?.menu?.slice(0,4).map(m => <a key={m.id} href={m.url} className="text-sm">{m.title}</a>)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold mb-2">Footer preview</h4>
            <div style={{ background: settings.theme?.colors?.clay2 || '#e6d3c1' }} className="p-4 rounded">
              <div className="text-sm" dangerouslySetInnerHTML={{ __html: settings.footer?.contentHtml || `<strong>${settings.siteName}</strong><div>${settings.footer?.contact?.email || ''}</div>` }} />
              <div className="mt-3 flex gap-2">
                {(settings.footer?.links || []).slice(0,4).map(l => <a key={l.id} href={l.url} className="text-sm">{l.title}</a>)}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
