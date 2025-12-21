import dynamic from 'next/dynamic'
import React from 'react'

const RCLab = dynamic(() => import('../../components/physics/RCLab'), { ssr: false, loading: () => <p className="p-6">Loading RC Lab…</p> })

export default function RCLabPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">RC Circuit Lab</h1>
        <p className="text-gray-600 mt-2">Interactive RC charging/discharging lab will be added here. For now, this is a placeholder page.</p>
        <RCLab />
      </div>
    </main>
  )
}
