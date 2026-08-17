import type { Metadata } from "next";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";

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
    "chemistry virtual lab"
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
        url: "https://www.openlabs.org.in/images/chemistry/vsepr-hero.png",
        alt: "3D Molecular Geometry & VSEPR Theory | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "3D Molecular Geometry & VSEPR Theory Virtual Lab | OpenLabs",
    description: "Explore VSEPR theory, 3D molecular shapes, bond angle distortions, and orbital hybridization in real time.",
    images: ["https://www.openlabs.org.in/images/chemistry/vsepr-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const vseprContent = {
  slug: "vsepr-geometry",
  subject: "Chemistry",
  title: "3D Molecular Geometry & VSEPR Theory",
  description: "An interactive molecular modeling laboratory calculating electrostatic electron domain repulsions, orbital hybridization, bond angle compressions, and net 3D dipole vectors.",
  difficulty: "Intermediate" as const,
  estimatedTime: "25 minutes",
  heroDescription: "Rotate and manipulate 3D molecular structures in real time. Modify bonding electron pairs and unshared lone pairs to observe dynamic spatial reorientations across all steric numbers (AX₂ to AX₆), orbital hybridizations (sp to sp³d²), and polarity vectors.",
  theory: {
    content: `
      <p><strong>Valence Shell Electron Pair Repulsion (VSEPR) theory</strong> is a foundational chemical model used to predict the three-dimensional geometry of individual molecules based on the number of electron pairs surrounding their central atoms. Because electrons are negatively charged particles, electron domains (bonding pairs and non-bonding lone pairs) exert mutual electrostatic repulsion and spontaneously adopt spatial arrangements that maximize angular separation and minimize repulsive potential energy.</p>
      <p>The total number of electron domains defines the <strong>electron-pair geometry</strong> (Steric Number $SN = 2$ to $6$). However, the <strong>molecular geometry</strong> describes only the positions of the bonded atomic nuclei. Non-bonding lone pairs occupy greater spatial volume than bonding pairs because they are localized under the influence of only a single nucleus. Consequently, lone pairs exert greater repulsive force, following the hierarchy:</p>
      <p style="text-align: center; font-weight: bold;">Lone Pair – Lone Pair > Lone Pair – Bonding Pair > Bonding Pair – Bonding Pair</p>
      <p>This differential repulsion causes measurable compression of adjacent bond angles below ideal geometric values (for example, compressing the ideal $109.5^\\circ$ tetrahedral angle to $107.0^\\circ$ in ammonia and $104.5^\\circ$ in water).</p>
    `
  },
  learningObjectives: [
    "Determine the steric number (SN) of central atoms by counting bonding domains and lone pairs.",
    "Predict electron domain geometry and molecular shape from AXₘEₙ notation (e.g. AX₂ Linear, AX₃ Trigonal Planar, AX₂E Bent, AX₄ Tetrahedral, AX₃E Trigonal Pyramidal, AX₂E₂ Bent, AX₅ Trigonal Bipyramidal, AX₆ Octahedral).",
    "Explain bond angle compression caused by the greater spatial volume and repulsion of unshared lone pairs.",
    "Correlate geometric symmetry with molecular polarity and calculate net 3D dipole moments (μ)."
  ],
  mathematicalFoundations: {
    equations: [
      "SN = \\text{Bonding Domains} + \\text{Non-bonding Lone Pairs}",
      "\\cos(\\theta) = -\\frac{1}{n} \\text{ (for ideal } sp^n \\text{ hybrid orbitals)}",
      "\\boldsymbol{\\mu}_{net} = \\sum_{i} q_i \\mathbf{r}_i \\text{ (3D Dipole Vector Sum)}"
    ],
    explanation: "Hybrid orbital angles arise from linear combinations of atomic wavefunctions. Ideal hybridization angles are 180° for sp (n=1), 120° for sp² (n=2), and arccos(-1/3) ≈ 109.47° for sp³ (n=3). Net molecular polarity equals the vector sum of individual polar bond dipoles."
  },
  realWorldApplications: [
    "Rational Drug Discovery: Structure-based drug design relies on molecular geometry fitting tightly into enzyme active-site binding pockets.",
    "Material Science & Polymers: Stereochemistry and molecular symmetry govern crystal packing, melting points, and polymer tensile strength.",
    "Environmental Science: The bent geometry of water (104.5°) gives it a strong permanent dipole (1.85 D), enabling high boiling points and universal solvent properties essential for planetary life.",
    "Atmospheric Greenhouse Modeling: Asymmetrical vibrational bending in greenhouse gases (CO₂, CH₄, H₂O) allows absorption of infrared terrestrial radiation."
  ],
  howItWorks: "Select a chemical molecule from the library (such as BeCl₂, BF₃, CH₄, NH₃, H₂O, PCl₅, or SF₆) or custom-build a steric domain using the bonding pair and lone pair counters. Drag on the 3D canvas with your mouse or touch screen to rotate the molecular orbital sphere. Observe the calculated bond angles, orbital hybridization label, and the yellow 3D net dipole vector arrow.",
  faqs: [
    {
      question: "Why is water (H₂O) bent rather than linear if it has three atoms?",
      answer: "Oxygen in water has four electron domains: two single covalent O-H bonds and two unshared lone pairs (AX₂E₂ notation, steric number 4). The electron geometry is tetrahedral. The two lone pairs repel the bonding pairs downward, compressing the H-O-H bond angle from the ideal 109.5° down to 104.5°, creating a bent molecular geometry."
    },
    {
      question: "Why is CO₂ nonpolar while H₂O is highly polar?",
      answer: "Although both carbon-oxygen bonds in CO₂ are polar, CO₂ has a linear molecular geometry (180° bond angle, AX₂). The two dipole vectors point in exactly opposite directions and cancel each other out (μ_net = 0). Water has a bent geometry (104.5°), so its bond dipole vectors add constructively, creating a strong net molecular dipole."
    },
    {
      question: "What is the difference between electron domain geometry and molecular geometry?",
      answer: "Electron domain geometry describes the spatial arrangement of all electron pairs (both bonding pairs and lone pairs) around the central atom. Molecular geometry describes only the spatial arrangement of the bonded atoms themselves, as observed experimentally via X-ray crystallography."
    }
  ],
  relatedExperiments: []
};

export default function VSEPRLandingPage() {
  return (
    <EducationalLandingLayout 
      content={vseprContent} 
      launchUrl="/labs/chemistry/vsepr-geometry" 
    />
  );
}
