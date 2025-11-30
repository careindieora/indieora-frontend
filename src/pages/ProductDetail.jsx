import React from "react";
import { useParams } from "react-router-dom";
import { products } from "../data/products";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product) return <div>Product not found.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-6">

      {/* Image */}
      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">{product.title}</h1>

        <p className="text-gray-700 text-lg leading-relaxed">
          {product.description || 
          "Beautiful handcrafted artisan piece from Indieora."}
        </p>

        <div className="text-3xl font-bold">₹ {product.price}</div>

        <button className="px-6 py-3 bg-black text-white rounded-lg text-lg">
          Add to Cart
        </button>
      </div>

    </div>
  );
}
