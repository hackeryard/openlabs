import { redirect } from "next/navigation";

export const revalidate = 86400; // 24 hours ISR Edge CDN cache

export default function DnaTranscriptionRedirect() {
  redirect("/biology/genetics/transcription-translation");
}
