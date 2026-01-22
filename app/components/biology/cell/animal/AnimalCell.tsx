"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Stars, Environment, Float, Instance, Instances } from "@react-three/drei"
import * as THREE from "three"
import { motion, AnimatePresence } from "framer-motion"

// --- 1. DATA & DESCRIPTIONS ---
type OrganelleType = 
  | "Nucleus" | "Mitochondria" | "Golgi" | "ER" | "Membrane" 
  | "Lysosome" | "Peroxisome" | "Vacuole" | "Centrosome" 
  | "Ribosome" | "Cytoskeleton" | null

const ORGANELLE_INFO: Record<string, { title: string, description: string, color: string }> = {
  Membrane: {
    title: "Cell Membrane",
    description: "The semi-permeable phospholipid bilayer that protects the cell and regulates transport.",
    color: "#60a5fa" // Blue
  },
  Nucleus: {
    title: "Nucleus & Nucleolus",
    description: "The repository of genetic information (DNA). The inner Nucleolus produces ribosomes.",
    color: "#a855f7" // Purple
  },
  Mitochondria: {
    title: "Mitochondria",
    description: "The powerhouse. It converts glucose into ATP (energy) via cellular respiration.",
    color: "#f97316" // Orange
  },
  Golgi: {
    title: "Golgi Apparatus",
    description: "Modifies, sorts, and packages proteins for secretion or delivery to other organelles.",
    color: "#34d399" // Green
  },
  ER: {
    title: "Endoplasmic Reticulum (RER & SER)",
    description: "Rough ER synthesizes proteins (studded with ribosomes). Smooth ER synthesizes lipids and detoxifies.",
    color: "#ec4899" // Pink
  },
  Lysosome: {
    title: "Lysosome",
    description: "The recycling center. Contains digestive enzymes to break down waste and cellular debris.",
    color: "#ef4444" // Red
  },
  Peroxisome: {
    title: "Peroxisome",
    description: "Breaks down fatty acids and detoxifies harmful substances like hydrogen peroxide.",
    color: "#06b6d4" // Cyan
  },
  Vacuole: {
    title: "Vacuole",
    description: "Storage sacs for water, nutrients, or waste. Smaller in animal cells than plant cells.",
    color: "#a5f3fc" // Light Blue
  },
  Centrosome: {
    title: "Centrosome (Centrioles)",
    description: "Organizes microtubules and plays a crucial role in cell division (mitosis).",
    color: "#eab308" // Yellow
  },
  Ribosome: {
    title: "Ribosomes",
    description: "Tiny factories that synthesize proteins by translating mRNA. Found floating or on the Rough ER.",
    color: "#fef08a" // Pale Yellow
  },
  Cytoskeleton: {
    title: "Cytoskeleton",
    description: "A network of filaments (microtubules) that gives the cell shape and aids in movement.",
    color: "#94a3b8" // Grey
  }
}

// --- 2. REUSABLE COMPONENTS ---

// Generic Sphere for Vesicles (Lysosome, Peroxisome, Vacuole)
function Vesicle({ type, color, position, scale, active, onSelect }: any) {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh 
        position={position} 
        scale={scale} 
        onClick={(e) => { e.stopPropagation(); onSelect() }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.2} 
          transmission={type === "Vacuole" ? 0.6 : 0} // Vacuoles are watery
          transparent={type === "Vacuole"}
          opacity={type === "Vacuole" ? 0.6 : 1}
          emissive={active ? color : "#000"}
          emissiveIntensity={0.8}
        />
      </mesh>
    </Float>
  )
}

// 3. ORGANELLE COMPONENTS ---

function CellMembrane({ onSelect }: { onSelect: () => void }) {
  return (
    <group>
      {/* Visual Shell (Ghost) */}
      <mesh>
        <sphereGeometry args={[3, 64, 64]} />
        <meshPhysicalMaterial
          color="#93c5fd"
          roughness={0.1}
          metalness={0.1}
          transmission={0.6}
          thickness={2}
          clearcoat={1}
          transparent
          opacity={0.4}
          side={THREE.FrontSide}
        />
      </mesh>
      {/* Interaction Shell (Backstop) */}
      <mesh onClick={(e) => { e.stopPropagation(); onSelect() }}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshBasicMaterial side={THREE.BackSide} transparent opacity={0} />
      </mesh>
    </group>
  )
}

