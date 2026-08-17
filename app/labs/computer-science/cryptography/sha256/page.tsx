import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "SHA-256 Hashing & Bitcoin Mining Simulation | Computer Science | OpenLabs",
  description: "Interactive SHA-256 cryptographic hash simulator. Explore bit-level Avalanche Effect diff maps and live Proof-of-Work Bitcoin block mining nonces.",
};

const Sha256Lab = dynamic(
  () => import("@/app/components/computer-science/cryptography/sha256/Sha256Lab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="computer-science"
        customMessage="Loading SHA-256 Hasher & Nonce Miner..."
      />
    ),
  }
);

export default function Sha256LabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <Sha256Lab />
    </main>
  );
}
