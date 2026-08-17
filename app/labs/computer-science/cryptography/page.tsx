import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Classical & Modern Cryptography Simulation | Computer Science | OpenLabs",
  description:
    "Interactive Classical and Modern Cryptography simulation. Explore Caesar cipher wheels, frequency analysis crackers, Vigenère Tabula Recta, WWII Enigma rotor machines, Diffie-Hellman key agreement, and SHA-256 Bitcoin mining.",
  keywords: [
    "cryptography simulation",
    "caesar cipher wheel interactive",
    "enigma machine online simulator",
    "vigenere cipher tabula recta",
    "diffie hellman key exchange interactive",
    "sha256 avalanche effect visualizer",
    "bitcoin proof of work simulator",
  ],
};

const CryptographyLab = dynamic(
  () => import("@/app/components/computer-science/cryptography/CryptographyLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="computer-science"
        customMessage="Loading Cryptography Studio & Enigma Rotors..."
      />
    ),
  }
);

export default function CryptographyLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <CryptographyLab />
    </main>
  );
}
