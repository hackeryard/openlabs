"use client"

import dynamic from "next/dynamic"
import { useEffect } from "react"
import { useLab } from "@/app/hooks/useXP"
import DailyChallengeCard from "@/app/components/DailyChallengeCard"

import UniversalLoader from "@/app/components/UniversalLoader"

const BrainNeuron = dynamic(() => import("@/app/components/biology/brainNeuron/BrainNeuron"), {
  ssr: false,
  loading: () => <UniversalLoader subject="biology" customMessage="Loading Brain Neuron Simulation..." />
})

export default function BrainNeuronPage() {
  const { completeExperiment } = useLab("biology/brainNeuron", "biology", "exploration");

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="p-2">
        <DailyChallengeCard labId="biology/brainNeuron" currentParams={{ neuronsExplored: 1 }} />
      </div>
      <BrainNeuron />
    </div>
  );
}