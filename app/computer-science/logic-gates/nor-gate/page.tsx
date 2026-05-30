import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nor Gate | OpenLabs",
  description: "Interactive Nor Gate exploration.",
};

const content: EducationalContent = {
  slug: "nor-gate",
  subject: "Computer Science",
  title: "Nor Gate",
  description: "Interactive Nor Gate exploration and visualization.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Explore and interact with the Nor Gate in this visually engaging lab environment.",
  theory: { content: "<p>Learn about the principles, concepts, and applications behind Nor Gate. This interactive module provides a hands-on approach to understanding the underlying mechanics.</p>" },
  learningObjectives: ["Understand the core concepts of Nor Gate.", "Apply theoretical knowledge in an interactive scenario."],
  realWorldApplications: ["Academic Study", "Practical engineering and design"],
  howItWorks: "Interact with the visualization to see the immediate effects of your changes.",
  faqs: [{ question: "What is Nor Gate?", answer: "It is a foundational concept in Computer Science that is essential for advanced study." }],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/computer-science/logic-gates/nor-gate" />;
}
