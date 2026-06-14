import React from 'react'
import dynamic from 'next/dynamic'

import UniversalLoader from '@/app/components/UniversalLoader'

const HookeLaw = dynamic(() => import('@/app/components/physics/HookeLaw'), { 
  ssr: false, 
  loading: () => <UniversalLoader subject="physics" customMessage="Loading Hooke's Law simulation..." /> 
})

export default function HookeLawPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">Hooke's Law</h1>
        <p className="text-gray-600 mb-4">Mass–spring virtual lab.</p>
        <HookeLaw />
      </div>
    </main>
  )
}
