import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Function Grapher & Curve Transformations | OpenLabs",
  description: "Plot mathematical functions in real time, explore curve transformations, inspect roots and extrema, calculate tangents, and approximate integrals.",
  keywords: [
    "function grapher online",
    "math graphing calculator",
    "curve transformations",
    "roots of polynomials",
    "local extrema visualizer",
    "tangent line slope",
    "definite integral simpson rule",
    "mathematics virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/functiongrapher",
  },
  openGraph: {
    title: "Function Grapher & Curve Transformations | OpenLabs",
    description: "Plot mathematical functions in real time, explore curve transformations, inspect roots and extrema, and calculate tangents.",
    url: "https://www.openlabs.org.in/mathematics/functiongrapher",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/mathematics/functiongrapher-hero.png",
        alt: "Function Grapher Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Function Grapher & Curve Transformations | OpenLabs",
    description: "Plot mathematical functions in real time, explore curve transformations, and inspect roots.",
    images: ["https://www.openlabs.org.in/images/mathematics/functiongrapher-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FunctionGrapherLandingPage() {
  return (
    <STEMExperimentLanding
      subject="mathematics"
      slug="functiongrapher"
      title="Function Grapher & Curve Transformations"
      description="Interactive real-time function plotter with geometric curve transformations, numerical root-finding, local extrema detection, and tangent slopes."
      heroDescription="Explore continuous functions, polynomial roots, amplitude and frequency scalings, horizontal/vertical translations, and numerical tangents in a real-time vector mathematical sandbox."
      theory="A function f: X → Y maps each input element x in domain X to a unique output f(x) in range Y. Geometric transformations of a base function f(x) are defined by g(x) = a · f(b(x - c)) + d, where 'a' represents vertical stretching/reflection, 'b' represents horizontal compression/reflection, 'c' controls horizontal phase shift, and 'd' dictates vertical translation. Stationary points occur where the first derivative equals zero (f'(x) = 0), and inflection points occur where concavity changes sign (f''(x) = 0)."
      formula="g(x) = a \cdot f\big(b(x - c)\big) + d \quad \text{and} \quad f'(x_0) = \lim_{h \to 0}\frac{f(x_0+h) - f(x_0)}{h}"
      formulaLabel="Universal Transformation Equation & Newton-Raphson Secant Limit"
      launchUrl="/labs/mathematics/functiongrapher"
      heroImageUrl="/images/mathematics/functiongrapher-hero.png"
      visualLabel="Real-Time D3 Function Plotter"
      visualDetail="Polynomial, Trigonometric & Exponential Libraries • Roots & Extrema Markers • Dynamic Tangent Line"
      accent={{ primary: "#d97706", secondary: "#0284c7", warm: "#f59e0b" }}
      learningObjectives={[
        "Apply parameter shifts a, b, c, d to predict the geometric transformation of parent algebraic and trigonometric curves.",
        "Locate polynomial real roots (x-intercepts) using numerical Newton-Raphson iteration.",
        "Classify local maxima, local minima, and stationary points of inflection using the Second Derivative Test.",
        "Calculate the instantaneous slope of a secant line as Δx approaches zero.",
      ]}
      applications={[
        "Aerospace Trajectory Optimization & Orbital Velocity Curves.",
        "Signal Processing & Fourier Harmonic Decomposition (audio engineering and telecommunications).",
        "Financial Quantitative Modeling (Black-Scholes option pricing curves and risk surfaces).",
        "Machine Learning Loss Function Visualization and Gradient Descent Optimization.",
      ]}
      faqs={[
        {
          question: "How does the parameter 'c' inside f(x - c) shift a function horizontally?",
          answer:
            "When replacing x with (x - c), the input value must be 'c' units larger to evaluate the same output as the original f(x). Consequently, a positive 'c' shifts the curve to the right by c units, while a negative 'c' (as in f(x + c)) shifts it to the left.",
        },
        {
          question: "How does the Second Derivative Test distinguish a local maximum from a local minimum?",
          answer:
            "At a stationary critical point where f'(c) = 0: if f''(c) > 0, the curve is concave up (smile shape), indicating a local minimum; if f''(c) < 0, the curve is concave down (frown shape), indicating a local maximum; if f''(c) = 0, the test is inconclusive.",
        },
      ]}
    />
  );
}
