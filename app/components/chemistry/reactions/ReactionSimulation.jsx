"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Center, Float, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three"; 
import { REACTIONS_DATA } from "./reactionData";
import { REACTION_DETAILS } from "./reactionDetails";

// --- 1. VISUAL PHYSICS COMPONENTS ---

const SplashZone = ({ color, active }) => {
  if (!active) return null;
  return (
    <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 w-12 h-4 pointer-events-none">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-2 border-2 rounded-full animate-ping opacity-75" style={{ borderColor: color }} />
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-1 bg-white/50 rounded-full blur-sm" />
       {[...Array(6)].map((_, i) => (
         <div 
           key={i} 
           className="absolute bottom-0 w-1 h-1 rounded-full animate-bounce"
           style={{
             backgroundColor: color,
             left: `${20 + Math.random() * 60}%`,
             animationDuration: `${0.3 + Math.random() * 0.2}s`,
             animationDelay: `${Math.random() * 0.1}s`,
             opacity: 0.8
           }}
         />
       ))}
    </div>
  );
};

const PouringVessel = ({ active, color }) => (
  <div 
    className={`absolute -top-36 -right-2 z-20 transition-all duration-700 ease-in-out origin-bottom-left ${
      active ? "-translate-x-12 translate-y-2 rotate-[-60deg] opacity-100" : "translate-y-0 rotate-0 opacity-0"
    }`}
  >
    <div className="w-24 h-6 bg-gray-400 absolute -right-2 top-4 rounded-full opacity-30 rotate-45" />
    <div className="w-8 h-28 border-2 border-white/50 bg-white/10 rounded-full backdrop-blur-md relative overflow-hidden shadow-lg">
      <div 
        className={`absolute bottom-0 w-full bg-opacity-90 transition-all duration-[1000ms] ease-linear ${
            active ? "h-0 delay-300" : "h-3/4"
        }`} 
        style={{ backgroundColor: color }} 
      />
    </div>
    <div 
      className={`absolute top-[90%] -left-1.5 w-1.5 origin-top transition-all duration-300 ${
        active ? "h-48 opacity-90 delay-300" : "h-0 opacity-0"
      }`}
      style={{ 
          transform: 'rotate(60deg)',
          background: `linear-gradient(to bottom, ${color}, ${color}CC, ${color}00)` 
      }} 
    >
        <div className="w-[1px] h-full bg-white/40 absolute left-0.5 blur-[0.5px]" />
    </div>
    {!active && (
         <div className="absolute top-[100%] -left-3 w-1.5 h-1.5 rounded-full animate-ping opacity-0 delay-700" style={{ backgroundColor: color }} />
    )}
  </div>
);

const Beaker = ({ baseColor, addedColor, finalColor, bubbles, phase }) => {
    const height = phase === 'idle' ? "40%" : "75%";
    const currentColor = phase === 'reacted' ? finalColor : baseColor;

    return (
      <div className="relative w-full h-full flex items-end justify-center pb-8">
        <div className="relative transform scale-75 sm:scale-100 transition-transform duration-500">
            <PouringVessel active={phase === 'pouring'} color={addedColor} />
            <div className="relative w-44 h-56 border-4 border-white/20 bg-white/5 rounded-b-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
                <SplashZone active={phase === 'pouring'} color={addedColor} />
                <div 
                    className="absolute bottom-0 w-full transition-all duration-[2000ms] ease-in-out"
                    style={{ height: height, backgroundColor: currentColor }}
                >
                    <div className="w-full h-3 bg-white/30 absolute top-0" />
                    {bubbles && phase === 'reacted' && (
                    <div className="absolute inset-0 w-full h-full">
                        {[...Array(12)].map((_, i) => (
                        <div key={i} className="absolute bg-white/60 rounded-full w-2 h-2 animate-bounce" 
                             style={{ 
                                left: `${Math.random()*90}%`, 
                                bottom: `${Math.random()*40}%`, 
                                animationDuration: `${0.5 + Math.random()}s`,
                                animationDelay: `${Math.random()}s` 
                             }} />
                        ))}
                    </div>
                    )}
                </div>
                <div className="absolute top-0 left-4 w-4 h-[90%] bg-gradient-to-r from-white/10 to-transparent rounded-full" />
                <div className="absolute right-0 top-12 w-6 h-0.5 bg-white/20" />
                <div className="absolute right-0 top-24 w-8 h-0.5 bg-white/20" />
                <div className="absolute right-0 top-36 w-6 h-0.5 bg-white/20" />
            </div>
        </div>
      </div>
    );
};

