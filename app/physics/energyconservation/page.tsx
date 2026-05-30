import React from "react";
import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Energy Conservation Simulator | Interactive Physics Lab | OpenLabs",
  description:
    "Investigate energy transformation and conservation with an interactive browser-based physics simulation.",
};

export default function EnergyConservationPage() {
  return (
    <PhysicsExperimentLanding
      slug="energyconservation"
      title="Energy Conservation"
      description="Investigate energy transformation and conservation."
      heroDescription="Track how energy changes form while the total stays consistent in an ideal system. Use the lab to connect motion with energy accounting."
      theory="The law of conservation of energy says that energy cannot be created or destroyed, only transformed from one form to another. In mechanics, kinetic and potential energy often trade places during motion."
      formula="E = KE + PE"
      formulaLabel="Total mechanical energy"
      launchUrl="/labs/physics/energyconservation"
      heroImageUrl="/images/physics/energy-conservation-hero.png"
      visualLabel="Energy model"
      visualDetail="Kinetic, potential, total energy"
      accent={{ primary: "#16a34a", secondary: "#0f766e", warm: "#f59e0b" }}
      learningObjectives={[
        "Identify kinetic and potential energy changes.",
        "Observe how total energy behaves in an ideal system.",
        "Connect height, speed, and energy transformation.",
        "Recognize where losses appear in real systems.",
      ]}
      applications={[
        "Roller coaster design",
        "Mechanical system analysis",
        "Renewable energy demonstrations",
        "Sports and motion studies",
      ]}
      faqs={[
        {
          question: "What is conserved in energy conservation?",
          answer:
            "The total energy of an isolated system is conserved, even as energy changes form.",
        },
        {
          question: "What is kinetic energy?",
          answer:
            "Kinetic energy is energy of motion. It increases as speed increases.",
        },
        {
          question: "What is potential energy?",
          answer:
            "Potential energy is stored energy due to position, height, or configuration.",
        },
        {
          question: "Why can real systems lose mechanical energy?",
          answer:
            "Friction and air resistance convert some mechanical energy into heat, sound, or deformation.",
        },
      ]}
    />
  );
}
