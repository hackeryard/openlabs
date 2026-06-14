import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cell Structure - Biology Lab | OpenLabs",
  description: "Interactive plant and animal cell explorer with detailed organelle visualization and structure analysis.",
  keywords: [
    "cell structure",
    "organelles",
    "eukaryotic cells",
    "cell biology",
    "plant cells",
    "animal cells",
    "cellular organization",
    "interactive simulation"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/cell",
  },
  openGraph: {
    title: "Cell Structure - Biology Lab | OpenLabs",
    description: "Interactive plant and animal cell explorer with detailed organelle visualization and structure analysis.",
    url: "https://www.openlabs.org.in/biology/cell",
    type: "website",
    images: [{
      url: "https://www.openlabs.org.in/images/biology/cell-hero.png",
      alt: "Cell Structure Lab | OpenLabs"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Cell Structure - Biology Lab | OpenLabs",
    description: "Interactive plant and animal cell explorer with detailed organelle visualization and structure analysis.",
    images: ["https://www.openlabs.org.in/images/biology/cell-hero.png"]
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "cell",
  subject: "Biology",
  title: "Cell Structure",
  description: "Interactive plant and animal cell explorer.",
  difficulty: "Beginner",
  estimatedTime: "15 mins",
  heroDescription: "Explore our interactive Cell Structure simulation to understand the fundamental concepts in biology.",
  theory: {
    content: "<p>This educational simulation provides an interactive environment to explore the theory and mechanics of Cell Structure. By experimenting with variables in real-time, you can intuitively grasp complex scientific concepts.</p>"
  },
  learningObjectives: [
    "Understand the core principles of Cell Structure.",
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
      answer: "You will learn the fundamental mechanics of Cell Structure through interactive experimentation."
    },
    {
      question: "Do I need prior knowledge?",
      answer: "While some basic understanding of biology helps, the simulation is designed to be intuitive for all learners."
    }
  ],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/biology/cell" />;
}
