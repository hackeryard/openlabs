import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Linear Algebra & Matrix Transformations Simulation | Mathematics | OpenLabs",
  description:
    "Interactive 2D linear transformations simulation. Explore basis vectors, warped grid lines, determinant area scaling, and invariant eigenvectors in real time.",
  keywords: [
    "linear algebra simulation",
    "matrix transformation visualizer",
    "basis vectors î and ĵ",
    "determinant area scaling",
    "eigenvalues eigenvectors",
    "math lab",
  ],
};

const LinearAlgebraLab = dynamic(
  () => import("@/app/components/mathematics/linearalgebra/LinearAlgebraLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="mathematics"
        customMessage="Loading Linear Algebra Engine..."
      />
    ),
  }
);

export default function LinearAlgebraLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <LinearAlgebraLab />
    </main>
  );
}
