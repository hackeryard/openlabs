import React from 'react'
import dynamic from 'next/dynamic'

import UniversalLoader from '@/app/components/UniversalLoader'

const SpeedOfLightLab = dynamic(() => import('@/app/components/physics/SpeedOfLightLab'), { 
  ssr: false, 
  loading: () => <UniversalLoader subject="physics" customMessage="Loading Speed of Light simulation..." /> 
})

export default function SpeedOfLightPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">Speed of Light Lab</h1>
        <p className="text-muted-foreground mb-4">Demonstration of change in speed of light in different media.</p>
        <SpeedOfLightLab />
      </div>
    </main>
  )
}
