import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blockchain & Cryptography - Interactive Simulation | OpenLabs",
  description: "Explore blockchain technology, distributed ledgers, and cryptographic principles through interactive visualization and simulation.",
  keywords: [
    "blockchain",
    "cryptocurrency",
    "cryptography",
    "distributed ledger",
    "smart contracts",
    "bitcoin",
    "ethereum",
    "computer science simulation"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science/blockchain",
  },
  openGraph: {
    title: "Blockchain & Cryptography - Interactive Simulation | OpenLabs",
    description: "Explore blockchain technology, distributed ledgers, and cryptographic principles through interactive visualization and simulation.",
    url: "https://www.openlabs.org.in/computer-science/blockchain",
    type: "website",
    images: [{
      url: "https://www.openlabs.org.in/images/computer-science/blockchain-hero.png",
      alt: "Blockchain Lab | OpenLabs"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Blockchain & Cryptography - Interactive Simulation | OpenLabs",
    description: "Explore blockchain technology, distributed ledgers, and cryptographic principles through interactive visualization and simulation.",
    images: ["https://www.openlabs.org.in/images/computer-science/blockchain-hero.png"]
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "block",
  subject: "Computer Science",
  title: "Block",
  description: "Interactive Block exploration and visualization.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Explore and interact with the Block in this visually engaging lab environment.",
  theory: { content: "<p>Learn about the principles, concepts, and applications behind Block. This interactive module provides a hands-on approach to understanding the underlying mechanics.</p>" },
  learningObjectives: ["Understand the core concepts of Block.", "Apply theoretical knowledge in an interactive scenario."],
  realWorldApplications: ["Academic Study", "Practical engineering and design"],
  howItWorks: "Interact with the visualization to see the immediate effects of your changes.",
  faqs: [{ question: "What is Block?", answer: "It is a foundational concept in Computer Science that is essential for advanced study." }],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/computer-science/blockchain" />;
}
