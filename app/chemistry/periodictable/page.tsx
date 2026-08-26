import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Interactive Periodic Table | Chemistry Lab | OpenLabs",
  description: "Explore all 118 chemical elements with interactive guides covering atomic properties, orbital blocks, periodic trends, electronegativity, and 3D electron configurations.",
  keywords: [
    "periodic table of elements",
    "chemistry elements interactive",
    "atomic weight calculator",
    "electron configuration periodic table",
    "periodic trends",
    "electronegativity chart",
    "atomic radius trend",
    "virtual chemistry lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/chemistry/periodictable",
  },
  openGraph: {
    title: "Interactive Periodic Table of Elements | OpenLabs",
    description: "Explore chemical elements with detailed guides on atomic trends, orbital blocks, and dynamic electron shell configurations.",
    url: "https://www.openlabs.org.in/chemistry/periodictable",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/chemistry/periodictable-hero.png",
        alt: "OpenLabs Periodic Table Interactive Chemistry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Periodic Table of Elements | OpenLabs",
    description: "Explore chemical elements, orbital blocks, and periodic trends.",
    images: ["https://www.openlabs.org.in/images/chemistry/periodictable-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PeriodicTableLandingPage() {
  return (
    <STEMExperimentLanding
      subject="chemistry"
      slug="periodictable"
      title="Periodic Table of Elements"
      description="Interactive Mendeleev periodic table exploring all 118 elements, oxidation states, electron configurations, and periodic trends."
      heroDescription="Explore the foundation of chemistry with an interactive periodic table. Inspect element properties, color-code by electronegativity and ionization energy heatmaps, and visualize subshell orbital configurations in real time."
      theory="The periodic table organizes all 118 confirmed chemical elements in order of increasing atomic number (Z, the number of protons). Periodic law dictates that elements with similar electron configurations exhibit recurring physical and chemical trends. As effective nuclear charge (Z_eff = Z - S) increases across periods, atomic radii contract while first ionization energy and electronegativity generally increase."
      formula="Z_{\text{eff}} = Z - S \quad \text{and} \quad \chi = \frac{IE + EA}{2}"
      formulaLabel="Effective Nuclear Charge & Mulliken Electronegativity"
      launchUrl="/labs/chemistry/periodictable"
      heroImageUrl="/images/chemistry/periodictable-hero.png"
      visualLabel="Interactive 118-Element Matrix"
      visualDetail="Property Heatmaps • Subshell Blocks (s, p, d, f) • 3D Electron Shells"
      accent={{ primary: "#059669", secondary: "#0d9488", warm: "#d97706" }}
      learningObjectives={[
        "Classify elements into s, p, d, and f orbital blocks and chemical families.",
        "Predict atomic radius, ionization energy, and electronegativity trends across periods and down groups.",
        "Inspect electron configurations and noble gas core shorthand for transition and lanthanide elements.",
        "Connect elemental valence electrons to chemical bonding behaviors.",
      ]}
      applications={[
        "Materials Science & Semiconductor Engineering (doping silicon with Group 13/15 elements).",
        "Pharmaceutical Drug Design & Radiopharmaceuticals (technetium-99m imaging).",
        "Metallurgical alloy formulation for aerospace superalloys (titanium and nickel matrices).",
        "Environmental Soil and Water Toxic Metal Testing (lead, arsenic, and mercury detection).",
      ]}
      faqs={[
        {
          question: "How is the modern Periodic Table structured?",
          answer:
            "The table arranges elements by ascending atomic number into 7 horizontal rows ('periods') and 18 vertical columns ('groups'). Groups contain elements with identical valence electron configurations, leading to shared chemical reactivity.",
        },
        {
          question: "What are the four main orbital blocks?",
          answer:
            "Elements are categorized by their highest energy valence subshell: s-block (Groups 1 & 2 + He), p-block (Groups 13–18), d-block (transition metals in Groups 3–12), and f-block (inner transition Lanthanides and Actinides).",
        },
        {
          question: "Why does electronegativity increase across a period?",
          answer:
            "Across a period, protons are added to the nucleus while electrons fill the same principal quantum shell. The resulting increase in effective nuclear charge pulls bonding electrons closer to the nucleus, boosting electronegativity.",
        },
      ]}
    />
  );
}
