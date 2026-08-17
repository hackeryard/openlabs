import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Caesar Cipher & Rotating Wheel - Interactive Computer Science Lab | OpenLabs",
  description: "Explore the Caesar shift substitution cipher, rotating cipher wheels, live letter-by-letter transformation cards, and Chi-squared auto-cracking.",
};

const content: EducationalContent = {
  slug: "cryptography/caesar",
  subject: "Computer Science",
  title: "Caesar Cipher & Rotating Wheel Studio",
  description: "Master Julius Caesar's shift substitution cipher with interactive rotating wheels, letter-by-letter live flip cards, and frequency analysis auto-crackers.",
  difficulty: "Beginner",
  estimatedTime: "15 mins",
  heroDescription: "Shift alphabets forward and backward to send and crack secret encrypted messages.",
  theory: {
    content: `<p>The <strong>Caesar Cipher</strong> is one of the earliest known encryption techniques, used by Julius Caesar to protect military orders. Every letter in the plaintext is shifted forward by a fixed displacement <code>k</code>: <code>C \\equiv (P + k) \\pmod{26}</code>.</p>`,
  },
  mathematicalFoundations: {
    equations: ["C \\equiv (P + k) \\pmod{26}", "P \\equiv (C - k) \\pmod{26}"],
    explanation: "Modular arithmetic wraps letters around the 26-letter alphabet.",
  },
  learningObjectives: [
    "Rotate the Caesar cipher wheel to explore letter shifts.",
    "Observe real-time letter-by-letter card transformations.",
    "Auto-crack encrypted text using Chi-squared letter frequency analysis.",
  ],
  realWorldApplications: ["Historical military codes", "ROT13 internet spoiler masking", "Introductory cryptography teaching"],
  howItWorks: "Type your message, adjust the shift slider, and watch letters transform.",
  faqs: [
    {
      question: "Why is Caesar cipher easy to crack?",
      answer: "Because there are only 25 possible shifts, and standard English letter frequencies (like 'E' appearing 13% of the time) remain unchanged.",
    },
  ],
  relatedExperiments: [],
};

export default function CaesarLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/computer-science/cryptography/caesar"
    />
  );
}
