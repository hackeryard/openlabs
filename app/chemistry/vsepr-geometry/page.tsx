import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "3D Molecular Geometry & VSEPR Theory Virtual Lab | OpenLabs",
  description: "Explore Valence Shell Electron Pair Repulsion (VSEPR) theory, 3D molecular shapes (linear, trigonal planar, tetrahedral, octahedral), lone pair distortions, and hybridization online.",
  keywords: [
    "vsepr theory simulation",
    "3d molecular geometry lab",
    "molecular shape calculator",
    "lone pair repulsion",
    "orbital hybridization sp sp2 sp3",
    "bond angles tetrahedral octahedral",
    "molecular polarity dipole moment",
    "chemistry virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/chemistry/vsepr-geometry",
  },
  openGraph: {
    title: "3D Molecular Geometry & VSEPR Theory Virtual Lab | OpenLabs",
    description: "Explore VSEPR theory, 3D molecular shapes, bond angle distortions, and orbital hybridization in real time.",
    url: "https://www.openlabs.org.in/chemistry/vsepr-geometry",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/chemistry/vsepr-geometry-hero.png",
        alt: "3D Molecular Geometry & VSEPR Theory | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "3D Molecular Geometry & VSEPR Theory Virtual Lab | OpenLabs",
    description: "Explore VSEPR theory, 3D molecular shapes, bond angle distortions, and orbital hybridization in real time.",
    images: ["https://www.openlabs.org.in/images/chemistry/vsepr-geometry-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function VSEPRLandingPage() {
  return (
    <STEMExperimentLanding
      subject="chemistry"
      slug="vsepr-geometry"
      title="3D Molecular Geometry & VSEPR Theory"
      description="Interactive 3D molecular modeling laboratory calculating electrostatic domain repulsions, orbital hybridization, bond angles, and net dipole vectors."
      heroDescription="Rotate and manipulate 3D molecular geometries in real time. Adjust bonded atoms and lone electron pairs to observe dynamic spatial arrangements across all steric numbers (AX₂ to AX₆), orbital hybridizations (sp to sp³d²), and polarity vectors."
      theory="Valence Shell Electron Pair Repulsion (VSEPR) theory states that electron domains around a central atom repel one another electrostatically, adopting spatial geometries that maximize angular separation. Because non-bonding lone pairs are localized on only one nucleus, they exert stronger repulsion than bonding pairs (Lone Pair-Lone Pair > Lone Pair-Bond Pair > Bond Pair-Bond Pair), causing predictable compression of adjacent bond angles below ideal values."
      formula="AX_m E_n \quad \text{Steric Number } (SN) = m + n \quad (\text{Bond Angle Compression } \Delta\theta \approx 2.5^\circ / \text{lone pair})"
      formulaLabel="VSEPR Notation & Steric Number"
      launchUrl="/labs/chemistry/vsepr-geometry"
      heroImageUrl="/images/chemistry/vsepr-geometry-hero.png"
      visualLabel="3D Rotatable Ball-and-Stick Workbench"
      visualDetail="Steric Numbers 2 to 6 • Lone Pair Cloud Isosurfaces • 3D Dipole Vector Sum"
      accent={{ primary: "#059669", secondary: "#0d9488", warm: "#d97706" }}
      learningObjectives={[
        "Distinguish between electron-pair geometry and observable molecular geometry.",
        "Correlate steric numbers 2, 3, 4, 5, and 6 with hybridizations sp, sp², sp³, sp³d, and sp³d².",
        "Predict bond angle compressions in hydrides such as CH₄ (109.5°), NH₃ (107.0°), and H₂O (104.5°).",
        "Calculate the 3D vector sum of bond dipole moments to determine overall molecular polarity.",
      ]}
      applications={[
        "Structure-Based Drug Discovery & Enzyme Active Site Docking (conformation matching).",
        "Polymer Chemistry & Crystal Lattice Packing (stereocenters and chirality).",
        "Atmospheric Greenhouse Gas Modeling (infrared dipole absorption in CO₂ and CH₄).",
        "Nanotechnology & Supramolecular Self-Assembly (coordination complexes).",
      ]}
      faqs={[
        {
          question: "What is the difference between electron geometry and molecular geometry?",
          answer:
            "Electron geometry describes the spatial arrangement of all electron domains (both bonding pairs and lone pairs) around the central atom. Molecular geometry describes only the spatial arrangement of the bonded atomic nuclei. For example, water has a tetrahedral electron geometry but a bent molecular geometry.",
        },
        {
          question: "Why do lone pairs compress bond angles?",
          answer:
            "Lone pairs are held by only one positive nucleus, allowing their electron density clouds to spread out wider in space than bonding pairs held between two nuclei. This extra volume exerts greater repulsive force against neighboring bonding pairs, pushing them closer together.",
        },
        {
          question: "How does VSEPR geometry determine whether a molecule is polar?",
          answer:
            "Molecular polarity depends on individual bond dipole moments and molecular symmetry. If polar bonds are arranged symmetrically (like the linear CO₂ or tetrahedral CCl₄), their dipole vectors cancel out to zero net dipole. If asymmetric (like bent H₂O), a permanent net dipole moment exists.",
        },
      ]}
    />
  );
}
