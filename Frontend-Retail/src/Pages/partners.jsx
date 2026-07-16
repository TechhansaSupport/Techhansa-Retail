import React from 'react'
import { Link } from 'react-router-dom'

export default function Partners() {
  return (
    <div className="w-full min-h-screen bg-[var(--soft-bg)] pb-20">
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-extrabold text-[var(--text-dark)] mb-4">Partners</h1>
        <p className="text-gray-600 mb-8">Explore our partner programs and how we collaborate with OEMs, channel partners, and franchisees to deliver the best IT solutions.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-xl mx-auto">
          <Link to="/partner/oem" className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">OEM Partners</Link>
          <Link to="/partner/channel" className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">Channel Partners</Link>
          <Link to="/partner/franchise" className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">Franchise Partners</Link>
        </div>
      </section>
    </div>
  )
}
