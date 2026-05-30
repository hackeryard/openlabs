import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Water Jug | OpenLabs",
  description: "Interactive Water Jug exploration.",
};

const content: EducationalContent = {
  slug: "water-jug",
  subject: "Computer Science",
  title: "Water Jug",
  description: "Interactive Water Jug exploration and visualization.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Explore and interact with the Water Jug in this visually engaging lab environment.",
  theory: { content: "<p>Learn about the principles, concepts, and applications behind Water Jug. This interactive module provides a hands-on approach to understanding the underlying mechanics.</p>" },
  learningObjectives: ["Understand the core concepts of Water Jug.", "Apply theoretical knowledge in an interactive scenario."],
  realWorldApplications: ["Academic Study", "Practical engineering and design"],
  howItWorks: "Interact with the visualization to see the immediate effects of your changes.",
  faqs: [{ question: "What is Water Jug?", answer: "It is a foundational concept in Computer Science that is essential for advanced study." }],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/computer-science/ai-problem/water-jug" />;
}
