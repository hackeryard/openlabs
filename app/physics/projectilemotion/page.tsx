import React from 'react'
import dynamic from 'next/dynamic'

const ProjectileMotion = dynamic(() => import('../../components/physics/ProjectileMotion'), { ssr: false, loading: () => <p className="p-6">Loading projectile motion…</p> })

export default function ProjectileMotionPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">Projectile Motion</h1>
        <p className="text-gray-600 mb-4">2D projectile motion virtual lab.</p>
        <ProjectileMotion />
      </div>
    </main>
  )
}
