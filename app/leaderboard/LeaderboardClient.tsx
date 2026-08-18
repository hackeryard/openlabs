"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Flame,
  Medal,
  Zap,
  Calculator,
  Binary,
  Atom,
  Dna,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Crown,
  ChevronRight,
  User as UserIcon,
  Search,
} from "lucide-react";

type Subject = "all" | "physics" | "chemistry" | "biology" | "computerScience" | "mathematics";

const SUBJECTS: { id: Subject; label: string; icon: React.ElementType; color: string }[] = [
  { id: "all", label: "All Disciplines", icon: Trophy, color: "text-amber-500" },
  { id: "physics", label: "Physics", icon: Atom, color: "text-blue-500" },
  { id: "chemistry", label: "Chemistry", icon: Flame, color: "text-emerald-500" },
  { id: "biology", label: "Biology", icon: Dna, color: "text-rose-500" },
  { id: "mathematics", label: "Mathematics", icon: Calculator, color: "text-amber-500" },
  { id: "computerScience", label: "Computer Science", icon: Binary, color: "text-purple-500" },
];

export default function LeaderboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Subject>("all");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState<{ globalRank?: number; subjectRanks?: Record<string, number> } | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetch("/api/leaderboard/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setMyRank({
              globalRank: data.globalRank,
              subjectRanks: data.subjectRanks,
            });
          }
        })
        .catch(console.error);
    }
  }, [currentUser]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?subject=${activeTab}&limit=50`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLeaderboard(data.users || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [activeTab]);

  const currentRankInfo = activeTab === "all" ? myRank?.globalRank : myRank?.subjectRanks?.[activeTab];
  const activeSubjectInfo = SUBJECTS.find((s) => s.id === activeTab) || SUBJECTS[0];

  const getRankTitle = (xp: number) => {
    if (xp < 500) return "Junior Apprentice";
    if (xp < 1500) return "Research Assistant";
    if (xp < 3000) return "Lab Fellow";
    if (xp < 6000) return "Senior Investigator";
    return "Chief Scientist";
  };

  const getUserDisplayXp = (u: any) => {
    if (activeTab === "all") return u.xp || 0;
    if (Array.isArray(u.subjectProgress)) {
      const match = u.subjectProgress.find((s: any) => s.subject === activeTab);
      return match?.xp || 0;
    }
    if (u.subjectProgress?.subject === activeTab) {
      return u.subjectProgress.xp || 0;
    }
    return 0;
  };

  // Top 3 Champions
  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  // Filtered Roster (Ranks 4+)
  const restOfLeaderboard = leaderboard.slice(3).filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.username && u.username.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-28 pt-4 sm:pt-6 selection:bg-primary/20 selection:text-primary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* ─── HEADER ─── */}
        <header className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-black uppercase tracking-wider">
            <Flame size={13} className="text-orange-500" />
            <span>Season 2026 Live Standings</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Scientific Leaderboard
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-lg mx-auto">
            Top STEM researchers across all disciplines. Complete simulations and earn XP to climb the ranks.
          </p>
        </header>

        {/* ─── CURRENT USER STANDING SUMMARY (IF LOGGED IN) ─── */}
        {currentUser && (
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="relative w-11 h-11 rounded-xl border border-primary/40 overflow-hidden shrink-0 bg-muted">
                <Image
                  src={currentUser.avatar || "/images/avatars/avatar-01.png"}
                  alt="Your Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-foreground truncate">{currentUser.name}</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                    You
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-semibold">
                  <span className="text-primary font-bold">@{currentUser.username || "scientist"}</span>
                  <span className="mx-1 opacity-40">&bull;</span>
                  <span>{getRankTitle(currentUser.xp || 0)}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 self-end sm:self-center">
              <div className="text-right">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  {activeSubjectInfo.label} Rank
                </span>
                <span className="text-lg sm:text-xl font-black text-foreground">
                  {currentRankInfo ? `#${currentRankInfo}` : "Unranked"}
                </span>
              </div>
              <div className="text-right pl-4 border-l border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Total XP
                </span>
                <span className="text-lg sm:text-xl font-black text-primary">
                  {(currentUser.xp || 0).toLocaleString()} <span className="text-xs font-semibold text-muted-foreground">XP</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ─── SUBJECT TABS SELECTOR ─── */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border overflow-x-auto">
          {SUBJECTS.map((sub) => {
            const Icon = sub.icon;
            const isActive = activeTab === sub.id;

            return (
              <button
                key={sub.id}
                onClick={() => setActiveTab(sub.id)}
                className={`
                  flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap
                  ${
                    isActive
                      ? "bg-card text-primary shadow-xs border border-border/80"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                  }
                `}
              >
                <Icon size={14} className={isActive ? "text-primary" : sub.color} />
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>

        {/* ─── TOP 3 CHAMPIONS CARDS ─── */}
        {!loading && leaderboard.length >= 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 items-center">
            {/* Rank 2 (Silver / Platinum) */}
            <div
              onClick={() => router.push(`/profile/${top2.username || top2._id}`)}
              className="order-2 sm:order-1 rounded-2xl border-2 border-cyan-500/50 dark:border-cyan-400/50 bg-gradient-to-b from-cyan-500/15 via-sky-500/5 to-card p-4 sm:p-5 shadow-lg shadow-cyan-500/10 flex flex-col items-center text-center cursor-pointer hover:scale-[1.02] transition-all group relative overflow-hidden"
            >
              <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1">
                <Medal size={13} />
                <span>#2 Silver</span>
              </div>

              <div className="relative mb-2.5">
                <div className="w-16 h-16 rounded-2xl border-2 border-cyan-400 overflow-hidden bg-muted relative shadow-xs ring-2 ring-cyan-400/30">
                  <Image
                    src={top2.avatar || "/images/avatars/avatar-02.png"}
                    alt={top2.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-cyan-500 text-white border-2 border-card flex items-center justify-center text-xs font-black shadow-xs">
                  2
                </span>
              </div>

              <h3 className="text-sm font-black text-foreground truncate w-full group-hover:text-cyan-500 transition-colors">
                {top2.name}
              </h3>
              <p className="text-xs text-muted-foreground font-semibold">@{top2.username || "scientist"}</p>
              <div className="mt-3 px-3.5 py-1 rounded-full bg-cyan-500 text-white text-xs font-black shadow-xs">
                {getUserDisplayXp(top2).toLocaleString()} XP
              </div>
            </div>

            {/* Rank 1 (Gold - Elevated) */}
            <div
              onClick={() => router.push(`/profile/${top1.username || top1._id}`)}
              className="order-1 sm:order-2 rounded-3xl border-2 border-amber-500 bg-gradient-to-b from-amber-500/25 via-amber-500/10 to-card p-5 sm:p-6 shadow-xl shadow-amber-500/15 flex flex-col items-center text-center cursor-pointer hover:scale-[1.03] transition-all group relative overflow-hidden ring-4 ring-amber-500/20"
            >
              <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-500 mb-1">
                <Crown size={14} className="animate-bounce" />
                <span>#1 Champion</span>
              </div>

              <div className="relative mb-3">
                <div className="w-20 h-20 rounded-2xl border-2 border-amber-500 overflow-hidden bg-muted relative shadow-md ring-4 ring-amber-500/30">
                  <Image
                    src={top1.avatar || "/images/avatars/avatar-01.png"}
                    alt={top1.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-amber-500 text-white border-2 border-card flex items-center justify-center text-xs font-black shadow-md">
                  1
                </span>
              </div>

              <h3 className="text-base font-black text-foreground truncate w-full group-hover:text-amber-500 transition-colors">
                {top1.name}
              </h3>
              <p className="text-xs text-muted-foreground font-semibold">@{top1.username || "scientist"}</p>
              <div className="mt-3 px-4 py-1.5 rounded-full bg-amber-500 text-white font-black text-sm shadow-md">
                {getUserDisplayXp(top1).toLocaleString()} XP
              </div>
            </div>

            {/* Rank 3 (Bronze / Copper) */}
            <div
              onClick={() => router.push(`/profile/${top3.username || top3._id}`)}
              className="order-3 rounded-2xl border-2 border-orange-500/50 dark:border-orange-400/50 bg-gradient-to-b from-orange-500/15 via-amber-700/5 to-card p-4 sm:p-5 shadow-lg shadow-orange-500/10 flex flex-col items-center text-center cursor-pointer hover:scale-[1.02] transition-all group relative overflow-hidden"
            >
              <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
                <Medal size={13} />
                <span>#3 Bronze</span>
              </div>

              <div className="relative mb-2.5">
                <div className="w-16 h-16 rounded-2xl border-2 border-orange-500 overflow-hidden bg-muted relative shadow-xs ring-2 ring-orange-500/30">
                  <Image
                    src={top3.avatar || "/images/avatars/avatar-03.png"}
                    alt={top3.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-orange-500 text-white border-2 border-card flex items-center justify-center text-xs font-black shadow-xs">
                  3
                </span>
              </div>

              <h3 className="text-sm font-black text-foreground truncate w-full group-hover:text-orange-500 transition-colors">
                {top3.name}
              </h3>
              <p className="text-xs text-muted-foreground font-semibold">@{top3.username || "scientist"}</p>
              <div className="mt-3 px-3.5 py-1 rounded-full bg-orange-500 text-white text-xs font-black shadow-xs">
                {getUserDisplayXp(top3).toLocaleString()} XP
              </div>
            </div>
          </div>
        )}

        {/* ─── FULL ROSTER LIST ─── */}
        <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-primary" />
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-foreground">
                {activeSubjectInfo.label} Rankings
              </h2>
              <span className="text-xs text-muted-foreground">
                ({leaderboard.length} total)
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search researcher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs font-medium border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-background text-foreground transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-xs font-bold uppercase tracking-wider">Loading rankings...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Trophy size={32} className="mx-auto text-muted-foreground opacity-30" />
              <p className="text-sm font-bold text-foreground">No Ranked Scientists Yet</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Be the first to complete a simulation in {activeSubjectInfo.label} to claim the #1 spot!
              </p>
              <div className="pt-2">
                <Link
                  href="/#labs"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition-all"
                >
                  <span>Launch Simulation</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {leaderboard.map((u, i) => {
                const rank = i + 1;
                const isMe = currentUser && (u._id === currentUser.id || u.username === currentUser.username);
                const displayXp = getUserDisplayXp(u);

                let rankBadgeClass = "bg-muted text-muted-foreground font-bold";
                if (rank === 1) rankBadgeClass = "bg-amber-500 text-white font-black";
                else if (rank === 2) rankBadgeClass = "bg-slate-400 text-white font-black";
                else if (rank === 3) rankBadgeClass = "bg-orange-500 text-white font-black";

                return (
                  <div
                    key={u._id || i}
                    onClick={() => router.push(`/profile/${u.username || u._id}`)}
                    className={`
                      p-3.5 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 transition-colors cursor-pointer
                      ${isMe ? "bg-primary/10 hover:bg-primary/15" : "hover:bg-muted/40"}
                    `}
                  >
                    {/* Rank & Identity */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      {/* Rank Position */}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${rankBadgeClass}`}>
                        {rank}
                      </div>

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-xl bg-muted overflow-hidden border border-border shrink-0 relative">
                        <Image
                          src={u.avatar || "/images/avatars/avatar-01.png"}
                          alt={u.name || "Researcher"}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-foreground truncate">
                            {u.name || "Anonymous Researcher"}
                          </span>
                          {isMe && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-primary text-primary-foreground shrink-0">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <span className="text-primary font-semibold">@{u.username || "scientist"}</span>
                          <span>&bull;</span>
                          <span>Lvl {u.level || 1}</span>
                          <span className="hidden sm:inline">&bull;</span>
                          <span className="hidden sm:inline">{getRankTitle(displayXp)}</span>
                        </p>
                      </div>
                    </div>

                    {/* XP Number */}
                    <div className="shrink-0 text-right flex items-center gap-2">
                      <div>
                        <span className="text-sm sm:text-base font-black text-foreground">
                          {displayXp.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase pl-1">
                          XP
                        </span>
                      </div>
                      <ChevronRight size={14} className="text-muted-foreground opacity-30 hidden sm:inline-block" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
