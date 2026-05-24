"use client";

import PacketSwitchingLab from "@/app/components/computer-science/networking/PacketSwitchingLab";
import React, { useEffect } from "react";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

export default function Page() {
  const { completeExperiment } = useLab("computer-science/networking", "computerScience", "exploration");
  useEffect(() => { const timer = setTimeout(() => completeExperiment(), 10000); return () => clearTimeout(timer); }, []);

  return (
    <>
      <DailyChallengeCard labId="computer-science/networking" currentParams={{ protocolsExplored: 1 }} />
      <PacketSwitchingLab />
    </>
  );
}