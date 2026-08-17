import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "WWII Enigma Machine Simulator - Interactive Computer Science Lab | OpenLabs",
  description: "Explore the WWII Wehrmacht Enigma rotor machine. Step through 3 rotors, Reflector UKW-B, Steckerbrett plugboard, and glowing lampboards.",
};

const content: EducationalContent = {
  slug: "cryptography/enigma",
  subject: "Computer Science",
  title: "WWII Enigma Machine Simulator",
  description: "Step into Bletchley Park and simulate the electro-mechanical cipher machine that shaped World War II.",
  difficulty: "Advanced",
  estimatedTime: "25 mins",
  heroDescription: "Experience the spinning rotors, plugboard swaps, and fatal mathematical flaw of the German military Enigma machine.",
  theory: {
    content: `<p>The <strong>Enigma Machine</strong> was an electro-mechanical rotor cipher machine. Each keypress stepped the right rotor and sent current through 3 scrambling rotors, a reflector, and back through the rotors to light up a lampboard bulb.</p>`,
  },
  mathematicalFoundations: {
    equations: ["E(x) = P^{-1} R_1^{-1} R_2^{-1} R_3^{-1} U R_3 R_2 R_1 P(x)", "E(x) \\neq x \\quad \\text{(Fatal Flaw: Never encrypts to itself)}"],
    explanation: "Permutation group theory and reversible rotor circuits.",
  },
  learningObjectives: [
    "Step through 3 rotating mechanical rotors with turnover notches.",
    "Trace the electrical current through the plugboard and reflector.",
    "Understand why the impossibility of self-encryption enabled Turing's Bombe to break Enigma.",
  ],
  realWorldApplications: ["WWII military intelligence", "Birth of modern computer science and Bletchley Park codebreaking"],
  howItWorks: "Press keyboard keys or use the auto-typer to watch rotors spin and bulbs glow.",
  faqs: [
    {
      question: "Why was Enigma's self-encryption flaw so critical?",
      answer: "Because a letter like 'E' could never be enciphered as 'E', codebreakers could eliminate thousands of rotor alignments in seconds.",
    },
  ],
  relatedExperiments: [],
};

export default function EnigmaLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/computer-science/cryptography/enigma"
    />
  );
}
