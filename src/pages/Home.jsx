// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { products as sample } from "../data/products";

export default function Home() {
  const items = sample || [];

  // pick top 6 featured (or fewer)
  const featured = items.slice(0, 6);

  return (
    <div className="space-y-12">

      {/* HERO */}
      <section className="rounded-2xl bg-gradient-to-r from-amber-50 to-white p-8 sm:p-12 shadow-sm">
        <div className="container mx-auto flex flex-col lg:flex-row items-start gap-8">
          {/* Left text */}
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              Handmade, honest pieces.
              <br />
              Crafted with care in Ahmedabad.
            </h1>

            <p className="mt-4 text-gray-600 max-w-xl text-lg">
              Discover curated glass, clay and custom-made products — each item made by hand, ready to become part of your home.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/shop" className="inline-block px-5 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition">
                Shop Collection
              </Link>
              <Link to="/about" className="inline-block px-5 py-3 border rounded-md text-gray-700 hover:text-gray-900">
                Our Story
              </Link>
            </div>
          </div>

          {/* Right visual */}
          <div className="w-full lg:w-96">
            <div className="h-64 sm:h-72 lg:h-80 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
              <div className="text-center px-4">
                <div className="text-lg font-medium">Featured Craft</div>
                <div className="mt-2 text-sm">Handblown glass vase — limited</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES QUICK LINKS */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">Shop by category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/shop" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition">
            <div className="text-lg font-semibold">Glass</div>
            <p className="mt-2 text-sm text-gray-500">Vases, glasses & decor</p>
          </Link>

          <Link to="/shop" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition">
            <div className="text-lg font-semibold">Clay</div>
            <p className="mt-2 text-sm text-gray-500">Planters, pots & tableware</p>
          </Link>

          <Link to="/shop" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition">
            <div className="text-lg font-semibold">Custom</div>
            <p className="mt-2 text-sm text-gray-500">Personalized gifts & orders</p>
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Featured products</h2>
          <Link to="/shop" className="text-sm text-gray-600 hover:text-gray-900">View all</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.length === 0 ? (
            <div className="col-span-full text-gray-600">No products yet — add your first product in admin.</div>
          ) : (
            featured.map((p) => <ProductCard key={p.id || p._id} product={p} />)
          )}
        </div>
      </section>

      {/* SMALL PROMO / CTA */}
      <section className="container mx-auto px-4">
        <div className="rounded-lg bg-gradient-to-r from-white to-amber-50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Custom orders available</h3>
            <p className="mt-1 text-gray-600">Want something unique? Message us and we’ll craft it for you.</p>
          </div>
          <div>
            <Link to="/contact" className="px-5 py-2 bg-black text-white rounded-md">Get in touch</Link>
          </div>
        </div>
      </section>

      {/* NEWSLETTER FOOTER */}
      <section className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-lg">Join our newsletter</h4>
            <p className="text-sm text-gray-500">Get updates on new pieces and limited drops.</p>
          </div>

          <form className="flex w-full sm:w-auto gap-2">
            <input type="email" placeholder="Your email" className="border rounded-md px-3 py-2" />
            <button type="submit" className="px-4 py-2 bg-black text-white rounded-md">Subscribe</button>
          </form>
        </div>
      </section>

    </div>
  );
}
