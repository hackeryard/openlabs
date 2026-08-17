import type { Metadata } from "next";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";

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
    "chemistry virtual lab"
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

const electrochemContent = {
  slug: "electrochemistry",
  subject: "Chemistry",
  title: "Electrochemical Galvanic & Electrolytic Cells",
  description: "A comprehensive electrochemistry laboratory simulating spontaneous voltaic cells, externally driven electrolytic cells, Nernst concentration dynamics, and electrode mass changes.",
  difficulty: "Intermediate" as const,
  estimatedTime: "25 minutes",
  heroDescription: "Build custom electrochemical half-cells by pairing metal electrodes (Zn, Cu, Ag, Fe, Pb, Al, Mg). Observe real-time electron flow through external circuit wires, salt bridge ion migration, anode dissolution, cathode electroplating, and Nernst equation voltage shifts.",
  theory: {
    content: `
      <p><strong>Electrochemistry</strong> investigates the interconversion of chemical energy and electrical energy through redox (oxidation-reduction) reactions. An electrochemical cell consists of two conductive electrodes immersed in electrolyte solutions containing their respective metal ions, linked externally by a conductive wire and internally by a <strong>salt bridge</strong>.</p>
      <p>In a <strong>Galvanic (Voltaic) Cell</strong> (such as the classic Daniell cell), a spontaneous chemical reaction ($\\Delta G < 0$) generates an electromotive force (EMF) that drives an electrical current through the external circuit. Oxidation spontaneously occurs at the <strong>Anode</strong> (negative terminal), releasing electrons into the external wire as the metal dissolves ($M \\to M^{n+} + n e^-$). These electrons travel to the <strong>Cathode</strong> (positive terminal), where reduction occurs as dissolved cations deposit onto the electrode surface ($M^{n+} + n e^- \\to M$).</p>
      <p>In an <strong>Electrolytic Cell</strong>, an external DC voltage source forces a non-spontaneous redox reaction ($\\Delta G > 0$) to proceed in reverse, converting electrical work into chemical products (used for electroplating, water splitting, and aluminum smelting).</p>
    `
  },
  learningObjectives: [
    "Predict spontaneous cell voltage (E°_cell = E°_cathode - E°_anode) using standard reduction potential series.",
    "Identify anode (oxidation) and cathode (reduction) half-reactions in galvanic and electrolytic modes.",
    "Calculate non-standard cell potentials using the Nernst equation across varying ion concentrations.",
    "Explain the role of the salt bridge in maintaining electroneutrality via counter-ion migration.",
    "Quantify electrode mass changes (anode corrosion vs cathode plating) using Faraday's laws of electrolysis."
  ],
  mathematicalFoundations: {
    equations: [
      "E^{\\circ}_{\\text{cell}} = E^{\\circ}_{\\text{cathode}} - E^{\\circ}_{\\text{anode}}",
      "E_{\\text{cell}} = E^{\\circ}_{\\text{cell}} - \\frac{RT}{nF} \\ln Q = E^{\\circ}_{\\text{cell}} - \\frac{0.0592}{n} \\log_{10} Q \\text{ (@ 298 K)}",
      "\\Delta G^{\\circ} = -n F E^{\\circ}_{\\text{cell}}",
      "m = \\frac{I \\cdot t \\cdot M}{n \\cdot F} \\text{ (Faraday's Law of Electrolysis)}"
    ],
    explanation: "The Nernst equation quantitatively describes how cell potential varies as a function of temperature (T), the number of transferred electrons (n), and the reaction quotient (Q = [Anode cation] / [Cathode cation]). As the reaction proceeds toward equilibrium (Q = K), cell potential drops to zero."
  },
  realWorldApplications: [
    "Lithium-ion & Alkaline Batteries: Powering smartphones, electric vehicles, and grid storage via reversible intercalation electrochemistry.",
    "Industrial Electroplating: Depositing corrosion-resistant or decorative metal layers (e.g. chromium, gold, zinc galvanization).",
    "Fuel Cells & Hydrogen Economy: Clean catalytic conversion of hydrogen and oxygen into water with zero carbon emissions.",
    "Cathodic Protection: Sacrificial zinc anodes protecting steel ship hulls and underground gas pipelines from oxidative corrosion."
  ],
  howItWorks: "Select the anode metal and cathode metal from the dropdown selectors (e.g. Zn/Cu, Fe/Ag, Mg/Cu). Choose between Galvanic mode (spontaneous battery) and Electrolytic mode (driven by external DC power supply). Adjust the molar concentrations of the half-cell solutions using the sliders. Watch the voltmeter readout calculate the live Nernst potential, observe the animated electron flow along the circuit wire, and track the salt bridge ion migration.",
  faqs: [
    {
      question: "Why is a salt bridge necessary in a galvanic cell?",
      answer: "As oxidation occurs at the anode, positive metal cations accumulate in the anode beaker. Simultaneously, reduction at the cathode depletes positive cations, leaving an excess of negative anions. Without a salt bridge, this charge imbalance would instantly halt electron flow. The salt bridge contains an inert electrolyte (like KNO₃) whose anions migrate toward the anode and cations toward the cathode, maintaining electrical neutrality."
    },
    {
      question: "How does changing ion concentrations alter cell voltage in the Nernst equation?",
      answer: "According to the Nernst equation (E = E° - (0.0592/n)·log([Anode]/[Cathode])), increasing the cathode ion concentration (reactant) or decreasing the anode ion concentration (product) lowers Q, which raises the cell potential. Conversely, depleting cathode ions lowers voltage until E = 0 at chemical equilibrium."
    },
    {
      question: "What is the mnemonic to remember which reaction happens at which electrode?",
      answer: "Remember 'An Ox and a Red Cat': Anode = Oxidation, Reduction = Cathode. Additionally, remember 'OIL RIG': Oxidation Is Loss of electrons, Reduction Is Gain of electrons."
    }
  ],
  relatedExperiments: []
};

export default function ElectrochemistryLandingPage() {
  return (
    <EducationalLandingLayout 
      content={electrochemContent} 
      launchUrl="/labs/chemistry/electrochemistry" 
    />
  );
}
