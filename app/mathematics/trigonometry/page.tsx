import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Trigonometry & Unit Circle Dynamics | OpenLabs",
  description: "Master trigonometry with our interactive unit circle and wave unfolding sandbox. Explore sine, cosine, tangent geometric projections, verify Pythagorean identities, and manipulate wave harmonics.",
  keywords: [
    "trigonometry visualizer",
    "unit circle simulator",
    "sine wave unfolding",
    "cosine geometric projection",
    "tangent line slope",
    "pythagorean identities verification",
    "trigonometric wave harmonics",
    "mathematics virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/trigonometry",
  },
  openGraph: {
    title: "Trigonometry & Unit Circle Dynamics | OpenLabs",
    description: "Explore unit circle geometry, dynamic sine/cosine wave unfolding, and Pythagorean trigonometric identities in real time.",
    url: "https://www.openlabs.org.in/mathematics/trigonometry",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/mathematics/trigonometry-hero.png",
        alt: "Trigonometry Visualizer Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trigonometry & Unit Circle Dynamics | OpenLabs",
    description: "Explore unit circle geometry, dynamic sine/cosine wave unfolding, and Pythagorean trigonometric identities in real time.",
    images: ["https://www.openlabs.org.in/images/mathematics/trigonometry-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TrigonometryLandingPage() {
  return (
    <STEMExperimentLanding
      subject="mathematics"
      slug="trigonometry"
      title="Trigonometry & Unit Circle Dynamics"
      description="Interactive trigonometry laboratory demonstrating unit circle coordinates (cos θ, sin θ), dynamic sinusoidal wave unfolding, and geometric Pythagorean identity proofs."
      heroDescription="Bridge right-triangle ratios (SOH-CAH-TOA), circular rotational kinematics, and continuous periodic sinusoidal waves. Drag the angle radial arm on the Unit Circle (r = 1) to observe real-time trigonometric projections."
      theory="Trigonometry extends right-triangle geometry to continuous periodic functions on the Cartesian plane via the Unit Circle (x² + y² = 1). For any angle θ measured counterclockwise from the positive x-axis, the coordinates of the terminal point on the circle are x = cos θ and y = sin θ, while the tangent is the slope of the radial line (tan θ = sin θ / cos θ). Projecting y(θ) continuously onto a moving time axis unfolds the fundamental sinusoidal wave."
      formula="\sin^2\theta + \cos^2\theta = 1 \quad \text{and} \quad e^{i\theta} = \cos\theta + i\sin\theta \quad \text{and} \quad \tan\theta = \frac{\sin\theta}{\cos\theta}"
      formulaLabel="Pythagorean Identity & Euler's Formula"
      launchUrl="/labs/mathematics/trigonometry"
      heroImageUrl="/images/mathematics/trigonometry-hero.png"
      visualLabel="Interactive Unit Circle & Wave Projector"
      visualDetail="Radians & Degrees Selector • Real-time (x, y) = (cos θ, sin θ) Coordinate HUD • Live Sine & Cosine Wave Unfolding"
      accent={{ primary: "#0284c7", secondary: "#f59e0b", warm: "#10b981" }}
      learningObjectives={[
        "Locate exact coordinates (cos θ, sin θ) on the Unit Circle for special angles (0°, 30°, 45°, 60°, 90°).",
        "Explain how the vertical y-projection of rotating circular motion generates a continuous sine wave.",
        "Verify fundamental trigonometric identities geometrically: sin²θ + cos²θ = 1 and 1 + tan²θ = sec²θ.",
        "Analyze the periodic amplitude, frequency, and phase shift parameters in y(t) = A · sin(ωt + φ).",
      ]}
      applications={[
        "Acoustic Audio Engineering & Musical Synthesizer Harmonic Synthesis.",
        "AC Electrical Engineering & Phasor Circuit Analysis (voltage and current phase angles).",
        "3D Computer Graphics, Video Game Shaders & Euler Rotation Matrices.",
        "Celestial Navigation, GPS Triangulation, and Geodetic Surveying.",
      ]}
      faqs={[
        {
          question: "Why does the Pythagorean identity sin²θ + cos²θ = 1 hold for all angles?",
          answer:
            "On a unit circle of radius r = 1, any angle θ defines a right triangle with adjacent side x = cos θ, opposite side y = sin θ, and hypotenuse r = 1. Applying the Pythagorean theorem (a² + b² = c²) gives (cos θ)² + (sin θ)² = 1².",
        },
        {
          question: "What is a radian and why is it preferred over degrees in higher mathematics?",
          answer:
            "One radian is the angle subtended at the center of a circle by an arc equal in length to the circle's radius (1 rad = 180°/π ≈ 57.3°). Radians are a dimensionless natural measure that allows simple calculus derivatives without conversion constants (d/dx [sin x] = cos x).",
        },
      ]}
    />
  );
}
