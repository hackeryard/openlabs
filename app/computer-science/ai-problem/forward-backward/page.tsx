import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forward Backward | OpenLabs",
  description: "Interactive Forward Backward exploration.",
};

const content: EducationalContent = {
  slug: "forward-backward",
  subject: "Computer Science",
  title: "Forward Backward",
  description: "Interactive Forward Backward exploration and visualization.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Explore and interact with the Forward Backward in this visually engaging lab environment.",
  theory: { content: "<p>Learn about the principles, concepts, and applications behind Forward Backward. This interactive module provides a hands-on approach to understanding the underlying mechanics.</p>" },
  learningObjectives: ["Understand the core concepts of Forward Backward.", "Apply theoretical knowledge in an interactive scenario."],
  realWorldApplications: ["Academic Study", "Practical engineering and design"],
  howItWorks: "Interact with the visualization to see the immediate effects of your changes.",
  faqs: [{ question: "What is Forward Backward?", answer: "It is a foundational concept in Computer Science that is essential for advanced study." }],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/computer-science/ai-problem/forward-backward" />;
}
