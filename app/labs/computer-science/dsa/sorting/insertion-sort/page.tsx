"use client";

import InsertionSort from "@/app/components/computer-science/dsa/sorting/InsertionSort";
import { useEffect } from "react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

export default function Page() {
  const { completeExperiment } = useLab("computer-science/dsa/sorting/insertion-sort", "computerScience", "exploration");

  return (
    <div>
      <DailyChallengeCard labId="computer-science/dsa/sorting/insertion-sort" currentParams={{ algorithmsRun: 1, structuresExplored: 1 }} />
      <InsertionSort />
    </div>
  );
}
