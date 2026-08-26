import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Pedigree Tree & Inheritance Patterns Studio | OpenLabs",
  description: "Explore 3-generation human pedigree trees, Autosomal Dominant, Autosomal Recessive, and X-Linked Recessive inheritance patterns with disease risk calculators.",
  keywords: [
    "pedigree chart simulation",
    "inheritance patterns lab",
    "autosomal dominant recessive pedigree",
    "x linked recessive hemophilia",
    "genetic counseling tree",
    "biology virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/genetics/pedigree",
  },
  openGraph: {
    title: "Pedigree Tree & Inheritance Patterns Studio | OpenLabs",
    description: "Learn how genetic counselors analyze multi-generational family medical histories and calculate recurrence risks.",
    url: "https://www.openlabs.org.in/biology/genetics/pedigree",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/biology/pedigree-hero.png",
        alt: "Pedigree Tree Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pedigree Tree & Inheritance Patterns Studio | OpenLabs",
    description: "Learn how genetic counselors analyze multi-generational family medical histories.",
    images: ["https://www.openlabs.org.in/images/biology/pedigree-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PedigreeLandingPage() {
  return (
    <STEMExperimentLanding
      subject="biology"
      slug="genetics/pedigree"
      title="Pedigree Tree & Inheritance Patterns"
      description="Clinical genetics laboratory analyzing 3-generation family trees across Autosomal Dominant, Autosomal Recessive, and X-Linked Recessive inheritance modes."
      heroDescription="Step into the role of a clinical genetic counselor. Trace inheritance of conditions (Huntington's, Cystic Fibrosis, Hemophilia) across multi-generational family trees, deduce unknown genotypes, and calculate recurrence probabilities for future offspring."
      theory="A pedigree chart is a genealogical diagram that tracks the phenotypic expression and transmission of specific genetic traits across multiple generations. Key inheritance criteria include: (1) Autosomal Dominant traits do not skip generations; affected individuals have at least one affected parent, (2) Autosomal Recessive traits often skip generations from unaffected carrier parents (Aa × Aa → 25% aa), and (3) X-Linked Recessive traits predominantly affect males (hemizygous X^b Y) via carrier mothers (X^B X^b)."
      formula="\text{Bayesian Risk Calculation: } P(\text{Carrier} \mid \text{Unaffected Offspring}) = \frac{P(\text{Prior}) \times P(\text{Conditional})}{\sum P(\text{Joint})}"
      formulaLabel="Clinical Genetic Risk Probability & Bayesian Pedigree Formula"
      launchUrl="/labs/biology/genetics/pedigree"
      heroImageUrl="/images/biology/pedigree-hero.png"
      visualLabel="3-Generation Interactive Pedigree Chart"
      visualDetail="Standard Symbology (Squares/Circles) • Autosomal & Sex-Linked Modes • Genotype Risk Evaluator"
      accent={{ primary: "#9333ea", secondary: "#0284c7", warm: "#f43f5e" }}
      learningObjectives={[
        "Interpret standard pedigree symbols (males, females, mating, consanguinity, affected, carriers, deceased).",
        "Distinguish between Autosomal Dominant, Autosomal Recessive, X-Linked Recessive, and Mitochondrial inheritance patterns.",
        "Deduce obligate carrier genotypes in multi-generational family lineages.",
        "Calculate quantitative recurrence risks for offspring of carrier parents.",
      ]}
      applications={[
        "Clinical Medical Genetics & Pre-Conception Genetic Counseling.",
        "Prenatal Amniocentesis and Non-Invasive Prenatal Testing (NIPT).",
        "Forensic Genealogy & Lineage Identity Reconstruction.",
        "Livestock Pedigree Verification & Purebred Animal Registration.",
      ]}
      faqs={[
        {
          question: "How can you identify an X-Linked Recessive trait on a pedigree?",
          answer:
            "X-Linked Recessive conditions (e.g., Red-Green Color Blindness, Hemophilia A) appear far more frequently in males because males have only one X chromosome (hemizygous). Affected fathers cannot transmit the trait to their sons, but all of their daughters become obligate carriers.",
        },
        {
          question: "What is consanguinity and why does it elevate recessive disease risk?",
          answer:
            "Consanguinity is mating between close biological relatives (indicated by a double horizontal line on a pedigree). Because relatives share a significant proportion of their genome inherited from a common ancestor, consanguinity dramatically increases the probability that both parents carry the same rare deleterious recessive allele.",
        },
      ]}
    />
  );
}
