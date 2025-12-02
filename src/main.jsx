// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";

import AdminDashboard from "./pages/admin/Dashboard.jsx";
import AdminSettings from "./pages/admin/Settings.jsx";
import ProductList from "./pages/admin/ProductList.jsx";
import ProductForm from "./pages/admin/ProductForm.jsx";
import Categories from "./pages/admin/Categories.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";

import { CartProvider } from "./context/CartContext.jsx";
import { Toaster } from "react-hot-toast";

import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Public layout with App wrapper */}
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:id" element={<ProductDetail />} />

            {/* Customer auth */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin area */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="categories" element={<Categories />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* 404 could go here */}
        </Routes>

        <Toaster position="top-right" />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
