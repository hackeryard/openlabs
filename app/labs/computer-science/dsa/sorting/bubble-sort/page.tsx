"use client";

import BubbleSort from "@/app/components/computer-science/dsa/sorting/BubbleSort";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import { useLab } from "@/app/hooks/useXP";

export default function Merge() {
  const { completeExperiment } = useLab("computer-science/dsa/sorting/bubble-sort", "computerScience", "simulation");
  return (
    <div>
      <DailyChallengeCard labId="computer-science/dsa/sorting/bubble-sort" currentParams={{ arraysSorted: 1, swapsMade: 1, comparisonsMade: 1 }} />
      <BubbleSort />
    </div>
  );
}
