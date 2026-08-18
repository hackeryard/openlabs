import React from "react";
import type { Metadata } from "next";
import SubtopicHubLayout, {
  SubtopicCard,
  HowToStep,
  ScientificPrinciple,
  SubtopicFeature,
  SubtopicFAQ,
} from "@/app/components/SubtopicHubLayout";
import { Dna, Gauge, LineChart, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Genetics & Heredity Virtual Labs | Biology | OpenLabs",
  description: "Explore interactive genetics virtual labs: Monohybrid Punnett Squares, Dihybrid 16-cell crosses, DNA Transcription & Translation, and 3-generation Pedigree Trees.",
  keywords: [
    "genetics virtual labs",
    "punnett square simulator",
    "dihybrid cross 16 cell interactive",
    "dna transcription translation visualizer",
    "pedigree tree analyzer online",
    "mendelian genetics crosses",
    "cbse biology class 12 genetics",
    "ap biology heredity"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/genetics",
  },
};

const cards: SubtopicCard[] = [
  {
    href: "/biology/genetics/monohybrid",
    title: "Monohybrid Punnett Square",
    desc: "Single-trait inheritance with live creature avatars, gamete fertilizations, and stochastic 100-offspring batch drops.",
    tag: "Mendelian",
    formula: "3:1 Phenotype (1:2:1 Genotype)",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/biology/genetics/dihybrid",
    title: "Dihybrid Cross & Assortment",
    desc: "16-cell interactive Punnett matrix tracking 2 traits simultaneously with live Mendelian 9:3:3:1 ratio breakdowns.",
    tag: "Mendelian",
    formula: "9:3:3:1 Dihybrid Ratio",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/biology/genetics/dna-transcription",
    title: "DNA Transcription & Translation",
    desc: "Central Dogma pipeline: DNA template unzipping, complementary mRNA copying, tRNA ribosome reading, and mutation testing.",
    tag: "Molecular",
    formula: "DNA → mRNA → Polypeptide",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/biology/genetics/pedigree",
    title: "Pedigree Chart & Inheritance",
    desc: "3-generation human family tree analyzer for Autosomal Dominant, Autosomal Recessive, and X-Linked Recessive traits.",
    tag: "Clinical",
    formula: "Mendelian Pedigree Tree Rules",
    difficulty: "Advanced",
    duration: "18 min",
  },
];

const howToSteps: HowToStep[] = [
  {
    step: 1,
    title: "Select Genetic Cross or Molecular Pipeline",
    desc: "Choose from single-gene Mendelian crosses, 16-cell dihybrid matrices, central dogma transcription, or pedigree charts.",
  },
  {
    step: 2,
    title: "Select Parental Alleles or DNA Sequences",
    desc: "Choose homozygous dominant, heterozygous, or recessive parental genotypes (e.g., AaBb × AaBb) or custom DNA codons.",
  },
  {
    step: 3,
    title: "Fertilize Gametes & Generate Offspring",
    desc: "Watch gamete segregation animate into Punnett cells and observe resulting creature phenotypes and statistical ratios.",
  },
  {
    step: 4,
    title: "Run Chi-Square Analysis & Export",
    desc: "Compare observed sample counts against theoretical Mendelian ratios using Chi-Square goodness-of-fit (χ²) calculations.",
  },
];

const scientificPrinciples: ScientificPrinciple[] = [
  {
    domain: "Mendelian Segregation",
    laws: "Law of Segregation & Dominance",
    formulas: "P(AA) = p², P(Aa) = 2pq, P(aa) = q²",
    solver: "Binomial Allele Combination Matrix",
  },
  {
    domain: "Independent Assortment",
    laws: "Law of Independent Assortment (Unlinked Genes)",
    formulas: "P(AB) = P(A) × P(B), (3/4 + 1/4)² = 9/16 + 3/16 + 3/16 + 1/16",
    solver: "16-Cell Stochastic Offspring Generator",
  },
  {
    domain: "Central Dogma of Molecular Biology",
    laws: "RNA Polymerase Elongation & Triplet Codon Reading",
    formulas: "A-T / G-C (DNA) ⇒ A-U / G-C (mRNA) ⇒ Amino Acid",
    solver: "Ribosomal Translation Frame Parser",
  },
  {
    domain: "Pedigree Probability",
    laws: "Mendelian Inheritance Models (Autosomal vs. Sex-Linked)",
    formulas: "P(Carrier) = 2/3 (for unaffected progeny of carriers)",
    solver: "Recursive Bayesian Lineage Tree Traversal",
  },
];

