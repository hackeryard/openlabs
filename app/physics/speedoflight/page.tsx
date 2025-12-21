import React from 'react'
import dynamic from 'next/dynamic'

const SpeedOfLightLab = dynamic(() => import('../../components/physics/SpeedOfLightLab'), { ssr: false, loading: () => <p className="p-6">Loading Wave Optics…</p> })

export default function WaveOpticsPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">Speed of Light Lab</h1>
        <p className="text-gray-600 mb-4">Demonstration of change in speed of light in defferent media.</p>
        <SpeedOfLightLab />
      </div>
    </main>
  )
}
