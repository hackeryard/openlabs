import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Cellular Respiration & Mitochondrial Electron Transport Virtual Lab | OpenLabs",
  description: "Simulate cellular respiration, mitochondrial cristae electron transport chain (Complexes I-IV), proton gradient pumping, rotary ATP Synthase, and metabolic poisons online.",
  keywords: [
    "cellular respiration simulation online",
    "electron transport chain virtual lab",
    "mitochondria atp synthase rotor",
    "chemiosmosis proton motive force",
    "oxidative phosphorylation lab",
    "dnp uncoupler cyanide inhibition",
    "biology virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/cellular-respiration",
  },
  openGraph: {
    title: "Cellular Respiration & Mitochondrial ETC Virtual Lab | OpenLabs",
    description: "Explore the electron transport chain, proton pumping, chemiosmosis, rotary ATP Synthase, and metabolic poisons in real time.",
    url: "https://www.openlabs.org.in/biology/cellular-respiration",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/biology/cellular-respiration-hero.png",
        alt: "Cellular Respiration & Mitochondrial Electron Transport | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cellular Respiration & Mitochondrial ETC Virtual Lab | OpenLabs",
    description: "Explore the electron transport chain, proton pumping, chemiosmosis, rotary ATP Synthase, and metabolic poisons in real time.",
    images: ["https://www.openlabs.org.in/images/biology/cellular-respiration-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CellularRespirationLandingPage() {
  return (
    <STEMExperimentLanding
      subject="biology"
      slug="cellular-respiration"
      title="Cellular Respiration & ATP Synthase"
      description="Interactive bioenergetics laboratory simulating the mitochondrial electron transport chain (Complexes I–IV), chemiosmotic proton motive force, and rotary ATP Synthase catalysis."
      heroDescription="Journey inside the inner mitochondrial membrane. Trace high-energy electron pairs from NADH and FADH₂ cascading through Complexes I–IV, observe proton pumping creating an electrochemical gradient, and watch the rotary catalytic ATP Synthase turbine synthesize ATP."
      theory="Cellular respiration is the biochemical catabolism of organic fuels to synthesize ATP via oxidative phosphorylation. High-energy electrons from Glycolysis and the Krebs Cycle (carried by NADH and FADH₂) pass down a redox potential ladder in the inner mitochondrial membrane (Complex I → Q → Complex III → Cytochrome c → Complex IV to reduce 1/2 O₂ + 2H⁺ → H₂O). The energy released pumps protons (H⁺) into the intermembrane space, creating a Proton Motive Force (PMF = ΔΨ - (2.3RT/F)ΔpH). Protons diffuse back through the F₀ rotor of ATP Synthase, driving mechanical rotation of the central γ-shaft to catalyze ADP + P_i → ATP."
      formula="\text{PMF } (\Delta p) = \Delta\Psi - \left(\frac{2.3 RT}{F}\right) \Delta\text{pH} \quad \text{and} \quad \text{C}_6\text{H}_{12}\text{O}_6 + 6\text{O}_2 \rightarrow 6\text{CO}_2 + 6\text{H}_2\text{O} + 30\text{--}32\text{ ATP}"
      formulaLabel="Mitchell's Chemiosmotic Proton Motive Force & Net Respiration"
      launchUrl="/labs/biology/cellular-respiration"
      heroImageUrl="/images/biology/cellular-respiration-hero.png"
      visualLabel="Inner Mitochondrial Cristae & ATP Synthase Turbine"
      visualDetail="Complexes I–IV Electron Cascade • Live Proton Motive Force Gauge • Metabolic Inhibitors (Cyanide, DNP)"
      accent={{ primary: "#059669", secondary: "#9333ea", warm: "#f59e0b" }}
      learningObjectives={[
        "Trace the path of electrons through Complexes I, II, III, and IV to terminal oxygen.",
        "Quantify the Proton Motive Force (PMF) combining electrical potential (ΔΨ ≈ 160 mV) and chemical pH gradient (ΔpH ≈ 0.75).",
        "Describe the mechanical rotary catalysis mechanism of F₀F₁ ATP Synthase (binding change mechanism).",
        "Evaluate the disruptive biochemical effects of metabolic poisons: ETC inhibitors (Cyanide, Rotenone) vs uncouplers (DNP).",
      ]}
      applications={[
        "Mitochondrial Medicine & Metabolic Disorders (Leber's hereditary optic neuropathy, MELAS).",
        "Toxicology & Poison Antidotes (amyl nitrite and hydroxocobalamin for cyanide poisoning).",
        "Brown Adipose Tissue & Non-Shivering Thermogenesis (uncoupling protein UCP1 / thermogenin).",
        "Exercise Physiology & Aerobic VO₂ Max Performance Optimization.",
      ]}
      faqs={[
        {
          question: "How does Peter Mitchell's Chemiosmotic Hypothesis explain ATP synthesis?",
          answer:
            "Instead of a direct chemical intermediate, the ETC uses the energy of electron transfers to actively pump H⁺ ions across the inner mitochondrial membrane, storing potential energy in an electrochemical gradient. ATP is synthesized as protons flow back down this gradient through the rotary turbine of ATP Synthase.",
        },
        {
          question: "What is the biochemical difference between an ETC inhibitor and an uncoupler?",
          answer:
            "An ETC inhibitor (like Cyanide blocking Complex IV) completely halts electron flow and stops both oxygen consumption and proton pumping. An uncoupler (like 2,4-DNP) makes the membrane permeable to protons, dissipating the proton gradient without blocking electron flow; electrons continue to oxygen and consume O₂, but the energy is lost as heat instead of making ATP.",
        },
        {
          question: "Why does NADH yield more ATP (~2.5 ATP) than FADH₂ (~1.5 ATP)?",
          answer:
            "NADH enters the ETC at Complex I, pumping protons across Complexes I, III, and IV (total of ~10 H⁺ pumped per electron pair). FADH₂ enters downstream at Complex II (succinate dehydrogenase), bypassing Complex I and pumping protons across only Complexes III and IV (total of ~6 H⁺ pumped).",
        },
      ]}
    />
  );
}
