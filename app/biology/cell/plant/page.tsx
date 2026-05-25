'use client'

import { useChat } from "@/app/components/ChatContext";
import dynamic from "next/dynamic"
import { useEffect } from "react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

const PlantCell = dynamic(() => import("@/app/components/biology/cell/plant/PlantCell"), {
  ssr: false,
})

export default function Page() {
  const { completeExperiment } = useLab("biology/cell/plant", "biology", "exploration");
  // Chatbot 
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "3D structure model of plant cell.",
      theory: "",
      extraContext: ``,
    });
  }, []);
  return (
    <main className="flex flex-col justify-center">
      <DailyChallengeCard labId="biology/cell/plant" currentParams={{ organellesExplored: 1 }} />
      <PlantCell onComplete={completeExperiment} />
    </main>
  )
}
