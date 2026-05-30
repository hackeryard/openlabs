import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brain & Neurons - Biology Lab | OpenLabs",
  description: "Understand neural networks and brain anatomy.",
};

const content: EducationalContent = {
  slug: "brainNeuron",
  subject: "Biology",
  title: "Brain & Neurons",
  description: "Understand neural networks and brain anatomy.",
  difficulty: "Beginner",
  estimatedTime: "15 mins",
  heroDescription: "Explore our interactive Brain & Neurons simulation to understand the fundamental concepts in biology.",
  theory: {
    content: "<p>This educational simulation provides an interactive environment to explore the theory and mechanics of Brain & Neurons. By experimenting with variables in real-time, you can intuitively grasp complex scientific concepts.</p>"
  },
  learningObjectives: [
    "Understand the core principles of Brain & Neurons.",
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
      answer: "You will learn the fundamental mechanics of Brain & Neurons through interactive experimentation."
    },
    {
      question: "Do I need prior knowledge?",
      answer: "While some basic understanding of biology helps, the simulation is designed to be intuitive for all learners."
    }
  ],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/biology/brainNeuron" />;
}
