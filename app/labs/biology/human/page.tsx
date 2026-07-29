"use client"

import { useState, Suspense, useEffect } from "react"
import ProceduralAnatomy from "@/app/components/biology/human/HumanBody"
import dynamic from "next/dynamic"
import InfoPanel from "@/app/components/biology/human/InfoPanel"
import { useChat } from "@/app/components/ChatContext"
import { useLab } from "@/app/hooks/useXP"
import DailyChallengeCard from "@/app/components/DailyChallengeCard"

import UniversalLoader from "@/app/components/UniversalLoader"

const AnatomyScene = dynamic(
  () => import("@/app/components/biology/human/AnatomyScene"),
  { ssr: false, loading: () => <UniversalLoader subject="biology" customMessage="Loading 3D Anatomy Model..." /> }
)

export default function Page() {
  // Chatbot 
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "3D Structure model of human anatomy.",
      theory: "",
      extraContext: ``,
    });
  }, []);
  const [selectedOrgan, setSelectedOrgan] = useState("")
  const [type, setType] = useState<"human" | "skeleton">("human")
  const { completeExperiment } = useLab("biology/human", "biology", "exploration");
  const [explored, setExplored] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (selectedOrgan) {
      setExplored(prev => {
        const next = new Set(prev).add(selectedOrgan);
        if (next.size >= 3) completeExperiment();
        return next;
      });
    }
  }, [selectedOrgan, completeExperiment]);

  return (
    <div className="grid md:grid-cols-3 h-screen">
      <div className="md:col-span-3 p-2">
        <DailyChallengeCard labId="biology/human" currentParams={{ structuresExplored: explored.size }} />
      </div>
      {/* <ProceduralAnatomy /> */}

      <div className="md:col-span-2">
        <AnatomyScene type={type} onSelect={setSelectedOrgan} />
      </div>

      <div className="border-l">
        <div className="flex gap-2 p-2">
          <button onClick={() => setType("human")}>Human</button>
          <button onClick={() => setType("skeleton")}>Skeleton</button>
        </div>
        <InfoPanel organ={selectedOrgan} />
      </div>

    </div>
  )
}
