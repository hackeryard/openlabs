import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Interactive Geometry & Triangle Centers | OpenLabs",
  description: "Master Euclidean geometry and geometric constructions with our interactive virtual mathematics laboratory. Explore triangle centers, the Euler line, inscribed circle theorems, and 2D transformations.",
  keywords: [
    "geometry virtual lab",
    "interactive geometry constructions",
    "triangle centers centroid orthocenter",
    "euler line proof",
    "circle theorems interactive",
    "2d transformations rotation reflection",
    "mathematics virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/geometry",
  },
  openGraph: {
    title: "Interactive Geometry Studio | OpenLabs",
    description: "Explore geometric constructions, triangle centers, circle theorems, and 2D transformations in real time.",
    url: "https://www.openlabs.org.in/mathematics/geometry",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/mathematics/geometry-hero.png",
        alt: "Interactive Geometry Studio | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Geometry Studio | OpenLabs",
    description: "Explore geometric constructions, triangle centers, and circle theorems.",
    images: ["https://www.openlabs.org.in/images/mathematics/geometry-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GeometryLandingPage() {
  return (
    <STEMExperimentLanding
      subject="mathematics"
      slug="geometry"
      title="Interactive Geometry & Triangle Centers"
      description="Euclidean geometry laboratory exploring ruler-and-compass constructions, the four triangle centers (Centroid, Incenter, Circumcenter, Orthocenter), the collinear Euler line, and circle theorems."
      heroDescription="Explore the visual beauty and rigorous proof mechanics of Euclidean geometry. Drag triangle vertices in real time to observe the four classical concurrent triangle centers, verify that the Orthocenter, Centroid, and Circumcenter always lie on the Euler line, and test circle angle theorems."
      theory="Euclidean geometry investigates spatial relationships, congruences, similarities, and invariants in 2D space. Every non-degenerate triangle possesses four fundamental concurrent centers: (1) Centroid G (intersection of medians, center of mass), (2) Incenter I (intersection of angle bisectors, center of incircle), (3) Circumcenter O (intersection of perpendicular bisectors, center of circumcircle), and (4) Orthocenter H (intersection of altitudes). Leonhard Euler proved in 1765 that H, G, and O are always collinear on the Euler Line, with HG = 2·GO."
      formula="\text{Euler Line: } H\text{--}G\text{--}O \quad (HG = 2 \cdot GO) \quad \text{and} \quad c^2 = a^2 + b^2 - 2ab\cos C \quad \text{and} \quad \text{Area} = \sqrt{s(s-a)(s-b)(s-c)}"
      formulaLabel="Euler Collinear Ratio, Law of Cosines & Heron's Formula"
      launchUrl="/labs/mathematics/geometry"
      heroImageUrl="/images/mathematics/geometry-hero.png"
      visualLabel="Dynamic Geometric Construction Canvas"
      visualDetail="Interactive Vertex Dragger • Centroid, Incenter, Circumcenter & Orthocenter Toggles • Euler Line Indicator"
      accent={{ primary: "#0284c7", secondary: "#f59e0b", warm: "#10b981" }}
      learningObjectives={[
        "Construct and locate the Centroid (G), Incenter (I), Circumcenter (O), and Orthocenter (H) for acute, right, and obtuse triangles.",
        "Verify Euler's Theorem that H, G, and O are collinear with fixed distance ratio HG : GO = 2 : 1.",
        "Demonstrate circle theorems: Inscribed Angle Theorem (central angle is double the inscribed angle) and Thales' Theorem (semicircle right angle).",
        "Perform 2D isometries (translations, rotations, reflections) and dilations.",
      ]}
      applications={[
        "Structural Architectural Engineering & Truss Load Distribution (centroid center of mass).",
        "Geographic Triangulation & GPS Satellite Positioning (circumcenter intersection).",
        "Computer-Aided Design (CAD) & Solid Modeling Parametric Geometry.",
        "Robotics Kinematics & Inverse Kinematics Linkage Geometry.",
      ]}
      faqs={[
        {
          question: "Where do the triangle centers lie for an obtuse triangle vs an acute triangle?",
          answer:
            "In an acute triangle, all four centers lie strictly inside the triangle. In an obtuse triangle, the Incenter and Centroid remain inside, but the Circumcenter and Orthocenter lie outside the triangle boundary. In a right triangle, the Circumcenter is the midpoint of the hypotenuse, and the Orthocenter coincides with the right-angle vertex.",
        },
        {
          question: "What is the Inscribed Angle Theorem?",
          answer:
            "The Inscribed Angle Theorem states that an angle subtended by an arc at the circumference of a circle is exactly half the angle subtended by the same arc at the circle's center (θ_inscribed = 1/2 θ_central).",
        },
      ]}
    />
  );
}
