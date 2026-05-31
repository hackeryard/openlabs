import React from "react";
import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Uniform Motion Lab | Distance Time Physics Simulator | OpenLabs",
  description:
    "Interactive uniform motion simulator for exploring constant velocity, displacement, time, and distance-time graphs.",
};

export default function UniformMotionLabPage() {
  return (
    <PhysicsExperimentLanding
      slug="uniformmotionlab"
      title="Uniform Motion"
      description="Uniform linear motion using a moving object."
      heroDescription="Explore constant velocity motion with a simple moving-object lab. Adjust values, observe position over time, and connect the result with distance-time graphs."
      theory="Uniform motion occurs when an object travels equal distances in equal time intervals. Its velocity remains constant, so the distance-time graph is a straight line."
      formula="s = v t"
      formulaLabel="Uniform motion"
      launchUrl="/labs/physics/uniformmotionlab"
      heroImageUrl="/images/physics/uniform-motion-hero.png"
      visualLabel="Motion model"
      visualDetail="Distance, time, velocity"
      accent={{ primary: "#2563eb", secondary: "#0f766e", warm: "#f59e0b" }}
      learningObjectives={[
        "Understand constant velocity motion.",
        "Relate distance, speed, and time.",
        "Interpret distance-time graph slope.",
        "Predict position at any time for uniform motion.",
      ]}
      applications={[
        "Vehicle speed analysis",
        "Robotics motion planning",
        "Conveyor belt systems",
        "Introductory kinematics lessons",
      ]}
      faqs={[
        {
          question: "What is uniform motion?",
          answer:
            "Uniform motion means an object moves at constant velocity, covering equal distances in equal time intervals.",
        },
        {
          question: "What does a distance-time graph show?",
          answer:
            "It shows how position changes with time. For uniform motion, the graph is a straight line.",
        },
        {
          question: "What does the slope represent?",
          answer:
            "The slope of a distance-time graph represents velocity.",
        },
        {
          question: "Can acceleration be present?",
          answer:
            "For ideal uniform motion, acceleration is zero because velocity does not change.",
        },
      ]}
    />
  );
}
