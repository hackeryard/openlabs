import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Osi Model | OpenLabs",
  description: "Interactive Osi Model exploration.",
};

const content: EducationalContent = {
  slug: "osi-model",
  subject: "Computer Science",
  title: "Osi Model",
  description: "Interactive Osi Model exploration and visualization.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Explore and interact with the Osi Model in this visually engaging lab environment.",
  theory: { content: "<p>Learn about the principles, concepts, and applications behind Osi Model. This interactive module provides a hands-on approach to understanding the underlying mechanics.</p>" },
  learningObjectives: ["Understand the core concepts of Osi Model.", "Apply theoretical knowledge in an interactive scenario."],
  realWorldApplications: ["Academic Study", "Practical engineering and design"],
  howItWorks: "Interact with the visualization to see the immediate effects of your changes.",
  faqs: [{ question: "What is Osi Model?", answer: "It is a foundational concept in Computer Science that is essential for advanced study." }],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/computer-science/networking/osi-model" />;
}
