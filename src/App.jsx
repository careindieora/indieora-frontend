import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'

export default function App(){
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t mt-8">
        <div className="container mx-auto px-4 py-6 text-sm text-gray-600 text-center">
          © {new Date().getFullYear()} Indieora — Handcrafted in Ahmedabad
        </div>
      </footer>
    </div>
  )
}
