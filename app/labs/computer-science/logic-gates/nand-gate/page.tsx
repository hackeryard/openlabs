"use client";

import NandGate from "@/app/components/computer-science/logic-gates/NandGate";
import { useEffect } from "react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

export default function Page() {
  const { completeExperiment } = useLab("computer-science/logic-gates/nand-gate", "computerScience", "exploration");

  return (
    <div>
      <DailyChallengeCard labId="computer-science/logic-gates/nand-gate" currentParams={{ inputsToggled: 1, trueOutputsAchieved: 1 }} />
      <NandGate />
    </div>
  );
}
