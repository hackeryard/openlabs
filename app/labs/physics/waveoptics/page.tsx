import React from 'react'
import dynamic from 'next/dynamic'

import UniversalLoader from '@/app/components/UniversalLoader'

const WaveOptics = dynamic(() => import('@/app/components/physics/WaveOpticsLab'), { 
  ssr: false, 
  loading: () => <UniversalLoader subject="physics" customMessage="Loading Wave Optics simulation..." /> 
})

export default function WaveOpticsPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">Wave Optics</h1>
        <p className="text-gray-600 mb-4">Wave optics diffraction and interference lab.</p>
        <WaveOptics />
      </div>
    </main>
  )
}
