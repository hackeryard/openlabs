import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Complex Numbers & Mandelbrot Fractals Explorer | OpenLabs",
  description: "Master complex numbers and fractal geometry. Explore the Argand plane, rotation-dilation multiplication, Euler's formula, roots of unity, and Mandelbrot/Julia sets.",
  keywords: [
    "complex numbers visualizer",
    "argand plane interactive",
    "euler formula identity",
    "roots of unity regular polygons",
    "mandelbrot set deep zoom",
    "julia set escape time",
    "mathematics virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/complex-numbers",
  },
  openGraph: {
    title: "Complex Numbers & Fractals Explorer | OpenLabs",
    description: "Explore the Argand complex plane, roots of unity, Euler's formula, and real-time Mandelbrot/Julia fractals.",
    url: "https://www.openlabs.org.in/mathematics/complex-numbers",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/mathematics/complex-numbers-hero.png",
        alt: "Complex Numbers & Fractals Explorer Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Complex Numbers & Fractals Explorer | OpenLabs",
    description: "Explore the Argand complex plane, roots of unity, and real-time Mandelbrot fractals.",
    images: ["https://www.openlabs.org.in/images/mathematics/complex-numbers-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ComplexNumbersLandingPage() {
  return (
    <STEMExperimentLanding
      subject="mathematics"
      slug="complex-numbers"
      title="Complex Numbers & Fractal Geometry"
      description="Interactive complex analysis laboratory visualizing the 2D Argand plane, rotation-dilation multiplication, roots of unity polygons, Euler's identity, and Mandelbrot fractals."
      heroDescription="Unify algebra and 2D planar geometry. Drag complex numbers z₁ and z₂ on the Argand plane to watch multiplication act as simultaneous magnitude scaling and angle rotation, solve n-th roots of unity forming regular polygons, and zoom into infinite fractal boundaries."
      theory="Complex numbers z = a + bi (where i² = -1) extend the 1D real number line into the 2D Argand plane. In polar form, z = r e^(iθ) with modulus r = √(a² + b²) and argument θ = arctan(b/a). Complex multiplication multiplies magnitudes and adds angles: z₁ · z₂ = (r₁ r₂) e^(i(θ₁ + θ₂)). The Mandelbrot set is the collection of complex parameters c for which the quadratic recurrence z_{n+1} = z_n² + c remains bounded starting from z₀ = 0."
      formula="z = a + bi = r e^{i\theta} \quad \text{and} \quad e^{i\pi} + 1 = 0 \quad \text{and} \quad z_{n+1} = z_n^2 + c"
      formulaLabel="Euler's Polar Form & Mandelbrot Complex Recurrence"
      launchUrl="/labs/mathematics/complex-numbers"
      heroImageUrl="/images/mathematics/complex-numbers-hero.png"
      visualLabel="Argand Plane & GPU Fractal Zoomer"
      visualDetail="Interactive Vector Dragger • Roots of Unity (n = 2 to 12) Polygons • Real-Time Mandelbrot & Julia Sets"
      accent={{ primary: "#9333ea", secondary: "#06b6d4", warm: "#f59e0b" }}
      learningObjectives={[
        "Convert complex numbers between Cartesian form (a + bi) and Polar exponential form (r e^(iθ)).",
        "Explain how multiplication by i represents a 90° counterclockwise rotation on the Argand plane.",
        "Calculate and plot the n roots of unity (z^n = 1) forming vertices of regular n-sided polygons.",
        "Compute escape-time iterations to determine membership in the Mandelbrot and filled Julia sets.",
      ]}
      applications={[
        "AC Electrical Engineering & Impedance Phasors (Z = R + jX).",
        "Quantum Mechanics & Wavefunction Phase Evolution (Schrödinger equation).",
        "Signal Processing, Fast Fourier Transform (FFT), and Discrete Cosine Transforms.",
        "Aerodynamics & 2D Conformal Fluid Mapping (Joukowsky airfoil transformations).",
      ]}
      faqs={[
        {
          question: "Why is Euler's Identity e^(iπ) + 1 = 0 considered the most beautiful equation in mathematics?",
          answer:
            "Euler's Identity unifies the five most fundamental constants in mathematics (e, i, π, 1, 0) and the three core arithmetic operations (addition, multiplication, exponentiation) in a single compact equation.",
        },
        {
          question: "What is the boundary between the Mandelbrot Set and Julia Sets?",
          answer:
            "The Mandelbrot set is an atlas in the parameter plane (c) that indexes all possible quadratic polynomial Julia sets. If a point c lies inside the Mandelbrot set, its corresponding Julia set in the dynamic z-plane is connected; if c lies outside, the Julia set is a totally disconnected Cantor dust.",
        },
      ]}
    />
  );
}
