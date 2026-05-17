"use client";

import InsertionSort from "@/app/components/computer-science/dsa/sorting/InsertionSort";
import { useEffect } from "react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

export default function Page() {
  const { completeExperiment } = useLab("computer-science/dsa", "computerScience", "exploration");
  useEffect(() => { const timer = setTimeout(() => completeExperiment(), 10000); return () => clearTimeout(timer); }, []);

  return (
    <div>
      <DailyChallengeCard labId="computer-science/dsa" currentParams={{ algorithmsRun: 1, structuresExplored: 1 }} />
      <InsertionSort />
    </div>
  );
}
