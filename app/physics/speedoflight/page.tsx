import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Speed of Light Lab | Interactive Physics Simulator | OpenLabs",
  description:
    "Interactive speed of light lab for exploring light propagation, media, refractive index, and measurement concepts.",
  keywords: [
    "speed of light",
    "optical physics",
    "refractive index",
    "light propagation",
    "physics lab",
    "interactive simulation"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/speedoflight",
  },
  openGraph: {
    title: "Speed of Light Lab | Interactive Physics Simulator | OpenLabs",
    description:
      "Interactive speed of light lab for exploring light propagation, media, refractive index, and measurement concepts.",
    url: "https://www.openlabs.org.in/physics/speedoflight",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/physics/speed-of-light-hero.png",
        alt: "Speed of Light Physics Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Speed of Light Lab | Interactive Physics Simulator | OpenLabs",
    description:
      "Interactive speed of light lab for exploring light propagation, media, refractive index, and measurement concepts.",
    images: ["https://www.openlabs.org.in/images/physics/speed-of-light-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SpeedOfLightPage() {
  return (
    <PhysicsExperimentLanding
      slug="speedoflight"
      title="Speed of Light"
      description="Demonstration of speed of light in different media."
      heroDescription="Explore how light travels and why its speed changes in different materials. Use the simulation to connect propagation speed with refractive index."
      theory="Light travels fastest in a vacuum and slows down in materials such as water or glass. The refractive index describes how much a medium reduces light speed."
      formula="v = c / n"
      formulaLabel="Speed in a medium"
      launchUrl="/labs/physics/speedoflight"
      heroImageUrl="/images/physics/speed-of-light-hero.png"
      visualLabel="Light model"
      visualDetail="Medium, index, speed"
      accent={{ primary: "#eab308", secondary: "#f97316", warm: "#0ea5e9" }}
      learningObjectives={[
        "Compare light speed in different media.",
        "Relate refractive index to propagation speed.",
        "Understand why light bends at boundaries.",
        "Connect measurement concepts with optical physics.",
      ]}
      applications={[
        "Fiber optic communication",
        "Lens and prism design",
        "Astronomy measurements",
        "Optical sensor systems",
      ]}
      faqs={[
        {
          question: "What is the speed of light in vacuum?",
          answer:
            "The speed of light in vacuum is approximately 299,792,458 meters per second.",
        },
        {
          question: "Does light slow down in glass?",
          answer:
            "Yes. Light travels slower in glass than in vacuum because glass has a refractive index greater than one.",
        },
        {
          question: "What is refractive index?",
          answer:
            "Refractive index compares light speed in vacuum with light speed in a material.",
        },
        {
          question: "Why does light bend?",
          answer:
            "Light bends when it changes speed while crossing between materials with different refractive indices.",
        },
      ]}
    />
  );
}
