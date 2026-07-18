import React from 'react'
import dynamic from 'next/dynamic'

import UniversalLoader from '@/app/components/UniversalLoader'

const OhmsLaw = dynamic(() => import('@/app/components/physics/OhmsLaw'), { 
  ssr: false, 
  loading: () => <UniversalLoader subject="physics" customMessage="Loading Ohm's Law simulation..." /> 
})

export default function OhmsLawPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">Ohm's Law</h1>
        <p className="text-muted-foreground mb-4">Ohm’s law virtual lab.</p>
        <OhmsLaw />
      </div>
    </main>
  )
}
