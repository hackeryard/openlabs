// app/physics/photoelectric-effect/page.tsx
import type { Metadata } from "next";
import PhysicsExperimentLanding from "@/components/PhysicsExperimentLanding";
import { createLabMetadata } from "@/app/lib/seo/metadata";

const PAGE_TITLE = "Photoelectric Effect Simulator & Quantum Photon Lab";
const PAGE_DESCRIPTION = "Explore Einstein's photoelectric effect equation (K_max = hf - Φ), cathode metal work functions, threshold frequencies, stopping potentials, and discrete photon quantization online.";

export const metadata: Metadata = createLabMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  pathname: "/physics/photoelectric-effect",
  subject: "physics",
  topic: "Photoelectric Effect & Quantum Photons",
  keywords: [
    "photoelectric effect simulation",
    "einsteins photoelectric equation",
    "work function calculator",
    "stopping potential experiment",
    "threshold frequency physics lab",
    "photon quantization plancks constant",
    "physics virtual lab"
  ],
});

const FAQS = [
  {
    question: "What does Einstein's Photoelectric Equation state?",
    answer: "Einstein's equation states that the maximum kinetic energy (K_max) of an emitted photoelectron equals the incident photon energy (hf) minus the metal's work function (Φ): K_max = hf - Φ = e·Vs.",
  },
  {
    question: "Why does increasing light intensity increase current but NOT electron kinetic energy?",
    answer: "Intensity measures the number of photons arriving per second (photon flux). More photons eject more electrons per second (higher current). However, because each electron absorption is an individual 1-to-1 event with a single photon, the kinetic energy of each electron depends purely on the photon frequency (E = hf).",
  },
  {
    question: "What is the stopping potential (Vs)?",
    answer: "The stopping potential is the opposing negative voltage applied between the cathode and anode just sufficient to halt the most energetic emitted photoelectrons, reducing photocurrent to zero (e·Vs = K_max).",
  },
  {
    question: "Why do different cathode metals have different threshold frequencies?",
    answer: "Every metal possesses a characteristic binding energy (work function, Φ) holding valence electrons in its crystal lattice. Alkali metals like Cesium (2.14 eV) require only visible light, whereas Zinc (4.30 eV) requires high-energy ultraviolet light.",
  },
];

export default function PhotoelectricEffectPage() {
  return (
    <PhysicsExperimentLanding
      slug="photoelectric-effect"
      title="Photoelectric Effect"
      description="Explore Einstein's photoelectric effect, metal work functions, stopping potentials, and photon quantization."
      heroDescription="Recreate the Nobel Prize-winning experiment that proved light quantization. Shine monochromatic light (200 nm UV to 750 nm Red) onto photocathode metals, adjust retarding stopping voltage, and measure maximum photoelectron kinetic energy."
      theory="The photoelectric effect demonstrates the particle nature of light. When photons strike a metal surface, their energy (E = hf) is transferred in single quanta to liberate electrons above the work function threshold."
      formula="K_{\\text{max}} = h\\nu - \\Phi = e V_s"
      formulaLabel="Einstein's photoelectric equation"
      launchUrl="/labs/physics/photoelectric-effect"
      heroImageUrl="/images/physics/photoelectric-effect-hero.png"
      visualLabel="Quantum phototube model"
      visualDetail="Photon wavelength, work function, stopping voltage"
      accent={{ primary: "#8b5cf6", secondary: "#6366f1", warm: "#ec4899" }}
      learningObjectives={[
        "Apply Einstein's Photoelectric Equation (K_max = hf - Φ) to compute stopping potentials.",
        "Differentiate the physical roles of light intensity (photon flux) versus light frequency (photon energy).",
        "Determine cutoff wavelengths and threshold frequencies across diverse cathode metals.",
        "Calculate Planck's constant (h) experimentally from stopping potential slopes.",
      ]}
      applications={[
        "Photovoltaic solar cell energy harvesting",
        "Photomultiplier tubes (PMTs) for particle physics and medical imaging",
        "Night-vision photocathode image intensifiers",
        "Digital camera CCD and CMOS image sensors",
      ]}
      faqs={FAQS}
    />
  );
}
