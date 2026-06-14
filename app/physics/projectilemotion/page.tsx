import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Projectile Motion Experiment - Physics Simulation | OpenLabs",
  description:
    "Learn projectile motion, launch angles, velocity, gravity, range, maximum height, and time of flight with an interactive physics simulation.",
  keywords: ["projectile motion", "physics experiment", "kinematics simulation", "launch angle", "time of flight"],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/projectilemotion",
  },
  openGraph: {
    title: "Projectile Motion Experiment - Physics Simulation | OpenLabs",
    description:
      "Learn projectile motion, launch angles, velocity, gravity, range, maximum height, and time of flight with an interactive physics simulation.",
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
    title: "Projectile Motion Experiment - Physics Simulation | OpenLabs",
    description:
      "Learn projectile motion, launch angles, velocity, gravity, range, maximum height, and time of flight with an interactive physics simulation.",
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
      title="Projectile Motion"
      description="Simulate trajectories and measure range and time of flight in an interactive physics lab."
      heroDescription="Explore kinematics by changing launch speed, angle, and gravity. Watch the projectile trace a path through space and connect the curve with the equations behind it."
      theory="Projectile motion describes an object launched into a gravitational field. In the ideal model without air resistance, horizontal motion stays uniform while vertical motion accelerates downward, producing a parabolic trajectory."
      formula="R = v0^2 sin(2theta) / g"
      formulaLabel="Range relationship"
      launchUrl="/labs/physics/projectilemotion"
      heroImageUrl="/images/physics/projectile-motion-hero.png"
      visualLabel="Trajectory model"
      visualDetail="Angle, velocity, range, height"
      accent={{ primary: "#2563eb", secondary: "#0891b2", warm: "#f97316" }}
      learningObjectives={[
        "Separate horizontal and vertical components of motion.",
        "Measure range, maximum height, and time of flight.",
        "Analyze how launch angle changes trajectory shape.",
        "Connect simulated paths with kinematic equations.",
      ]}
      applications={[
        "Sports ball trajectories",
        "Water fountains and sprinklers",
        "Aerospace launch analysis",
        "Accident and forensics reconstruction",
      ]}
      faqs={[
        {
          question: "What is projectile motion?",
          answer:
            "Projectile motion is the motion of an object launched into the air and acted on mainly by gravity. Its path is called a trajectory.",
        },
        {
          question: "Why does launch angle affect range?",
          answer:
            "The angle controls the balance between vertical lift and horizontal speed. Near 45 degrees gives maximum range in the ideal no-air-resistance model.",
        },
        {
          question: "Does mass affect projectile motion?",
          answer:
            "In a vacuum, mass does not change the trajectory. With air resistance, shape and mass can influence how quickly the object slows down.",
        },
        {
          question: "Why is the path curved?",
          answer:
            "Horizontal velocity continues while gravity accelerates the object downward, combining into a curved parabolic path.",
        },
      ]}
    />
  );
}
