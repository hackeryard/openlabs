"use client";

import MergeSort from "@/app/components/computer-science/dsa/sorting/MergeSort";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import { useLab } from "@/app/hooks/useXP";

export default function Page() {
  const { completeExperiment } = useLab("computer-science/dsa/sorting/merge-sort", "computerScience", "simulation");
  return (
    <div>
      <DailyChallengeCard labId="computer-science/dsa/sorting/merge-sort" currentParams={{ arraysSorted: 1, splitsMade: 1, mergesMade: 1 }} />
      <MergeSort onComplete={completeExperiment} />
    </div>
  );
}
