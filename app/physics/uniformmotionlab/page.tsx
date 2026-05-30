import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uniform Motion Lab - Physics Lab | OpenLabs",
  description: "Uniform linear motion using a moving object.",
};

const content: EducationalContent = {
  slug: "uniformmotionlab",
  subject: "Physics",
  title: "Uniform Motion Lab",
  description: "Uniform linear motion using a moving object.",
  difficulty: "Beginner",
  estimatedTime: "15 mins",
  heroDescription: "Explore our interactive Uniform Motion Lab simulation to understand the fundamental concepts in physics.",
  theory: {
    content: "<p>This educational simulation provides an interactive environment to explore the theory and mechanics of Uniform Motion Lab. By experimenting with variables in real-time, you can intuitively grasp complex scientific concepts.</p>"
  },
  learningObjectives: [
    "Understand the core principles of Uniform Motion Lab.",
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
      answer: "You will learn the fundamental mechanics of Uniform Motion Lab through interactive experimentation."
    },
    {
      question: "Do I need prior knowledge?",
      answer: "While some basic understanding of physics helps, the simulation is designed to be intuitive for all learners."
    }
  ],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/physics/uniformmotionlab" />;
}
