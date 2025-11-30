import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

export default function Shop() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || p.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-8">

      <h1 className="text-4xl font-bold">Shop</h1>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/3"
        />

        {/* Category Filter */}
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/4"
        >
          <option value="all">All Products</option>
          <option value="glass">Glass</option>
          <option value="clay">Clay</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

    </div>
  );
}
