import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Combinatorics & Discrete Counting - Interactive Virtual Math Lab | OpenLabs",
  description:
    "Master combinatorics, permutations, combinations, Pascal's triangle, binomial theorem expansions, and Dirichlet's pigeonhole principle with our interactive mathematics laboratory.",
  keywords: [
    "combinatorics virtual lab",
    "permutations and combinations interactive",
    "pascals triangle visualizer",
    "binomial theorem expansion generator",
    "pigeonhole principle sandbox",
    "stars and bars discrete math",
    "derangements subfactorial",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/combinatorics",
  },
  openGraph: {
    title: "Combinatorics & Discrete Counting - Interactive Virtual Math Lab | OpenLabs",
    description:
      "Explore permutations, combinations, Pascal's triangle, and discrete probability.",
    url: "https://www.openlabs.org.in/mathematics/combinatorics",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/og-image.svg",
        alt: "Combinatorics Studio Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Combinatorics & Discrete Counting - Interactive Virtual Math Lab | OpenLabs",
    description:
      "Interactive discrete mathematics, permutations, combinations, and Pascal's triangle.",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "combinatorics",
  subject: "Mathematics",
  title: "Combinatorics & Discrete Counting",
  description:
    "Master the art of rigorous counting: from permutations and combinations to Pascal's triangle patterns, Dirichlet's pigeonhole principle, stars and bars, and derangements.",
  difficulty: "Intermediate",
  estimatedTime: "25 mins",
  heroDescription:
    "Explore how discrete structures, subsets, arrangements, and combinatorial identities form the analytical backbone of computer algorithms, probability theory, and cryptography.",
  theory: {
    content: `<p><strong>Combinatorics</strong> is the branch of discrete mathematics focused on counting, arrangement, and structural properties of finite sets. It provides essential tools for algorithm analysis, cryptography, discrete probability, statistical mechanics, and network optimization.</p>
    <h3>The Fundamental Principles of Counting</h3>
    <ul>
      <li><strong>Rule of Product (Multiplication Principle):</strong> If task 1 can be done in <code>m</code> ways and task 2 in <code>n</code> ways, both can be done sequentially in <code>m \\times n</code> ways.</li>
      <li><strong>Rule of Sum (Addition Principle):</strong> If task 1 can be done in <code>m</code> ways and task 2 in <code>n</code> mutually exclusive ways, either can be chosen in <code>m + n</code> ways.</li>
    </ul>
    <h3>Permutations vs. Combinations</h3>
    <p>The distinction depends on whether the <strong>order of selection</strong> matters:</p>
    <ul>
      <li><strong>Permutations <code>P(n, r)</code>:</strong> Ordered arrangements of <code>r</code> elements chosen from <code>n</code> distinct items: <code>P(n, r) = \\frac{n!}{(n - r)!}</code>.</li>
      <li><strong>Combinations <code>C(n, r) = \\binom{n}{r}</code>:</strong> Unordered subsets of size <code>r</code> chosen from <code>n</code> distinct items: <code>\\binom{n}{r} = \\frac{n!}{r!(n - r)!}</code>.</li>
      <li><strong>Circular Permutations:</strong> Arranging <code>n</code> items in a loop where rotations are equivalent: <code>(n - 1)!</code>.</li>
    </ul>
    <h3>Pascal's Triangle & The Binomial Theorem</h3>
    <p>Pascal's triangle arranges binomial coefficients <code>\\binom{n}{k}</code> where each number is the sum of the two directly above it: <code>\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}</code>.</p>
    <p>The <strong>Binomial Theorem</strong> states that for any non-negative integer <code>n</code>:</p>
    <p><code>(x + y)^n = \\sum_{k=0}^n \\binom{n}{k} x^{n-k} y^k</code></p>
    <h3>The Pigeonhole Principle</h3>
    <p>If <code>n</code> items are placed into <code>k</code> containers, at least one container must contain at least <code>\\lceil n/k \\rceil</code> items. This deceptively simple principle yields profound proofs in graph theory, number theory, and geometric Ramsey theory.</p>
    <h3>Stars and Bars & Derangements</h3>
    <ul>
      <li><strong>Stars & Bars:</strong> The number of non-negative integer solutions to <code>x_1 + x_2 + \\dots + x_k = n</code> is <code>\\binom{n + k - 1}{k - 1}</code>.</li>
      <li><strong>Derangements <code>!n</code>:</strong> Permutations with zero fixed points: <code>!n = n! \\sum_{k=0}^n \\frac{(-1)^k}{k!}</code>, converging asymptotically to <code>\\frac{n!}{e}</code>.</li>
    </ul>`,
  },
  mathematicalFoundations: {
    equations: [
      "P(n, r) = \\frac{n!}{(n - r)!}",
      "C(n, r) = \\binom{n}{r} = \\frac{n!}{r!(n - r)!}",
      "(x + y)^n = \\sum_{k=0}^n \\binom{n}{k} x^{n-k} y^k",
      "\\text{Stars & Bars (Non-Negative): } \\binom{n + k - 1}{k - 1}",
      "!n = n! \\sum_{k=0}^n \\frac{(-1)^k}{k!} \\approx \\left\\lfloor \\frac{n!}{e} + \\frac{1}{2} \\right\\rfloor",
    ],
    explanation:
      "Discrete counting formulas underpin algorithmic complexity (O(2^n), O(n!)), cryptographic key-space sizing, error-correcting codes, and statistical mechanics partition functions.",
  },
  learningObjectives: [
    "Differentiate between ordered permutations P(n, r) and unordered combinations C(n, r).",
    "Explore Pascal's triangle patterns including Sierpinski mod 2 fractals and Fibonacci diagonals.",
    "Generate and evaluate polynomial expansions using the Binomial Theorem.",
    "Apply Dirichlet's Generalized Pigeonhole Principle to resolve discrete constraint problems.",
    "Model integer partition problems and identical item distribution via Stars and Bars.",
    "Understand derangements (!n) and the asymptotic 1/e convergence of the Hat-Check problem.",
  ],
  realWorldApplications: [
    "Computer algorithm complexity and combinatorial optimization (Traveling Salesperson, Knapsack)",
    "Cryptography (Key permutation space, cipher design, hashing collisions)",
    "Bioinformatics (DNA sequence combinations, genetic codon permutations)",
    "Statistical Mechanics and Thermodynamics (Microstate counting in Maxwell-Boltzmann statistics)",
  ],
  howItWorks:
    "Select counting modes, adjust element pools, inspect Pascal's triangle fractals, distribute pigeons into boxes, and test derangement probabilities in real-time.",
  faqs: [
    {
      question: "When should I use combinations vs permutations?",
      answer:
        "Use Permutations when order or sequence matters (e.g. race rankings, PIN codes). Use Combinations when you are forming an unordered group or committee (e.g. lottery numbers, hand of playing cards).",
    },
    {
      question: "Why does Pascal's triangle contain Fibonacci numbers?",
      answer:
        "Summing the shallow diagonals of Pascal's triangle gives the Fibonacci sequence because the recurrence C(n-1, k-1) + C(n-1, k) mirrors the Fibonacci recurrence F(n) = F(n-1) + F(n-2).",
    },
    {
      question: "What is the probability of a complete derangement?",
      answer:
        "As n increases, the probability that a random permutation is a derangement (no element in its original spot) rapidly converges to 1/e ≈ 36.79%.",
    },
  ],
  relatedExperiments: [],
};

export default function CombinatoricsLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/mathematics/combinatorics"
    />
  );
}
