import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DNA Transcription & Translation - Interactive Biology Lab | OpenLabs",
  description: "Experience the Central Dogma of biology with interactive DNA unzipping, complementary mRNA transcription, tRNA ribosome translation, and mutation testing.",
};

const content: EducationalContent = {
  slug: "genetics/transcription-translation",
  subject: "Biology",
  title: "DNA Transcription & Translation Studio",
  description: "Unravel how genetic code in DNA transforms into functional proteins through RNA Polymerase transcription and ribosomal tRNA translation.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Step through the Central Dogma of molecular biology and test point mutations live.",
  theory: {
    content: `<p>The <strong>Central Dogma of Molecular Biology</strong> explains the flow of genetic information: <code>DNA \\rightarrow \\text{mRNA} \\rightarrow \\text{Protein}</code>. Transcription copies a DNA template strand into mRNA in the nucleus, and Translation converts 3-letter mRNA codons into polypeptide chains in ribosomes.</p>`,
  },
  mathematicalFoundations: {
    equations: [
      "\\text{DNA (A, T, C, G)} \\xrightarrow{\\text{RNA Polymerase}} \\text{mRNA (U, A, G, C)}",
      "\\text{64 Codons} \\rightarrow \\text{20 Amino Acids + 3 STOP Codons}",
    ],
    explanation: "Degeneracy of the genetic code provides protection against silent point mutations.",
  },
  learningObjectives: [
    "Apply complementary base pairing rules during mRNA transcription.",
    "Decode 3-letter codons into amino acids using the standard genetic code.",
    "Test Silent, Missense, Nonsense, and Frameshift mutations.",
  ],
  realWorldApplications: ["mRNA vaccines (COVID-19)", "Genetic disease therapies (Sickle cell CRISPR)", "Biotechnology insulin synthesis"],
  howItWorks: "Type any DNA template or pick a mutation preset, then click Simulate to watch transcription and translation.",
  faqs: [
    {
      question: "Why do proteins always start with Methionine?",
      answer: "The universal START codon in all eukaryotic mRNA is AUG, which codes for the amino acid Methionine.",
    },
  ],
  relatedExperiments: [],
};

export default function TranscriptionTranslationLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/biology/genetics/transcription-translation"
    />
  );
}
