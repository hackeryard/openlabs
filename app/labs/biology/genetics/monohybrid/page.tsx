import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Monohybrid Punnett Square Simulation | Biology | OpenLabs",
  description: "Interactive Monohybrid Punnett Square simulation. Breed live creature avatars, animate meiosis and fertilization, and test 100-offspring batch drops.",
};

const MonohybridLab = dynamic(
  () => import("@/app/components/biology/genetics/monohybrid/MonohybridLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="biology"
        customMessage="Loading Monohybrid Punnett Square & Creature Avatars..."
      />
    ),
  }
);

export default function MonohybridLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <MonohybridLab />
    </main>
  );
}
