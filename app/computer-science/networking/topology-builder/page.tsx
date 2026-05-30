import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Topology Builder | OpenLabs",
  description: "Interactive Topology Builder exploration.",
};

const content: EducationalContent = {
  slug: "topology-builder",
  subject: "Computer Science",
  title: "Topology Builder",
  description: "Interactive Topology Builder exploration and visualization.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Explore and interact with the Topology Builder in this visually engaging lab environment.",
  theory: { content: "<p>Learn about the principles, concepts, and applications behind Topology Builder. This interactive module provides a hands-on approach to understanding the underlying mechanics.</p>" },
  learningObjectives: ["Understand the core concepts of Topology Builder.", "Apply theoretical knowledge in an interactive scenario."],
  realWorldApplications: ["Academic Study", "Practical engineering and design"],
  howItWorks: "Interact with the visualization to see the immediate effects of your changes.",
  faqs: [{ question: "What is Topology Builder?", answer: "It is a foundational concept in Computer Science that is essential for advanced study." }],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/computer-science/networking/topology-builder" />;
}
