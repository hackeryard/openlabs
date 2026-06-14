import React from 'react'
import dynamic from 'next/dynamic'

import UniversalLoader from '@/app/components/UniversalLoader'

const FreeFallLab = dynamic(() => import('@/app/components/physics/FreeFallLab'), { 
  ssr: false, 
  loading: () => <UniversalLoader subject="physics" customMessage="Loading Free Fall simulation..." /> 
})

export default function FreeFallPage() {
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
