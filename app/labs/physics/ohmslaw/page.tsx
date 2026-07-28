import React from 'react'
import dynamic from 'next/dynamic'

import UniversalLoader from '@/app/components/UniversalLoader'

const OhmsLaw = dynamic(() => import('@/app/components/physics/ohmslaw/OhmsLawLab'), { 
  ssr: false, 
  loading: () => <UniversalLoader subject="physics" customMessage="Loading Ohm's Law simulation..." /> 
})

export default function OhmsLawPage() {
  return (
    <main className="w-full h-[calc(100vh-4rem)]">
      <OhmsLaw />
    </main>
  )
}
