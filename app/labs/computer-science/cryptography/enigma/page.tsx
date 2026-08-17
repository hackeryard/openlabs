import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "WWII Enigma Machine Simulation | Computer Science | OpenLabs",
  description: "Interactive WWII Wehrmacht Enigma rotor machine simulator. Explore 3 stepping rotors, turnover notches, Reflector UKW-B, Steckerbrett plugboard, and glowing lampboards.",
};

const EnigmaLab = dynamic(
  () => import("@/app/components/computer-science/cryptography/enigma/EnigmaLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="computer-science"
        customMessage="Loading Enigma Machine Rotors..."
      />
    ),
  }
);

export default function EnigmaLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <EnigmaLab />
    </main>
  );
}
