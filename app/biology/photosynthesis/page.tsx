import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photosynthesis Simulator - Biology Lab | OpenLabs",
  description: "Explore how Light, CO2, Water, and Temperature interact to determine the rate of photosynthesis and understand Blackman's Law of Limiting Factors.",
  keywords: [
    "photosynthesis",
    "limiting factors",
    "biology simulation",
    "calvin cycle",
    "light reactions",
    "interactive science lab",
    "plant biology education",
    "chloroplast"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/biology/photosynthesis",
  },
  openGraph: {
    title: "Photosynthesis Simulator - Interactive Biology Lab | OpenLabs",
    description: "Explore how Light, CO2, Water, and Temperature interact to determine the rate of photosynthesis and understand Blackman's Law of Limiting Factors.",
    url: "https://www.openlabs.org.in/biology/photosynthesis",
    type: "website",
    images: [{
      url: "https://www.openlabs.org.in/images/biology/photosynthesis-hero.png",
      alt: "Photosynthesis Lab | OpenLabs"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Photosynthesis Simulator - Interactive Biology Lab | OpenLabs",
    description: "Explore how Light, CO2, Water, and Temperature interact to determine the rate of photosynthesis and understand Blackman's Law of Limiting Factors.",
    images: ["https://www.openlabs.org.in/images/biology/photosynthesis-hero.png"]
  },
  robots: {
    index: true,
    follow: true,
  },
};

const content: EducationalContent = {
  slug: "photosynthesis",
  subject: "Biology",
  title: "Photosynthesis Simulator",
  description: "Explore how environmental variables affect the rate of photosynthesis.",
  difficulty: "Beginner",
  estimatedTime: "20 mins",
  heroDescription: "Interact with Light, CO₂, Water, and Temperature to understand Blackman's Law of Limiting Factors in our live photosynthesis simulation.",
  theory: {
    content: "<p>Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy. The overall equation is <code>6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂</code>.</p><p>This lab demonstrates Blackman's Law of Limiting Factors, which states that when a biological process depends on multiple factors, the overall rate of the process is limited by the factor that is nearest to its minimum value.</p>"
  },
  learningObjectives: [
    "Identify the main inputs and outputs of photosynthesis.",
    "Observe real-time changes in photosynthetic rate by manipulating environmental variables.",
    "Understand and apply Blackman's Law of Limiting Factors."
  ],
  realWorldApplications: [
    "Greenhouse management and agriculture",
    "Understanding climate change impact on plant life",
    "Botany and plant physiology research"
  ],
  howItWorks: "Launch the lab to interact with the environment. Use the sliders for Light Intensity, CO₂, Water, and Temperature to observe how the rate of oxygen bubbles and the plant cross-section respond.",
  faqs: [
    {
      question: "What is a limiting factor?",
      answer: "A limiting factor is an environmental condition (like light or CO₂) that is in shortest supply relative to the plant's needs, thus determining the maximum possible rate of photosynthesis."
    },
    {
      question: "Why does the rate decrease at very high temperatures?",
      answer: "At extreme temperatures, the enzymes responsible for facilitating the chemical reactions of photosynthesis (like Rubisco) begin to denature, causing the process to slow down or halt completely."
    }
  ],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/biology/photosynthesis" />;
}
