"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useChat } from "@/app/components/ChatContext";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import { Atom } from "lucide-react";
import UniversalLoader from "@/app/components/UniversalLoader";

const PeriodicTable = dynamic(() => import("@/app/components/chemistry/PeriodicTable"), {
  ssr: false,
  loading: () => <UniversalLoader subject="chemistry" customMessage="Loading Periodic Table..." />
});

export default function PeriodicTablePage() {
  const { completeExperiment } = useLab("chemistry/periodictable", "chemistry", "exploration");
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "Chemical Elements Periodic Table",
      theory: "Interactive exploration of all 118 chemical elements, atomic numbers, valence electrons, orbitals, and chemical family groupings.",
      extraContext: "Filter by families, inspect physical & atomic properties, and launch 3D atomic orbital visualizations.",
    });
  }, [setExperimentData]);

  return (
    <main className="min-h-screen bg-background text-foreground p-2 sm:p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="pointer-events-none absolute top-0 right-1/4 h-[420px] w-[420px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-[320px] w-[320px] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-[1600px] space-y-4 sm:space-y-6">
        <div className="rounded-3xl border border-border bg-card/85 p-3 shadow-md backdrop-blur sm:p-4">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
            <Atom className="h-4 w-4" />
            Daily Objective
          </div>
          <DailyChallengeCard labId="chemistry/periodictable" currentParams={{ elementsVisited: 1, groupExplored: 1, periodExplored: 1 }} />
        </div>
        <PeriodicTable onComplete={completeExperiment} />
      </div>
    </main>
  );
}
