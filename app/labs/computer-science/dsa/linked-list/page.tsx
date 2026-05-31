"use client";

import UniversalLinkedList from "@/app/components/computer-science/dsa/linked-list/LinkedList";
import { useEffect } from "react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

export default function Page() {
  const { completeExperiment } = useLab("computer-science/dsa/linked-list", "computerScience", "exploration");

  return (
    <div>
      <DailyChallengeCard labId="computer-science/dsa/linked-list" currentParams={{ algorithmsRun: 1, structuresExplored: 1 }} />
      <UniversalLinkedList />
    </div>
  );
}
