import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "DNA Transcription & Ribosomal Translation Virtual Lab | OpenLabs",
  description: "Experience the Central Dogma of biology with interactive DNA unzipping, complementary mRNA transcription, tRNA ribosome translation, and mutation testing.",
  keywords: [
    "dna transcription simulation",
    "ribosome translation virtual lab",
    "central dogma molecular biology",
    "mrna codon chart interactive",
    "silent missense nonsense mutations",
    "rna polymerase elongation",
    "biology virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/genetics/transcription-translation",
  },
  openGraph: {
    title: "DNA Transcription & Translation Studio | OpenLabs",
    description: "Unravel the Central Dogma with interactive RNA Polymerase transcription and ribosomal tRNA translation.",
    url: "https://www.openlabs.org.in/biology/genetics/transcription-translation",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/biology/transcription-translation-hero.png",
        alt: "DNA Transcription & Translation Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DNA Transcription & Translation Studio | OpenLabs",
    description: "Unravel the Central Dogma with interactive RNA Polymerase transcription and ribosomal tRNA translation.",
    images: ["https://www.openlabs.org.in/images/biology/transcription-translation-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TranscriptionTranslationLandingPage() {
  return (
    <STEMExperimentLanding
      subject="biology"
      slug="genetics/transcription-translation"
      title="DNA Transcription & Translation Studio"
      description="Molecular genetics laboratory simulating RNA Polymerase transcription, 64-codon universal genetic code translation, and nucleotide mutation effects."
      heroDescription="Follow the Central Dogma of molecular biology. Unzip the double helix, synthesize complementary mRNA, watch the 80S ribosome decode 3-letter codons, and introduce point mutations (silent, missense, nonsense, frameshift) to observe polypeptide changes."
      theory="The Central Dogma describes the directional flow of genetic sequence information: DNA → mRNA → Functional Polypeptide. In Transcription, RNA Polymerase binds the promoter and reads the template 3'→5' to synthesize a 5'→3' pre-mRNA transcript (substituting Uracil for Thymine). In Translation, ribosomes match triplet codons to cognate tRNA anticodons, catalyzing peptidyl transferase peptide bond formation until a STOP codon (UAA, UAG, UGA) terminates elongation."
      formula="\text{DNA: } 3'\text{--TAC GGC CTA ACT--}5' \xrightarrow{\text{Transcription}} \text{mRNA: } 5'\text{--AUG CCG GAU UGA--}3' \xrightarrow{\text{Translation}} \text{Met-Pro-Asp-STOP}"
      formulaLabel="Central Dogma Informational Transcription & Codon Translation"
      launchUrl="/labs/biology/genetics/transcription-translation"
      heroImageUrl="/images/biology/transcription-translation-hero.png"
      visualLabel="RNA Polymerase & 80S Ribosome Engine"
      visualDetail="Interactive DNA Template Editor • 64-Codon Genetic Wheel • Live Mutation Effect Predictor"
      accent={{ primary: "#0284c7", secondary: "#e11d48", warm: "#10b981" }}
      learningObjectives={[
        "Apply Watson-Crick base-pairing rules during RNA Polymerase transcription (A→U, T→A, C→G, G→C).",
        "Translate mRNA sequences into polypeptide chains using the universal 64-codon genetic code.",
        "Differentiate silent, missense, nonsense, and frameshift (insertion/deletion) point mutations.",
        "Explain how the degeneracy and redundancy of the genetic code buffers against harmful mutations.",
      ]}
      applications={[
        "mRNA Vaccine Formulation & Synthetic Biology (lipid nanoparticle-encapsulated modified mRNAs).",
        "CRISPR-Cas9 Therapeutic Gene Editing (correcting sickle cell hemoglobin mutations).",
        "Recombinant Protein & Insulin Biomanufacturing in E. coli expression systems.",
        "Forensic DNA Profiling & Polymerase Chain Reaction (PCR) Diagnostics.",
      ]}
      faqs={[
        {
          question: "Why do all translated proteins initially start with Methionine?",
          answer:
            "The universal eukaryotic START codon is AUG, which is recognized by initiator tRNA carrying the amino acid Methionine (or N-formylmethionine in prokaryotes). In many mature proteins, this initial Met is post-translationally cleaved by aminopeptidases.",
        },
        {
          question: "What is the difference between a missense mutation and a nonsense mutation?",
          answer:
            "A missense mutation alters a single nucleotide resulting in a codon that specifies a different amino acid (e.g., GAG to GUG in Sickle Cell Anemia). A nonsense mutation changes an amino acid codon into a premature STOP codon (UAA, UAG, UGA), truncating the protein.",
        },
      ]}
    />
  );
}
