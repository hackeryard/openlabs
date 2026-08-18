"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  User,
  Share2,
  Check,
  Twitter,
  Linkedin,
  MessageCircle,
  Link2,
  Bookmark,
  ChevronDown,
  Sparkles,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Beaker,
  ChevronRight,
  Copy,
  CheckCheck,
  Flame,
  Atom,
  Dna,
  Binary,
  Calculator,
  ListOrdered,
  ExternalLink,
  ShieldCheck,
  Eye,
  Award,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface FAQ {
  question: string;
  answer: string;
}

interface BlogPost {
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt?: string;
  category: string;
  author?: string;
  date: string;
  readTime?: string;
  coverImage?: string;
  content: string;
  faqs?: FAQ[];
}

interface RelatedPost {
  slug: string;
  title: string;
  excerpt?: string;
  category: string;
  date: string;
  readTime?: string;
  coverImage?: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const SUBJECT_ICONS: Record<string, React.ElementType> = {
  physics: Atom,
  chemistry: Flame,
  biology: Dna,
  mathematics: Calculator,
  "computer science": Binary,
  computerscience: Binary,
  edtech: Sparkles,
  general: Beaker,
};

// Helper: Convert text to URL-friendly anchor slug
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

// Custom Code Block component with 1-Click Copy
function CodeBlock({ children, className, ...props }: any) {
  const [copied, setCopied] = useState(false);
  const codeText = String(children).replace(/\n$/, "");
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6 rounded-2xl overflow-hidden border border-slate-800 bg-[#090d16] shadow-xl not-prose">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 text-xs text-slate-400 font-mono">
        <span className="uppercase font-bold tracking-wider text-slate-300">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-[11px] font-sans font-semibold"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <CheckCheck size={12} className="text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-slate-200 leading-relaxed">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function BlogPostInteractive({
  post,
  relatedPosts,
}: {
  post: BlogPost;
  relatedPosts: RelatedPost[];
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeId, setActiveId] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Extract headings from markdown content for Table of Contents
  const headings = useMemo<TocItem[]>(() => {
    const list: TocItem[] = [];
    const lines = post.content.split("\n");

    for (const line of lines) {
      const h2Match = line.match(/^##\s+(.+)$/);
      if (h2Match) {
        const text = h2Match[1].replace(/[*_~`]/g, "").trim();
        list.push({ id: slugify(text), text, level: 2 });
        continue;
      }
      const h3Match = line.match(/^###\s+(.+)$/);
      if (h3Match) {
        const text = h3Match[1].replace(/[*_~`]/g, "").trim();
        list.push({ id: slugify(text), text, level: 3 });
      }
    }
    return list;
  }, [post.content]);

  // Track scroll progress & active TOC heading
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      // Check which heading is currently in viewport
      if (headings.length > 0) {
        const headingElements = headings
          .map((h) => document.getElementById(h.id))
          .filter(Boolean) as HTMLElement[];

        const scrollPosition = window.scrollY + 140;
        for (let i = headingElements.length - 1; i >= 0; i--) {
          const el = headingElements[i];
          if (el && el.offsetTop <= scrollPosition) {
            setActiveId(el.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const scrollToHeading = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveId(id);
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", `#${id}`);
      }

      // Momentary highlight glow on the target heading
      element.classList.add(
        "ring-2",
        "ring-primary/50",
        "bg-primary/10",
        "rounded-xl",
        "px-2",
        "py-1",
        "-mx-2",
        "transition-all",
        "duration-500"
      );
      setTimeout(() => {
        element.classList.remove(
          "ring-2",
          "ring-primary/50",
          "bg-primary/10",
          "rounded-xl",
          "px-2",
          "py-1",
          "-mx-2"
        );
      }, 1400);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://www.openlabs.org.in/blog/${post.slug}`;
  const shareTitle = post.title;

  const displayDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const CategoryIcon =
    SUBJECT_ICONS[post.category.toLowerCase()] || SUBJECT_ICONS.general;

  return (
    <>
      {/* ─── READING PROGRESS BAR (STICKY TOP) ─── */}
      <div
        className="fixed top-0 left-0 right-0 h-1 z-50 bg-primary/20 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-primary to-cyan-400 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 space-y-8 sm:space-y-10">
        {/* ─── TOP BREADCRUMBS & NAVIGATION ─── */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground border-b border-border pb-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <Link href="/" className="hover:text-foreground transition-colors font-medium">
              Home
            </Link>
            <ChevronRight size={12} className="text-muted-foreground/60 shrink-0" />
            <Link href="/blog" className="hover:text-foreground transition-colors font-medium">
              Blog
            </Link>
            <ChevronRight size={12} className="text-muted-foreground/60 shrink-0" />
            <span className="text-primary font-bold truncate max-w-[200px] sm:max-w-xs capitalize">
              {post.category}
            </span>
          </nav>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>All Articles</span>
          </Link>
        </div>

        {/* ─── ARTICLE HEADER ─── */}
        <header className="space-y-4 sm:space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-primary bg-primary/10 border border-primary/20">
              <CategoryIcon size={13} />
              <span>{post.category}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-muted-foreground border border-border bg-card">
              <ShieldCheck size={12} className="text-emerald-500" />
              <span>Verified OpenLabs Publication</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.12]">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed font-normal">
              {post.excerpt}
            </p>
          )}

          {/* Author Matrix & Social Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white flex items-center justify-center font-black text-sm shadow-sm">
                {post.author ? post.author.slice(0, 2).toUpperCase() : "OL"}
              </div>
              <div>
                <span className="font-bold text-foreground block text-sm">
                  {post.author || "OpenLabs Team"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Published on {displayDate} &bull; {post.readTime || "5 min read"}
                </span>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyLink}
                className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground text-xs font-bold transition-all shadow-xs"
                title="Copy link to clipboard"
              >
                {copiedLink ? (
                  <>
                    <Check size={13} className="text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 size={13} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-all shadow-xs"
                aria-label="Share on X (Twitter)"
              >
                <Twitter size={14} />
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-all shadow-xs"
                aria-label="Share on LinkedIn"
              >
                <Linkedin size={14} />
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} - ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-all shadow-xs"
                aria-label="Share on WhatsApp"
              >
                <MessageCircle size={14} />
              </a>
            </div>
          </div>
        </header>

        {/* ─── COVER HERO ASSET ─── */}
        {post.coverImage && (
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-lg border border-border bg-muted">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 1280px"
            />
          </div>
        )}

        {/* ─── MAIN CONTENT GRID (ARTICLE + STICKY SIDEBAR) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ─── LEFT COLUMN: ARTICLE BODY (8 COLS) ─── */}
          <div className="lg:col-span-8 space-y-8">
            {/* AEO Executive Key Takeaways Box */}
            <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 sm:p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Sparkles size={14} />
                <span>Executive Summary & Key Takeaways</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-foreground/90 leading-relaxed list-disc list-inside">
                <li>
                  <strong>Topic Overview:</strong> Essential insights on {post.category.toLowerCase()} principles, computational experiments, and pedagogical methodologies.
                </li>
                <li>
                  <strong>Hands-on Application:</strong> Translate theoretical derivations into verifiable real-time simulation readings on OpenLabs.
                </li>
                <li>
                  <strong>Interactive Mastery:</strong> Explore parameters, transient graphs, and error diagnostics directly in your web browser.
                </li>
              </ul>
            </div>

            {/* Publication Markdown Typography */}
            <article
              className="prose prose-slate dark:prose-invert md:prose-lg max-w-none
                prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base prose-p:mb-5
                prose-headings:text-foreground prose-headings:font-black prose-headings:tracking-tight
                prose-h2:text-xl sm:prose-h2:text-2xl md:prose-h2:3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pt-4 prose-h2:border-t prose-h2:border-border/60 prose-h2:scroll-mt-24
                prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:scroll-mt-24
                prose-a:text-primary prose-a:font-bold prose-a:underline-offset-4 hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-foreground prose-blockquote:text-sm sm:prose-blockquote:text-base
                prose-strong:text-foreground prose-strong:font-bold
                prose-img:rounded-2xl prose-img:border prose-img:border-border prose-img:shadow-sm
                prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs sm:prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                prose-ul:text-sm sm:prose-ul:text-base prose-ol:text-sm sm:prose-ol:text-base
                prose-li:text-foreground/90 prose-li:my-1"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Inject anchor IDs into H2 and H3 for direct TOC linking and AI citations
                  h2: ({ node, children, ...props }) => {
                    const text = String(children);
                    const id = slugify(text);
                    return (
                      <h2 id={id} {...props}>
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ node, children, ...props }) => {
                    const text = String(children);
                    const id = slugify(text);
                    return (
                      <h3 id={id} {...props}>
                        {children}
                      </h3>
                    );
                  },
                  // Use CodeBlock for pre/code blocks
                  code: ({ node, inline, className, children, ...props }: any) => {
                    if (inline) {
                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                    return (
                      <CodeBlock className={className} {...props}>
                        {children}
                      </CodeBlock>
                    );
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </article>

            {/* ─── FREQUENTLY ASKED QUESTIONS (FAQ) ─── */}
            {post.faqs && post.faqs.length > 0 && (
              <section aria-label="Frequently Asked Questions" className="pt-8 border-t border-border space-y-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary">
                    <HelpCircle size={13} />
                    <span>Deep Dive Q&A</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Direct answers to core concepts discussed in this publication.
                  </p>
                </div>

                <div className="space-y-3">
                  {post.faqs.map((faq, index) => (
                    <details
                      key={index}
                      name="blog-faq"
                      className="group rounded-2xl border border-border bg-card transition-all duration-200 open:border-primary/40 open:shadow-sm"
                    >
                      <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-bold text-sm text-foreground list-none select-none">
                        <span className="pr-4 group-hover:text-primary transition-colors">
                          {faq.question}
                        </span>
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                          <ChevronDown
                            size={14}
                            className="transform group-open:rotate-180 transition-transform duration-200"
                            aria-hidden="true"
                          />
                        </span>
                      </summary>
                      <div className="px-5 pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/60 pt-3">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* ─── INTERACTIVE EXPERIMENT CTA BANNER ─── */}
            <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 text-center shadow-lg space-y-3 bg-[radial-gradient(hsl(var(--border))_1.5px,transparent_1.5px)] bg-[size:24px_24px]">
              {/* Ambient glow backdrop */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold shadow-xs">
                  <Beaker size={12} className="animate-pulse" />
                  <span>Interactive Science Sandbox</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  Experience The Science Live In Your Browser
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Put this theory into practice. Explore 50+ free virtual STEM simulations with real-time numerical graphs.
                </p>
                <div className="pt-2">
                  <Link
                    href={`/${post.category.toLowerCase().replace(/\s+/g, "-")}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-md hover:bg-primary/90 transition-all hover:scale-105"
                  >
                    <span>Launch {post.category} Virtual Labs</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* ─── RIGHT COLUMN: STICKY SIDEBAR (4 COLS) ─── */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20" aria-label="Article navigation & sidebar">
            {/* Table of Contents Widget */}
            {headings.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3.5">
                <div className="flex items-center gap-2 pb-2 border-b border-border text-xs font-black uppercase tracking-wider text-foreground">
                  <ListOrdered size={14} className="text-primary" />
                  <span>Table of Contents</span>
                </div>

                <nav aria-label="Table of contents navigation" className="space-y-1 max-h-[380px] overflow-y-auto no-scrollbar">
                  {headings.map((h) => {
                    const isActive = activeId === h.id;
                    return (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        onClick={(e) => scrollToHeading(e, h.id)}
                        className={`block py-1 text-xs transition-all line-clamp-1 cursor-pointer ${
                          h.level === 3 ? "pl-3 text-[11px]" : ""
                        } ${
                          isActive
                            ? "text-primary font-bold translate-x-1.5"
                            : "text-muted-foreground hover:text-foreground hover:translate-x-0.5"
                        }`}
                      >
                        {h.text}
                      </a>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Author Credential Card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-sm">
                  {post.author ? post.author.slice(0, 2).toUpperCase() : "OL"}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    {post.author || "OpenLabs Editorial"}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">STEM Pedagogy & Engineering</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Authored by the OpenLabs team to make complex scientific formulas intuitive through browser-based interactive simulation.
              </p>
            </div>

            {/* Subject Directory Quick Links */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-foreground pb-2 border-b border-border">
                <Beaker size={13} className="text-primary" />
                <span>Explore STEM Disciplines</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <Link
                  href="/physics"
                  className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition text-center"
                >
                  Physics (14)
                </Link>
                <Link
                  href="/chemistry"
                  className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition text-center"
                >
                  Chemistry (4)
                </Link>
                <Link
                  href="/biology"
                  className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition text-center"
                >
                  Biology (3)
                </Link>
                <Link
                  href="/mathematics"
                  className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition text-center"
                >
                  Math (12)
                </Link>
                <Link
                  href="/computer-science"
                  className="col-span-2 p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition text-center"
                >
                  Computer Science (19+)
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* ─── BOTTOM SECTION: RELATED PUBLICATIONS (3 COLS) ─── */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section aria-label="Related Articles" className="pt-10 border-t border-border space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary">
                  <BookOpen size={13} />
                  <span>Continue Reading</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  Related Publications
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>View All Articles</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {relatedPosts.map((rel) => {
                const relDate = new Date(rel.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });

                return (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="group flex flex-col rounded-2xl border border-border bg-card p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/40 overflow-hidden"
                  >
                    {rel.coverImage && (
                      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-muted border border-border/50">
                        <Image
                          src={rel.coverImage}
                          alt={rel.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 380px"
                        />
                      </div>
                    )}
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                      {rel.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-foreground mt-1 group-hover:text-primary transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                    <div className="mt-auto pt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/50">
                      <span>{relDate}</span>
                      {rel.readTime && <span>{rel.readTime}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
