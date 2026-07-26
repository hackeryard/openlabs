"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Flame, Medal, Compass, Beaker, Zap, Activity } from "lucide-react";
import { useRouter } from "next/navigation";

type Subject = "all" | "physics" | "chemistry" | "biology" | "computerScience";

const SUBJECTS: { id: Subject; label: string; icon: any; color: string }[] = [
  { id: "all", label: "All Subjects", icon: Trophy, color: "text-indigo-500" },
  { id: "physics", label: "Physics", icon: Zap, color: "text-indigo-500" },
  { id: "chemistry", label: "Chemistry", icon: Beaker, color: "text-amber-500" },
  { id: "biology", label: "Biology", icon: Activity, color: "text-emerald-500" },
  { id: "computerScience", label: "Comp Sci", icon: Compass, color: "text-purple-500" },
];

export default function LeaderboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Subject>("all");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState<{ globalRank?: number; subjectRanks?: Record<string, number> } | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Check auth
    fetch("/api/auth/me")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetch("/api/leaderboard/me")
        .then(res => res.json())
        .then(data => {
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

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pt-24 px-4 sm:px-6 lg:px-8 selection:bg-primary/20 selection:text-primary">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Hero Section */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest shadow-sm"
          >
            <Flame size={14} className="text-orange-500" />
            Season 2026
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight text-foreground"
          >
            Global Leaderboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-medium max-w-lg mx-auto"
          >
            Top scientists across all disciplines. Compete, complete labs, and rise through the ranks.
          </motion.p>
        </div>

        {/* Profile Setup Prompt */}
        {currentUser && currentUser.profileSetupComplete === false && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-[1.5rem] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg"
          >
            <div className="flex items-center gap-4 flex-col sm:flex-row">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <Compass size={24} className="text-amber-500" />
              </div>
              <div>
                <h3 className="font-black text-lg tracking-tight text-amber-600 dark:text-amber-400">Setup your profile to join the race!</h3>
                <p className="text-sm font-medium opacity-90 mt-0.5">You won't appear on the global leaderboard until you finish setting up your lab.</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/setup-profile")}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-xl whitespace-nowrap text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              Setup Profile
            </button>
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex justify-center flex-wrap gap-2 pt-4">
          {SUBJECTS.map((sub) => {
            const Icon = sub.icon;
            const isActive = activeTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveTab(sub.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all ${isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                    : "bg-muted text-muted-foreground border border-border hover:bg-accent"
                  }`}
              >
                <Icon size={16} className={isActive ? "text-primary-foreground" : sub.color} />
                {sub.label}
              </button>
            );
          })}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-card border border-border rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] overflow-hidden relative">

          {loading && (
            <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm flex items-center justify-center">
              <div className="animate-spin text-primary">
                <Trophy size={32} />
              </div>
            </div>
          )}

          <div className="p-4 sm:p-6 space-y-3">
            <AnimatePresence mode="popLayout">
              {leaderboard.length === 0 && !loading ? (
                <div className="text-center py-12 text-muted-foreground font-semibold bg-muted rounded-2xl border border-dashed border-border">
                  No data available for this category yet.
                </div>
              ) : (
                leaderboard.map((u, i) => {
                  const rank = i + 1;
                  const isTop3 = rank <= 3;
                  const isMe = currentUser && u._id === currentUser.id;
                  const displayXp = activeTab === "all" ? u.xp : (u.subjectProgress?.find((s: any) => s.subject === activeTab)?.xp || 0);

                  let topSubject = "";
                  if (activeTab === "all" && u.subjectProgress?.length > 0) {
                    const best = [...u.subjectProgress].sort((a: any, b: any) => b.xp - a.xp)[0];
                    topSubject = best.subject === "computerScience" ? "Comp Sci" : best.subject;
                  }

                  let rankStyling = "bg-muted text-muted-foreground font-bold border-border";
                  if (rank === 1) rankStyling = "bg-amber-500/10 text-amber-500 font-black border-amber-500/20 shadow-sm";
                  if (rank === 2) rankStyling = "bg-slate-500/10 text-slate-500 font-black border-slate-500/20 shadow-sm";
                  if (rank === 3) rankStyling = "bg-orange-500/10 text-orange-500 font-black border-orange-500/20 shadow-sm";

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: i * 0.02 }}
                      key={u._id}
                      onClick={() => router.push(`/profile/${u.username || u._id}`)}
                      className={`flex items-center gap-4 p-3 sm:p-4 rounded-[1.25rem] transition-all cursor-pointer
                        ${isTop3 ? "bg-card border-2 border-border shadow-md hover:shadow-lg hover:-translate-y-0.5" : "bg-card border border-border hover:bg-accent"}
                        ${isMe ? "ring-2 ring-primary shadow-primary/20 bg-primary/10" : ""}
                      `}
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 flex flex-col items-center justify-center rounded-xl border ${rankStyling}`}>
                        {rank === 1 ? <Medal size={20} className="text-amber-500 mb-0.5" /> : null}
                        <span className={rank === 1 ? "text-xs" : "text-sm"}>#{rank}</span>
                      </div>

                      <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-muted overflow-hidden border border-border">
                        <img src={u.avatar || "/images/avatars/avatar-01.png"} alt={u.username} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className={`truncate font-bold text-foreground ${isTop3 ? "text-lg" : "text-base"}`}>
                            {u.name || "Anonymous"}
                          </h3>
                          {isMe && <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider shrink-0">You</span>}
                        </div>
                        <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-muted-foreground mt-1">
                          <span>Lvl {u.level || 1}</span>
                          {activeTab === "all" && topSubject && (
                            <>
                              <span className="opacity-50">•</span>
                              <span className="truncate capitalize text-muted-foreground">Best: {topSubject}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 text-right pr-2">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className={`font-black tracking-tight ${isTop3 ? "text-xl text-foreground" : "text-lg text-foreground/80"}`}>
                            {displayXp.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">XP</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Your Rank Card */}
        {currentUser && currentRankInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary rounded-[2rem] p-6 sm:p-8 text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="relative z-10 flex items-center gap-5 w-full">
              <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 flex items-center justify-center border border-primary-foreground/20 shrink-0">
                <Trophy size={28} className="text-primary-foreground/80" />
              </div>
              <div className="flex-1">
                <p className="text-primary-foreground/80 font-bold uppercase tracking-widest text-xs mb-1">Your Standing</p>
                <h3 className="text-2xl font-black text-primary-foreground">
                  {activeTab === "all" ? "Global Rank" : `${SUBJECTS.find(s => s.id === activeTab)?.label} Rank`}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <div className="text-4xl font-black tracking-tighter text-primary-foreground drop-shadow-sm">
                  #{currentRankInfo.toLocaleString()}
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
