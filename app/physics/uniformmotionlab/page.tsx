import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Uniform Motion & Multi-Body Kinematics Studio | OpenLabs",
  description:
    "Interactive linear kinematics physics simulation: uniform motion, constant acceleration, vector overlay dynamics, two-vehicle pursuit races, ticker-tape stroboscopy, and synchronized x-t, v-t, a-t graphs.",
  keywords: [
    "uniform motion simulation",
    "kinematics physics lab",
    "position velocity acceleration graphs",
    "constant acceleration equations",
    "two body pursuit kinematics",
    "ticker tape timer physics",
    "stopping distance formula",
    "Torricelli timeless equation",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/uniformmotionlab",
  },
  openGraph: {
    title: "Uniform Motion & Multi-Body Kinematics Studio | OpenLabs",
    description:
      "Simulate 1D kinematics with live velocity and acceleration vectors, two-vehicle pursuit interception, and synchronized x-t / v-t / a-t curves.",
    url: "https://www.openlabs.org.in/physics/uniformmotionlab",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/physics/uniform-motion-hero.png",
        alt: "Uniform Motion & Kinematics Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uniform Motion & Multi-Body Kinematics Studio | OpenLabs",
    description:
      "Interactive physics studio for linear kinematics, vector dynamics, pursuit races, and synchronized position/velocity graphs.",
    images: ["https://www.openlabs.org.in/images/physics/uniform-motion-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function UniformMotionLabPage() {
  return (
    <PhysicsExperimentLanding
      slug="uniformmotionlab"
      title="Uniform Motion & Kinematics"
      description="Linear kinematics, real-time vector dynamics, two-body pursuit races, ticker-tape stroboscopy, and synchronized x-t, v-t, a-t curves."
      heroDescription="Master 1D kinematics with precision physics. Explore pure uniform motion (a = 0) vs uniform acceleration, visualize real-time velocity and acceleration vectors attached to the moving body, analyze two-vehicle pursuit interception, and inspect synchronized x-t, v-t, and a-t graphs."
      theory="Linear kinematics describes motion without regard to the forces causing it. For constant acceleration a, motion is governed by the Big 4 Kinematic Equations: v(t) = v₀ + at, x(t) = x₀ + v₀t + ½at², v² = v₀² + 2aΔx, and Δx = ½(v₀ + v)t. The instantaneous slope of a position-time graph dx/dt represents velocity, while the slope of a velocity-time graph dv/dt represents acceleration. The shaded area under a velocity-time curve equals displacement Δx."
      formula="v(t) = v_0 + a t \quad \text{and} \quad x(t) = x_0 + v_0 t + \frac{1}{2} a t^2"
      formulaLabel="Fundamental Kinematic Equations of Motion"
      launchUrl="/labs/physics/uniformmotionlab"
      heroImageUrl="/images/physics/uniform-motion-hero.png"
      visualLabel="Kinematics Stage"
      visualDetail="Position x, velocity v, acceleration a, displacement Δx"
      accent={{ primary: "#0284c7", secondary: "#10b981", warm: "#f59e0b" }}
      learningObjectives={[
        "Differentiate between uniform motion (a = 0, constant velocity) and uniformly accelerated motion (a = const).",
        "Interpret geometric slopes (dx/dt = v, dv/dt = a) and areas under curves (∫ v dt = Δx) in real time.",
        "Calculate emergency stopping times (t_stop = v₀/|a|) and minimum braking distances (d_stop = v₀² / 2|a|).",
        "Solve multi-body relative motion and overtaking equations for vehicles with differing initial velocities and accelerations.",
        "Analyze 50 Hz ticker-tape dot spacing patterns to measure velocity and constant acceleration.",
      ]}
      applications={[
        "Automotive braking distance standards and autonomous emergency braking (AEB)",
        "Railway traffic scheduling and block signaling headway distances",
        "High-speed elevator acceleration profile and jerk limiting design",
        "Aerospace runway takeoff roll and landing rollout calculations",
        "Robotics trajectory generation and motion planning algorithms",
      ]}
      faqs={[
        {
          question: "What is the key difference between uniform motion and non-uniform motion?",
          answer:
            "In uniform motion, acceleration is zero, meaning velocity remains constant and an object covers equal distances in equal time intervals. In non-uniform motion, acceleration is non-zero, causing velocity to change over time and producing curved (parabolic) position-time graphs.",
        },
        {
          question: "Why is the area under a velocity-time graph equal to displacement?",
          answer:
            "Because displacement is the time integral of velocity (Δx = ∫ v(t) dt). For a rectangle of height v and width Δt, Area = v · Δt = Δx. For constant acceleration, the trapezoidal area under the line v(t) = v₀ + at yields Δx = v₀t + ½at².",
        },
        {
          question: "How does braking distance scale with initial velocity?",
          answer:
            "According to the timeless kinematic equation v² = v₀² + 2aΔx, setting final velocity v = 0 gives stopping distance d_stop = v₀² / (2|a|). Thus, stopping distance scales quadratically with speed: doubling your speed quadruples the required braking distance.",
        },
        {
          question: "How does a 50 Hz ticker timer measure acceleration?",
          answer:
            "A ticker timer strikes a moving paper tape at fixed time intervals (Δt = 1/50s = 0.02s). In uniform motion, dot spacings Δs are equal. In accelerated motion, consecutive dot intervals increase linearly (Δs₂ - Δs₁ = a · (Δt)²), allowing direct calculation of acceleration.",
        },
      ]}
    />
  );
}
