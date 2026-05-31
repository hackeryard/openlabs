"use client";

import StackVisualizer from "@/app/components/computer-science/dsa/stack/Stack";
import { useEffect } from "react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

export default function Page() {
  const { completeExperiment } = useLab("computer-science/dsa/stack", "computerScience", "exploration");

  return (
    <div>
      <DailyChallengeCard labId="computer-science/dsa/stack" currentParams={{ algorithmsRun: 1, structuresExplored: 1 }} />
      <StackVisualizer />
    </div>
  );
}
