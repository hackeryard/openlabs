import React from 'react'
import Hero from './components/Hero'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mt-6">Featured</h2>
        <p className="text-gray-600 mt-2">Explore curated experiments and learning modules.</p>
      </div>
    </main>
  )
}
