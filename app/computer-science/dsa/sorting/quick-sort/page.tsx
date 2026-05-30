import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quick Sort | OpenLabs",
  description: "Interactive Quick Sort exploration.",
};

const content: EducationalContent = {
  slug: "quick-sort",
  subject: "Computer Science",
  title: "Quick Sort",
  description: "Interactive Quick Sort exploration and visualization.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Explore and interact with the Quick Sort in this visually engaging lab environment.",
  theory: { content: "<p>Learn about the principles, concepts, and applications behind Quick Sort. This interactive module provides a hands-on approach to understanding the underlying mechanics.</p>" },
  learningObjectives: ["Understand the core concepts of Quick Sort.", "Apply theoretical knowledge in an interactive scenario."],
  realWorldApplications: ["Academic Study", "Practical engineering and design"],
  howItWorks: "Interact with the visualization to see the immediate effects of your changes.",
  faqs: [{ question: "What is Quick Sort?", answer: "It is a foundational concept in Computer Science that is essential for advanced study." }],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/computer-science/dsa/sorting/quick-sort" />;
}
