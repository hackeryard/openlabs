import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Animal Cell Organelles & Cytology Virtual Lab | OpenLabs",
  description: "Interactive animal cell explorer with 3D visualization of eukaryotic organelles, nucleus, mitochondria, endoplasmic reticulum, Golgi apparatus, and lysosomes.",
  keywords: [
    "animal cell simulation",
    "cell organelles 3d",
    "eukaryotic cell cytology",
    "nucleus mitochondria golgi",
    "plasma membrane fluid mosaic",
    "lysosome endoplasmic reticulum",
    "biology simulation",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/cell/animal",
  },
  openGraph: {
    title: "Animal Cell Organelles & Cytology Virtual Lab | OpenLabs",
    description: "Interactive animal cell explorer with 3D visualization of organelles, nucleus, and cellular structures.",
    url: "https://www.openlabs.org.in/biology/cell/animal",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/biology/animal-cell-hero.png",
        alt: "Animal Cell Simulation | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Animal Cell Organelles & Cytology Virtual Lab | OpenLabs",
    description: "Interactive animal cell explorer with 3D visualization of organelles, nucleus, and cellular structures.",
    images: ["https://www.openlabs.org.in/images/biology/animal-cell-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AnimalCellLandingPage() {
  return (
    <STEMExperimentLanding
      subject="biology"
      slug="cell/animal"
      title="Animal Cell Organelle Cytology"
      description="Interactive 3D eukaryotic cytology laboratory exploring organelle ultrastructure, compartmentalization, membrane trafficking, and bioenergetics."
      heroDescription="Dissect the inner machinery of eukaryotic life in 3D. Rotate, slice, and isolate animal cell organelles—including the nucleus, rough/smooth ER, Golgi complex, mitochondria, and lysosomes—to understand macromolecular transport and cellular metabolism."
      theory="Animal cells are complex eukaryotic systems enclosed by a selectively permeable phospholipid bilayer (the fluid mosaic model) without a rigid cellulose cell wall. Intracellular compartmentalization via endomembrane systems allows distinct biochemical reactions (e.g., DNA replication in the nucleus, oxidative phosphorylation in mitochondria, protein glycosylation in the Golgi) to occur simultaneously in optimized microenvironments."
      formula="\text{Cell Size Limit: } \frac{\text{Surface Area}}{\text{Volume}} = \frac{4\pi r^2}{\frac{4}{3}\pi r^3} = \frac{3}{r} \quad (\text{Diffusion Rate Limitation})"
      formulaLabel="Surface-Area-to-Volume Ratio & Diffusion Efficiency"
      launchUrl="/labs/biology/cell/animal"
      heroImageUrl="/images/biology/animal-cell-hero.png"
      visualLabel="3D Eukaryotic Cell Ultrastructure"
      visualDetail="12 Organelle Callouts • Fluid Mosaic Bilayer • Vesicular Endomembrane Transport"
      accent={{ primary: "#e11d48", secondary: "#9333ea", warm: "#f59e0b" }}
      learningObjectives={[
        "Differentiate the structure and physiological functions of all major eukaryotic organelles.",
        "Trace the biosynthetic secretory pathway from nuclear transcription to rough ER translation, Golgi processing, and vesicle exocytosis.",
        "Explain how the surface-area-to-volume ratio constrains maximum viable eukaryotic cell dimensions.",
        "Compare animal cell ultrastructure with plant cells (centrioles and lysosomes vs cell walls and chloroplasts).",
      ]}
      applications={[
        "Cancer Cytology & Oncological Diagnostics (aberrant nuclear morphology and aneuploidy).",
        "Lysosomal Storage Disorders & Gene Therapy (Tay-Sachs and Gaucher disease research).",
        "Biopharmaceutical Monoclonal Antibody Production in CHO (Chinese Hamster Ovary) cell bioreactors.",
        "Stem Cell Regenerative Medicine and Tissue Engineering.",
      ]}
      faqs={[
        {
          question: "Why do eukaryotic cells require internal membrane-bound organelles?",
          answer:
            "Compartmentalization isolates incompatible chemical reactions, concentrates enzymes and substrates for maximum catalytic efficiency, and maintains specialized electrochemical gradients (such as the acidic pH 4.5–5.0 inside lysosomes) without damaging the rest of the cytoplasm.",
        },
        {
          question: "What is the Endosymbiotic Theory regarding mitochondria?",
          answer:
            "The Endosymbiotic Theory states that mitochondria originated as free-living aerobic prokaryotes that were engulfed by ancestral anaerobic eukaryotic cells. Evidence includes mitochondria having their own circular DNA (mtDNA), 70S ribosomes, and a double membrane.",
        },
        {
          question: "How does the Golgi apparatus modify and sort newly synthesized proteins?",
          answer:
            "Proteins synthesized on rough ER ribosomes travel via transport vesicles to the cis-Golgi. As they move through the medial and trans cisternae, enzymes perform post-translational modifications (like glycosylation and phosphorylation) and attach molecular targeting signals that direct proteins to lysosomes, plasma membrane, or secretory vesicles.",
        },
      ]}
    />
  );
}
