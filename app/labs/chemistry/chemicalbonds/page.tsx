"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { useChat } from "@/app/components/ChatContext";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import { 
  ArrowLeft, 
  Activity, 
  Gauge, 
  Compass, 
  Milestone, 
  CheckCircle2, 
  Sparkles,
  Info 
} from "lucide-react";

/* ====================== 3D HELPERS ====================== */
function Atom3D({ position, color, size = 0.35 }) {
  return (
    <Sphere args={[size, 32, 32]} position={position}>
      <meshStandardMaterial color={color} roughness={0.1} metalness={0.1} />
    </Sphere>
  );
}

function Electron3D({ position }) {
  return (
    <Sphere args={[0.09, 16, 16]} position={position}>
      <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.5} />
    </Sphere>
  );
}

/* ====================== MAIN COMPONENT ====================== */
export default function ChemicalBondsLabPage() {
  const { completeExperiment } = useLab("chemistry/chemicalbonds", "chemistry", "exploration");
  const { setExperimentData } = useChat();
  const [enDiff, setEnDiff] = useState(1.5);
  const [explored, setExplored] = useState<Set<string>>(new Set());

  // Determine current active bonding predicted type
  const predictedBond =
    enDiff >= 1.7
      ? "Ionic Bond"
      : enDiff >= 0.4
      ? "Polar Covalent Bond"
      : "Non-Polar Covalent Bond";

  useEffect(() => {
    setExperimentData({
      title: "Interactive Chemical Bonding Laboratory",
      theory: "Chemical bonds hold atoms together to form compounds. The electronegativity difference (ΔEN) between the bonding atoms determines the bond character: high ΔEN transfers electrons (Ionic), moderate ΔEN shares them unequally (Polar Covalent), and low ΔEN shares them equally (Nonpolar Covalent).",
      extraContext: `Actively simulating electron sharing and transfer fields. Current Delta Electronegativity parameter is ΔEN = ${enDiff.toFixed(1)} (${predictedBond}).`,
    });
  }, [enDiff, predictedBond]);

  // Track exploration tasks and auto-complete lab once all 3 types are simulated
  useEffect(() => {
    const next = new Set(explored).add(predictedBond);
    setExplored(next);
    
    if (next.size >= 3) {
      completeExperiment();
    }
  }, [predictedBond]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-800 p-4 md:p-8 font-sans relative overflow-hidden bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] bg-[size:24px_24px]">
      
      {/* Dynamic background ambient glows */}
      <div className="absolute top-0 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 h-[300px] w-[300px] rounded-full bg-purple-500/5 blur-[80px] pointer-events-none" />

      <div className="max-w-[1360px] mx-auto space-y-6 relative z-10">
        
        {/* Navigation & Breadcrumbs Hub */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <Link href="/chemistry" className="hover:text-slate-950 transition font-medium flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back to Chemistry
            </Link>
            <span>/</span>
            <Link href="/chemistry/chemicalbonds" className="hover:text-slate-950 transition font-medium">
              Monograph
            </Link>
            <span>/</span>
            <span className="text-indigo-600 font-bold">3D Bonding Lab</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] text-indigo-700 font-extrabold uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/50">
              3D WebGL Workstation Active
            </span>
          </div>
        </div>

        {/* Dynamic Title Header Block */}
        <div className="space-y-2 text-left">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-150 text-[10px] font-black uppercase tracking-wider">
              Simulation Sandbox
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
            3D Chemical Bonding Laboratory
          </h1>
          <p className="text-slate-500 text-sm md:text-base font-medium max-w-3xl">
            Interact directly with molecular structures. Drag the slider to calibrate electronegativity, simulate electron transfer vs electron sharing, and examine three-dimensional geometries.
          </p>
        </div>

        {/* Dashboard Grid Cockpit Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main 3D Models & Sandbox (Left Column - lg:col-span-8) */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            
            {/* Electronegativity Simulator Console Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-5 text-left">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
                  <Gauge className="h-4 w-4 animate-pulse" /> Calibrator Slider
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Drag to modify bond properties</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                  <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
                    Electronegativity Difference Selector
                  </h3>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-2xl bg-indigo-50 border border-indigo-100 text-sm font-black font-mono text-indigo-755 shadow-sm">
                    ΔEN = {enDiff.toFixed(1)}
                  </div>
                </div>

                <div className="relative pt-2">
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.1"
                    value={enDiff}
                    onChange={(e) => setEnDiff(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  
                  {/* Gauge marker labels */}
                  <div className="flex justify-between text-[9px] font-mono text-slate-400 font-bold mt-2 select-none">
                    <span>0.0 (Pure covalent)</span>
                    <span>0.4 (Non-polar boundary)</span>
                    <span>1.7 (Ionic boundary)</span>
                    <span>4.0 (Max Delta)</span>
                  </div>
                </div>

                {/* Simulated Result Indicator Alert */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-inner">
                  <div>
                    <div className="text-[10px] text-slate-450 uppercase font-black tracking-wider font-mono">Current Stable Phase</div>
                    <div className="text-xl font-black text-indigo-600 tracking-tight mt-0.5">
                      {predictedBond}
                    </div>
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-bold font-mono text-slate-500 shadow-sm">
                    {enDiff >= 1.7 ? "Oppositely charged attraction" : "Shared valence electrons"}
                  </div>
                </div>
              </div>
            </div>

            {/* Widescreen 3D Model Panels */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
                  <Activity className="h-4 w-4" /> 3D Bond Models Viewports
                </div>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded animate-pulse">
                  3D WebGL Models Enabled
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 1. IONIC VIEWPORT */}
                <div className={`rounded-2xl border bg-white shadow-md transition duration-300 flex flex-col justify-between overflow-hidden relative ${predictedBond === "Ionic Bond" ? "ring-2 ring-indigo-500/80 shadow-lg scale-[1.01]" : "opacity-80"}`}>
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/50 z-20">
                    Ionic Bond
                  </div>

                  <div className="h-56 bg-slate-950 relative overflow-hidden flex items-center justify-center shadow-inner">
                    <Canvas camera={{ position: [0, 0, 4.5] }}>
                      <ambientLight intensity={1.5} />
                      <pointLight position={[5, 5, 5]} intensity={1.5} />
                      <Atom3D position={[-1, 0, 0]} color="#f97316" size={0.32} /> {/* Na Cation */}
                      <Atom3D position={[1, 0, 0]} color="#22c55e" size={0.45} /> {/* Cl Anion */}
                      <OrbitControls enableZoom={false} />
                    </Canvas>
                    <div className="absolute bottom-2.5 right-2.5 text-[8px] font-mono text-slate-500">NaCl lattice</div>
                  </div>

                  <div className="p-4 text-center border-t border-slate-50">
                    <p className="text-[11px] font-semibold text-slate-700">Electron Transfer</p>
                    <p className="text-[9px] text-slate-400 font-medium mt-0.5">Electrostatic ion attraction (ΔEN &ge; 1.7)</p>
                  </div>
                </div>

                {/* 2. COVALENT VIEWPORT */}
                <div className={`rounded-2xl border bg-white shadow-md transition duration-300 flex flex-col justify-between overflow-hidden relative ${predictedBond.includes("Covalent") ? "ring-2 ring-indigo-500/80 shadow-lg scale-[1.01]" : "opacity-80"}`}>
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/50 z-20">
                    Covalent Bond
                  </div>

                  <div className="h-56 bg-slate-950 relative overflow-hidden flex items-center justify-center shadow-inner">
                    <Canvas camera={{ position: [0, 0, 4.5] }}>
                      <ambientLight intensity={1.5} />
                      <pointLight position={[5, 5, 5]} intensity={1.5} />
                      <Atom3D position={[0, 0, 0]} color="#ef4444" size={0.4} /> {/* O Nucleus */}
                      <Electron3D position={[-0.6, 0.2, 0]} />
                      <Electron3D position={[0.6, -0.2, 0]} />
                      <OrbitControls enableZoom={false} />
                    </Canvas>
                    <div className="absolute bottom-2.5 right-2.5 text-[8px] font-mono text-slate-500">Shared spins</div>
                  </div>

                  <div className="p-4 text-center border-t border-slate-50">
                    <p className="text-[11px] font-semibold text-slate-700">Electron Sharing</p>
                    <p className="text-[9px] text-slate-400 font-medium mt-0.5">Overlapping valence orbits (ΔEN &lt; 1.7)</p>
                  </div>
                </div>

                {/* 3. METALLIC VIEWPORT */}
                <div className="rounded-2xl border bg-white shadow-md hover:shadow-lg transition duration-300 flex flex-col justify-between overflow-hidden relative opacity-85">
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200/50 z-20">
                    Metallic Bond
                  </div>

                  <div className="h-56 bg-slate-950 relative overflow-hidden flex items-center justify-center shadow-inner">
                    <Canvas camera={{ position: [0, 0, 4.5] }}>
                      <ambientLight intensity={1.5} />
                      <pointLight position={[5, 5, 5]} intensity={1.5} />
                      <Atom3D position={[-1, 0, 0]} color="#64748b" size={0.35} /> {/* Metal ion */}
                      <Atom3D position={[1, 0, 0]} color="#64748b" size={0.35} /> {/* Metal ion */}
                      <Electron3D position={[0, 0.6, 0.2]} />
                      <Electron3D position={[0, -0.6, -0.2]} />
                      <OrbitControls enableZoom={false} />
                    </Canvas>
                    <div className="absolute bottom-2.5 right-2.5 text-[8px] font-mono text-slate-500">Delocalized sea</div>
                  </div>

                  <div className="p-4 text-center border-t border-slate-50">
                    <p className="text-[11px] font-semibold text-slate-700">Electron Sea Model</p>
                    <p className="text-[9px] text-slate-400 font-medium mt-0.5">Free moving valence electrons lattice</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Column 2: Challenge HUD & Calibration Manual Checklist (Right Column - lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col space-y-6 w-full">
            
            {/* Daily Challenges card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
              <DailyChallengeCard labId="chemistry/chemicalbonds" currentParams={{ bondsExplored: explored.size }} />
            </div>

            {/* Lab Instrumentation Telemetry panel */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4 text-left">
              <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
                <Compass className="h-4 w-4 animate-spin [animation-duration:10s]" /> Lab Readings
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg tracking-tight border-b border-slate-100 pb-2">
                Experiment Status
              </h3>
              
              <div className="space-y-3.5 text-xs font-semibold">
                <div className="flex justify-between items-center bg-slate-50 border border-slate-150 p-3 rounded-xl">
                  <span className="text-slate-450 uppercase text-[9px] tracking-wider font-extrabold">Active Calibration</span>
                  <span className="text-slate-900 font-mono">{predictedBond}</span>
                </div>
                
                <div className="flex justify-between items-center bg-slate-50 border border-slate-150 p-3 rounded-xl">
                  <span className="text-slate-450 uppercase text-[9px] tracking-wider font-extrabold">Analyzed Characters</span>
                  <span className="text-indigo-600 font-bold font-mono bg-indigo-50 border border-indigo-100/60 px-2 py-0.5 rounded-lg">
                    {explored.size} / 3 Complete
                  </span>
                </div>
              </div>
            </div>

            {/* Lab Manual Checklist */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4 text-left">
              <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
                <Milestone className="h-4 w-4" /> Lab Manual
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg tracking-tight border-b border-slate-100 pb-2">
                Simulated Tasks
              </h3>
              
              <ul className="space-y-3.5 text-xs font-medium">
                <li className="flex items-start gap-2.5 text-slate-600">
                  <div className={`flex-shrink-0 h-4 w-4 rounded border flex items-center justify-center text-[10px] mt-0.5 ${explored.has("Ionic Bond") ? "bg-emerald-500 border-emerald-600 text-white font-bold" : "border-slate-300"}`}>
                    {explored.has("Ionic Bond") ? "✓" : ""}
                  </div>
                  <span><strong>Transfer state</strong>: Drag the ΔEN selector &ge; 1.7 to analyze **Ionic Bonding** (NaCl lattice transfer).</span>
                </li>

                <li className="flex items-start gap-2.5 text-slate-600">
                  <div className={`flex-shrink-0 h-4 w-4 rounded border flex items-center justify-center text-[10px] mt-0.5 ${explored.has("Polar Covalent Bond") ? "bg-emerald-500 border-emerald-600 text-white font-bold" : "border-slate-300"}`}>
                    {explored.has("Polar Covalent Bond") ? "✓" : ""}
                  </div>
                  <span><strong>Polar share state</strong>: Drag the selector between 0.4 and 1.7 to analyze **Polar Covalent Sharing**.</span>
                </li>

                <li className="flex items-start gap-2.5 text-slate-600">
                  <div className={`flex-shrink-0 h-4 w-4 rounded border flex items-center justify-center text-[10px] mt-0.5 ${explored.has("Non-Polar Covalent Bond") ? "bg-emerald-500 border-emerald-600 text-white font-bold" : "border-slate-300"}`}>
                    {explored.has("Non-Polar Covalent Bond") ? "✓" : ""}
                  </div>
                  <span><strong>Non-polar state</strong>: Drag the selector &le; 0.4 to analyze equal **Non-Polar Covalent Sharing**.</span>
                </li>
              </ul>

              {explored.size >= 3 && (
                <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl flex items-center gap-2.5 shadow-inner">
                  <Sparkles className="h-4.5 w-4.5 text-emerald-600 animate-pulse flex-shrink-0" />
                  <p className="text-[10px] font-bold leading-normal">
                    Experiment Complete! All chemical bond models analyzed successfully. XP granted!
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
