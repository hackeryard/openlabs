import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Algebra Visualizer - Interactive Mathematics Lab | OpenLabs",
  description: "Visualize and solve algebraic equations through interactive simulation. Explore variables, expressions, and equation solving techniques.",
  keywords: [
    "algebra",
    "algebra visualizer",
    "equation solver",
    "algebraic expressions",
    "variable manipulation",
    "equation visualization",
    "mathematics education",
    "interactive math lab"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/maths/alzebra",
  },
  openGraph: {
    title: "Algebra Visualizer - Interactive Mathematics Lab | OpenLabs",
    description: "Visualize and solve algebraic equations through interactive simulation. Explore variables, expressions, and equation solving techniques.",
    url: "https://www.openlabs.org.in/maths/alzebra",
    type: "website",
    images: [{
      url: "https://www.openlabs.org.in/images/maths/algebra-hero.png",
      alt: "Algebra Visualizer Lab | OpenLabs"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Algebra Visualizer - Interactive Mathematics Lab | OpenLabs",
    description: "Visualize and solve algebraic equations through interactive simulation. Explore variables, expressions, and equation solving techniques.",
    images: ["https://www.openlabs.org.in/images/maths/algebra-hero.png"]
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "alzebra",
  subject: "Maths",
  title: "Algebra Visualizer",
  description: "Visualize algebraic equations.",
  difficulty: "Beginner",
  estimatedTime: "15 mins",
  heroDescription: "Explore our interactive Algebra Visualizer simulation to understand the fundamental concepts in maths.",
  theory: {
    content: "<p>This educational simulation provides an interactive environment to explore the theory and mechanics of Algebra Visualizer. By experimenting with variables in real-time, you can intuitively grasp complex scientific concepts.</p>"
  },
  learningObjectives: [
    "Understand the core principles of Algebra Visualizer.",
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
      answer: "You will learn the fundamental mechanics of Algebra Visualizer through interactive experimentation."
    },
    {
      question: "Do I need prior knowledge?",
      answer: "While some basic understanding of maths helps, the simulation is designed to be intuitive for all learners."
    }
  ],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/maths/alzebra" />;
}
