import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Dihybrid Cross & Independent Assortment Simulation | Biology | OpenLabs",
  description: "Interactive 16-cell Dihybrid Punnett Square simulation. Track 2 gene traits simultaneously and verify Mendelian 9:3:3:1 phenotype ratios.",
};

const DihybridLab = dynamic(
  () => import("@/app/components/biology/genetics/dihybrid/DihybridLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="biology"
        customMessage="Loading 16-Cell Dihybrid Matrix..."
      />
    ),
  }
);

export default function DihybridLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <DihybridLab />
    </main>
  );
}
