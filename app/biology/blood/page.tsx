import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blood Components - Biology Lab | OpenLabs",
  description: "Examine human blood components, types, and transfusion compatibility in this interactive biology simulation.",
  keywords: [
    "blood components",
    "blood types",
    "transfusion",
    "hemoglobin",
    "red blood cells",
    "biology simulation",
    "interactive lab",
    "medical education"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/blood",
  },
  openGraph: {
    title: "Blood Components - Biology Lab | OpenLabs",
    description: "Examine human blood components, types, and transfusion compatibility in this interactive biology simulation.",
    url: "https://www.openlabs.org.in/biology/blood",
    type: "website",
    images: [{
      url: "https://www.openlabs.org.in/images/biology/blood-hero.png",
      alt: "Blood Components Lab | OpenLabs"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Blood Components - Biology Lab | OpenLabs",
    description: "Examine human blood components, types, and transfusion compatibility in this interactive biology simulation.",
    images: ["https://www.openlabs.org.in/images/biology/blood-hero.png"]
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "blood",
  subject: "Biology",
  title: "Blood Components",
  description: "Examine human blood components.",
  difficulty: "Beginner",
  estimatedTime: "15 mins",
  heroDescription: "Explore our interactive Blood Components simulation to understand the fundamental concepts in biology.",
  theory: {
    content: "<p>This educational simulation provides an interactive environment to explore the theory and mechanics of Blood Components. By experimenting with variables in real-time, you can intuitively grasp complex scientific concepts.</p>"
  },
  learningObjectives: [
    "Understand the core principles of Blood Components.",
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
      answer: "You will learn the fundamental mechanics of Blood Components through interactive experimentation."
    },
    {
      question: "Do I need prior knowledge?",
      answer: "While some basic understanding of biology helps, the simulation is designed to be intuitive for all learners."
    }
  ],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/biology/blood" />;
}
