import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Ohm's Law Simulator | Voltage Current Resistance Lab | OpenLabs",
  description:
    "Explore Ohm's Law with an interactive circuit simulator for voltage, current, resistance, and V-I behavior.",
  keywords: [
    "ohm's law",
    "circuit simulator",
    "voltage current resistance",
    "physics lab",
    "electrical circuits",
    "v-i relationship"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/ohmslaw",
  },
  openGraph: {
    title: "Ohm's Law Simulator | Voltage Current Resistance Lab | OpenLabs",
    description:
      "Explore Ohm's Law with an interactive circuit simulator for voltage, current, resistance, and V-I behavior.",
    url: "https://www.openlabs.org.in/physics/ohmslaw",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/physics/ohms-law-hero.png",
        alt: "Ohm's Law Simulator | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ohm's Law Simulator | Voltage Current Resistance Lab | OpenLabs",
    description:
      "Explore Ohm's Law with an interactive circuit simulator for voltage, current, resistance, and V-I behavior.",
    images: ["https://www.openlabs.org.in/images/physics/ohms-law-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function OhmsLawPage() {
  return (
    <PhysicsExperimentLanding
      slug="ohmslaw"
      title="Ohm's Law"
      description="Explore V-I behavior with virtual instruments."
      heroDescription="Build intuition for circuits by changing voltage and resistance, then observing how current responds through virtual instruments."
      theory="Ohm's Law describes the relationship between voltage, current, and resistance in an ideal conductor. If resistance stays constant, current changes directly with voltage."
      formula="V = I R"
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
      faqs={[
        {
          question: "What does Ohm's Law state?",
          answer:
            "Ohm's Law states that voltage equals current multiplied by resistance: V = I R.",
        },
        {
          question: "What happens if resistance increases?",
          answer:
            "For the same voltage, increasing resistance reduces current.",
        },
        {
          question: "Is Ohm's Law always valid?",
          answer:
            "It works well for ohmic materials with constant resistance, but not all devices have linear V-I behavior.",
        },
        {
          question: "Why use virtual instruments?",
          answer:
            "Virtual meters make it easier to observe current and voltage changes safely while experimenting.",
        },
      ]}
    />
  );
}
