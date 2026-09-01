import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Reaction Simulator & Chemical Kinetics Virtual Lab | OpenLabs",
  description: "Simulate chemical reaction kinetics, Arrhenius activation energies, collision theory, stoichiometry, and chemical equilibrium online.",
  keywords: [
    "reaction simulation online",
    "chemical kinetics lab",
    "arrhenius equation calculator",
    "activation energy simulation",
    "collision theory chemistry",
    "equilibrium constant Kc",
    "stoichiometry simulator",
    "chemistry virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/chemistry/reaction-simulation",
  },
  openGraph: {
    title: "Reaction Simulator & Chemical Kinetics Virtual Lab | OpenLabs",
    description: "Run real-time chemical reaction simulations, Arrhenius energy barriers, collision rates, and equilibrium shifts.",
    url: "https://www.openlabs.org.in/chemistry/reaction-simulation",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/chemistry/reaction-simulation-hero.png",
        alt: "OpenLabs Reaction Simulation Chemistry Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reaction Simulator & Chemical Kinetics Virtual Lab | OpenLabs",
    description: "Run real-time chemical reaction simulations, Arrhenius energy barriers, collision rates, and equilibrium shifts.",
    images: ["https://www.openlabs.org.in/images/chemistry/reaction-simulation-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ReactionSimulationLandingPage() {
  return (
    <STEMExperimentLanding
      subject="chemistry"
      slug="reaction-simulation"
      title="Reaction Kinetics & Equilibrium"
      description="Interactive chemical reaction laboratory modeling collision theory, Arrhenius activation energy barriers, catalysts, and Le Chatelier's equilibrium shifts."
      heroDescription="Explore reaction kinetics and dynamic equilibrium in real time. Adjust reactant concentrations, thermal temperatures, and catalytic surfaces to observe molecular collision frequencies, transition states, and yield dynamics."
      theory="Chemical reactions proceed according to collision theory: reactant molecules must collide with sufficient kinetic energy exceeding the activation energy barrier (E_a) and in the proper stereochemical orientation. The temperature dependence of the rate constant is modeled by the Arrhenius equation (k = A e^(-E_a/RT)). In reversible systems, dynamic equilibrium is reached when forward and reverse reaction rates become equal, governed by the equilibrium constant K_c."
      formula="k = A e^{-\frac{E_a}{RT}} \quad \text{and} \quad \text{Rate} = k [A]^m [B]^n \quad \text{and} \quad K_c = \frac{[C]^c [D]^d}{[A]^a [B]^b}"
      formulaLabel="Arrhenius Rate Equation & Chemical Equilibrium Law"
      launchUrl="/labs/chemistry/reaction-simulation"
      heroImageUrl="/images/chemistry/reaction-simulation-hero.png"
      visualLabel="Molecular Collision & Reaction Coordinate Bench"
      visualDetail="Arrhenius Potential Energy Profile • Dynamic Yield Meter • Catalytic Energy Reduction"
      accent={{ primary: "#059669", secondary: "#0d9488", warm: "#d97706" }}
      learningObjectives={[
        "Determine reaction orders (m, n) and rate laws from initial concentration velocity data.",
        "Calculate activation energies (E_a) from Arrhenius plots of ln(k) versus 1/T.",
        "Visualize how homogeneous and heterogeneous catalysts lower activation barriers without altering ΔH.",
        "Predict equilibrium shifts in response to concentration, pressure, and temperature changes (Le Chatelier's principle).",
      ]}
      applications={[
        "Industrial Chemical Synthesis (Haber-Bosch ammonia process optimization).",
        "Automotive Catalytic Converters (platinum/rhodium reduction of NOₓ and CO).",
        "Pharmacokinetics & Drug Shelf-Life Accelerated Degradation Testing.",
        "Combustion Engineering & Rocket Propellant Kinetics.",
      ]}
      faqs={[
        {
          question: "How does a catalyst increase reaction rate?",
          answer:
            "A catalyst provides an alternative reaction pathway with a lower activation energy barrier (E_a). Because the exponential term e^(-E_a/RT) in the Arrhenius equation becomes significantly larger, a greater fraction of colliding molecules possess sufficient energy to react, increasing the reaction rate without consuming the catalyst.",
        },
        {
          question: "What is the difference between reaction rate and equilibrium constant (K_c)?",
          answer:
            "Reaction rate describes how fast reactants are converted into products (kinetics). The equilibrium constant K_c describes the relative ratio of products to reactants when forward and reverse rates are balanced at equilibrium (thermodynamics). A catalyst increases the rate but does not change K_c.",
        },
        {
          question: "How does temperature affect chemical equilibrium?",
          answer:
            "According to Le Chatelier's principle, increasing temperature favors the endothermic direction (which absorbs excess heat), increasing its K_c. For an exothermic reaction (heat producing), increasing temperature shifts the equilibrium toward reactants, decreasing K_c.",
        },
      ]}
    />
  );
}
