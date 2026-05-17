"use client";

import TopologyBuilder from "@/app/components/computer-science/networking/TopologyBuilder";
import React, { useEffect } from "react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

export default function Page() {
  const { completeExperiment } = useLab("computer-science/networking", "computerScience", "exploration");
  useEffect(() => { const timer = setTimeout(() => completeExperiment(), 10000); return () => clearTimeout(timer); }, []);

  return (
    <>
      <DailyChallengeCard labId="computer-science/networking" currentParams={{ topologiesBuilt: 1 }} />
      <TopologyBuilder />
    </>
  );
}