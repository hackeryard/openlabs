import dynamic from 'next/dynamic'
import React from 'react'

import UniversalLoader from '@/app/components/UniversalLoader'

const RCLab = dynamic(() => import('@/app/components/physics/RCLab'), {
  ssr: false,
  loading: () => <UniversalLoader subject="physics" customMessage="Loading RC Circuit Lab..." />
})

export default function RCLabPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">RC Circuit Lab</h1>
        <p className="text-muted-foreground mt-2">Interactive RC charging/discharging lab will be added here. For now, this is a placeholder page.</p>
        <RCLab />
      </div>
    </main>
  )
}
