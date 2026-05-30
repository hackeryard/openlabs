import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insertion Sort | OpenLabs",
  description: "Interactive Insertion Sort exploration.",
};

const content: EducationalContent = {
  slug: "insertion-sort",
  subject: "Computer Science",
  title: "Insertion Sort",
  description: "Interactive Insertion Sort exploration and visualization.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Explore and interact with the Insertion Sort in this visually engaging lab environment.",
  theory: { content: "<p>Learn about the principles, concepts, and applications behind Insertion Sort. This interactive module provides a hands-on approach to understanding the underlying mechanics.</p>" },
  learningObjectives: ["Understand the core concepts of Insertion Sort.", "Apply theoretical knowledge in an interactive scenario."],
  realWorldApplications: ["Academic Study", "Practical engineering and design"],
  howItWorks: "Interact with the visualization to see the immediate effects of your changes.",
  faqs: [{ question: "What is Insertion Sort?", answer: "It is a foundational concept in Computer Science that is essential for advanced study." }],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/computer-science/dsa/sorting/insertion-sort" />;
}
