import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Mechanical Energy Conservation & Roller Coaster Simulator | Physics Lab | OpenLabs",
  description:
    "Interactive roller coaster energy simulator for kinetic energy, gravitational potential energy, loop-the-loop apex critical velocity, and thermal friction dissipation.",
  keywords: [
    "energy conservation simulator",
    "roller coaster physics simulation",
    "kinetic potential energy interchange",
    "loop the loop critical velocity",
    "centripetal normal force g force",
    "friction thermal dissipation",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/energyconservation",
  },
  openGraph: {
    title: "Mechanical Energy Conservation & Roller Coaster Simulator | Physics Lab | OpenLabs",
    description:
      "Interactive roller coaster energy simulator for kinetic energy, gravitational potential energy, loop-the-loop apex critical velocity, and thermal friction dissipation.",
    url: "https://www.openlabs.org.in/physics/energyconservation",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/physics/energy-conservation-hero.png",
        alt: "Energy Conservation Physics Simulator | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mechanical Energy Conservation & Roller Coaster Simulator | Physics Lab | OpenLabs",
    description:
      "Interactive roller coaster energy simulator for kinetic energy, gravitational potential energy, loop-the-loop apex critical velocity, and thermal friction dissipation.",
    images: ["https://www.openlabs.org.in/images/physics/energy-conservation-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EnergyConservationPage() {
  return (
    <PhysicsExperimentLanding
      slug="energyconservation"
      title="Mechanical Energy Conservation"
      description="Track continuous kinetic, gravitational potential, and thermal energy conversion along custom roller coaster tracks."
      heroDescription="Explore the fundamental law of mechanical energy conservation with interactive roller coaster tracks. Sculpt custom terrain splines, test vertical loop-the-loop critical apex velocities (h_min = 2.5R), inspect real-time floating energy pie charts, and measure normal force G-meter loads."
      theory="The Law of Conservation of Energy states that total energy in an isolated system remains strictly constant: E_total = E_p + E_k + E_th = constant. Gravitational potential energy Ep = mgy converts into kinetic energy Ek = ½mv² as the cart descends. In real systems with friction, non-conservative friction forces fk = μk·mg·cosθ perform negative work, transforming mechanical energy into internal thermal dissipation (Eth)."
      formula="E_{\text{total}} = mgy + \frac{1}{2}mv^2 + \int f_k \, ds = \text{constant}"
      formulaLabel="Conservation of Total Mechanical & Thermal Energy"
      launchUrl="/labs/physics/energyconservation"
      heroImageUrl="/images/physics/energy-conservation-hero.png"
      visualLabel="Interactive Roller Coaster Track Spline Simulation"
      visualDetail="Loop-the-Loop • Floating Energy Pie Chart • G-Force Telemetry"
      accent={{ primary: "#0284c7", secondary: "#10b981", warm: "#f59e0b" }}
      learningObjectives={[
        "Verify the quantitative equivalence between lost gravitational potential energy (ΔEp = mgΔy) and gained kinetic energy (ΔEk = ½mΔv²).",
        "Determine the minimum entry velocity and drop height (h_min = 2.5R) required to complete a vertical circular loop without cart detachment (FN ≥ 0 at apex).",
        "Observe how normal force FN = m(v²/R + g·cosθ) produces intense G-forces in track valleys and weightlessness (0g) at hill crests.",
        "Quantify thermal energy dissipation (Eth = ∫fk ds) across varying track friction coefficients μk and examine oscillatory decay.",
        "Compare energy interchange dynamics across Earth (9.81 m/s²), Moon (1.62 m/s²), Mars (3.72 m/s²), and Jupiter (24.79 m/s²).",
      ]}
      applications={[
        "Theme park thrill ride and loop-the-loop coaster engineering",
        "Automotive regenerative braking and kinetic energy recovery systems (KERS)",
        "Hydroelectric gravity-fed pumped storage power plants",
        "Aerospace orbital trajectory insertion and gravitational slingshots",
        "Civil engineering ski jump slopes and highway runaway truck ramps",
      ]}
      faqs={[
        {
          question: "Why must the initial drop height for a circular loop be at least 2.5 times the loop radius (h ≥ 2.5R)?",
          answer:
            "At the top of the loop (apex), the cart requires a minimum centripetal acceleration ac = v²/R = g so that normal force FN ≥ 0 (critical velocity v_apex = √(gR)). Conserving mechanical energy from release height h to apex height 2R gives mgh = mg(2R) + ½m(gR) = 2.5mgR, proving h_min = 2.5R.",
        },
        {
          question: "Does the mass of the roller coaster cart change its maximum speed on a frictionless track?",
          answer:
            "No. In frictionless motion, mgh = ½mv², which simplifies to v = √(2gh). Mass m cancels out completely, meaning heavy and light carts achieve identical speeds at equal altitudes.",
        },
        {
          question: "What creates the feeling of weightlessness over hill crests?",
          answer:
            "When cresting a curved hill of radius R at speed v, the required centripetal acceleration points downward. The normal force exerted by the seat is FN = m(g - v²/R). When v = √(gR), FN drops to exactly 0, giving riders the sensation of pure zero-G weightlessness.",
        },
        {
          question: "How does friction affect the total energy of the roller coaster system?",
          answer:
            "Friction does not destroy energy; it converts organized macroscopic mechanical energy (PE + KE) into disorganized microscopic internal thermal energy (heat in the wheels and rails), keeping the universe's total energy strictly conserved.",
        },
      ]}
    />
  );
}
