import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Hooke's Law & Springs Simulator | Physics Lab | OpenLabs",
  description:
    "Interactive Hooke's Law and multi-spring simulator. Explore restoring forces, series and parallel spring combinations, elastic potential energy, and damped harmonic oscillations.",
  keywords: [
    "hooke's law simulator",
    "spring constant lab",
    "series parallel springs simulation",
    "elastic potential energy physics",
    "mass spring harmonic oscillator",
    "spring stiffness linear regression",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/hookelaw",
  },
  openGraph: {
    title: "Hooke's Law & Springs Simulator | Physics Lab | OpenLabs",
    description:
      "Interactive Hooke's Law and multi-spring simulator. Explore restoring forces, series and parallel spring combinations, elastic potential energy, and damped harmonic oscillations.",
    url: "https://www.openlabs.org.in/physics/hookelaw",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/physics/hookes-law-hero.png",
        alt: "Hooke's Law Simulator | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hooke's Law & Springs Simulator | Physics Lab | OpenLabs",
    description:
      "Interactive Hooke's Law and multi-spring simulator. Explore restoring forces, series/parallel combinations, and elastic energy.",
    images: ["https://www.openlabs.org.in/images/physics/hookes-law-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HookesLawPage() {
  return (
    <PhysicsExperimentLanding
      slug="hookelaw"
      title="Hooke's Law & Multi-Spring Systems"
      description="Explore restoring forces, series and parallel spring combinations, and elastic energy."
      heroDescription="Investigate how elastic springs stretch and oscillate under load. Configure springs in single, series, or parallel setups, measure displacement with a virtual ruler, weigh mystery masses, and plot linear force-displacement curves."
      theory="Hooke's Law states that the restoring force exerted by an elastic spring is directly proportional to its displacement from equilibrium: Fs = -kΔx. For multi-spring systems, springs in parallel add stiffness (keff = k1 + k2), whereas springs in series add compliance (1/keff = 1/k1 + 1/k2). Under harmonic oscillation, the natural period is T = 2π√(m/keff), with total mechanical energy continually interchanging between elastic potential energy (Ue = ½k(Δx)²) and kinetic energy (Ek = ½mv²)."
      formula="F_s = -k_{\text{eff}} \Delta x \quad \text{and} \quad T = 2\pi\sqrt{\frac{m}{k_{\text{eff}}}}"
      formulaLabel="Hooke's Law & Natural Oscillation Period"
      launchUrl="/labs/physics/hookelaw"
      heroImageUrl="/images/physics/hookes-law-hero.png"
      visualLabel="Runge-Kutta RK4 Spring-Mass Simulator"
      visualDetail="Series & Parallel Multi-Springs • Force-Displacement Slope • Mystery Mass Weighing"
      accent={{ primary: "#0284c7", secondary: "#0d9488", warm: "#ea580c" }}
      learningObjectives={[
        "Verify Hooke's Law (Fs = -kΔx) by measuring static spring extension under varying gravitational loads.",
        "Compare equivalent spring stiffness across Single, Series (1/keff = 1/k1 + 1/k2), and Parallel (keff = k1 + k2) configurations.",
        "Weigh unknown mystery masses (M1, M2, M3) using static displacement at equilibrium (m = kΔx/g).",
        "Analyze real-time Force vs Displacement (F-x) curves where the linear slope represents spring constant k and area represents elastic potential energy (Ue = ½k(Δx)²).",
        "Observe damped harmonic oscillations across planetary environments (Earth, Moon, Mars, Jupiter, Zero-G).",
      ]}
      applications={[
        "Automotive suspension coil springs and struts",
        "Seismograph ground-motion sensors and accelerometers",
        "Atomic Force Microscopy (AFM) micro-cantilevers",
        "Precision spring scales and load-cell dynamometers",
        "Clockwork balance springs and mechanical escapements",
      ]}
      faqs={[
        {
          question: "How do series and parallel spring combinations differ?",
          answer:
            "In parallel, both springs share the load and stretch by the same displacement, doubling stiffness (keff = k1 + k2). In series, both springs experience the same tension but displacements add up, making the system more compliant and halving equivalent stiffness (1/keff = 1/k1 + 1/k2).",
        },
        {
          question: "What does the slope of a Force vs Displacement graph represent?",
          answer:
            "The slope of the F vs Δx graph directly equals the spring constant k (stiffness) in N/m. The triangular area beneath the line represents the work done to stretch the spring, which equals the stored elastic potential energy Ue = ½k(Δx)².",
        },
        {
          question: "How does a spring scale measure mass in different gravitational fields?",
          answer:
            "At static equilibrium, the upward restoring force balances downward gravity: kΔx = mg, meaning mass is computed as m = (kΔx)/g. On the Moon where g is 1/6th of Earth, the same mass causes 1/6th as much stretch.",
        },
        {
          question: "Why does the oscillation period depend on mass but not on gravity?",
          answer:
            "The natural period of a spring-mass oscillator is T = 2π√(m/k). While gravity shifts the static equilibrium position downward (x_eq = mg/k), the restoring force gradient (dF/dx = -k) is purely elastic and independent of g.",
        },
      ]}
    />
  );
}
