import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Simple Pendulum Simulator Online | Interactive Physics Lab | OpenLabs",
  description:
    "Interactive simple pendulum simulator with length, gravity, damping, period, and angle controls for browser-based physics learning.",
  keywords: [
    "simple pendulum",
    "pendulum simulator",
    "harmonic motion",
    "physics lab",
    "period formula",
    "interactive physics"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/simplependulum",
  },
  openGraph: {
    title: "Simple Pendulum Simulator Online | Interactive Physics Lab | OpenLabs",
    description:
      "Interactive simple pendulum simulator with length, gravity, damping, period, and angle controls for browser-based physics learning.",
    url: "https://www.openlabs.org.in/physics/simplependulum",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/physics/simple-pendulum-hero-v2.png",
        alt: "Simple Pendulum Simulator | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Simple Pendulum Simulator Online | Interactive Physics Lab | OpenLabs",
    description:
      "Interactive simple pendulum simulator with length, gravity, damping, period, and angle controls for browser-based physics learning.",
    images: ["https://www.openlabs.org.in/images/physics/simple-pendulum-hero-v2.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SimplePendulumPage() {
  return (
    <PhysicsExperimentLanding
      slug="simplependulum"
      title="Simple Pendulum"
      description="Simulate pendulum motion and compare theory vs measured period."
      heroDescription="Study pendulum motion with a focused browser lab. Change the setup, observe the swing, and compare the result with the standard period relationship used in physics."
      theory="A simple pendulum is a bob suspended from a fixed point by a light string or rod. When it is displaced and released, gravity pulls it back toward equilibrium, creating repeated oscillation. The simulator lets you experiment with that motion instead of only reading the formula."
      formula="T = 2pi sqrt(L / g)"
      launchUrl="/labs/physics/simplependulum"
      heroImageUrl="/images/physics/simple-pendulum-hero-v2.png"
      visualLabel="Pendulum motion"
      visualDetail="Length, gravity, damping, period"
      accent={{ primary: "#2f7d6d", secondary: "#1491a6", warm: "#d86f45" }}
      learningObjectives={[
        "Explore how length changes the time period of a pendulum.",
        "Compare theoretical period with observed simulation behavior.",
        "See how gravity and damping affect oscillation in real time.",
        "Connect pendulum motion with simple harmonic motion concepts.",
      ]}
      applications={[
        "Clock mechanisms and timing systems",
        "Seismology demonstrations",
        "Engineering vibration models",
        "Classroom physics experiments",
      ]}
      faqs={[
        {
          question: "What does a simple pendulum simulator show?",
          answer:
            "It shows how a pendulum swings under gravity and how length, gravitational acceleration, damping, and starting angle change the motion.",
        },
        {
          question: "Which formula is used for pendulum period?",
          answer:
            "For small angles, the period is commonly estimated with T = 2pi sqrt(L / g), where L is length and g is gravitational acceleration.",
        },
        {
          question: "Does the bob mass affect the period?",
          answer:
            "In the ideal simple pendulum model, bob mass does not affect the period. Length and gravity are the main factors.",
        },
        {
          question: "Why does damping matter?",
          answer:
            "Damping represents energy loss from air resistance or friction. More damping makes the swing amplitude decrease faster over time.",
        },
      ]}
    />
  );
}
