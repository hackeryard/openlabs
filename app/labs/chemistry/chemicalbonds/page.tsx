"use client";

import { useParams } from "next/navigation";
import ChemicalBondTypes from "@/app/components/chemistry/ChemicalBondTypes";
import { useEffect } from "react";
import { useChat } from "@/app/components/ChatContext";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

export default function ElectronicConfigurationPage() {
  const { completeExperiment } = useLab("chemistry/chemicalbonds", "chemistry", "exploration");
  // Chatbot 
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "Chemical Bond Types",
      theory: "",
      extraContext: ``,
    });
  }, []);
  return (
    <>
      <DailyChallengeCard labId="chemistry/chemicalbonds" currentParams={{ bondsExplored: 1 }} />
      <ChemicalBondTypes onComplete={completeExperiment} />
    </>
  )
}
