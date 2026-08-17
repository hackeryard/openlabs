import type { Metadata } from "next";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";

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
    "biology virtual lab"
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

const respirationContent = {
  slug: "cellular-respiration",
  subject: "Biology",
  title: "Cellular Respiration & Mitochondrial ETC",
  description: "An interactive cellular bioenergetics simulation modeling the mitochondrial electron transport chain (Complexes I–IV), mobile electron shuttles, electrochemical proton motive force, rotary ATP Synthase catalysis, and metabolic poisons.",
  difficulty: "Intermediate" as const,
  estimatedTime: "25 minutes",
  heroDescription: "Journey inside the inner mitochondrial membrane. Trace high-energy electrons transferred from NADH and FADH₂ through complexes I, II, III, and IV to terminal oxygen (O₂), observe proton pumping creating an electrochemical gradient, and watch the rotary catalytic ATP Synthase turbine generate ATP.",
  theory: {
    content: `
      <p><strong>Cellular Respiration</strong> is the fundamental biochemical process by which aerobic cells catabolize organic nutrients (such as glucose, $C_6H_{12}O_6$) into carbon dioxide, water, and usable cellular energy in the form of <strong>Adenosine Triphosphate (ATP)</strong>:</p>
      <p style="text-align: center; font-weight: bold;">C_6H_{12}O_6 + 6 O_2 \\longrightarrow 6 CO_2 + 6 H_2O + 30\\text{--}32 \\text{ ATP}</p>
      <p>Following Glycolysis (cytosol) and the Citric Acid / Krebs Cycle (mitochondrial matrix), high-energy electron carriers (<strong>NADH</strong> and <strong>FADH₂</strong>) donate electron pairs to the <strong>Electron Transport Chain (ETC)</strong> embedded in the inner mitochondrial cristae membrane. As electrons cascade down a redox potential gradient across <strong>Complex I</strong> (NADH dehydrogenase), <strong>Ubiquinone (Q)</strong>, <strong>Complex III</strong> (cytochrome $bc_1$), <strong>Cytochrome c</strong>, and <strong>Complex IV</strong> (cytochrome c oxidase to reduce $\\frac{1}{2}O_2 + 2H^+ \\to H_2O$), the released free energy powers the active pumping of protons ($H^+$) from the matrix into the intermembrane space.</p>
      <p>According to Peter Mitchell's <strong>Chemiosmotic Hypothesis</strong>, this creates an electrochemical <strong>Proton Motive Force (PMF)</strong> combining a membrane electrical potential ($\\Delta \\Psi \\approx 160\\text{ mV}$) and a chemical pH gradient ($\\Delta \\text{pH} \\approx 0.75$). Protons spontaneously re-enter the matrix exclusively through the $F_0$ rotor channel of <strong>$F_0F_1$ ATP Synthase</strong>, driving mechanical rotation of the central $\\gamma$-stalk and conformational binding of $ADP + P_i \\to ATP$.</p>
    `
  },
  learningObjectives: [
    "Trace electron flow through ETC complexes (I, II, III, IV) to terminal oxygen and calculate total ATP yield.",
    "Explain Peter Mitchell's Chemiosmotic Hypothesis and calculate Proton Motive Force (Δp = ΔΨ - 59ΔpH).",
    "Describe the mechanical rotary turbine mechanism of F₀F₁ ATP Synthase.",
    "Predict the metabolic consequences of specific poisons: Rotenone (blocks I), Antimycin A (blocks III), Cyanide/CO (blocks IV), Oligomycin (blocks F₀), and DNP (uncoupler)."
  ],
  mathematicalFoundations: {
    equations: [
      "\\Delta p = \\Delta \\Psi - \\frac{2.303 RT}{F} \\Delta \\text{pH} \\approx \\Delta \\Psi - 59 \\, \\Delta \\text{pH} \\text{ (in mV @ 37°C)}",
      "\\Delta G^{\\circ\\prime} = -n F \\Delta E^{\\circ\\prime} \\text{ (Redox Free Energy)}",
      "\\text{NADH} + \\frac{1}{2}\\text{O}_2 + \\text{H}^+ \\longrightarrow \\text{NAD}^+ + \\text{H}_2\\text{O} \\quad (\\Delta E^{\\circ\\prime} = +1.14\\text{ V}, \\, \\Delta G^{\\circ\\prime} = -220\\text{ kJ/mol})",
      "\\frac{P}{O} \\text{ Ratio} \\approx 2.5 \\text{ (per NADH)}, \\quad 1.5 \\text{ (per FADH}_2\\text{)}"
    ],
    explanation: "Pumping 10 protons per NADH and 6 protons per FADH₂ through ATP Synthase (requiring ~4 H⁺ per ATP synthesized and exported) yields approximately 2.5 ATP per NADH and 1.5 ATP per FADH₂."
  },
  realWorldApplications: [
    "Mitochondrial Medicine: Diagnosing and developing treatments for mitochondrial encephalopathies (e.g. MELAS, Leigh syndrome).",
    "Thermogenesis in Brown Adipose Tissue: Natural uncoupling protein 1 (UCP-1 / thermogenin) dissipating proton gradients as heat for newborn and hibernating animal thermoregulation.",
    "Toxicology & Countermeasures: Understanding cyanide poisoning (blocking cytochrome oxidase) and administering hydroxycobalamin / sodium nitrite antidotes.",
    "Sports Physiology & Endurance Training: Mitochondrial biogenesis increasing aerobic oxidative phosphorylation capacity in elite endurance athletes."
  ],
  howItWorks: "Toggle between Aerobic (+O₂) and Hypoxic (No O₂) modes and adjust the glucose substrate influx rate. Observe real-time electron shuttling across Complexes I–IV, mobile Q lipid diffusion, and Cytochrome c transport. Watch the mechanical rotary turbine of ATP Synthase spin at 60 FPS as protons re-enter the matrix. Apply metabolic poisons (Rotenone, Antimycin A, Cyanide, Oligomycin, DNP) and monitor live changes in Proton Motive Force (mV), oxygen consumption rate, and ATP generation.",
  faqs: [
    {
      question: "Why does the chemical uncoupler DNP (2,4-dinitrophenol) cause extreme body temperature spikes?",
      answer: "DNP is a lipid-soluble proton ionophore that shuttles protons across the inner mitochondrial membrane, bypassing ATP Synthase and collapsing the proton gradient. Without a back-pressure proton gradient, electron transport runs at maximum speed, consuming oxygen and fuels uncontrollably. Because no ATP can be made, 100% of the metabolic energy is dissipated directly as thermal heat, causing lethal hyperthermia."
    },
    {
      question: "Why is cyanide rapidly fatal to aerobic organisms?",
      answer: "Cyanide (CN⁻) binds with extraordinarily high affinity to the ferric iron (Fe³⁺) in the heme a₃ group of Complex IV (cytochrome c oxidase), completely preventing electron transfer to terminal oxygen. This backs up the entire electron transport chain, halts proton pumping, collapses ATP production, and deprives vital organs (brain, heart) of cellular energy within minutes."
    },
    {
      question: "Why does FADH₂ generate fewer ATP molecules than NADH?",
      answer: "NADH enters the ETC at Complex I, which pumps 4 protons, and its electrons subsequently pass through Complexes III (4 protons) and IV (2 protons), totaling 10 protons pumped per electron pair. FADH₂ donates electrons to Complex II (succinate dehydrogenase), which does not pump protons; its electrons only pass through Complexes III and IV, totaling 6 protons pumped. Fewer pumped protons yield fewer ATP (~1.5 vs ~2.5 ATP)."
    }
  ],
  relatedExperiments: []
};

export default function CellularRespirationLandingPage() {
  return (
    <EducationalLandingLayout 
      content={respirationContent} 
      launchUrl="/labs/biology/cellular-respiration" 
    />
  );
}
