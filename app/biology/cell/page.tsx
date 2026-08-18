import React from "react";
import type { Metadata } from "next";
import SubtopicHubLayout, {
  SubtopicCard,
  HowToStep,
  ScientificPrinciple,
  SubtopicFeature,
  SubtopicFAQ,
} from "@/app/components/SubtopicHubLayout";
import { Microscope, Gauge, LineChart, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Cell Structure & Cytology Virtual Labs | Biology | OpenLabs",
  description: "Interactive plant and animal cell explorer with 3D organelle visualization, membrane permeability, and cellular cytology analysis.",
  keywords: [
    "cell structure virtual lab",
    "animal cell cytology interactive",
    "plant cell organelles 3d",
    "chloroplast structure visualizer",
    "mitochondria cristae simulation",
    "eukaryotic cell explorer",
    "cbse biology class 11 cell",
    "ap biology cell structure"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/cell",
  },
};

const cards: SubtopicCard[] = [
  {
    href: "/biology/cell/animal",
    title: "Animal Cell Cytology",
    desc: "Inspect plasma membranes, nucleus chromatin, rough/smooth endoplasmic reticulum, Golgi apparatus, lysosomes, and mitochondrial cristae in 3D.",
    tag: "Cytology",
    formula: "Eukaryotic Animal Organelle Suite",
    difficulty: "Beginner",
    duration: "10 min",
  },
  {
    href: "/biology/cell/plant",
    title: "Plant Cell & Chloroplast Dynamics",
    desc: "Explore cellulose cell walls, large central vacuoles, turgor pressure mechanics, and chloroplast thylakoid membrane stacks.",
    tag: "Cytology",
    formula: "Plant Cell Wall & Chloroplast Architecture",
    difficulty: "Beginner",
    duration: "10 min",
  },
];

const howToSteps: HowToStep[] = [
  {
    step: 1,
    title: "Select Animal or Plant Cell Model",
    desc: "Choose between eukaryotic animal cells or rigid-walled plant cells with photosynthetic chloroplasts.",
  },
  {
    step: 2,
    title: "Rotate, Zoom & Slice 3D Organelles",
    desc: "Use 3D camera orbit controls to view cross-sections of the double-membrane nucleus, mitochondrial matrix, and Golgi cisternae.",
  },
  {
    step: 3,
    title: "Click Organelles to Inspect Biochemical Functions",
    desc: "Tap specific organelles (e.g. ribosomes, lysosomes, vacuoles) to reveal their physiological roles and metabolic pathways.",
  },
  {
    step: 4,
    title: "Compare Structural Differences & Export",
    desc: "Highlight key comparative structures (cell wall, chloroplasts, centrioles, vacuoles) and take annotated high-resolution screenshots.",
  },
];

const scientificPrinciples: ScientificPrinciple[] = [
  {
    domain: "Cell Membrane Dynamics",
    laws: "Fluid Mosaic Model & Selective Permeability",
    formulas: "J = -P (C_in - C_out) (Fick's Diffusion Law)",
    solver: "Phospholipid Bilayer Surface Mesh Renderer",
  },
  {
    domain: "Osmotic Turgor Pressure",
    laws: "Van 't Hoff Osmotic Pressure & Water Potential",
    formulas: "Ψ_w = Ψ_s + Ψ_p, Π = iCRT",
    solver: "Hydrostatic Cell Wall Counter-Pressure Solver",
  },
  {
    domain: "Cellular Bioenergetics",
    laws: "Chemiosmotic ATP Synthase Coupling",
    formulas: "ADP + P_i + nH⁺_out → ATP + nH⁺_in",
    solver: "Proton Gradient Electrochemical Vector Map",
  },
  {
    domain: "Endomembrane Trafficking",
    laws: "Vesicle Transport & Protein Sorting (Signal Hypothesis)",
    formulas: "ER → COPII Vesicle → cis-Golgi → trans-Golgi → Membrane",
    solver: "Targeted Vesicular Kinematics Engine",
  },
];

const features: SubtopicFeature[] = [
  {
    icon: Gauge,
    title: "Real-time 3D GPU rendering",
    desc: "Rotate and slice open cellular organelles with high-performance WebGL acceleration.",
    color: "rose",
  },
  {
    icon: LineChart,
    title: "Interactive structural comparisons",
    desc: "Instantly compare organelle presence, membrane types, and sizes between plant and animal cells.",
    color: "emerald",
  },
  {
    icon: GraduationCap,
    title: "Curriculum aligned cytology",
    desc: "Strictly aligned with CBSE Biology Class 11 (Unit 3: Cell Structure and Functions) and AP Biology Unit 2.",
    color: "purple",
  },
];

const curriculum = {
  heading: "Cell Biology Educational Standards Alignment",
  description:
    "Our interactive cell structure laboratories adhere to CBSE Biology Class 11 (Cell: The Unit of Life, Biomolecules, Cell Cycle), AP Biology (Unit 2: Cell Structure and Function), and IB Biology Topic 1 (Cell Biology).",
  secondaryText:
    "Interactive 3D organelle exploration provides tangible spacial context for compartmentalization, endosymbiosis, and cell volume constraints.",
  telemetryTitle: "Cytological Telemetry",
  telemetryDesc: "Inspect organelle surface-area-to-volume ratios and biochemical functions in real time.",
};

const faqs: SubtopicFAQ[] = [
  {
    q: "What are the primary differences between plant and animal cells in the 3D models?",
    a: "Plant cells feature a rigid outer cellulose cell wall, green photosynthetic chloroplasts, and a large central vacuole that maintains turgor pressure. Animal cells lack cell walls and chloroplasts, contain centrioles and lysosomes, and possess flexible plasma membranes.",
  },
  {
    q: "How does the Endosymbiotic Theory apply to mitochondria and chloroplasts?",
    a: "Both mitochondria and chloroplasts have double membranes, circular DNA genomes, and 70S ribosomes distinct from the host cell cytoplasm, reflecting their evolutionary origin as engulfed aerobic and photosynthetic prokaryotes.",
  },
  {
    q: "Can I inspect individual organelle internal structures?",
    a: "Yes. You can isolate and slice into organelles like mitochondria (cristae, matrix) and chloroplasts (thylakoids, granum stacks, stroma) to inspect where cellular respiration and photosynthesis occur.",
  },
  {
    q: "Is the OpenLabs Cell Structure lab free for classroom projection?",
    a: "Yes. All 3D cell models and organelle explorers are 100% free and open for educational use on any screen or projector.",
  },
];

export default function CellSubtopicPage() {
  return (
    <SubtopicHubLayout
      subjectName="Biology"
      subjectSlug="biology"
      subtopicTitle="Cell Structure & Cytology"
      subtopicSubtitle="Explore interactive 3D plant and animal cell models, organelle cross-sections, and cellular compartmentalization."
      badgeText="Cytology Exploration Suite"
      badgeIcon={Microscope}
      themeColor="rose"
      cards={cards}
      howToHeading="How to Explore 3D Plant & Animal Cells Online"
      howToSteps={howToSteps}
      principlesHeading="Cellular Principles & Organelle Dynamics"
      principlesDesc="Fluid mosaic membranes and compartmentalized metabolic pathways evaluated in real time."
      scientificPrinciples={scientificPrinciples}
      features={features}
      curriculum={curriculum}
      faqs={faqs}
      canonicalUrl="https://www.openlabs.org.in/biology/cell"
    />
  );
}
