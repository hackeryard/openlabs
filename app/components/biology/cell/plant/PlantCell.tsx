"use client"

import { useState, useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Stars, Environment, Float, Instance, Instances, RoundedBox } from "@react-three/drei"
import * as THREE from "three"
import { motion, AnimatePresence } from "framer-motion"

// --- 1. DATA & DESCRIPTIONS ---
type OrganelleType = 
  | "Nucleus" | "Mitochondria" | "Golgi" | "ER" | "CellWall" 
  | "Chloroplast" | "LargeVacuole" | "Ribosome" | "Cytoskeleton" | null

const ORGANELLE_INFO: Record<string, { title: string, description: string, color: string }> = {
  CellWall: {
    title: "Cell Wall & Membrane",
    description: "The Cell Wall is a rigid cellulose box that gives the plant shape. The Membrane is the thin liner just inside it.",
    color: "#65a30d" 
  },
  Nucleus: {
    title: "Nucleus",
    description: "The command center containing DNA. In plants, it is often pushed to the side by the large water vacuole.",
    color: "#a855f7" 
  },
  Chloroplast: {
    title: "Chloroplast",
    description: "The solar panel of the cell. It uses chlorophyll to convert sunlight into sugar (Photosynthesis).",
    color: "#22c55e" 
  },
  LargeVacuole: {
    title: "Large Central Vacuole",
    description: "A massive water balloon inside the cell. It pushes outwards to keep the plant stiff (turgor pressure).",
    color: "#bae6fd" 
  },
  Mitochondria: {
    title: "Mitochondria",
    description: "Produces ATP energy for the cell through respiration.",
    color: "#f97316" 
  },
  Golgi: {
    title: "Golgi Apparatus",
    description: "Modifies and packages proteins and lipids.",
    color: "#f472b6" 
  },
  ER: {
    title: "Endoplasmic Reticulum",
    description: "Network for protein and lipid synthesis. It wraps closely around the Nucleus.",
    color: "#ec4899" 
  },
  Ribosome: {
    title: "Ribosomes",
    description: "Tiny sites of protein synthesis.",
    color: "#fef08a" 
  },
  Cytoskeleton: {
    title: "Cytoskeleton",
    description: "Microtubules and filaments that maintain cell shape.",
    color: "#94a3b8" 
  }
}

// --- 2. ORGANELLE COMPONENTS ---

function CellShell({ onSelect }: { onSelect: (type: string) => void }) {
  return (
    <group>
      {/* Visual Wall (Ghost) - Box Size is roughly 4x5x4 */}
      <RoundedBox args={[4, 5, 4]} radius={0.5} smoothness={4}>
        <meshPhysicalMaterial
          color="#65a30d"
          roughness={0.2}
          transmission={0.2} 
          thickness={2}
          transparent
          opacity={0.5}
          side={THREE.FrontSide} 
        />
      </RoundedBox>

      {/* Visual Membrane (Ghost) */}
       <RoundedBox args={[3.8, 4.8, 3.8]} radius={0.4} smoothness={4}>
        <meshPhysicalMaterial 
            color="#a3e635" 
            transparent 
            opacity={0.2} 
            side={THREE.FrontSide} 
        />
      </RoundedBox>

      {/* Interaction Backstop */}
      <RoundedBox args={[4, 5, 4]} radius={0.5} smoothness={4} onClick={(e) => { e.stopPropagation(); onSelect("CellWall") }}>
         <meshBasicMaterial side={THREE.BackSide} visible={false} />
      </RoundedBox>
    </group>
  )
}

function Chloroplast({ position, rotation, active, onSelect }: any) {
    return (
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
        <group position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onSelect() }}>
          <mesh>
             <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
             <meshStandardMaterial 
                color="#16a34a" 
                roughness={0.3} 
                emissive={active ? "#4ade80" : "#000"} 
                emissiveIntensity={0.6}
             />
          </mesh>
          <mesh position={[0, 0, 0.15]} scale={[0.6, 0.8, 0.5]}>
             <capsuleGeometry args={[0.2, 0.6, 4, 8]} />
             <meshStandardMaterial color="#14532d" />
          </mesh>
        </group>
      </Float>
    )
}

