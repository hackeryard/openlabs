"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ElectronicConfiguration from "@/app/components/chemistry/ElectronicConfiguration";
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
  Layers, 
  Info, 
  ShieldAlert, 
  Compass 
} from "lucide-react";

// Dynamic Category Coloring for Light Theme consistent panels
const categoryMap: Record<string, { label: string; bg: string; text: string; border: string; glow: string }> = {
  "nonmetal": {
    label: "Reactive Nonmetal",
    bg: "bg-emerald-50 text-emerald-800 border-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    glow: "shadow-emerald-100 hover:border-emerald-350"
  },
  "noble-gas": {
    label: "Noble Gas",
    bg: "bg-blue-50 text-blue-800 border-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    glow: "shadow-blue-100 hover:border-blue-350"
  },
  "alkali-metal": {
    label: "Alkali Metal",
    bg: "bg-red-50 text-red-800 border-red-100",
    text: "text-red-700",
    border: "border-red-200",
    glow: "shadow-red-100 hover:border-red-350"
  },
  "alkaline-earth": {
    label: "Alkaline Earth Metal",
    bg: "bg-orange-50 text-orange-800 border-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
    glow: "shadow-orange-100 hover:border-orange-350"
  },
  "metalloid": {
    label: "Metalloid",
    bg: "bg-teal-50 text-teal-800 border-teal-100",
    text: "text-teal-700",
    border: "border-teal-200",
    glow: "shadow-teal-100 hover:border-teal-350"
  },
  "post-transition": {
    label: "Post-Transition Metal",
    bg: "bg-slate-50 text-slate-800 border-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    glow: "shadow-slate-100 hover:border-slate-350"
  },
  "transition-metal": {
    label: "Transition Metal",
    bg: "bg-indigo-50 text-indigo-800 border-indigo-100",
    text: "text-indigo-755",
    border: "border-indigo-200",
    glow: "shadow-indigo-100 hover:border-indigo-350"
  },
  "lanthanide": {
    label: "Lanthanide",
    bg: "bg-pink-50 text-pink-800 border-pink-100",
    text: "text-pink-700",
    border: "border-pink-200",
    glow: "shadow-pink-100 hover:border-pink-350"
  },
  "actinide": {
    label: "Actinide",
    bg: "bg-yellow-50 text-yellow-800 border-yellow-100",
    text: "text-yellow-755",
    border: "border-yellow-200",
    glow: "shadow-yellow-100 hover:border-yellow-350"
  },
  "halogen": {
    label: "Halogen",
    bg: "bg-purple-50 text-purple-800 border-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
    glow: "shadow-purple-100 hover:border-purple-350"
  }
};

const ELECTRON_EXCEPTIONS: Record<number, { reason: string; ideal: string; active: string }> = {
  24: {
    ideal: "[Ar] 3d⁴ 4s²",
    active: "[Ar] 3d⁵ 4s¹",
    reason: "Half-filled d-subshell (d⁵) is symmetrical and provides maximum exchange energy, which is thermodynamically more stable."
  },
  29: {
    ideal: "[Ar] 3d⁹ 4s²",
    active: "[Ar] 3d¹⁰ 4s¹",
    reason: "A completely filled d-subshell (d¹⁰) provides extra electrostatic shielding and symmetry, making it more stable."
  },
  42: {
    ideal: "[Kr] 4d⁴ 5s²",
    active: "[Kr] 4d⁵ 5s¹",
    reason: "Half-filled d-subshell stability."
  },
  46: {
    ideal: "[Kr] 4d⁸ 5s²",
    active: "[Kr] 4d¹⁰",
    reason: "Completely filled d-subshell providing unique chemical inertness."
  },
  47: {
    ideal: "[Kr] 4d⁹ 5s²",
    active: "[Kr] 4d¹⁰ 5s¹",
    reason: "Filled d-subshell stability. Molybdenum and Silver promote s-electrons to achieve high ground-state orbital symmetry."
  },
  79: {
    ideal: "[Xe] 4f¹⁴ 5d⁹ 6s²",
    active: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹",
    reason: "Relativistic s-orbital contraction and filled d-subshell stability."
  },
};

const ORBITALS = [
  { n: 1, type: "s", cap: 2 },
  { n: 2, type: "s", cap: 2 },
  { n: 2, type: "p", cap: 6 },
  { n: 3, type: "s", cap: 2 },
  { n: 3, type: "p", cap: 6 },
  { n: 4, type: "s", cap: 2 },
  { n: 3, type: "d", cap: 10 },
  { n: 4, type: "p", cap: 6 },
  { n: 5, type: "s", cap: 2 },
  { n: 4, type: "d", cap: 10 },
  { n: 5, type: "p", cap: 6 },
  { n: 6, type: "s", cap: 2 },
  { n: 4, type: "f", cap: 14 },
  { n: 5, type: "d", cap: 10 },
  { n: 6, type: "p", cap: 6 },
  { n: 7, type: "s", cap: 2 },
  { n: 5, type: "f", cap: 14 },
  { n: 6, type: "d", cap: 10 },
  { n: 7, type: "p", cap: 6 },
];