const BurnerStand = ({ active, type = "fire", label, isGas }) => (
  <div className="flex flex-col items-center justify-end h-full pb-8 transform scale-75 sm:scale-100">
     <div className="relative flex flex-col items-center">
        {!isGas && (
            <div className={`w-24 h-8 bg-gray-400 rounded-md mb-2 flex items-center justify-center border border-white/20 transition-all duration-1000 ${active ? 'bg-red-400 shadow-[0_0_30px_rgba(239,68,68,0.6)]' : ''}`}>
                <span className="text-[10px] font-bold text-black/50 tracking-wider uppercase">{label}</span>
            </div>
        )}
        {isGas && (
             <div className={`mb-4 transition-all duration-1000 ${active ? 'opacity-100' : 'opacity-30'}`}>
                 <div className="text-center text-xs font-bold text-blue-300 tracking-widest mb-1">{label}</div>
                 <div className="w-32 h-12 bg-white/5 rounded-full blur-xl animate-pulse" />
             </div>
        )}
        <div className={`relative w-12 h-32 origin-bottom transition-all duration-500 ${active ? 'scale-125 opacity-100' : 'scale-50 opacity-0'}`}>
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-t from-blue-500 via-blue-300 to-transparent blur-md rounded-full" />
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-white blur-sm rounded-full animate-pulse" />
        </div>
     </div>
     {!isGas ? (
         <div className="w-32 h-24 border-t-4 border-gray-600 flex justify-between relative z-10">
            <div className="w-2 h-full bg-gray-600 -rotate-6" />
            <div className="w-2 h-full bg-gray-600 rotate-6" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-16 bg-gray-700 rounded-t-lg" />
         </div>
     ) : (
         <div className="w-16 h-24 bg-gray-700 rounded-t-lg relative z-10 mt-2">
             <div className="absolute top-4 -right-4 w-8 h-2 bg-gray-600 rotate-12" />
         </div>
     )}
  </div>
);

const MacroView = ({ reactionId, animationPhase }) => {
  const visuals = {
    neutralization: { type: 'mix', base: '#e0f2fe', added: '#fca5a5', final: '#bae6fd' }, 
    displacement:   { type: 'mix', base: '#93c5fd', added: '#94a3b8', final: '#bef264' }, 
    salt:           { type: 'mix', base: '#a855f7', added: '#4ade80', final: '#ffffff' }, 
    zinc_acid:      { type: 'bubble', base: '#f3f4f6', added: '#9ca3af', final: '#d1d5db' },
    peroxide:       { type: 'bubble', base: '#fca5a5', added: '#000000', final: '#fee2e2' }, 
    marble_acid:    { type: 'bubble', base: '#e5e7eb', added: '#22c55e', final: '#d1d5db' },
    water:          { type: 'burn_gas', label: 'H₂ GAS' },
    methane:        { type: 'burn_gas', label: 'METHANE' },
    ammonia:        { type: 'burn_gas', label: 'AMMONIA' },
    ethanol_burn:   { type: 'burn_gas', label: 'ETHANOL VAPOR' },
    magnesium_burn: { type: 'burn_solid', label: 'MAGNESIUM' },
    thermite:       { type: 'burn_solid', label: 'THERMITE' },
    limestone:      { type: 'burn_solid', label: 'LIMESTONE' },
    precipitation:  { type: 'mix', base: '#fff', added: '#ddd', final: '#e5e7eb' },
  };

  const config = visuals[reactionId] || visuals.neutralization;

  return (
    <div className="h-full w-full bg-gray-900/80 rounded-xl border border-gray-700 p-4 sm:p-6 flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center z-10 mb-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Lab View</h3>
        <AnimatePresence mode="wait">
            <motion.span 
                key={animationPhase}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className={`text-xs font-bold ${animationPhase === 'reacted' ? "text-green-400" : "text-gray-500"}`}
            >
                {animationPhase === 'idle' ? "READY" : animationPhase === 'pouring' ? "INITIATING..." : "COMPLETE"}
            </motion.span>
        </AnimatePresence>
      </div>
      
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent" />

      <div className="flex-1 relative z-10 flex items-center justify-center">
        {(config.type === 'mix' || config.type === 'bubble') && (
            <Beaker 
                phase={animationPhase}
                baseColor={config.base}
                addedColor={config.added}
                finalColor={config.final}
                bubbles={config.type === 'bubble'}
            />
        )}
        {(config.type === 'burn_solid' || config.type === 'burn_gas') && (
            <BurnerStand 
                active={animationPhase === 'reacted'} 
                type="fire" 
                label={config.label}
                isGas={config.type === 'burn_gas'}
            />
        )}
      </div>
    </div>
  );
};

