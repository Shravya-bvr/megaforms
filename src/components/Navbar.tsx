'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 flex items-center h-16 gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-sm">M</div>
          <span className="text-gray-900">MegaForms</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          <div className="relative group">
            <button className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium text-sm rounded-lg hover:bg-red-50 transition-all">
              Features ▾
            </button>
            <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-gray-100 rounded-2xl shadow-xl p-2 min-w-52 z-50">
              <Link href="/features#ai" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl">⚡ AI Form Builder</Link>
              <Link href="/features#widget" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl">💬 Chat Widget</Link>
              <Link href="/features#leads" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl">🎯 Lead Generation</Link>
              <Link href="/features#booking" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl">📅 Appointment Booking</Link>
            </div>
          </div>
          <Link href="/pricing" className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium text-sm rounded-lg hover:bg-red-50 transition-all">Pricing</Link>
          <Link href="/templates" className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium text-sm rounded-lg hover:bg-red-50 transition-all">Templates</Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium text-sm transition-all">Log in</Link>
          <Link href="/register" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-semibold text-sm transition-all hover:shadow-lg hover:shadow-red-200">
            Create a free form
          </Link>
        </div>

        {/* Hamburger */}
        <button className="md:hidden ml-auto p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="w-5 h-0.5 bg-gray-700 mb-1"></div>
          <div className="w-5 h-0.5 bg-gray-700 mb-1"></div>
          <div className="w-5 h-0.5 bg-gray-700"></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-6 py-4 flex flex-col gap-3 bg-white">
          <Link href="/features" className="text-gray-700 font-medium py-2">Features</Link>
          <Link href="/pricing" className="text-gray-700 font-medium py-2">Pricing</Link>
          <Link href="/templates" className="text-gray-700 font-medium py-2">Templates</Link>
          <Link href="/login" className="text-gray-700 font-medium py-2">Log in</Link>
          <Link href="/register" className="bg-red-600 text-white px-5 py-2 rounded-full font-semibold text-center">Create a free form</Link>
        </div>
      )}
    </nav>
  )
}