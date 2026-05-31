import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Animal Cell Simulation | OpenLabs",
  description: "Interactive animal cell explorer.",
};

const content: EducationalContent = {
  slug: "animal",
  subject: "Biology",
  title: "Animal Cell",
  description: "Interactive animal cell explorer.",
  difficulty: "Beginner",
  estimatedTime: "15 mins",
  heroDescription: "Explore the organelles of an animal cell in this interactive 3D simulation.",
  theory: { content: "<p>Animal cells are typical of the eukaryotic cell, enclosed by a plasma membrane and containing a membrane-bound nucleus and organelles.</p>" },
  learningObjectives: ["Identify animal cell organelles.", "Understand their functions."],
  realWorldApplications: ["Medicine", "Cell biology research"],
  howItWorks: "Interact with the 3D model to explore different parts of the animal cell.",
  faqs: [{ question: "What is an animal cell?", answer: "A type of eukaryotic cell that lacks a cell wall and has a true, membrane-bound nucleus." }],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/biology/cell/animal" />;
}
