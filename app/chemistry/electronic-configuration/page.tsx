import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Electronic Configuration & Aufbau Principle Virtual Lab | OpenLabs",
  description: "Explore atomic orbitals (s, p, d, f), Pauli Exclusion Principle, Hund's Rule, and Aufbau electron orbital filling simulations online.",
  keywords: [
    "electronic configuration simulation",
    "aufbau principle virtual lab",
    "hunds rule chemistry",
    "pauli exclusion principle",
    "quantum numbers n l ml ms",
    "atomic orbital visualizer",
    "chemistry virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/chemistry/electronic-configuration",
  },
  openGraph: {
    title: "Electronic Configuration Virtual Lab | OpenLabs",
    description: "Explore atomic subshells, orbital energy diagrams, and Aufbau electron configurations in real time.",
    url: "https://www.openlabs.org.in/chemistry/electronic-configuration",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/chemistry/electronic-configuration-hero.png",
        alt: "Electronic Configuration Virtual Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Electronic Configuration Virtual Lab | OpenLabs",
    description: "Explore atomic subshells, orbital energy diagrams, and Aufbau electron configurations in real time.",
    images: ["https://www.openlabs.org.in/images/chemistry/electronic-configuration-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ElectronicConfigurationLandingPage() {
  return (
    <STEMExperimentLanding
      subject="chemistry"
      slug="electronic-configuration"
      title="Electronic Configuration & Quantum Orbitals"
      description="Interactive quantum chemistry simulation modeling the Aufbau principle, Pauli exclusion principle, Hund's rule, and 3D subshell probability isosurfaces."
      heroDescription="Visualize atomic electron subshell filling from Hydrogen (Z = 1) to Oganesson (Z = 118). Inspect quantum numbers (n, l, m_l, m_s), build orbital energy level diagrams, and observe anomalous electron configurations in transition metals."
      theory="The electronic configuration of an atom describes the spatial and energetic distribution of its electrons across quantized energy levels. Electron filling follows three fundamental quantum mechanics principles: (1) The Aufbau Principle (electrons occupy lowest energy orbitals first, following the (n + l) Madelung rule), (2) Pauli Exclusion Principle (no two electrons in an atom can have identical sets of four quantum numbers, limiting each orbital to two opposite-spin electrons), and (3) Hund's Rule of Maximum Multiplicity (degenerate orbitals are filled singly with parallel spins before pairing occurs)."
      formula="E_n = -\frac{13.6 \, Z^2}{n^2} \text{ eV} \quad \text{and} \quad \text{Madelung Rule: Lower } (n + \ell) \text{ fills first}"
      formulaLabel="Bohr Energy Levels & Madelung Aufbau Rule"
      launchUrl="/labs/chemistry/electronic-configuration"
      heroImageUrl="/images/chemistry/electronic-configuration-hero.png"
      visualLabel="Quantum Orbital Energy Ladder & 3D Probability Density"
      visualDetail="Aufbau Energy Fill Engine • Spin Up / Down Arrows • Transition Metal Anomalies (Cr, Cu)"
      accent={{ primary: "#059669", secondary: "#0d9488", warm: "#d97706" }}
      learningObjectives={[
        "Assign the four quantum numbers (principal n, angular momentum l, magnetic m_l, and spin m_s) to any electron in an atom.",
        "Construct electron orbital diagrams obeying the Aufbau principle, Pauli exclusion, and Hund's rule.",
        "Explain half-filled and fully-filled d-subshell stabilization in transition metals like Chromium ([Ar] 4s¹ 3d⁵) and Copper ([Ar] 4s¹ 3d¹⁰).",
        "Correlate valence electron configurations with chemical group reactivity and magnetic properties (paramagnetism vs diamagnetism).",
      ]}
      applications={[
        "Quantum Chemistry & Computational Density Functional Theory (DFT).",
        "Laser Physics & Optical Pumping (population inversion in Nd:YAG and Ruby lasers).",
        "Magnetic Materials Design (ferromagnetism in iron, cobalt, and rare-earth neodymium magnets).",
        "Spectroscopic Analysis (X-ray photoelectron spectroscopy and atomic absorption).",
      ]}
      faqs={[
        {
          question: "What are the four quantum numbers that describe an electron?",
          answer:
            "The four quantum numbers are: (1) Principal quantum number (n = 1, 2, 3...) determining the main energy level and shell size, (2) Angular momentum quantum number (l = 0 to n-1) defining orbital shape (s, p, d, f), (3) Magnetic quantum number (m_l = -l to +l) specifying orbital 3D spatial orientation, and (4) Spin quantum number (m_s = +1/2 or -1/2) defining intrinsic electron angular momentum.",
        },
        {
          question: "Why does the 4s orbital fill before the 3d orbital?",
          answer:
            "According to the Madelung (n + l) rule, the 4s orbital has n + l = 4 + 0 = 4, while the 3d orbital has n + l = 3 + 2 = 5. Lower (n + l) values correspond to lower energy due to greater radial penetration of s-electrons near the nucleus, so 4s fills before 3d.",
        },
        {
          question: "Why are Chromium and Copper exceptions to standard Aufbau filling?",
          answer:
            "Standard filling would predict Cr as [Ar] 4s² 3d⁴ and Cu as [Ar] 4s² 3d⁹. However, transferring one electron from the 4s orbital creates half-filled ([Ar] 4s¹ 3d⁵) and fully-filled ([Ar] 4s¹ 3d¹⁰) d-subshells, which have greater quantum mechanical exchange energy stabilization.",
        },
      ]}
    />
  );
}
