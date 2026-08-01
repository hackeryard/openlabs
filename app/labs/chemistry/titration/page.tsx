import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Virtual Titration Lab | Chemistry | OpenLabs",
  description: "Perform acid-base and redox titrations online. Watch live pH curves, calculate concentrations using C₁V₁=C₂V₂, and master equivalence points. Free browser-based chemistry lab.",
  keywords: ["titration simulation", "virtual titration lab", "acid base titration online", "pH curve", "chemistry virtual lab"]
};

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const TitrationLab = dynamic(
  () => import("@/app/components/chemistry/titration/TitrationLab"),
  { 
    ssr: false, 
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Preparing Titration Equipment...</p>
        </div>
      </div>
    )
  }
);

export default function TitrationLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] overflow-y-auto lg:overflow-hidden">
      <TitrationLab />
    </main>
  );
}
