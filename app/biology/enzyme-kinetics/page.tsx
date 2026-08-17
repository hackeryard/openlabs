import type { Metadata } from "next";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";

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
    "biology virtual lab"
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

const enzymeContent = {
  slug: "enzyme-kinetics",
  subject: "Biology",
  title: "Enzyme Kinetics & Catalysis",
  description: "An interactive biochemistry simulation modeling enzyme-substrate collisions, induced-fit catalytic active sites, competitive and allosteric inhibition, denaturation, and Michaelis-Menten / Lineweaver-Burk plots.",
  difficulty: "Intermediate" as const,
  estimatedTime: "25 minutes",
  heroDescription: "Explore biochemical catalysis at the molecular scale. Control substrate and inhibitor concentrations, adjust environmental temperature and pH, watch induced-fit conformational binding in real time, and trace live Michaelis-Menten saturation and Lineweaver-Burk double-reciprocal graphs.",
  theory: {
    content: `
      <p><strong>Enzymes</strong> are biological protein catalysts that accelerate the rates of metabolic biochemical reactions by lowering activation energy ($E_a$) without being consumed. Catalysis occurs in a specialized three-dimensional pocket called the <strong>active site</strong>. According to the <em>induced-fit model</em>, substrate binding triggers subtle conformational changes in the enzyme that orient catalytic residues and stabilize the high-energy transition state ($[ES]^\\ddagger$), accelerating product formation.</p>
      <p>The rate of an enzyme-catalyzed reaction ($V$) as a function of substrate concentration ($[S]$) is modeled by the <strong>Michaelis-Menten Equation</strong>:</p>
      <p style="text-align: center; font-weight: bold;">V = \\frac{V_{\\text{max}} [S]}{K_m + [S]}</p>
      <p>where $V_{\\text{max}}$ is the maximum theoretical reaction rate at complete enzyme saturation, and $K_m$ (the Michaelis constant) is the substrate concentration at which the reaction velocity reaches half of $V_{\\text{max}}$ ($V = \\frac{1}{2} V_{\\text{max}}$), serving as an inverse measure of enzyme-substrate binding affinity.</p>
      <p>Enzyme function is regulated by <strong>inhibitors</strong> (competitive, non-competitive, and uncompetitive) and is bounded by optimal temperature and pH ranges, beyond which tertiary hydrogen bonds rupture, causing irreversible <strong>denaturation</strong>.</p>
    `
  },
  learningObjectives: [
    "Define V_max, K_m, and explain their biochemical significance on a saturation curve.",
    "Differentiate the kinetic signatures of Competitive (K_m increases, V_max constant), Non-Competitive (V_max decreases, K_m constant), and Uncompetitive (both decrease) inhibitors.",
    "Transform hyperbolic saturation data into linear Lineweaver-Burk (1/V vs 1/[S]) and Eadie-Hofstee plots.",
    "Explain how extreme temperature (>55°C) and pH disrupt non-covalent tertiary folding, causing enzyme denaturation."
  ],
  mathematicalFoundations: {
    equations: [
      "V = \\frac{V_{\\text{max}} [S]}{K_m + [S]} \\text{ (Michaelis-Menten)}",
      "\\frac{1}{V} = \\left(\\frac{K_m}{V_{\\text{max}}}\\right) \\frac{1}{[S]} + \\frac{1}{V_{\\text{max}}} \\text{ (Lineweaver-Burk)}",
      "V = -K_m \\left(\\frac{V}{[S]}\\right) + V_{\\text{max}} \\text{ (Eadie-Hofstee)}",
      "k_{\\text{cat}} = \\frac{V_{\\text{max}}}{[E]_{\\text{total}}} \\text{ (Catalytic Turnover Rate)}"
    ],
    explanation: "On a Lineweaver-Burk double-reciprocal plot, the y-intercept represents 1/V_max, the x-intercept represents -1/K_m, and the slope equals K_m/V_max. Competitive inhibitors alter only the slope and x-intercept; non-competitive inhibitors increase both the slope and y-intercept."
  },
  realWorldApplications: [
    "Pharmaceutical Drug Design: Developing competitive enzyme inhibitors like statins (HMG-CoA reductase inhibitors for cholesterol) and penicillin (transpeptidase inhibitor).",
    "Clinical Diagnostics: Measuring elevated serum enzymes (e.g. lactate dehydrogenase, troponin, amylase) to diagnose myocardial infarction and acute pancreatitis.",
    "Industrial Biotechnology: Optimizing immobilized enzymes for biofuel production, high-fructose corn syrup synthesis, and detergent formulations.",
    "Toxicology & Nerve Agents: Organophosphate pesticides irreversibly inhibiting acetylcholinesterase at neural synapses."
  ],
  howItWorks: "Adjust substrate concentration [S] and watch the real-time Brownian collisions between substrates and the central enzyme molecule. Toggle between inhibitor modes (Competitive, Non-Competitive, Uncompetitive) and adjust inhibitor concentration [I]. Modify temperature and pH sliders to observe denaturation. Switch plot modes between Michaelis-Menten, Lineweaver-Burk, and Eadie-Hofstee to watch kinetic curves update dynamically.",
  faqs: [
    {
      question: "Why does a lower Km value indicate higher enzyme-substrate affinity?",
      answer: "Km is the substrate concentration required to occupy 50% of the active sites. If an enzyme achieves half-maximum velocity at a very low substrate concentration, it means the enzyme binds its substrate very tightly (high affinity). Conversely, a high Km means high substrate concentrations are necessary to drive binding (low affinity)."
    },
    {
      question: "How can you tell the difference between competitive and non-competitive inhibition on a Lineweaver-Burk plot?",
      answer: "In competitive inhibition, adding excess substrate overcomes the inhibitor, so Vmax is unchanged; on the plot, lines with and without inhibitor share the exact same y-intercept (1/Vmax) but cross the x-axis at different points (-1/Km). In non-competitive inhibition, the inhibitor binds an allosteric site and permanently lowers Vmax without altering substrate binding affinity (Km); on the plot, lines share the same x-intercept (-1/Km) but have different y-intercepts."
    },
    {
      question: "What happens to enzyme structure during thermal denaturation?",
      answer: "As temperature exceeds the physiological optimum (~40-50°C), increased thermal vibrations break the delicate non-covalent interactions (hydrogen bonds, ionic salt bridges, hydrophobic interactions) that maintain the enzyme's specific 3D tertiary and quaternary folding. The protein unfolds into an inactive random polypeptide coil, destroying the catalytic active site."
    }
  ],
  relatedExperiments: []
};

export default function EnzymeKineticsLandingPage() {
  return (
    <EducationalLandingLayout 
      content={enzymeContent} 
      launchUrl="/labs/biology/enzyme-kinetics" 
    />
  );
}
