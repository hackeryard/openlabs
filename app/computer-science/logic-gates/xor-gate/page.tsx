import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xor Gate | OpenLabs",
  description: "Interactive Xor Gate exploration.",
};

const content: EducationalContent = {
  slug: "xor-gate",
  subject: "Computer Science",
  title: "Xor Gate",
  description: "Interactive Xor Gate exploration and visualization.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Explore and interact with the Xor Gate in this visually engaging lab environment.",
  theory: { content: "<p>Learn about the principles, concepts, and applications behind Xor Gate. This interactive module provides a hands-on approach to understanding the underlying mechanics.</p>" },
  learningObjectives: ["Understand the core concepts of Xor Gate.", "Apply theoretical knowledge in an interactive scenario."],
  realWorldApplications: ["Academic Study", "Practical engineering and design"],
  howItWorks: "Interact with the visualization to see the immediate effects of your changes.",
  faqs: [{ question: "What is Xor Gate?", answer: "It is a foundational concept in Computer Science that is essential for advanced study." }],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/computer-science/logic-gates/xor-gate" />;
}
