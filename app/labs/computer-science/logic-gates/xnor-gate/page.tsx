"use client";

import XnorGate from "@/app/components/computer-science/logic-gates/XnorGate";
import { useEffect } from "react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

export default function Page() {
  const { completeExperiment } = useLab("computer-science/logic-gates/xnor-gate", "computerScience", "exploration");

  return (
    <div>
      <DailyChallengeCard labId="computer-science/logic-gates/xnor-gate" currentParams={{ inputsToggled: 1, trueOutputsAchieved: 1 }} />
      <XnorGate />
    </div>
  );
}
