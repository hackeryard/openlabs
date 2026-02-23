"use client"

import { useState, Suspense, useEffect } from "react"
import ProceduralAnatomy from "@/app/components/biology/human/HumanBody"
import dynamic from "next/dynamic"
import InfoPanel from "@/app/components/biology/human/InfoPanel"
import { useChat } from "@/app/components/ChatContext"

const AnatomyScene = dynamic(
  () => import("@/app/components/biology/human/AnatomyScene"),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">Loading 3D model...</div> }
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
  const [type, setType] = useState<"human" | "animal">("human")

  return (
    <div className="grid md:grid-cols-3 h-screen">
      {/* <ProceduralAnatomy /> */}

      <div className="md:col-span-2">
        <AnatomyScene type={type} onSelect={setSelectedOrgan} />
      </div>

      <div className="border-l">
        <div className="flex gap-2 p-2">
          <button onClick={() => setType("human")}>Human</button>
          <button onClick={() => setType("animal")}>Animal</button>
        </div>
        <InfoPanel organ={selectedOrgan} />
      </div>

    </div>
  )
}
