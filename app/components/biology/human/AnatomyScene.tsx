"use client"

import { useState, Suspense } from "react"
import dynamic from "next/dynamic"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import Model from "./Model"

const CanvasWrapper = ({ type, onSelect }: any) => {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-red-500">
        <div className="text-center">
          <p>Error loading 3D model</p>
          <button 
            onClick={() => setError(false)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <Canvas
      camera={{ position: [0, 1.5, 3], fov: 75 }}
      gl={{
        antialias: true,
        preserveDrawingBuffer: true,
        alpha: true,
      }}
      onCreated={(state) => {
        state.gl.setClearColor("#000000")
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 5, 5]} intensity={0.5} />

        <Model type={type} onSelect={onSelect} />

        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={2}
          maxDistance={6}
          autoRotate={false}
        />
      </Suspense>
    </Canvas>
  )
}

export default function AnatomyScene({ type, onSelect }: any) {
  return (
    <div className="w-full h-full bg-black">
      <CanvasWrapper type={type} onSelect={onSelect} />
    </div>
  )
}
