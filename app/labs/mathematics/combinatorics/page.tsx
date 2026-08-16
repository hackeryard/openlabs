import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Combinatorics & Counting Simulation | Mathematics | OpenLabs",
  description:
    "Interactive Combinatorics simulation. Explore Permutations P(n, r), Combinations C(n, r), Pascal's Triangle with Sierpinski/Fibonacci patterns, Dirichlet's Pigeonhole Principle, and Stars & Bars.",
  keywords: [
    "combinatorics simulation",
    "permutations and combinations visualizer",
    "pascals triangle generator",
    "binomial theorem expansion",
    "pigeonhole principle interactive",
    "stars and bars discrete math",
    "subfactorial derangements",
  ],
};

const CombinatoricsLab = dynamic(
  () => import("@/app/components/mathematics/combinatorics/CombinatoricsLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="mathematics"
        customMessage="Loading Combinatorics Engine & Pascal's Matrix..."
      />
    ),
  }
);

export default function CombinatoricsLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <CombinatoricsLab />
    </main>
  );
}
