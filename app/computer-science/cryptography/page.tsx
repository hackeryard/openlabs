import React from "react";
import type { Metadata } from "next";
import SubtopicHubLayout, {
  SubtopicCard,
  HowToStep,
  ScientificPrinciple,
  SubtopicFeature,
  SubtopicFAQ,
} from "@/app/components/SubtopicHubLayout";
import { KeyRound, Gauge, LineChart, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Classical & Modern Cryptography Virtual Labs | OpenLabs",
  description: "Explore interactive cryptography virtual labs including Caesar cipher wheels, Vigenère matrix lookup, WWII Enigma machine simulations, Diffie-Hellman key exchanges, and SHA-256 Bitcoin mining.",
  keywords: [
    "cryptography virtual labs",
    "caesar cipher wheel",
    "vigenere cipher matrix",
    "enigma machine simulator",
    "diffie hellman key exchange",
    "sha256 avalanche effect",
    "bitcoin proof of work",
    "asymmetric public key cryptography"
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science/cryptography",
  },
};

const cards: SubtopicCard[] = [
  {
    href: "/computer-science/cryptography/caesar",
    title: "Caesar Cipher Wheel",
    desc: "Interactive rotating cipher wheel, letter-by-letter live flip cards, and frequency distribution auto-cracker.",
    tag: "Classical",
    formula: "E(x) = (x + k) mod 26",
    difficulty: "Beginner",
    duration: "8 min",
  },
  {
    href: "/computer-science/cryptography/vigenere",
    title: "Vigenère Cipher Matrix",
    desc: "Polyalphabetic substitution cipher with live 26x26 Tabula Recta lookup and repeated password keystreams.",
    tag: "Classical",
    formula: "C_i = (P_i + K_i) mod 26",
    difficulty: "Intermediate",
    duration: "12 min",
  },
  {
    href: "/computer-science/cryptography/enigma",
    title: "WWII Enigma Machine Simulator",
    desc: "Electro-mechanical cipher simulator with 3 stepping rotors, Reflector UKW-B, plugboard, and glowing lampboard.",
    tag: "Historical",
    formula: "Permutation Cycle Decomposition",
    difficulty: "Advanced",
    duration: "20 min",
  },
  {
    href: "/computer-science/cryptography/diffie-hellman",
    title: "Diffie-Hellman Key Exchange",
    desc: "Asymmetric internet key exchange with visual paint color-mixing and discrete logarithm modular arithmetic.",
    tag: "Modern",
    formula: "K = (g^a)^b mod p = g^(ab) mod p",
    difficulty: "Intermediate",
    duration: "15 min",
  },
  {
    href: "/computer-science/cryptography/sha256",
    title: "SHA-256 Hashing & Mining",
    desc: "Cryptographic hash sandbox with bit-level avalanche effect visualization and interactive Proof of Work target mining.",
    tag: "Modern",
    formula: "SHA256(Block + Nonce) < Target",
    difficulty: "Intermediate",
    duration: "15 min",
  },
];

const howToSteps: HowToStep[] = [
  {
    step: 1,
    title: "Select Cipher or Cryptographic Protocol",
    desc: "Choose classical substitution wheels (Caesar, Vigenère), mechanical military machines (Enigma), or modern public-key cryptography.",
  },
  {
    step: 2,
    title: "Configure Keys, Passwords & Rotors",
    desc: "Set shift offsets, secret shared passphrases, rotor starting positions, or prime modulus parameters.",
  },
  {
    step: 3,
    title: "Encrypt / Decrypt & Inspect Bit Transformations",
    desc: "Type plaintext messages and observe live step-by-step substitution, modular exponentiations, and hash bit avalanche shifts.",
  },
  {
    step: 4,
    title: "Conduct Cryptanalysis & Crack Ciphers",
    desc: "Use frequency analysis histograms and brute-force key search tools to evaluate cipher resistance to attack.",
  },
];

