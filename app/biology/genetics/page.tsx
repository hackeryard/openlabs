import React from "react";
import ClientGrid from "@/app/computer-science/ClientGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Genetics & Heredity Labs | Biology | OpenLabs",
  description:
    "Explore interactive genetics virtual labs: Monohybrid Punnett Squares, Dihybrid 16-cell crosses, DNA Transcription & Translation, and 3-generation Pedigree Trees.",
  keywords: [
    "genetics virtual labs",
    "punnett square simulator",
    "dihybrid cross 16 cell",
    "dna transcription translation interactive",
    "pedigree tree analyzer",
    "mendelian genetics",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/genetics",
  },
  openGraph: {
    title: "Genetics & Heredity Labs | OpenLabs",
    description:
      "Interactive genetics labs: Monohybrid crosses, Dihybrid assortment, Central Dogma protein synthesis, and Pedigree charts.",
    url: "https://www.openlabs.org.in/biology/genetics",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const cards = [
  {
    href: "/biology/genetics/monohybrid",
    title: "Monohybrid Punnett Square",
    desc: "Single-trait inheritance with live creature avatars, gamete fertilizations, and 100-offspring batch drops.",
    accent: "from-purple-500 to-indigo-500",
  },
  {
    href: "/biology/genetics/dihybrid",
    title: "Dihybrid Cross & Assortment",
    desc: "16-cell interactive Punnett matrix tracking 2 traits simultaneously with live Mendelian 9:3:3:1 ratio breakdowns.",
    accent: "from-indigo-500 to-blue-500",
  },
  {
    href: "/biology/genetics/transcription-translation",
    title: "DNA Transcription & Translation",
    desc: "Central Dogma pipeline: DNA template unzipping, complementary mRNA copying, tRNA ribosome reading, and mutation testing.",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    href: "/biology/genetics/pedigree",
    title: "Pedigree Tree & Inheritance",
    desc: "3-generation human family tree analyzer for Autosomal Dominant, Autosomal Recessive, and X-Linked Recessive traits.",
    accent: "from-rose-500 to-pink-500",
  },
];

export default function GeneticsHubPage() {
  return (
    <ClientGrid
      title="Genetics &amp; Heredity Studios"
      description="Explore the molecular code of life: from Gregor Mendel's pea plant laws to the Central Dogma of protein synthesis and clinical human pedigrees."
      intro="Genetics explains how biological information passes from parents to offspring. Explore these 4 interactive standalone studios to breed digital creatures on Punnett squares, watch RNA Polymerase transcribe genes into proteins, and trace multi-generational inherited traits across family trees."
      cards={cards}
    />
  );
}
