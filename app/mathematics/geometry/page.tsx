import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Geometry Studio - Virtual Math Lab | OpenLabs",
  description:
    "Master Euclidean geometry and geometric constructions with our interactive virtual mathematics laboratory. Explore triangle centers, the Euler line, inscribed circle theorems, 2D transformations, and regular polygons.",
  keywords: [
    "geometry virtual lab",
    "interactive geometry constructions",
    "triangle centers centroid orthocenter",
    "euler line proof",
    "circle theorems interactive",
    "2d transformations rotation reflection",
    "regular polygon apothem",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/geometry",
  },
  openGraph: {
    title: "Interactive Geometry Studio - Virtual Math Lab | OpenLabs",
    description:
      "Explore geometric constructions, triangle centers, circle theorems, and 2D transformations.",
    url: "https://www.openlabs.org.in/mathematics/geometry",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/og-image.svg",
        alt: "Interactive Geometry Studio | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Geometry Studio - Virtual Math Lab | OpenLabs",
    description:
      "Explore geometric constructions, triangle centers, and circle theorems.",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "geometry",
  subject: "Mathematics",
  title: "Interactive Geometry Studio",
  description:
    "Construct dynamic geometric figures, explore triangle centers (Centroid, Incenter, Circumcenter, Orthocenter) and the Euler line, verify circle theorems, and perform 2D rigid transformations.",
  difficulty: "Beginner",
  estimatedTime: "25 mins",
  heroDescription:
    "Explore the visual beauty and rigorous proof mechanics of Euclidean geometry: from classic ruler-and-compass constructions to the collinear Euler line, circle angle theorems, and transformation symmetries.",
  theory: {
    content: `<p><strong>Euclidean Geometry</strong> is the mathematical study of points, lines, angles, surfaces, and solids based on axioms formulated by Euclid of Alexandria around 300 BCE.</p>
    <h3>The Four Classical Triangle Centers</h3>
    <ul>
      <li><strong>Centroid (<code>G</code>):</strong> The intersection of the 3 medians (lines connecting each vertex to the midpoint of the opposite side). The centroid divides each median in a <code>2:1</code> ratio and represents the physical center of mass.</li>
      <li><strong>Circumcenter (<code>O</code>):</strong> The intersection of the 3 perpendicular bisectors. It is the center of the unique <em>circumcircle</em> that passes through all 3 vertices.</li>
      <li><strong>Incenter (<code>I</code>):</strong> The intersection of the 3 internal angle bisectors. It is equidistant from all three sides and forms the center of the <em>incircle</em>.</li>
      <li><strong>Orthocenter (<code>H</code>):</strong> The intersection of the 3 altitudes (perpendiculars dropped from vertices to opposite sides). Located outside the triangle for obtuse triangles.</li>
    </ul>
    <h3>The Euler Line Theorem</h3>
    <p>In 1765, Leonhard Euler proved that for any non-equilateral triangle, the <strong>Orthocenter (<code>H</code>)</strong>, <strong>Centroid (<code>G</code>)</strong>, and <strong>Circumcenter (<code>O</code>)</strong> are strictly collinear, satisfying the constant ratio:</p>
    <p><code>HG = 2 \\cdot GO</code></p>
    <h3>Fundamental Circle Theorems</h3>
    <ul>
      <li><strong>Inscribed Angle Theorem:</strong> The angle subtended by an arc at the center is double the angle subtended by it at any point on the circumference: <code>\\angle AOB = 2\\angle ACB</code>.</li>
      <li><strong>Thales' Theorem:</strong> The angle inscribed in a semicircle is always a right angle (<code>90^\\circ</code>).</li>
      <li><strong>Cyclic Quadrilateral Theorem:</strong> Opposite interior angles of an inscribed quadrilateral always sum to <code>180^\\circ</code> (<code>\\angle A + \\angle C = 180^\\circ</code>).</li>
    </ul>`,
  },
  mathematicalFoundations: {
    equations: [
      "G = \\frac{A + B + C}{3}",
      "I = \\frac{aA + bB + cC}{a + b + c}",
      "HG = 2 \\cdot GO \\quad (\\text{Euler Line Relation})",
      "\\angle AOB = 2 \\angle ACB \\quad (\\text{Inscribed Angle Theorem})",
      "\\text{Area} = \\sqrt{s(s-a)(s-b)(s-c)} \\quad (\\text{Heron's Formula})",
      "\\text{Area}_{\\text{polygon}} = \\frac{1}{2} n r^2 \\sin\\left(\\frac{2\\pi}{n}\\right)",
    ],
    explanation:
      "Geometric principles underpin architectural design, computer graphics rendering engines, GPS trilateration, robotics kinematics, and computer-aided design (CAD).",
  },
  learningObjectives: [
    "Construct dynamic points, lines, segments, circles, and midpoints with coordinate tracking.",
    "Visualize the 4 classical triangle centers and verify Euler line collinearity.",
    "Verify the Inscribed Angle Theorem and Thales' right angle theorem on interactive circles.",
    "Apply 2D geometric transformations: translation, rotation, reflection, and dilation.",
    "Calculate interior angles, exterior angles, apothems, and exact areas of regular n-gons.",
  ],
  realWorldApplications: [
    "Computer graphics rasterization, 3D meshes, and game physics engines",
    "Computer-Aided Design (CAD) and mechanical engineering drafting",
    "Architecture, structural truss triangulation, and geodesic dome construction",
    "Geographic Information Systems (GIS) and GPS satellite trilateration",
  ],
  howItWorks:
    "Drag control points to reshape triangles and circles in real-time, toggle triangle center overlays, inspect angle readouts for circle theorems, and adjust transformation sliders to see image polygons evolve.",
  faqs: [
    {
      question: "Why does the orthocenter move outside the triangle for obtuse triangles?",
      answer:
        "In an obtuse triangle, two of the altitudes must be drawn to the extensions of the opposite sides because the obtuse angle pushes the vertices past the perpendicular drop-off, causing the three altitude lines to intersect outside.",
    },
    {
      question: "Why is the Euler line undefined for equilateral triangles?",
      answer:
        "In an equilateral triangle, the Centroid, Incenter, Circumcenter, and Orthocenter all coincide at the exact same point (G = I = O = H), so no unique line can be drawn between them.",
    },
    {
      question: "What is an apothem in a regular polygon?",
      answer:
        "The apothem is the perpendicular distance from the center of a regular polygon to the midpoint of any of its sides (a = r · cos(π/n)). It acts as the height of each triangulation sector.",
    },
  ],
  relatedExperiments: [],
};

export default function GeometryLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/mathematics/geometry"
    />
  );
}
