import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Complex Numbers & Fractals Explorer Simulation | Mathematics | OpenLabs",
  description:
    "Interactive Complex Analysis and Fractal Dynamics simulation. Explore the Argand complex plane, roots of unity, Euler's formula, and real-time Mandelbrot/Julia set fractals.",
  keywords: [
    "complex numbers simulation",
    "argand plane visualizer",
    "roots of unity explorer",
    "euler formula identity",
    "mandelbrot set zoomer",
    "julia set interactive",
    "math lab",
  ],
};

const ComplexNumbersLab = dynamic(
  () => import("@/app/components/mathematics/complexnumbers/ComplexNumbersLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="mathematics"
        customMessage="Loading Complex Analysis & Fractal Engine..."
      />
    ),
  }
);

export default function ComplexNumbersLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <ComplexNumbersLab />
    </main>
  );
}
