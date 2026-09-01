import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Titration Simulation Online - Virtual Titration Lab | OpenLabs",
  description: "Experience an interactive acid base titration calculator and virtual titration lab. Plot live pH curves and master volumetric analysis.",
  keywords: [
    "titration simulation online",
    "virtual titration lab",
    "acid base titration calculator",
    "chemistry lab",
    "equivalence point",
    "phenolphthalein",
    "pH curve",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/chemistry/titration",
  },
  openGraph: {
    title: "Virtual Titration Lab | Titration Simulation Online | OpenLabs",
    description: "Experience an interactive acid base titration calculator and virtual titration lab. Plot live pH curves and master volumetric analysis.",
    url: "https://www.openlabs.org.in/chemistry/titration",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/chemistry/titration-hero.png",
        alt: "Titration Simulation Online | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtual Titration Lab | Titration Simulation Online | OpenLabs",
    description: "Experience an interactive acid base titration calculator and virtual titration lab. Plot live pH curves and master volumetric analysis.",
    images: ["https://www.openlabs.org.in/images/chemistry/titration-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TitrationLandingPage() {
  return (
    <STEMExperimentLanding
      subject="chemistry"
      slug="titration"
      title="Volumetric Titration & pH Curves"
      description="Interactive acid-base and redox titration workbench with drop-by-drop burette dispensing and real-time sigmoidal pH curves."
      heroDescription="Master quantitative volumetric analysis in a risk-free virtual laboratory. Control burette stopcocks with drop precision, observe indicator transitions, and calculate unknown analyte concentrations at the equivalence point."
      theory="Titration is an analytical quantitative technique where a solution of known concentration (the titrant) is incrementally added to an analyte until the chemical reaction reaches stoichiometric completion (the equivalence point). For acid-base neutralization, the pH changes sharply near equivalence according to the Henderson-Hasselbalch equation and solubility product principles, detected visually by indicators or potentiometrically by a pH glass electrode."
      formula="C_1 V_1 = C_2 V_2 \quad \text{and} \quad \text{pH} = \text{pK}_a + \log\left(\frac{[A^-]}{[\text{HA}]}\right)"
      formulaLabel="Stoichiometric Equivalence & Henderson-Hasselbalch Equation"
      launchUrl="/labs/chemistry/titration"
      heroImageUrl="/images/chemistry/titration-hero.png"
      visualLabel="Precision Analytical Burette & pH Probe"
      visualDetail="Real-time Sigmoid Curves • Phenolphthalein/Methyl Orange • Dropwise Control"
      accent={{ primary: "#059669", secondary: "#0d9488", warm: "#d97706" }}
      learningObjectives={[
        "Differentiate between the stoichiometric equivalence point and the visual indicator endpoint.",
        "Construct and interpret titration curves for Strong Acid / Strong Base and Weak Acid / Strong Base pairs.",
        "Calculate unknown molarities using the volumetric formula C₁V₁ = C₂V₂.",
        "Select appropriate acid-base indicators based on pKa transition ranges.",
      ]}
      applications={[
        "Pharmaceutical Quality Control (verifying active drug concentrations and purity).",
        "Food & Beverage Industry (determining titratable acidity in wines, citrus juices, and dairy products).",
        "Environmental Water Testing (measuring total alkalinity and acid rain neutralization capacity).",
        "Clinical Diagnostic Assays (blood urea nitrogen and electrolyte balance analysis).",
      ]}
      faqs={[
        {
          question: "What is the difference between the equivalence point and the endpoint?",
          answer:
            "The equivalence point is the exact theoretical moment when moles of titrant stoichiometrically equal moles of analyte. The endpoint is the observed physical change (e.g., color shift of phenolphthalein from colorless to faint pink) indicating that equivalence has been reached.",
        },
        {
          question: "Why is the equivalence point pH not always 7.0?",
          answer:
            "For a Strong Acid / Strong Base titration, the salt formed does not hydrolyze, resulting in a neutral pH of 7.0. In a Weak Acid / Strong Base titration (e.g., acetic acid with NaOH), the conjugate base hydrolyzes water to produce OH⁻, raising the equivalence pH to ~8.7.",
        },
        {
          question: "How does a buffer region work during weak acid titration?",
          answer:
            "Before the equivalence point, the solution contains comparable amounts of weak acid [HA] and its conjugate base [A⁻], creating a buffer zone that resists drastic pH changes as governed by the Henderson-Hasselbalch equation.",
        },
      ]}
    />
  );
}
