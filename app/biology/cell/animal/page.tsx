import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Animal Cell Simulation - Biology Lab | OpenLabs",
  description: "Interactive animal cell explorer with 3D visualization of organelles, nucleus, and cellular structures for biology education.",
  keywords: [
    "animal cell",
    "cell organelles",
    "cell membrane",
    "nucleus",
    "mitochondria",
    "endoplasmic reticulum",
    "eukaryotic cells",
    "cell biology lab"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/cell/animal",
  },
  openGraph: {
    title: "Animal Cell Simulation | Interactive Cell Biology Lab | OpenLabs",
    description: "Interactive animal cell explorer with 3D visualization of organelles, nucleus, and cellular structures for biology education.",
    url: "https://www.openlabs.org.in/biology/cell/animal",
    type: "website",
    images: [{
      url: "https://www.openlabs.org.in/images/biology/animal-cell-hero.png",
      alt: "Animal Cell Simulation | OpenLabs"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Animal Cell Simulation | Interactive Cell Biology Lab | OpenLabs",
    description: "Interactive animal cell explorer with 3D visualization of organelles, nucleus, and cellular structures for biology education.",
    images: ["https://www.openlabs.org.in/images/biology/animal-cell-hero.png"]
  },
  robots: {
    index: true,
    follow: true,
  },
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
