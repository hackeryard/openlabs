import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xnor Gate | OpenLabs",
  description: "Interactive Xnor Gate exploration.",
};

const content: EducationalContent = {
  slug: "xnor-gate",
  subject: "Computer Science",
  title: "Xnor Gate",
  description: "Interactive Xnor Gate exploration and visualization.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Explore and interact with the Xnor Gate in this visually engaging lab environment.",
  theory: { content: "<p>Learn about the principles, concepts, and applications behind Xnor Gate. This interactive module provides a hands-on approach to understanding the underlying mechanics.</p>" },
  learningObjectives: ["Understand the core concepts of Xnor Gate.", "Apply theoretical knowledge in an interactive scenario."],
  realWorldApplications: ["Academic Study", "Practical engineering and design"],
  howItWorks: "Interact with the visualization to see the immediate effects of your changes.",
  faqs: [{ question: "What is Xnor Gate?", answer: "It is a foundational concept in Computer Science that is essential for advanced study." }],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/computer-science/logic-gates/xnor-gate" />;
}
