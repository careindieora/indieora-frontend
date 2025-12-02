// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../services/axios.js';

function setMeta(title, description, og){
  if (title) document.title = title;
  const d = document.querySelector('meta[name="description"]');
  if (d && description) d.setAttribute('content', description);
  let ogTag = document.querySelector('meta[property="og:image"]');
  if (!ogTag){
    ogTag = document.createElement('meta');
    ogTag.setAttribute('property','og:image');
    document.head.appendChild(ogTag);
  }
  if (og) ogTag.setAttribute('content', og);
}

export default function ProductDetail(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  async function load(){
    try {
      // try slug first, then id
      let r = await axios.get(`/products/slug/${id}`).catch(()=>null);
      if (!r || !r.data) r = await axios.get(`/products/${id}`);
      const p = r.data;
      setProduct(p);
      setMainImage((p.images && p.images[0]) || p.image || '/placeholder.png');

      // set SEO meta
      setMeta(p.seo?.metaTitle || p.title, p.seo?.metaDescription || p.description?.slice(0,150), p.seo?.ogImage || ((p.images && p.images[0]) || p.image));

      // recently viewed (localStorage)
      try {
        const key = 'indieora_recent';
        const cur = JSON.parse(localStorage.getItem(key) || '[]');
        const filtered = [ { _id: p._id, title: p.title, price: p.price, image: (p.images && p.images[0]) || p.image } , ...cur.filter(x=>x._id !== p._id) ];
        localStorage.setItem(key, JSON.stringify(filtered.slice(0,12)));
      } catch(e){}
    } catch (err) {
      console.error('product detail', err);
    }
  }

  useEffect(()=>{ load(); }, [id]);

  if (!product) return <div className="container mx-auto p-6">Loading…</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded shadow">
            <img src={mainImage} className="w-full h-96 object-contain" />
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {(product.images || []).map((u,i)=>
                <img key={i} src={u} onClick={()=>setMainImage(u)} className="h-20 w-20 object-cover rounded cursor-pointer" />
              )}
            </div>
          </div>
        </div>

        <aside className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <div className="text-sm text-gray-600 mt-1">{product.category}</div>
          <div className="mt-4 text-2xl font-bold">₹ {product.price}</div>

          <div className="mt-4">
            <button className="px-4 py-2 rounded" style={{background:'#8b5a3c', color:'#fff'}}>Add to cart</button>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold">Description</h3>
            <div className="text-sm text-gray-700">{product.description}</div>
          </div>

          <div className="mt-4 text-xs text-gray-500">SKU: {product.variants?.[0]?.sku || '—'}</div>
        </aside>
      </div>

      {/* recently viewed */}
      <div className="mt-8">
        <h3 className="font-semibold mb-3">Recently viewed</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(JSON.parse(localStorage.getItem('indieora_recent') || '[]')).map((p, i) => (
            <a key={p._id || i} href={`/product/${p._id}`} className="block bg-white p-2 rounded shadow">
              <img src={p.image || '/placeholder.png'} className="h-28 w-full object-cover rounded" />
              <div className="text-sm mt-1">{p.title}</div>
              <div className="text-xs text-gray-500">₹ {p.price}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
