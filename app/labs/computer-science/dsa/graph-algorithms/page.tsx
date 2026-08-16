"use client";

import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const GraphAlgorithmsLab = dynamic(
  () => import("@/app/components/computer-science/dsa/graph-algorithms/GraphAlgorithmsLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="computer-science"
        customMessage="Loading Graph Algorithms & Network Flow Simulation..."
      />
    ),
  }
);

export default function Page() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <GraphAlgorithmsLab />
    </div>
  );
}
