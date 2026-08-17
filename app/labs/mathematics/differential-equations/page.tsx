import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Differential Equations Simulation | Mathematics | OpenLabs",
  description:
    "Interactive Differential Equations and Dynamical Systems simulation. Explore slope fields with Euler/Heun/RK4 integrators, 2D phase planes, Lotka-Volterra predator-prey cycles, 3D Lorenz strange attractors, and SIR epidemic dynamics.",
  keywords: [
    "differential equations simulation",
    "slope fields interactive visualizer",
    "runge kutta rk4 solver",
    "phase plane portrait analyzer",
    "lotka volterra predator prey simulator",
    "lorenz strange attractor 3d",
    "sir epidemic model curve",
  ],
};

const DifferentialEquationsLab = dynamic(
  () => import("@/app/components/mathematics/differential-equations/DifferentialEquationsLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="mathematics"
        customMessage="Loading Differential Equations Integrator & Phase Space..."
      />
    ),
  }
);

export default function DifferentialEquationsLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <DifferentialEquationsLab />
    </main>
  );
}
