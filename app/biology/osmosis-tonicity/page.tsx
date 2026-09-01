import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

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
    "biology virtual lab",
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
        url: "https://www.openlabs.org.in/images/biology/osmosis-tonicity-hero.png",
        alt: "Osmosis, Diffusion & Cell Tonicity | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Osmosis, Diffusion & Cell Tonicity Virtual Lab | OpenLabs",
    description: "Explore osmosis, selective membrane diffusion, Van 't Hoff osmotic pressure, and cellular tonicity in real time.",
    images: ["https://www.openlabs.org.in/images/biology/osmosis-tonicity-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function OsmosisTonicityLandingPage() {
  return (
    <STEMExperimentLanding
      subject="biology"
      slug="osmosis-tonicity"
      title="Osmosis, Diffusion & Cell Tonicity"
      description="Cellular physiology laboratory simulating semi-permeable membrane filtering, U-tube osmometer liquid displacements, Van 't Hoff osmotic pressures, RBC hemolysis, and plant plasmolysis."
      heroDescription="Observe water and solute transport at the molecular level. Control intracellular and extracellular solute concentrations across diverse species (NaCl, Sucrose, Glucose, Urea), measure U-tube liquid column height displacement, and observe live red blood cell hemolysis and plant cell plasmolysis."
      theory="Osmosis is the spontaneous net diffusion of solvent (water) across a selectively permeable membrane from an area of higher water potential (lower solute concentration) to lower water potential (higher solute concentration). The driving force is quantified by the Van 't Hoff Osmotic Pressure equation (Π = i M R T). Depending on relative extracellular tonicity, animal cells undergo hypotonic osmotic lysis/bursting or hypertonic crenation/shriveling, while plant cells with rigid walls maintain healthy hydrostatic turgor pressure or undergo plasmolysis."
      formula="\Pi = i M R T \quad \text{and} \quad \Delta h = \frac{\Pi}{\rho g} \quad \text{and} \quad \Psi = \Psi_s + \Psi_p"
      formulaLabel="Van 't Hoff Osmotic Pressure & Water Potential"
      launchUrl="/labs/biology/osmosis-tonicity"
      heroImageUrl="/images/biology/osmosis-tonicity-hero.png"
      visualLabel="Molecular Semi-Permeable Membrane & U-Tube"
      visualDetail="Van 't Hoff Pressure Calculator • Live RBC & Plant Cell Morphology • U-Tube Meniscus Displacement"
      accent={{ primary: "#0284c7", secondary: "#e11d48", warm: "#10b981" }}
      learningObjectives={[
        "Calculate theoretical osmotic pressure using the Van 't Hoff equation (accounting for ionic dissociation factor i).",
        "Predict animal cell morphological responses across hypotonic (<300 mOsm/L), isotonic (300 mOsm/L), and hypertonic (>300 mOsm/L) solutions.",
        "Differentiate animal cell osmotic lysis from plant cell wall turgor stabilization.",
        "Distinguish non-penetrating solutes (NaCl, Sucrose) from penetrating solutes (Urea, Ethanol) and their effects on steady-state cell volume.",
      ]}
      applications={[
        "Clinical Intravenous Fluid Therapy (0.9% Normal Saline vs D5W vs 3% Hypertonic Saline).",
        "Renal Hemodialysis & Peritoneal Dialysis for end-stage kidney failure.",
        "Food Preservation & Curing via osmotic dehydration (salting meats and pickling).",
        "Seawater Desalination via Industrial Reverse Osmosis (RO) membranes.",
      ]}
      faqs={[
        {
          question: "Why does an animal cell burst in pure water while a plant cell does not?",
          answer:
            "Animal erythrocytes are bounded only by a fragile phospholipid plasma membrane; in hypotonic pure water, continuous osmotic water influx increases hydrostatic pressure until the membrane ruptures (hemolysis). Plant cells are surrounded by a rigid cellulose cell wall that exerts an opposing wall pressure (turgor pressure Ψ_p), halting net water influx once water potentials equilibrate.",
        },
        {
          question: "What is the Van 't Hoff factor (i) and why is it important?",
          answer:
            "The factor i represents the number of discrete particles an electrolyte dissociates into in solution (e.g., i = 1 for non-ionizing glucose, i = 2 for NaCl → Na⁺ + Cl⁻, i = 3 for CaCl₂ → Ca²⁺ + 2Cl⁻). Because colligative osmotic pressure depends on total particle count, a 1 M NaCl solution exerts approximately double the osmotic pressure of a 1 M glucose solution.",
        },
        {
          question: "What happens during plant cell plasmolysis?",
          answer:
            "In a hypertonic extracellular environment, water leaves the plant cell's central vacuole. As vacuolar volume shrinks, the plasma membrane pulls away from the rigid cell wall, leaving the plant flaccid and wilted.",
        },
      ]}
    />
  );
}
