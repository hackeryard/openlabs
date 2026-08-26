import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Projectile Motion & Ballistics Simulator | Physics Lab | OpenLabs",
  description:
    "Interactive 2D projectile motion and ballistics simulator. Explore launch angles, elevation cliffs, air drag, target striking, and planetary gravitation in browser.",
  keywords: [
    "projectile motion simulator",
    "ballistics virtual lab",
    "kinematics simulation 2D",
    "launch angle maximum range",
    "air drag trajectory",
    "trajectory calculator online",
    "time of flight formula",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/projectilemotion",
  },
  openGraph: {
    title: "Projectile Motion & Ballistics Simulator | Physics Lab | OpenLabs",
    description:
      "Interactive 2D projectile motion and ballistics simulator. Explore launch angles, elevation cliffs, air drag, target striking, and planetary gravitation.",
    url: "https://www.openlabs.org.in/physics/projectilemotion",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/physics/projectile-motion-hero.png",
        alt: "Projectile Motion Simulator | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projectile Motion & Ballistics Simulator | Physics Lab | OpenLabs",
    description:
      "Interactive 2D projectile motion and ballistics simulator. Explore launch angles, elevation cliffs, air drag, and planetary gravitation.",
    images: ["https://www.openlabs.org.in/images/physics/projectile-motion-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ProjectileMotionPage() {
  return (
    <PhysicsExperimentLanding
      slug="projectilemotion"
      title="Projectile Motion & Ballistics"
      description="Simulate 2D trajectories, elevation platforms, wind resistance, and target ballistics."
      heroDescription="Explore 2D projectile kinematics by adjusting launch speed, rotary cannon angle, elevation cliffs, and wind resistance. Compare multiple trajectory trails and strike dynamic targets."
      theory="Projectile motion combines independent horizontal and vertical kinematics. Without drag, horizontal velocity remains constant (vx = v0 cos θ) while vertical velocity decelerates under gravity (vy = v0 sin θ - gt), yielding a parabolic trajectory. With fluid drag, quadratic resistance F_d = ½ρCd A v² steepens the descent into an asymmetric tear-drop arc."
      formula="R = \frac{v_0^2 \sin(2\theta)}{g} \quad \text{and} \quad H_{\max} = y_0 + \frac{v_0^2 \sin^2\theta}{2g}"
      formulaLabel="Horizontal Range & Maximum Apex Height"
      launchUrl="/labs/physics/projectilemotion"
      heroImageUrl="/images/physics/projectile-motion-hero.png"
      visualLabel="Numerical RK4 2D Ballistics Engine"
      visualDetail="Multi-Trajectory Overlays • Rotary Cannon • Target Strike Mode"
      accent={{ primary: "#2563eb", secondary: "#0891b2", warm: "#f97316" }}
      learningObjectives={[
        "Separate 2D motion into independent horizontal (ax = 0) and vertical (ay = -g) components.",
        "Demonstrate why 45° yields maximum range on level ground, and how elevation cliffs shift the optimum angle below 45°.",
        "Verify why complementary angle pairs (e.g. 30° & 60°) produce identical horizontal range in vacuum.",
        "Analyze aerodynamic drag asymmetry and how crosswinds deflect trajectory paths.",
        "Calculate time of flight, apex peak coordinates, and impact velocity vectors.",
      ]}
      applications={[
        "Ballistics and artillery fire-control systems",
        "Sports kinematics (golf, baseball, basketball, soccer)",
        "Rocket staging and missile launch trajectories",
        "Water jet and agricultural irrigation sprinkler engineering",
        "Accident reconstruction and forensic projectile tracking",
      ]}
      faqs={[
        {
          question: "Why do complementary launch angles (like 30° and 60°) give the same range on level ground?",
          answer:
            "In vacuum, range is given by R = (v0² sin 2θ) / g. Because sin(2 · 30°) = sin 60° = √3/2 and sin(2 · 60°) = sin 120° = √3/2, any two angles that sum to 90° produce identical horizontal distance, though the higher angle has greater apex height and longer flight time.",
        },
        {
          question: "Why does launching from an elevated cliff change the optimal angle to less than 45°?",
          answer:
            "When launching from an elevation y0 > 0, the projectile spends extra time falling below the launch height. Because gravity has more time to act, a lower launch angle (higher horizontal speed component vx) maximizes total horizontal displacement before ground impact.",
        },
        {
          question: "How does air resistance change the parabolic curve?",
          answer:
            "Quadratic fluid drag opposes instantaneous velocity in both x and y dimensions. It continuously bleeds horizontal momentum, causing the projectile to fall more steeply on descent and turning the symmetric parabola into an asymmetric tear-drop shape.",
        },
        {
          question: "How does planetary gravity affect projectile range?",
          answer:
            "Range is inversely proportional to gravity (R ∝ 1/g). On the Moon where gravity is 1/6th of Earth (1.62 m/s²), the same launch velocity produces roughly 6 times the range and 2.45 times the flight duration.",
        },
      ]}
    />
  );
}
