import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Interactive Geometry Studio Simulation | Mathematics | OpenLabs",
  description:
    "Interactive Euclidean Geometry studio. Construct points, lines, circles, and polygons, explore Triangle Centers (Centroid, Incenter, Circumcenter, Orthocenter, Euler line), verify Circle Theorems, and apply 2D rigid transformations.",
  keywords: [
    "geometry simulation",
    "geogebra alternative",
    "interactive geometric constructions",
    "triangle centers euler line",
    "inscribed angle theorem visualizer",
    "2d transformations geometry",
    "regular polygon generator",
  ],
};

const GeometryLab = dynamic(
  () => import("@/app/components/mathematics/geometry/GeometryLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="mathematics"
        customMessage="Loading Geometry Construction Engine..."
      />
    ),
  }
);

export default function GeometryLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <GeometryLab />
    </main>
  );
}
