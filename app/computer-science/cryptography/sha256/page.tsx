import React from "react";
import EducationalLandingLayout from "@/components/EducationalLandingLayout";
import { EducationalContent } from "@/types/education";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SHA-256 Hashing & Bitcoin Mining - Interactive Computer Science Lab | OpenLabs",
  description: "Explore the SHA-256 cryptographic hash function, bit-level Avalanche Effect, and real-time Proof-of-Work Bitcoin mining.",
};

const content: EducationalContent = {
  slug: "cryptography/sha256",
  subject: "Computer Science",
  title: "SHA-256 Hashing & Bitcoin Mining Studio",
  description: "Explore one-way cryptographic hash functions, the 50% bit Avalanche Effect, and simulate Bitcoin Proof-of-Work block mining nonces.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Experience how changing one letter completely scrambles 256 bits of data, and mine blocks live.",
  theory: {
    content: `<p><strong>SHA-256</strong> (Secure Hash Algorithm 256-bit) produces a unique 64-character hexadecimal digest. Its core strength is the <strong>Avalanche Effect</strong>: changing even a single bit of input flips approximately 50% of the output bits at random.</p>`,
  },
  mathematicalFoundations: {
    equations: [
      "\\text{SHA-256}(\\text{Data} + \\text{Nonce}) < \\text{Target Difficulty}",
    ],
    explanation: "Cryptographic compression functions and Proof-of-Work difficulty targets.",
  },
  learningObjectives: [
    "Visualize 256-bit difference maps across similar texts.",
    "Understand the mathematical Avalanche Effect.",
    "Mine Bitcoin blocks by searching for nonces with leading zeros.",
  ],
  realWorldApplications: ["Bitcoin blockchain consensus", "Digital file integrity and checksums", "Password hashing and secure digital signatures"],
  howItWorks: "Change text inputs to see bit grids flip, or click Mine Block to cycle nonces live.",
  faqs: [
    {
      question: "What is Proof-of-Work?",
      answer: "Miners repeatedly compute SHA-256 hashes with different nonces until finding one that starts with the required number of leading zeroes.",
    },
  ],
  relatedExperiments: [],
};

export default function Sha256LandingPage() {
  return (
    <EducationalLandingLayout
      content={content}
      launchUrl="/labs/computer-science/cryptography/sha256"
    />
  );
}
