"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Beaker,
  Zap,
  Calendar,
  Flame,
  Trophy,
  Sparkles,
  BookOpen,
  Compass,
  Microscope,
  Share2,
  Check,
  Atom,
  Dna,
  Binary,
  Calculator,
  ShieldCheck,
  ArrowRight,
  Lock,
} from "lucide-react";

const AVATARS = [
  "/images/avatars/avatar-01.png",
  "/images/avatars/avatar-02.png",
  "/images/avatars/avatar-03.png",
  "/images/avatars/avatar-04.png",
  "/images/avatars/avatar-05.png",
  "/images/avatars/avatar-06.png",
  "/images/avatars/avatar-07.png",
  "/images/avatars/avatar-08.png",
  "/images/avatars/avatar-09.png",
  "/images/avatars/avatar-10.png",
  "/images/avatars/avatar-11.png",
  "/images/avatars/avatar-12.png",
];

const ALL_ACHIEVEMENTS = [
  {
    id: "first_challenge",
    name: "First Challenge",
    desc: "Complete your first lab simulation challenge",
    icon: Sparkles,
    gradient: "from-amber-400 to-orange-500",
  },
  {
    id: "streak_3",
    name: "3 Day Streak",
    desc: "Perform science experiments 3 days in a row",
    icon: Flame,
    gradient: "from-orange-400 to-rose-500",
  },
  {
    id: "streak_7",
    name: "7 Day Streak",
    desc: "Maintain an active lab streak for a full week",
    icon: Trophy,
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "physics_master",
    name: "Quantum Explorer",
    desc: "Complete 5 distinct Physics simulations",
    icon: Atom,
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    id: "chem_master",
    name: "Alchemist",
    desc: "Perform 4 Chemistry simulations and titrations",
    icon: Flame,
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    id: "math_master",
    name: "Calculus Virtuoso",
    desc: "Solve 5 Mathematics curve explorations",
    icon: Calculator,
    gradient: "from-indigo-400 to-violet-500",
  },
];

const SUBJECT_THEMES: Record<
  string,
  {
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
    stroke: string;
    label: string;
    path: string;
  }
> = {
  physics: {
    icon: Atom,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "hover:border-blue-500/40",
    stroke: "stroke-blue-500",
    label: "Physics",
    path: "/physics",
  },
  chemistry: {
    icon: Flame,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "hover:border-emerald-500/40",
    stroke: "stroke-emerald-500",
    label: "Chemistry",
    path: "/chemistry",
  },
  biology: {
    icon: Dna,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "hover:border-rose-500/40",
    stroke: "stroke-rose-500",
    label: "Biology",
    path: "/biology",
  },
  mathematics: {
    icon: Calculator,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "hover:border-amber-500/40",
    stroke: "stroke-amber-500",
    label: "Mathematics",
    path: "/mathematics",
  },
  computerScience: {
    icon: Binary,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "hover:border-purple-500/40",
    stroke: "stroke-purple-500",
    label: "Computer Science",
    path: "/computer-science",
  },
};

