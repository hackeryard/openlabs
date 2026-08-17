import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vigenère Cipher & Tabula Recta - Interactive Computer Science Lab | OpenLabs",
  description: "Explore the polyalphabetic Vigenère cipher, repeating keystreams, live 26x26 Tabula Recta matrix lookup, and letter-by-letter live encryption.",
};

const content: EducationalContent = {
  slug: "cryptography/vigenere",
  subject: "Computer Science",
  title: "Vigenère Cipher & Tabula Recta Studio",
  description: "Explore the historic 'unbreakable cipher' that defeated frequency analysis for 300 years using repeating passwords and 26x26 letter lookup grids.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Use repeating keywords to shift each letter by a different amount on the Tabula Recta grid.",
  theory: {
    content: `<p>The <strong>Vigenère Cipher</strong> is a polyalphabetic substitution cipher. By shifting each letter using a repeated keyword, it smooths out single-letter frequency spikes, making simple frequency attacks useless.</p>`,
  },
  mathematicalFoundations: {
    equations: ["C_i \\equiv (P_i + K_{i \\pmod m}) \\pmod{26}"],
    explanation: "Each letter i is shifted by the numerical value of the i-th character in the repeating key of length m.",
  },
  learningObjectives: [
    "Navigate the 26x26 Tabula Recta matrix.",
    "Understand how repeating passwords smooth frequency spikes.",
    "Perform animated letter-by-letter encryption and decryption.",
  ],
  realWorldApplications: ["16th-19th century diplomatic correspondence", "Foundations of polyalphabetic substitution"],
  howItWorks: "Type a keyword and message, then watch the table scan row and column intersections.",
  faqs: [
    {
      question: "Why was Vigenère called 'The Unbreakable Cipher'?",
      answer: "Because the letter 'E' turns into different ciphertext letters across words depending on the keyword position.",
    },
  ],
  relatedExperiments: [],
};

export default function VigenereLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/computer-science/cryptography/vigenere"
    />
  );
}
