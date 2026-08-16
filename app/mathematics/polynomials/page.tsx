import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quadratic & Polynomial Explorer - Interactive Mathematics Lab | OpenLabs",
  description:
    "Master quadratic equations, parabolic geometry, discriminant analysis (Δ = b² - 4ac), higher-degree polynomials (degree 1–5), and synthetic division in our interactive mathematics laboratory.",
  keywords: [
    "quadratic equations",
    "parabola visualizer",
    "discriminant analysis",
    "complex roots argand diagram",
    "polynomial explorer",
    "synthetic division calculator",
    "factor theorem",
    "remainder theorem",
    "inflection points",
    "interactive math lab",
    "STEM mathematics",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/polynomials",
  },
  openGraph: {
    title: "Quadratic & Polynomial Explorer - Interactive Mathematics Lab | OpenLabs",
    description:
      "Explore parabolic vertices, discriminant analysis (Δ = b² - 4ac), higher-degree polynomial turning points, and synthetic division in real time.",
    url: "https://www.openlabs.org.in/mathematics/polynomials",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/og-image.svg",
        alt: "Quadratic & Polynomial Explorer Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quadratic & Polynomial Explorer - Interactive Mathematics Lab | OpenLabs",
    description:
      "Explore parabolic vertices, discriminant analysis, higher-degree polynomials, and synthetic division.",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "polynomials",
  subject: "Mathematics",
  title: "Quadratic & Polynomial Explorer",
  description:
    "Parabolic geometry, discriminant analysis, higher-degree polynomial behavior, and synthetic division.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription:
    "Deep dive into parabolic curves, quadratic roots, discriminant classification, turning points, and polynomial division with real-time interactive models.",
  theory: {
    content: `<p>A <strong>polynomial</strong> is an algebraic expression consisting of variables and coefficients combined using addition, subtraction, multiplication, and non-negative integer exponents.</p>
    <h3>Quadratic Functions & Parabolas (Degree 2)</h3>
    <p>A quadratic function has the standard form <code>y = ax² + bx + c</code> (where <code>a ≠ 0</code>). Its graph is a symmetrical curve known as a <strong>parabola</strong>.</p>
    <ul>
      <li><strong>Vertex:</strong> The turning point <code>(h, k)</code> where <code>h = -\\frac{b}{2a}</code> and <code>k = c - \\frac{b²}{4a}</code>.</li>
      <li><strong>Axis of Symmetry:</strong> The vertical line <code>x = -\\frac{b}{2a}</code> passing through the vertex.</li>
      <li><strong>Focus & Directrix:</strong> A parabola is the locus of points equidistant from a focal point <code>(h, k + \\frac{1}{4a})</code> and a directrix line <code>y = k - \\frac{1}{4a}</code>.</li>
    </ul>
    <h3>The Discriminant (Δ = b² - 4ac)</h3>
    <p>The term under the square root in the Quadratic Formula determines the nature of the roots:</p>
    <ul>
      <li><strong>Δ > 0:</strong> Two distinct real roots (parabola crosses the x-axis twice).</li>
      <li><strong>Δ = 0:</strong> One repeated real root (parabola vertex touches the x-axis).</li>
      <li><strong>Δ < 0:</strong> Two complex conjugate roots <code>x = \\alpha \\pm \\beta i</code> (parabola does not intersect the real x-axis).</li>
    </ul>
    <h3>The Remainder & Factor Theorems</h3>
    <p>When a polynomial <code>P(x)</code> is divided by a linear binomial <code>(x - c)</code>, the remainder equals <code>P(c)</code>. If <code>P(c) = 0</code>, then <code>(x - c)</code> is an exact factor of <code>P(x)</code>.</p>`,
  },
  mathematicalFoundations: {
    equations: [
      "y = ax^2 + bx + c",
      "y = a(x - h)^2 + k",
      "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
      "\\Delta = b^2 - 4ac",
      "P(x) = (x - c)Q(x) + R",
    ],
    explanation:
      "Quadratic algebra bridges standard, vertex, and factored forms, while polynomial analysis identifies critical turning points (P'(x) = 0) and synthetic division evaluates polynomial remainders.",
  },
  learningObjectives: [
    "Understand the geometric significance of parameters a, b, c in parabolic transformations.",
    "Convert fluently between standard form y = ax² + bx + c and vertex form y = a(x - h)² + k.",
    "Classify real versus complex roots using discriminant analysis (Δ = b² - 4ac).",
    "Investigate end behavior and inflection points for cubic, quartic, and quintic polynomials.",
    "Perform step-by-step synthetic division to find polynomial roots and verify the Factor Theorem.",
  ],
  realWorldApplications: [
    "Projectile ballistics and satellite dish parabolic reflector design",
    "Economic cost-benefit and profit optimization curves",
    "Structural arch bridge engineering and suspension cable mechanics",
    "Computer graphics, spline interpolation, and bezier curve modeling",
  ],
  howItWorks:
    "Switch between the Quadratic, Polynomial, and Synthetic Division tabs. Drag coefficient sliders to observe instantaneous graph changes, inspect the live discriminant dial, and test factors using the synthetic tableau matrix.",
  faqs: [
    {
      question: "What does the sign of 'a' indicate in a parabola?",
      answer:
        "If a > 0, the parabola opens upward with a global minimum at its vertex. If a < 0, the parabola opens downward with a global maximum at its vertex.",
    },
    {
      question: "Why do complex roots occur in conjugate pairs?",
      answer:
        "By the Complex Conjugate Root Theorem, if a polynomial has real coefficients, any non-real complex root α + βi must have its conjugate α - βi as a root because the quadratic formula includes ±√(Δ).",
    },
    {
      question: "What is the difference between synthetic division and long division?",
      answer:
        "Synthetic division is a streamlined shorthand method for dividing polynomials by linear binomials (x - c), focusing purely on coefficients without carrying variable powers.",
    },
  ],
  relatedExperiments: [],
};

export default function PolynomialsLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/mathematics/polynomials"
    />
  );
}