export default function ProfilePublicClient({ username }: { username: string }) {
  const [user, setUser] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/profile/${encodeURIComponent(username)}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (e) {
        setNotFound(true);
      }
    }
    load();
  }, [username]);

  const handleCopyShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (notFound) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
          <Microscope size={28} />
        </div>
        <h1 className="text-2xl font-black text-foreground">Researcher Not Found</h1>
        <p className="text-sm text-muted-foreground">
          The public profile for <span className="font-bold text-primary">@{username}</span> does not exist or has not set up their profile yet.
        </p>
        <div className="pt-2">
          <Link
            href="/#labs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90 transition-all"
          >
            <span>Explore Virtual Labs</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] gap-3">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <Microscope className="absolute inset-0 m-auto text-primary opacity-60" size={20} />
        </div>
        <p className="text-xs font-bold text-muted-foreground animate-pulse uppercase tracking-wider">
          Loading researcher profile...
        </p>
      </div>
    );
  }

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const totalCompleted = user.completedExperiments?.length || 0;
  const totalXP = user.xp || 0;
  const level = user.level || 1;
  const nextLevelXP = level * 100;
  const progressPct = Math.min(100, Math.round((totalXP / nextLevelXP) * 100));

  const getRankTitle = (xp: number) => {
    if (xp < 500) return "Junior Apprentice";
    if (xp < 1500) return "Research Assistant";
    if (xp < 3000) return "Lab Fellow";
    if (xp < 6000) return "Senior Investigator";
    return "Chief Scientist";
  };
  const rank = getRankTitle(totalXP);

  // Subject Progress Normalization
  const userSubjects = user.subjectProgress || [];
  const allDisciplines = ["physics", "chemistry", "biology", "mathematics", "computerScience"].map((key) => {
    const existing = userSubjects.find((s: any) => s.subject === key);
    return {
      key,
      theme: SUBJECT_THEMES[key] || SUBJECT_THEMES.physics,
      xp: existing ? existing.xp : 0,
      level: existing ? existing.level : 1,
    };
  });

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary pb-20 pt-4 sm:pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* ─── PUBLIC PROFILE HEADER ─── */}
        <header className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-36 bg-gradient-to-l from-primary/10 via-primary/5 to-transparent pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
            {/* Identity Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-border overflow-hidden bg-muted relative shadow-sm">
                  <Image
                    src={user.avatar || AVATARS[0]}
                    alt={`${user.name}'s Avatar`}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-primary text-primary-foreground shadow-xs border border-card">
                  Lvl {level}
                </span>
              </div>

              {/* Names & Metadata */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground tracking-tight">
                    {user.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                    <ShieldCheck size={11} />
                    <span>{rank}</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
                  <span className="text-primary font-bold">@{user.username || username}</span>
                  <span className="mx-1.5 opacity-40">&bull;</span>
                  <span>Joined {joinDate}</span>
                </p>

                <p className="text-xs text-muted-foreground max-w-xl line-clamp-2 pt-1 font-normal">
                  {user.bio || "Active STEM student exploring interactive laboratory simulations on OpenLabs."}
                </p>
              </div>
            </div>

            {/* Share Profile CTA */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyShareLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-muted/50 hover:bg-accent text-foreground text-xs font-bold transition-all shadow-xs"
              >
                {copiedLink ? (
                  <>
                    <Check size={13} className="text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 size={13} />
                    <span>Share Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* ─── 4 TOP KPI METRICS ─── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Level & Progress
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Zap size={14} className="animate-pulse" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-foreground">
              Level {level}
            </div>
            <div className="space-y-1">
              <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                <span>{totalXP} XP</span>
                <span>{nextLevelXP} XP</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Active Streak
              </span>
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <Flame size={14} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-foreground">
              {user.streak || 0}{" "}
              <span className="text-xs text-muted-foreground font-normal">Days</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Daily consecutive simulation streak.</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Simulations Completed
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Beaker size={14} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-foreground">
              {totalCompleted}
            </div>
            <p className="text-[11px] text-muted-foreground">Experiments successfully completed.</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Trophies Unlocked
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Trophy size={14} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-foreground">
              {user.badges?.length || 0}{" "}
              <span className="text-xs text-muted-foreground font-normal">/ {ALL_ACHIEVEMENTS.length}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Milestone badges earned.</p>
          </div>
        </section>

        {/* ─── 5-DISCIPLINE STEM MASTERY ─── */}
        <section className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-primary">
                <Compass size={12} />
                <span>Curriculum Competency</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight">
                STEM Subject Mastery
              </h2>
            </div>
            <Link
              href="/#labs"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>Explore Labs</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {allDisciplines.map((disc) => {
              const Icon = disc.theme.icon;
              const nextXp = Math.max(100, disc.level * 100);
              const pct = Math.min(100, Math.round((disc.xp / nextXp) * 100));

              return (
                <Link
                  key={disc.key}
                  href={disc.theme.path}
                  className="group flex flex-col p-4 rounded-2xl bg-muted/40 border border-border hover:border-primary/40 hover:bg-accent/40 transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-xl ${disc.theme.bg} ${disc.theme.color} flex items-center justify-center`}>
                      <Icon size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase bg-card px-2 py-0.5 rounded-md border border-border/80">
                      Lvl {disc.level}
                    </span>
                  </div>

                  <span className="text-xs font-black text-foreground group-hover:text-primary transition-colors">
                    {disc.theme.label}
                  </span>

                  <div className="mt-3 space-y-1">
                    <div className="w-full bg-card h-1.5 rounded-full overflow-hidden border border-border/60">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                      <span>{disc.xp} XP</span>
                      <span>{pct}%</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ─── TROPHY CASE & BADGES ─── */}
        <section className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-xs space-y-6">
          <div className="border-b border-border pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" />
                <span>Trophy Case & Badges</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Verified achievements unlocked by @{user.username || username}.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground">
              {user.badges?.length || 0} Earned
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_ACHIEVEMENTS.map((badge) => {
              const isEarned = user.badges?.some((b: any) => b.name === badge.name || b.id === badge.id);
              const Icon = badge.icon;

              return (
                <div
                  key={badge.id}
                  className={`
                    p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3
                    ${
                      isEarned
                        ? "bg-card border-primary/30 shadow-xs hover:border-primary/60"
                        : "bg-muted/30 border-border/60 opacity-60"
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`
                        w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs
                        ${isEarned ? `bg-gradient-to-tr ${badge.gradient}` : "bg-muted text-muted-foreground"}
                      `}
                    >
                      {isEarned ? <Icon size={20} /> : <Lock size={18} />}
                    </div>
                    <span
                      className={`
                        px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${isEarned ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : "bg-muted text-muted-foreground"}
                      `}
                    >
                      {isEarned ? "Unlocked" : "Locked"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-foreground">
                      {badge.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
