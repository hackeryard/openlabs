import React from 'react'
import dynamic from 'next/dynamic'

import UniversalLoader from '@/app/components/UniversalLoader'

const SimplePendulum = dynamic(() => import('@/app/components/physics/SimplePendulum'), { 
  ssr: false, 
  loading: () => <UniversalLoader subject="physics" customMessage="Loading Simple Pendulum simulation..." /> 
})

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
