import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Human Anatomy - Interactive Body Systems Lab | OpenLabs",
  description: "Explore the human body systems, organ structure, and anatomical organization through interactive 3D visualization and detailed diagrams.",
  keywords: [
    "human anatomy",
    "body systems",
    "organ structure",
    "skeletal system",
    "respiratory system",
    "circulatory system",
    "anatomy education",
    "interactive medical simulation"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/human",
  },
  openGraph: {
    title: "Human Anatomy - Interactive Body Systems Lab | OpenLabs",
    description: "Explore the human body systems, organ structure, and anatomical organization through interactive 3D visualization and detailed diagrams.",
    url: "https://www.openlabs.org.in/biology/human",
    type: "website",
    images: [{
      url: "https://www.openlabs.org.in/images/biology/human-anatomy-hero.png",
      alt: "Human Anatomy Lab | OpenLabs"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Human Anatomy - Interactive Body Systems Lab | OpenLabs",
    description: "Explore the human body systems, organ structure, and anatomical organization through interactive 3D visualization and detailed diagrams.",
    images: ["https://www.openlabs.org.in/images/biology/human-anatomy-hero.png"]
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "human",
  subject: "Biology",
  title: "Human Anatomy",
  description: "Explore the human body systems.",
  difficulty: "Beginner",
  estimatedTime: "15 mins",
  heroDescription: "Explore our interactive Human Anatomy simulation to understand the fundamental concepts in biology.",
  theory: {
    content: "<p>This educational simulation provides an interactive environment to explore the theory and mechanics of Human Anatomy. By experimenting with variables in real-time, you can intuitively grasp complex scientific concepts.</p>"
  },
  learningObjectives: [
    "Understand the core principles of Human Anatomy.",
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
      answer: "You will learn the fundamental mechanics of Human Anatomy through interactive experimentation."
    },
    {
      question: "Do I need prior knowledge?",
      answer: "While some basic understanding of biology helps, the simulation is designed to be intuitive for all learners."
    }
  ],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/biology/human" />;
}
