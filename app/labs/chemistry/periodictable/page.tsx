"use client"
import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useChat } from '@/app/components/ChatContext';
import { useLab } from '@/app/hooks/useXP';
import DailyChallengeCard from '@/app/components/DailyChallengeCard';

const PeriodicTable = dynamic(() => import('@/app/components/chemistry/PeriodicTable'), {
  ssr: false,
  loading: () => <p className="p-6">Loading periodic table…</p>,
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
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">Periodic Table</h1>
        <p className="text-gray-600 mb-4">Interactive periodic table.</p>
        <DailyChallengeCard labId="chemistry/periodictable" currentParams={{ elementsVisited: 1, groupExplored: 1, periodExplored: 1 }} />
        <PeriodicTable onComplete={completeExperiment} />
      </div>
    </main>
  )
}