const scientificPrinciples: ScientificPrinciple[] = [
  {
    domain: "Classical Substitution",
    laws: "Modular Arithmetic & Frequency Entropy",
    formulas: "E(x) = (x + k) mod 26, D(y) = (y - k) mod 26",
    solver: "Letter Frequency Distribution & Chi-Squared Analyzer",
  },
  {
    domain: "Asymmetric Key Exchange",
    laws: "Discrete Logarithm Problem (DLP)",
    formulas: "K = (g^a)^b mod p = (g^b)^a mod p",
    solver: "BigInt Modular Exponentiation Solver",
  },
  {
    domain: "Cryptographic Hashing",
    laws: "Merkle-Damgård Construction & Avalanche Criterion",
    formulas: "H_i = f(H_{i-1}, M_i), Δbits ≈ 50%",
    solver: "Bitwise 64-Round Compression Function Engine",
  },
  {
    domain: "Permutation Polyalphabetics",
    laws: "Rotor Permutation & Non-Reciprocal Reflection",
    formulas: "Output = P · R₁ · R₂ · R₃ · Reflector · R₃⁻¹ · R₂⁻¹ · R₁⁻¹ · P⁻¹",
    solver: "Permutation Cycle Vector Composer",
  },
];

const features: SubtopicFeature[] = [
  {
    icon: Gauge,
    title: "Interactive rotor & key controls",
    desc: "Spin cipher wheels, plug patch cables, and adjust prime parameters with instant visual feedback.",
    color: "purple",
  },
  {
    icon: LineChart,
    title: "Real-time frequency & avalanche telemetry",
    desc: "Track letter frequencies against English language baselines and observe bit flips in hash digests.",
    color: "indigo",
  },
  {
    icon: GraduationCap,
    title: "Curriculum aligned cybersecurity",
    desc: "Maps to AP Computer Science Principles (Cybersecurity & Cryptography) and university InfoSec curricula.",
    color: "emerald",
  },
];

const curriculum = {
  heading: "Cryptography & Cybersecurity Educational Standards",
  description:
    "Our interactive cryptography virtual labs adhere to AP Computer Science Principles (Big Idea 5: Cybersecurity, Ciphers, and Public Key Cryptography) and undergraduate Cybersecurity/InfoSec standards.",
  secondaryText:
    "Students explore how simple historical substitution evolved into computational one-way mathematical functions securing global internet traffic.",
  telemetryTitle: "Cryptographic Telemetry",
  telemetryDesc: "Inspect modular exponents, hash bit entropy, and rotor wiring permutations in real time.",
};

const faqs: SubtopicFAQ[] = [
  {
    q: "Why is the Caesar cipher easily broken by frequency analysis?",
    a: "Because it is a monoalphabetic substitution cipher: every letter 'E' in the plaintext always maps to the same ciphertext letter. An attacker simply looks at the most frequent letter in the ciphertext and computes the shift offset relative to 'E' (12.7% frequency in English).",
  },
  {
    q: "How does Diffie-Hellman allow two parties to create a shared secret over an insecure channel?",
    a: "Alice and Bob each pick a private secret (a and b) and send g^a mod p and g^b mod p publicly. Each party raises the received public value to their own private power to arrive at g^(ab) mod p. An eavesdropper only sees g^a and g^b and cannot easily compute g^(ab) due to the hardness of the Discrete Logarithm Problem.",
  },
  {
    q: "What is the 'Avalanche Effect' in cryptographic hash functions like SHA-256?",
    a: "The avalanche effect means that changing even a single bit in the input message causes approximately 50% of the output digest bits to flip unpredictably, preventing attackers from reverse-engineering the input.",
  },
  {
    q: "Are the OpenLabs cryptography simulators free for students?",
    a: "Yes. All cryptography wheels, Enigma machines, and hash mining simulators are completely free for educational learning.",
  },
];

export default function CryptographySubtopicPage() {
  return (
    <SubtopicHubLayout
      subjectName="Computer Science"
      subjectSlug="computer-science"
      subtopicTitle="Classical & Modern Cryptography"
      subtopicSubtitle="Explore rotating cipher wheels, WWII Enigma machines, Diffie-Hellman public key exchanges, and SHA-256 Proof of Work mining."
      badgeText="Cryptography Studio"
      badgeIcon={KeyRound}
      themeColor="purple"
      cards={cards}
      howToHeading="How to Encrypt, Decrypt & Break Ciphers Online"
      howToSteps={howToSteps}
      principlesHeading="Cryptographic Foundations & Modular Number Theory"
      principlesDesc="Discrete logarithm hardness and cryptographic avalanche criteria evaluated in real time."
      scientificPrinciples={scientificPrinciples}
      features={features}
      curriculum={curriculum}
      faqs={faqs}
      canonicalUrl="https://www.openlabs.org.in/computer-science/cryptography"
    />
  );
}
