"use client";

import AndGate from "@/app/components/computer-science/logic-gates/AndGate";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import { useLab } from "@/app/hooks/useXP";

export default function Page() {
  const { completeExperiment } = useLab("computer-science/logic-gates/and-gate", "computerScience", "simulation");
  return (
    <div>
      <DailyChallengeCard labId="computer-science/logic-gates/and-gate" currentParams={{ inputsToggled: 1, trueOutputsAchieved: 1 }} />
      <AndGate onComplete={completeExperiment} />
    </div>
  );
}
