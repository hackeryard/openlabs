import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Differential Equations & Dynamical Systems - Interactive Virtual Math Lab | OpenLabs",
  description:
    "Master ordinary differential equations (ODEs), slope fields, Runge-Kutta numerical methods, 2D phase plane portraits, Lotka-Volterra predator-prey systems, and the 3D Lorenz strange attractor with our interactive laboratory.",
  keywords: [
    "differential equations virtual lab",
    "ode slope field visualizer",
    "runge kutta numerical methods interactive",
    "phase plane portrait generator",
    "lotka volterra population dynamics",
    "lorenz butterfly attractor chaos",
    "sir epidemic curves simulation",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/differential-equations",
  },
  openGraph: {
    title: "Differential Equations & Dynamical Systems - Interactive Virtual Math Lab | OpenLabs",
    description:
      "Explore slope fields, phase planes, Lotka-Volterra dynamics, and Lorenz chaos.",
    url: "https://www.openlabs.org.in/mathematics/differential-equations",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/og-image.svg",
        alt: "Differential Equations Studio Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Differential Equations & Dynamical Systems - Interactive Virtual Math Lab | OpenLabs",
    description:
      "Interactive ODE solvers, phase planes, predator-prey cycles, and Lorenz attractor chaos.",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "differential-equations",
  subject: "Mathematics",
  title: "Differential Equations & Dynamical Systems",
  description:
    "Explore the language of change in the universe: from 1st-order slope fields and Runge-Kutta numerical solvers to 2D phase portraits, predator-prey ecological cycles, driven harmonic resonance, and 3D Lorenz attractor chaos.",
  difficulty: "Advanced",
  estimatedTime: "30 mins",
  heroDescription:
    "Discover how differential equations model physical motion, chemical reaction rates, planetary orbits, epidemiological outbreaks, and turbulent chaotic weather.",
  theory: {
    content: `<p><strong>Differential Equations</strong> are mathematical equations that relate a function with its derivatives. Because derivatives represent rates of change, differential equations govern virtually all continuous processes in physics, engineering, biology, economics, and ecology.</p>
    <h3>1st-Order ODEs & Direction Fields</h3>
    <p>A first-order ordinary differential equation takes the form <code>\\frac{dy}{dx} = f(x, y)</code>. A <strong>slope field (direction field)</strong> visualizes the derivative as tangent vector segments across the Cartesian plane, allowing solution trajectories to be traced through initial conditions <code>(x_0, y_0)</code>.</p>
    <h3>Numerical Integration: Euler, Heun & Runge-Kutta (RK4)</h3>
    <p>When analytical closed-form solutions are impossible, numerical solvers approximate trajectories over discrete time steps <code>h</code>:</p>
    <ul>
      <li><strong>Euler's Method:</strong> <code>y_{n+1} = y_n + h f(x_n, y_n)</code> — 1st-order accuracy <code>O(h)</code>.</li>
      <li><strong>Improved Euler (Heun):</strong> 2nd-order predictor-corrector <code>O(h^2)</code>.</li>
      <li><strong>Runge-Kutta 4th Order (RK4):</strong> Evaluates four trial slopes per step to achieve 4th-order accuracy <code>O(h^4)</code>.</li>
    </ul>
    <h3>2D Linear Systems & Phase Plane Classification</h3>
    <p>For a coupled autonomous system <code>\\dot{\\mathbf{x}} = A\\mathbf{x}</code>, the qualitative behavior near the origin is classified by the <strong>Trace (\\tau = \\text{tr}(A))</strong> and <strong>Determinant (\\Delta = \\det(A))</strong>:</p>
    <ul>
      <li><strong>Saddle Point:</strong> <code>\\Delta < 0</code> (unstable real eigenvalues of opposite sign).</li>
      <li><strong>Nodes:</strong> <code>\\Delta > 0</code> and <code>\\tau^2 - 4\\Delta > 0</code> (stable if <code>\\tau < 0</code>, unstable if <code>\\tau > 0</code>).</li>
      <li><strong>Spirals (Focus):</strong> <code>\\tau^2 - 4\\Delta < 0</code> with <code>\\tau \\neq 0</code> (oscillating decay or growth).</li>
      <li><strong>Neutral Center:</strong> <code>\\tau = 0</code> and <code>\\Delta > 0</code> (purely imaginary eigenvalues, closed concentric orbits).</li>
    </ul>
    <h3>Lotka-Volterra Ecological Dynamics</h3>
    <p>The classic predator-prey equations model interacting biological populations:</p>
    <p><code>\\frac{dx}{dt} = \\alpha x - \\beta x y \\quad (\\text{Prey}), \\qquad \\frac{dy}{dt} = \\delta x y - \\gamma y \\quad (\\text{Predator})</code></p>
    <p>This yields closed periodic orbits in phase space surrounding the non-zero coexistence equilibrium <code>(\\gamma/\\delta, \\alpha/\\beta)</code>.</p>
    <h3>Deterministic Chaos & The Lorenz Strange Attractor</h3>
    <p>Edward Lorenz discovered in 1963 that simple 3D non-linear systems can exhibit <strong>deterministic chaos</strong>:</p>
    <p><code>\\dot{x} = \\sigma(y - x), \\quad \\dot{y} = x(\\rho - z) - y, \\quad \\dot{z} = xy - \\beta z</code></p>
    <p>Trajectories orbit a fractional-dimension <strong>strange attractor</strong> with a positive Lyapunov exponent, causing infinitesimally close initial conditions to diverge exponentially (the Butterfly Effect).</p>`,
  },
  mathematicalFoundations: {
    equations: [
      "\\frac{dy}{dx} = f(x, y)",
      "y_{n+1} = y_n + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4) \\quad \\text{(RK4)}",
      "\\dot{\\mathbf{x}} = A\\mathbf{x} \\implies \\det(A - \\lambda I) = 0",
      "\\dot{x} = \\alpha x - \\beta x y, \\quad \\dot{y} = \\delta x y - \\gamma y",
      "\\dot{x} = \\sigma(y - x), \\quad \\dot{y} = x(\\rho - z) - y, \\quad \\dot{z} = xy - \\beta z",
    ],
    explanation:
      "Dynamical systems theory unifies linear algebra, multivariate calculus, and numerical analysis to predict stability, bifurcations, and limit cycles in physical and biological systems.",
  },
  learningObjectives: [
    "Construct and interpret 1st-order direction fields and trace integral curves from arbitrary initial conditions.",
    "Compare truncation errors across Euler's method, Heun's method, and the classical 4th-order Runge-Kutta (RK4) integrator.",
    "Classify 2D linear phase portraits (saddles, nodes, spirals, centers) using Trace-Determinant invariants.",
    "Simulate non-linear predator-prey oscillations and verify ecological phase-lag relationships.",
    "Analyze underdamped, critically damped, and forced resonant harmonic oscillations.",
    "Explore the 3D Lorenz strange attractor and simulate the Butterfly Effect's sensitive dependence on initial conditions.",
    "Model epidemic curves, herd immunity thresholds, and non-pharmaceutical interventions with the SIR model.",
  ],
  realWorldApplications: [
    "Aerospace trajectory calculation, satellite orbital mechanics, and spacecraft re-entry modeling",
    "Epidemiology, pandemic spread forecasting, and public health vaccination thresholds (SIR/SEIR models)",
    "Meteorological weather modeling and atmospheric convection dynamics",
    "Electrical power grid transient stability and AC circuit resonance",
  ],
  howItWorks:
    "Select differential equation modes, adjust parameters, spawn solution trajectories, rotate 3D chaotic attractors, and test numerical integrators in real time.",
  faqs: [
    {
      question: "Why is Runge-Kutta (RK4) preferred over Euler's method?",
      answer:
        "Euler's method accumulates errors of order O(h) per step, requiring impractically small step sizes for stable results. RK4 evaluates four weighted intermediate slopes to achieve O(h^4) global error, providing orders-of-magnitude greater accuracy and numerical stability.",
    },
    {
      question: "What defines a Strange Attractor in chaos theory?",
      answer:
        "A strange attractor is an invariant set in phase space with fractal dimension. Trajectories never repeat and never cross, yet remain bounded forever within a localized region while exhibiting sensitive dependence on initial conditions.",
    },
    {
      question: "What does the basic reproduction number R0 signify in the SIR model?",
      answer:
        "R0 = beta / gamma represents the average number of secondary infections generated by a single infectious individual in a completely susceptible population. If R0 > 1, the disease spreads exponentially into an epidemic; if R0 < 1, the outbreak dies out.",
    },
  ],
  relatedExperiments: [],
};

export default function DifferentialEquationsLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/mathematics/differential-equations"
    />
  );
}
