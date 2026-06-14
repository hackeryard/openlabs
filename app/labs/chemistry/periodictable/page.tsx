"use client"
import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useChat } from '@/app/components/ChatContext';
import { useLab } from '@/app/hooks/useXP';
import DailyChallengeCard from '@/app/components/DailyChallengeCard';
import { Atom } from 'lucide-react';

import UniversalLoader from '@/app/components/UniversalLoader'

const PeriodicTable = dynamic(() => import('@/app/components/chemistry/PeriodicTable'), {
  ssr: false,
  loading: () => <UniversalLoader subject="chemistry" customMessage="Loading Periodic Table..." />
})

export default function PeriodicTablePage() {
  const { completeExperiment } = useLab("chemistry/periodictable", "chemistry", "exploration");
  // Chatbot 
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "Chemical Elements Periodic Table.",
      theory: "",
      extraContext: ``,
    });
  }, []);
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-800 p-2 sm:p-4 md:p-8 font-sans relative overflow-hidden bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] bg-[size:24px_24px]">
      <div className="pointer-events-none absolute top-0 right-1/4 h-[420px] w-[420px] rounded-full bg-indigo-500/5 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-[320px] w-[320px] rounded-full bg-purple-500/5 blur-[90px]" />

      <div className="relative z-10 mx-auto max-w-[1600px] space-y-4 sm:space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-3 shadow-md backdrop-blur sm:p-4">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-indigo-600">
            <Atom className="h-4 w-4" />
            Daily Objective
          </div>
          <DailyChallengeCard labId="chemistry/periodictable" currentParams={{ elementsVisited: 1, groupExplored: 1, periodExplored: 1 }} />
        </div>
        <PeriodicTable onComplete={completeExperiment} />
      </div>
    </main>
  )
}