function calculateConfiguration(Z: number) {
  let remaining = Z;
  const orbitals: { label: string; electrons: number; type: string; shell: number }[] = [];
  const shells: Record<number, number> = {};

  for (const o of ORBITALS) {
    if (remaining <= 0) break;
    const e = Math.min(o.cap, remaining);
    remaining -= e;

    orbitals.push({
      label: `${o.n}${o.type}`,
      electrons: e,
      type: o.type,
      shell: o.n,
    });

    shells[o.n] = (shells[o.n] || 0) + e;
  }

  const exception = ELECTRON_EXCEPTIONS[Z];
  if (exception) {
    const targetFix = Z === 24 ? [{ label: "4s", electrons: 1 }, { label: "3d", electrons: 5 }] :
                      Z === 29 ? [{ label: "4s", electrons: 1 }, { label: "3d", electrons: 10 }] :
                      Z === 47 ? [{ label: "5s", electrons: 1 }, { label: "4d", electrons: 10 }] : [];
    
    targetFix.forEach((fix) => {
      const target = orbitals.find((o) => o.label === fix.label);
      if (target) {
        const diff = fix.electrons - target.electrons;
        target.electrons = fix.electrons;
        shells[target.shell] += diff;
      }
    });
  }

  return shells;
}

export default function ElectronicConfigurationPage() {
  const { completeExperiment } = useLab("chemistry/electronic-configuration", "chemistry", "exploration");
  const { setExperimentData } = useChat();

  const { atomicNumber } = useParams();
  const Z = Number(atomicNumber);

  const element = elements.find((e) => e.atomicNumber === Z);

  useEffect(() => {
    if (element) {
      setExperimentData({
        title: `Electronic Configuration Lab: ${element.name}`,
        theory: `Electrons occupy orbitals in a way that minimizes the energy of the atom. According to the Aufbau Principle, electrons fill lower-energy subshells before moving to higher ones. Hund's Rule states that single electrons with parallel spins must occupy each equal-energy orbital before doubling up.`,
        extraContext: `Simulating ground state electronic configuration shell filling for ${element.name} (${element.symbol}), Atomic Number ${element.atomicNumber}.`,
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

  const categoryStyle = categoryMap[element.category] || {
    label: element.category,
    bg: "bg-slate-100 text-slate-800 border-slate-200",
    text: "text-slate-700",
    border: "border-slate-200",
    glow: "shadow-slate-100 hover:border-slate-350"
  };

  const shells = calculateConfiguration(Z);
  const exception = ELECTRON_EXCEPTIONS[Z];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-800 p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 h-[300px] w-[300px] rounded-full bg-purple-500/5 blur-[80px] pointer-events-none" />

      <div className="max-w-[1360px] mx-auto space-y-6 relative z-10">
        
        {/* Navigation & Breadcrumbs Hub */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <Link href="/chemistry/periodictable" className="hover:text-slate-950 transition font-medium flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back to Table
            </Link>
            <span>/</span>
            <Link href={`/chemistry/periodictable/atom/${element.atomicNumber}`} className="hover:text-slate-950 transition font-medium">
              Monograph
            </Link>
            <span>/</span>
            <span className="text-indigo-600 font-bold">Configuration Lab</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
              Orbital Simulator Online
            </span>
          </div>
        </div>

        {/* Dynamic Title Header Block */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-150 text-[10px] font-black uppercase tracking-wider">
              Z = {element.atomicNumber}
            </span>
            <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${categoryStyle.bg}`}>
              {categoryStyle.label}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
            {element.name} <span className="text-indigo-600">({element.symbol})</span> Electronic Config Lab
          </h1>
          <p className="text-slate-500 text-sm md:text-base font-medium max-w-3xl">
            Configure, spin, and fill the energy subshells of {element.name}. Experiment with Hund's rule, the Pauli exclusion principle, and Aufbau orbital structures.
          </p>
        </div>

        {/* Dashboard Instrumentation Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Column 1: Big Interactive Configurations Sandbox (Left Side - lg:col-span-8) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-4 md:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[560px] group">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              
              {/* Interactive HUD Overlay header */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4 select-none">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                  <span className="text-[10px] text-slate-400 font-mono tracking-widest font-bold uppercase">
                    VALENCE ORBITAL FILLING SYSTEM
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-mono text-slate-400 font-bold">
                  <span className="bg-indigo-50 px-2 py-0.5 rounded text-indigo-700">Autosaved State</span>
                </div>
              </div>

              {/* Configurations Lab Interactive Panel */}
              <div className="flex-1 rounded-2xl bg-slate-50 border border-slate-200/60 p-4 relative flex flex-col justify-center min-h-[420px]">
                <ElectronicConfiguration 
                  atomicNumber={atomicNumber} 
                  symbol={element.symbol} 
                  name={element.name} 
                  onComplete={completeExperiment} 
                />
              </div>
            </div>
          </div>

          {/* Column 2: Constants, Warning HUD, and Live Animated Bohr (Right Side - lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col space-y-6 w-full">
            
            {/* Daily Challenges card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
              <DailyChallengeCard labId="chemistry/electronic-configuration" currentParams={{ elementsVisualized: 1 }} />
            </div>

            {/* Dynamic Quantum Exception Alert Card */}
            {exception && (
              <div className="border border-amber-200 bg-amber-50/50 p-5 rounded-3xl shadow-sm relative overflow-hidden flex gap-3.5">
                <div className="absolute top-0 right-0 h-16 w-16 bg-amber-100/30 rounded-full blur-xl pointer-events-none" />
                <div className="flex-shrink-0 p-2.5 bg-amber-100 rounded-xl text-amber-700 h-fit">
                  <ShieldAlert className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-amber-850 text-[13px] tracking-tight mb-1">
                    Thermodynamic Exception Detected
                  </h3>
                  <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                    Instead of the predicted Aufbau filling order <code className="bg-amber-100/50 px-1 rounded font-bold font-mono">{exception.ideal}</code>, {element.name} promotes a valence electron to yield <strong className="bg-amber-100 px-1 rounded font-mono text-[11px] text-amber-900 border border-amber-200/50">{exception.active}</strong>. {exception.reason}
                  </p>
                </div>
              </div>
            )}

            {/* Animated Bohr Model Visual Indicator Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-md flex flex-col items-center text-center">
              <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs mb-3 w-full text-left">
                <Compass className="h-4 w-4 animate-spin [animation-duration:10s]" /> Live Bohr Indicator
              </div>
              <div className="h-44 w-full flex items-center justify-center relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100/50 shadow-inner p-2 mb-2">
                <BohrModelSVG symbol={element.symbol} shells={shells} />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Concentric Energy Rings rotate around the nucleus.
              </div>
            </div>

            {/* Instruction console card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
                <Gauge className="h-4 w-4" /> Lab Manual
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg tracking-tight border-b border-slate-100 pb-2">
                Orbital Filling Guide
              </h3>
              
              <ul className="space-y-3 text-xs text-slate-600 font-medium">
                <li className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 h-5 w-5 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-[10px] mt-0.5">1</div>
                  <span><strong>Aufbau Order</strong>: Add electrons to the lowest available energy orbital boxes (starting at 1s, then 2s, 2p, etc.).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 h-5 w-5 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-[10px] mt-0.5">2</div>
                  <span><strong>Hund's Rule</strong>: Single-fill all orbitals of equivalent energy with spin-up arrows before pairing them up with spin-down arrows.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 h-5 w-5 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-[10px] mt-0.5">3</div>
                  <span><strong>Exception Ground-State</strong>: If Z={element.atomicNumber} is an exception, ensure the final configuration meets the half-filled or completely-filled orbital stability.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// Concentric Bohr shell builder SVG Component (Optimized for Light Theme contrast)
function BohrModelSVG({ symbol, shells }: { symbol: string; shells: Record<number, number> }) {
  const maxShell = Math.max(...Object.keys(shells).map(Number), 1);
  const size = 100 + maxShell * 36;
  const center = size / 2;

  const shellCircles: React.ReactNode[] = [];
  const electronDots: React.ReactNode[] = [];

  Object.entries(shells).forEach(([shellStr, count]) => {
    const s = Number(shellStr);
    const r = 36 + s * 16;

    shellCircles.push(
      <circle
        key={`ring-${s}`}
        cx={center}
        cy={center}
        r={r}
        className="stroke-slate-200 fill-none stroke-[1.2px]"
        strokeDasharray="3 3"
      />
    );

    const dots: React.ReactNode[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (2 * Math.PI * i) / count;
      const ex = center + r * Math.cos(angle);
      const ey = center + r * Math.sin(angle);

      dots.push(
        <circle
          key={`dot-${s}-${i}`}
          cx={ex}
          cy={ey}
          r={4}
          className="fill-indigo-600 stroke-white stroke-[1.2px] shadow-sm hover:scale-125 transition"
        />
      );
    }

    // Dynamic rotation speeds & directions
    const rotationSpeed = 10 + s * 5;
    const rotationDirection = s % 2 === 0 ? "normal" : "reverse";
    const animationStyle = {
      transformOrigin: `${center}px ${center}px`,
      animation: `spin ${rotationSpeed}s linear infinite ${rotationDirection}`,
    };

    electronDots.push(
      <g key={`shell-group-${s}`} style={animationStyle}>
        {dots}
      </g>
    );
  });

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="max-w-[200px] mx-auto select-none">
      <defs>
        <radialGradient id="nucleus-glow-config" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>
      </defs>
      {shellCircles}
      <circle cx={center} cy={center} r={28} fill="url(#nucleus-glow-config)" />
      <circle cx={center} cy={center} r={16} className="fill-indigo-600 stroke-white stroke-[1.5px] shadow" />
      <text
        x={center}
        y={center + 4}
        textAnchor="middle"
        className="fill-white font-black text-[10px] tracking-tight"
      >
        {symbol}
      </text>
      {electronDots}
    </svg>
  );
}
