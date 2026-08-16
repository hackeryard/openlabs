import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Vector Algebra & 3D Space Simulation | Mathematics | OpenLabs",
  description:
    "Interactive Vector Algebra simulation. Explore 2D vector addition, Parallelogram Law, Dot Product & Orthogonal Projections, 3D Cross Product with Right-Hand Rule, and Scalar Triple Product parallelepiped volumes.",
  keywords: [
    "vector algebra simulation",
    "parallelogram law of vectors",
    "dot product visualizer",
    "cross product 3d right hand rule",
    "scalar triple product volume",
    "vector projection calculator",
    "linear algebra and vectors",
  ],
};

const VectorAlgebraLab = dynamic(
  () => import("@/app/components/mathematics/vectors/VectorAlgebraLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="mathematics"
        customMessage="Loading Vector Engine & 3D Space..."
      />
    ),
  }
);

export default function VectorAlgebraLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <VectorAlgebraLab />
    </main>
  );
}
