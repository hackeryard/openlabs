import React from 'react'
import dynamic from 'next/dynamic'

import UniversalLoader from '@/app/components/UniversalLoader'

const UniformMotionLab = dynamic(() => import('@/app/components/physics/UniformMotionLab'), { 
  ssr: false, 
  loading: () => <UniversalLoader subject="physics" customMessage="Loading Uniform Motion simulation..." /> 
})

export default function UniformMotionPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">Uniform Motion Lab</h1>
        <p className="text-muted-foreground mb-4">Uniform linear motion using a moving object.</p>
        <UniformMotionLab />
      </div>
    </main>
  )
}
