import type { Metadata } from "next";
import STEMExperimentLanding from "@/components/STEMExperimentLanding";

export const metadata: Metadata = {
  title: "Human Anatomy & Body Systems Virtual Lab | OpenLabs",
  description: "Explore human body systems, organ histology, circulatory loops, nervous pathways, respiratory gas exchange, and anatomical homeostatic regulation online.",
  keywords: [
    "human anatomy simulation",
    "organ systems virtual lab",
    "circulatory respiratory nervous",
    "homeostasis physiological loops",
    "human body 3d atlas",
    "anatomy interactive biology",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/human",
  },
  openGraph: {
    title: "Human Anatomy & Body Systems Virtual Lab | OpenLabs",
    description: "Explore the human body systems, organ structure, and anatomical organization through interactive 3D visualization.",
    url: "https://www.openlabs.org.in/biology/human",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/biology/human-hero.png",
        alt: "Human Anatomy Lab | OpenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Human Anatomy & Body Systems Virtual Lab | OpenLabs",
    description: "Explore the human body systems, organ structure, and anatomical organization through interactive 3D visualization.",
    images: ["https://www.openlabs.org.in/images/biology/human-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HumanAnatomyLandingPage() {
  return (
    <STEMExperimentLanding
      subject="biology"
      slug="human"
      title="Human Anatomy & Organ Systems"
      description="Interactive 3D human anatomical atlas and physiological homeostasis simulator exploring cardiovascular, nervous, respiratory, and digestive systems."
      heroDescription="Navigate the human body across multiple hierarchical anatomical layers. Dissect major organ systems in 3D, trace systemic and pulmonary circulatory loops, and evaluate physiological homeostatic feedback responses to exercise and stress."
      theory="Human anatomy organizes over 200 bones, 600 muscles, and 11 distinct physiological organ systems into an integrated homeostatic entity. Negative feedback loops regulated by the endocrine and autonomic nervous systems constantly adjust physiological variables (core body temperature, arterial blood pressure, blood glucose, and pH) around narrow physiological setpoints."
      formula="\text{Cardiac Output: } CO = HR \times SV \quad \text{and} \quad \text{Blood Pressure: } MAP = DP + \frac{1}{3}(SP - DP)"
      formulaLabel="Cardiovascular Hemodynamics & Mean Arterial Pressure"
      launchUrl="/labs/biology/human"
      heroImageUrl="/images/biology/human-hero.png"
      visualLabel="3D Multi-Layer Anatomical Explorer"
      visualDetail="Skeletal, Muscular & Circulatory Layers • Real-time Heart Hemodynamics • Homeostatic Controls"
      accent={{ primary: "#e11d48", secondary: "#0284c7", warm: "#f59e0b" }}
      learningObjectives={[
        "Locate and identify major organs across the 11 human body systems.",
        "Trace the path of deoxygenated and oxygenated blood through systemic and pulmonary circulatory circuits.",
        "Explain how negative feedback mechanisms maintain core physiological variables within homeostatic ranges.",
        "Analyze anatomical cross-sections and spatial terminology (anterior/posterior, medial/lateral, proximal/distal).",
      ]}
      applications={[
        "Pre-Medical Education & Surgical Anatomy Training.",
        "Clinical Pathology & Medical Imaging Diagnostics (CT, MRI, Ultrasound interpretation).",
        "Sports Physiology & Ergonomics Biomechanical Analysis.",
        "Cardiopulmonary Emergency Resuscitation Training.",
      ]}
      faqs={[
        {
          question: "How does a negative feedback loop maintain physiological homeostasis?",
          answer:
            "A negative feedback loop counteracts a deviation from a setpoint. A sensor/receptor detects a change (e.g., elevated body temperature), sends signals to a control center (hypothalamus), which activates effectors (sweat glands and vasodilation) to return the parameter to normal.",
        },
        {
          question: "What is the anatomical difference between pulmonary and systemic circulation?",
          answer:
            "Pulmonary circulation carries deoxygenated blood from the right ventricle to the lungs for gas exchange (releasing CO₂ and absorbing O₂) and returns it to the left atrium. Systemic circulation pumps oxygen-rich blood from the left ventricle to the rest of the body tissues and organs.",
        },
        {
          question: "How do the sympathetic and parasympathetic nervous systems balance organ activity?",
          answer:
            "The sympathetic division ('fight-or-flight') increases heart rate, dilates airways, and mobilizes glucose during stress. The parasympathetic division ('rest-and-digest') slows heart rate, stimulates digestive secretions, and conserves energy.",
        },
      ]}
    />
  );
}
