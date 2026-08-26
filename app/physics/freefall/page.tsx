import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Free Fall & Terminal Velocity Simulator | Physics Lab | OpenLabs",
  description:
    "Interactive virtual physics studio for exploring free fall in vacuum, aerodynamic drag, terminal velocity, and planetary gravitation across Earth, Moon, Mars, and Jupiter.",
  keywords: [
    "free fall simulator",
    "terminal velocity calculator",
    "Galileo Pisa experiment",
    "Apollo 15 hammer feather",
    "gravity simulator",
    "air resistance simulation",
    "kinematics virtual lab",
    "physics simulation online",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/freefall",
  },
  openGraph: {
    title: "Free Fall & Terminal Velocity Simulator | Physics Lab | OpenLabs",
    description:
      "Interactive virtual physics studio for exploring free fall in vacuum, aerodynamic drag, terminal velocity, and planetary gravitation across Earth, Moon, Mars, and Jupiter.",
    url: "https://www.openlabs.org.in/physics/freefall",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/physics/free-fall-hero.png",
        alt: "Free Fall & Terminal Velocity Simulator | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Fall & Terminal Velocity Simulator | Physics Lab | OpenLabs",
    description:
      "Interactive virtual physics studio for exploring free fall in vacuum, aerodynamic drag, terminal velocity, and planetary gravitation.",
    images: ["https://www.openlabs.org.in/images/physics/free-fall-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FreeFallPage() {
  return (
    <PhysicsExperimentLanding
      slug="freefall"
      title="Free Fall & Terminal Velocity"
      description="Interactive gravitational kinematics and fluid drag simulation studio."
      heroDescription="Explore vertical kinematics under planetary gravitation and aerodynamic drag. Compare dual simultaneous drops in vacuum vs atmosphere, inspect real-time vector overlays, and analyze energy conservation."
      theory="Free fall describes motion governed by gravity. In an ideal vacuum, all bodies accelerate at a = -g independent of mass. When falling through a fluid medium, quadratic drag F_d = ½ρC_dA v² opposes motion until terminal velocity v_t = √(2mg / (ρC_dA)) is reached."
      formula="v_t = \sqrt{\frac{2mg}{\rho C_d A}} \quad \text{and} \quad y(t) = y_0 + v_0 t - \frac{1}{2}gt^2"
      formulaLabel="Terminal Velocity & Kinematic Equation"
      launchUrl="/labs/physics/freefall"
      heroImageUrl="/images/physics/free-fall-hero.png"
      visualLabel="Numerical RK4 Gravity & Fluid Drag Engine"
      visualDetail="Dual Drop Chambers • Stroboscopic Trails • Planetary Gravitation"
      accent={{ primary: "#0284c7", secondary: "#0f766e", warm: "#f97316" }}
      learningObjectives={[
        "Verify Galileo's principle of mass invariance during free fall in vacuum.",
        "Analyze quadratic air drag and identify the onset of terminal velocity (a = 0).",
        "Compare gravitational acceleration across planetary bodies (Earth, Moon, Mars, Jupiter).",
        "Inspect stroboscopic interval spacing reflecting quadratic distance growth (y ∝ t²).",
        "Track mechanical energy conservation (PE + KE) and work dissipated by aerodynamic drag.",
      ]}
      applications={[
        "Aerospace & parachute recovery systems",
        "Planetary atmospheric entry modeling",
        "Ballistics and projectile trajectory design",
        "Skydiving aerodynamics and terminal velocity analysis",
        "Automotive and structural wind drag testing",
      ]}
      faqs={[
        {
          question: "Why do a feather and a bowling ball fall at the same rate in a vacuum?",
          answer:
            "Gravitational force is proportional to mass (F = mg), but acceleration is inversely proportional to mass (a = F/m = mg/m = g). Without air resistance, mass cancels out completely, giving every object identical acceleration.",
        },
        {
          question: "What is terminal velocity and how is it reached?",
          answer:
            "As a falling object speeds up, upward air resistance increases with the square of speed (F_drag ∝ v²). When upward drag exactly balances downward gravitational weight (F_drag = mg), net force becomes zero, acceleration vanishes, and the object continues falling at a constant maximum speed called terminal velocity.",
        },
        {
          question: "How does gravity vary across different planets?",
          answer:
            "Surface gravity depends on a planet's mass and radius (g = GM/R²). For example, Moon gravity is ~1.62 m/s² (1/6th of Earth), Mars is ~3.72 m/s² (38% of Earth), and Jupiter cloud tops reach ~24.79 m/s² (2.5x Earth).",
        },
        {
          question: "What does the stroboscopic flash trail reveal?",
          answer:
            "In vacuum, ghost images captured at equal time intervals (Δt) show increasing distance between snapshots, visually proving that distance grows quadratically with time (y ∝ t²). Once terminal velocity is reached, the spacing becomes constant (y ∝ v_t t).",
        },
      ]}
    />
  );
}
