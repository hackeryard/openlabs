import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

const pageUrl = "https://www.openlabs.org.in/computer-science/code-lab/java";

export const metadata: Metadata = {
  title: "Java Code Lab - Interactive Java Programming | OpenLabs",
  description: "Learn Java programming with an interactive code lab. Write, run, and visualize Java code with instant feedback and debugging.",
  keywords: [
    "Java code lab",
    "Java programming",
    "Java online editor",
    "learn Java online",
    "Java compiler online",
    "interactive Java",
    "programming education",
    "OpenLabs computer science lab"
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Java Code Lab - Interactive Java Programming | OpenLabs",
    description: "Learn Java programming with an interactive code lab. Write, run, and visualize Java code with instant feedback and debugging.",
    url: pageUrl,
    type: "website",
    images: [{
      url: "https://www.openlabs.org.in/images/og-image.svg",
      width: 1200,
      height: 630,
      alt: "Java Code Lab | OpenLabs"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Java Code Lab - Interactive Java Programming | OpenLabs",
    description: "Learn Java programming with an interactive code lab. Write, run, and visualize Java code with instant feedback and debugging.",
    images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
  },
};

const content: EducationalContent = {
  slug: "java",
  subject: "Computer Science",
  title: "Java",
  description: "Interactive Java exploration and visualization.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Explore and interact with Java in this visually engaging lab environment.",
  theory: { content: "<p>Learn about the principles, concepts, and applications behind Java. This interactive module provides a hands-on approach to understanding the underlying mechanics.</p>" },
  learningObjectives: ["Understand the core concepts of Java.", "Apply theoretical knowledge in an interactive scenario."],
  realWorldApplications: ["Academic Study", "Practical engineering and design"],
  howItWorks: "Interact with the visualization to see the immediate effects of your changes.",
  faqs: [{ question: "What is Java?", answer: "It is a foundational concept in Computer Science that is essential for advanced study." }],
  relatedExperiments: []
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/computer-science/code-lab/java" />;
}
