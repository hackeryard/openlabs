import React from 'react'
import dynamic from 'next/dynamic'
import UniversalLoader from '@/app/components/UniversalLoader'

const OpticsLens = dynamic(() => import('@/app/components/physics/OpticsLensLab'), { 
  ssr: false, 
  loading: () => <UniversalLoader subject="physics" customMessage="Loading Geometric Optics & Lens Ray Tracing Studio..." /> 
})

export default function OpticsLensSimulationPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <OpticsLens />
    </main>
  )
}