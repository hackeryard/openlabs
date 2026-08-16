import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Calculus & Derivatives Sandbox Simulation | Mathematics | OpenLabs",
  description:
    "Interactive differential and integral calculus simulation. Explore secant-to-tangent limits, difference quotients, Riemann sums, and optimization extrema in real time.",
  keywords: [
    "calculus simulation",
    "derivative limit visualizer",
    "riemann sums calculator",
    "definite integrals sandbox",
    "optimization critical points",
    "math lab",
  ],
};

const CalculusLab = dynamic(
  () => import("@/app/components/mathematics/calculus/CalculusLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="mathematics"
        customMessage="Loading Calculus & Differential Engine..."
      />
    ),
  }
);

export default function CalculusLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <CalculusLab />
    </main>
  );
}