function Nucleus({ active, onSelect }: { active: boolean; onSelect: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.scale.setScalar(active ? 1.05 : 1)
  })

  return (
    <group>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Main Nucleus */}
        <mesh ref={meshRef} onClick={(e) => { e.stopPropagation(); onSelect() }}>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshPhysicalMaterial
            color="#7e22ce"
            roughness={0.4}
            clearcoat={0.5}
            emissive={active ? "#a855f7" : "#000"}
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Nucleolus */}
        <mesh position={[0, 0, 0.4]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#e879f9" roughness={0.8} />
        </mesh>
        {/* Pores */}
        {[...Array(6)].map((_, i) => (
           <mesh key={i} position={[0.8, 0, 0]} rotation={[0, (i * 60 * Math.PI) / 180, 0]}>
             <sphereGeometry args={[0.1, 8, 8]} />
             <meshStandardMaterial color="#4c1d95" />
           </mesh>
        ))}
      </Float>
    </group>
  )
}

function Mitochondria({ position, rotation, active, onSelect }: any) {
  const ref = useRef<THREE.Group>(null)
  useFrame(() => { if (active && ref.current) ref.current.rotation.y += 0.02 })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={ref} position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onSelect() }}>
        <mesh>
          <capsuleGeometry args={[0.18, 0.6, 8, 16]} />
          <meshStandardMaterial 
            color="#c2410c" 
            roughness={0.3} 
            emissive={active ? "#f97316" : "#000"}
            emissiveIntensity={0.8}
          />
        </mesh>
        {/* Cristae detail */}
        <mesh position={[0,0,0.1]} scale={[0.8, 0.8, 0.8]}>
           <capsuleGeometry args={[0.12, 0.5, 4, 8]} />
           <meshStandardMaterial color="#7c2d12" />
        </mesh>
      </group>
    </Float>
  )
}

function Centrosome({ active, onSelect }: any) {
  return (
    <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.2}>
      <group position={[1.2, 0.5, -0.5]} onClick={(e) => { e.stopPropagation(); onSelect() }}>
        {/* Centriole 1 */}
        <mesh rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 9]} /> {/* 9 sides for microtubule triplets */}
          <meshStandardMaterial color="#eab308" emissive={active ? "#fef08a" : "#000"} />
        </mesh>
        {/* Centriole 2 (perpendicular) */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.2, -0.2, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 9]} />
          <meshStandardMaterial color="#eab308" emissive={active ? "#fef08a" : "#000"} />
        </mesh>
      </group>
    </Float>
  )
}

function Cytoskeleton({ active, onSelect }: any) {
  // Generate random thin tubes
  const strands = useMemo(() => {
    return [...Array(8)].map(() => {
       const p1 = new THREE.Vector3((Math.random()-0.5)*4, (Math.random()-0.5)*4, (Math.random()-0.5)*4)
       const p2 = new THREE.Vector3((Math.random()-0.5)*4, (Math.random()-0.5)*4, (Math.random()-0.5)*4)
       return new THREE.CatmullRomCurve3([p1, new THREE.Vector3(0,0,0), p2])
    })
  }, [])

  return (
    <group onClick={(e) => { e.stopPropagation(); onSelect() }}>
      {strands.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 64, 0.015, 4, false]} />
          <meshStandardMaterial 
            color="#94a3b8" 
            transparent 
            opacity={0.6}
            emissive={active ? "#fff" : "#000"}
          />
        </mesh>
      ))}
    </group>
  )
}

// Thousands of ribosomes using InstancedMesh for performance
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
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3
          ]}
        />
      ))}
    </Instances>
  )
}

function ER({ active, onSelect }: any) {
    const curve = useMemo(() => new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.2, 0, 0), new THREE.Vector3(-1, 0.6, 0.6),
        new THREE.Vector3(-1.4, -0.6, 0), new THREE.Vector3(-1.1, 0, -0.6),
    ], true), []);

    return (
        <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
            <mesh onClick={(e) => {e.stopPropagation(); onSelect()}}>
                <tubeGeometry args={[curve, 100, 0.1, 16, true]} />
                <meshStandardMaterial 
                    color="#db2777" 
                    roughness={0.5}
                    emissive={active ? "#f472b6" : "#000"}
                    emissiveIntensity={0.4}
                />
            </mesh>
        </Float>
    )
}

// --- MAIN SCENE ---

