import type { Metadata } from "next";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";

export const metadata: Metadata = {
  title: "Flame Test Simulation & Atomic Emission Spectrometry Virtual Lab | OpenLabs",
  description: "Explore flame excitation of metal cations (Na+, K+, Cu2+, Sr2+, Ba2+, Li+, Ca2+), Bohr orbital electron jumps, photon release, and discrete emission line spectrographs online.",
  keywords: [
    "flame test simulation",
    "atomic emission spectrometry virtual lab",
    "bohr model electron transitions",
    "metal cation flame colors",
    "emission spectroscopy online",
    "planck constant photon energy",
    "chemistry virtual lab"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/chemistry/flame-test",
  },
  openGraph: {
    title: "Flame Test & Atomic Emission Spectrometry Virtual Lab | OpenLabs",
    description: "Explore flame excitation of metal cations, Bohr orbital transitions, and discrete emission spectrographs.",
    url: "https://www.openlabs.org.in/chemistry/flame-test",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/chemistry/flame-test-hero.png",
        alt: "Flame Test Simulation & Atomic Emission Spectrometry | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flame Test & Atomic Emission Spectrometry Virtual Lab | OpenLabs",
    description: "Explore flame excitation of metal cations, Bohr orbital transitions, and discrete emission spectrographs.",
    images: ["https://www.openlabs.org.in/images/chemistry/flame-test-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const flameTestContent = {
  slug: "flame-test",
  subject: "Chemistry",
  title: "Flame Test & Atomic Emission Spectrometry",
  description: "An analytical chemistry simulation demonstrating quantized atomic orbital electron excitation and discrete photon emission spectrographs across metal cations.",
  difficulty: "Beginner" as const,
  estimatedTime: "20 minutes",
  heroDescription: "Immerse in virtual qualitative chemical analysis. Dip platinum wire loops into aqueous salt solutions (Na⁺, K⁺, Cu²⁺, Sr²⁺, Ba²⁺, Li⁺, Ca²⁺), introduce them to a Bunsen burner flame, observe characteristic flame hues, and view discrete spectral emission lines.",
  theory: {
    content: `
      <p>The <strong>flame test</strong> is an analytical technique in qualitative inorganic chemistry used to identify the presence of specific metal ions based on their characteristic emission spectrum. When a sample of metal salt is introduced into the thermal zone of a Bunsen burner flame, the heat provides thermal kinetic energy that vaporizes the salt and excites ground-state valence electrons into higher, unstable quantized energy levels (Bohr orbitals).</p>
      <p>Because the excited state is unstable, the electrons rapidly and spontaneously relax back to lower energy ground states. As they drop, the exact quantized energy difference between the higher state ($E_2$) and lower state ($E_1$) is conserved and released as an electromagnetic wave packet—a <strong>photon</strong>—governed by the Planck-Einstein relation: $E = h\\nu = \\frac{hc}{\\lambda}$.</p>
      <p>Because each chemical element possesses a unique nuclear charge ($Z$) and electronic orbital configuration, the energy level gaps are characteristic to each atom. Passing the emitted light through a diffraction grating or prism reveals distinct, sharp spectral lines rather than a continuous spectrum.</p>
    `
  },
  learningObjectives: [
    "Explain how thermal flame energy excites valence electrons into higher Bohr quantum energy levels.",
    "Relate photon wavelength and frequency to quantized electronic energy transitions using E = hc/λ.",
    "Identify characteristic flame colors for alkali and alkaline earth metal cations (e.g. Sodium intense yellow 589nm, Potassium lilac 404nm, Copper cyan/green 510nm, Strontium crimson 650nm).",
    "Interpret discrete atomic emission spectrographs and understand qualitative spectroscopy."
  ],
  mathematicalFoundations: {
    equations: [
      "E = h\\nu = \\frac{hc}{\\lambda}",
      "\\Delta E = E_2 - E_1",
      "\\frac{1}{\\lambda} = R_H \\left( \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right) \\text{ (Rydberg Formula)}"
    ],
    explanation: "The Planck-Einstein relation dictates that emitted photon energy is inversely proportional to wavelength. Shorter wavelengths (such as blue/violet light from copper or potassium) correspond to larger electronic energy drops, while longer wavelengths (red light from strontium or lithium) represent smaller energy gaps."
  },
  realWorldApplications: [
    "Astrophysics & Stellar Composition: Identifying elemental makeup and temperatures of distant stars via stellar emission lines.",
    "Pyrotechnics & Fireworks: Engineering vivid firework colors using strontium nitrate (red), barium chlorate (green), and copper chloride (blue).",
    "Environmental Water Testing: Flame atomic absorption spectroscopy (FAAS) for trace heavy metal detection in municipal drinking water.",
    "Forensic Science: Identifying trace elemental contaminants on physical evidence."
  ],
  howItWorks: "Select a metal salt sample from the reagent rack (such as Sodium Chloride, Potassium Chloride, Copper(II) Sulfate, or Strontium Chloride). Adjust the Bunsen burner air collar to produce a hot, non-luminous blue flame. Dip the virtual platinum wire loop into the solution and position it in the flame. Watch the flame change color, observe the electron jumping animation on the atomic orbital diagram, and inspect the real-time spectrometer wavelength readout.",
  faqs: [
    {
      question: "Why do different elements produce different flame colors?",
      answer: "Every element has a distinct number of protons in its nucleus, which creates a unique electrostatic potential well for its electron orbitals. As a result, the quantized energy gaps (ΔE) between excited and ground orbitals are element-specific, producing photons of precise wavelengths corresponding to unique colors in the visible spectrum."
    },
    {
      question: "Why must the Bunsen burner flame be blue and non-luminous for flame tests?",
      answer: "A yellow, luminous flame results from incomplete combustion containing glowing soot (carbon particles), which emits continuous yellow-orange blackbody radiation and obscures the delicate emission colors of the metal ions. A roaring blue flame has complete combustion, minimal background light, and higher temperature to efficiently excite atoms."
    },
    {
      question: "Why does Sodium produce an overwhelmingly bright yellow flame?",
      answer: "The Sodium D-line doublet (at 589.0 nm and 589.6 nm) corresponds to a 3p → 3s electronic transition with a very high transition probability (oscillator strength), and falls directly in the peak sensitivity range of the human eye."
    }
  ],
  relatedExperiments: []
};

export default function FlameTestLandingPage() {
  return (
    <EducationalLandingLayout 
      content={flameTestContent} 
      launchUrl="/labs/chemistry/flame-test" 
    />
  );
}
