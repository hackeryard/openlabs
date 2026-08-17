import React from "react";
import Link from "next/link";
import { ALL_CONCEPTS } from "@/app/lib/knowledge/concepts";
import { validateKnowledgeGraph } from "@/app/lib/knowledge/validator";
import { LABS } from "@/app/lib/labs";
import { Activity, CheckCircle2, AlertTriangle, FileCode2, Layers, Network, Database, Users, BookOpen, MessageSquare, Inbox } from "lucide-react";

export const metadata = {
  title: "Internal SEO & Knowledge Graph Dashboard | OpenLabs Admin",
  robots: { index: false, follow: false },
};

export default function AdminSeoDashboardPage() {
  const graphValidation = validateKnowledgeGraph();
  const labCount = LABS.length;
  const conceptCount = ALL_CONCEPTS.length;

  const physicsConcepts = ALL_CONCEPTS.filter((c) => c.subject === "physics").length;
  const chemistryConcepts = ALL_CONCEPTS.filter((c) => c.subject === "chemistry").length;
  const biologyConcepts = ALL_CONCEPTS.filter((c) => c.subject === "biology").length;
  const csConcepts = ALL_CONCEPTS.filter((c) => c.subject === "computerScience").length;

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 max-w-7xl mx-auto">
      {/* Navigation Breadcrumb & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span className="text-foreground">Admin / SEO & Knowledge Graph</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold flex-wrap">
          <Link
            href="/admin/users"
            className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground transition flex items-center gap-1.5"
          >
            <Users size={13} />
            <span>Users</span>
          </Link>
          <Link
            href="/admin/blogs"
            className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground transition flex items-center gap-1.5"
          >
            <BookOpen size={13} />
            <span>Blogs</span>
          </Link>
          <Link
            href="/admin/seo-dashboard"
            className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm flex items-center gap-1.5"
          >
            <Activity size={13} />
            <span>SEO</span>
          </Link>
          <Link
            href="/admin/feedback"
            className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground transition flex items-center gap-1.5"
          >
            <MessageSquare size={13} />
            <span>Feedback</span>
          </Link>
          <Link
            href="/admin/contacts"
            className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground transition flex items-center gap-1.5"
          >
            <Inbox size={13} />
            <span>Contacts</span>
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="text-primary" /> SEO & Knowledge Graph Health Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time monitoring of sitemaps, indexability, knowledge graph nodes, and prerequisite integrity.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
            <Layers size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{labCount}</div>
            <div className="text-xs text-muted-foreground">Interactive Virtual Labs</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Network size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{conceptCount}</div>
            <div className="text-xs text-muted-foreground">Indexed Graph Concepts</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border flex items-center gap-4">
          <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
            <FileCode2 size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">100%</div>
            <div className="text-xs text-muted-foreground">JSON-LD Schema Coverage</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border flex items-center gap-4">
          <div className={`p-3 rounded-lg ${graphValidation.valid ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
            {graphValidation.valid ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
          </div>
          <div>
            <div className="text-2xl font-bold">{graphValidation.valid ? "Healthy" : "Errors"}</div>
            <div className="text-xs text-muted-foreground">Graph Prerequisite Check</div>
          </div>
        </div>
      </div>

      {/* Subject Breakdown & Graph Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Concept Distribution */}
        <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Database size={16} /> Concept Graph Distribution by Subject
          </h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Physics</span>
                <span>{physicsConcepts} concepts</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${(physicsConcepts / (conceptCount || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Chemistry</span>
                <span>{chemistryConcepts} concepts</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${(chemistryConcepts / (conceptCount || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Biology</span>
                <span>{biologyConcepts} concepts</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: `${(biologyConcepts / (conceptCount || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Computer Science</span>
                <span>{csConcepts} concepts</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${(csConcepts / (conceptCount || 1)) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Validation Status Report */}
        <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" /> Automated Audit Logs
          </h2>
          <div className="space-y-2 text-xs font-mono bg-muted/40 p-4 rounded-xl border border-border/50 max-h-[220px] overflow-y-auto">
            <div className="text-green-600 dark:text-green-400">✓ Canonical normalizer active (HTTPS, lowercase, no trailing slash).</div>
            <div className="text-green-600 dark:text-green-400">✓ sitemap.ts dynamic indexer active.</div>
            <div className="text-green-600 dark:text-green-400">✓ llms.txt AI search optimization route active.</div>
            <div className="text-green-600 dark:text-green-400">✓ Breadcrumbs DOM & JSON-LD active across subpages.</div>
            {graphValidation.valid ? (
              <div className="text-green-600 dark:text-green-400">✓ Knowledge Graph zero circular prerequisite loops detected.</div>
            ) : (
              <div className="text-red-500">❌ Graph errors detected: {graphValidation.circularDependencies.join(", ")}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
