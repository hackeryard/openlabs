"use client"

import { useState, useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Float, Environment, Sphere, Cylinder, TorusKnot, Capsule } from "@react-three/drei"
import * as THREE from "three"
import { motion, AnimatePresence } from "framer-motion"

// --- 1. DATA ---
const ANATOMY_DATA = {
  Brain: { title: "Brain", description: "Central processing unit.", color: "#e2e8f0" },
  Heart: { title: "Heart", description: "Pumps blood.", color: "#ef4444" },
  Lungs: { title: "Lungs", description: "Gas exchange.", color: "#fca5a5" },
  Liver: { title: "Liver", description: "Detoxification.", color: "#854d0e" },
  Stomach: { title: "Stomach", description: "Digestion.", color: "#fb923c" },
  Intestines: { title: "Intestines", description: "Nutrient absorption.", color: "#fdba74" },
  Kidneys: { title: "Kidneys", description: "Filtration.", color: "#581c87" },
  Bladder: { title: "Bladder", description: "Storage.", color: "#fbbf24" }
}

// --- 2. PROCEDURAL ORGAN COMPONENTS ---

// A. BRAIN (Cluster of spheres to mimic lobes)
function Brain({ active, onSelect }: any) {
  return (
    <group position={[0, 3.2, 0]} scale={0.6} onClick={(e) => { e.stopPropagation(); onSelect('Brain') }}>
      <Float speed={1.5}>
        {/* Left Hemisphere */}
        <Sphere args={[0.7, 16, 16]} position={[-0.5, 0, 0]} scale={[1, 1.2, 1.5]}>
           <meshStandardMaterial color={ANATOMY_DATA.Brain.color} roughness={0.4} emissive={active ? "#fff" : "#000"} emissiveIntensity={0.2} />
        </Sphere>
        {/* Right Hemisphere */}
        <Sphere args={[0.7, 16, 16]} position={[0.5, 0, 0]} scale={[1, 1.2, 1.5]}>
           <meshStandardMaterial color={ANATOMY_DATA.Brain.color} roughness={0.4} emissive={active ? "#fff" : "#000"} emissiveIntensity={0.2} />
        </Sphere>
        {/* Cerebellum */}
        <Sphere args={[0.5, 16, 16]} position={[0, -0.8, -0.5]} scale={[1.2, 0.8, 1]}>
           <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
        </Sphere>
      </Float>
    </group>
  )
}

// B. HEART (A pulsating shape)
function Heart({ active, onSelect }: any) {
  const mesh = useRef<THREE.Group>(null)
  useFrame((state) => {
    if(mesh.current) {
        // Heartbeat animation
        const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.05
        mesh.current.scale.setScalar(scale)
    }
  })

  return (
    <group ref={mesh} position={[0, 1.3, 0.4]} scale={0.4} onClick={(e) => { e.stopPropagation(); onSelect('Heart') }}>
       {/* Main Mass */}
       <Sphere args={[1, 16, 16]} position={[0, -0.2, 0]} scale={[1, 1.2, 1]}>
          <meshPhysicalMaterial color={ANATOMY_DATA.Heart.color} roughness={0.2} metalness={0.1} emissive={active ? "#ff0000" : "#000"} />
       </Sphere>
       {/* Atria (Top bumps) */}
       <Sphere args={[0.6, 16, 16]} position={[-0.5, 0.5, 0]}>
          <meshPhysicalMaterial color={ANATOMY_DATA.Heart.color} />
       </Sphere>
       <Sphere args={[0.6, 16, 16]} position={[0.5, 0.5, 0]}>
          <meshPhysicalMaterial color={ANATOMY_DATA.Heart.color} />
       </Sphere>
    </group>
  )
}

// C. LUNGS (Capsules)
function Lungs({ active, onSelect }: any) {
  const matProps = { color: ANATOMY_DATA.Lungs.color, roughness: 0.6, transparent: true, opacity: 0.9 }
  return (
    <group position={[0, 1.4, 0]} onClick={(e) => { e.stopPropagation(); onSelect('Lungs') }}>
       {/* Left Lung */}
       <Capsule args={[0.5, 1.6, 4, 16]} position={[0.65, 0, 0]}>
          <meshStandardMaterial {...matProps} emissive={active ? ANATOMY_DATA.Lungs.color : "#000"} />
       </Capsule>
       {/* Right Lung */}
       <Capsule args={[0.5, 1.6, 4, 16]} position={[-0.65, 0, 0]}>
           <meshStandardMaterial {...matProps} emissive={active ? ANATOMY_DATA.Lungs.color : "#000"} />
       </Capsule>
    </group>
  )
}

