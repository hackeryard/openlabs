import React from 'react'
import dynamic from 'next/dynamic'

const FreeFallLab = dynamic(() => import('../../components/physics/FreeFallLab'), { ssr: false, loading: () => <p className="p-6">Loading Hooke's law…</p> })

export default function HookeLawPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">Free Fall Lab</h1>
        <p className="text-gray-600 mb-4">Free Fall demonstration virtual lab.</p>
        <FreeFallLab />
      </div>
    </main>
  )
}
