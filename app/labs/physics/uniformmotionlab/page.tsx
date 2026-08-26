import React from 'react'
import dynamic from 'next/dynamic'
import UniversalLoader from '@/app/components/UniversalLoader'

const UniformMotion = dynamic(() => import('@/app/components/physics/UniformMotionLab'), { 
  ssr: false, 
  loading: () => <UniversalLoader subject="physics" customMessage="Loading Uniform Motion & Multi-Body Kinematics Studio..." /> 
})

export default function UniformMotionSimulationPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <UniformMotion />
    </main>
  )
}
