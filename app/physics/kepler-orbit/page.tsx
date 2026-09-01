import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "Kepler Orbit & Gravitational Mechanics Simulator | Physics Lab | OpenLabs",
  description:
    "Interactive celestial mechanics simulation exploring Kepler's 3 laws of planetary motion, elliptical orbital trajectories, Vis-Viva velocity equation, and swept area conservation.",
  keywords: [
    "kepler orbit simulator",
    "keplers laws of planetary motion",
    "elliptical orbits simulation",
    "vis viva equation calculator",
    "orbital mechanics virtual lab",
    "celestial mechanics physics",
    "planetary orbit eccentricity",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/kepler-orbit",
  },
  openGraph: {
    title: "Kepler Orbit & Gravitational Mechanics Simulator | Physics Lab | OpenLabs",
    description:
      "Interactive celestial mechanics simulation exploring Kepler's 3 laws of planetary motion, elliptical orbits, Vis-Viva equation, and swept area conservation.",
    url: "https://www.openlabs.org.in/physics/kepler-orbit",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/physics/kepler-orbit-hero.png",
        alt: "Kepler Orbit Simulator | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kepler Orbit & Gravitational Mechanics Simulator | OpenLabs",
    description:
      "Interactive celestial mechanics simulation exploring Kepler's 3 laws of planetary motion, elliptical orbits, and swept area conservation.",
    images: ["https://www.openlabs.org.in/images/physics/kepler-orbit-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function KeplerOrbitLandingPage() {
  return (
    <PhysicsExperimentLanding
      slug="kepler-orbit"
      title="Kepler Orbit & Gravitational Mechanics"
      description="Simulate elliptical planetary orbits, Kepler's 3 laws, Vis-Viva velocity equations, and equal swept area conservation."
      heroDescription="Explore celestial mechanics with interactive elliptical orbits. Adjust semi-major axis, eccentricity, and stellar mass to observe real-time planetary velocity vectors, perihelion speedups, and Kepler's harmonic law."
      theory="Johannes Kepler formulated three empirical laws governing planetary orbits around the Sun: (1) The Law of Ellipses states that orbits are elliptical with the central star at one focus. (2) The Law of Equal Areas states that a line segment joining a planet to the star sweeps out equal areas during equal intervals of time (dA/dt = L/2m = constant), proving angular momentum conservation. (3) The Harmonic Law states that the square of the orbital period is directly proportional to the cube of the semi-major axis (T² = [4π²/GM]·a³)."
      formula="T^2 = \frac{4\pi^2}{G M} a^3 \quad \text{and} \quad v = \sqrt{G M \left(\frac{2}{r} - \frac{1}{a}\right)}"
      formulaLabel="Kepler's Harmonic Law & Vis-Viva Equation"
      launchUrl="/labs/physics/kepler-orbit"
      heroImageUrl="/images/physics/kepler-orbit-hero.png"
      visualLabel="Precision Analytical Kepler Orbit Engine"
      visualDetail="Newton-Raphson Kepler Solver • Live Swept Sectors • Dynamic Vector Overlays"
      accent={{ primary: "#0284c7", secondary: "#f59e0b", warm: "#10b981" }}
      learningObjectives={[
        "Understand why planetary orbits are ellipses with the Sun at one focus rather than the center.",
        "Demonstrate Kepler's 2nd law by observing equal swept area sector wedges across perihelion and aphelion.",
        "Verify Kepler's 3rd law by measuring orbital period T as semi-major axis a and star mass M vary.",
        "Calculate orbital speeds at perihelion (r_min) and aphelion (r_max) using the Vis-Viva equation.",
      ]}
      applications={[
        "Orbital Trajectory Insertion for interplanetary NASA/ESA spacecraft missions (Hohmann transfer orbits).",
        "Exoplanet Detection & Characterization via Doppler radial velocity and transit timing variations.",
        "Global Positioning System (GPS) and geostationary communications satellite orbital maintenance.",
        "Predicting comet trajectories and close-approach perihelion passages (e.g. Halley's Comet).",
      ]}
      faqs={[
        {
          question: "Why does a planet move faster near perihelion than at aphelion?",
          answer:
            "Because total mechanical energy (E = -GM/2a) and angular momentum (L = m·r·v_perp = constant) are conserved in a central gravitational field. As the planet gets closer to the star (smaller r), gravitational potential energy becomes more negative, converting into higher kinetic energy (higher speed v).",
        },
        {
          question: "What is orbital eccentricity?",
          answer:
            "Eccentricity (e) is a dimensionless measure of how much an orbit deviates from a perfect circle. An eccentricity of e = 0 is a perfect circle, 0 < e < 1 is an ellipse, e = 1 is a parabolic escape trajectory, and e > 1 is a hyperbolic unbound flyby.",
        },
        {
          question: "How does Kepler's 3rd Law depend on the star's mass?",
          answer:
            "Newton's generalization of Kepler's 3rd law shows that T² = (4π² / G(M + m)) · a³. When the central star mass M is doubled, the period T decreases by a factor of 1/√2 (~0.707), meaning planets orbit faster around more massive stars.",
        },
      ]}
    />
  );
}
