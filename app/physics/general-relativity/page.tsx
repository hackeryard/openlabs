// app/physics/general-relativity/page.tsx
import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";

export const metadata: Metadata = {
  title: "General Relativity & Spacetime Simulator | Physics Lab | OpenLabs",
  description:
    "Interactive General Relativity simulator exploring Einstein field equations, 3D rubber-sheet spacetime curvature, Schwarzschild black hole geometry, ray-traced gravitational lensing, and relativistic time dilation.",
  keywords: [
    "general relativity simulator",
    "einstein field equations virtual lab",
    "spacetime curvature simulation",
    "schwarzschild radius calculator",
    "gravitational lensing online",
    "black hole photon sphere",
    "gravitational time dilation simulator",
    "gps relativity physics",
    "physics virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/physics/general-relativity",
  },
  openGraph: {
    title: "General Relativity & Spacetime Simulator | Physics Lab | OpenLabs",
    description:
      "Interactive General Relativity simulator exploring Einstein field equations, 3D rubber-sheet spacetime curvature, Schwarzschild black hole geometry, ray-traced gravitational lensing, and relativistic time dilation.",
    url: "https://www.openlabs.org.in/physics/general-relativity",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/physics/general-relativity-hero.png",
        alt: "General Relativity & Spacetime Simulator | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "General Relativity & Spacetime Simulator | OpenLabs",
    description:
      "Simulate Einstein's General Theory of Relativity: 3D spacetime curvature, black hole gravitational lensing, and relativistic time dilation.",
    images: ["https://www.openlabs.org.in/images/physics/general-relativity-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GeneralRelativityLandingPage() {
  return (
    <PhysicsExperimentLanding
      slug="general-relativity"
      title="General Relativity & Spacetime Curvature"
      description="Simulate Einstein's curved spacetime metric, Schwarzschild black holes, ray-traced gravitational lensing, and relativistic time dilation."
      heroDescription="Explore the geometric fabric of the cosmos. Manipulate massive stellar bodies on an interactive 3D rubber-sheet spacetime manifold, trace photon geodesics past black hole shadows, and observe relativistic clock dilation across gravitational potentials."
      theory="Albert Einstein's General Theory of Relativity (1915) revolutionized gravitation by replacing Newtonian action-at-a-distance forces with dynamic geometric spacetime curvature: matter and energy dictate how spacetime curves (G_μν = 8πG/c⁴ T_μν), while curved spacetime dictates how matter and light move along geodesics. Karl Schwarzschild solved these equations for spherical vacuum geometry, establishing the event horizon radius (r_s = 2GM/c²), photon sphere (1.5 r_s), innermost stable circular orbit (3.0 r_s), gravitational light deflection (α = 4GM/c²b), and gravitational time dilation (dτ = dt_∞ √(1 - r_s/r))."
      formula="G_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu} \\quad \\text{and} \\quad r_s = \\frac{2GM}{c^2}"
      formulaLabel="Einstein Field Equations & Schwarzschild Event Horizon Radius"
      launchUrl="/labs/physics/general-relativity"
      heroImageUrl="/images/physics/general-relativity-hero.png"
      visualLabel="5-Mode Einstein Relativistic Simulation Engine"
      visualDetail="Interactive Geodesic RK4 Integrator • Kerr Ergosphere • Gravitational Waves & LIGO Chirp • Redshift Spectrometer • Penrose Conformal Diagram"
      accent={{ primary: "#0ea5e9", secondary: "#6366f1", warm: "#f43f5e" }}
      learningObjectives={[
        "Calculate the Schwarzschild radius (r_s = 2GM/c²), photon sphere (1.5 r_s), and ISCO (3.0 r_s) for arbitrary stellar masses.",
        "Demonstrate how spacetime curvature produces anomalous perihelion precession (such as Mercury's 42.98 arcsec/century).",
        "Investigate gravitational light deflection, Einstein ring formation, and black hole shadow boundaries.",
        "Quantify gravitational time dilation and evaluate why GPS satellite constellations require relativistic clock corrections of +38.7 μs/day.",
        "Analyze Kerr rotating black holes, frame-dragging ergospheres, and rotational energy extraction via the Penrose process.",
        "Evaluate differential tidal stretching forces and understand why supermassive black holes permit safe horizon crossing while stellar black holes cause lethal spaghettification.",
        "Simulate binary black hole gravitational wave inspirals, calculate chirp mass (ℳ), and analyze strain waveforms h(t) across inspiral, merger, and ringdown.",
        "Map the causal conformal structure of black hole spacetimes using Penrose-Carter diagrams and analyze infalling astronaut worldlines.",
      ]}
      applications={[
        "Global Positioning System (GPS & Galileo) precision atomic clock synchronization (+38.7 μs/day net drift correction).",
        "Event Horizon Telescope (EHT) direct interferometric imaging of supermassive black hole shadows in M87* and Sagittarius A*.",
        "Gravitational Lensing Astrometry for mapping dark matter distribution across galaxy clusters and detecting exoplanets via microlensing.",
        "LIGO, Virgo & KAGRA Gravitational Wave Interferometry detecting binary black hole and neutron star coalescence.",
        "Relativistic Astrophysics: Active Galactic Nuclei (AGN) relativistic jet launching powered by rotating black hole ergospheres (Blandford-Znajek process).",
        "Pound-Rebka & Gravity Probe B satellite experiments testing gravitational redshift and geodetic/frame-dragging precession.",
      ]}
      faqs={[
        {
          question: "What is the Schwarzschild radius and what happens at the event horizon?",
          answer:
            "The Schwarzschild radius (r_s = 2GM/c²) is the physical boundary where the escape velocity of a spherical, non-rotating mass equals the speed of light. Inside this boundary, all future-directed light cones tilt toward the central singularity, making escape impossible for both matter and electromagnetic radiation.",
        },
        {
          question: "Why do GPS satellites need Einstein's General and Special Relativity?",
          answer:
            "GPS satellites orbit Earth at an altitude of 20,200 km where gravity is weaker, causing satellite clocks to tick faster by +45.9 microseconds per day due to general relativity. Simultaneously, their orbital speed of 3.87 km/s causes kinematic time dilation, ticking slower by -7.2 microseconds per day due to special relativity. The combined net drift is +38.7 microseconds per day. Without relativistic corrections, GPS navigation would accumulate approximately 11.6 kilometers of error every day.",
        },
        {
          question: "What is the photon sphere of a black hole?",
          answer:
            "The photon sphere is a spherical boundary at radius r = 1.5 r_s (for a Schwarzschild black hole) where gravity is so strong that photons of light can travel in unstable circular orbits. Any light beam aimed inside this radius inevitably falls into the event horizon.",
        },
        {
          question: "How did gravitational lensing prove General Relativity?",
          answer:
            "In 1919, Sir Arthur Eddington measured the deflection of starlight grazing the Sun during a total solar eclipse. The observed deflection of ~1.75 arcseconds perfectly matched Einstein's General Relativistic prediction (α = 4GM/c²R), which was exactly twice the Newtonian prediction (α = 2GM/c²R), confirming that space itself is curved by mass.",
        },
        {
          question: "What is the Ergosphere and can energy be extracted from a spinning black hole?",
          answer:
            "In a rotating Kerr black hole, the ergosphere is an oblate region outside the event horizon where spacetime itself is dragged into corotation at speeds exceeding the speed of light (frame dragging). In 1969, Roger Penrose demonstrated that a particle entering the ergosphere can split into two pieces, with one fragment falling in on a negative-energy trajectory while the other escapes with more energy than the original particle entered with, extracting rotational energy from the black hole.",
        },
        {
          question: "What causes spaghettification and why can you safely cross a supermassive black hole horizon?",
          answer:
            "Spaghettification is caused by the differential tidal gravitational force between an object's head and feet (Δa = 2GM·Δr / r³). Because the Schwarzschild radius scales linearly with mass (r_s ∝ M), the tidal acceleration at the event horizon scales inversely with the square of mass (Δa_horizon ∝ M / M³ = 1/M²). For a 10 solar mass black hole, tidal forces at the horizon exceed 100,000,000 g's (instantly ripping biological tissue into a stream of atoms). However, for a 4 million solar mass black hole like Sagittarius A*, tidal forces at the event horizon are less than 0.0001 g, allowing an astronaut to cross the event horizon completely unharmed.",
        },
        {
          question: "What are gravitational waves and what was observed in GW150914?",
          answer:
            "Gravitational waves are ripples in the fabric of spacetime produced by accelerating quadrupole mass distributions, propagating at the speed of light. In 2015, the LIGO interferometers made the historic first direct detection (GW150914) from two colliding black holes (36 M☉ and 29 M☉). In the final fractions of a second, 3.0 solar masses were converted directly into pure gravitational wave energy, radiating a peak luminosity exceeding that of all stars in the observable universe combined.",
        },
        {
          question: "What is a Penrose-Carter diagram and how does it illustrate causality?",
          answer:
            "A Penrose-Carter diagram is a two-dimensional conformal representation of spacetime that maps infinite distances and times into a finite diamond while strictly preserving the 45-degree angle of light cones. It visually reveals causal boundaries: future and past null infinity (ℐ⁺, ℐ⁻), spatial infinity (i⁰), the 45-degree event horizon, and the spacelike singularity at r = 0, proving that once inside the horizon, hitting the singularity is as inevitable as moving forward in time.",
        },
      ]}
    />
  );
}
