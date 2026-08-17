import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "Caesar Cipher & Rotating Wheel Simulation | Computer Science | OpenLabs",
  description: "Interactive Caesar shift cipher simulation. Explore letter shift wheels, live letter-by-letter transformation cards, and Chi-squared auto-cracking.",
};

const CaesarLab = dynamic(
  () => import("@/app/components/computer-science/cryptography/caesar/CaesarLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="computer-science"
        customMessage="Loading Caesar Cipher Studio..."
      />
    ),
  }
);

export default function CaesarLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <CaesarLab />
    </main>
  );
}
