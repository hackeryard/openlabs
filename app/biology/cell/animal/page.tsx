'use client'

import { useChat } from "@/app/components/ChatContext";
import dynamic from "next/dynamic"
import { useEffect } from "react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

const AnimalCell = dynamic(() => import("@/app/components/biology/cell/animal/AnimalCell"), {
  ssr: false,
})

export default function Page() {
  const { completeExperiment } = useLab("biology/cell/animal", "biology", "exploration");
  // Chatbot 
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "3D structure model of animal cell.",
      theory: "",
      extraContext: ``,
    });
  }, []);
  return (
    <main className="flex flex-col justify-center">
      <DailyChallengeCard labId="biology/cell/animal" currentParams={{ organellesExplored: 1 }} />
      <AnimalCell onComplete={completeExperiment} />
    </main>
  )
}
