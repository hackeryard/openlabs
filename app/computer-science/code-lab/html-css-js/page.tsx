import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Html Css Js | OpenLabs",
  description: "Interactive Html Css Js exploration.",
};

const content: EducationalContent = {
  slug: "html-css-js",
  subject: "Computer Science",
  title: "Html Css Js",
  description: "Interactive Html Css Js exploration and visualization.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Explore and interact with the Html Css Js in this visually engaging lab environment.",
  theory: { content: "<p>Learn about the principles, concepts, and applications behind Html Css Js. This interactive module provides a hands-on approach to understanding the underlying mechanics.</p>" },
  learningObjectives: ["Understand the core concepts of Html Css Js.", "Apply theoretical knowledge in an interactive scenario."],
  realWorldApplications: ["Academic Study", "Practical engineering and design"],
  howItWorks: "Interact with the visualization to see the immediate effects of your changes.",
  faqs: [{ question: "What is Html Css Js?", answer: "It is a foundational concept in Computer Science that is essential for advanced study." }],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/computer-science/code-lab/html-css-js" />;
}
