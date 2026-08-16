import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Function Grapher Simulation | Mathematics | OpenLabs",
  description:
    "Interactive function grapher simulation. Plot mathematical equations in real time, apply transformations, and analyze calculus roots and extrema.",
  keywords: [
    "function grapher simulation",
    "math graphing tool",
    "calculus lab",
    "function transformations",
    "online graphing calculator",
  ],
};

const FunctionGrapherLab = dynamic(
  () => import("@/app/components/mathematics/functiongrapher/FunctionGrapherLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="mathematics"
        customMessage="Initializing Function Grapher Engine..."
      />
    ),
  }
);

export default function FunctionGrapherLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <FunctionGrapherLab />
    </main>
  );
}