function LargeCentralVacuole({ active, onSelect }: any) {
    return (
        <group onClick={(e) => { e.stopPropagation(); onSelect() }}>
            <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.1}>
                {/* MOVED DOWN to y: -1.0 to give ample headroom for Nucleus */}
                <mesh position={[0, -1.0, 0]} scale={[1.8, 1.8, 1.8]}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshPhysicalMaterial 
                        color="#bae6fd"
                        roughness={0.1}
                        transmission={0.8} 
                        thickness={1}
                        transparent
                        opacity={0.6}
                        side={THREE.DoubleSide}
                        emissive={active ? "#7dd3fc" : "#000"}
                        emissiveIntensity={0.5}
                    />
                </mesh>
            </Float>
        </group>
    )
}

function Nucleus({ active, onSelect }: { active: boolean; onSelect: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  return (
    // FIX: Moved inward to [1.0, 1.1, 1.0] (Wall is at 2.0, so this is safe)
    <group position={[1.0, 1.1, 1.0]}> 
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={meshRef} onClick={(e) => { e.stopPropagation(); onSelect() }}>
          {/* Reduced radius to 0.6 to fit better */}
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshPhysicalMaterial
            color="#9333ea"
            roughness={0.4}
            clearcoat={0.5}
            emissive={active ? "#d8b4fe" : "#000"}
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[0, 0, 0.35]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#f0abfc" roughness={0.8} />
        </mesh>
      </Float>
    </group>
  )
}

function Mitochondria({ position, rotation, active, onSelect }: any) {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onSelect() }}>
        <mesh>
          <capsuleGeometry args={[0.15, 0.5, 8, 16]} />
          <meshStandardMaterial color="#ea580c" emissive={active ? "#f97316" : "#000"} />
        </mesh>
        <mesh position={[0,0,0.08]} scale={0.8}>
           <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
           <meshStandardMaterial color="#7c2d12" />
        </mesh>
      </group>
    </Float>
  )
}

function Cytoskeleton({ active, onSelect }: any) {
  const strands = useMemo(() => {
    return [...Array(10)].map(() => {
       const p1 = new THREE.Vector3((Math.random()-0.5)*3.5, (Math.random()-0.5)*4.5, (Math.random()-0.5)*3.5)
       const p2 = new THREE.Vector3((Math.random()-0.5)*3.5, (Math.random()-0.5)*4.5, (Math.random()-0.5)*3.5)
       return new THREE.CatmullRomCurve3([p1, new THREE.Vector3(0,0,0), p2])
    })
  }, [])

  return (
    <group onClick={(e) => { e.stopPropagation(); onSelect() }}>
      {strands.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 64, 0.015, 4, false]} />
          <meshStandardMaterial color="#94a3b8" transparent opacity={0.6} emissive={active ? "#fff" : "#000"} />
        </mesh>
      ))}
    </group>
  )
}

function RibosomeCloud({ active, onSelect }: any) {
  const count = 300
  return (
    <Instances range={count} onClick={(e) => { e.stopPropagation(); onSelect() }}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial color="#fef08a" emissive={active ? "#fff" : "#000"} />
      {[...Array(count)].map((_, i) => (
        <Instance
          key={i}
          position={[
            (Math.random() - 0.5) * 3.5,
            (Math.random() - 0.5) * 4.5,
            (Math.random() - 0.5) * 3.5
          ]}
        />
      ))}
    </Instances>
  )
}

function ER({ active, onSelect }: any) {
    // FIX: ER is now co-located with Nucleus at [1.0, 1.1, 1.0]
    // It rotates around the nucleus, staying safe inside the wall.
    return (
        <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
            <group position={[1.0, 1.1, 1.0]} onClick={(e) => {e.stopPropagation(); onSelect()}}>
                 <mesh rotation={[1, 0.5, 0]}>
                    {/* Scale matches nucleus size to wrap it */}
                    <torusKnotGeometry args={[0.45, 0.1, 64, 8, 2, 3]} />
                    <meshStandardMaterial color="#ec4899" emissive={active ? "#fbcfe8" : "#000"} roughness={0.5} />
                 </mesh>
            </group>
        </Float>
    )
}

