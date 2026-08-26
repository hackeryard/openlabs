import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Differential Equations & Dynamical Chaos | OpenLabs",
  description: "Master ordinary differential equations (ODEs), slope fields, Runge-Kutta numerical methods, 2D phase plane portraits, Lotka-Volterra predator-prey systems, and the 3D Lorenz strange attractor online.",
  keywords: [
    "differential equations virtual lab",
    "ode slope field visualizer",
    "runge kutta numerical methods interactive",
    "phase plane portrait generator",
    "lotka volterra population dynamics",
    "lorenz butterfly attractor chaos",
    "mathematics virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/differential-equations",
  },
  openGraph: {
    title: "Differential Equations & Dynamical Systems | OpenLabs",
    description: "Explore slope fields, phase planes, Lotka-Volterra dynamics, and Lorenz chaos in real time.",
    url: "https://www.openlabs.org.in/mathematics/differential-equations",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/mathematics/differential-equations-hero.png",
        alt: "Differential Equations Studio Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Differential Equations & Dynamical Systems | OpenLabs",
    description: "Interactive ODE solvers, phase planes, predator-prey cycles, and Lorenz attractor chaos.",
    images: ["https://www.openlabs.org.in/images/mathematics/differential-equations-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DifferentialEquationsLandingPage() {
  return (
    <STEMExperimentLanding
      subject="mathematics"
      slug="differential-equations"
      title="Differential Equations & Dynamical Chaos"
      description="Applied mathematics laboratory exploring 1st-order ODE slope fields, 4th-order Runge-Kutta (RK4) numerical integrators, 2D phase plane limit cycles, Lotka-Volterra dynamics, and the 3D Lorenz strange attractor."
      heroDescription="Explore the universal language of physical and biological change. Click to drop initial condition seeds into 2D vector slope fields, trace solution trajectories using Runge-Kutta integration, observe Lotka-Volterra predator-prey orbits, and watch chaotic butterfly orbits unfold on the 3D Lorenz attractor."
      theory="Differential equations relate unknown functions to their derivatives (rates of change). For nonlinear systems without closed-form analytical solutions, 4th-order Runge-Kutta (RK4) numerical integration approximates trajectories with high accuracy. In multi-variable autonomous dynamical systems (dx/dt = F(x)), fixed points and eigenvalues of the Jacobian matrix classify equilibrium stability (stable nodes, saddle points, spiral sinks, limit cycles). In deterministic chaotic systems (like the Lorenz atmospheric convection equations), solutions exhibit sensitive dependence on initial conditions (the Butterfly Effect)."
      formula="\begin{cases} \dot{x} = \sigma(y - x) \\ \dot{y} = x(\rho - z) - y \\ \dot{z} = xy - \beta z \end{cases} \quad \text{and} \quad y_{n+1} = y_n + \frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)"
      formulaLabel="Lorenz Chaotic Attractor System & 4th-Order Runge-Kutta (RK4)"
      launchUrl="/labs/mathematics/differential-equations"
      heroImageUrl="/images/mathematics/differential-equations-hero.png"
      visualLabel="Vector Slope Field & 3D Chaos Phase Portrait"
      visualDetail="Click-to-Seed Integral Curves • RK4 Adaptive Step-Size Engine • 3D Lorenz Strange Attractor"
      accent={{ primary: "#f43f5e", secondary: "#0284c7", warm: "#f59e0b" }}
      learningObjectives={[
        "Construct and interpret 1st-order ODE slope direction fields (dy/dx = f(x, y)).",
        "Implement the 4th-order Runge-Kutta (RK4) numerical integration algorithm to solve initial value problems.",
        "Analyze 2D phase plane portraits, nullclines, and stability of equilibrium points (Jacobian eigenvalues).",
        "Demonstrate sensitive dependence on initial conditions (Lyapunov exponent > 0) in the Lorenz chaotic system.",
      ]}
      applications={[
        "Epidemiological SIR Outbreak Modeling (infectious disease spread and R₀ reproduction numbers).",
        "Orbital Mechanics & N-Body Gravitational Problem (spacecraft trajectory calculations).",
        "Climate Science & Numerical Weather Prediction (chaotic atmospheric fluid dynamics).",
        "Chemical Kinetics & Belousov-Zhabotinsky Oscillating Reactions.",
      ]}
      faqs={[
        {
          question: "What is the 'Butterfly Effect' in deterministic chaos?",
          answer:
            "Discovered by meteorologist Edward Lorenz in 1963, deterministic chaos means that while a system is strictly governed by deterministic differential equations with no randomness, two starting trajectories with infinitesimal differences will diverge exponentially over time, making long-term prediction impossible.",
        },
        {
          question: "Why is the 4th-Order Runge-Kutta (RK4) method preferred over Euler's method?",
          answer:
            "Euler's method estimates the next step using only the slope at the beginning of the interval, accumulating significant local truncation error (O(h²)). RK4 computes a weighted average of four sample slopes across the step, achieving fourth-order global accuracy (O(h⁴)) with vastly superior stability.",
        },
      ]}
    />
  );
}
