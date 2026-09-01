import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Linear Algebra & Matrix Transformations | OpenLabs",
  description: "Master linear algebra with our interactive 2D grid transformation sandbox. Visualize basis vectors î and ĵ, determinant area scaling, and eigenvectors (Av = λv).",
  keywords: [
    "linear algebra visualizer",
    "matrix transformation 2D grid",
    "basis vectors î and ĵ",
    "determinant geometric meaning",
    "eigenvalues and eigenvectors",
    "shear rotation scaling matrices",
    "mathematics virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/linear-algebra",
  },
  openGraph: {
    title: "Linear Algebra & Matrix Transformations | OpenLabs",
    description: "Explore 2D coordinate grid transformations, basis vectors, determinant area scaling, and invariant eigenvectors in real time.",
    url: "https://www.openlabs.org.in/mathematics/linear-algebra",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/mathematics/linear-algebra-hero.png",
        alt: "Linear Algebra & Matrix Transformations Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Linear Algebra & Matrix Transformations | OpenLabs",
    description: "Explore 2D coordinate transformations, determinants, and invariant eigenvectors.",
    images: ["https://www.openlabs.org.in/images/mathematics/linear-algebra-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LinearAlgebraLandingPage() {
  return (
    <STEMExperimentLanding
      subject="mathematics"
      slug="linear-algebra"
      title="Linear Algebra & Matrix Transformations"
      description="Interactive linear algebra laboratory visualizing 2D coordinate space warping, basis vector tracking (î & ĵ), geometric determinant area scaling, and invariant eigenvectors."
      heroDescription="Discover the geometric intuition behind matrices. Manipulate 2×2 transformation matrices in real time, observe the coordinate grid warp into parallel lines, track determinant area changes (det(A) = ad - bc), and find invariant eigenvector spans (A v = λ v)."
      theory="A 2×2 matrix A = [[a, b], [c, d]] represents a linear transformation of 2D space. The columns of the matrix specify where the standard basis vectors land: î = (1, 0) transforms to (a, c) and ĵ = (0, 1) transforms to (b, d). The determinant det(A) = ad - bc measures the factor by which area scales under the transformation; a negative determinant indicates a spatial orientation (chirality) inversion. Eigenvectors are non-zero vectors whose direction remains completely unchanged by the transformation, only scaled by factor λ."
      formula="A\vec{v} = \lambda\vec{v} \quad \text{and} \quad \det(A - \lambda I) = 0 \quad \text{and} \quad \det\begin{pmatrix}a & b \\ c & d\end{pmatrix} = ad - bc"
      formulaLabel="Characteristic Eigenvalue Equation & 2×2 Matrix Determinant"
      launchUrl="/labs/mathematics/linear-algebra"
      heroImageUrl="/images/mathematics/linear-algebra-hero.png"
      visualLabel="2D Grid Linear Transformation Sandbox"
      visualDetail="Interactive Matrix Entry • Rotation, Shear & Reflection Presets • Live Eigenvector Ray Visualization"
      accent={{ primary: "#4f46e5", secondary: "#06b6d4", warm: "#f59e0b" }}
      learningObjectives={[
        "Explain geometrically how any 2×2 matrix transforms the unit square and coordinate basis vectors î and ĵ.",
        "Interpret the determinant as a signed area scaling factor (det(A) = 0 indicates dimension collapse).",
        "Compute eigenvalues by finding roots of the characteristic polynomial det(A - λI) = 0.",
        "Construct rotation matrices R(θ), shear matrices, and projection matrices.",
      ]}
      applications={[
        "Computer Graphics & 3D Game Engines (model-view-projection camera matrix pipelines).",
        "Machine Learning & Artificial Intelligence (Principal Component Analysis dimensionality reduction).",
        "Quantum Mechanics (Hermitian state observables and unitary time-evolution operators).",
        "Search Engine PageRank Algorithms (dominant eigenvector computation on transition matrices).",
      ]}
      faqs={[
        {
          question: "What does it mean geometrically when the determinant of a matrix is zero (det(A) = 0)?",
          answer:
            "A determinant of zero means the transformation collapses the 2D plane into a lower dimension—either squashing all of 2D space onto a 1D line or into a single 0D point at the origin. Because information is lost (multiple input vectors map to the same output), the matrix has no inverse (A⁻¹ does not exist).",
        },
        {
          question: "Why are eigenvectors and eigenvalues so important in science?",
          answer:
            "Eigenvectors identify the natural 'axes' of a linear transformation where the action behaves simply as scalar multiplication. In physics, they represent principal axes of inertia and resonant vibrational modes; in data science (PCA), they point along the directions of maximum data variance.",
        },
      ]}
    />
  );
}
