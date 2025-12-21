import React from 'react'
import dynamic from 'next/dynamic'

const OhmsLaw = dynamic(() => import('../../components/physics/OhmsLaw'), { ssr: false, loading: () => <p className="p-6">Loading Ohm's law…</p> })

export default function OhmsLawPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">Ohm's Law</h1>
        <p className="text-gray-600 mb-4">Ohm’s law virtual lab.</p>
        <OhmsLaw />
      </div>
    </main>
  )
}
