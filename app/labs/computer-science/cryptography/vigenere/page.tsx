import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Vigenère Cipher & Tabula Recta Simulation | Computer Science | OpenLabs",
  description: "Interactive Vigenère cipher simulation. Explore repeating keyword streams, 26x26 Tabula Recta matrix lookup, and letter-by-letter live encryption.",
};

const VigenereLab = dynamic(
  () => import("@/app/components/computer-science/cryptography/vigenere/VigenereLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="computer-science"
        customMessage="Loading Vigenère Matrix..."
      />
    ),
  }
);

export default function VigenereLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <VigenereLab />
    </main>
  );
}
