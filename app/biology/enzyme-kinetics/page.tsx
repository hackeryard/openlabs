import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Enzyme Kinetics & Catalysis Simulation Virtual Lab | OpenLabs",
  description: "Explore Michaelis-Menten enzyme kinetics, Lineweaver-Burk double reciprocal plots, competitive and allosteric inhibitors, and thermal/pH denaturation online.",
  keywords: [
    "enzyme kinetics simulation online",
    "michaelis menten calculator",
    "lineweaver burk plot generator",
    "competitive noncompetitive inhibition",
    "enzyme substrate induced fit",
    "vmax and km calculation",
    "biology virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/enzyme-kinetics",
  },
  openGraph: {
    title: "Enzyme Kinetics & Catalysis Virtual Lab | OpenLabs",
    description: "Explore Michaelis-Menten kinetics, Lineweaver-Burk plots, competitive and non-competitive enzyme inhibition in real time.",
    url: "https://www.openlabs.org.in/biology/enzyme-kinetics",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/biology/enzyme-kinetics-hero.png",
        alt: "Enzyme Kinetics & Catalysis Simulation | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Enzyme Kinetics & Catalysis Virtual Lab | OpenLabs",
    description: "Explore Michaelis-Menten kinetics, Lineweaver-Burk plots, competitive and non-competitive enzyme inhibition in real time.",
    images: ["https://www.openlabs.org.in/images/biology/enzyme-kinetics-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EnzymeKineticsLandingPage() {
  return (
    <STEMExperimentLanding
      subject="biology"
      slug="enzyme-kinetics"
      title="Enzyme Kinetics & Catalysis"
      description="Interactive biochemistry laboratory simulating enzyme-substrate binding, induced fit active sites, competitive/non-competitive inhibition, and Lineweaver-Burk plots."
      heroDescription="Explore biochemical catalysis at the molecular scale. Control substrate and inhibitor concentrations, adjust environmental temperature and pH, watch induced-fit conformational binding in real time, and trace live Michaelis-Menten saturation and Lineweaver-Burk graphs."
      theory="Enzymes are specialized protein catalysts that accelerate biochemical reaction rates by stabilizing high-energy transition states and lowering activation energy (E_a). The reaction velocity (v) as a function of substrate concentration [S] follows the hyperbolic Michaelis-Menten equation. The Lineweaver-Burk double reciprocal transformation (1/v vs 1/[S]) yields a linear relationship that clearly distinguishes competitive inhibition (increased apparent K_m, unchanged V_max) from non-competitive allosteric inhibition (decreased V_max, unchanged K_m)."
      formula="v = \frac{V_{\max}[S]}{K_m + [S]} \quad \text{and} \quad \frac{1}{v} = \left(\frac{K_m}{V_{\max}}\right)\frac{1}{[S]} + \frac{1}{V_{\max}}"
      formulaLabel="Michaelis-Menten Equation & Lineweaver-Burk Double Reciprocal"
      launchUrl="/labs/biology/enzyme-kinetics"
      heroImageUrl="/images/biology/enzyme-kinetics-hero.png"
      visualLabel="Enzymatic Active Site & Kinetic Grapher"
      visualDetail="Induced Fit Substrate Docking • Competitive/Allosteric Modes • Live Lineweaver-Burk Linear Fit"
      accent={{ primary: "#e11d48", secondary: "#059669", warm: "#f59e0b" }}
      learningObjectives={[
        "Calculate maximum reaction velocity (V_max), Michaelis constant (K_m), and catalytic turnover number (k_cat).",
        "Differentiate competitive vs non-competitive vs uncompetitive inhibition using Lineweaver-Burk slope and intercept shifts.",
        "Model thermal and extreme pH protein denaturation resulting from the disruption of tertiary hydrogen and ionic bonds.",
        "Explain how the induced-fit model optimizes active site catalytic geometry.",
      ]}
      applications={[
        "Pharmaceutical Drug Discovery (designing competitive protease and kinase inhibitors).",
        "Clinical Diagnostic Enzymology (serum LDH, ALT, and cardiac troponin biomarker assays).",
        "Industrial Food & Beverage Bioprocessing (pectinases, lactases, and amylases).",
        "Bioremediation & Enzymatic Plastic Degradation (engineered PETase enzymes).",
      ]}
      faqs={[
        {
          question: "What does the Michaelis constant (K_m) represent physically?",
          answer:
            "K_m is the substrate concentration at which the reaction velocity reaches half of its maximum value (v = 1/2 V_max). A low K_m indicates high enzyme-substrate binding affinity (little substrate needed for half-saturation), whereas a high K_m indicates lower affinity.",
        },
        {
          question: "How does competitive inhibition differ from non-competitive inhibition on a Lineweaver-Burk plot?",
          answer:
            "In competitive inhibition (where the inhibitor binds the active site), V_max remains unchanged but apparent K_m increases; lines on the plot share the same y-intercept (1/V_max) but have different x-intercepts. In non-competitive inhibition (allosteric binding), K_m is unchanged but V_max decreases; lines share the same x-intercept (-1/K_m) but have higher y-intercepts.",
        },
        {
          question: "Why does enzyme activity drop sharply beyond its optimum temperature?",
          answer:
            "Excess thermal kinetic energy breaks the non-covalent interactions (hydrogen bonds, ionic interactions, hydrophobic packing) that stabilize the enzyme's specific 3D tertiary and quaternary structure, permanently denaturing the active site.",
        },
      ]}
    />
  );
}
