import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Diffie-Hellman Key Exchange Simulation | Computer Science | OpenLabs",
  description: "Interactive Diffie-Hellman key agreement simulator. Explore paint color-mixing analogies, modular arithmetic discrete logarithms, and eavesdropper security.",
};

const DiffieHellmanLab = dynamic(
  () => import("@/app/components/computer-science/cryptography/diffie-hellman/DiffieHellmanLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="computer-science"
        customMessage="Loading Diffie-Hellman Protocol..."
      />
    ),
  }
);

export default function DiffieHellmanLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <DiffieHellmanLab />
    </main>
  );
}
