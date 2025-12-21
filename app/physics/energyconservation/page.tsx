import dynamic from 'next/dynamic'
import React from 'react'

const EnergyConservation = dynamic(() => import('../../components/physics/EnergyConservationLab'), {ssr:false, loading:()=> <p className='p-6'>Loading Energy Conservation Lab…</p>})

export default function EnergyConservationPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">Energy Conservation Lab</h1>
        <p className="text-gray-600 mt-2">This page will host experiments demonstrating energy conservation in mechanical systems.</p>
        <EnergyConservation />
      </div>
    </main>
  )
}
