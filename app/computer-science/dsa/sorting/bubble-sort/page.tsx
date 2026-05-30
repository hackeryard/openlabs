import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bubble Sort | OpenLabs",
  description: "Interactive Bubble Sort exploration.",
};

const content: EducationalContent = {
  slug: "bubble-sort",
  subject: "Computer Science",
  title: "Bubble Sort",
  description: "Interactive Bubble Sort exploration and visualization.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Explore and interact with the Bubble Sort in this visually engaging lab environment.",
  theory: { content: "<p>Learn about the principles, concepts, and applications behind Bubble Sort. This interactive module provides a hands-on approach to understanding the underlying mechanics.</p>" },
  learningObjectives: ["Understand the core concepts of Bubble Sort.", "Apply theoretical knowledge in an interactive scenario."],
  realWorldApplications: ["Academic Study", "Practical engineering and design"],
  howItWorks: "Interact with the visualization to see the immediate effects of your changes.",
  faqs: [{ question: "What is Bubble Sort?", answer: "It is a foundational concept in Computer Science that is essential for advanced study." }],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/computer-science/dsa/sorting/bubble-sort" />;
}
