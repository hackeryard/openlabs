import React from 'react'
import dynamic from 'next/dynamic'
import UniversalLoader from '@/app/components/UniversalLoader'

const WaveOptics = dynamic(() => import('@/app/components/physics/WaveOpticsLab'), { 
  ssr: false, 
  loading: () => <UniversalLoader subject="physics" customMessage="Loading Wave Optics & Double-Slit Studio..." /> 
})

export default function WaveOpticsSimulationPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <WaveOptics />
    </main>
  )
}
