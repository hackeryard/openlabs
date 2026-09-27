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
  slug: "blockchain",
  subject: "Computer Science",
  title: "Blockchain & Cryptographic Ledger",
  description: "Explore decentralized ledger architecture, SHA-256 cryptographic hashing, Proof of Work mining, and Byzantine fault tolerance in an interactive visual sandbox.",
  difficulty: "Intermediate",
  estimatedTime: "20 mins",
  heroDescription: "Mine cryptographic blocks with real-time hash collision targets, inspect SHA-256 avalanche effects, and simulate peer-to-peer ledger consensus without centralized intermediaries.",
  theory: {
    content: "<p>A <strong>blockchain</strong> is an immutable, distributed, and append-only ledger of cryptographically linked records called blocks. Each block contains an index, timestamp, arbitrary transaction payloads, a cryptographic nonce, and crucially, the cryptographic hash of the immediate preceding block (<code>previousHash</code>).</p><p>This recursive hash chaining establishes mathematical tamper-evidence: modifying any historical transaction alters that block's hash, cascading an invalid checksum across all subsequent downstream blocks. In decentralized networks, consensus algorithms like <strong>Proof of Work (PoW)</strong> enforce computational work by requiring miners to discover a nonce such that <code>SHA256(BlockData + Nonce) &lt; DifficultyTarget</code>, making historical rewriting computationally intractable under the Longest Chain Rule.</p>",
  },
  learningObjectives: [
    "Explain the internal anatomy of a cryptographic block (Index, Timestamp, Data, Nonce, Previous Hash, Current Hash).",
    "Demonstrate how modifying a historical block cascades invalid hashes across the entire blockchain chain.",
    "Simulate Proof of Work mining by adjusting difficulty target thresholds and discovering valid nonces.",
    "Understand Byzantine Fault Tolerance and decentralized distributed consensus mechanisms.",
  ],
  realWorldApplications: [
    "Cryptocurrency & Digital Asset Settlement (Bitcoin, Ethereum, stablecoins).",
    "Verifiable Supply Chain Provenance Tracking & Anti-Counterfeiting.",
    "Decentralized Identity (DID) & Self-Sovereign Credential Verification.",
    "Smart Contract Automation for Insurance, Escrow, and Cross-Border Finance.",
  ],
  howItWorks: "Type arbitrary data into any block to watch the hash immediately recompute. Click 'Mine Block' to run client-side SHA-256 hashing iterations until finding a nonce satisfying the difficulty zeroes prefix.",
  faqs: [
    {
      question: "How does the SHA-256 cryptographic hash function ensure blockchain immutability?",
      answer: "SHA-256 is a deterministic, one-way cryptographic hash that maps arbitrary input data to a fixed 256-bit (64 hex character) digest. Even changing a single punctuation mark flips approximately 50% of the output bits (the avalanche effect). Because each block stores the previous block's hash, any retroactive tampering instantly breaks the chain.",
    },
    {
      question: "What is the purpose of the 'Nonce' in Proof of Work?",
      answer: "The nonce (number used once) is an arbitrary 32-bit counter that miners increment in a brute-force loop. Since cryptographic hashes are pseudo-random and impossible to reverse, the only way to find a hash with a required number of leading zeroes is to iteratively test billions of nonce values until hitting a valid solution.",
    },
    {
      question: "What is a 51% Attack in decentralized networks?",
      answer: "A 51% attack occurs when a single entity or mining cartel controls more than half of the total computational hashrate in a Proof of Work network. This entity could theoretically out-mine all other honest nodes, producing an alternate secret chain that becomes recognized as the legitimate longest chain, enabling double-spending of recent transactions.",
    },
  ],
  relatedExperiments: [
    {
      title: "Classical & Modern Cryptography",
      href: "/computer-science/cryptography",
      description: "Caesar wheels, WWII Enigma machines, and Diffie-Hellman asymmetric key exchange.",
    },
    {
      title: "Computer Networking & Packet Routing",
      href: "/computer-science/networking",
      description: "OSI 7-layer stack, TCP 3-way handshakes, and peer-to-peer packet propagation.",
    },
    {
      title: "Data Structures & Algorithms Visualizer",
      href: "/computer-science/dsa",
      description: "Graph traversal, Merkle binary trees, and algorithmic complexity benchmarks.",
    },
  ],
};

export default function Page() {
  return <EducationalLandingLayout content={content} launchUrl="/labs/computer-science/blockchain" />;
}
