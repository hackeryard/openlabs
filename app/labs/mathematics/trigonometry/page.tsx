import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Trigonometry Visualizer Simulation | Mathematics | OpenLabs",
  description:
    "Interactive trigonometry simulation. Explore unit circle coordinates, right-triangle trigonometric ratios, and wave unfolding in real time.",
  keywords: [
    "trigonometry simulation",
    "unit circle visualizer",
    "sine cosine wave unrolling",
    "trigonometric identities",
    "math lab",
  ],
};

const TrigonometryLab = dynamic(
  () => import("@/app/components/mathematics/trigonometry/TrigonometryLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="mathematics"
        customMessage="Loading Trigonometry Visualizer Engine..."
      />
    ),
  }
);

export default function TrigonometryLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <TrigonometryLab />
    </main>
  );
}
