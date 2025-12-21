import React from 'react'
import Link from 'next/link'

export default function PhysicsPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">Physics Experiments</h1>
        <p className="text-gray-600 mb-4">This page will host physics experiment links and landing UI.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/physics/simplependulum" className="block bg-white rounded-xl border-2 border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-lg transform-gpu hover:scale-105 transition p-5">
            <h3 className="text-lg font-semibold">Simple Pendulum</h3>
            <p className="text-sm text-gray-500 mt-2">Simulate pendulum motion and compare theory vs measured period.</p>
          </Link>

          <Link href="/physics/projectilemotion" className="block bg-white rounded-xl border-2 border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-lg transform-gpu hover:scale-105 transition p-5">
            <h3 className="text-lg font-semibold">Projectile Motion</h3>
            <p className="text-sm text-gray-500 mt-2">Simulate trajectories and measure range & time-of-flight.</p>
          </Link>

          <Link href="/physics/hookelaw" className="block bg-white rounded-xl border-2 border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-lg transform-gpu hover:scale-105 transition p-5">
            <h3 className="text-lg font-semibold">Hooke's Law</h3>
            <p className="text-sm text-gray-500 mt-2">Mass–spring system: observe oscillations and measure period.</p>
          </Link>

          <Link href="/physics/ohmslaw" className="block bg-white rounded-xl border-2 border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-lg transform-gpu hover:scale-105 transition p-5">
            <h3 className="text-lg font-semibold">Ohm's Law</h3>
            <p className="text-sm text-gray-500 mt-2">Explore V–I behavior with virtual instruments.</p>
          </Link>

          <Link href="/physics/waveoptics" className="block bg-white rounded-xl border-2 border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-lg transform-gpu hover:scale-105 transition p-5">
            <h3 className="text-lg font-semibold">Wave Optics</h3>
            <p className="text-sm text-gray-500 mt-2">Diffraction & interference lab (Fraunhofer).</p>
          </Link>

          <Link href="/physics/rclab" className="block bg-white rounded-xl border-2 border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-lg transform-gpu hover:scale-105 transition p-5">
            <h3 className="text-lg font-semibold">RC Lab</h3>
            <p className="text-sm text-gray-500 mt-2">RC circuit charging / discharging experiments.</p>
          </Link>

          <Link href="/physics/energyconservation" className="block bg-white rounded-xl border-2 border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-lg transform-gpu hover:scale-105 transition p-5">
            <h3 className="text-lg font-semibold">Energy Conservation</h3>
            <p className="text-sm text-gray-500 mt-2">Investigate energy transformation and conservation.</p>
          </Link>

          <Link href="/physics/uniformmotionlab" className="block bg-white rounded-xl border-2 border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-lg transform-gpu hover:scale-105 transition p-5">
            <h3 className="text-lg font-semibold">Uniform Motion Lab</h3>
            <p className="text-sm text-gray-500 mt-2">Uniform linear motion using a moving object.</p>
          </Link>

          <Link href="/physics/freefall" className="block bg-white rounded-xl border-2 border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-lg transform-gpu hover:scale-105 transition p-5">
            <h3 className="text-lg font-semibold">Free Fall Lab</h3>
            <p className="text-sm text-gray-500 mt-2">Free Fall demonstration of an object.</p>
          </Link>

          <Link href="/physics/speedoflight" className="block bg-white rounded-xl border-2 border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-lg transform-gpu hover:scale-105 transition p-5">
            <h3 className="text-lg font-semibold">Speed of Light Lab</h3>
            <p className="text-sm text-gray-500 mt-2">Demonstration of change in speed of light in defferent media.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
