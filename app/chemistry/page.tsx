import React from 'react'
import Link from 'next/link'

export default function ChemistryPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">Chemistry Experiments</h1>
        <p className="text-gray-600 mb-4">Periodic Table and chemistry experiments.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/chemistry/periodictable" className="block bg-white rounded-xl border-2 border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-lg transform-gpu hover:scale-105 transition p-5">
            <h3 className="text-lg font-semibold">Periodic Table</h3>
            <p className="text-sm text-gray-500 mt-2">Interactive Periodic table with modal view of each element.</p>
          </Link>
          <Link href="/chemistry/chemicalbonds" className="block bg-white rounded-xl border-2 border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-lg transform-gpu hover:scale-105 transition p-5">
            <h3 className="text-lg font-semibold">Chemical Bond Types</h3>
            <p className="text-sm text-gray-500 mt-2">Types of chemical bonds and their properties.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
