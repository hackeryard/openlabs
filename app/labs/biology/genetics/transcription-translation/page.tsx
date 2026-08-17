import { Metadata } from "next";
import dynamic from "next/dynamic";
import UniversalLoader from "@/app/components/UniversalLoader";

export const metadata: Metadata = {
  title: "DNA Transcription & Translation Simulation | Biology | OpenLabs",
  description: "Interactive Central Dogma simulation. DNA unzipping, complementary mRNA transcription, tRNA codon reading in ribosomes, and mutation testing.",
};

const TranscriptionTranslationLab = dynamic(
  () => import("@/app/components/biology/genetics/transcription-translation/TranscriptionTranslationLab"),
  {
    ssr: false,
    loading: () => (
      <UniversalLoader
        subject="biology"
        customMessage="Loading DNA Transcription & Ribosome Translation..."
      />
    ),
  }
);

export default function TranscriptionTranslationLabPage() {
  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-y-auto">
      <TranscriptionTranslationLab />
    </main>
  );
}
