"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import UniversalLoader from "@/app/components/UniversalLoader";

// Dynamically import the Water Quality component
const WaterQualityLab = dynamic(
  () => import("@/app/components/chemistry/Water-quality"),
  {
    ssr: false,
    loading: () => <UniversalLoader subject="chemistry" customMessage="Initializing Spectroscopic Sensor Array..." />
  }
);

export default function WaterQualityPage() {
  const { completeExperiment } = useLab("chemistry/water-quality", "chemistry", "exploration");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-bold text-xs tracking-wider uppercase">Loading Laboratory Interface…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-800 p-4 md:p-8 font-sans relative overflow-hidden bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] bg-[size:24px_24px]">
      
      {/* Background ambient water glows */}
      <div className="absolute top-0 right-1/4 h-[400px] w-[400px] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 h-[300px] w-[300px] rounded-full bg-cyan-500/5 blur-[90px] pointer-events-none" />

      <div className="max-w-[1360px] mx-auto space-y-6 relative z-10">
        
        {/* Navigation Breadcrumbs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-4">
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <Link href="/chemistry" className="hover:text-slate-950 transition font-medium flex items-center gap-1.5" id="nav-back-chemistry">
              <ArrowLeft className="h-4 w-4" /> Back to Chemistry
            </Link>
            <span>/</span>
            <span className="text-teal-600 font-bold">Water Quality Lab</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-[10px] text-teal-700 font-extrabold uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-200/50">
              Spectrophotometer System Online
            </span>
          </div>
        </div>

        {/* Dynamic Title Header Block */}
        <div className="space-y-2 text-left">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-black uppercase tracking-wider">
              Simulation Sandbox
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
            Water Quality Analysis Laboratory
          </h1>
          <p className="text-slate-500 text-sm md:text-base font-medium max-w-3xl">
            Examine chemical and biological contaminants. Configure sensor arrays to monitor pH, dissolved oxygen, turbidity, and heavy metal concentrations in real-time under WHO regulations.
          </p>
        </div>

        {/* Daily Challenges card */}
        <div id="daily-challenge-panel" className="w-full">
          <DailyChallengeCard labId="chemistry/water-quality" currentParams={{ labExplored: true }} />
        </div>

        {/* Main Workstation Interface container */}
        <div className="w-full" id="water-quality-sandbox-container">
          <WaterQualityLab onComplete={completeExperiment} />
        </div>

      </div>
    </div>
  );
}
