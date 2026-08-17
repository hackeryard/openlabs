import type { Metadata } from "next";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";

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
    "chemistry virtual lab"
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

const gasLawsContent = {
  slug: "gas-laws",
  subject: "Chemistry",
  title: "Gas Laws & Maxwell-Boltzmann Kinetic Theory",
  description: "An interactive thermal physics and physical chemistry laboratory modeling ideal gas behavior, 2D elastic collisions, draggable piston work, and Maxwell-Boltzmann molecular velocity curves.",
  difficulty: "Beginner" as const,
  estimatedTime: "20 minutes",
  heroDescription: "Control gas pressure, volume, temperature, and particle count in real time. Drag the weighted piston cylinder, adjust the thermal heat bath, and observe how thousands of elastic molecular impacts generate pressure and trace Maxwell-Boltzmann velocity curves.",
  theory: {
    content: `
      <p>The <strong>Kinetic Molecular Theory (KMT) of Gases</strong> provides a microscopic foundation for understanding the macroscopic thermodynamic properties of gases. An ideal gas consists of particles (atoms or molecules) in continuous, random linear motion that undergo perfectly elastic collisions with each other and with the container walls.</p>
      <p>Macroscopic gas pressure ($P$) arises from the cumulative momentum transferred per unit area per second during particle collisions against container boundaries ($P = \\frac{F}{A} = \\frac{N m \\overline{v_x^2}}{V}$). Absolute temperature ($T$, in Kelvin) is directly proportional to the average translational kinetic energy of the gas particles ($\\overline{KE} = \\frac{3}{2} k_B T$).</p>
      <p>The empirical gas laws unite into the <strong>Ideal Gas Equation</strong> ($PV = nRT$). The individual molecular speeds follow the <strong>Maxwell-Boltzmann distribution</strong>, showing that higher temperatures broaden the distribution curve and shift the root-mean-square speed ($v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}}$) toward higher velocities.</p>
    `
  },
  learningObjectives: [
    "Verify Boyle's Law (P ∝ 1/V at constant T), Charles's Law (V ∝ T at constant P), and Gay-Lussac's Law (P ∝ T at constant V).",
    "Calculate state variables using the ideal gas equation (PV = nRT).",
    "Interpret Maxwell-Boltzmann speed distribution curves as a function of temperature and molar mass.",
    "Explain how pressure is generated at the molecular level through momentum transfer during elastic collisions."
  ],
  mathematicalFoundations: {
    equations: [
      "PV = nRT = N k_B T",
      "P_1 V_1 / T_1 = P_2 V_2 / T_2 \\text{ (Combined Gas Law)}",
      "v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}} = \\sqrt{\\frac{3 k_B T}{m}}",
      "f(v) = 4\\pi \\left( \\frac{M}{2\\pi R T} \\right)^{3/2} v^2 \\exp\\left(-\\frac{M v^2}{2 R T}\\right) \\text{ (Maxwell-Boltzmann)}"
    ],
    explanation: "At the root-mean-square speed, heavier gas molecules (such as Xenon or CO₂) move significantly slower than lighter molecules (such as Helium or Hydrogen) at identical temperatures, according to Graham's law of effusion."
  },
  realWorldApplications: [
    "Scuba Diving Physiology: Boyle's law dictates lung volume changes with underwater depth and governs nitrogen narcosis prevention.",
    "Aviation & Meteorology: Atmospheric pressure gradients, barometric altimetry, and hot air balloon buoyancy via Charles's law.",
    "Internal Combustion Engines: Gas compression and thermal expansion driving automotive pistons during the power stroke.",
    "Industrial Gas Storage: Cryogenic liquefied natural gas (LNG) tanks and compressed gas cylinder safety valves."
  ],
  howItWorks: "Select the gas law mode (Boyle's, Charles's, Gay-Lussac's, or Ideal Gas). Drag the piston lid to alter chamber volume, use the heat/cool thermal bath slider to adjust temperature, or pump in additional gas particles. Observe real-time pressure gauge fluctuations and watch the live Maxwell-Boltzmann distribution curve trace molecular speed counts.",
  faqs: [
    {
      question: "Why does compressing a gas increase its pressure if temperature is held constant (Boyle's Law)?",
      answer: "When gas volume is reduced by half at constant temperature, the particle density doubles. Consequently, gas molecules collide with the container walls twice as frequently per unit area per second. Because the average momentum transfer per collision remains unchanged, the total force per unit area—and therefore pressure—doubles."
    },
    {
      question: "Why does the Maxwell-Boltzmann curve flatten and shift right at higher temperatures?",
      answer: "As temperature increases, the average kinetic energy of the molecules increases (KE = (3/2)k_B·T). More molecules reach higher speeds, shifting the peak (most probable speed) to the right. Because the total area under the probability curve must remain normalized to 1.0 (representing 100% of the gas), the distribution widens and its peak height flattens."
    },
    {
      question: "When do real gases deviate from ideal gas behavior?",
      answer: "Real gases deviate from ideal behavior at very high pressures (where the finite volume of gas molecules becomes a significant fraction of the container volume) and at very low temperatures (where intermolecular attractive Van der Waals forces cause particles to stick together rather than collide elastically)."
    }
  ],
  relatedExperiments: []
};

export default function GasLawsLandingPage() {
  return (
    <EducationalLandingLayout 
      content={gasLawsContent} 
      launchUrl="/labs/chemistry/gas-laws" 
    />
  );
}
