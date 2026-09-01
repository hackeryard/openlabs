import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Water Quality Testing & Environmental Chemistry Virtual Lab | OpenLabs",
  description: "Measure and analyze water quality metrics including pH, Turbidity, Total Dissolved Solids (TDS), Dissolved Oxygen (DO), and heavy metal contaminants online.",
  keywords: [
    "water quality testing simulation",
    "environmental chemistry virtual lab",
    "pH turbidity TDS testing",
    "dissolved oxygen measurement",
    "water treatment chemistry",
    "drinking water safety standards",
    "chemistry virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/chemistry/water-quality",
  },
  openGraph: {
    title: "Water Quality Testing Virtual Lab | OpenLabs",
    description: "Explore water chemistry, contaminant analysis, and environmental monitoring in an interactive laboratory experience.",
    url: "https://www.openlabs.org.in/chemistry/water-quality",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/chemistry/water-quality-hero.png",
        alt: "OpenLabs Water Quality Chemistry Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Water Quality Testing Virtual Lab | OpenLabs",
    description: "Measure and analyze water quality with our interactive environmental chemistry lab.",
    images: ["https://www.openlabs.org.in/images/chemistry/water-quality-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function WaterQualityLandingPage() {
  return (
    <STEMExperimentLanding
      subject="chemistry"
      slug="water-quality"
      title="Water Quality & Environmental Chemistry"
      description="Interactive environmental analytical chemistry laboratory measuring pH, Turbidity (NTU), Total Dissolved Solids (TDS), and Dissolved Oxygen (DO)."
      heroDescription="Explore freshwater chemistry and environmental contamination. Calibrate digital electrochemical probes, test river and wastewater samples, and evaluate treatment protocols against WHO and EPA drinking water safety guidelines."
      theory="Water quality analysis quantifies chemical, physical, and biological parameters that determine the health of aquatic ecosystems and drinking water safety. Key quantitative indicators include hydronium ion concentration (pH = -log[H₃O⁺]), electrical conductivity as a proxy for Total Dissolved Solids (TDS ≈ k_e · σ), optical light scattering for Turbidity (Nephelometric Turbidity Units, NTU), and Winkler iodometric titrations for Dissolved Oxygen (DO)."
      formula="\text{pH} = -\log_{10}[H_3O^+] \quad \text{and} \quad \text{TDS (ppm)} \approx 0.64 \times \sigma \, (\mu\text{S/cm}) \quad \text{and} \quad \text{DO} = \frac{V_{\text{thio}} \times N \times 8000}{V_{\text{sample}}}"
      formulaLabel="Water Quality Metric Relationships & TDS Conductivity"
      launchUrl="/labs/chemistry/water-quality"
      heroImageUrl="/images/chemistry/water-quality-hero.png"
      visualLabel="Environmental Multi-Probe Analytical Station"
      visualDetail="4 River Samples • Digital pH, Turbidity & TDS Probes • WHO Guideline Comparison"
      accent={{ primary: "#059669", secondary: "#0d9488", warm: "#d97706" }}
      learningObjectives={[
        "Calibrate and operate digital pH, electrical conductivity (EC), and optical turbidity probes.",
        "Correlate high TDS and nutrient runoff (nitrates/phosphates) with eutrophication and dissolved oxygen depletion.",
        "Evaluate water purification stages (coagulation, flocculation, sedimentation, chlorination, reverse osmosis).",
        "Compare tested parameters with WHO and EPA Potable Water Maximum Contaminant Levels (MCLs).",
      ]}
      applications={[
        "Municipal Water Treatment Plant Operations & Continuous Quality Monitoring.",
        "Aquaculture & Fisheries Management (monitoring dissolved oxygen and ammonia levels).",
        "Industrial Wastewater Effluent Compliance & Heavy Metal Remediation.",
        "Environmental Watershed Fieldwork & Acid Mine Drainage Assessment.",
      ]}
      faqs={[
        {
          question: "Why is Dissolved Oxygen (DO) a critical indicator of aquatic ecosystem health?",
          answer:
            "Dissolved Oxygen is essential for the aerobic respiration of fish, macroinvertebrates, and beneficial microbes. DO levels below 4–5 mg/L induce biological hypoxia and fish kills. Excessive organic waste increases Biochemical Oxygen Demand (BOD), causing rapid DO depletion.",
        },
        {
          question: "How does electrical conductivity relate to Total Dissolved Solids (TDS)?",
          answer:
            "Pure deionized water is a poor electrical conductor. When mineral salts (like NaCl, CaCO₃, MgSO₄) dissolve, they dissociate into mobile ions that conduct electric current. Multiplying electrical conductivity (in μS/cm) by an empirical conversion factor (~0.64) estimates TDS in parts per million (ppm).",
        },
        {
          question: "What causes water turbidity and how is it measured?",
          answer:
            "Turbidity measures water cloudiness caused by suspended colloids, clay, silt, and algae. It is quantified using a nephelometer, which shines a beam of light through the sample and measures the amount of light scattered at a 90° angle, reported in Nephelometric Turbidity Units (NTU).",
        },
      ]}
    />
  );
}