const features: SubtopicFeature[] = [
  {
    icon: Gauge,
    title: "Live parental genotype controls",
    desc: "Change parental alleles with instant updates to gamete formation and offspring creature avatars.",
    color: "rose",
  },
  {
    icon: LineChart,
    title: "Real-time phenotypic ratio counters",
    desc: "Track observed vs. expected Mendelian ratios live across simulated generations with Chi-Square metrics.",
    color: "emerald",
  },
  {
    icon: GraduationCap,
    title: "Curriculum aligned genetics",
    desc: "Follows CBSE Biology Class 12 (Genetics and Evolution), AP Biology Unit 5, and IB Biology Topic 3.",
    color: "purple",
  },
];

const curriculum = {
  heading: "Genetics & Molecular Biology Educational Standards",
  description:
    "Our interactive genetics studios adhere to CBSE Biology Class 12 (Principles of Inheritance and Variation, Molecular Basis of Inheritance), AP Biology (Unit 5: Heredity & Unit 6: Gene Expression), and IB Biology HL/SL.",
  secondaryText:
    "Students manipulate alleles, translate RNA codons, and solve pedigree charts interactively to build deep conceptual comprehension of inheritance patterns.",
  telemetryTitle: "Genotypic Telemetry",
  telemetryDesc: "Inspect allele frequencies, Chi-Square statistics (χ²), and codon amino acid chains in real time.",
};

const faqs: SubtopicFAQ[] = [
  {
    q: "How does the Punnett Square simulator model stochastic variation?",
    a: "The simulator performs Monte Carlo random sampling from the parent gametes for each individual offspring drop, demonstrating how small sample sizes deviate from expected ratios while large sample sizes converge cleanly on 3:1 or 9:3:3:1.",
  },
  {
    q: "How does the DNA transcription and translation visualizer handle mutations?",
    a: "You can introduce point mutations (silent, missense, nonsense) or frameshift insertions/deletions directly in the DNA template to observe immediate changes in the transcribed mRNA and resulting amino acid polypeptide sequence.",
  },
  {
    q: "Can I use the pedigree analyzer for classroom disease inheritance case studies?",
    a: "Yes. The pedigree chart analyzer supports classic clinical inheritance modes including Huntington's (Autosomal Dominant), Cystic Fibrosis (Autosomal Recessive), and Hemophilia/Color Blindness (X-Linked Recessive).",
  },
  {
    q: "Is the OpenLabs Genetics laboratory free for students and teachers?",
    a: "Yes. All genetics studios, Punnett square calculators, and DNA transcription tools are 100% free and open for educational use.",
  },
];

export default function GeneticsSubtopicPage() {
  return (
    <SubtopicHubLayout
      subjectName="Biology"
      subjectSlug="biology"
      subtopicTitle="Genetics & Heredity"
      subtopicSubtitle="Explore interactive Punnett squares, 16-cell dihybrid crosses, DNA transcription & translation, and clinical pedigree family tree analyzers."
      badgeText="Genetics Exploration Suite"
      badgeIcon={Dna}
      themeColor="rose"
      cards={cards}
      howToHeading="How to Perform Genetic Crosses & DNA Transcription Online"
      howToSteps={howToSteps}
      principlesHeading="Mendelian Inheritance Laws & Central Dogma Solvers"
      principlesDesc="Binomial allele distributions and molecular translation parsers executed in real time."
      scientificPrinciples={scientificPrinciples}
      features={features}
      curriculum={curriculum}
      faqs={faqs}
      canonicalUrl="https://www.openlabs.org.in/biology/genetics"
    />
  );
}
