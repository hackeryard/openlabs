import React from 'react'
import dynamic from 'next/dynamic'

import UniversalLoader from '@/app/components/UniversalLoader'

const ProjectileMotion = dynamic(() => import('@/app/components/physics/ProjectileMotion'), { 
  ssr: false, 
  loading: () => <UniversalLoader subject="physics" customMessage="Loading Projectile Motion simulation..." /> 
})

export default function ProjectileMotionPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">Projectile Motion</h1>
        <p className="text-muted-foreground mb-4">2D projectile motion virtual lab.</p>
        <ProjectileMotion />
      </div>
    </main>
  )
}
