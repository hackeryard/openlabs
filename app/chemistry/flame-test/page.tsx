import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

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
    "chemistry virtual lab",
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

export default function FlameTestLandingPage() {
  return (
    <STEMExperimentLanding
      subject="chemistry"
      slug="flame-test"
      title="Flame Test & Atomic Emission Spectrometry"
      description="Analytical chemistry laboratory demonstrating quantized orbital electron excitation and discrete photon emission spectra across metal cations."
      heroDescription="Immerse in virtual qualitative chemical analysis. Dip platinum wire loops into aqueous salt solutions (Na⁺, K⁺, Cu²⁺, Sr²⁺, Ba²⁺, Li⁺, Ca²⁺), introduce them into the Bunsen flame, observe characteristic flame colors, and view discrete spectral emission lines."
      theory="When a metal salt enters the thermal zone of a Bunsen flame, thermal energy vaporizes the sample and excites valence electrons into higher, unstable quantized energy orbitals. When electrons relax back to lower ground states, the energy difference is emitted as a photon of light governed by the Planck-Einstein relation (ΔE = hν = hc/λ). Because every element has unique energy level spacing, the resulting emission spectrum acts as a definitive optical fingerprint."
      formula="\Delta E = E_2 - E_1 = h\nu = \frac{hc}{\lambda} \quad (\text{Rydberg: } \frac{1}{\lambda} = R_H Z^2 \left(\frac{1}{n_1^2} - \frac{1}{n_2^2}\right))"
      formulaLabel="Planck-Einstein Relation & Rydberg Formula"
      launchUrl="/labs/chemistry/flame-test"
      heroImageUrl="/images/chemistry/flame-test-hero.png"
      visualLabel="Bunsen Burner & Optical Spectroscope"
      visualDetail="7 Metal Salt Solutions • Discrete Emission Line Analyzer • Bunsen Air Collar Control"
      accent={{ primary: "#059669", secondary: "#0d9488", warm: "#d97706" }}
      learningObjectives={[
        "Explain how thermal energy promotes valence electrons to excited quantum states.",
        "Relate emitted photon wavelength and color to quantized electronic transitions (ΔE = hc/λ).",
        "Identify unknown metal cations by matching their composite flame colors and spectroscope lines.",
        "Distinguish between continuous white light spectra and discrete atomic line emission spectra.",
      ]}
      applications={[
        "Pyrotechnics & Fireworks Manufacturing (strontium reds, copper blues, barium greens).",
        "Astronomical Spectroscopy (determining elemental composition of stars and distant exoplanet atmospheres).",
        "Clinical Flame Emission Photometry (rapid quantification of sodium and potassium in serum).",
        "Forensic Chemical Analysis & Environmental Heavy Metal Detection.",
      ]}
      faqs={[
        {
          question: "Why do different elements produce distinct flame colors?",
          answer:
            "Each element has a distinct number of protons in its nucleus, which establishes unique quantized orbital energy levels. The energy differences (ΔE) between excited and ground states correspond to specific photon wavelengths (λ = hc/ΔE) within the visible spectrum.",
        },
        {
          question: "Why is a cobalt blue glass filter used during potassium flame tests?",
          answer:
            "Sodium is a common contaminant that produces an intense, persistent yellow flame (589 nm) that masks other colors. Cobalt blue glass absorbs yellow sodium wavelengths while transmitting lilac/violet light, allowing the characteristic violet potassium flame (766 nm) to be observed.",
        },
        {
          question: "What is the difference between an emission spectrum and an absorption spectrum?",
          answer:
            "An emission spectrum consists of bright colored lines produced when excited electrons drop to lower energy states, emitting light. An absorption spectrum consists of dark lines superimposed on a continuous spectrum, created when cool gas atoms absorb specific wavelengths from passing white light.",
        },
      ]}
    />
  );
}