// D. DIGESTIVE TRACT (Torus Knots for Intestines)
function Intestines({ active, onSelect }: any) {
  return (
    <group position={[0, -1.2, 0]} onClick={(e) => { e.stopPropagation(); onSelect('Intestines') }}>
      {/* Small Intestine - A tangled knot */}
      <TorusKnot args={[0.5, 0.15, 64, 8, 2, 3]} scale={[1, 0.8, 1]}>
         <meshStandardMaterial color={ANATOMY_DATA.Intestines.color} roughness={0.5} emissive={active ? "#fb923c" : "#000"} />
      </TorusKnot>
      {/* Large Intestine - A simplified surrounding arc */}
      <TorusKnot args={[0.7, 0.1, 48, 8, 1, 0]} scale={[1.1, 1, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ea580c" roughness={0.6} />
      </TorusKnot>
    </group>
  )
}

// E. LIVER (Triangular shapes)
function Liver({ active, onSelect }: any) {
    return (
        <group position={[-0.5, 0, 0.4]} rotation={[0,0,0.2]} onClick={(e) => { e.stopPropagation(); onSelect('Liver') }}>
            {/* Using a Cone/Cylinder hybrid to approximate the wedge shape */}
            <Cylinder args={[0.1, 0.6, 1.2, 32]} rotation={[0,0,-1.5]} scale={[1, 1, 0.6]}>
                <meshStandardMaterial color={ANATOMY_DATA.Liver.color} roughness={0.3} emissive={active ? ANATOMY_DATA.Liver.color : "#000"} />
            </Cylinder>
        </group>
    )
}

// F. STOMACH (Curved Capsule approximation)
function Stomach({ active, onSelect }: any) {
    return (
        <group position={[0.4, 0.1, 0.3]} rotation={[0,0,-0.5]} onClick={(e) => { e.stopPropagation(); onSelect('Stomach') }}>
            <Capsule args={[0.3, 0.8, 4, 16]}>
                <meshStandardMaterial color={ANATOMY_DATA.Stomach.color} roughness={0.4} emissive={active ? ANATOMY_DATA.Stomach.color : "#000"} />
            </Capsule>
        </group>
    )
}

// --- 3. MAIN APP ---

export default function ProceduralAnatomy() {
  const [selected, setSelected] = useState<string | null>(null)
  // @ts-ignore
  const info = selected ? ANATOMY_DATA[selected] : null

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden font-sans text-white">
      <Canvas camera={{ position: [0, 0.5, 6], fov: 35 }}>
        <color attach="background" args={['#09090b']} />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#38bdf8" />
        <pointLight position={[-10, -5, -5]} intensity={0.5} color="#ec4899" />
        
        {/* Holographic grid floor */}
        <gridHelper args={[20, 20, 0x222222, 0x111111]} position={[0, -4, 0]} />

        <group position={[0, 0.5, 0]}>
          {/* SKELETON / BODY SHELL (Ghost) */}
          <Capsule args={[1.3, 3.5, 4, 16]} position={[0, 0.5, 0]}>
            <meshPhysicalMaterial 
                color="#94a3b8" 
                transparent 
                opacity={0.1} 
                roughness={0.1} 
                transmission={0.5} 
                thickness={1} 
                wireframe={false}
                side={THREE.DoubleSide}
            />
          </Capsule>

          {/* PROCEDURAL ORGANS */}
          <Brain active={selected === 'Brain'} onSelect={setSelected} />
          <Lungs active={selected === 'Lungs'} onSelect={setSelected} />
          <Heart active={selected === 'Heart'} onSelect={setSelected} />
          <Liver active={selected === 'Liver'} onSelect={setSelected} />
          <Stomach active={selected === 'Stomach'} onSelect={setSelected} />
          <Intestines active={selected === 'Intestines'} onSelect={setSelected} />
          
          {/* Kidneys (Two Spheres in back) */}
          <Sphere args={[0.25, 16, 16]} position={[0.4, -0.5, -0.4]} onClick={(e) => {e.stopPropagation(); setSelected("Kidneys")}}>
             <meshStandardMaterial color={ANATOMY_DATA.Kidneys.color} emissive={selected === 'Kidneys' ? "purple" : "black"} />
          </Sphere>
          <Sphere args={[0.25, 16, 16]} position={[-0.4, -0.5, -0.4]} onClick={(e) => {e.stopPropagation(); setSelected("Kidneys")}}>
             <meshStandardMaterial color={ANATOMY_DATA.Kidneys.color} emissive={selected === 'Kidneys' ? "purple" : "black"} />
          </Sphere>

        </group>

        <OrbitControls minDistance={4} maxDistance={10} enablePan={false} />
      </Canvas>

      {/* UI OVERLAY */}
      <div className="absolute top-0 left-0 w-full p-8 pointer-events-none flex flex-col justify-between h-full z-10">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
            PROCEDURAL ANATOMY
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-mono">
            Generated 100% via Code Primitives. No Models Loaded.
          </p>
        </div>

        <AnimatePresence>
          {info && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="pointer-events-auto w-80 bg-slate-900/90 border border-slate-700 p-6 rounded-xl self-end"
            >
              <h2 className="text-2xl font-bold" style={{ color: info.color }}>{info.title}</h2>
              <div className="h-px w-full bg-slate-700 my-3" />
              <p className="text-slate-300 text-sm leading-relaxed">{info.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}