import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Ideal Gas Laws & Maxwell-Boltzmann Kinetic Theory Virtual Lab | OpenLabs",
  description: "Simulate Boyle's Law, Charles's Law, Gay-Lussac's Law, and Maxwell-Boltzmann molecular speed distributions with interactive 2D elastic particle collision physics online.",
  keywords: [
    "gas laws simulation online",
    "boyles law virtual lab",
    "charles law simulator",
    "maxwell boltzmann distribution",
    "ideal gas equation PV=nRT",
    "kinetic molecular theory",
    "root mean square velocity",
    "chemistry virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/chemistry/gas-laws",
  },
  openGraph: {
    title: "Ideal Gas Laws & Maxwell-Boltzmann Virtual Lab | OpenLabs",
    description: "Explore Boyle's, Charles's, and Gay-Lussac's gas laws with real-time molecular particle collision physics and Maxwell-Boltzmann distribution curves.",
    url: "https://www.openlabs.org.in/chemistry/gas-laws",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/chemistry/gas-laws-hero.png",
        alt: "Ideal Gas Laws & Maxwell-Boltzmann Kinetic Theory | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ideal Gas Laws & Maxwell-Boltzmann Virtual Lab | OpenLabs",
    description: "Explore Boyle's, Charles's, and Gay-Lussac's gas laws with real-time molecular particle collision physics and Maxwell-Boltzmann distribution curves.",
    images: ["https://www.openlabs.org.in/images/chemistry/gas-laws-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GasLawsLandingPage() {
  return (
    <STEMExperimentLanding
      subject="chemistry"
      slug="gas-laws"
      title="Gas Laws & Kinetic Theory"
      description="Interactive physical chemistry laboratory modeling ideal gas behavior, 2D elastic particle collisions, piston work, and Maxwell-Boltzmann velocity curves."
      heroDescription="Control gas pressure, volume, temperature, and molecular count in real time. Drag the weighted piston cylinder, adjust the thermal heat bath, and observe how thousands of elastic molecular impacts generate pressure and trace Maxwell-Boltzmann velocity distributions."
      theory="The Kinetic Molecular Theory (KMT) of gases explains macroscopic thermodynamic variables (P, V, T, n) through microscopic particle mechanics. Particles in continuous, random linear motion undergo elastic collisions with container walls, imparting momentum that manifests as pressure (P = F/A). Temperature is a direct measure of average molecular kinetic energy (KE_avg = 3/2 k_B T), with particle speeds following the statistical Maxwell-Boltzmann distribution."
      formula="PV = nRT \quad \text{and} \quad v_{\text{rms}} = \sqrt{\frac{3RT}{M}} \quad \text{and} \quad f(v) = 4\pi \left(\frac{m}{2\pi k_B T}\right)^{3/2} v^2 e^{-\frac{mv^2}{2k_BT}}"
      formulaLabel="Ideal Gas Equation & Maxwell-Boltzmann Speed Distribution"
      launchUrl="/labs/chemistry/gas-laws"
      heroImageUrl="/images/chemistry/gas-laws-hero.png"
      visualLabel="2D Elastic Particle Piston Chamber"
      visualDetail="Boyle's, Charles's & Gay-Lussac Modes • Real-Time Maxwell-Boltzmann Curve • RMS Velocity"
      accent={{ primary: "#059669", secondary: "#0d9488", warm: "#d97706" }}
      learningObjectives={[
        "Verify Boyle's Law (P ∝ 1/V at constant T), Charles's Law (V ∝ T at constant P), and Gay-Lussac's Law (P ∝ T at constant V).",
        "Explain how wall collisions generate macroscopic pressure using momentum transfer equations.",
        "Analyze how heating broadens the Maxwell-Boltzmann distribution and shifts the most probable speed (v_mp) to higher velocities.",
        "Calculate root-mean-square velocities (v_rms) for different molar mass gases (He, Ar, N₂, CO₂).",
      ]}
      applications={[
        "Internal Combustion Engines & Gas Turbines (PV indicator cycle work loops).",
        "Deep-Sea SCUBA Diving Gas Blending (Boyle's law pressure changes and decompression safety).",
        "Cryogenic Refrigeration & Liquefaction of Industrial Gases (Joule-Thomson expansion).",
        "Atmospheric Meteorology (isobaric expansion, thermal updrafts, and adiabatic lapse rates).",
      ]}
      faqs={[
        {
          question: "Why do gas molecules exert pressure on the container walls?",
          answer:
            "Every time a gas molecule bounces elastically off a container wall, its velocity vector reverses, resulting in a momentum transfer (Δp = 2mv_x). The total force is the rate of momentum transfer from billions of collisions per second; dividing this force by the wall area gives the macroscopic pressure.",
        },
        {
          question: "How does temperature affect the Maxwell-Boltzmann speed distribution curve?",
          answer:
            "As temperature increases, particles gain kinetic energy. The Maxwell-Boltzmann distribution curve broadens and flattens, shifting its peak (the most probable speed, v_mp) to the right, meaning a larger fraction of molecules have higher velocities.",
        },
        {
          question: "When do real gases deviate from ideal gas behavior (PV = nRT)?",
          answer:
            "Real gases deviate from ideality at very high pressures (where particle volume becomes significant) and very low temperatures (where intermolecular attractive forces cause particles to stick together). The Van der Waals equation corrects for these real-world effects.",
        },
      ]}
    />
  );
}
