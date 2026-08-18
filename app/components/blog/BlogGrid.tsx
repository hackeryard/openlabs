"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ArrowRight,
  Microscope,
  CloudLightning,
  Bot,
  Beaker,
  Gamepad,
  Laptop,
  BookOpen,
  Sparkles,
  FlaskConical,
  Cpu,
  Search,
  X,
  Layers,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Microscope,
  CloudLightning,
  Bot,
  Beaker,
  Gamepad,
  Laptop,
  BookOpen,
  Sparkles,
  FlaskConical,
  Cpu,
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime?: string;
  gradient?: string;
  border?: string;
  icon?: string;
  author?: string;
  coverImage?: string;
}

export default function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Extract unique categories from posts
  const categories = useMemo(() => {
    const unique = new Set<string>();
    posts?.forEach((p) => {
      if (p.category) unique.add(p.category);
    });
    return ["all", ...Array.from(unique)];
  }, [posts]);

  // Filter posts by search query & selected category
  const filteredPosts = useMemo(() => {
    return (posts || []).filter((post) => {
      const matchesCategory =
        selectedCategory === "all" ||
        post.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        !searchQuery ||
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [posts, searchQuery, selectedCategory]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
          <BookOpen className="w-8 h-8 text-primary" aria-hidden="true" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2 tracking-tight">No Articles Published Yet</h3>
        <p className="text-muted-foreground max-w-sm text-sm">
          Check back soon for new research dispatches, pedagogy guides, and simulation updates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ─── SEARCH & FILTER CONTROLS ─── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-6">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all capitalize ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === "all" ? "All Articles" : cat}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ─── ACTIVE FILTER STATS ─── */}
      {(searchQuery || selectedCategory !== "all") && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredPosts.length}</strong> of{" "}
            <strong className="text-foreground">{posts.length}</strong> articles
          </span>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="text-primary hover:underline font-bold"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* ─── NO MATCHING RESULTS ─── */}
      {filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Search size={20} />
          </div>
          <h3 className="text-base font-bold text-foreground">No matching articles found</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* ─── BLOG CARDS GRID ─── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => {
            const IconComponent =
              post.icon && ICON_MAP[post.icon] ? ICON_MAP[post.icon] : BookOpen;
            const displayDate = formatDate(post.date);

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group relative flex flex-col h-full rounded-2xl border border-border bg-card p-3.5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/40 overflow-hidden"
              >
                {/* Framed Cover Image */}
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-muted border border-border/50">
                  {post.coverImage ? (
                    <>
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <IconComponent className="w-12 h-12 text-muted-foreground/50" aria-hidden="true" />
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm border border-border/60">
                    <IconComponent className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-foreground">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="px-1.5 pb-1.5 flex flex-col flex-1">
                  <h2 className="text-base sm:text-lg font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Metadata Footer */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/60">
                    <div className="flex items-center gap-3 text-[11px] font-semibold text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        <time dateTime={post.date}>{displayDate}</time>
                      </span>
                      {post.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{post.readTime}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform">
                      <span>Read</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
