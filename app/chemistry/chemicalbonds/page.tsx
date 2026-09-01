import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Chemical Bonds - Interactive Chemistry Lab | OpenLabs",
  description: "Explore ionic, covalent, and metallic bonds in an interactive lab. Build molecules, compare bond types, electronegativity differences, and molecular geometry.",
  keywords: [
    "chemical bonds simulation",
    "covalent bond interactive",
    "ionic bond crystal lattice",
    "metallic bond delocalized electrons",
    "molecular geometry",
    "electronegativity difference",
    "bond polarity dipole",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/chemistry/chemicalbonds",
  },
  openGraph: {
    title: "Chemical Bonds - Interactive Chemistry Lab | OpenLabs",
    description: "Explore ionic, covalent, and metallic bonding through our guided chemistry lab simulation.",
    url: "https://www.openlabs.org.in/chemistry/chemicalbonds",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/chemistry/chemicalbonds-hero.png",
        alt: "OpenLabs Chemical Bonds Interactive Chemistry Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chemical Bonds - Interactive Chemistry Lab | OpenLabs",
    description: "Build molecules and compare bond types with our interactive chemistry bonding lab.",
    images: ["https://www.openlabs.org.in/images/chemistry/chemicalbonds-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ChemicalBondsLandingPage() {
  return (
    <STEMExperimentLanding
      subject="chemistry"
      slug="chemicalbonds"
      title="Chemical Bonds & Intermolecular Forces"
      description="Interactive chemical bonding workbench simulating ionic transfer, covalent electron sharing, metallic electron seas, and dipole interactions."
      heroDescription="Dive into the sub-atomic world. Build molecules, transfer valence electrons, and observe how electronegativity differences (Δχ) dictate ionic lattices, polar covalent bonds, and delocalized metallic matrices."
      theory="Chemical bonds form to minimize the potential energy of interacting valence electrons and nuclei, driving atoms toward stable noble-gas electron configurations (the Octet Rule). Electronegativity differences (Δχ) determine bonding classification: Δχ > 1.7 yields ionic lattice attraction (Coulomb's Law), 0.4 < Δχ < 1.7 yields polar covalent sharing, and Δχ < 0.4 yields nonpolar covalent bonds."
      formula="E_{\text{bond}} = \frac{k q_1 q_2}{r} - \frac{B}{r^n} \quad \text{and} \quad \Delta\chi = |\chi_A - \chi_B|"
      formulaLabel="Coulombic Potential Energy & Electronegativity Difference"
      launchUrl="/labs/chemistry/chemicalbonds"
      heroImageUrl="/images/chemistry/chemicalbonds-hero.png"
      visualLabel="3D Chemical Bonding & Molecular Builder"
      visualDetail="Ionic NaCl Crystal • Polar Covalent H₂O • Delocalized Metallic Sea"
      accent={{ primary: "#059669", secondary: "#0d9488", warm: "#d97706" }}
      learningObjectives={[
        "Classify bonds as nonpolar covalent, polar covalent, or ionic based on electronegativity differences (Δχ).",
        "Explain the high melting points and brittleness of ionic crystal lattices vs the ductility of metallic bonding.",
        "Model single, double, and triple covalent bonds and compare their respective bond lengths and dissociation energies.",
        "Differentiate intramolecular chemical bonds from intermolecular forces (hydrogen bonding, dipole-dipole, London dispersion).",
      ]}
      applications={[
        "Polymer Engineering & Synthetic Biomaterials (cross-linking and tensile strength).",
        "Semiconductor Fabrication & Photovoltaic Cell Doping (silicon crystal covalent lattices).",
        "Pharmaceutical Receptor Binding & Rational Drug Design (hydrogen bonding optimization).",
        "Metallurgy & High-Performance Alloy Formulation.",
      ]}
      faqs={[
        {
          question: "What is the primary difference between ionic and covalent bonds?",
          answer:
            "Ionic bonds involve the complete transfer of valence electrons from a low-electronegativity metal to a high-electronegativity nonmetal, creating oppositely charged ions held together by electrostatic attraction. Covalent bonds involve the sharing of electron pairs between two nonmetal atoms.",
        },
        {
          question: "How does electronegativity difference (Δχ) predict bond polarity?",
          answer:
            "When Δχ is near zero (0.0 to 0.4), electrons are shared equally in a nonpolar covalent bond. When Δχ is between 0.4 and 1.7, the more electronegative atom pulls electron density closer, creating a polar covalent bond with partial charges (δ⁺ and δ⁻). When Δχ exceeds ~1.7 to 2.0, complete electron transfer occurs, producing an ionic bond.",
        },
        {
          question: "Why do metals conduct electricity in the solid state while ionic compounds do not?",
          answer:
            "Metals have delocalized valence electrons that form a freely flowing 'sea of electrons' across the entire metallic lattice. In solid ionic compounds, ions are locked into rigid crystalline lattice positions and cannot move; they only conduct electricity when molten or dissolved in water.",
        },
      ]}
    />
  );
}
