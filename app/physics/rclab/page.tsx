import React from "react";
import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "RC Circuit Lab | Charging and Discharging Simulator | OpenLabs",
  description:
    "Interactive RC circuit simulator for capacitor charging, discharging, resistance, capacitance, voltage, and time constant.",
};

export default function RCLabPage() {
  return (
    <PhysicsExperimentLanding
      slug="rclab"
      title="RC Lab"
      description="RC circuit charging and discharging experiments."
      heroDescription="Explore how capacitors charge and discharge through resistors. Adjust circuit values and watch voltage change over time."
      theory="An RC circuit contains a resistor and capacitor. When connected to a source, the capacitor charges gradually; when discharged, its voltage falls exponentially."
      formula="tau = R C"
      formulaLabel="Time constant"
      launchUrl="/labs/physics/rclab"
      heroImageUrl="/images/physics/rc-lab-hero.png"
      visualLabel="Circuit model"
      visualDetail="Resistance, capacitance, voltage"
      accent={{ primary: "#475569", secondary: "#0ea5e9", warm: "#f97316" }}
      learningObjectives={[
        "Understand capacitor charging and discharging.",
        "Relate resistance and capacitance to time constant.",
        "Interpret voltage-time curves.",
        "Connect exponential behavior with circuit response.",
      ]}
      applications={[
        "Timing circuits",
        "Signal filtering",
        "Camera flash systems",
        "Power supply smoothing",
      ]}
      faqs={[
        {
          question: "What is an RC circuit?",
          answer:
            "An RC circuit combines a resistor and capacitor, producing time-dependent voltage changes.",
        },
        {
          question: "What is the time constant?",
          answer:
            "The time constant tau = R C sets how quickly the capacitor charges or discharges.",
        },
        {
          question: "Why is the curve exponential?",
          answer:
            "The charging or discharging rate depends on the remaining voltage difference, creating exponential behavior.",
        },
        {
          question: "What happens if capacitance increases?",
          answer:
            "Increasing capacitance increases the time constant, so voltage changes more slowly.",
        },
      ]}
    />
  );
}
