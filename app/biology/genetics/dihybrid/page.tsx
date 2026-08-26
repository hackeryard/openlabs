import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Dihybrid Cross & Independent Assortment Studio | OpenLabs",
  description: "Explore Mendel's Law of Independent Assortment with a 16-cell interactive Punnett matrix and live 9:3:3:1 phenotype ratio visualizations.",
  keywords: [
    "dihybrid cross simulation",
    "independent assortment lab",
    "16 cell punnett square",
    "9:3:3:1 phenotype ratio",
    "foil method gamete generation",
    "biology virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/genetics/dihybrid",
  },
  openGraph: {
    title: "Dihybrid Cross & Independent Assortment Studio | OpenLabs",
    description: "Track two unlinked genetic traits simultaneously across a 4x4 matrix and explore 9:3:3:1 ratios.",
    url: "https://www.openlabs.org.in/biology/genetics/dihybrid",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/biology/dihybrid-hero.png",
        alt: "Dihybrid Cross Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dihybrid Cross & Independent Assortment Studio | OpenLabs",
    description: "Track two unlinked genetic traits simultaneously across a 4x4 matrix.",
    images: ["https://www.openlabs.org.in/images/biology/dihybrid-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DihybridLandingPage() {
  return (
    <STEMExperimentLanding
      subject="biology"
      slug="genetics/dihybrid"
      title="Dihybrid Cross & Independent Assortment"
      description="Interactive genetics workbench simulating two-trait inheritance, meiosis metaphase alignment, 16-cell Punnett squares, and 9:3:3:1 phenotypic ratios."
      heroDescription="Track two unlinked genetic loci simultaneously across a 4×4 Punnett matrix. Observe how non-homologous chromosome alignment during Meiosis I creates 4 distinct gamete types and yields the classic 9:3:3:1 phenotypic distribution."
      theory="Mendel's Second Law—the Law of Independent Assortment—states that alleles of two or more different genes sort into gametes independently of one another during meiosis. This holds true for genes located on separate chromosomes or far apart on the same chromosome. Crossing heterozygous dihybrids (RrYy × RrYy) generates 4 gamete classes (RY, Ry, rY, ry) that combine into 16 genotypic possibilities and 4 distinct phenotypic classes in a 9:3:3:1 ratio."
      formula="\text{Product Law: } (3:1) \times (3:1) = 9 \text{ Dom/Dom} : 3 \text{ Dom/Rec} : 3 \text{ Rec/Dom} : 1 \text{ Rec/Rec}"
      formulaLabel="Dihybrid Independent Assortment Combinatorial Expansion"
      launchUrl="/labs/biology/genetics/dihybrid"
      heroImageUrl="/images/biology/dihybrid-hero.png"
      visualLabel="4×4 Dihybrid Matrix & Chromosome Sorter"
      visualDetail="FOIL Gamete Derivation • 16-Cell Color-Coded Matrix • Statistical Goodness-of-Fit"
      accent={{ primary: "#9333ea", secondary: "#059669", warm: "#f59e0b" }}
      learningObjectives={[
        "Apply the FOIL method to determine the 4 gamete types produced by a dihybrid parent (RrYy → RY, Ry, rY, ry).",
        "Fill and interpret a 16-cell Punnett square for two independent unlinked traits.",
        "Calculate theoretical probabilities for any combination of dominant and recessive phenotypes.",
        "Explain the chromosomal basis of independent assortment during Metaphase I of meiosis.",
      ]}
      applications={[
        "Agronomic Hybrid Seed Breeding (combining pest resistance and high crop yield).",
        "Polygenic Trait Analysis & Quantitative Trait Locus (QTL) Mapping.",
        "Evolutionary Biology & Recombination Diversity Modeling.",
        "Animal Husbandry & Multi-Gene Coat Color Selection.",
      ]}
      faqs={[
        {
          question: "When does Mendel's Law of Independent Assortment not apply?",
          answer:
            "Independent assortment fails when two genes reside physically close to each other on the same chromosome (syntenic genetic linkage). Linked genes tend to be inherited together as a unit unless broken up by meiotic homologous crossing-over.",
        },
        {
          question: "How is the 9:3:3:1 dihybrid ratio derived from monohybrid crosses?",
          answer:
            "Because the two genes segregate independently, the probability of any joint outcome is the product of their individual monohybrid probabilities: 3/4 dominant × 3/4 dominant = 9/16, 3/4 dominant × 1/4 recessive = 3/16, 1/4 recessive × 3/4 dominant = 3/16, and 1/4 recessive × 1/4 recessive = 1/16.",
        },
      ]}
    />
  );
}
