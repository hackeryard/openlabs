import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Free Fall Simulator | Gravity Physics Lab | OpenLabs",
  description:
    "Interactive free fall simulator for exploring gravity, acceleration, velocity, height, and time in browser.",
  keywords: [
    "free fall",
    "gravity simulator",
    "acceleration",
    "physics lab",
    "motion analysis",
    "interactive simulation"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/freefall",
  },
  openGraph: {
    title: "Free Fall Simulator | Gravity Physics Lab | OpenLabs",
    description:
      "Interactive free fall simulator for exploring gravity, acceleration, velocity, height, and time in browser.",
    url: "https://www.openlabs.org.in/physics/freefall",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/physics/free-fall-hero.png",
        alt: "Free Fall Physics Simulator | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Fall Simulator | Gravity Physics Lab | OpenLabs",
    description:
      "Interactive free fall simulator for exploring gravity, acceleration, velocity, height, and time in browser.",
    images: ["https://www.openlabs.org.in/images/physics/free-fall-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FreeFallPage() {
  return (
    <PhysicsExperimentLanding
      slug="freefall"
      title="Free Fall"
      description="Free fall demonstration of an object."
      heroDescription="Explore vertical motion under gravity. Drop an object, measure how velocity changes with time, and connect the motion with constant acceleration."
      theory="Free fall is motion under the influence of gravity alone. In the ideal model, all objects near Earth's surface accelerate downward at the same rate when air resistance is ignored."
      formula="y = y0 + v0 t - 1/2 g t^2"
      formulaLabel="Vertical position"
      launchUrl="/labs/physics/freefall"
      heroImageUrl="/images/physics/free-fall-hero.png"
      visualLabel="Gravity model"
      visualDetail="Height, time, velocity, acceleration"
      accent={{ primary: "#0284c7", secondary: "#0f766e", warm: "#f97316" }}
      learningObjectives={[
        "Understand constant acceleration due to gravity.",
        "Measure velocity changes during a fall.",
        "Relate height, time, and acceleration.",
        "Compare ideal free fall with real-world effects.",
      ]}
      applications={[
        "Drop tests and safety analysis",
        "Sports motion studies",
        "Elevator and ride physics",
        "Introductory mechanics labs",
      ]}
      faqs={[
        {
          question: "What is free fall?",
          answer:
            "Free fall is motion where gravity is the only significant force acting on an object.",
        },
        {
          question: "Do heavier objects fall faster?",
          answer:
            "Ignoring air resistance, all objects fall with the same acceleration regardless of mass.",
        },
        {
          question: "What is g near Earth?",
          answer:
            "Near Earth's surface, gravitational acceleration is about 9.81 m/s^2 downward.",
        },
        {
          question: "Why does air resistance matter?",
          answer:
            "Air resistance opposes motion and can reduce acceleration, especially for light or broad objects.",
        },
      ]}
    />
  );
}
