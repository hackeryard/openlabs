"use client";

import { useParams } from "next/navigation";
import ElectronicConfiguration from "@/app/components/chemistry/ElectronicConfiguration";
import { elements } from "@/app/src/data/elements";
import { useEffect } from "react";
import { useChat } from "@/app/components/ChatContext";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

export default function ElectronicConfigurationPage() {
  const { completeExperiment } = useLab("chemistry/electronic-configuration", "chemistry", "exploration");
  // Chatbot 
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "Electronic Configuration",
      theory: "",
      extraContext: ``,
    });
  }, []);
  const { atomicNumber } = useParams();
  const Z = Number(atomicNumber);

  const element = elements.find(
    (e) => e.atomicNumber === Z
  );

  if (!element) {
    return (
      <div className="p-10 text-center">
        Element not found
      </div>
    );
  }

  return (
    <>
      <DailyChallengeCard labId="chemistry/electronic-configuration" currentParams={{ elementsVisualized: 1 }} />
      <ElectronicConfiguration atomicNumber={atomicNumber} symbol={element.symbol} name={element.name} onComplete={completeExperiment} />
    </>
  )
}
