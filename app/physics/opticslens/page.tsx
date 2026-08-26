import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Geometric Optics, Thin Lens & Ray Tracing Studio | OpenLabs",
  description:
    "Interactive virtual optical bench simulator for convex and concave lenses, 3 principal ray paths (P-Ray, F-Ray, Chief Ray), Lensmaker's equation, and real vs virtual image formations.",
  keywords: [
    "optics lens simulator",
    "thin lens equation",
    "ray tracing simulation",
    "convex lens image formation",
    "concave diverging lens",
    "Lensmaker equation",
    "transverse magnification",
    "optical power diopters",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/opticslens",
  },
  openGraph: {
    title: "Geometric Optics, Thin Lens & Ray Tracing Studio | OpenLabs",
    description:
      "Explore thin lenses with real-time principal ray tracing, Lensmaker's formula, material refractive indices (Crown Glass, Flint Glass, Acrylic, Diamond), and live conjugate curve analysis.",
    url: "https://www.openlabs.org.in/physics/opticslens",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/physics/optics-lens-hero.png",
        alt: "Optics Lens & Ray Tracing Simulator | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Geometric Optics & Lens Ray Tracing Studio | OpenLabs",
    description:
      "Interactive thin lens laboratory: convex/concave lenses, 3 principal ray paths, real/virtual images, and Lensmaker's equation.",
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
      title="Geometric Optics & Lens Ray Tracing"
      description="Gaussian thin lens physics, 3-ray principal ray tracing, Lensmaker's equation, and real vs virtual image formations."
      heroDescription="Operate a virtual precision optical bench. Experiment with convex converging and concave diverging lenses, trace three color-coded principal rays (Parallel, Focal, and Chief rays), simulate real and virtual image formation, and calculate refractive power in diopters."
      theory="Geometric optics models light propagation as straight rays that refract at curved dielectric boundaries. The Gaussian thin-lens equation 1/f = 1/d_o + 1/d_i relates focal length f, object distance d_o, and image distance d_i. The transverse magnification M = -d_i / d_o determines image size and orientation. For a lens with radii of curvature R₁ and R₂ in a medium of refractive index n, focal length is governed by the Lensmaker's equation: 1/f = (n - 1)(1/R₁ - 1/R₂)."
      formula="1/f = 1/dₒ + 1/dᵢ  \quad \text{and} \quad M = -dᵢ / dₒ = hᵢ / hₒ"
      formulaLabel="Gaussian Thin Lens & Transverse Magnification Equations"
      launchUrl="/labs/physics/opticslens"
      heroImageUrl="/images/physics/optics-lens-hero.png"
      visualLabel="Optical Ray Tracer"
      visualDetail="Focal length f, object distance dₒ, principal rays, refractive index n"
      accent={{ primary: "#0284c7", secondary: "#10b981", warm: "#f59e0b" }}
      learningObjectives={[
        "Trace the 3 principal rays: Parallel Ray (through F₂), Focal Ray (through F₁), and Chief Ray (through optical center).",
        "Distinguish between Real images (formed by intersecting light rays, invertible on screen) and Virtual images (formed by backward-projected rays).",
        "Verify the 5 classic convex lens cases: beyond 2F, at 2F, between F and 2F, at F (infinity), and inside F (magnifying glass).",
        "Derive optical power in diopters (P = 1/f in meters) and calculate focal length from the Lensmaker's equation.",
        "Demonstrate why concave diverging lenses always produce virtual, erect, and diminished images regardless of object distance.",
      ]}
      applications={[
        "Camera lenses & compound photographic zoom objectives",
        "Ophthalmic corrective eyewear for myopia (nearsightedness) & hyperopia (farsightedness)",
        "Optical microscopes & astronomical refracting telescopes",
        "Digital cinema video projectors & slide enlargement optics",
        "Laser collimators & fiber optic coupling interfaces",
      ]}
      faqs={[
        {
          question: "What is the physical difference between a real image and a virtual image?",
          answer:
            "A real image is formed by actual physical light rays converging at a focal point; it is always inverted relative to the object and can be cast onto a projection screen or camera sensor. A virtual image occurs when light rays diverge after passing through the lens; human eyes perceive them as originating from a point behind the lens, producing an upright image that cannot be captured on a physical screen.",
        },
        {
          question: "What are the 3 principal rays used in geometric lens ray tracing?",
          answer:
            "1. Parallel Ray (P-Ray): Travels parallel to the principal axis, then refracts directly through the focal point F₂. 2. Focal Ray (F-Ray): Passes through the front focal point F₁, then refracts parallel to the principal axis. 3. Chief Ray (C-Ray): Passes straight through the optical center of the lens without undergoing angular deviation.",
        },
        {
          question: "How does the Lensmaker's Equation connect curvature and refractive index to focal length?",
          answer:
            "The Lensmaker's equation is 1/f = (n - 1)·(1/R₁ - 1/R₂), where n is the refractive index of the lens material and R₁, R₂ are the radii of curvature of the two lens surfaces. Higher refractive index materials (such as flint glass n = 1.66 or diamond n = 2.42) bend light more sharply, producing shorter focal lengths and higher optical power for the same surface curvature.",
        },
        {
          question: "What happens when an illuminated object is placed exactly at the focal point (d_o = f)?",
          answer:
            "When d_o = f, the denominator in Gaussian formula d_i = f·d_o / (d_o - f) becomes zero. All refracted rays emerge parallel to one another and never converge or diverge; the image is formed at infinity. This configuration is used in searchlights, lighthouses, and laser beam collimation.",
        },
      ]}
    />
  );
}
