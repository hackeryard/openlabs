import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculus & Derivatives Sandbox - Interactive Mathematics Lab | OpenLabs",
  description:
    "Master differential and integral calculus with our interactive laboratory. Visualize secant-to-tangent limits (h → 0), difference quotients, Riemann sums (Left, Right, Midpoint, Trapezoid, Simpson), and optimization extrema.",
  keywords: [
    "calculus visualizer",
    "derivative limit definition",
    "secant line tangent line convergence",
    "riemann sums interactive",
    "definite integration simpson rule",
    "second derivative test",
    "optimization stationary points",
    "interactive math lab",
    "AP Calculus AB BC",
    "STEM mathematics",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/calculus",
  },
  openGraph: {
    title: "Calculus & Derivatives Sandbox - Interactive Mathematics Lab | OpenLabs",
    description:
      "Explore secant-to-tangent line limits, difference quotients, Riemann sums, and optimization extrema in real time.",
    url: "https://www.openlabs.org.in/mathematics/calculus",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/og-image.svg",
        alt: "Calculus & Derivatives Sandbox Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculus & Derivatives Sandbox - Interactive Mathematics Lab | OpenLabs",
    description:
      "Explore secant-to-tangent limits, Riemann sums, and optimization extrema in real time.",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "calculus",
  subject: "Mathematics",
  title: "Calculus & Derivatives Sandbox",
  description:
    "Differential limits, secant-to-tangent convergence, Riemann sum partitions, and optimization extrema.",
  difficulty: "Advanced",
  estimatedTime: "20 mins",
  heroDescription:
    "Bridge the geometric and analytic foundations of rates of change and accumulated area in our interactive calculus laboratory.",
  theory: {
    content: `<p><strong>Calculus</strong> is the mathematical study of continuous change, divided into two fundamental branches: <strong>Differential Calculus</strong> (concerning instantaneous rates of change and slopes of curves) and <strong>Integral Calculus</strong> (concerning accumulation of quantities and areas under curves).</p>
    <h3>The Limit Definition of the Derivative</h3>
    <p>The derivative of a function <code>f(x)</code> at a point <code>x₀</code> is the limit of the difference quotient as the step size <code>h</code> approaches zero:</p>
    <p><code>f'(x₀) = \\lim_{h \\to 0} \\frac{f(x₀ + h) - f(x₀)}{h}</code></p>
    <p>Geometrically, as <code>h \\to 0</code>, the secant line passing through <code>P(x₀, f(x₀))</code> and <code>Q(x₀ + h, f(x₀ + h))</code> rotates and converges into the <strong>instantaneous tangent line</strong> with slope <code>m = f'(x₀)</code>.</p>
    <h3>Riemann Sums & Definite Integrals</h3>
    <p>A definite integral represents the net signed area bounded between the graph of <code>f(x)</code> and the x-axis from <code>x = a</code> to <code>x = b</code>:</p>
    <p><code>\\int_{a}^{b} f(x) dx = \\lim_{N \\to \\infty} \\sum_{i=1}^{N} f(x_i^*) \\Delta x</code></p>
    <p>Numerical approximations divide the interval <code>[a, b]</code> into <code>N</code> subintervals of width <code>\\Delta x = \\frac{b - a}{N}</code> using Left, Right, Midpoint, Trapezoidal, or Simpson's parabolic rules.</p>
    <h3>The Second Derivative Test for Optimization</h3>
    <p>Stationary critical points occur where <code>f'(x) = 0</code>:</p>
    <ul>
      <li><strong>Local Minimum:</strong> <code>f''(x) > 0</code> (curve is concave up ∪).</li>
      <li><strong>Local Maximum:</strong> <code>f''(x) < 0</code> (curve is concave down ∩).</li>
      <li><strong>Inflection / Inconclusive:</strong> <code>f''(x) = 0</code> (concavity changes sign).</li>
    </ul>`,
  },
  mathematicalFoundations: {
    equations: [
      "f'(x_0) = \\lim_{h \\to 0} \\frac{f(x_0 + h) - f(x_0)}{h}",
      "\\int_a^b f(x) dx = F(b) - F(a)",
      "\\Delta x = \\frac{b - a}{N}",
      "T_N = \\frac{\\Delta x}{2} [f(x_0) + 2f(x_1) + \\dots + f(x_N)]",
      "S_N = \\frac{\\Delta x}{3} [f(x_0) + 4f(x_1) + 2f(x_2) + \\dots + f(x_N)]",
    ],
    explanation:
      "Calculus establishes the inverse relationship between differentiation and integration via the Fundamental Theorem of Calculus: d/dx [∫ₐˣ f(t)dt] = f(x).",
  },
  learningObjectives: [
    "Visualize how the secant line difference quotient converges to the tangent slope as step size h → 0.",
    "Compare approximation accuracy between Left, Right, Midpoint, Trapezoidal, and Simpson Riemann sums.",
    "Observe error convergence as partition count N increases towards the exact definite integral.",
    "Apply the First and Second Derivative Tests to classify local extrema and concavity in optimization problems.",
  ],
  realWorldApplications: [
    "Aerospace trajectory analysis and instantaneous rocket acceleration modeling",
    "Financial quantitative modeling, continuous compound interest, and options pricing",
    "Signal processing, wave spectrum analysis, and Fourier integral transforms",
    "Structural engineering load distribution and fluid dynamics flow rates",
  ],
  howItWorks:
    "Use the Limits tab to drag h down to 0 and watch the secant line snap to the tangent. Switch to the Riemann tab to test different integration partitions (N) and rules, or explore optimization stationary points.",
  faqs: [
    {
      question: "Why does the difference quotient become 0/0 when h = 0?",
      answer:
        "Setting h = 0 directly produces (f(x) - f(x))/0 = 0/0, an indeterminate form. Calculus resolves this by finding the limit as h gets infinitely close to 0 without actually being equal to 0.",
    },
    {
      question: "Which Riemann sum method is the most accurate?",
      answer:
        "Simpson's Rule is generally the most accurate because it approximates the curve using parabolic arcs rather than flat rectangles or linear trapezoids, achieving an error proportional to (Δx)⁴.",
    },
    {
      question: "What is the Fundamental Theorem of Calculus?",
      answer:
        "It connects differentiation and integration, stating that if F'(x) = f(x), then ∫ₐᵇ f(x)dx = F(b) - F(a), allowing definite integrals to be calculated using antiderivatives.",
    },
  ],
  relatedExperiments: [],
};

export default function CalculusLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/mathematics/calculus"
    />
  );
}
