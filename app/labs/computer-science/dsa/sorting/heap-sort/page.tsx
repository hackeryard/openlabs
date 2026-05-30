"use client";

import HeapSort from "@/app/components/computer-science/dsa/sorting/HeapSort";
import { useEffect } from "react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

export default function Page() {
  const { completeExperiment } = useLab("computer-science/dsa/sorting/heap-sort", "computerScience", "exploration");

  return (
    <div>
      <DailyChallengeCard labId="computer-science/dsa/sorting/heap-sort" currentParams={{ algorithmsRun: 1, structuresExplored: 1 }} />
      <HeapSort />
    </div>
  );
}
