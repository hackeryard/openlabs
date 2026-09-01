import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Electrochemical Galvanic & Electrolytic Cells Virtual Lab | OpenLabs",
  description: "Simulate galvanic voltaic cells, electrolytic cells, standard electrode reduction potentials, Nernst equation concentration shifts, and salt bridge ion flow online.",
  keywords: [
    "galvanic cell simulation online",
    "electrolytic cell virtual lab",
    "nernst equation calculator",
    "standard reduction potentials",
    "redox reactions electrochemistry",
    "salt bridge ion transfer",
    "daniell cell zinc copper",
    "chemistry virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/chemistry/electrochemistry",
  },
  openGraph: {
    title: "Electrochemical Cells Virtual Lab | OpenLabs",
    description: "Explore galvanic voltaic cells, electrolytic cells, Nernst equation potential shifts, and electrode mass transfer in real time.",
    url: "https://www.openlabs.org.in/chemistry/electrochemistry",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/chemistry/electrochemistry-hero.png",
        alt: "Electrochemical Galvanic & Electrolytic Cells | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Electrochemical Cells Virtual Lab | OpenLabs",
    description: "Explore galvanic voltaic cells, electrolytic cells, Nernst equation potential shifts, and electrode mass transfer in real time.",
    images: ["https://www.openlabs.org.in/images/chemistry/electrochemistry-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ElectrochemistryLandingPage() {
  return (
    <STEMExperimentLanding
      subject="chemistry"
      slug="electrochemistry"
      title="Electrochemical Galvanic & Electrolytic Cells"
      description="Comprehensive electrochemistry studio simulating spontaneous voltaic cells, externally driven electrolytic cells, Nernst concentration dynamics, and electrode mass changes."
      heroDescription="Build custom electrochemical half-cells by pairing metal electrodes (Zn, Cu, Ag, Fe, Pb, Al, Mg). Observe real-time electron flow through external circuit wires, salt bridge ion migration, anode dissolution, cathode electroplating, and Nernst equation voltage shifts."
      theory="Electrochemistry investigates the interconversion of chemical energy and electrical energy through redox (oxidation-reduction) reactions. In a Galvanic cell, spontaneous redox reactions (ΔG < 0) drive electron flow from the anode (oxidation: M → Mⁿ⁺ + ne⁻) to the cathode (reduction: Mⁿ⁺ + ne⁻ → M). In an Electrolytic cell, an external potential overrides thermodynamics to force non-spontaneous reactions (ΔG > 0)."
      formula="E_{\text{cell}} = E^\circ_{\text{cell}} - \frac{RT}{nF} \ln Q \quad \text{and} \quad \Delta G^\circ = -n F E^\circ_{\text{cell}}"
      formulaLabel="Nernst Concentration Equation & Free Energy Relation"
      launchUrl="/labs/chemistry/electrochemistry"
      heroImageUrl="/images/chemistry/electrochemistry-hero.png"
      visualLabel="Dual Half-Cell Electrochemistry Bench"
      visualDetail="Galvanic & Electrolytic Modes • Salt Bridge Ion Animation • Live Nernst Voltmeter"
      accent={{ primary: "#059669", secondary: "#0d9488", warm: "#d97706" }}
      learningObjectives={[
        "Predict spontaneous cell voltage (E°_cell = E°_cathode - E°_anode) using standard reduction potential tables.",
        "Calculate non-standard cell potentials using the Nernst equation at varying ion concentrations.",
        "Trace electron flow through external wires and balancing ion migration through the salt bridge.",
        "Differentiate spontaneous galvanic cells (ΔG < 0, E > 0) from driven electrolytic cells (ΔG > 0, E < 0).",
      ]}
      applications={[
        "Lithium-ion and Lead-Acid Battery Storage Systems (electric vehicles and renewable grid storage).",
        "Industrial Electroplating & Metal Refining (gold plating and Hall-Héroult aluminum smelting).",
        "Cathodic Protection & Corrosion Prevention (sacrificial zinc anodes on ocean ship hulls).",
        "Electrochemical Biosensors & Continuous Blood Glucose Monitors.",
      ]}
      faqs={[
        {
          question: "What is the critical function of the salt bridge in a galvanic cell?",
          answer:
            "As electrons flow from anode to cathode, excess positive charge builds up in the anode beaker (due to Zn²⁺ generation) while excess negative charge builds up in the cathode beaker (as Cu²⁺ is consumed). The salt bridge permits spectator ions (e.g., K⁺ and Cl⁻) to migrate and maintain electrical neutrality, preventing polarization from stopping the current.",
        },
        {
          question: "How does the Nernst equation explain concentration cells?",
          answer:
            "A concentration cell uses identical electrodes in both half-cells (so E°_cell = 0 V), but different electrolyte concentrations. The potential is generated purely by the concentration gradient: E_cell = -(0.0592/n)·log([dilute]/[concentrated]).",
        },
        {
          question: "How do galvanic and electrolytic cells differ in their sign conventions?",
          answer:
            "In both cells, oxidation occurs at the anode and reduction occurs at the cathode. In a galvanic cell, the anode is negative and the cathode is positive. In an electrolytic cell connected to an external DC power supply, the anode is attached to the positive terminal and the cathode to the negative terminal.",
        },
      ]}
    />
  );
}
