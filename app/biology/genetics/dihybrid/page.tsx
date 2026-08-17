import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dihybrid Cross & Independent Assortment - Interactive Biology Lab | OpenLabs",
  description: "Explore Mendel's Law of Independent Assortment with a 16-cell interactive Punnett matrix and live 9:3:3:1 phenotype ratio visualizations.",
};

const content: EducationalContent = {
  slug: "genetics/dihybrid",
  subject: "Biology",
  title: "Dihybrid Cross & Independent Assortment Studio",
  description: "Track two unlinked genetic traits simultaneously across a 4x4 matrix and discover why dihybrid crosses produce the classic 9:3:3:1 ratio.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Combine two independent genes and animate 16 fertilizations to see how traits sort without influencing each other.",
  theory: {
    content: `<p>A <strong>Dihybrid Cross</strong> tracks two independent gene loci simultaneously (e.g. Seed Shape <code>R/r</code> and Seed Color <code>Y/y</code>). Mendel's <strong>Law of Independent Assortment</strong> states that alleles for different traits segregate independently during gamete formation.</p>`,
  },
  mathematicalFoundations: {
    equations: [
      "\\text{Gametes via FOIL: } RY, Ry, rY, ry \\quad (4 \\times 4 = 16 \\text{ Offspring})",
      "9 \\text{ (DomDom)} : 3 \\text{ (DomRec)} : 3 \\text{ (RecDom)} : 1 \\text{ (RecRec)}",
    ],
    explanation: "Combinatorial product of two independent 3:1 monohybrid crosses: (3:1)(3:1) = 9:3:3:1.",
  },
  learningObjectives: [
    "Generate 4 distinct gamete types using the FOIL method.",
    "Fill and analyze a 16-cell dihybrid Punnett square.",
    "Categorize the 4 phenotypic classes and calculate probabilities.",
  ],
  realWorldApplications: ["Agricultural crop hybrid vigor", "Complex multi-gene trait breeding", "Evolutionary genetics"],
  howItWorks: "Select parent genotypes for both traits, click Animate Fertilizations, and review ratio counts.",
  faqs: [
    {
      question: "When does Independent Assortment fail?",
      answer: "When two genes are located close together on the same chromosome (genetic linkage), they tend to be inherited together unless crossing over occurs.",
    },
  ],
  relatedExperiments: [],
};

export default function DihybridLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/biology/genetics/dihybrid"
    />
  );
}
