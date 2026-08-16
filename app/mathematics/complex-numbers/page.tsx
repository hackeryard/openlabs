import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complex Numbers & Fractals Explorer - Interactive Mathematics Lab | OpenLabs",
  description:
    "Master complex numbers and fractal geometry with our interactive simulation laboratory. Explore the 2D Argand plane, geometric complex multiplication (rotation-dilation), Euler's formula e^(iθ), roots of unity z^n = 1, and real-time Mandelbrot/Julia set zoomers.",
  keywords: [
    "complex numbers visualizer",
    "argand plane interactive",
    "euler formula identity",
    "roots of unity regular polygons",
    "mandelbrot set deep zoom",
    "julia set escape time",
    "complex analysis",
    "STEM mathematics",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/complex-numbers",
  },
  openGraph: {
    title: "Complex Numbers & Fractals Explorer - Interactive Mathematics Lab | OpenLabs",
    description:
      "Explore the Argand complex plane, roots of unity, Euler's formula, and real-time Mandelbrot/Julia fractals.",
    url: "https://www.openlabs.org.in/mathematics/complex-numbers",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/og-image.svg",
        alt: "Complex Numbers & Fractals Explorer Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Complex Numbers & Fractals Explorer - Interactive Mathematics Lab | OpenLabs",
    description:
      "Explore the Argand complex plane, roots of unity, and real-time Mandelbrot fractals.",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "complex-numbers",
  subject: "Mathematics",
  title: "Complex Numbers & Fractals Explorer",
  description:
    "Argand plane, complex multiplication, roots of unity, Euler's formula, and Mandelbrot/Julia fractals.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription:
    "Unify algebra and geometry in the 2D complex plane, from rotational multiplication and roots of unity to infinite self-similar fractal sets.",
  theory: {
    content: `<p><strong>Complex Numbers</strong> extend the 1D real number line into a 2D plane by introducing the imaginary unit <code>i = \\sqrt{-1}</code>, where <code>i^2 = -1</code>.</p>
    <h3>The Argand Plane & Polar Coordinates</h3>
    <p>Every complex number can be expressed in two complementary ways:</p>
    <ul>
      <li><strong>Cartesian Form:</strong> <code>z = a + bi</code>, where <code>a = \\text{Re}(z)</code> and <code>b = \\text{Im}(z)</code>.</li>
      <li><strong>Polar (Euler) Form:</strong> <code>z = r e^{i\\theta} = r(\\cos\\theta + i\\sin\\theta)</code>, where modulus <code>r = |z| = \\sqrt{a^2 + b^2}</code> and argument <code>\\theta = \\text{atan2}(b, a)</code>.</li>
    </ul>
    <h3>Multiplication as Geometric Rotation and Scaling</h3>
    <p>When multiplying two complex numbers <code>z_1 \\cdot z_2</code>:</p>
    <p><code>z_1 \\cdot z_2 = (r_1 r_2) e^{i(\\theta_1 + \\theta_2)}</code></p>
    <p>Their moduli multiply (dilation by <code>r_2</code>) and their angles add (rotation by <code>\\theta_2</code>). Thus, complex multiplication acts as a 2D conformal transform.</p>
    <h3>Euler's Formula & Identity</h3>
    <p>Euler's formula connects trigonometry and complex exponentials:</p>
    <p><code>e^{i\\theta} = \\cos\\theta + i\\sin\\theta</code></p>
    <p>Setting <code>\\theta = \\pi</code> yields <strong>Euler's Identity</strong> <code>e^{i\\pi} + 1 = 0</code>.</p>
    <h3>The Mandelbrot and Julia Sets</h3>
    <p>The <strong>Mandelbrot set</strong> is defined by the iterative quadratic sequence <code>z_{n+1} = z_n^2 + c</code> starting at <code>z_0 = 0</code>. A complex constant <code>c</code> belongs to the set if the sequence remains bounded forever (does not escape to infinity). The boundary of the set exhibits infinite self-similar fractal geometry.</p>`,
  },
  mathematicalFoundations: {
    equations: [
      "z = a + bi = r(\\cos\\theta + i\\sin\\theta) = r e^{i\\theta}",
      "z_1 \\cdot z_2 = (r_1 r_2) e^{i(\\theta_1 + \\theta_2)}",
      "e^{i\\theta} = \\sum_{k=0}^{\\infty} \\frac{(i\\theta)^k}{k!} = \\cos\\theta + i\\sin\\theta",
      "e^{i\\pi} + 1 = 0",
      "z_{n+1} = z_n^2 + c",
    ],
    explanation:
      "Complex numbers unseat algebraic polynomials via the Fundamental Theorem of Algebra, while their iterative mappings generate rich chaotic fractal boundaries.",
  },
  learningObjectives: [
    "Visualize addition (parallelogram rule) and multiplication (rotation-dilation) on the Argand plane.",
    "Derive and plot the n-th roots of unity forming regular polygons on the unit circle.",
    "Understand Euler's formula e^(iθ) = cos(θ) + i·sin(θ) through circular projection and Taylor vector spirals.",
    "Explore the Mandelbrot and Julia sets using real-time escape-time rendering and infinite zoom.",
  ],
  realWorldApplications: [
    "Electrical AC circuit impedance analysis (phasors V = I · Z)",
    "Quantum mechanics Schrödinger wave equations and state space amplitudes",
    "Audio digital signal processing (DSP), Fast Fourier Transforms (FFT), and phase filtering",
    "Computer graphics fractal landscape generation and antenna design",
  ],
  howItWorks:
    "Drag vectors z₁ and z₂ on the Argand plane to observe multiplication angles add up, explore regular n-gon roots of unity, watch Euler's formula rotate, or zoom infinitely into the Mandelbrot fractal set.",
  faqs: [
    {
      question: "Why does multiplying by i mean rotating by 90 degrees?",
      answer:
        "Because i has modulus r = 1 and argument θ = 90° (π/2 rad). Multiplying any complex number by i multiplies its length by 1 (unchanged) and adds 90° to its angle.",
    },
    {
      question: "What is the relationship between the Mandelbrot set and Julia sets?",
      answer:
        "The Mandelbrot set acts as a visual 'catalog' of all Julia sets. Choosing a parameter c inside the Mandelbrot set produces a connected Julia set, while choosing c outside produces a disconnected Cantor dust.",
    },
    {
      question: "What are the roots of unity?",
      answer:
        "They are all complex numbers z satisfying z^n = 1. They are evenly spaced around the unit circle at angles 2πk/n, forming the vertices of a regular n-sided polygon.",
    },
  ],
  relatedExperiments: [],
};

export default function ComplexNumbersLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/mathematics/complex-numbers"
    />
  );
}
