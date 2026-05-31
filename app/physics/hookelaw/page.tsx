import React from "react";
import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Hooke's Law Simulator | Mass Spring Physics Lab | OpenLabs",
  description:
    "Interactive Hooke's Law simulator for exploring spring force, stiffness, mass, displacement, oscillation, and period.",
};

export default function HookesLawPage() {
  return (
    <PhysicsExperimentLanding
      slug="hookelaw"
      title="Hooke's Law"
      description="Mass-spring system: observe oscillations and measure period."
      heroDescription="Investigate how springs respond to force. Adjust the mass, stiffness, damping, and displacement to see elastic behavior and oscillation in real time."
      theory="Hooke's Law states that the restoring force of an ideal spring is proportional to its displacement from equilibrium. The negative sign shows that the force acts opposite the stretch or compression."
      formula="F = -kx"
      formulaLabel="Spring force"
      launchUrl="/labs/physics/hookelaw"
      heroImageUrl="/images/physics/hookes-law-hero.png"
      visualLabel="Spring model"
      visualDetail="Mass, stiffness, damping, period"
      accent={{ primary: "#0f766e", secondary: "#16a34a", warm: "#ea580c" }}
      learningObjectives={[
        "Understand the relationship between force and displacement.",
        "Observe how spring constant affects motion.",
        "Compare mass-spring period with simulated oscillation.",
        "Explore damping and energy loss in a spring system.",
      ]}
      applications={[
        "Vehicle suspension systems",
        "Mechanical vibration analysis",
        "Force sensors and spring scales",
        "Engineering material testing",
      ]}
      faqs={[
        {
          question: "What does Hooke's Law explain?",
          answer:
            "It explains how an ideal spring pushes or pulls back with a force proportional to displacement from equilibrium.",
        },
        {
          question: "What is the spring constant?",
          answer:
            "The spring constant k measures stiffness. A larger k means more force is needed for the same stretch.",
        },
        {
          question: "What happens when mass increases?",
          answer:
            "Increasing mass usually makes the oscillation slower, increasing the period of the mass-spring system.",
        },
        {
          question: "Why include damping?",
          answer:
            "Damping models friction or resistance that removes energy and reduces oscillation amplitude over time.",
        },
      ]}
    />
  );
}
