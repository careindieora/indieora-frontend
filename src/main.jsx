// src/main.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles.css';
import App from './App'
import Home from './pages/Home'
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";

// Admin pages
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminList from './pages/admin/List'         // optional: product list page
import AdminSettings from './pages/admin/Settings';
import ProductList from './pages/admin/ProductList';
import ProductForm from './pages/admin/ProductForm';
import Categories from './pages/admin/Categories';

// Admin layout wrapper
import AdminLayout from './components/admin/AdminLayout'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public layout */}
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetail />} />

          {/* Admin login stays public (outside AdminLayout) */}
          <Route path="admin/login" element={<AdminLogin />} />
        </Route>

        {/* Admin area (uses AdminLayout) */}
      <Route path="/admin" element={<AdminLayout/>}>
      <Route index element={<AdminDashboard/>} />
      <Route path="products" element={<ProductList/>} />
      <Route path="new" element={<ProductForm/>} />
      <Route path="edit/:id" element={<ProductForm/>} />
      <Route path="categories" element={<Categories/>} />
      <Route path="settings" element={<AdminSettings/>} />
      </Route>

        {/* You can add a 404 route here if desired */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
