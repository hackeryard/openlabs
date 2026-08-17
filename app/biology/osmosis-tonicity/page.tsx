import type { Metadata } from "next";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";

export const metadata: Metadata = {
  title: "Osmosis, Diffusion & Cell Tonicity Virtual Lab | OpenLabs",
  description: "Simulate osmosis, selective membrane permeability, Van 't Hoff osmotic pressure, red blood cell hemolysis and crenation, and plant turgor pressure online.",
  keywords: [
    "osmosis simulation online",
    "cell tonicity virtual lab",
    "hypertonic hypotonic isotonic",
    "van t hoff osmotic pressure calculator",
    "red blood cell hemolysis crenation",
    "plant cell turgor plasmolysis",
    "biology virtual lab"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/osmosis-tonicity",
  },
  openGraph: {
    title: "Osmosis, Diffusion & Cell Tonicity Virtual Lab | OpenLabs",
    description: "Explore osmosis, selective membrane diffusion, Van 't Hoff osmotic pressure, and cellular tonicity in real time.",
    url: "https://www.openlabs.org.in/biology/osmosis-tonicity",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/biology/osmosis-hero.png",
        alt: "Osmosis, Diffusion & Cell Tonicity | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Osmosis, Diffusion & Cell Tonicity Virtual Lab | OpenLabs",
    description: "Explore osmosis, selective membrane diffusion, Van 't Hoff osmotic pressure, and cellular tonicity in real time.",
    images: ["https://www.openlabs.org.in/images/biology/osmosis-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const osmosisContent = {
  slug: "osmosis-tonicity",
  subject: "Biology",
  title: "Osmosis, Diffusion & Cell Tonicity",
  description: "A cellular physiology laboratory simulating semi-permeable membrane filtering, liquid meniscus height displacement in U-tube osmometers, Van 't Hoff osmotic pressures, RBC hemolysis/crenation, and plant turgor dynamics.",
  difficulty: "Beginner" as const,
  estimatedTime: "20 minutes",
  heroDescription: "Observe water and solute transport at the molecular level. Control intracellular and extracellular solute concentrations across diverse species (Sucrose, NaCl, Glucose, Urea), measure U-tube liquid column height displacement, and observe live red blood cell hemolysis and plant cell plasmolysis.",
  theory: {
    content: `
      <p><strong>Diffusion</strong> is the net movement of particles from a region of higher concentration to lower concentration down a concentration gradient, driven by thermal Brownian motion. <strong>Osmosis</strong> is a specialized case of diffusion: the spontaneous net passage of solvent molecules (water, $H_2O$) through a <strong>selectively permeable membrane</strong> from a region of lower solute concentration (higher water potential) into a region of higher solute concentration (lower water potential).</p>
      <p>The driving force for osmosis is quantified as <strong>Osmotic Pressure</strong> ($\\Pi$), described by the <strong>Van 't Hoff Equation</strong>:</p>
      <p style="text-align: center; font-weight: bold;">\\Pi = i M R T</p>
      <p>where $i$ is the Van 't Hoff factor (degree of ionic dissociation), $M$ is molarity, $R$ is the ideal gas constant, and $T$ is absolute temperature.</p>
      <p><strong>Tonicity</strong> describes the comparative osmotic pressure between an extracellular solution and a cell's cytoplasm:</p>
      <ul>
        <li><strong>Hypertonic</strong>: Extracellular solute concentration is higher than cytoplasm; water exits the cell, causing animal Red Blood Cells (RBCs) to shrink and wrinkle (<strong>Crenation</strong>) and plant protoplasts to detach from rigid cell walls (<strong>Plasmolysis</strong>).</li>
        <li><strong>Isotonic</strong>: Equal osmotic pressure; no net water movement; normal biconcave RBC morphology and flaccid plant cells.</li>
        <li><strong>Hypotonic</strong>: Extracellular solute concentration is lower; water enters the cell, causing animal cells to swell and burst (<strong>Hemolysis / Lysis</strong>) while providing essential mechanical structural rigidity in plant cells (<strong>Turgor Pressure</strong>).</li>
      </ul>
    `
  },
  learningObjectives: [
    "Differentiate between simple diffusion, facilitated diffusion, and osmosis.",
    "Calculate theoretical osmotic pressure differences using the Van 't Hoff equation (ΔΠ = i·ΔM·R·T).",
    "Predict animal and plant cell morphological responses in Hypertonic, Isotonic, and Hypotonic solutions.",
    "Explain why plant cells resist osmotic lysis in hypotonic environments while animal red blood cells burst."
  ],
  mathematicalFoundations: {
    equations: [
      "\\Pi = i M R T \\text{ (Van 't Hoff Equation)}",
      "\\Delta \\Pi = i \\Delta M R T = \\rho g \\Delta h \\text{ (Hydrostatic Equilibrium in U-Tube)}",
      "\\Psi = \\Psi_s + \\Psi_p \\text{ (Water Potential = Solute Potential + Pressure Potential)}",
      "\\Psi_s = -i C R T"
    ],
    explanation: "In a U-tube osmometer, water flows down its concentration gradient until the accumulated hydrostatic column pressure (ρ·g·Δh) matches the osmotic pressure gradient (ΔΠ), reaching thermodynamic equilibrium."
  },
  realWorldApplications: [
    "Clinical Medicine & Intravenous Fluids: Administering isotonic 0.9% Normal Saline or 5% Dextrose to prevent fatal RBC hemolysis in hospital patients.",
    "Hemodialysis (Artificial Kidney): Filtering urea and metabolic wastes from blood across semi-permeable dialyzer capillary membranes.",
    "Reverse Osmosis (RO) Water Desalination: Applying mechanical pressure exceeding osmotic pressure (up to 70 atm) to produce pure drinking water from seawater.",
    "Food Preservation: High-salt curing of meats and high-sugar jams dehydrating bacteria and mold via hypertonic osmotic plasmolysis."
  ],
  howItWorks: "Select your experiment mode (U-Tube Osmometer or Cell Suspension). Choose from the solute species library (Sucrose i=1, NaCl i=2, Glucose i=1, Urea permeable) and adjust intracellular and extracellular concentration sliders. Observe real-time particle collisions passing through membrane pores, watch the U-tube liquid meniscus rise on the hypertonic arm, and view live microscopic cellular changes in Red Blood Cells and Plant Cells.",
  faqs: [
    {
      question: "Why do red blood cells burst in pure water while plant cells do not?",
      answer: "Animal red blood cells are bounded only by a delicate phospholipid bilayer plasma membrane. In a hypotonic environment (like pure water), continuous inward osmotic water influx increases internal volume until the membrane ruptures (hemolysis). Plant cells possess a rigid, cross-linked cellulose cell wall that exerts opposing wall pressure (pressure potential Ψ_p), halting water influx once the cell becomes firmly turgid."
    },
    {
      question: "Why is 0.9% NaCl solution used for medical IV drips instead of pure distilled water?",
      answer: "A 0.9% (w/v) sodium chloride solution has an osmolarity (~290-300 mOsm/L) that is perfectly isotonic with human blood plasma. Infusing pure distilled water would create a severely hypotonic bloodstream, causing rapid osmotic swelling and catastrophic hemolysis of the patient's red blood cells."
    },
    {
      question: "What is Reverse Osmosis?",
      answer: "Under natural conditions, water flows spontaneously toward higher solute concentration. In Reverse Osmosis (RO), external mechanical hydraulic pressure greater than the natural osmotic pressure (ΔΠ) is applied to the concentrated side, forcing water molecules backwards through a semi-permeable membrane into the pure water reservoir."
    }
  ],
  relatedExperiments: []
};

export default function OsmosisLandingPage() {
  return (
    <EducationalLandingLayout 
      content={osmosisContent} 
      launchUrl="/labs/biology/osmosis-tonicity" 
    />
  );
}
