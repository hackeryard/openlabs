import React from 'react'
import dynamic from 'next/dynamic'

const PeriodicTable = dynamic(() => import('../../components/chemistry/PeriodicTable'), {
  ssr: false,
  loading: () => <p className="p-6">Loading periodic table…</p>,
})

export default function PeriodicTablePage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">Periodic Table</h1>
        <p className="text-gray-600 mb-4">Interactive periodic table.</p>
        <PeriodicTable />
      </div>
    </main>
  )
}
