import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Function Grapher - Interactive Mathematics Lab | OpenLabs",
  description:
    "Plot mathematical functions in real time, explore curve transformations, inspect roots and extrema, calculate tangents, and approximate definite integrals in our interactive D3 science sandbox.",
  keywords: [
    "function grapher",
    "math graphing calculator",
    "curve transformations",
    "roots of polynomials",
    "local extrema visualizer",
    "tangent line slope",
    "definite integral simpson rule",
    "interactive math lab",
    "calculus sandbox",
    "STEM mathematics",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/functiongrapher",
  },
  openGraph: {
    title: "Function Grapher - Interactive Mathematics Lab | OpenLabs",
    description:
      "Plot mathematical functions in real time, explore curve transformations, inspect roots and extrema, calculate tangents, and approximate definite integrals.",
    url: "https://www.openlabs.org.in/mathematics/functiongrapher",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/og-image.svg",
        alt: "Function Grapher Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Function Grapher - Interactive Mathematics Lab | OpenLabs",
    description:
      "Plot mathematical functions in real time, explore curve transformations, inspect roots and extrema, calculate tangents, and approximate definite integrals.",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "functiongrapher",
  subject: "Mathematics",
  title: "Function Grapher",
  description: "Interactive real-time function plotter with transformations, calculus analysis, and root-finding.",
  difficulty: "Beginner",
  estimatedTime: "15 mins",
  heroDescription:
    "Explore continuous functions, polynomial roots, amplitude and frequency transformations, and numerical derivatives in our GPU-accelerated mathematical sandbox.",
  theory: {
    content: `<p>A <strong>mathematical function</strong> is a relation that maps every input <code>x</code> from its domain to exactly one output <code>f(x)</code> in its range. Graphing functions visually represents this mapping on the Cartesian coordinate plane.</p>
    <h3>Function Transformations</h3>
    <p>Given a parent function <code>f(x)</code>, the general transformed function is represented as:</p>
    <p><code>g(x) = a · f(b(x − h)) + k</code></p>
    <ul>
      <li><strong>a (Vertical Stretch / Compression & Reflection):</strong> If <code>|a| &gt; 1</code>, the curve stretches vertically; if <code>0 &lt; |a| &lt; 1</code>, it compresses. If <code>a &lt; 0</code>, the curve reflects across the x-axis.</li>
      <li><strong>b (Horizontal Compression / Stretch & Reflection):</strong> If <code>|b| &gt; 1</code>, the curve compresses horizontally by a factor of <code>1/|b|</code>. If <code>b &lt; 0</code>, it reflects across the y-axis.</li>
      <li><strong>h (Horizontal Phase Shift):</strong> Translates the curve horizontally by <code>h</code> units (right if <code>h &gt; 0</code>, left if <code>h &lt; 0</code>).</li>
      <li><strong>k (Vertical Shift):</strong> Translates the curve vertically by <code>k</code> units (up if <code>k &gt; 0</code>, down if <code>k &lt; 0</code>).</li>
    </ul>
    <h3>Calculus & Analysis Foundations</h3>
    <p>Key geometrical properties include <strong>Roots</strong> (where <code>f(x) = 0</code>), <strong>y-Intercept</strong> (value of <code>f(0)</code>), <strong>Local Extrema</strong> (points where the first derivative <code>f'(x) = 0</code> changes sign), and <strong>Definite Integrals</strong> representing the net signed area under the curve.</p>`,
  },
  mathematicalFoundations: {
    equations: [
      "g(x) = a · f(b(x - h)) + k",
      "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x-h)}{2h}",
      "\\int_a^b f(x) dx \\approx \\frac{\\Delta x}{3} [f(x_0) + 4\\sum f(x_{\\text{odd}}) + 2\\sum f(x_{\\text{even}}) + f(x_n)]",
    ],
    explanation:
      "Transformations modify geometric scaling and translation, while numerical derivatives provide tangent slope m, and Simpson's composite rule approximates definite integrals.",
  },
  learningObjectives: [
    "Visualize parent functions (polynomial, trigonometric, rational, and exponential).",
    "Master the four transformation parameters (a, b, h, k) and predict curve shifts.",
    "Identify roots (x-intercepts) and local turning points (minima and maxima).",
    "Calculate instantaneous rates of change (tangent slopes) and net definite integral areas.",
  ],
  realWorldApplications: [
    "Signal processing and acoustic wave modulation (sine, cosine, harmonics)",
    "Trajectory mechanics and projectile motion (parabolic quadratic functions)",
    "Population growth, epidemiology, and radioactive decay models (exponential curves)",
    "Economics cost optimization and marginal revenue curves (calculus extrema)",
  ],
  howItWorks:
    "Type any mathematical expression into the formula bar (e.g. x^3 - 3*x or sin(x)) or select a preset from the gallery. Use the Transformation sliders to dynamically stretch and shift the curve, toggle grid and roots overlays, hover to inspect tangent slopes, or compute definite integrals over chosen bounds.",
  faqs: [
    {
      question: "What mathematical syntax is supported?",
      answer:
        "Standard mathematical notation is fully supported, including powers (x^2, x^3), trigonometry (sin, cos, tan), roots (sqrt, cbrt), logarithms (ln, log), exponentials (exp(x), e^x), absolute values (abs), and constants (pi, e).",
    },
    {
      question: "How are roots and extrema calculated?",
      answer:
        "Roots are detected numerically by interval scanning and refined using the bisection method. Extrema are located by detecting sign changes in the numerical symmetric difference derivative f'(x).",
    },
    {
      question: "Can I plot multiple functions at the same time?",
      answer:
        "Yes! You can add multiple functions to the canvas, customize their curve colors, toggle their visibility, and compare their values side-by-side in the Point Inspector table.",
    },
  ],
  relatedExperiments: [],
};

export default function FunctionGrapherLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/mathematics/functiongrapher"
    />
  );
}
