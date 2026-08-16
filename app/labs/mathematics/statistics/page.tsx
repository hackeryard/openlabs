import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Probability & Statistics Simulation | Mathematics | OpenLabs",
  description:
    "Interactive Probability and Statistics laboratory. Simulate the Galton Board, explore Central Limit Theorem sample means, calculate PDF/CDF confidence intervals, and fit OLS linear regressions.",
  keywords: [
    "probability simulation",
    "galton board bean machine",
    "central limit theorem sandbox",
    "normal distribution calculator",
    "linear regression simulator",
    "math lab",
  ],
};

const StatisticsLab = dynamic(
  () => import("@/app/components/mathematics/statistics/StatisticsLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="mathematics"
        customMessage="Loading Probability & Statistics Engine..."
      />
    ),
  }
);

export default function StatisticsLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <StatisticsLab />
    </main>
  );
}
