import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plant Cell Simulation | OpenLabs",
  description: "Interactive plant cell explorer.",
};

const content: EducationalContent = {
  slug: "plant",
  subject: "Biology",
  title: "Plant Cell",
  description: "Interactive plant cell explorer.",
  difficulty: "Beginner",
  estimatedTime: "15 mins",
  heroDescription: "Explore the organelles of a plant cell in this interactive 3D simulation.",
  theory: { content: "<p>Plant cells are eukaryotic cells with a true nucleus along with specialized structures called organelles that carry out certain specific functions. Unlike animal cells, they have a cell wall and chloroplasts.</p>" },
  learningObjectives: ["Identify plant cell organelles.", "Understand the function of the cell wall and chloroplasts."],
  realWorldApplications: ["Agriculture", "Botany research"],
  howItWorks: "Interact with the 3D model to explore different parts of the plant cell.",
  faqs: [{ question: "What is a plant cell?", answer: "A eukaryotic cell that contains a cell wall, chloroplasts, and a large central vacuole." }],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/biology/cell/plant" />;
}
