import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Monohybrid Punnett Square & Creature Breeder | OpenLabs",
  description: "Master Mendelian monohybrid crosses with live creature avatars, animated gamete fertilizations, genotype/phenotype ratios, and 100-offspring batch drops.",
  keywords: [
    "monohybrid cross simulation",
    "punnett square calculator",
    "mendelian genetics lab",
    "dominant recessive alleles",
    "genotype phenotype ratio 3:1",
    "biology virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/genetics/monohybrid",
  },
  openGraph: {
    title: "Monohybrid Punnett Square & Creature Breeder | OpenLabs",
    description: "Master Mendelian monohybrid crosses with live creature avatars, animated gamete fertilizations, and 100-offspring batch drops.",
    url: "https://www.openlabs.org.in/biology/genetics/monohybrid",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/biology/monohybrid-hero.png",
        alt: "Monohybrid Punnett Square Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Monohybrid Punnett Square & Creature Breeder | OpenLabs",
    description: "Master Mendelian monohybrid crosses with live creature avatars and 100-offspring batch drops.",
    images: ["https://www.openlabs.org.in/images/biology/monohybrid-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MonohybridLandingPage() {
  return (
    <STEMExperimentLanding
      subject="biology"
      slug="genetics/monohybrid"
      title="Monohybrid Punnett Square & Mendel's 1st Law"
      description="Interactive genetics simulation modeling single-trait inheritance, meiosis allele segregation, Punnett square fertilization, and 100-offspring statistical sampling."
      heroDescription="Breed alien creatures and observe how dominant and recessive alleles segregate during meiosis to produce classic Mendelian phenotypic ratios (3:1) and genotypic distributions (1:2:1)."
      theory="Mendel's First Law of Heredity—the Law of Segregation—states that every diploid individual possesses a pair of alleles for any given trait. During gametogenesis (meiosis), these alleles segregate equally into haploid gametes such that each sperm or egg carries only one allele. Upon random fertilization, combinations are predicted using a 2×2 Punnett square."
      formula="\text{Genotype: } 1 BB : 2 Bb : 1 bb \quad \text{and} \quad \text{Phenotype: } 3 \text{ Dominant} : 1 \text{ Recessive}"
      formulaLabel="Mendelian Monohybrid Heterozygous F₂ Ratios"
      launchUrl="/labs/biology/genetics/monohybrid"
      heroImageUrl="/images/biology/monohybrid-hero.png"
      visualLabel="2×2 Punnett Square & Creature Breeder"
      visualDetail="Interactive Allele Toggles • 100-Offspring Population Batch Drop • Chi-Square Goodness-of-Fit"
      accent={{ primary: "#9333ea", secondary: "#e11d48", warm: "#f59e0b" }}
      learningObjectives={[
        "Differentiate homozygous dominant (BB), heterozygous (Bb), and homozygous recessive (bb) genotypes.",
        "Construct 2×2 Punnett squares to calculate theoretical offspring probability distributions.",
        "Demonstrate how random sampling noise in small broods converges to exact 3:1 Mendelian ratios in large populations (100+ offspring).",
        "Predict carrier transmission risks for autosomal recessive genetic conditions (e.g., cystic fibrosis).",
      ]}
      applications={[
        "Clinical Genetic Counseling & Autosomal Recessive Carrier Screening.",
        "Agricultural Crop Breeding & Hybrid Seed Production.",
        "Veterinary Livestock Pedigree Lineage Selection.",
        "Population Genetics & Hardy-Weinberg Equilibrium Modeling.",
      ]}
      faqs={[
        {
          question: "What is the difference between an allele, a genotype, and a phenotype?",
          answer:
            "A gene is a section of DNA coding for a trait; an allele is a specific variant of that gene (e.g., B for purple vs b for orange). The genotype is the combination of alleles an organism possesses (BB, Bb, or bb). The phenotype is the observable physical manifestation of that genotype (e.g., purple body).",
        },
        {
          question: "Why do real-world families with 4 children not always exhibit exact 3:1 ratios?",
          answer:
            "Each fertilization is an independent statistical event with a 75% probability of a dominant phenotype and 25% probability of a recessive phenotype. Small sample sizes exhibit statistical fluctuation; only large populations (hundreds of offspring) converge closely to theoretical 3:1 ratios.",
        },
      ]}
    />
  );
}
