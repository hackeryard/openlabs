import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Water Quality - Chemistry Lab | OpenLabs",
  description: "Test and measure water quality metrics in an interactive chemistry lab. Learn how pH, contaminants, and treatment affect aquatic health.",
  keywords: [
    "water quality",
    "water chemistry",
    "pH testing",
    "contaminant analysis",
    "environmental chemistry",
    "water treatment"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/chemistry/water-quality",
  },
  openGraph: {
    title: "Water Quality - Chemistry Lab | OpenLabs",
    description: "Explore water quality analysis and environmental chemistry in an interactive lab experience.",
    url: "https://www.openlabs.org.in/chemistry/water-quality",
    type: "website",
    images: [
      {
        url: "https://www.openlabs.org.in/images/chemistry/water-quality-hero.png",
        alt: "OpenLabs Water Quality Chemistry Lab"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Water Quality - Chemistry Lab | OpenLabs",
    description: "Measure and analyze water quality with our interactive chemistry lab.",
    images: ["https://www.openlabs.org.in/images/chemistry/water-quality-hero.png"]
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "water-quality",
  subject: "Chemistry",
  title: "Water Quality",
  description: "Test and measure water quality metrics.",
  difficulty: "Beginner",
  estimatedTime: "15 mins",
  heroDescription: "Explore our interactive water chemistry lab to learn how pH, dissolved substances, and contaminants affect water quality.",
  theory: {
    content: "<p>This educational simulation provides an interactive environment to explore water chemistry fundamentals. By adjusting parameters such as pH, turbidity, and dissolved ions, you can learn how water quality is measured and maintained.</p>"
  },
  learningObjectives: [
    "Understand the core principles of Water Quality.",
    "Observe real-time changes by manipulating simulation parameters.",
    "Apply theoretical knowledge to practical scenarios."
  ],
  realWorldApplications: [
    "Education and academia",
    "Applied science and engineering",
    "Research and development"
  ],
  howItWorks: "Launch the lab to interact with the environment. Use the controls to adjust parameters and observe the outcomes immediately.",
  faqs: [
    {
      question: "What will I learn from this simulation?",
      answer: "You will learn the fundamental mechanics of Water Quality through interactive experimentation."
    },
    {
      question: "Do I need prior knowledge?",
      answer: "While some basic understanding of chemistry helps, the simulation is designed to be intuitive for all learners."
    }
  ],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/chemistry/water-quality" />;
}