// --- 2. MICRO VIEW (3D ATOMS + TOPOLOGY-AWARE BONDS) ---

const BondSystem = ({ atomRefs, currentData, progress }) => {
  const meshRef = useRef();
  const cylinderGeo = useMemo(() => new THREE.CylinderGeometry(0.08, 0.08, 1, 8), []);
  const bondMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#aaaaaa", roughness: 0.3 }), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const MAX_BONDS = 60;

  // Helper to scan a structure and return bonded pairs indices
  const getBondPairs = (structure, atomIds) => {
    if(!structure) return [];
    const pairs = [];
    const ids = Object.keys(structure);
    
    for(let i=0; i<ids.length; i++) {
        for(let j=i+1; j<ids.length; j++) {
            const idA = ids[i];
            const idB = ids[j];
            const posA = new THREE.Vector3(...structure[idA]);
            const posB = new THREE.Vector3(...structure[idB]);
            
            // STRICT Threshold: 1.0 (Lower than 1.2 which is distance between H-H in H2O)
            if (posA.distanceTo(posB) < 1.0) {
                pairs.push([atomIds.indexOf(idA), atomIds.indexOf(idB)]);
            }
        }
    }
    return pairs;
  };

  // Pre-calculate Reactant Topology vs Product Topology
  const { reactantPairs, productPairs } = useMemo(() => {
    if (!currentData) return { reactantPairs: [], productPairs: [] };
    const atomIds = currentData.atoms.map(a => a.id);
    return {
        reactantPairs: getBondPairs(currentData.reactants, atomIds),
        productPairs: getBondPairs(currentData.products, atomIds)
    };
  }, [currentData]);

  // Render Loop
  useFrame(() => {
    if (!meshRef.current) return;
    
    let instanceId = 0;
    const atoms = atomRefs.current;
    const t = progress.current;

    // --- PHASE SWITCH LOGIC ---
    // If progress < 0.5, we enforce Reactant topology (Old bonds exist, break if stretched)
    // If progress >= 0.5, we enforce Product topology (New bonds form if close)
    const activePairs = t < 0.5 ? reactantPairs : productPairs;
    
    activePairs.forEach(([idxA, idxB]) => {
        const atomA = atoms[idxA];
        const atomB = atoms[idxB];

        if (atomA && atomB) {
            const posA = atomA.position;
            const posB = atomB.position;
            const dist = posA.distanceTo(posB);

            // Draw bond if atoms are physically close enough
            // 1.6 allows bonds to "stretch" slightly during movement before visually snapping
            if (dist < 1.6) { 
                const midX = (posA.x + posB.x) / 2;
                const midY = (posA.y + posB.y) / 2;
                const midZ = (posA.z + posB.z) / 2;
                
                dummy.position.set(midX, midY, midZ);
                dummy.lookAt(posB);
                dummy.rotateX(Math.PI / 2);
                dummy.scale.set(1, dist, 1);
                dummy.updateMatrix();
                
                meshRef.current.setMatrixAt(instanceId, dummy.matrix);
                instanceId++;
            }
        }
    });
    
    // Hide unused instances
    for (let k = instanceId; k < MAX_BONDS; k++) {
       dummy.position.set(0, -1000, 0); 
       dummy.scale.set(0, 0, 0);
       dummy.updateMatrix();
       meshRef.current.setMatrixAt(k, dummy.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[cylinderGeo, bondMat, MAX_BONDS]} />
  );
};

function Atom({ reactantPos, productPos, element, color, progress, setRef }) {
  const ref = useRef();
  
  useEffect(() => {
    if (ref.current) setRef(ref.current);
  }, [setRef]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = Math.min(progress.current, 1);
    const [sx, sy, sz] = reactantPos || [0, 0, 0];
    const [ex, ey, ez] = productPos || [0, 0, 0];
    const cp = [(sx + ex) / 2, (sy + ey) / 2 + 3, (sz + ez) / 2];
    
    let x = (1 - t) ** 2 * sx + 2 * (1 - t) * t * cp[0] + t ** 2 * ex;
    let y = (1 - t) ** 2 * sy + 2 * (1 - t) * t * cp[1] + t ** 2 * ey;
    let z = (1 - t) ** 2 * sz + 2 * (1 - t) * t * cp[2] + t ** 2 * ez;
    
    const time = state.clock.elapsedTime;
    x += Math.sin(time * 5) * 0.015; 
    y += Math.cos(time * 3) * 0.015;
    
    ref.current.position.set(x, y, z);
  });
  
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[0.35, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.4} emissive={color} emissiveIntensity={0.2} />
      <Html position={[0, 0, 0]} center zIndexRange={[100, 0]}>
        <span className="text-[10px] font-black text-white drop-shadow-md select-none opacity-80">{element}</span>
      </Html>
    </mesh>
  );
}

