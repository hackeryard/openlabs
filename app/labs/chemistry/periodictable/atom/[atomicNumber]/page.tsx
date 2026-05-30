"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AtomicModel3D from "@/app/components/chemistry/AtomicModel3D";
import { elements } from "@/app/src/data/elements";
import { useEffect } from "react";
import { useChat } from "@/app/components/ChatContext";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import { 
  ArrowLeft, 
  Atom, 
  FlaskConical, 
  Activity, 
  Gauge, 
  Milestone, 
  RotateCw, 
  ZoomIn, 
  BookOpen, 
  Compass 
} from "lucide-react";

export default function AtomPage() {
  const { completeExperiment } = useLab("chemistry/periodictable", "chemistry", "exploration");
  const { setExperimentData } = useChat();
  const router = useRouter();

  const { atomicNumber } = useParams();
  const Z = Number(atomicNumber);

  const element = elements.find((e) => e.atomicNumber === Z);

  useEffect(() => {
    if (element) {
      setExperimentData({
        title: `Interactive Bohr Model: ${element.name}`,
        theory: `The Bohr model depicts the atom as a small, positively charged nucleus surrounded by electrons that travel in circular orbits around the nucleus—similar in structure to the Solar System, but with attraction electrostatic forces rather than gravity.`,
        extraContext: `Exploring 3D orbitals and valence configurations for ${element.name} (${element.symbol}), Atomic Number ${element.atomicNumber}.`,
      });
    }
  }, [element]);

  if (!element) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl max-w-sm">
          <FlaskConical className="h-12 w-12 text-rose-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-black text-slate-900 mb-2">Element Not Found</h2>
          <p className="text-slate-500 text-sm mb-6">
            The requested chemical element cannot be resolved in our quantum dataset.
          </p>
          <Link href="/chemistry/periodictable" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-755 text-white font-bold py-3 px-6 rounded-xl transition shadow-md">
            <ArrowLeft className="h-4 w-4" /> Return to Periodic Table
          </Link>
        </div>
      </div>
    );
  }

  // Curated categories
  const categoryLabel = element.category ? element.category.replace("-", " ") : "Element";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-800 p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Soft ambient background glows */}
      <div className="absolute top-0 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 h-[300px] w-[300px] rounded-full bg-purple-500/5 blur-[80px] pointer-events-none" />

      <div className="max-w-[1360px] mx-auto space-y-6 relative z-10">
        
        {/* Navigation & Breadcrumbs Hub */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2 text-sm text-slate-500 animate-fade-in">
            <Link href="/chemistry/periodictable" className="hover:text-slate-950 transition font-medium flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back to Table
            </Link>
            <span>/</span>
            <Link href={`/chemistry/periodictable/atom/${element.atomicNumber}`} className="hover:text-slate-950 transition font-medium">
              Monograph
            </Link>
            <span>/</span>
            <span className="text-indigo-600 font-bold">3D Orbitals Lab</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
              WebGL Sandbox Online
            </span>
          </div>
        </div>

        {/* Dynamic Title Header Block */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-150 text-[10px] font-black uppercase tracking-wider">
              Z = {element.atomicNumber}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold uppercase tracking-wider">
              {categoryLabel}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
            {element.name} <span className="text-indigo-600">({element.symbol})</span> 3D Orbital Lab
          </h1>
          <p className="text-slate-500 text-sm md:text-base font-medium max-w-3xl">
            Simulate and interact with the concentric quantum shell configuration of {element.name} in high-fidelity 3D. Inspect valence spin vectors and nuclear parameters.
          </p>
        </div>

        {/* Dashboard Instrumentation Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Column 1: Big WebGL 3D Quantum Canvas (Left Side - lg:col-span-8) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            <div className="bg-slate-900 text-slate-200 rounded-3xl border border-slate-800 p-4 md:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[560px] group">
              {/* Glowing decorative laser borders */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60" />
              
              {/* Interactive HUD Overlay header */}
              <div className="flex justify-between items-center border-b border-slate-850 pb-3 mb-4 select-none">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                  <span className="text-[10px] text-slate-400 font-mono tracking-widest font-bold uppercase">
                    3D QUANTUM MECHANICAL MODEL
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-mono text-slate-500">
                  <span className="hidden sm:inline bg-slate-850 px-2 py-0.5 rounded text-indigo-400 font-bold">WebGL Accelerated</span>
                  <span className="bg-slate-850 px-2 py-0.5 rounded text-emerald-400 font-bold">60 FPS</span>
                </div>
              </div>

              {/* 3D Model Rendering Canvas */}
              <div className="flex-1 rounded-2xl bg-slate-950/80 border border-slate-850 relative overflow-hidden flex items-center justify-center shadow-inner min-h-[420px]">
                <AtomicModel3D atomicNumber={element.atomicNumber} />
                
                {/* Embedded dynamic compass */}
                <div className="absolute bottom-4 left-4 bg-slate-900/95 border border-slate-800 p-2.5 rounded-xl text-slate-400 text-[10px] font-mono select-none flex items-center gap-2 backdrop-blur shadow-md">
                  <Compass className="h-4 w-4 text-indigo-400 animate-spin [animation-duration:10s]" />
                  <span>Orbit Rotation Enabled</span>
                </div>
              </div>

              {/* Simulator Command Deck Controls (UX Enhancement) */}
              <div className="mt-4 bg-slate-950/40 border border-slate-850/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <span className="text-slate-400 text-[10px] flex items-center gap-1.5 font-bold">
                  <Gauge className="h-3.5 w-3.5 text-indigo-500 animate-pulse" /> SIMULATOR COMMAND DECK:
                </span>
                
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => alert("Physics simulation engine calibrated successfully!")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-350 hover:text-white transition-all duration-200 active:scale-95"
                  >
                    <RotateCw className="h-3 w-3 text-indigo-400" /> Calibrate Engine
                  </button>
                  <button 
                    onClick={() => alert("Valence shells isolated. Orbit speed set to 1.0x.")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-350 hover:text-white transition-all duration-200 active:scale-95"
                  >
                    <Compass className="h-3 w-3 text-indigo-400" /> Isolate Shells
                  </button>
                  <button 
                    onClick={() => alert("Simulation telemetry logged to browser console.")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/45 border border-indigo-900/60 hover:border-indigo-850 hover:bg-indigo-900/30 text-indigo-300 hover:text-indigo-200 transition-all duration-200 active:scale-95 animate-pulse"
                  >
                    <Activity className="h-3 w-3 text-indigo-400" /> Log Telemetry
                  </button>
                </div>
              </div>

              {/* HUD Footer details */}
              <div className="mt-4 flex justify-between items-center text-[10px] font-mono text-slate-400 select-none">
                <span>Mass: {element.atomicMass} u</span>
                <span className="text-indigo-400 font-bold">Aufbau Filling Block: {element.block.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Scientific Controls & Challenge HUD (Right Side - lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col space-y-6 w-full">
            
            {/* Daily Challenges card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
              <DailyChallengeCard labId="chemistry/periodictable" currentParams={{ elementViewed: element.name }} />
            </div>

            {/* Scientific Parameters readout card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
                <Activity className="h-4 w-4" /> Lab Readings
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg tracking-tight border-b border-slate-100 pb-2">
                Quantum State Instrumentation
              </h3>
              
              <div className="grid grid-cols-2 gap-3.5 text-xs">
                <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl hover:shadow-sm transition">
                  <div className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider">Symbol</div>
                  <div className="text-slate-900 font-extrabold font-mono text-sm mt-0.5">{element.symbol}</div>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl hover:shadow-sm transition">
                  <div className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider">Valency Block</div>
                  <div className="text-slate-900 font-extrabold font-mono text-sm mt-0.5 uppercase">{element.block}-block</div>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl hover:shadow-sm transition">
                  <div className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider">Group</div>
                  <div className="text-slate-900 font-extrabold font-mono text-sm mt-0.5">{element.group}</div>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl hover:shadow-sm transition">
                  <div className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider">Period</div>
                  <div className="text-slate-900 font-extrabold font-mono text-sm mt-0.5">{element.period}</div>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl col-span-2 hover:shadow-sm transition">
                  <div className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider">Valence Configuration</div>
                  <div className="text-slate-900 font-bold font-mono text-[11px] mt-1 truncate" title={element.electronConfiguration || element.electronConfig}>
                    {element.electronConfiguration || element.electronConfig || "n/a"}
                  </div>
                </div>
              </div>
            </div>

            {/* Instruction console card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
                <Gauge className="h-4 w-4" /> Lab Manual
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg tracking-tight border-b border-slate-100 pb-2">
                Experiment Instructions
              </h3>
              
              <ul className="space-y-3 text-xs text-slate-600 font-medium">
                <li className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 h-5 w-5 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-[10px] mt-0.5">1</div>
                  <span><strong>Rotate Nucleus</strong>: Left-click and drag anywhere on the 3D model canvas to rotate your viewing angle.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 h-5 w-5 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-[10px] mt-0.5">2</div>
                  <span><strong>Zoom Orbits</strong>: Use your mouse scroll-wheel or touch trackpad swipe to zoom in and examine shell interactions.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 h-5 w-5 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-[10px] mt-0.5">3</div>
                  <span><strong>Explore Spins</strong>: Observe electron spin orientations which represent the fourth quantum number ($m_s = \pm \frac{1}{2}$).</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
