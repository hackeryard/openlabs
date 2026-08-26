import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Calculus, Derivatives & Riemann Integrals | OpenLabs",
  description: "Master differential and integral calculus with our interactive laboratory. Visualize secant-to-tangent limits (h → 0), difference quotients, Riemann sums, and optimization extrema.",
  keywords: [
    "calculus visualizer online",
    "derivative limit definition",
    "secant line tangent convergence",
    "riemann sums interactive",
    "definite integration simpson rule",
    "fundamental theorem of calculus",
    "mathematics virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/calculus",
  },
  openGraph: {
    title: "Calculus, Derivatives & Riemann Integrals | OpenLabs",
    description: "Explore secant-to-tangent limits, difference quotients, Riemann sums, and optimization extrema in real time.",
    url: "https://www.openlabs.org.in/mathematics/calculus",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/mathematics/calculus-hero.png",
        alt: "Calculus & Derivatives Sandbox Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculus, Derivatives & Riemann Integrals | OpenLabs",
    description: "Explore secant-to-tangent limits, Riemann sums, and optimization extrema in real time.",
    images: ["https://www.openlabs.org.in/images/mathematics/calculus-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CalculusLandingPage() {
  return (
    <STEMExperimentLanding
      subject="mathematics"
      slug="calculus"
      title="Calculus, Derivatives & Riemann Integrals"
      description="Interactive mathematical analysis laboratory visualizing secant-to-tangent limits (h → 0), difference quotients, Riemann partition sums, and the Fundamental Theorem of Calculus."
      heroDescription="Bridge the geometric and analytic foundations of rates of change and accumulated area. Drag the step-size delta-x to observe secant lines converge onto instantaneous tangent slopes, and increase partition counts to see Riemann sum bars refine into smooth definite integrals."
      theory="Calculus is the mathematical study of continuous change and accumulation. Differential calculus defines the instantaneous rate of change (derivative) via the limit of difference quotients as h → 0. Integral calculus defines the accumulated area under a curve via the limit of Riemann sums as partition width Δx → 0. The Fundamental Theorem of Calculus links both branches, proving that differentiation and integration are inverse operations."
      formula="f'(x) = \lim_{h \to 0}\frac{f(x+h) - f(x)}{h} \quad \text{and} \quad \int_a^b f(x)\,dx = \lim_{n \to \infty} \sum_{i=1}^n f(x_i^*) \Delta x = F(b) - F(a)"
      formulaLabel="Definition of the Derivative & Fundamental Theorem of Calculus"
      launchUrl="/labs/mathematics/calculus"
      heroImageUrl="/images/mathematics/calculus-hero.png"
      visualLabel="Interactive Tangent & Riemann Sum Workbench"
      visualDetail="Secant-to-Tangent Limit Slider (h → 0) • Left/Right/Midpoint/Trapezoid/Simpson Rules • Partition Count n = 2 to 200"
      accent={{ primary: "#0284c7", secondary: "#10b981", warm: "#f59e0b" }}
      learningObjectives={[
        "Demonstrate how the slope of a secant line approaches the derivative as the interval h shrinks to zero.",
        "Calculate definite integrals numerically using Left-Endpoint, Right-Endpoint, Midpoint, Trapezoidal, and Simpson's rules.",
        "Apply the First and Second Derivative Tests to locate and classify local extrema and points of inflection.",
        "Verify the Fundamental Theorem of Calculus: d/dx [∫ₐˣ f(t) dt] = f(x).",
      ]}
      applications={[
        "Kinematics & Classical Mechanics (position s(t) → velocity v(t) → acceleration a(t)).",
        "Economic Marginal Analysis (Marginal Cost, Marginal Revenue, and Consumer Surplus integrals).",
        "Civil & Structural Engineering (calculating beam deflection, stress concentration, and center of mass).",
        "Probability Theory & Continuous Random Variable Expectation Integrals.",
      ]}
      faqs={[
        {
          question: "How does the limit definition of a derivative resolve the division-by-zero paradox?",
          answer:
            "Calculating the average rate of change over an interval h gives Δy/h. When h is exactly 0, Δy/Δx becomes the undefined indeterminate form 0/0. The mathematical limit investigates the trend of the quotient as h approaches arbitrarily close to 0 without actually reaching 0, yielding a well-defined instantaneous slope.",
        },
        {
          question: "Why is Simpson's Rule more accurate than the Trapezoidal Rule for numerical integration?",
          answer:
            "The Trapezoidal Rule approximates the curve using piecewise linear line segments, whereas Simpson's Rule fits piecewise parabolic quadratic polynomials across pairs of adjacent subintervals, yielding a much higher fourth-order error convergence rate (O(h⁴) vs O(h²)).",
        },
      ]}
    />
  );
}
