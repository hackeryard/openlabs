"use client";

import TopologyBuilder from "@/app/components/computer-science/networking/TopologyBuilder";
import React, { useEffect } from "react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

export default function Page() {
  const { completeExperiment } = useLab("computer-science/networking/topology-builder", "computerScience", "exploration");

  return (
    <>
      <DailyChallengeCard labId="computer-science/networking/topology-builder" currentParams={{ topologiesBuilt: 1 }} />
      <TopologyBuilder />
    </>
  );
}