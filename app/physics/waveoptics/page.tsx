import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Wave Optics Simulator | Diffraction Lab | OpenLabs",
  description:
    "Interactive wave optics simulator for exploring diffraction, interference, wavelength, slit spacing, and intensity patterns.",
  keywords: [
    "wave optics",
    "diffraction simulator",
    "interference patterns",
    "optics lab",
    "wavelength",
    "physics simulation"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/waveoptics",
  },
  openGraph: {
    title: "Wave Optics Simulator | Diffraction and Interference Lab | OpenLabs",
    description:
      "Interactive wave optics simulator for exploring diffraction, interference, wavelength, slit spacing, and intensity patterns.",
    url: "https://www.openlabs.org.in/physics/waveoptics",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/physics/wave-optics-hero.png",
        alt: "Wave Optics Simulator | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wave Optics Simulator | Diffraction and Interference Lab | OpenLabs",
    description:
      "Interactive wave optics simulator for exploring diffraction, interference, wavelength, slit spacing, and intensity patterns.",
    images: ["https://www.openlabs.org.in/images/physics/wave-optics-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function WaveOpticsPage() {
  return (
    <PhysicsExperimentLanding
      slug="waveoptics"
      title="Wave Optics"
      description="Diffraction and interference lab for wave behavior."
      heroDescription="Study how light behaves as a wave. Adjust wavelength and aperture settings to observe interference, diffraction, and changing intensity patterns."
      theory="Wave optics explains light behavior using wave principles. Interference occurs when waves combine, while diffraction describes spreading around openings or edges."
      formula="d sin(theta) = m lambda"
      formulaLabel="Interference condition"
      launchUrl="/labs/physics/waveoptics"
      heroImageUrl="/images/physics/wave-optics-hero.png"
      visualLabel="Wave model"
      visualDetail="Wavelength, slits, intensity"
      accent={{ primary: "#7c3aed", secondary: "#0891b2", warm: "#f59e0b" }}
      learningObjectives={[
        "Observe interference and diffraction patterns.",
        "Relate wavelength to fringe spacing.",
        "Explore how slit width and spacing affect intensity.",
        "Connect wave equations with visual patterns.",
      ]}
      applications={[
        "Optical instruments",
        "Spectroscopy",
        "Laser experiments",
        "Microscopy and imaging",
      ]}
      faqs={[
        {
          question: "What is interference?",
          answer:
            "Interference happens when waves overlap and combine to create brighter or darker regions.",
        },
        {
          question: "What is diffraction?",
          answer:
            "Diffraction is the spreading of waves when they pass through a narrow opening or around an obstacle.",
        },
        {
          question: "How does wavelength affect fringes?",
          answer:
            "Longer wavelengths generally produce wider fringe spacing in an interference pattern.",
        },
        {
          question: "Why does intensity vary?",
          answer:
            "Intensity changes because waves add constructively in some places and destructively in others.",
        },
      ]}
    />
  );
}
