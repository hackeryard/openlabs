import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Pedigree Tree & Inheritance Patterns Simulation | Biology | OpenLabs",
  description: "Interactive 3-generation Pedigree Tree simulator. Explore Autosomal Dominant, Autosomal Recessive, and X-Linked Recessive inheritance with risk calculation.",
};

const PedigreeLab = dynamic(
  () => import("@/app/components/biology/genetics/pedigree/PedigreeLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="biology"
        customMessage="Loading Pedigree Tree & Inheritance Models..."
      />
    ),
  }
);

export default function PedigreeLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <PedigreeLab />
    </main>
  );
}
