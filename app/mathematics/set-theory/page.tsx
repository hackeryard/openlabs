import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Set Theory & Boolean Algebra | OpenLabs",
  description: "Master set theory, Venn diagrams, and Boolean logic with our interactive virtual mathematics laboratory. Explore set operations, De Morgan's laws, Principle of Inclusion-Exclusion, and function mappings.",
  keywords: [
    "set theory lab",
    "venn diagram simulator",
    "set operations interactive",
    "de morgan laws proof",
    "inclusion exclusion principle",
    "injective surjective bijective",
    "boolean algebra truth table",
    "mathematics virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/set-theory",
  },
  openGraph: {
    title: "Set Theory & Boolean Algebra | OpenLabs",
    description: "Explore 2-set & 3-set Venn diagrams, set operations, De Morgan's laws, and function mappings in real time.",
    url: "https://www.openlabs.org.in/mathematics/set-theory",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/mathematics/set-theory-hero.png",
        alt: "Set Theory & Boolean Algebra Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Set Theory & Boolean Algebra | OpenLabs",
    description: "Explore Venn diagrams, set operations, and function mappings.",
    images: ["https://www.openlabs.org.in/images/mathematics/set-theory-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SetTheoryLandingPage() {
  return (
    <STEMExperimentLanding
      subject="mathematics"
      slug="set-theory"
      title="Set Theory & Boolean Venn Diagrams"
      description="Discrete mathematics laboratory modeling 2-set and 3-set Venn diagrams, Boolean algebraic operations (Union, Intersection, Complement, Symmetric Difference), De Morgan's laws, and function mappings."
      heroDescription="Explore the foundational bedrock of mathematics, database querying, and formal logic. Toggle set regions on interactive 2-set and 3-set Venn diagrams, evaluate Boolean expressions, verify De Morgan's dualities, and classify injective, surjective, and bijective mappings."
      theory="A set is a well-defined collection of distinct mathematical elements. Fundamental operations include Union (A ∪ B), Intersection (A ∩ B), Complement (A'), Relative Difference (A \ B), and Symmetric Difference (A Δ B). The Principle of Inclusion-Exclusion calculates the cardinality of overlapping sets without double-counting, while De Morgan's Laws establish fundamental dualities between Boolean conjunctions and disjunctions."
      formula="|A \cup B| = |A| + |B| - |A \cap B| \quad \text{and} \quad (A \cup B)' = A' \cap B' \quad \text{and} \quad (A \cap B)' = A' \cup B'"
      formulaLabel="Principle of Inclusion-Exclusion & De Morgan's Laws"
      launchUrl="/labs/mathematics/set-theory"
      heroImageUrl="/images/mathematics/set-theory-hero.png"
      visualLabel="Interactive 2-Set & 3-Set Venn Diagram Sandbox"
      visualDetail="Click-to-Shade Venn Regions • Expression Evaluator ((A ∪ B) ∩ C') • Mapping Injectivity Classifier"
      accent={{ primary: "#d97706", secondary: "#0284c7", warm: "#9333ea" }}
      learningObjectives={[
        "Evaluate compound set expressions involving Union, Intersection, Difference, and Complement.",
        "Verify De Morgan's Laws geometrically on 2-set and 3-set Venn diagrams.",
        "Apply the Principle of Inclusion-Exclusion to solve multi-set survey counting problems.",
        "Classify mathematical functions as injective (one-to-one), surjective (onto), or bijective (invertible).",
      ]}
      applications={[
        "Relational Database SQL Query Optimization (INNER JOIN, LEFT JOIN, FULL OUTER JOIN, UNION).",
        "Digital Logic Gate Circuit Design (AND, OR, NOT, NAND, XOR boolean networks).",
        "Probability Theory Sample Space Axioms & Event Calculus (Kolmogorov axioms).",
        "Compiler Design & Lexical Token Analysis (regular expressions and automata theory).",
      ]}
      faqs={[
        {
          question: "How do Venn diagrams relate directly to SQL relational database joins?",
          answer:
            "A SQL INNER JOIN corresponds to the set intersection A ∩ B; a FULL OUTER JOIN corresponds to the union A ∪ B; a LEFT JOIN corresponds to A (including A ∩ B and A \\ B); and a LEFT JOIN WHERE B.id IS NULL corresponds to the set difference A \\ B.",
        },
        {
          question: "What is the difference between an injective and a surjective function?",
          answer:
            "An injective (one-to-one) function maps distinct inputs to distinct outputs (no two elements in domain share the same image). A surjective (onto) function maps to every element in the codomain (the range equals the codomain). A function that is both injective and surjective is bijective and has a unique inverse.",
        },
      ]}
    />
  );
}
