// app/physics/ohmslaw/page.tsx
import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";
import { createLabMetadata } from "@/app/lib/seo/metadata";

const PAGE_TITLE = "Ohm's Law Simulator & DC Circuit Analysis";
const PAGE_DESCRIPTION = "Explore Ohm's Law (V = I * R) with an interactive virtual circuit simulator for voltage, current, resistance, and V-I behavior.";

export const metadata: Metadata = createLabMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  pathname: "/physics/ohmslaw",
  subject: "physics",
  topic: "Ohm's Law",
  keywords: ["ohm's law", "circuit simulator", "voltage current resistance", "dc circuits"],
});

const FAQS = [
  {
    question: "What does Ohm's Law state?",
    answer: "Ohm's Law states that voltage (V) equals current (I) multiplied by resistance (R): V = I * R.",
  },
  {
    question: "What happens if resistance increases?",
    answer: "For a constant voltage, increasing resistance reduces current proportionally.",
  },
  {
    question: "Is Ohm's Law valid for all materials?",
    answer: "It applies to ohmic conductors at constant temperature, but non-ohmic devices (like diodes) have non-linear V-I characteristics.",
  },
];

export default function OhmsLawPage() {
  return (
    <PhysicsExperimentLanding
      slug="ohmslaw"
      title="Ohm's Law"
      description="Explore V-I behavior with virtual instruments."
      heroDescription="Build intuition for circuits by changing voltage and resistance, then observing how current responds through virtual instruments."
      theory="Ohm's Law describes the relationship between voltage, current, and resistance in an ideal conductor. If resistance stays constant, current changes directly with voltage."
      formula="V = I * R"
      formulaLabel="Circuit relationship"
      launchUrl="/labs/physics/ohmslaw"
      heroImageUrl="/images/physics/ohms-law-hero.png"
      visualLabel="Circuit model"
      visualDetail="Voltage, current, resistance"
      accent={{ primary: "#0ea5e9", secondary: "#2563eb", warm: "#f59e0b" }}
      learningObjectives={[
        "Relate voltage, current, and resistance.",
        "Interpret V-I behavior from virtual readings.",
        "Predict current when voltage or resistance changes.",
        "Connect circuit equations with instrument measurements.",
      ]}
      applications={[
        "Basic circuit design",
        "Electronics troubleshooting",
        "Power supply testing",
        "Sensor and resistor networks",
      ]}
      faqs={FAQS}
    />
  );
}
