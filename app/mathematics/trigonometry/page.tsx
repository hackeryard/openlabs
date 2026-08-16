import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trigonometry Visualizer - Interactive Mathematics Lab | OpenLabs",
  description:
    "Master trigonometry with our interactive unit circle and wave unfolding sandbox. Explore sine, cosine, tangent geometric projections, verify Pythagorean identities, and manipulate wave harmonics.",
  keywords: [
    "trigonometry visualizer",
    "unit circle simulator",
    "sine wave unfolding",
    "cosine geometric projection",
    "tangent line slope",
    "pythagorean identities verification",
    "trigonometric wave harmonics",
    "interactive math lab",
    "STEM mathematics",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/trigonometry",
  },
  openGraph: {
    title: "Trigonometry Visualizer - Interactive Mathematics Lab | OpenLabs",
    description:
      "Explore unit circle geometry, dynamic sine/cosine wave unfolding, and Pythagorean trigonometric identities in real time.",
    url: "https://www.openlabs.org.in/mathematics/trigonometry",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/og-image.svg",
        alt: "Trigonometry Visualizer Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trigonometry Visualizer - Interactive Mathematics Lab | OpenLabs",
    description:
      "Explore unit circle geometry, dynamic sine/cosine wave unfolding, and Pythagorean trigonometric identities in real time.",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "trigonometry",
  subject: "Mathematics",
  title: "Trigonometry Visualizer",
  description: "Interactive unit circle geometry, continuous sinusoidal wave unfolding, and identity proofs.",
  difficulty: "Beginner",
  estimatedTime: "15 mins",
  heroDescription:
    "Bridge right-triangle definitions, circular motion, and periodic wave functions in our interactive trigonometric laboratory.",
  theory: {
    content: `<p><strong>Trigonometry</strong> is the branch of mathematics that studies relationships between side lengths and angles of triangles, extended to periodic circular functions on the Cartesian coordinate plane.</p>
    <h3>The Unit Circle Definition (r = 1)</h3>
    <p>On a Cartesian coordinate system with a circle of radius <code>r = 1</code> centered at the origin <code>(0, 0)</code>, any angle <code>θ</code> in standard position defines a coordinate <code>(x, y)</code> on the circle where:</p>
    <ul>
      <li><strong>Cosine:</strong> <code>x = \\cos(θ)</code> (horizontal projection base)</li>
      <li><strong>Sine:</strong> <code>y = \\sin(θ)</code> (vertical projection height)</li>
      <li><strong>Tangent:</strong> <code>\\tan(θ) = \\frac{y}{x} = \\frac{\\sin(θ)}{\\cos(θ)}</code> (slope of the terminal ray / tangent line segment)</li>
    </ul>
    <h3>From Circular Motion to Continuous Waves</h3>
    <p>As an object traverses the unit circle counter-clockwise at constant angular velocity <code>ω</code>, its vertical height unfolds into a continuous <strong>Sine Wave</strong> <code>y = \\sin(θ)</code>, and its horizontal displacement forms a <strong>Cosine Wave</strong> <code>x = \\cos(θ)</code> with period <code>T = 2π</code> radians (360°).</p>
    <h3>Fundamental Pythagorean Identities</h3>
    <p>Applying the Pythagorean theorem <code>x² + y² = r²</code> to the right triangle inside the unit circle yields:</p>
    <p><code>\\sin²(θ) + \\cos²(θ) = 1</code></p>
    <p>Dividing by <code>\\cos²(θ)</code> and <code>\\sin²(θ)</code> provides the secondary identities <code>1 + \\tan²(θ) = \\sec²(θ)</code> and <code>1 + \\cot²(θ) = \\csc²(θ)</code>.</p>`,
  },
  mathematicalFoundations: {
    equations: [
      "\\sin^2(\\theta) + \\cos^2(\\theta) = 1",
      "\\tan(\\theta) = \\frac{\\sin(\\theta)}{\\cos(\\theta)}",
      "y = A \\sin(B(x - C)) + D",
      "\\sin(2\\theta) = 2\\sin(\\theta)\\cos(\\theta)",
    ],
    explanation:
      "Trigonometric functions map angles to coordinate ratios on the unit circle, while wave transformations scale amplitude (A), frequency/period (B), phase shift (C), and vertical offset (D).",
  },
  learningObjectives: [
    "Visualize the geometric right-triangle decomposition of sine, cosine, and tangent on the unit circle.",
    "Observe how circular rotation unrolls directly into periodic sine and cosine waves.",
    "Master the 16 exact standard angles (multiples of π/6 and π/4) and their radical values.",
    "Verify fundamental Pythagorean and double-angle trigonometric identities in real time.",
  ],
  realWorldApplications: [
    "Audio engineering and acoustic sound synthesis (Fourier harmonics and sinusoidal tones)",
    "Alternating current (AC) electrical circuits, voltage phases, and impedance oscillations",
    "Computer graphics, 3D rotations, ray-casting, and procedural animation loops",
    "Astronomy, celestial navigation, and orbital planetary mechanics",
  ],
  howItWorks:
    "Drag the interactive handle on the unit circle or click any standard angle from the reference matrix. Watch the synchronized projection ray trace the live wave in real time. Use the Wave Sandbox to tweak amplitude, frequency, and phase, or explore identity verifications.",
  faqs: [
    {
      question: "Why is the unit circle radius set to 1?",
      answer:
        "Setting r = 1 simplifies the trigonometric ratios: sin(θ) = opposite/hypotenuse = y/1 = y, and cos(θ) = adjacent/hypotenuse = x/1 = x. The circle coordinates directly equal the sine and cosine values.",
    },
    {
      question: "What does ASTC stand for?",
      answer:
        "ASTC is a mnemonic ('All Students Take Calculus' or 'All Silver Tea Cups') for determining which trigonometric functions are positive in each quadrant: Q1 = All, Q2 = Sine, Q3 = Tangent, Q4 = Cosine.",
    },
    {
      question: "Why does tan(90°) not exist?",
      answer:
        "At θ = 90° (π/2 rad), cos(90°) = 0. Since tan(θ) = sin(θ)/cos(θ), computing tan(90°) involves division by zero (1/0), resulting in an infinite vertical asymptote.",
    },
  ],
  relatedExperiments: [],
};

export default function TrigonometryLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/mathematics/trigonometry"
    />
  );
}
