import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pedigree Tree & Inheritance Patterns - Interactive Biology Lab | OpenLabs",
  description: "Explore 3-generation human pedigree trees, Autosomal Dominant, Autosomal Recessive, and X-Linked Recessive inheritance patterns with disease risk calculators.",
};

const content: EducationalContent = {
  slug: "genetics/pedigree",
  subject: "Biology",
  title: "Pedigree Tree & Inheritance Patterns Studio",
  description: "Learn how genetic counselors analyze multi-generational family medical histories to identify disease carriers and calculate recurrence risks.",
  difficulty: "Advanced",
  estimatedTime: "25 mins",
  heroDescription: "Inspect 3-generation family trees and master the rules governing Autosomal and X-Linked inheritance.",
  theory: {
    content: `<p>A <strong>Pedigree Chart</strong> is a family tree diagram using standard biological symbols (squares for males, circles for females, shaded shapes for affected individuals) to track the transmission of genetic traits and disorders across generations.</p>`,
  },
  mathematicalFoundations: {
    equations: [
      "\\text{Autosomal Recessive: } Aa \\times Aa \\rightarrow 25\\% \\text{ Affected (aa)}, \\quad 50\\% \\text{ Carrier (Aa)}",
      "\\text{X-Linked Recessive: } X^B X^b \\times X^B Y \\rightarrow 50\\% \\text{ of sons affected } (X^b Y)",
    ],
    explanation: "Mendelian inheritance probability calculations applied to clinical family pedigrees.",
  },
  learningObjectives: [
    "Interpret standard pedigree symbols, generations, and relationship lines.",
    "Distinguish Autosomal Dominant, Autosomal Recessive, and X-Linked Recessive inheritance.",
    "Determine probable genotypes and calculate offspring risk percentages.",
  ],
  realWorldApplications: ["Genetic counseling and risk assessment", "Prenatal genetic screening", "Genealogical forensic disease tracking"],
  howItWorks: "Select an inheritance mode, click individuals to inspect their health status, and test your knowledge.",
  faqs: [
    {
      question: "How can you tell if a pedigree is Autosomal Dominant?",
      answer: "In autosomal dominant traits, the disorder typically appears in every generation without skipping, and every affected individual has at least one affected parent.",
    },
  ],
  relatedExperiments: [],
};

export default function PedigreeLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/biology/genetics/pedigree"
    />
  );
}
