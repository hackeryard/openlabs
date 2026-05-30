import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hooke's Law - Physics Lab | OpenLabs",
  description: "Mass–spring system: observe oscillations and measure period.",
};

const content: EducationalContent = {
  slug: "hookelaw",
  subject: "Physics",
  title: "Hooke's Law",
  description: "Mass–spring system: observe oscillations and measure period.",
  difficulty: "Beginner",
  estimatedTime: "15 mins",
  heroDescription: "Explore our interactive Hooke's Law simulation to understand the fundamental concepts in physics.",
  theory: {
    content: "<p>This educational simulation provides an interactive environment to explore the theory and mechanics of Hooke's Law. By experimenting with variables in real-time, you can intuitively grasp complex scientific concepts.</p>"
  },
  learningObjectives: [
    "Understand the core principles of Hooke's Law.",
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
      answer: "You will learn the fundamental mechanics of Hooke's Law through interactive experimentation."
    },
    {
      question: "Do I need prior knowledge?",
      answer: "While some basic understanding of physics helps, the simulation is designed to be intuitive for all learners."
    }
  ],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/physics/hookelaw" />;
}