function Golgi({ active, onSelect }: any) {
    return (
        <Float speed={1} rotationIntensity={0.1}>
            <group position={[-1.2, -1.5, 1.2]} onClick={(e) => {e.stopPropagation(); onSelect()}}>
                 {[0, 0.15, 0.3].map((y,i) => (
                    <mesh key={i} position={[0,y,0]} scale={[1 - i*0.2, 1, 1]}>
                        <cylinderGeometry args={[0.4, 0.4, 0.05, 16]} />
                        <meshStandardMaterial color="#db2777" emissive={active ? "#f472b6" : "#000"} />
                    </mesh>
                 ))}
            </group>
        </Float>
    )
}

// --- MAIN SCENE ---

export default function PlantCell() {
  const [selected, setSelected] = useState<OrganelleType>(null)
  
  // @ts-ignore
  const info = selected && ORGANELLE_INFO[selected] ? ORGANELLE_INFO[selected] : null

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden font-sans">
      
      <Canvas camera={{ position: [0, 0, 9], fov: 45 }}>
        <color attach="background" args={['#052e16']} />
        
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#fff" />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#4ade80" />
        <Environment preset="park" />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

        <group rotation={[0, -0.2, 0]}>
          
          <LargeCentralVacuole active={selected === 'LargeVacuole'} onSelect={() => setSelected("LargeVacuole")} />
          <Nucleus active={selected === 'Nucleus'} onSelect={() => setSelected("Nucleus")} />
          <ER active={selected === 'ER'} onSelect={() => setSelected("ER")} />

          <Chloroplast position={[-1.4, 1.2, 1.2]} rotation={[0.5, 0.5, 0]} active={selected === 'Chloroplast'} onSelect={() => setSelected("Chloroplast")} />
          <Chloroplast position={[1.4, -1.5, 1.2]} rotation={[1, -0.5, 0]} active={selected === 'Chloroplast'} onSelect={() => setSelected("Chloroplast")} />
          <Chloroplast position={[-1.2, 0, -1.5]} rotation={[1.5, 0, 0]} active={selected === 'Chloroplast'} onSelect={() => setSelected("Chloroplast")} />
          <Chloroplast position={[0, 1.8, -1.2]} rotation={[0, 0, 1]} active={selected === 'Chloroplast'} onSelect={() => setSelected("Chloroplast")} />

          <Mitochondria position={[1.5, 0.5, -1.2]} rotation={[0.5, 0.5, 0]} active={selected === 'Mitochondria'} onSelect={() => setSelected("Mitochondria")} />
          <Mitochondria position={[-1.5, -0.8, 1.2]} rotation={[1, 1, 0]} active={selected === 'Mitochondria'} onSelect={() => setSelected("Mitochondria")} />

          <Golgi active={selected === 'Golgi'} onSelect={() => setSelected("Golgi")} />
          <RibosomeCloud active={selected === 'Ribosome'} onSelect={() => setSelected("Ribosome")} />
          <Cytoskeleton active={selected === 'Cytoskeleton'} onSelect={() => setSelected("Cytoskeleton")} />

          <CellShell onSelect={(type) => setSelected(type as OrganelleType)} />
        </group>

        <OrbitControls enablePan={false} minDistance={6} maxDistance={16} autoRotate={!selected} autoRotateSpeed={0.5} />
      </Canvas>

      {/* --- UI OVERLAY --- */}
      <div className="absolute top-0 left-0 w-full p-6 md:p-10 pointer-events-none flex flex-col justify-between h-full z-10">
        <div className="pointer-events-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]">
            3D PLANT CELL
          </h1>
          <p className="text-green-200 text-sm md:text-base mt-2 max-w-md bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-green-500/30">
            

[Image of plant cell structure]

            <br/>
            Interactive model. The cell is square-shaped because of the rigid <strong>Cell Wall</strong>.
          </p>
        </div>

        <AnimatePresence>
          {info && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="pointer-events-auto max-w-md w-full bg-green-950/90 backdrop-blur-xl border border-green-700 p-6 rounded-2xl shadow-2xl self-end md:self-auto"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-2xl font-bold text-white" style={{ color: info.color }}>{info.title}</h2>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white bg-green-900 rounded-full w-8 h-8 flex items-center justify-center transition-colors">✕</button>
              </div>
              <p className="text-slate-200 leading-relaxed text-sm md:text-base">{info.description}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-green-400 uppercase tracking-widest font-semibold">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: info.color }} />
                Structure Identified
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}