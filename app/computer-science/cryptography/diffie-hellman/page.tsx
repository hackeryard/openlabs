import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diffie-Hellman Key Exchange - Interactive Computer Science Lab | OpenLabs",
  description: "Explore asymmetric Diffie-Hellman key exchange. Visualize paint color mixing, discrete logarithms, and eavesdropper security.",
};

const content: EducationalContent = {
  slug: "cryptography/diffie-hellman",
  subject: "Computer Science",
  title: "Diffie-Hellman Key Exchange Studio",
  description: "Discover how strangers on the open internet create shared secret encryption keys without hackers intercepting them.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Understand the math and color mixing behind HTTPS and modern internet security.",
  theory: {
    content: `<p>The <strong>Diffie-Hellman Key Exchange</strong> revolutionized cryptography in 1976 by solving the key distribution problem. Using one-way modular exponentiation, two parties establish a shared secret over an open channel.</p>`,
  },
  mathematicalFoundations: {
    equations: [
      "A \\equiv g^a \\pmod p, \\quad B \\equiv g^b \\pmod p",
      "S \\equiv B^a \\equiv A^b \\equiv g^{ab} \\pmod p",
    ],
    explanation: "Based on the computational difficulty of the Discrete Logarithm Problem.",
  },
  learningObjectives: [
    "Understand the 4-step paint color mixing analogy.",
    "Calculate modular exponentiations and shared secret convergence.",
    "Learn why eavesdroppers cannot determine private keys.",
  ],
  realWorldApplications: ["HTTPS / TLS internet security", "SSH secure shell connections", "End-to-end encrypted messaging (Signal, WhatsApp)"],
  howItWorks: "Simulate handshakes live and adjust secret exponents to see keys calculate in real time.",
  faqs: [
    {
      question: "Can hackers steal the secret key?",
      answer: "No. Eavesdroppers only see public values A and B. Reversing g^a mod p for 2048-bit primes would take billions of years.",
    },
  ],
  relatedExperiments: [],
};

export default function DiffieHellmanLandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/computer-science/cryptography/diffie-hellman"
    />
  );
}