function ProgressDriver({ targetProgress, progress }) {
  useFrame(() => {
    progress.current += (targetProgress - progress.current) * 0.05;
  });
  return null;
}

// --- 3. REACTION ANALYSIS COMPONENT ---

const ReactionAnalysis = ({ reactionId }) => {
    const details = REACTION_DETAILS[reactionId] || REACTION_DETAILS.water;
    
    return (
        <div className="h-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Analysis</h3>
            </div>
            
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={reactionId + "type"}
                    className="space-y-1"
                >
                    <div className="text-xs font-semibold text-gray-400">CLASSIFICATION</div>
                    <div className="text-lg font-bold text-gray-800">{details.type}</div>
                    <div className={`text-sm font-medium ${details.energy.includes("Exo") ? "text-orange-500" : "text-blue-500"}`}>
                        {details.energy}
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    key={reactionId + "context"}
                    className="space-y-2"
                >
                    <div className="text-xs font-semibold text-gray-400">REAL WORLD CONTEXT</div>
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-800 text-sm font-medium border border-blue-100">
                        {details.context}
                    </div>
                    {/* Trigger diagram based on context data */}
                    <div className="hidden"></div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    key={reactionId + "facts"}
                    className="space-y-2"
                >
                    <div className="text-xs font-semibold text-gray-400">KEY CONCEPTS</div>
                    <ul className="space-y-2">
                        {details.facts.map((fact, i) => (
                            <li key={i} className="flex gap-2 text-sm text-gray-600">
                                <span className="text-blue-400">•</span>
                                {fact}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-[10px] text-center text-gray-400">
                Educational Purpose Only • Standard Conditions (STP)
            </div>
        </div>
    );
};

// --- 4. MAIN COMPONENT ---

export default function ReactionSimulation() {
  const [activeReactionId, setActiveReactionId] = useState("neutralization");
  const [animationPhase, setAnimationPhase] = useState("idle"); 
  const progress = useRef(0);
  const [target3DProgress, setTarget3DProgress] = useState(0);
  
  // Refs for Bond System
  const atomRefs = useRef([]);

  useEffect(() => {
    resetSimulation();
  }, [activeReactionId]);

  const resetSimulation = () => {
    setAnimationPhase("idle");
    setTarget3DProgress(0);
    progress.current = 0;
    atomRefs.current = [];
  };

  const startReaction = () => {
    if (animationPhase !== 'idle') return;
    setAnimationPhase("pouring");
    setTimeout(() => {
        setAnimationPhase("reacted");
        setTarget3DProgress(1); 
    }, 1500);
  };

  const currentData = REACTIONS_DATA[activeReactionId];

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 space-y-6 select-none">
      
      {/* Animated Header & Controls */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 flex flex-col md:flex-row justify-between gap-6 items-center"
      >
        <div className="flex-1 w-full text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-3">
             {currentData.name}
             <span className="hidden sm:inline text-gray-300">|</span>
             <span className="text-xs sm:text-sm font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {currentData.equation}
             </span>
          </h2>
          <p className="text-gray-500 mt-2 text-xs sm:text-sm">{currentData.description}</p>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto min-w-[240px]">
           <label className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:block">Configuration</label>
           <select 
             value={activeReactionId}
             onChange={(e) => setActiveReactionId(e.target.value)}
             className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
           >
             {Object.entries(REACTIONS_DATA).map(([key, data]) => (
               <option key={key} value={key}>{data.name}</option>
             ))}
           </select>

           <div className="flex gap-2 h-12">
              <motion.button
                 whileTap={{ scale: 0.95 }}
                 onClick={resetSimulation}
                 disabled={animationPhase === 'idle'}
                 className="flex-1 rounded-lg font-bold text-sm bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Reset
              </motion.button>
              <motion.button
                 whileTap={{ scale: 0.95 }}
                 onClick={startReaction}
                 disabled={animationPhase !== 'idle'}
                 className={`flex-1 rounded-lg font-bold text-sm text-white shadow-lg transition-all
                    ${animationPhase === 'idle' 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-blue-500/30' 
                        : 'bg-gray-400 cursor-not-allowed'}`}
              >
                {animationPhase === 'idle' ? 'React!' : 'Processing...'}
              </motion.button>
           </div>
        </div>
      </motion.div>

      {/* 3-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-full">
        
        {/* Col 1: Lab Bench */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="h-[400px] lg:h-full shadow-2xl rounded-xl overflow-hidden"
        >
          <MacroView reactionId={activeReactionId} animationPhase={animationPhase} />
        </motion.div>

        {/* Col 2: Atomic Simulation */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="h-[400px] lg:h-full bg-black rounded-xl overflow-hidden relative shadow-2xl ring-4 ring-gray-900"
        >
            <div className="absolute top-4 left-4 z-10">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Atomic View</div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${target3DProgress === 1 ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                    <span className="text-xs font-bold text-white/90">
                        {target3DProgress === 1 ? 'Bonding Active' : 'Stable'}
                    </span>
                </div>
            </div>
            
            <Canvas 
                shadows 
                camera={{ position: [0, 0, 16], fov: 25 }} 
                dpr={[1, 2]}
            >
              <color attach="background" args={["#050505"]} />
              
              <ambientLight intensity={0.4} />
              <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
              <pointLight position={[-5, -5, -5]} intensity={0.5} color="#6366f1" />
              <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade />

              <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                <Center>
                  <group>
                    <ProgressDriver targetProgress={target3DProgress} progress={progress} />
                    
                    {currentData.atoms.map((atom, index) => (
                      <Atom
                        key={atom.id}
                        element={atom.element}
                        color={atom.color}
                        progress={progress}
                        reactantPos={currentData.reactants[atom.id]}
                        productPos={currentData.products[atom.id]}
                        setRef={(el) => (atomRefs.current[index] = el)}
                      />
                    ))}

                    <BondSystem atomRefs={atomRefs} currentData={currentData} progress={progress} />

                  </group>
                </Center>
              </Float>

              <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={0.6} intensity={1.0} radius={0.5} />
                <Vignette eskil={false} offset={0.1} darkness={0.7} />
                <Noise opacity={0.04} />
              </EffectComposer>

              <OrbitControls 
                  enablePan={false} 
                  enableZoom={false} 
                  enableRotate={true}
              />
            </Canvas>

            <div className="absolute bottom-4 left-4 flex gap-2 pointer-events-none flex-wrap max-w-[95%]">
                {Array.from(new Set(currentData.atoms.map(a => JSON.stringify({e: a.element, c: a.color}))))
                    .map(s => JSON.parse(s))
                    .map((item) => (
                    <div key={item.e} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white/90 border border-white/5 shadow-lg">
                        <div className="w-2 h-2 rounded-full border border-white/20" style={{backgroundColor: item.c}}></div>
                        <span>{item.e}</span>
                    </div>
                ))}
            </div>
        </motion.div>

        {/* Col 3: Reaction Analysis */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="h-auto lg:h-full"
        >
            <ReactionAnalysis reactionId={activeReactionId} />
        </motion.div>

      </div>
    </div>
  );
}