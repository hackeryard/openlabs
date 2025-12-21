import React from 'react'
import dynamic from 'next/dynamic'

const SimplePendulum = dynamic(() => import('../../components/physics/SimplePendulum'), { ssr: false, loading: () => <p className="p-6">Loading Simple Pendulum…</p> })

export default function SimplePendulumPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">Simple Pendulum</h1>
        <p className="text-gray-600 mb-4">Interactive pendulum lab.</p>
        <SimplePendulum />
      </div>
    </main>
  )
}
