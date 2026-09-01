import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Quadratic & Polynomial Explorer | OpenLabs",
  description: "Master quadratic equations, parabolic geometry, discriminant analysis (Δ = b² - 4ac), higher-degree polynomials, and synthetic division online.",
  keywords: [
    "quadratic equations simulation",
    "parabola vertex calculator",
    "discriminant analysis delta",
    "polynomial roots visualizer",
    "synthetic division interactive",
    "fundamental theorem of algebra",
    "mathematics virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/polynomials",
  },
  openGraph: {
    title: "Quadratic & Polynomial Explorer | OpenLabs",
    description: "Explore parabolic vertices, discriminant analysis, and higher-degree polynomials in real time.",
    url: "https://www.openlabs.org.in/mathematics/polynomials",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/mathematics/polynomials-hero.png",
        alt: "Quadratic & Polynomial Explorer Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quadratic & Polynomial Explorer | OpenLabs",
    description: "Explore parabolic vertices, discriminant analysis, and higher-degree polynomials.",
    images: ["https://www.openlabs.org.in/images/mathematics/polynomials-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PolynomialsLandingPage() {
  return (
    <STEMExperimentLanding
      subject="mathematics"
      slug="polynomials"
      title="Polynomials & Discriminant Studio"
      description="Algebraic mathematics laboratory exploring quadratic parabolas, discriminant root classifications (Δ > 0, Δ = 0, Δ < 0), synthetic division, and polynomial turning points."
      heroDescription="Explore polynomial algebra from linear and quadratic equations up to degree-5 quintics. Adjust coefficients in real time to observe root bifurcations, vertex shifts, focus-directrix geometry, and polynomial factorizations."
      theory="A polynomial function P(x) = a_n x^n + ... + a_1 x + a_0 has degree n. By the Fundamental Theorem of Algebra, every degree-n polynomial with complex coefficients has exactly n complex roots (counted with multiplicity). For quadratic equations (ax² + bx + c = 0), the discriminant Δ = b² - 4ac governs root nature: Δ > 0 yields two distinct real roots, Δ = 0 yields one repeated real root, and Δ < 0 yields a complex conjugate pair on the Argand plane."
      formula="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} \quad \text{and} \quad \Delta = b^2 - 4ac \quad \text{and} \quad \text{Vertex: } \left(-\frac{b}{2a}, c - \frac{b^2}{4a}\right)"
      formulaLabel="Quadratic Formula, Discriminant & Parabolic Vertex"
      launchUrl="/labs/mathematics/polynomials"
      heroImageUrl="/images/mathematics/polynomials-hero.png"
      visualLabel="Dynamic Polynomial Curve & Root Analyzer"
      visualDetail="Interactive Degree 1–5 Selector • Discriminant Root Classifier • Live Synthetic Division Steps"
      accent={{ primary: "#d97706", secondary: "#9333ea", warm: "#f43f5e" }}
      learningObjectives={[
        "Calculate the vertex (h, k), axis of symmetry, focus, and directrix of any quadratic parabola.",
        "Predict root nature (two real, one repeated, or two complex conjugate) using the discriminant Δ = b² - 4ac.",
        "Perform synthetic polynomial division to test root candidates using the Remainder and Factor Theorems.",
        "Relate polynomial degree n to the maximum number of turning points (n - 1) and inflection points (n - 2).",
      ]}
      applications={[
        "Aerodynamics & Architectural Parabolic Arches (cables and satellite dish focal reflection).",
        "Economic Profit Maximization & Revenue Parabolic Curves (finding vertex maximums).",
        "Computer-Aided Design (CAD) & Spline Curve Interpolation (Bézier polynomials).",
        "Signal Filtering & Control Systems Pole-Zero Root Locus Analysis.",
      ]}
      faqs={[
        {
          question: "What happens geometrically when the discriminant Δ < 0?",
          answer:
            "When Δ < 0, the parabola never crosses or touches the x-axis in the real Cartesian plane (it floats entirely above or below the axis). Its two roots are complex numbers with imaginary components: x = (-b ± i√|Δ|) / (2a).",
        },
        {
          question: "How does the leading coefficient 'a' dictate polynomial end behavior?",
          answer:
            "For even-degree polynomials (quadratic, quartic), if a > 0, both ends rise to +∞; if a < 0, both ends fall to -∞. For odd-degree polynomials (cubic, quintic), if a > 0, the graph falls to the left and rises to the right; if a < 0, it rises to the left and falls to the right.",
        },
      ]}
    />
  );
}
