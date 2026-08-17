import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monohybrid Punnett Square & Creature Breeder - Interactive Biology Lab | OpenLabs",
  description: "Master Mendelian monohybrid crosses with live creature avatars, animated gamete fertilizations, genotype/phenotype ratios, and 100-offspring batch drops.",
};

const content: EducationalContent = {
  slug: "genetics/monohybrid",
  subject: "Biology",
  title: "Monohybrid Punnett Square & Creature Breeder",
  description: "Explore single-gene inheritance, dominant vs recessive alleles, and test how 100-offspring random breedings converge to Mendelian 3:1 ratios.",
  difficulty: "Beginner",
  estimatedTime: "15 mins",
  heroDescription: "Breed alien creatures and watch how alleles separate into gametes to produce predictable offspring ratios.",
  theory: {
    content: `<p>A <strong>Monohybrid Cross</strong> tracks the inheritance of a single gene with two contrasting alleles (dominant <code>B</code> and recessive <code>b</code>). Gregor Mendel discovered that alleles segregate into gametes during meiosis with equal probability.</p>`,
  },
  mathematicalFoundations: {
    equations: [
      "P(BB) = 1/4, \\quad P(Bb) = 1/2, \\quad P(bb) = 1/4 \\quad \\text{(Genotypic Ratio 1:2:1)}",
      "P(\\text{Dominant}) = 3/4, \\quad P(\\text{Recessive}) = 1/4 \\quad \\text{(Phenotypic Ratio 3:1)}",
    ],
    explanation: "Punnett squares compute all combinations of maternal and paternal gametes.",
  },
  learningObjectives: [
    "Differentiate homozygous dominant (BB), heterozygous (Bb), and homozygous recessive (bb) genotypes.",
    "Perform animated 2x2 Punnett square fertilizations.",
    "Observe statistical convergence in 100-offspring population breeding.",
  ],
  realWorldApplications: ["Human eye color and hair texture genetics", "Selective animal and livestock breeding", "Predicting genetic disease carrier risks"],
  howItWorks: "Select parent genotypes, click Animate Fertilization, and test 100-offspring batch drops.",
  faqs: [
    {
      question: "What is the difference between genotype and phenotype?",
      answer: "Genotype is the genetic makeup (the alleles: BB, Bb, or bb), whereas phenotype is the physical appearance (Purple vs Orange).",
    },
  ],
  relatedExperiments: [],
};

export default function MonohybridLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/biology/genetics/monohybrid"
    />
  );
}
