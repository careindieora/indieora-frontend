import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.id || product._id}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition p-4"
    >
      <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={product.image || product.img}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      </div>

      <h3 className="mt-3 font-semibold text-gray-900 text-lg line-clamp-1">
        {product.title}
      </h3>

      <div className="mt-1 flex items-center justify-between">
        <p className="text-gray-700 font-medium text-lg">
          ₹ {product.price}
        </p>
        <button className="px-3 py-1 rounded-lg bg-black text-white text-sm">
          Add
        </button>
      </div>
    </Link>
  );
}
