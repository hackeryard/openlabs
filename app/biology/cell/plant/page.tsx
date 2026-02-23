'use client'

import { useChat } from "@/app/components/ChatContext";
import dynamic from "next/dynamic"
import { useEffect } from "react";

const PlantCell = dynamic(() => import("@/app/components/biology/cell/plant/PlantCell"), {
  ssr: false,
})

export default function Page() {
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
    <main className="flex justify-center">
      <PlantCell />
    </main>
  )
}
