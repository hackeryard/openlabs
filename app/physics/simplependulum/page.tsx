import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Simple Pendulum & Harmonic Motion Simulator | Physics Lab | OpenLabs",
  description:
    "Interactive simple pendulum and harmonic oscillation simulator. Explore small-angle approximations, large-angle non-linearity, phase-space portraits, and planetary gravitation.",
  keywords: [
    "simple pendulum simulator",
    "harmonic motion lab",
    "pendulum period formula",
    "large angle pendulum non-linearity",
    "phase space portrait pendulum",
    "damping oscillation physics",
    "photogate timer simulation",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/simplependulum",
  },
  openGraph: {
    title: "Simple Pendulum & Harmonic Motion Simulator | Physics Lab | OpenLabs",
    description:
      "Interactive simple pendulum and harmonic oscillation simulator. Explore small-angle approximations, large-angle non-linearity, phase-space portraits, and planetary gravitation.",
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
    title: "Simple Pendulum & Harmonic Motion Simulator | Physics Lab | OpenLabs",
    description:
      "Interactive simple pendulum and harmonic oscillation simulator. Explore small-angle approximations, large-angle non-linearity, and planetary gravitation.",
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
      title="Simple Pendulum & Harmonic Motion"
      description="Simulate pendulum oscillations, large-angle non-linearity, phase portraits, and energy balance."
      heroDescription="Explore harmonic motion and large-angle pendulum physics. Adjust string length, bob mass, release angle, and air damping to visualize phase-space trajectories and measure exact oscillation periods."
      theory="A simple pendulum consists of a point mass m suspended on a massless string of length L. The exact non-linear equation of motion is d²θ/dt² = -(g/L) sin θ - γ(dθ/dt). For small angles (θ ≤ 15°), sin θ ≈ θ yields Simple Harmonic Motion with period T0 = 2π√(L/g). For larger angles, exact elliptic integrals demonstrate period elongation T ≈ T0(1 + ¼sin²(θ0/2))."
      formula="T_0 = 2\pi\sqrt{\frac{L}{g}} \quad \text{and} \quad T \approx T_0\left(1 + \frac{1}{4}\sin^2\frac{\theta_0}{2}\right)"
      formulaLabel="Small-Angle Approximation & Large-Angle Correction"
      launchUrl="/labs/physics/simplependulum"
      heroImageUrl="/images/physics/simple-pendulum-hero-v2.png"
      visualLabel="Runge-Kutta RK4 Non-Linear Oscillator"
      visualDetail="Phase-Space (ω vs θ) • Photogate Laser Sensor • Energy Conservation"
      accent={{ primary: "#0284c7", secondary: "#0d9488", warm: "#f59e0b" }}
      learningObjectives={[
        "Verify Galileo's law of isochronism and demonstrate that period T depends strictly on length L and gravity g, not bob mass m.",
        "Compare small-angle linear Simple Harmonic Motion (sin θ ≈ θ) with exact non-linear large-angle oscillations.",
        "Observe continuous interchange between gravitational potential energy (Ep = mgL(1 - cos θ)) and kinetic energy (Ek = ½mL²ω²).",
        "Analyze phase-space portraits (angular velocity ω vs displacement θ) to visualize limit cycles and exponential damping decay spirals.",
        "Measure exact periods using a virtual photogate laser sensor at the equilibrium position (θ = 0°).",
      ]}
      applications={[
        "Mechanical pendulum clock escapements (Christiaan Huygens)",
        "Foucault pendulum proving Earth's planetary rotation",
        "Tuned mass dampers in skyscrapers (Taipei 101 earthquake mitigation)",
        "Gravimeters measuring local geological variations in g",
        "Seismograph sensor mechanisms",
      ]}
      faqs={[
        {
          question: "Why does the period of a simple pendulum not depend on mass?",
          answer:
            "Because gravitational force (which accelerates the bob) and inertia (which resists acceleration) are both directly proportional to mass m. In the equation of motion md²θ/dt² = -mg sin θ, mass cancels out completely on both sides, leaving d²θ/dt² = -(g/L) sin θ.",
        },
        {
          question: "Why does a pendulum take longer to swing at large initial angles?",
          answer:
            "The linear approximation assumes sin θ ≈ θ, which holds true only for small angles (< 15°). At large angles like 90°, sin θ < θ, meaning the restoring force near the extremes is weaker than linear spring physics predicts. This weakens acceleration and elongates the period by ~18%.",
        },
        {
          question: "What does the phase-space portrait of a pendulum represent?",
          answer:
            "A phase-space portrait plots angular velocity (ω = dθ/dt) on the y-axis against angular position (θ) on the x-axis. For undamped motion, it forms closed elliptical orbits representing energy conservation. With air friction, the orbit spirals inward toward the resting origin (0, 0).",
        },
        {
          question: "How does planetary gravity change the pendulum's oscillation frequency?",
          answer:
            "Period is inversely proportional to the square root of gravity (T ∝ 1/√g). On the Moon where gravity is 1/6th of Earth (1.62 m/s²), a 1-meter pendulum takes nearly 5 seconds per swing compared to 2.01 seconds on Earth.",
        },
      ]}
    />
  );
}
