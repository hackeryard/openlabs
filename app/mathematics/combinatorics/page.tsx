import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Combinatorics & Discrete Counting | OpenLabs",
  description: "Master combinatorics, permutations, combinations, Pascal's triangle, binomial theorem expansions, and Dirichlet's pigeonhole principle online.",
  keywords: [
    "combinatorics virtual lab",
    "permutations and combinations interactive",
    "pascals triangle visualizer",
    "binomial theorem expansion generator",
    "pigeonhole principle sandbox",
    "stars and bars discrete math",
    "mathematics virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/combinatorics",
  },
  openGraph: {
    title: "Combinatorics & Discrete Counting | OpenLabs",
    description: "Explore permutations, combinations, Pascal's triangle, and discrete probability in real time.",
    url: "https://www.openlabs.org.in/mathematics/combinatorics",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/mathematics/combinatorics-hero.png",
        alt: "Combinatorics Studio Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Combinatorics & Discrete Counting | OpenLabs",
    description: "Interactive discrete mathematics, permutations, combinations, and Pascal's triangle.",
    images: ["https://www.openlabs.org.in/images/mathematics/combinatorics-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CombinatoricsLandingPage() {
  return (
    <STEMExperimentLanding
      subject="mathematics"
      slug="combinatorics"
      title="Combinatorics & Pascal's Binomial Triangle"
      description="Discrete mathematics laboratory modeling Permutations P(n, r), Combinations C(n, r), Pascal's Triangle fractal patterns (Sierpiński triangle), and Binomial expansions."
      heroDescription="Master the art of rigorous discrete counting. Compute ordered permutations and unordered subsets, explore symmetric rows of Pascal's Triangle, evaluate Binomial Theorem polynomial expansions (x + y)^n, and simulate Dirichlet's Pigeonhole Principle."
      theory="Combinatorics investigates arrangements, selections, and structural properties of finite sets. The Fundamental Counting Principle states that independent sequential choices multiply (n₁ · n₂). Permutations count ordered arrangements (P(n, r) = n! / (n - r)!), while Combinations count unordered selections (C(n, r) = n! / (r!(n - r)!)). Pascal's Identity (C(n+1, k) = C(n, k-1) + C(n, k)) builds Pascal's Triangle, whose coefficients provide the exact expansion terms of (x + y)^n via the Binomial Theorem."
      formula="\binom{n}{k} = \frac{n!}{k!(n-k)!} \quad \text{and} \quad (x+y)^n = \sum_{k=0}^n \binom{n}{k} x^{n-k} y^k \quad \text{and} \quad \sum_{k=0}^n \binom{n}{k} = 2^n"
      formulaLabel="Binomial Coefficient, Binomial Theorem & Power Set Identity"
      launchUrl="/labs/mathematics/combinatorics"
      heroImageUrl="/images/mathematics/combinatorics-hero.png"
      visualLabel="Interactive Pascal Triangle & Subset Generator"
      visualDetail="Interactive Rows n = 0 to 16 • Sierpiński Odd/Even Modulo Parity • Live Binomial Expansion Solver"
      accent={{ primary: "#d97706", secondary: "#9333ea", warm: "#f59e0b" }}
      learningObjectives={[
        "Differentiate when to use Permutations (order matters) vs Combinations (order does not matter).",
        "Generate Pascal's Triangle and explore embedded mathematical patterns (Fibonacci diagonals, powers of 2, hockey-stick theorem).",
        "Expand algebraic polynomials (ax + by)^n rapidly using the Binomial Theorem.",
        "Apply the Pigeonhole Principle and Stars and Bars technique to solve distribution problems.",
      ]}
      applications={[
        "Computer Science Algorithm Complexity (time complexity of subset sum and graph search algorithms).",
        "Cybersecurity Password Entropy and Brute-Force Key Space Calculations.",
        "Statistical Mechanics & Entropy (Boltzmann microstate multiplicity W = N! / (n₁! n₂!)).",
        "Game Theory and Casino Poker Hand Probability Calculations.",
      ]}
      faqs={[
        {
          question: "How is Pascal's Triangle connected to the Sierpiński Triangle fractal?",
          answer:
            "Coloring all the odd numbers in Pascal's Triangle with one color and all even numbers with another reveals the exact self-similar fractal pattern of the Sierpiński Triangle modulo 2.",
        },
        {
          question: "What is the 'Stars and Bars' method in combinatorics?",
          answer:
            "Stars and Bars is a combinatorial technique used to find the number of ways to distribute 'n' identical items (stars) into 'k' distinct bins (separated by k-1 bars). The total number of valid distributions is given by C(n + k - 1, k - 1).",
        },
      ]}
    />
  );
}
