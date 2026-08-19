"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { analyticsService } from "@/lib/analytics";
import { useAuth } from "@/components/AuthProvider";
import {
  Edit2,
  LogOut,
  Award,
  Beaker,
  Zap,
  Mail,
  Calendar,
  Target,
  Activity,
  CheckCircle2,
  Flame,
  Trophy,
  Sparkles,
  BookOpen,
  Camera,
  ChevronRight,
  Compass,
  GraduationCap,
  Microscope,
  Share2,
  Check,
  Atom,
  Dna,
  Binary,
  Calculator,
  ExternalLink,
  ShieldCheck,
  User as UserIcon,
  Settings,
  History,
  Lock,
  ArrowRight,
} from "lucide-react";
import CurriculumTracksExplorer from "@/app/components/CurriculumTracksExplorer";

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

export default function ProfileViewClient() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "tracks" | "history" | "badges" | "settings">("overview");
  const [form, setForm] = useState({ username: "", bio: "", avatar: "" });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return;
        const data = await res.json();
        setUser(data.user);
      } catch (e) { }
    }
    load();
  }, []);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        bio: user.bio || "",
        avatar: user.avatar || AVATARS[0],
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] gap-3">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <Microscope className="absolute inset-0 m-auto text-primary opacity-60" size={20} />
        </div>
        <p className="text-xs font-bold text-muted-foreground animate-pulse uppercase tracking-wider">
          Initializing Scientist Workspace...
        </p>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaveSuccess(false);
    const raw = (form.username || "").toLowerCase().trim();
    const payload: any = {};
    if (raw && raw !== (user.username || "")) payload.username = raw;
    if ((form.bio || "") !== (user.bio || "")) payload.bio = form.bio;
    if (form.avatar && form.avatar !== user.avatar) {
      payload.avatar = form.avatar;
      payload.replaceAvatar = true;
    }

    if (Object.keys(payload).length === 0) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      setUser(data.user);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyShareLink = () => {
    if (typeof window !== "undefined" && user.username) {
      const url = `${window.location.origin}/profile/${user.username}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

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
        {/* ─── SLEEK PROFILE HEADER ─── */}
        <header className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-36 bg-gradient-to-l from-primary/10 via-primary/5 to-transparent pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
            {/* User Identity Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
              {/* Avatar with Glow Ring */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-border overflow-hidden bg-muted relative shadow-sm">
                  <Image
                    src={user.avatar || AVATARS[0]}
                    alt="User Avatar"
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
                  <span className="text-primary font-bold">@{user.username || "scientist"}</span>
                  <span className="mx-1.5 opacity-40">&bull;</span>
                  <span>Joined {joinDate}</span>
                </p>

                <p className="text-xs text-muted-foreground max-w-xl line-clamp-2 pt-1 font-normal">
                  {user.bio || "Active STEM student exploring interactive laboratory simulations on OpenLabs."}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
              {user.username && (
                <button
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-muted/50 hover:bg-accent text-foreground text-xs font-bold transition-all shadow-xs"
                  title="Copy link to public profile"
                >
                  {copiedLink ? (
                    <>
                      <Check size={13} className="text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={13} />
                      <span>Share Profile</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => setActiveTab("settings")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-xs"
              >
                <Edit2 size={13} />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => {
                  analyticsService.trackLogoutCompleted();
                  logout().then(() => router.push("/"));
                }}
                className="inline-flex items-center gap-1.5 p-2 rounded-xl border border-border bg-card hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600 transition-all shadow-xs"
                title="Log Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </header>

        {/* ─── NAVIGATION TABS ─── */}
        <nav
          aria-label="Profile Sections"
          className="flex items-center gap-1 p-1 rounded-2xl bg-muted/60 border border-border overflow-x-auto"
        >
          {[
            { id: "overview", label: "Dashboard Overview", icon: Activity },
            { id: "tracks", label: "Learning Tracks", icon: Compass },
            { id: "history", label: "Simulation Log", icon: History, count: totalCompleted },
            { id: "badges", label: "Trophy Case & Quests", icon: Trophy, count: user.badges?.length || 0 },
            { id: "settings", label: "Account & Avatar", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap
                  ${isActive
                    ? "bg-card text-primary shadow-xs border border-border/80"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                  }
                `}
              >
                <Icon size={14} className={isActive ? "text-primary" : "text-muted-foreground"} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`
                      px-1.5 py-0.2 rounded-full text-[10px] font-black
                      ${isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}
                    `}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ─── TAB CONTENT ─── */}
        <main>
          {/* ═════════ TAB 1: OVERVIEW ═════════ */}
          {activeTab === "overview" && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
              {/* 4 KPI Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Level Card */}
                <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      Level & XP
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

                {/* Streak Card */}
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
                  <p className="text-[11px] text-muted-foreground">Keep learning daily to level up.</p>
                </div>

                {/* Completed Labs Card */}
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
                  <p className="text-[11px] text-muted-foreground">Virtual experiments executed.</p>
                </div>

                {/* Badges Card */}
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
                  <p className="text-[11px] text-muted-foreground">Achievements earned so far.</p>
                </div>
              </div>

              {/* 5-Discipline Subject Mastery Matrix */}
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
                    <span>Browse All Labs</span>
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

              {/* Curriculum Tracks Quick Progress Preview */}
              <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-primary">
                      <Compass size={12} />
                      <span>Guided Learning Journeys</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight">
                      Active Curriculum Tracks
                    </h2>
                  </div>
                  <Link
                    href="/tracks"
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>View All 13 Tracks</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>

                <CurriculumTracksExplorer
                  completedLabIds={(user.completedExperiments || []).map((e: any) => e.experimentId)}
                  limit={2}
                  title=""
                  subtitle=""
                  showFilters={false}
                  compact={true}
                />

                <div className="pt-2 text-center">
                  <Link
                    href="/tracks"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-muted hover:bg-accent text-xs font-bold text-foreground border border-border transition-all"
                  >
                    <span>Explore All 13 Science & Math Tracks</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Bottom 2-Col Grid (Weekly Activity + Quick Challenge) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8">
                  <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-foreground">
                        <Activity size={14} className="text-primary" />
                        <span>Weekly Simulation Activity</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Past 7 Days</span>
                    </div>
                    {user.activityLog && user.activityLog.length > 0 ? (
                      <div className="pt-2 grid grid-cols-7 gap-2">
                        {user.activityLog.slice(-7).map((d: any, i: number) => {
                          const dateObj = new Date(d.date);
                          const dayName = dateObj.toLocaleDateString("en-US", { weekday: "narrow" });
                          const heightPct = Math.min(100, Math.max(15, d.count * 20));

                          return (
                            <div key={i} className="flex flex-col items-center gap-2">
                              <div className="w-full bg-muted h-24 rounded-xl flex items-end p-1">
                                <div
                                  className="w-full bg-primary/80 hover:bg-primary rounded-lg transition-all"
                                  style={{ height: `${heightPct}%` }}
                                  title={`${d.count} simulations on ${d.date}`}
                                />
                              </div>
                              <span className="text-[10px] font-bold text-muted-foreground">{dayName}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground py-6 text-center">
                        No activity recorded this week yet. Run any lab to start logging data.
                      </p>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-4">
                  <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-indigo-900/30 via-card to-card p-5 sm:p-6 shadow-xs space-y-3.5">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary">
                      <Target size={14} />
                      <span>Daily Quest</span>
                    </div>
                    <h3 className="text-sm font-black text-foreground">
                      Level Up Your Scientist Rank
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Complete simulation challenges to earn XP badges and climb the global leaderboard.
                    </p>
                    <Link
                      href="/leaderboard"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90 transition-all"
                    >
                      <Trophy size={13} />
                      <span>View Global Leaderboard</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═════════ TAB 2: CURRICULUM TRACKS ═════════ */}
          {activeTab === "tracks" && (
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-300">
              <CurriculumTracksExplorer
                completedLabIds={(user.completedExperiments || []).map((e: any) => e.experimentId)}
                title="All Curriculum Tracks"
                subtitle="Complete structured tracks across Physics, Chemistry, Biology, Computer Science, and Mathematics to earn master badges."
                showFilters={true}
              />
            </div>
          )}

          {/* ═════════ TAB 3: SIMULATION LOG ═════════ */}
          {activeTab === "history" && (
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-xs space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight">
                    Simulation History
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Chronological record of all completed experiments and earned rewards.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground">
                  {totalCompleted} Total Runs
                </span>
              </div>

              {!user.completedExperiments || user.completedExperiments.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <Beaker size={32} className="mx-auto text-muted-foreground opacity-40" />
                  <p className="text-sm font-bold text-foreground">No Simulations Logged Yet</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Launch any virtual lab in Physics, Chemistry, Biology, Math, or Computer Science to start recording your history.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/#labs"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
                    >
                      <span>Explore Virtual Labs</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {user.completedExperiments.map((exp: any, idx: number) => {
                    const theme = SUBJECT_THEMES[exp.subject] || SUBJECT_THEMES.physics;
                    const Icon = theme.icon;

                    return (
                      <div
                        key={idx}
                        className="py-3.5 flex items-center justify-between gap-4 hover:bg-muted/30 px-2 rounded-xl transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className={`w-9 h-9 rounded-xl ${theme.bg} ${theme.color} flex items-center justify-center shrink-0`}>
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-foreground text-xs sm:text-sm capitalize truncate">
                              {exp.experimentId?.replace(/-/g, " ")}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-2 mt-0.5">
                              <span className="uppercase text-primary font-bold">{theme.label}</span>
                              <span>&bull;</span>
                              <span>{new Date(exp.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            +{exp.xpEarned || 50} XP
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═════════ TAB 3: BADGES & TROPHY CASE ═════════ */}
          {activeTab === "badges" && (
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-border pb-4">
                <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight">
                  Trophy Case & Scientific Badges
                </h2>
                <p className="text-xs text-muted-foreground">
                  Earn milestone badges by solving challenges and building streaks.
                </p>
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
                        ${isEarned
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
            </div>
          )}

          {/* ═════════ TAB 4: SETTINGS & AVATAR ═════════ */}
          {activeTab === "settings" && (
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight flex items-center gap-2">
                    <Settings size={18} className="text-primary" />
                    <span>Account Identity & Avatar Settings</span>
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Customize your public researcher handle, bio, and choose from 12 official OpenLabs scientist avatars.
                  </p>
                </div>
                {user.username && (
                  <Link
                    href={`/profile/${user.username}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-xs font-bold text-foreground transition-all shadow-xs shrink-0"
                  >
                    <span>View Public Profile</span>
                    <ExternalLink size={12} />
                  </Link>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                  {/* LEFT: Live Identity Card Preview (5 cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="rounded-2xl border border-border bg-muted/40 p-5 space-y-4 shadow-xs">
                      <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                        Live Researcher Badge Preview
                      </span>

                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-2xl border-2 border-primary overflow-hidden shadow-xs shrink-0 bg-card">
                          <Image
                            src={form.avatar || user.avatar || AVATARS[0]}
                            alt="Selected avatar"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-black text-foreground truncate">
                            {user.name}
                          </h3>
                          <p className="text-xs font-bold text-primary truncate">
                            @{form.username || user.username || "username"}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground mt-0.5">
                            <ShieldCheck size={11} className="text-emerald-500" />
                            <span>{rank}</span>
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-card border border-border/80 p-3 space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          Bio Preview
                        </span>
                        <p className="text-xs text-foreground/80 leading-relaxed italic">
                          "{form.bio || user.bio || "Active STEM researcher exploring virtual simulations on OpenLabs."}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-border/60 space-y-2 text-xs text-muted-foreground font-medium">
                        <div className="flex items-center justify-between">
                          <span>Account Email:</span>
                          <span className="font-semibold text-foreground">{user.email}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Joined:</span>
                          <span className="font-semibold text-foreground">{joinDate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Total Experiments:</span>
                          <span className="font-semibold text-foreground">{totalCompleted} runs</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Avatar Selector & Edit Form (7 cols) */}
                  <div className="lg:col-span-7 space-y-5">
                    {/* Avatar Gallery */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black uppercase tracking-wider text-foreground">
                          Choose Scientist Avatar
                        </label>
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          12 Avatars Available
                        </span>
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                        {AVATARS.map((path, idx) => {
                          const isSelected = (form.avatar || user.avatar) === path;

                          return (
                            <button
                              key={path}
                              type="button"
                              onClick={() => setForm((f) => ({ ...f, avatar: path }))}
                              className={`
                                relative aspect-square rounded-2xl overflow-hidden border-2 transition-all p-0.5 group
                                ${isSelected
                                  ? "border-primary ring-4 ring-primary/20 scale-105 shadow-md"
                                  : "border-border/80 opacity-70 hover:opacity-100 hover:scale-105 hover:border-primary/40 bg-card"
                                }
                              `}
                              title={`Avatar ${idx + 1}`}
                            >
                              <Image src={path} alt={`Avatar option ${idx + 1}`} fill className="object-cover rounded-xl" />
                              {isSelected && (
                                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                                  <Check size={10} strokeWidth={3} />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Username Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-foreground">
                        Public Researcher Handle
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs">
                          @
                        </span>
                        <input
                          type="text"
                          className="w-full pl-8 pr-4 py-2.5 text-xs sm:text-sm font-bold border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-background text-foreground transition-all"
                          value={form.username}
                          onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                          placeholder="username"
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <span>Public profile link:</span>
                        <span className="font-mono text-primary font-bold">openlabs.org.in/profile/{form.username || "username"}</span>
                      </p>
                    </div>

                    {/* Bio Textarea */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black uppercase tracking-wider text-foreground">
                          Research Bio & Academic Goals
                        </label>
                        <span className="text-[10px] text-muted-foreground">
                          {form.bio?.length || 0} / 250
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        maxLength={250}
                        className="w-full p-3 text-xs sm:text-sm font-medium border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-background text-foreground transition-all leading-relaxed"
                        value={form.bio}
                        onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                        placeholder="Tell students and educators about your scientific interests, favorite experiments, or academic aspirations..."
                      />
                    </div>

                    {error && (
                      <p className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold">
                        {error}
                      </p>
                    )}

                    {saveSuccess && (
                      <p className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                        <Check size={14} />
                        <span>Profile & avatar updated successfully!</span>
                      </p>
                    )}

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90 transition-all disabled:opacity-50 inline-flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                            <span>Saving Changes...</span>
                          </>
                        ) : (
                          <>
                            <Check size={14} />
                            <span>Save Profile Settings</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}