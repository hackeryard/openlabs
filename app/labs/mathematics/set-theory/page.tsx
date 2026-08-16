import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Set Theory & Boolean Algebra Simulation | Mathematics | OpenLabs",
  description:
    "Interactive Set Theory simulation. Explore 2-set and 3-set Venn diagrams, set operations (union, intersection, difference, complement), Inclusion-Exclusion principle, injective/surjective functions, and truth tables.",
  keywords: [
    "set theory simulation",
    "venn diagram generator",
    "set operations visualizer",
    "inclusion exclusion principle",
    "injective surjective bijective functions",
    "boolean algebra truth tables",
    "discrete mathematics lab",
  ],
};

const SetTheoryLab = dynamic(
  () => import("@/app/components/mathematics/settheory/SetTheoryLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="mathematics"
        customMessage="Loading Set Theory & Venn Engine..."
      />
    ),
  }
);

export default function SetTheoryLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <SetTheoryLab />
    </main>
  );
}
