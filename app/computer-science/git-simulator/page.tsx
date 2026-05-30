import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Git Simulator - Computer-science Lab | OpenLabs",
  description: "Learn version control visually.",
};

const content: EducationalContent = {
  slug: "git-simulator",
  subject: "Computer-science",
  title: "Git Simulator",
  description: "Learn version control visually.",
  difficulty: "Beginner",
  estimatedTime: "15 mins",
  heroDescription: "Explore our interactive Git Simulator simulation to understand the fundamental concepts in computer-science.",
  theory: {
    content: "<p>This educational simulation provides an interactive environment to explore the theory and mechanics of Git Simulator. By experimenting with variables in real-time, you can intuitively grasp complex scientific concepts.</p>"
  },
  learningObjectives: [
    "Understand the core principles of Git Simulator.",
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
      answer: "You will learn the fundamental mechanics of Git Simulator through interactive experimentation."
    },
    {
      question: "Do I need prior knowledge?",
      answer: "While some basic understanding of computer-science helps, the simulation is designed to be intuitive for all learners."
    }
  ],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/computer-science/git-simulator" />;
}
