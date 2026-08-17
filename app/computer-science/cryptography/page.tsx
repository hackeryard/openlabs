import React from "react";
import ClientGrid from "../ClientGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classical & Modern Cryptography Labs | Computer Science | OpenLabs",
  description:
    "Explore interactive cryptography virtual labs including Caesar cipher wheels, Vigenère matrix lookup, WWII Enigma machine simulations, Diffie-Hellman key exchanges, and SHA-256 Bitcoin mining.",
  keywords: [
    "cryptography virtual labs",
    "caesar cipher wheel",
    "vigenere cipher matrix",
    "enigma machine simulator",
    "diffie hellman key exchange",
    "sha256 avalanche effect",
    "bitcoin proof of work",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/computer-science/cryptography",
  },
  openGraph: {
    title: "Classical & Modern Cryptography Labs | OpenLabs",
    description:
      "Explore interactive cryptography virtual labs: Caesar, Vigenère, Enigma, Diffie-Hellman, and SHA-256 mining.",
    url: "https://www.openlabs.org.in/computer-science/cryptography",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const cards = [
  {
    href: "/computer-science/cryptography/caesar",
    title: "Caesar Cipher Wheel",
    desc: "Interactive rotating cipher wheel, letter-by-letter live flip cards, and frequency auto-cracker.",
    accent: "from-blue-500 to-indigo-500",
  },
  {
    href: "/computer-science/cryptography/vigenere",
    title: "Vigenère Cipher Matrix",
    desc: "Polyalphabetic substitution cipher with live 26x26 Tabula Recta lookup and repeated password streams.",
    accent: "from-pink-500 to-rose-500",
  },
  {
    href: "/computer-science/cryptography/enigma",
    title: "WWII Enigma Machine",
    desc: "Electro-mechanical cipher simulator with 3 stepping rotors, Reflector UKW-B, plugboard, and glowing lampboard.",
    accent: "from-amber-500 to-orange-500",
  },
  {
    href: "/computer-science/cryptography/diffie-hellman",
    title: "Diffie-Hellman Keys",
    desc: "Asymmetric internet key exchange with paint color-mixing and modular math sandboxes.",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    href: "/computer-science/cryptography/sha256",
    title: "SHA-256 & Bitcoin Mining",
    desc: "256-bit Avalanche Effect visualizer and live Proof-of-Work Bitcoin mining simulator.",
    accent: "from-purple-500 to-indigo-500",
  },
];

export default function CryptographyHubPage() {
  return (
    <ClientGrid
      title="Classical & Modern Cryptography Studios"
      description="Explore the evolution of secret communication: from ancient Caesar shift wheels to modern blockchain hashing."
      intro="Cryptography is the mathematical foundation of secure digital communication. Explore these 5 interactive standalone studios to understand how encryption evolved from simple alphabet shifts into unbreakable electro-mechanical rotor scramblers, asymmetric key agreement protocols, and cryptographic hashes powering Bitcoin."
      cards={cards}
    />
  );
}
