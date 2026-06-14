import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Optics Lens Simulator | Image Formation Physics Lab | OpenLabs",
  description:
    "Interactive optics lens simulator for exploring focal length, object distance, image distance, magnification, and ray diagrams.",
  keywords: [
    "optics lens",
    "lens simulator",
    "image formation",
    "thin lens equation",
    "physics lab",
    "ray diagrams"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/opticslens",
  },
  openGraph: {
    title: "Optics Lens Simulator | Image Formation Physics Lab | OpenLabs",
    description:
      "Interactive optics lens simulator for exploring focal length, object distance, image distance, magnification, and ray diagrams.",
    url: "https://www.openlabs.org.in/physics/opticslens",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/physics/optics-lens-hero.png",
        alt: "Optics Lens Simulator | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Optics Lens Simulator | Image Formation Physics Lab | OpenLabs",
    description:
      "Interactive optics lens simulator for exploring focal length, object distance, image distance, magnification, and ray diagrams.",
    images: ["https://www.openlabs.org.in/images/physics/optics-lens-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function OpticsLensPage() {
  return (
    <PhysicsExperimentLanding
      slug="opticslens"
      title="Optics Lens"
      description="Explore optical lens behavior and image formation."
      heroDescription="Use a virtual lens bench to see how object distance and focal length determine image position, size, and orientation."
      theory="Lens optics studies how curved transparent surfaces bend light. Ray diagrams and the lens equation help predict where images form and whether they are magnified or inverted."
      formula="1/f = 1/do + 1/di"
      formulaLabel="Thin lens equation"
      launchUrl="/labs/physics/opticslens"
      heroImageUrl="/images/physics/optics-lens-hero.png"
      visualLabel="Lens model"
      visualDetail="Focal length, image distance, magnification"
      accent={{ primary: "#0891b2", secondary: "#2563eb", warm: "#eab308" }}
      learningObjectives={[
        "Trace how rays form images through a lens.",
        "Relate focal length to image distance.",
        "Explore magnification and image orientation.",
        "Connect lens equations with ray diagrams.",
      ]}
      applications={[
        "Cameras and projectors",
        "Eyeglasses and vision correction",
        "Microscopes and telescopes",
        "Optical instrument design",
      ]}
      faqs={[
        {
          question: "What does a lens do?",
          answer:
            "A lens bends light through refraction, causing rays to converge or diverge and form images.",
        },
        {
          question: "What is focal length?",
          answer:
            "Focal length is the distance from the lens to the focal point where parallel rays meet or appear to spread from.",
        },
        {
          question: "What is magnification?",
          answer:
            "Magnification describes how large the image is compared with the object.",
        },
        {
          question: "Why use ray diagrams?",
          answer:
            "Ray diagrams provide a visual method for predicting image position, size, and orientation.",
        },
      ]}
    />
  );
}
