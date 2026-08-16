import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vector Algebra & 3D Space - Interactive Virtual Math Lab | OpenLabs",
  description:
    "Master Vector Algebra, dot and cross products, orthogonal projections, and 3D space with our interactive virtual mathematics laboratory. Explore the Parallelogram Law, Right-Hand Rule, and Parallelepiped volumes.",
  keywords: [
    "vector algebra virtual lab",
    "parallelogram law of vectors",
    "dot product interactive",
    "cross product 3d right hand rule",
    "scalar triple product volume",
    "orthogonal vector projection",
    "3d lines and planes",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/vector-algebra",
  },
  openGraph: {
    title: "Vector Algebra & 3D Space - Interactive Virtual Math Lab | OpenLabs",
    description:
      "Explore 2D vector operations, dot products, 3D cross products, and scalar triple products.",
    url: "https://www.openlabs.org.in/mathematics/vector-algebra",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/og-image.svg",
        alt: "Vector Algebra & 3D Space Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vector Algebra & 3D Space - Interactive Virtual Math Lab | OpenLabs",
    description:
      "Explore 2D vector operations, dot & cross products, and 3D geometry.",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "vector-algebra",
  subject: "Mathematics",
  title: "Vector Algebra & 3D Space",
  description:
    "Interactive 2D vector operations, Parallelogram Law, Dot Product & projections, 3D Cross Product with Right-Hand Rule, and Scalar Triple Product volumes.",
  difficulty: "Intermediate",
  estimatedTime: "25 mins",
  heroDescription:
    "Master the algebraic and geometric foundations of vectors in 2D and 3D: from displacement and force addition to dot products, cross product torques, and parallelepiped determinants.",
  theory: {
    content: `<p>A <strong>Vector</strong> is a mathematical quantity characterized by both a <em>magnitude</em> (length) and a <em>direction</em>. Vectors serve as the foundational language of linear algebra, electromagnetism, classical mechanics, aerodynamics, and 3D computer graphics.</p>
    <h3>Vector Addition & Parallelogram Law</h3>
    <p>Given two vectors <code>\\vec{u} = (u_x, u_y)</code> and <code>\\vec{v} = (v_x, v_y)</code>:</p>
    <ul>
      <li><strong>Parallelogram Law:</strong> If two vectors are represented in magnitude and direction by two adjacent sides of a parallelogram, their resultant vector <code>\\vec{R} = \\vec{u} + \\vec{v}</code> is given by the diagonal passing through their common origin.</li>
      <li><strong>Magnitude:</strong> <code>|\\vec{R}| = \\sqrt{|\\vec{u}|^2 + |\\vec{v}|^2 + 2|\\vec{u}||\\vec{v}|\\cos\\theta}</code>.</li>
    </ul>
    <h3>The Dot Product (Scalar Product)</h3>
    <p>The dot product measures the degree to which two vectors point in the same direction:</p>
    <p><code>\\vec{u} \\cdot \\vec{v} = u_x v_x + u_y v_y + u_z v_z = |\\vec{u}| |\\vec{v}| \\cos\\theta</code></p>
    <ul>
      <li><strong>Orthogonality Test:</strong> Two non-zero vectors are perpendicular (orthogonal) if and only if <code>\\vec{u} \\cdot \\vec{v} = 0</code>.</li>
      <li><strong>Orthogonal Projection:</strong> <code>\\text{proj}_{\\vec{v}}(\\vec{u}) = \\left(\\frac{\\vec{u} \\cdot \\vec{v}}{|\\vec{v}|^2}\\right) \\vec{v}</code>.</li>
    </ul>
    <h3>The Cross Product (Vector Product)</h3>
    <p>The cross product of two 3D vectors produces a third vector <code>\\vec{w} = \\vec{u} \\times \\vec{v}</code> strictly perpendicular to both <code>\\vec{u}</code> and <code>\\vec{v}</code> according to the Right-Hand Rule:</p>
    <p><code>\\vec{u} \\times \\vec{v} = (u_y v_z - u_z v_y)\\hat{i} + (u_z v_x - u_x v_z)\\hat{j} + (u_x v_y - u_y v_x)\\hat{k}</code></p>
    <p>Its magnitude represents the area of the parallelogram spanned by the two vectors: <code>|\\vec{u} \\times \\vec{v}| = |\\vec{u}||\\vec{v}|\\sin\\theta</code>.</p>
    <h3>The Scalar Triple Product</h3>
    <p>The volume of the parallelepiped formed by three coterminous vectors <code>\\vec{u}, \\vec{v}, \\vec{w}</code> is given by the determinant:</p>
    <p><code>[\\vec{u}, \\vec{v}, \\vec{w}] = \\vec{u} \\cdot (\\vec{v} \\times \\vec{w}) = \\det(M)</code></p>
    <p>Three vectors are coplanar if and only if <code>[\\vec{u}, \\vec{v}, \\vec{w}] = 0</code>.</p>`,
  },
  mathematicalFoundations: {
    equations: [
      "|\\vec{u}| = \\sqrt{u_x^2 + u_y^2 + u_z^2}",
      "\\vec{u} \\cdot \\vec{v} = |\\vec{u}| |\\vec{v}| \\cos\\theta",
      "|\\vec{u} \\times \\vec{v}| = |\\vec{u}| |\\vec{v}| \\sin\\theta",
      "\\text{proj}_{\\vec{v}}(\\vec{u}) = \\frac{\\vec{u} \\cdot \\vec{v}}{|\\vec{v}|^2} \\vec{v}",
      "V_{\\text{parallelepiped}} = |\\vec{u} \\cdot (\\vec{v} \\times \\vec{w})|",
    ],
    explanation:
      "Vectors are essential for physics kinematics (velocity, acceleration, force), torque (τ = r × F), Maxwell's equations in electromagnetism, and vertex transformation pipelines in GPU shaders.",
  },
  learningObjectives: [
    "Visualize 2D vector addition, subtraction, and scalar multiplication via Parallelogram Law.",
    "Calculate dot products and classify angles as acute, orthogonal, or obtuse.",
    "Determine orthogonal projections and perpendicular rejection vectors.",
    "Compute 3D cross products and apply the Right-Hand Rule to determine surface normal vectors.",
    "Calculate the volume of a 3D parallelepiped using the scalar triple product determinant.",
  ],
  realWorldApplications: [
    "Physics mechanics (Force resolution, work W = F · d, torque τ = r × F)",
    "3D Computer Graphics and game development (surface normals, lighting shaders, camera look-at matrices)",
    "Aviation and navigation (wind drift vectors, ground velocity calculation)",
    "Robotics kinematics (end-effector position vectors and joint rotation matrices)",
  ],
  howItWorks:
    "Drag vector heads in the 2D and 3D workspaces to observe real-time vector arithmetic, resultant vectors, dot product projections, cross product normal vectors, and parallelepiped volumes.",
  faqs: [
    {
      question: "What is the difference between dot product and cross product?",
      answer:
        "The dot product u · v yields a scalar (single real number) and measures alignment. The cross product u × v yields a new 3D vector perpendicular to both inputs whose length equals the spanned parallelogram area.",
    },
    {
      question: "How do you know if three 3D vectors are coplanar?",
      answer:
        "Three vectors are coplanar if their scalar triple product [u, v, w] = u · (v × w) = 0, meaning the parallelepiped formed by them has zero volume.",
    },
    {
      question: "Why is the cross product anti-commutative?",
      answer:
        "Swapping the order of vectors inverts the direction of the normal vector according to the right-hand rule, meaning u × v = -(v × u).",
    },
  ],
  relatedExperiments: [],
};

export default function VectorAlgebraLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/mathematics/vector-algebra"
    />
  );
}
