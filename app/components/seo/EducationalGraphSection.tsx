// app/components/seo/EducationalGraphSection.tsx
import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { getPrerequisites, getNextTopics, getSiblingTopics } from "@/app/lib/knowledge/graph";
import { getRelatedLabs } from "@/app/lib/seo/relatedContent";
import { SubjectId } from "@/app/lib/types/knowledge";

interface EducationalGraphSectionProps {
  conceptId: string;
  subject: SubjectId;
}

export default function EducationalGraphSection({ conceptId, subject }: EducationalGraphSectionProps) {
  const prereqs = getPrerequisites(conceptId);
  const nextTopics = getNextTopics(conceptId);
  const siblings = getSiblingTopics(conceptId);
  const relatedLabs = getRelatedLabs(subject, conceptId, 4);

  if (!prereqs.length && !nextTopics.length && !relatedLabs.length) {
    return null;
  }

  return (
    <section className="w-full my-8 p-6 bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm space-y-6">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Sparkles className="text-primary" size={20} />
        <h2 className="text-lg font-bold">Knowledge Graph & Related Concepts</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prerequisites */}
        {prereqs.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ArrowLeft size={14} className="text-blue-500" /> Prerequisites
            </h3>
            <ul className="space-y-1.5">
              {prereqs.map((p) => (
                <li key={p.id}>
                  <Link
                    href={p.slug}
                    className="group flex items-center justify-between p-2.5 rounded-lg border border-border/40 hover:border-primary/50 bg-background/50 hover:bg-accent/40 transition-all text-sm"
                  >
                    <span className="font-medium group-hover:text-primary transition-colors">{p.title}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">{p.domain}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Topics */}
        {nextTopics.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              Next Steps in Learning <ArrowRight size={14} className="text-emerald-500" />
            </h3>
            <ul className="space-y-1.5">
              {nextTopics.map((n) => (
                <li key={n.id}>
                  <Link
                    href={n.slug}
                    className="group flex items-center justify-between p-2.5 rounded-lg border border-border/40 hover:border-primary/50 bg-background/50 hover:bg-accent/40 transition-all text-sm"
                  >
                    <span className="font-medium group-hover:text-primary transition-colors">{n.title}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">{n.domain}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Related Experiments */}
      {relatedLabs.length > 0 && (
        <div className="pt-4 border-t border-border/40">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
            <BookOpen size={14} className="text-purple-500" /> Related Experiments & Simulations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedLabs.map((lab) => (
              <Link
                key={lab.id}
                href={lab.url}
                className="group p-3 rounded-xl border border-border/50 hover:border-primary/50 bg-background/40 hover:bg-accent/30 transition-all flex flex-col justify-between"
              >
                <div className="font-semibold text-sm group-hover:text-primary transition-colors">{lab.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-1 mt-1">{lab.description}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
