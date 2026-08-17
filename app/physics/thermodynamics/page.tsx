// app/physics/thermodynamics/page.tsx
import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";
import { createLabMetadata } from "@/app/lib/seo/metadata";

const PAGE_TITLE = "Thermodynamic Heat Engines & Carnot Cycle Simulator";
const PAGE_DESCRIPTION = "Explore Carnot, Otto, and Diesel engine cycles, P-V and T-S indicator diagrams, mechanical flywheel crankshafts, and thermodynamic efficiency limits online.";

export const metadata: Metadata = createLabMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  pathname: "/physics/thermodynamics",
  subject: "physics",
  topic: "Thermodynamic Heat Engines & Carnot Cycle",
  keywords: [
    "carnot cycle simulation",
    "thermodynamic heat engines lab",
    "pv diagram indicator loop",
    "thermal efficiency calculator",
    "otto cycle diesel cycle simulator",
    "entropy ts diagram thermodynamics",
    "physics virtual lab"
  ],
});

const FAQS = [
  {
    question: "What is a Carnot heat engine and why is its efficiency the theoretical maximum?",
    answer: "A Carnot engine operates on an idealized, fully reversible four-stage thermodynamic cycle (two isothermals and two adiabatics). Because all heat transfers occur reversibly without generating universe entropy, its efficiency (η = 1 - TC/TH) sets the strict upper bound for any heat engine operating between two thermal reservoirs.",
  },
  {
    question: "How is net work calculated from a Pressure-Volume (P-V) diagram?",
    answer: "The net mechanical work output per engine cycle equals the enclosed surface area within the cyclic curve on a P-V indicator diagram: W_net = ∮ P dV.",
  },
  {
    question: "What is the difference between Otto and Diesel cycles?",
    answer: "The Otto cycle (automotive gasoline engines) introduces heat at constant volume (isochoric combustion) using a spark plug. The Diesel cycle compresses air until it reaches autoignition temperature, introducing heat at constant pressure (isobaric combustion).",
  },
  {
    question: "Why does the Carnot cycle appear as a rectangle on a Temperature-Entropy (T-S) diagram?",
    answer: "Isothermal processes occur at constant temperature (horizontal lines), while reversible adiabatic processes have zero heat exchange (dQ = 0) and therefore constant entropy (dS = 0, vertical lines). The four processes together form a clean rectangle on T-S coordinates.",
  },
];

export default function ThermodynamicsPage() {
  return (
    <PhysicsExperimentLanding
      slug="thermodynamics"
      title="Thermodynamic Heat Engines"
      description="Explore Carnot, Otto, and Diesel engine cycles, P-V and T-S indicator diagrams, and thermodynamic efficiency limits."
      heroDescription="Operate virtual heat engines across Carnot, Otto, and Diesel cycles. Adjust hot and cold reservoir temperatures, observe real-time piston-crankshaft rotation, and trace closed P-V indicator loops to calculate net work output and thermal efficiency."
      theory="Heat engines convert thermal energy from a high-temperature reservoir into mechanical work, rejecting waste heat to a cold reservoir. The Second Law of Thermodynamics dictates that theoretical maximum efficiency is governed by the Carnot limit."
      formula="\\eta_{\\text{Carnot}} = 1 - \\frac{T_C}{T_H}"
      formulaLabel="Carnot thermal efficiency limit"
      launchUrl="/labs/physics/thermodynamics"
      heroImageUrl="/images/physics/thermodynamics-hero.png"
      visualLabel="Thermodynamic engine cylinder"
      visualDetail="P-V indicator loop, T-S entropy plot, flywheel RPM"
      accent={{ primary: "#f97316", secondary: "#ea580c", warm: "#eab308" }}
      learningObjectives={[
        "Calculate net work output (W_net = ∮ P dV) from the enclosed area of P-V indicator loops.",
        "Derive and calculate Carnot efficiency (η = 1 - TC/TH) using absolute Kelvin temperatures.",
        "Compare spark-ignition Otto cycles and compression-ignition Diesel cycles against the ideal Carnot limit.",
        "Interpret Temperature-Entropy (T-S) diagrams and evaluate isentropic adiabatic expansions.",
      ]}
      applications={[
        "Automotive internal combustion engines (Otto and Diesel cycles)",
        "Aviation jet propulsion gas turbines (Brayton cycle)",
        "Nuclear and geothermal steam turbine electricity generation (Rankine cycle)",
        "Cryogenic refrigeration systems and industrial heat pumps",
      ]}
      faqs={FAQS}
    />
  );
}
