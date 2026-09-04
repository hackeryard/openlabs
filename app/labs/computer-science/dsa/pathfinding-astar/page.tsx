"use client";

import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

const LabComponent = dynamic(
  () => import("@/app/components/computer-science/dsa/pathfinding-astar/AStarPathfindingLab"),
  {
    ssr: false,
    loading: () => <UniversalLoader subject="computer-science" customMessage="Initializing A* Pathfinding Engine..." />,
  }
);

export default function Page() {
  return <LabComponent />;
}
