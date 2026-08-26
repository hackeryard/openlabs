import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Photosynthesis Simulator - Light & Dark Reactions Virtual Lab | OpenLabs",
  description: "Explore how Light Intensity, CO2 Concentration, Temperature, and Wavelength interact to determine the photosynthetic rate and master Blackman's Law of Limiting Factors.",
  keywords: [
    "photosynthesis simulation",
    "calvin cycle light reactions",
    "blackmans law limiting factors",
    "chlorophyll absorption spectrum",
    "photophosphorylation atp nadph",
    "plant biology virtual lab",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/photosynthesis",
  },
  openGraph: {
    title: "Photosynthesis Simulator - Interactive Biology Lab | OpenLabs",
    description: "Explore how Light, CO2, and Temperature interact to determine the photosynthetic rate and Blackman's Law of Limiting Factors.",
    url: "https://www.openlabs.org.in/biology/photosynthesis",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/biology/photosynthesis-hero.png",
        alt: "Photosynthesis Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photosynthesis Simulator - Interactive Biology Lab | OpenLabs",
    description: "Explore how Light, CO2, and Temperature interact to determine the photosynthetic rate.",
    images: ["https://www.openlabs.org.in/images/biology/photosynthesis-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PhotosynthesisLandingPage() {
  return (
    <STEMExperimentLanding
      subject="biology"
      slug="photosynthesis"
      title="Photosynthesis & Limiting Factors"
      description="Interactive bioenergetics laboratory simulating light-dependent thylakoid photolysis, stromal Calvin cycle carbon fixation, and Blackman's Law of Limiting Factors."
      heroDescription="Manipulate photon flux, wavelength spectrum, ambient CO₂ concentration, and temperature in real time. Observe oxygen bubble generation, electron transport chain kinetics, and enzymatic saturation of RuBisCO."
      theory="Photosynthesis converts electromagnetic solar radiation into stable chemical potential energy stored in carbohydrate bonds. The process occurs in two stages: (1) Light-dependent reactions in thylakoid membranes, where chlorophyll excitation drives water photolysis (2H₂O → O₂ + 4H⁺ + 4e⁻) and generates ATP and NADPH, and (2) Light-independent Calvin Cycle in the stroma, where RuBisCO fixes CO₂ into G3P sugars. Blackman's Law dictates that the overall rate is constrained by whichever substrate or environmental factor is closest to its minimum value."
      formula="6\text{CO}_2 + 6\text{H}_2\text{O} + h\nu \xrightarrow[\text{Chloroplast}]{\text{Chlorophyll}} \text{C}_6\text{H}_{12}\text{O}_6 + 6\text{O}_2 \quad (\Delta G^\circ = +2870\text{ kJ/mol})"
      formulaLabel="Overall Photosynthetic Stoichiometry & Free Energy"
      launchUrl="/labs/biology/photosynthesis"
      heroImageUrl="/images/biology/photosynthesis-hero.png"
      visualLabel="Photosynthetic Chamber & Thylakoid ETC"
      visualDetail="Blackman Limiting Factors Engine • RuBisCO Saturation Plateau • Oxygen Production Rate Meter"
      accent={{ primary: "#059669", secondary: "#10b981", warm: "#facc15" }}
      learningObjectives={[
        "Differentiate between thylakoid light-dependent reactions (ATP/NADPH synthesis) and stromal dark reactions (Calvin cycle).",
        "Apply Blackman's Law of Limiting Factors to predict photosynthetic plateaus under varying light, CO₂, and temperature conditions.",
        "Relate chlorophyll-a and chlorophyll-b absorption spectra to photosynthetic action spectra across visible wavelengths.",
        "Explain thermal denaturation of photosynthetic enzymes (RuBisCO) at temperatures exceeding optimal physiological limits.",
      ]}
      applications={[
        "Precision Agriculture & Vertical Greenhouse Automated LED Spectrum Optimization.",
        "Global Carbon Sequestration Modeling and Climate Change Forestry Science.",
        "Algal Photobioreactor Design for Sustainable Biofuels and Protein Synthesis.",
        "Genetically Engineered C4 and CAM Pathway Rice Crop Engineering.",
      ]}
      faqs={[
        {
          question: "What is Blackman's Law of Limiting Factors?",
          answer:
            "Formulated by F.F. Blackman in 1905, it states that when a physiological process depends on several independent environmental factors (e.g., light intensity, CO₂ concentration, temperature), the rate of the process is governed by the factor that is nearest to its minimum value.",
        },
        {
          question: "Why does the photosynthetic rate decrease at high temperatures?",
          answer:
            "Photosynthesis relies on enzymes like RuBisCO during the Calvin cycle. When temperatures exceed the optimal range (typically >35–40°C), enzymes denature (losing their tertiary active site conformation), stomata close to prevent water loss (reducing CO₂ availability), and photorespiration increases.",
        },
        {
          question: "Why do plants appear green?",
          answer:
            "Chlorophyll pigments strongly absorb blue-violet (430 nm) and red (660 nm) wavelengths for photochemistry, while reflecting and transmitting green wavelengths (500–550 nm), giving leaves their characteristic green appearance.",
        },
      ]}
    />
  );
}
