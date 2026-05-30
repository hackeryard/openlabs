"use client";

import SelectionSort from "@/app/components/computer-science/dsa/sorting/SelectionSort";
import { useEffect } from "react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

export default function Page() {
  const { completeExperiment } = useLab("computer-science/dsa/sorting/selection-sort", "computerScience", "exploration");

  return (
    <div>
      <DailyChallengeCard labId="computer-science/dsa/sorting/selection-sort" currentParams={{ algorithmsRun: 1, structuresExplored: 1 }} />
      <SelectionSort />
    </div>
  );
}
