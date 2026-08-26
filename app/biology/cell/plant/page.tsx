import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Plant Cell Simulation | Interactive Botany Lab | OpenLabs",
  description: "Interactive plant cell explorer with 3D visualization of chloroplasts, central vacuoles, cellulose cell walls, plasmodesmata, and specialized botanical organelles.",
  keywords: [
    "plant cell simulation",
    "chloroplasts 3d",
    "cell wall cellulose",
    "central vacuole turgor",
    "plasmodesmata plant biology",
    "botanical education",
    "biology simulation",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/cell/plant",
  },
  openGraph: {
    title: "Plant Cell Simulation | Interactive Botany Lab | OpenLabs",
    description: "Interactive plant cell explorer with 3D visualization of chloroplasts, vacuoles, and cell walls.",
    url: "https://www.openlabs.org.in/biology/cell/plant",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/biology/plant-cell-hero.png",
        alt: "Plant Cell Simulation | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plant Cell Simulation | Interactive Botany Lab | OpenLabs",
    description: "Interactive plant cell explorer with 3D visualization of chloroplasts, vacuoles, and cell walls.",
    images: ["https://www.openlabs.org.in/images/biology/plant-cell-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PlantCellLandingPage() {
  return (
    <STEMExperimentLanding
      subject="biology"
      slug="cell/plant"
      title="Plant Cell & Chloroplast Ultrastructure"
      description="Interactive 3D botanical cytology studio exploring cellulose cell walls, large central vacuoles, thylakoid grana, and plasmodesmata intercellular channels."
      heroDescription="Explore plant anatomy and photosynthetic organelles in interactive 3D. Inspect the primary/secondary cell wall, observe central vacuole turgor pressure regulation, and delve inside the chloroplast stroma and thylakoids."
      theory="Plant cells are photosynthetic autotrophic eukaryotes characterized by three unique structures absent in animal cells: (1) A rigid cellulose microfibril cell wall providing structural support, (2) A large central vacuole maintaining cellular hydrostatic turgor pressure (Ψ_p), and (3) Chloroplast plastids containing chlorophyll pigments that drive light-dependent photophosphorylation and Calvin cycle carbon fixation."
      formula="\Psi = \Psi_s + \Psi_p \quad (\text{Water Potential: Solute } \Psi_s \text{ and Turgor Pressure } \Psi_p)"
      formulaLabel="Plant Cell Water Potential Equilibrium Equation"
      launchUrl="/labs/biology/cell/plant"
      heroImageUrl="/images/biology/plant-cell-hero.png"
      visualLabel="3D Botanical Plant Cell Workbench"
      visualDetail="Chloroplast Thylakoid Grana • Large Central Vacuole • Plasmodesmata Junctions"
      accent={{ primary: "#059669", secondary: "#10b981", warm: "#facc15" }}
      learningObjectives={[
        "Identify the distinguishing organelles of plant cells (cell wall, chloroplasts, central vacuole, plasmodesmata).",
        "Explain how osmotic water influx into the central vacuole generates hydrostatic turgor pressure that prevents wilting.",
        "Trace the dual-membrane structure of chloroplasts and the spatial organization of thylakoid lumen vs stroma.",
        "Describe symplastic intercellular communication mediated by plasmodesmata cytoplasmic bridges.",
      ]}
      applications={[
        "Agricultural Crop Bioengineering & Drought Resistance (enhancing osmotic regulation).",
        "Biofuel & Cellulosic Ethanol Production from plant cell wall biomass.",
        "Plant Pathology & Crop Disease Resistance (defense against fungal cellulase enzymes).",
        "Horticulture & Greenhouse Climate Control.",
      ]}
      faqs={[
        {
          question: "How does turgor pressure support plant structure?",
          answer:
            "When plant roots absorb water in a hypotonic environment, water flows into the central vacuole via osmosis. The swollen vacuole presses the protoplast against the rigid cell wall, generating hydrostatic turgor pressure (Ψ_p > 0) that keeps non-woody stems and leaves upright.",
        },
        {
          question: "What is the function of plasmodesmata in plant tissues?",
          answer:
            "Plasmodesmata are microscopic channels traversing plant cell walls that connect the cytoplasm of adjacent cells (the symplast), enabling the rapid intercellular transport of water, nutrients, signaling hormones, and transcription factors.",
        },
        {
          question: "How do chloroplasts convert solar energy into biochemical energy?",
          answer:
            "Within the thylakoid membrane, light-harvesting pigment complexes absorb photons to split water (photolysis), generating a proton gradient that drives ATP synthase and reduces NADP⁺ to NADPH. These energy carriers are then used in the stroma during the Calvin cycle to synthesize glucose.",
        },
      ]}
    />
  );
}
