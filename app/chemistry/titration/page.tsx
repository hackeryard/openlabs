import type { Metadata } from "next";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";

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
    "pH curve"
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

const titrationContent = {
  slug: "titration",
  subject: "Chemistry",
  title: "Titration Analysis",
  description: "A comprehensive virtual titration lab for acid-base and redox reactions with live pH curves.",
  difficulty: "Intermediate" as const,
  estimatedTime: "25 minutes",
  heroDescription: "Master volumetric analysis in a risk-free virtual environment. Control burette flow drop-by-drop, observe indicator color changes, and plot live pH curves to determine unknown concentrations.",
  theory: {
    content: `
      <p>Titration is a fundamental analytical chemistry technique used to determine the unknown concentration of an identified analyte (a substance being analyzed). A reagent, termed the <strong>titrant</strong>, is prepared as a standard solution of known concentration and volume.</p>
      <p>The titrant is reacted with a solution of analyte to determine the analyte's concentration. The volume of titrant reacted is called the <strong>titration volume</strong>. For acid-base titrations, a pH indicator (like phenolphthalein or methyl orange) is often used to detect the endpoint—the point at which the color changes, which closely approximates the equivalence point.</p>
      <p>The <strong>equivalence point</strong> is the ideal point in the titration where the amount of titrant added is stoichiometrically equal to the amount of analyte present in the sample.</p>
    `
  },
  learningObjectives: [
    "Identify the equivalence point using pH curves and indicators.",
    "Calculate unknown concentrations using C₁V₁ = C₂V₂.",
    "Differentiate between strong/strong and weak/strong acid-base titration curves.",
    "Understand the role of the half-equivalence point in weak acid titrations (pH = pKa)."
  ],
  mathematicalFoundations: {
    equations: [
      "C₁V₁ = C₂V₂",
      "pH = -log[H⁺]",
      "pH = pKa + log([A⁻]/[HA]) (Henderson-Hasselbalch)"
    ],
    explanation: "The core principle of titration is stoichiometry. At the equivalence point, the moles of acid equal the moles of base. For weak acids, the buffer region is governed by the Henderson-Hasselbalch equation."
  },
  realWorldApplications: [
    "Water quality testing (alkalinity and hardness).",
    "Food industry (determining acidity in wine and cheese).",
    "Pharmaceuticals (quality control of drug concentrations).",
    "Medical diagnostics (blood and urine analysis)."
  ],
  howItWorks: "Select your reagents and parameters. Use the titration controls to slowly add titrant from the burette into the analyte flask. Watch the live pH curve update in real-time. Stop adding titrant as soon as you observe a permanent color change from the indicator.",
  faqs: [
    {
      question: "What is the difference between the equivalence point and the endpoint?",
      answer: "The equivalence point is the theoretical point where stoichiometrically equivalent amounts of acid and base have reacted. The endpoint is the observable point when the indicator changes color. A good indicator has an endpoint that occurs very close to the equivalence point."
    },
    {
      question: "Why does the pH curve for a weak acid have a 'buffer region'?",
      answer: "When a strong base is added to a weak acid, it forms the conjugate base of the weak acid. This mixture of a weak acid and its conjugate base acts as a buffer, resisting large changes in pH until the acid is almost entirely neutralized."
    },
    {
      question: "What indicator should I use?",
      answer: "Choose an indicator whose color change interval overlaps with the steep vertical section of the pH curve at the equivalence point. For a strong acid-strong base titration (equivalence point pH ~7), phenolphthalein (color change pH 8.2-10) or methyl orange (pH 3.1-4.4) can work, though phenolphthalein is most common."
    }
  ],
  relatedExperiments: []
};

export default function TitrationLandingPage() {
  return (
    <EducationalLandingLayout 
      content={titrationContent} 
      launchUrl="/labs/chemistry/titration" 
    />
  );
}
