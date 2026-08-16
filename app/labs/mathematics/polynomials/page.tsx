import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Quadratic & Polynomial Explorer Simulation | Mathematics | OpenLabs",
  description:
    "Interactive quadratic and polynomial simulation. Explore parabola geometry, discriminant analysis, higher-degree polynomial behaviors, and step-by-step synthetic division.",
  keywords: [
    "polynomial simulation",
    "quadratic explorer",
    "parabola visualizer",
    "discriminant calculator",
    "synthetic division solver",
    "math lab",
  ],
};

const PolynomialLab = dynamic(
  () => import("@/app/components/mathematics/polynomials/PolynomialLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="mathematics"
        customMessage="Loading Polynomial & Quadratic Engine..."
      />
    ),
  }
);

export default function PolynomialLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <PolynomialLab />
    </main>
  );
}
