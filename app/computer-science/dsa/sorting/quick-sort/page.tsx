"use client";

import QuickSort from "@/app/components/computer-science/dsa/sorting/QuickSort";
import { useEffect } from "react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

export default function Page() {
  const { completeExperiment } = useLab("computer-science/dsa/sorting/quick-sort", "computerScience", "exploration");

  return (
    <div>
      <DailyChallengeCard labId="computer-science/dsa/sorting/quick-sort" currentParams={{ algorithmsRun: 1, structuresExplored: 1 }} />
      <QuickSort onComplete={completeExperiment} />
    </div>
  );
}