export default function Ultimate3DCell() {
  const [selected, setSelected] = useState<OrganelleType>(null)
  
  // @ts-ignore
  const info = selected && ORGANELLE_INFO[selected] ? ORGANELLE_INFO[selected] : null

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden font-sans">
      
      <Canvas camera={{ position: [0, 0, 7], fov: 40 }}>
        <color attach="background" args={['#020617']} />
        
        {/* --- LIGHTING --- */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#fff" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4f46e5" />
        <Environment preset="city" />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

        <group>
          {/* 1. Nucleus Complex */}
          <Nucleus active={selected === 'Nucleus'} onSelect={() => setSelected("Nucleus")} />
          
          {/* 2. ER */}
          <ER active={selected === 'ER'} onSelect={() => setSelected("ER")} />

          {/* 3. Mitochondria (Multiple) */}
          <Mitochondria position={[1.4, 1.2, 0.5]} rotation={[0.5, 0.5, 0]} active={selected === 'Mitochondria'} onSelect={() => setSelected("Mitochondria")} />
          <Mitochondria position={[-0.8, -1.5, 0.5]} rotation={[1, 2, 0]} active={selected === 'Mitochondria'} onSelect={() => setSelected("Mitochondria")} />
          <Mitochondria position={[0.5, -0.8, -1.5]} rotation={[0, 0, 1]} active={selected === 'Mitochondria'} onSelect={() => setSelected("Mitochondria")} />

          {/* 4. Golgi Apparatus */}
          <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
            <group position={[1.6, -0.5, 0]} onClick={(e) => { e.stopPropagation(); setSelected("Golgi") }}>
              {[-0.2, 0, 0.2].map((y, i) => (
                <mesh key={i} position={[0, y, 0]} rotation={[0.1, 0, 0]} scale={[1 - Math.abs(y), 1, 1]}>
                  <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
                  <meshStandardMaterial color="#059669" emissive={selected === 'Golgi' ? "#34d399" : "#000"} />
                </mesh>
              ))}
            </group>
          </Float>

          {/* 5. Lysosomes (Red spheres) */}
          <Vesicle type="Lysosome" color="#ef4444" position={[-1.5, 1.2, -0.5]} scale={0.2} active={selected === 'Lysosome'} onSelect={() => setSelected("Lysosome")} />
          <Vesicle type="Lysosome" color="#ef4444" position={[-1.2, 0.8, 1]} scale={0.15} active={selected === 'Lysosome'} onSelect={() => setSelected("Lysosome")} />

          {/* 6. Peroxisomes (Cyan spheres) */}
          <Vesicle type="Peroxisome" color="#06b6d4" position={[0.8, 1.5, 0]} scale={0.15} active={selected === 'Peroxisome'} onSelect={() => setSelected("Peroxisome")} />
          <Vesicle type="Peroxisome" color="#06b6d4" position={[0.5, 1.8, -0.5]} scale={0.12} active={selected === 'Peroxisome'} onSelect={() => setSelected("Peroxisome")} />

          {/* 7. Vacuoles (Watery spheres) */}
          <Vesicle type="Vacuole" color="#a5f3fc" position={[-0.5, -1, -1]} scale={0.3} active={selected === 'Vacuole'} onSelect={() => setSelected("Vacuole")} />
          
          {/* 8. Centrosomes */}
          <Centrosome active={selected === 'Centrosome'} onSelect={() => setSelected("Centrosome")} />

          {/* 9. Ribosomes (Scattered Particles) */}
          <RibosomeCloud active={selected === 'Ribosome'} onSelect={() => setSelected("Ribosome")} />

          {/* 10. Cytoskeleton (Web) */}
          <Cytoskeleton active={selected === 'Cytoskeleton'} onSelect={() => setSelected("Cytoskeleton")} />

          {/* 11. Membrane Wrapper */}
          <CellMembrane onSelect={() => setSelected("Membrane")} />
        </group>

        <OrbitControls enablePan={false} minDistance={4} maxDistance={14} autoRotate={!selected} autoRotateSpeed={0.5} />
      </Canvas>

      {/* --- UI OVERLAY --- */}
      <div className="absolute top-0 left-0 w-full p-6 md:p-10 pointer-events-none flex flex-col justify-between h-full z-10">
        <div className="pointer-events-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            ULTIMATE 3D CELL
          </h1>
          <p className="text-blue-200 text-sm md:text-base mt-2 max-w-md bg-black/30 backdrop-blur-sm p-2 rounded-lg border border-white/10">
            A complete interactive model. Click on any structure—even the tiny dots or strings—to identify it.
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
              className="pointer-events-auto max-w-md w-full bg-slate-900/90 backdrop-blur-xl border border-slate-700 p-6 rounded-2xl shadow-2xl self-end md:self-auto"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-2xl font-bold text-white" style={{ color: info.color }}>{info.title}</h2>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors">✕</button>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">{info.description}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-semibold">
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