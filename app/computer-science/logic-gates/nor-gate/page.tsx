"use client";

import NorGate from "@/app/components/computer-science/logic-gates/NorGate";
import { useEffect } from "react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

export default function Page() {
  const { completeExperiment } = useLab("computer-science/logic-gates/nor-gate", "computerScience", "exploration");

  return (
    <div>
      <DailyChallengeCard labId="computer-science/logic-gates/nor-gate" currentParams={{ inputsToggled: 1, trueOutputsAchieved: 1 }} />
      <NorGate onComplete={completeExperiment} />
    </div>
  );
}
