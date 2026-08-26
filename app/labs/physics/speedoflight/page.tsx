import React from 'react'
import dynamic from 'next/dynamic'
import UniversalLoader from '@/app/components/UniversalLoader'

const SpeedOfLight = dynamic(() => import('@/app/components/physics/SpeedOfLightLab'), { 
  ssr: false, 
  loading: () => <UniversalLoader subject="physics" customMessage="Loading Speed of Light Measurement & Time-of-Flight Studio..." /> 
})

export default function SpeedOfLightSimulationPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SpeedOfLight />
    </main>
  )
}
