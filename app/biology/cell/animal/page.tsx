'use client'

import { useChat } from "@/app/components/ChatContext";
import dynamic from "next/dynamic"
import { useEffect } from "react";

const AnimalCell = dynamic(() => import("@/app/components/biology/cell/animal/AnimalCell"), {
  ssr: false,
})

export default function Page() {
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
    <main className="flex justify-center">
      <AnimalCell />
    </main>
  )
}
