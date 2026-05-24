"use client";

import XnorGate from "@/app/components/computer-science/logic-gates/XnorGate";
import { useEffect } from "react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

export default function Page() {
  const { completeExperiment } = useLab("computer-science/logic-gates", "computerScience", "simulation");
  useEffect(() => { const timer = setTimeout(() => completeExperiment(), 10000); return () => clearTimeout(timer); }, []);

  return (
    <div>
      <DailyChallengeCard labId="computer-science/logic-gates" currentParams={{ outputMatched: true, gatesUsed: 1 }} />
      <XnorGate />
    </div>
  );
}
