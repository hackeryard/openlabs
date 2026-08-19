import type { Metadata } from "next";
import Link from "next/link";
import CurriculumTracksExplorer from "@/app/components/CurriculumTracksExplorer";
import { Compass, ArrowRight, Sparkles, BookOpen, GraduationCap, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Guided Curriculum Tracks & Structured Science Pathways | OpenLabs",
  description: "Master science and mathematics step-by-step with 13 guided curriculum tracks spanning Physics, Chemistry, Biology, Computer Science, and Mathematics.",
  keywords: [
    "science curriculum tracks",
    "physics learning path",
    "chemistry practical syllabus",
    "computer science study roadmaps",
    "calculus guided course",
    "interactive virtual lab tracks",
  ],
  alternates: {
    canonical: "https://www.openlabs.org.in/tracks",
  },
};

export default function TracksPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen text-foreground pb-24 pt-10 font-sans relative overflow-hidden bg-[radial-gradient(hsl(var(--border))_1.5px,transparent_1.5px)] bg-[size:24px_24px]"
    >
      {/* Ambient glow blobs */}
      <div className="absolute top-12 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground transition font-medium">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-primary font-bold">Curriculum Tracks</span>
        </nav>

        {/* Hero Header */}
        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-primary/10 text-primary border border-primary/20">
            <Compass size={14} className="animate-spin [animation-duration:10s]" />
            <span>13 Structured Science & Math Tracks</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            Guided Curriculum Tracks
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-medium">
            Stop guessing what to learn next. Follow sequenced, step-by-step laboratory tracks designed to take you from foundational scientific principles to advanced simulations and computational problem solving.
          </p>
        </header>

        {/* Full Interactive Curriculum Tracks Explorer */}
        <CurriculumTracksExplorer
          title="All Learning Tracks & Syllabi"
          subtitle="Filter by discipline or explore the complete curriculum sequence across all 53 interactive simulations."
          showFilters={true}
        />
      </div>
    </main>
  );
}
