"use client"

import { useChat } from '@/app/components/ChatContext';
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'

const ReactionSimulation = dynamic(() => import('../../components/chemistry/reactions/ReactionSimulation'), {
  ssr: false,
  loading: () => <p className="p-6">Loading reaction simulation…</p>,

})

export default function ChemistryPage() {
  // Chatbot 
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "Chemistry Reaction Simulation",
      theory: "",
      extraContext: ``,
    });
  }, []);
  return (
    <>
      <ReactionSimulation />
    </>
  )
}