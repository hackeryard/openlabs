import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Linear Algebra & Matrix Transformations - Interactive Mathematics Lab | OpenLabs",
  description:
    "Master linear algebra with our interactive 2D grid transformation sandbox. Visualize basis vectors î and ĵ, determinant area scaling det(A) = ad - bc, chirality orientation flips, and invariant eigenvectors (Av = λv).",
  keywords: [
    "linear algebra visualizer",
    "matrix transformation 2D grid",
    "basis vectors î and ĵ",
    "determinant geometric meaning",
    "eigenvalues and eigenvectors",
    "shear rotation scaling matrices",
    "interactive math lab",
    "STEM mathematics",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/linear-algebra",
  },
  openGraph: {
    title: "Linear Algebra & Matrix Transformations - Interactive Mathematics Lab | OpenLabs",
    description:
      "Explore 2D coordinate grid transformations, basis vectors, determinant area scaling, and invariant eigenvectors in real time.",
    url: "https://www.openlabs.org.in/mathematics/linear-algebra",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/og-image.svg",
        alt: "Linear Algebra & Matrix Transformations Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Linear Algebra & Matrix Transformations - Interactive Mathematics Lab | OpenLabs",
    description:
      "Explore 2D coordinate transformations, determinants, and invariant eigenvectors.",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "linear-algebra",
  subject: "Mathematics",
  title: "Linear Algebra & Matrix Transformations",
  description:
    "2D coordinate grid transformations, basis vectors î and ĵ, determinant area scaling, and eigenvalues.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription:
    "Discover the geometric intuition behind matrices as linear transformations of space that move the standard basis vectors î and ĵ.",
  theory: {
    content: `<p><strong>Linear Algebra</strong> is the mathematical foundation of modern science, graphics, and artificial intelligence, studying vector spaces, linear mappings, and systems of linear equations.</p>
    <h3>Matrices as Transformations of Space</h3>
    <p>A 2×2 matrix <code>A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}</code> is best understood geometrically not as a grid of numbers, but as a dynamic transformation that maps the standard Cartesian basis vectors:</p>
    <ul>
      <li><code>\\hat{i} = \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} \\longrightarrow \\begin{bmatrix} a \\\\ c \\end{bmatrix}</code> (first column of A)</li>
      <li><code>\\hat{j} = \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix} \\longrightarrow \\begin{bmatrix} b \\\\ d \\end{bmatrix}</code> (second column of A)</li>
    </ul>
    <p>Every vector <code>\\vec{v} = x\\hat{i} + y\\hat{j}</code> transforms linearly to <code>A\\vec{v} = x(A\\hat{i}) + y(A\\hat{j})</code>.</p>
    <h3>The Geometric Meaning of the Determinant</h3>
    <p>The <strong>determinant</strong> <code>\\det(A) = ad - bc</code> measures the factor by which areas are scaled under the transformation:</p>
    <ul>
      <li><strong>|det(A)|:</strong> Area scaling factor (the original unit square of area 1 transforms into a parallelogram of area <code>|\\det(A)|</code>).</li>
      <li><strong>det(A) &gt; 0:</strong> Orientation is preserved (standard counter-clockwise order from î to ĵ).</li>
      <li><strong>det(A) &lt; 0:</strong> Orientation is inverted (space has been flipped like a sheet of paper).</li>
      <li><strong>det(A) = 0:</strong> Space is squished into a lower dimension (1D line or 0D point), rendering the matrix singular and non-invertible.</li>
    </ul>
    <h3>Eigenvalues & Eigenvectors (Av = λv)</h3>
    <p>Most vectors change direction when multiplied by a matrix. However, special vectors called <strong>eigenvectors</strong> remain on their original span line, merely scaled by a factor <code>\\lambda</code> called the <strong>eigenvalue</strong>.</p>`,
  },
  mathematicalFoundations: {
    equations: [
      "A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}",
      "\\det(A) = ad - bc",
      "A^{-1} = \\frac{1}{\\det(A)} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}",
      "\\det(A - \\lambda I) = 0",
      "A\\vec{v} = \\lambda \\vec{v}",
    ],
    explanation:
      "A matrix maps the standard basis vectors î and ĵ to new coordinate axes, while its determinant scales area, and its eigenvectors define invariant rotational axes.",
  },
  learningObjectives: [
    "Visualize how columns of a 2×2 matrix define the landing coordinates of basis vectors î and ĵ.",
    "Understand the determinant as an area scaling factor and recognize orientation flips.",
    "Identify singular matrices where det(A) = 0 and understand why they cannot be inverted.",
    "Solve the characteristic equation λ² - tr(A)λ + det(A) = 0 to find eigenvalues and eigenvectors.",
  ],
  realWorldApplications: [
    "Computer graphics, 3D rotations, perspective projections, and video game camera engines",
    "Machine Learning, Principal Component Analysis (PCA), and dimensional reduction",
    "Quantum mechanics wavefunctions, state vectors, and Hamiltonian operator eigenstates",
    "Structural engineering modal analysis and vibration resonance frequencies",
  ],
  howItWorks:
    "Drag the emerald î or blue ĵ vector handles to directly manipulate the transformation matrix. Watch the coordinate grid warp and observe the live determinant and invariant eigen-lines update in real time.",
  faqs: [
    {
      question: "Why does det(A) = 0 mean a matrix has no inverse?",
      answer:
        "When det(A) = 0, the transformation compresses the 2D plane into a 1D line or a single point. You cannot uniquely reconstruct a 2D plane from a 1D line, so no inverse transformation exists.",
    },
    {
      question: "Can a real matrix have complex eigenvalues?",
      answer:
        "Yes. When a transformation involves pure rotation without pure stretching, no real vector stays on its span line, resulting in complex conjugate eigenvalues α ± βi.",
    },
    {
      question: "What is a shear transformation?",
      answer:
        "A shear slides layers of space parallel to a fixed axis proportional to their perpendicular distance, preserving area (det = 1) while skewing angles.",
    },
  ],
  relatedExperiments: [],
};

export default function LinearAlgebraLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/mathematics/linear-algebra"
    />
  );
}
