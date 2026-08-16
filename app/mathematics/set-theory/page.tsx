import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set Theory & Boolean Algebra - Interactive Virtual Math Lab | OpenLabs",
  description:
    "Master set theory, Venn diagrams, and Boolean logic with our interactive virtual mathematics laboratory. Explore set operations, De Morgan's laws, Principle of Inclusion-Exclusion, injective/surjective functions, and truth tables.",
  keywords: [
    "set theory lab",
    "venn diagram simulator",
    "set operations interactive",
    "de morgan laws proof",
    "inclusion exclusion principle",
    "injective surjective bijective",
    "boolean algebra truth table",
    "discrete mathematics",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/set-theory",
  },
  openGraph: {
    title: "Set Theory & Boolean Algebra - Interactive Virtual Math Lab | OpenLabs",
    description:
      "Explore 2-set & 3-set Venn diagrams, set operations, De Morgan's laws, and function mappings.",
    url: "https://www.openlabs.org.in/mathematics/set-theory",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/og-image.svg",
        alt: "Set Theory & Boolean Algebra Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Set Theory & Boolean Algebra - Interactive Virtual Math Lab | OpenLabs",
    description:
      "Explore Venn diagrams, set operations, and function mappings.",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "set-theory",
  subject: "Mathematics",
  title: "Set Theory & Boolean Algebra",
  description:
    "Interactive 2/3-set Venn diagrams, set operations evaluator, Inclusion-Exclusion principle, injective/surjective function mappings, and truth tables.",
  difficulty: "Beginner",
  estimatedTime: "20 mins",
  heroDescription:
    "Explore the bedrock of modern mathematics and formal logic: from subsets, unions, and intersections on Venn diagrams to De Morgan's laws, inclusion-exclusion cardinality, and function bijection.",
  theory: {
    content: `<p>A <strong>Set</strong> is a well-defined collection of distinct mathematical objects called <em>elements</em>. Set theory is the foundational language underlying modern mathematics, probability, database query logic (SQL), and computer science.</p>
    <h3>Fundamental Set Operations</h3>
    <ul>
      <li><strong>Union (<code>A \\cup B</code>):</strong> Elements belonging to set <code>A</code>, set <code>B</code>, or both: <code>\\{x \\mid x \\in A \\lor x \\in B\\}</code>.</li>
      <li><strong>Intersection (<code>A \\cap B</code>):</strong> Elements belonging simultaneously to both sets: <code>\\{x \\mid x \\in A \\land x \\in B\\}</code>.</li>
      <li><strong>Difference (<code>A \\setminus B</code>):</strong> Elements in <code>A</code> that do not belong to <code>B</code>: <code>\\{x \\mid x \\in A \\land x \\notin B\\}</code>.</li>
      <li><strong>Symmetric Difference (<code>A \\Delta B</code>):</strong> Elements in exactly one set: <code>(A \\cup B) \\setminus (A \\cap B)</code>.</li>
      <li><strong>Complement (<code>A'</code> or <code>A^c</code>):</strong> Elements in Universal set <code>U</code> that are not in <code>A</code>: <code>\\{x \\in U \\mid x \\notin A\\}</code>.</li>
    </ul>
    <h3>De Morgan's Laws</h3>
    <p>De Morgan's laws describe how set operations interact with negation and complementation:</p>
    <ul>
      <li><code>(A \\cup B)' = A' \\cap B'</code> (The complement of a union is the intersection of complements).</li>
      <li><code>(A \\cap B)' = A' \\cup B'</code> (The complement of an intersection is the union of complements).</li>
    </ul>
    <h3>Principle of Inclusion-Exclusion (PIE)</h3>
    <p>To compute the cardinality of the union of overlapping sets without double-counting:</p>
    <p><code>|A \\cup B| = |A| + |B| - |A \\cap B|</code></p>
    <p><code>|A \\cup B \\cup C| = |A| + |B| + |C| - (|A \\cap B| + |B \\cap C| + |A \\cap C|) + |A \\cap B \\cap C|</code></p>
    <h3>Relations & Functions (Mappings)</h3>
    <ul>
      <li><strong>Injective (One-to-One):</strong> No two distinct inputs in domain <code>X</code> map to the same output in codomain <code>Y</code> (<code>f(a) = f(b) \\implies a = b</code>).</li>
      <li><strong>Surjective (Onto):</strong> Every element in codomain <code>Y</code> has at least one pre-image in <code>X</code>.</li>
      <li><strong>Bijective:</strong> Both Injective and Surjective (One-to-One Correspondence). Guarantees an inverse function <code>f^{-1}</code> exists.</li>
    </ul>`,
  },
  mathematicalFoundations: {
    equations: [
      "A \\cup B = \\{x \\mid x \\in A \\lor x \\in B\\}",
      "A \\cap B = \\{x \\mid x \\in A \\land x \\in B\\}",
      "(A \\cup B)' = A' \\cap B'",
      "(A \\cap B)' = A' \\cup B'",
      "|A \\cup B| = |A| + |B| - |A \\cap B|",
      "|A \\cup B \\cup C| = \\sum |A_i| - \\sum |A_i \\cap A_j| + |A \\cap B \\cap C|",
    ],
    explanation:
      "Set operations form the mathematical foundation for Boolean algebra in digital circuits, relational algebra in SQL databases, probability sample spaces, and formal mathematical proofs.",
  },
  learningObjectives: [
    "Visualize 2-set and 3-set Venn diagrams with dynamic element placement.",
    "Evaluate compound set expressions including unions, intersections, differences, and symmetric differences.",
    "Verify De Morgan's and Distributive laws through dual-region visual proofs.",
    "Apply the Principle of Inclusion-Exclusion to solve counting and survey problems.",
    "Classify functions as Injective, Surjective, or Bijective using bipartite mapping arrows.",
    "Construct and evaluate propositional logic truth tables.",
  ],
  realWorldApplications: [
    "Relational database queries (SQL INNER JOIN, LEFT JOIN, FULL OUTER JOIN, UNION)",
    "Probability theory sample space event modeling (P(A ∪ B) = P(A) + P(B) - P(A ∩ B))",
    "Digital circuit logic synthesis and Karnaugh maps",
    "Search engine Boolean operators (AND, OR, NOT search filtering)",
  ],
  howItWorks:
    "Toggle between 2-set and 3-set Venn diagrams, add customized elements to see where they land, evaluate custom Boolean expressions, practice Inclusion-Exclusion calculations, and draw function mapping arrows.",
  faqs: [
    {
      question: "What is the difference between subset and proper subset?",
      answer:
        "A ⊆ B means every element of A is in B (A can equal B). A ⊂ B (proper subset) means every element of A is in B, but A ≠ B (B contains at least one element not in A).",
    },
    {
      question: "Why do we subtract pairwise intersections in the Inclusion-Exclusion formula?",
      answer:
        "When adding |A| + |B|, elements in |A ∩ B| are counted twice. Subtracting |A ∩ B| corrects for this double-counting.",
    },
    {
      question: "What makes a function bijective?",
      answer:
        "A function is bijective if and only if it is both injective (every domain element maps to a unique codomain element) and surjective (every codomain element is mapped to). Only bijective functions have a well-defined inverse function f⁻¹.",
    },
  ],
  relatedExperiments: [],
};

export default function SetTheoryLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/mathematics/set-theory"
    />
  );
}
