import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Vector Algebra & 3D Space Projections | OpenLabs",
  description: "Master Vector Algebra, dot and cross products, orthogonal projections, and 3D space with our interactive virtual mathematics laboratory. Explore the Parallelogram Law, Right-Hand Rule, and Parallelepiped volumes.",
  keywords: [
    "vector algebra virtual lab",
    "parallelogram law of vectors",
    "dot product interactive",
    "cross product 3d right hand rule",
    "scalar triple product volume",
    "orthogonal vector projection",
    "mathematics virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/mathematics/vector-algebra",
  },
  openGraph: {
    title: "Vector Algebra & 3D Space Projections | OpenLabs",
    description: "Explore 2D vector operations, dot products, 3D cross products, and scalar triple products in real time.",
    url: "https://www.openlabs.org.in/mathematics/vector-algebra",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/mathematics/vector-algebra-hero.png",
        alt: "Vector Algebra & 3D Space Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vector Algebra & 3D Space Projections | OpenLabs",
    description: "Explore 2D vector operations, dot & cross products, and 3D geometry.",
    images: ["https://www.openlabs.org.in/images/mathematics/vector-algebra-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function VectorAlgebraLandingPage() {
  return (
    <STEMExperimentLanding
      subject="mathematics"
      slug="vector-algebra"
      title="Vector Algebra & 3D Space Projections"
      description="Interactive vector mathematics laboratory exploring 2D vector addition, dot products (work & projections), 3D cross products (torque & area), and scalar triple product volumes."
      heroDescription="Master vector mechanics in 2D and 3D space. Drag vectors u and v to observe the Parallelogram Law of addition, compute orthogonal vector projections (proj_v u), rotate 3D vectors to test the Right-Hand Rule cross product (u × v), and calculate parallelepiped determinant volumes."
      theory="A vector is a geometric entity possessing both magnitude and direction. The Dot Product (u · v = |u||v|cos θ) is an algebraic scalar measuring directional alignment, yielding zero for orthogonal perpendicular vectors. The Cross Product (u × v = |u||v|sin θ n̂) is a 3D vector perpendicular to both operands with magnitude equal to the area of the spanned parallelogram. The Scalar Triple Product u · (v × w) computes the signed volume of the spanned 3D parallelepiped."
      formula="\vec{u} \cdot \vec{v} = |\vec{u}||\vec{v}|\cos\theta \quad \text{and} \quad \vec{u} \times \vec{v} = \begin{vmatrix}\hat{\imath} & \hat{\jmath} & \hat{k} \\ u_x & u_y & u_z \\ v_x & v_y & v_z\end{vmatrix} \quad \text{and} \quad \text{Vol} = |\vec{u} \cdot (\vec{v} \times \vec{w})|"
      formulaLabel="Dot Product, 3x3 Cross Product Determinant & Parallelepiped Volume"
      launchUrl="/labs/mathematics/vector-algebra"
      heroImageUrl="/images/mathematics/vector-algebra-hero.png"
      visualLabel="2D / 3D Vector Workbench & Projections"
      visualDetail="Interactive Vector Dragger • Real-Time Orthogonal Projections • 3D Right-Hand Rule Cross Product"
      accent={{ primary: "#4f46e5", secondary: "#f59e0b", warm: "#06b6d4" }}
      learningObjectives={[
        "Calculate vector sums and differences using component algebra and the geometric Parallelogram Law.",
        "Compute the Dot Product to determine angle θ between vectors and evaluate mechanical work (W = F · d).",
        "Construct 3D Cross Products using 3×3 determinants and determine direction using the Right-Hand Rule.",
        "Calculate the Scalar Triple Product to evaluate coplanarity of three vectors (volume = 0 indicates coplanarity).",
      ]}
      applications={[
        "Aerospace Flight Dynamics & Aircraft Attitude Vectors (pitch, roll, yaw).",
        "Classical Mechanics & Rotational Dynamics (torque τ = r × F and angular momentum L = r × p).",
        "Electromagnetism & Maxwell's Equations (Lorentz force F = q(E + v × B)).",
        "3D Computer Game Physics Engines & Ray Tracing Surface Normal Calculations.",
      ]}
      faqs={[
        {
          question: "Why is the Cross Product anti-commutative (u × v = -(v × u))?",
          answer:
            "By the Right-Hand Rule, reversing the order of the vectors (from u toward v to v toward u) flips the direction your thumb points by 180°, which negates the resulting normal vector: v × u = -(u × v).",
        },
        {
          question: "How does the Dot Product project one vector onto another?",
          answer:
            "The scalar projection of vector u onto vector v is comp_v u = (u · v) / |v| = |u| cos θ. Multiplying this scalar length by the unit vector v̂ gives the orthogonal vector projection proj_v u = [(u · v) / |v|²] v.",
        },
      ]}
    />
  );
}
