"use client"

import { useChat } from '@/app/components/ChatContext';
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'
import { useLab } from '@/app/hooks/useXP';
import DailyChallengeCard from '@/app/components/DailyChallengeCard';

const ReactionSimulation = dynamic(() => import('../../components/chemistry/reactions/ReactionSimulation'), {
  ssr: false,
  loading: () => <p className="p-6">Loading reaction simulation…</p>,

})

export default function ChemistryPage() {
  const { completeExperiment } = useLab("chemistry/reaction-simulation", "chemistry", "simulation");
  // Chatbot 
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "Chemistry Reaction Simulation",
      theory: "",
      extraContext: ``,
    });
  }, []);
  useEffect(() => { const timer = setTimeout(() => completeExperiment(), 15000); return () => clearTimeout(timer); }, []);
  return (
    <>
      <DailyChallengeCard labId="chemistry/reaction-simulation" currentParams={{ reactionsRun: 1, temperature: 25, yield: 0 }} />
      <ReactionSimulation />
    </>
  )
}