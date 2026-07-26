"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Award,
  Zap,
  Target,
  Flame,
  Trophy,
  Sparkles,
  BookOpen,
  Compass,
  Microscope
} from "lucide-react";
import UniversalLoader from "@/app/components/UniversalLoader";

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

function XPBar({ xp, level, color = "from-indigo-500 via-blue-500 to-cyan-400" }: { xp: number; level: number; color?: string }) {
  const next = level * 100;
  const pct = Math.min(100, Math.round((xp / next) * 100));
  return (
    <div className="space-y-2 w-full">
      <div className="relative w-full bg-slate-900/5 rounded-full h-3.5 p-[2px] shadow-inner overflow-hidden backdrop-blur-sm">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className={`bg-gradient-to-r ${color} h-full rounded-full relative shadow-[0_0_10px_rgba(99,102,241,0.4)]`}
        >
          <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-r from-transparent to-white/40 rounded-full animate-[pulse_2s_infinite]" />
        </motion.div>
      </div>
      <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
        <span>{xp} XP Earned</span>
        <span>{next - xp} XP to Level {level + 1}</span>
      </div>
    </div>
  );
}

function SubjectMasteryCircle({ subject, xp, level }: { subject: string; xp: number; level: number }) {
  const next = level * 100;
  const pct = Math.min(100, Math.round((xp / next) * 100));
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const colorMap: Record<string, { stroke: string; border: string; shadow: string; text: string; bg: string }> = {
    physics: { stroke: "stroke-indigo-500", border: "hover:border-indigo-500/50", shadow: "hover:shadow-indigo-500/20", text: "text-indigo-500", bg: "bg-indigo-500/10" },
    chemistry: { stroke: "stroke-amber-500", border: "hover:border-amber-500/50", shadow: "hover:shadow-amber-500/20", text: "text-amber-500", bg: "bg-amber-500/10" },
    biology: { stroke: "stroke-emerald-500", border: "hover:border-emerald-500/50", shadow: "hover:shadow-emerald-500/20", text: "text-emerald-500", bg: "bg-emerald-500/10" },
    computerScience: { stroke: "stroke-purple-500", border: "hover:border-purple-500/50", shadow: "hover:shadow-purple-500/20", text: "text-purple-500", bg: "bg-purple-500/10" },
  };

  const theme = colorMap[subject] || colorMap.physics;
  const displayName = subject === "computerScience" ? "Comp Sci" : subject;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`bg-card border border-border rounded-3xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${theme.border} ${theme.shadow}`}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-transparent to-${theme.bg.split('-')[1]}`} />

      <div className="relative w-20 h-20 flex items-center justify-center mb-2">
        <svg className="w-full h-full -rotate-90 drop-shadow-sm">
          <circle cx="40" cy="40" r={radius} className="stroke-muted" strokeWidth="6" fill="transparent" />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
            cx="40" cy="40" r={radius}
            className={theme.stroke}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-sm font-black text-foreground">
          {pct}%
        </span>
      </div>

      <h4 className="text-[11px] font-black text-foreground uppercase tracking-widest mt-2 truncate w-full px-1 relative z-10">
        {displayName}
      </h4>
      <span className="text-[10px] font-bold text-muted-foreground mt-1 relative z-10">
        LVL {level} <span className="opacity-40 px-1">•</span> {xp} XP
      </span>
    </motion.div>
  );
}



const BADGE_THEMES: Record<string, { gradient: string; text: string; bg: string; iconColor: string }> = {
  "First Challenge": { gradient: "from-amber-300 via-yellow-400 to-amber-500", text: "text-amber-500", bg: "bg-amber-500/10", iconColor: "text-amber-500" },
  "3 Day Streak": { gradient: "from-orange-400 via-red-500 to-rose-600", text: "text-orange-500", bg: "bg-orange-500/10", iconColor: "text-orange-500" },
  "7 Day Streak": { gradient: "from-fuchsia-500 via-purple-500 to-indigo-600", text: "text-purple-500", bg: "bg-purple-500/10", iconColor: "text-purple-500" },
  "default": { gradient: "from-indigo-400 via-blue-500 to-cyan-500", text: "text-indigo-500", bg: "bg-indigo-500/10", iconColor: "text-indigo-500" }
};

export default function ProfilePublicClient({ username }: { username: string }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/profile/${encodeURIComponent(username)}`);
        if (!res.ok) return;
        const data = await res.json();
        setUser(data.user);
      } catch (e) { }
    }
    load();
  }, [username]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-purple-500 animate-spin animate-reverse"></div>
          <Microscope className="absolute inset-0 m-auto text-indigo-400 opacity-50" size={24} />
        </div>
        <p className="text-sm font-bold text-muted-foreground animate-pulse tracking-widest uppercase">Initializing Workspace...</p>
      </div>
    );
  }


  const getRankTitle = (xp: number) => {
    if (xp < 500) return "Junior Apprentice";
    if (xp < 1500) return "Research Assistant";
    if (xp < 3000) return "Lab Fellow";
    if (xp < 6000) return "Senior Investigator";
    return "Chief Laboratory Officer";
  };
  const rank = getRankTitle(user.xp || 0);

  return (
    <div className="min-h-screen font-sans relative overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">

      {/* Background Animated Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] mix-blend-multiply pointer-events-none animate-[pulse_8s_infinite]" />
      <div className="absolute bottom-20 right-1/4 w-[30rem] h-[30rem] rounded-full bg-purple-500/10 blur-[120px] mix-blend-multiply pointer-events-none animate-[pulse_10s_infinite_reverse]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto pb-24 px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12 relative z-10"
      >

        {/* --- Profile Header Glass Card --- */}
        <motion.div variants={itemVariants} className="relative bg-card rounded-[2rem] border border-border shadow-[0_8px_40px_rgb(0,0,0,0.03)] overflow-hidden mb-8 group/card">

          {/* Abstract Lab Banner Area */}
          <div className="h-48 sm:h-56 bg-slate-900 relative overflow-hidden flex items-center justify-center">
            {/* Dark mesh gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />

            {/* Subtle OpenLabs watermark concept */}
            <h1 className="absolute text-[8rem] font-black text-white/[0.02] tracking-tighter select-none pointer-events-none whitespace-nowrap">
              OPENLABS
            </h1>

            <motion.div
              className="absolute top-1/4 right-1/4 w-48 h-48 bg-indigo-500/30 rounded-full blur-[60px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            />
          </div>

          <div className="px-6 sm:px-12 pb-10 relative z-10">
            <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8 -mt-20 mb-6 text-center md:text-left">

              {/* Dynamic Avatar */}
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 rounded-[2.5rem] blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-500" />
                <div className="w-36 h-36 rounded-[2rem] border-4 border-card/90 shadow-2xl bg-card overflow-hidden relative mx-auto md:mx-0 backdrop-blur-sm transform group-hover:scale-[1.02] transition-transform duration-300">
                  <img
                    key={user.avatar}
                    src={user.avatar || AVATARS[0]}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 pb-3 w-full space-y-2">
                <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                  <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                    {user.name}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20 self-center md:self-auto">
                    <Sparkles size={12} className="text-indigo-100 animate-pulse" />
                    Scientist Lvl {user.level || 1}
                  </span>
                </div>
                {user.username && <p className="text-indigo-500 font-bold text-sm tracking-wide">@{user.username}</p>}
              </div>

            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key="bio"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-border pt-6 mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="flex-1">
                  <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed font-medium text-center md:text-left bg-muted p-4 rounded-2xl border border-border">
                    {user.bio || "No bio provided."}
                  </p>
                </div>

                {/* Rank Status Badge */}
                <div className="bg-primary/10 border border-primary/20 rounded-2xl px-5 py-3.5 flex items-center gap-4 shrink-0 self-center lg:self-auto shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center text-primary">
                    <Microscope size={20} />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-primary font-black block mb-0.5">Current Rank</span>
                    <span className="text-sm font-black text-foreground tracking-tight">{rank}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* --- Main Dashboard Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">

          {/* LEFT COLUMN (2/3 width) */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8 flex flex-col">

            {/* Top Level KPIs */}
            <motion.div variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">

              <motion.div variants={itemVariants} className="bg-card border border-border rounded-3xl p-5 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(99,102,241,0.12)] group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap size={22} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="text-3xl font-black text-foreground tracking-tighter">{user.level || 1}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Current Level</p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-card border border-border rounded-3xl p-5 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(249,115,22,0.12)] group">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Flame size={22} />
                </div>
                <div>
                  <h4 className="text-3xl font-black text-foreground tracking-tighter">
                    {user.streak || 0} <span className="text-sm text-muted-foreground font-bold tracking-normal">day</span>
                  </h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Lab Streak</p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-card border border-border rounded-3xl p-5 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(59,130,246,0.12)] group">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Trophy size={22} />
                </div>
                <div>
                  <h4 className="text-3xl font-black text-foreground tracking-tighter">{user.xp || 0}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Total XP</p>
                </div>
              </motion.div>

            </motion.div>

            {/* Subject Mastery Panel */}
            <motion.div variants={itemVariants} className="bg-card p-6 sm:p-8 rounded-[2rem] border border-border shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-8 flex-grow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                    <Compass size={20} />
                  </div>
                  Core Mastery
                </h3>
              </div>

              {(!user.subjectProgress || user.subjectProgress.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-muted rounded-3xl border border-border border-dashed text-sm font-semibold">
                  <BookOpen className="mb-3 opacity-20" size={32} />
                  No labs initialized yet.
                </div>
              ) : (
                <motion.div variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                  {user.subjectProgress.map((s: any) => (
                    <SubjectMasteryCircle key={s.subject} subject={s.subject} xp={s.xp} level={s.level} />
                  ))}
                </motion.div>
              )}
            </motion.div>

          </div>

          {/* RIGHT COLUMN (1/3 width) */}
          <div className="space-y-6 lg:space-y-8 flex flex-col">

            {/* Achievements */}
            <motion.div variants={itemVariants} className="bg-card p-6 sm:p-8 rounded-[2rem] border border-border shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative overflow-hidden flex flex-col min-h-[420px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-[40px] pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full space-y-6">
                <h3 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                    <Award size={20} />
                  </div>
                  Badges
                </h3>

                {(!user.badges || user.badges.length === 0) ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-center py-10 space-y-4">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-muted border border-border flex items-center justify-center text-muted-foreground">
                      <Award size={28} />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-sm font-bold text-foreground">No Badges Yet</p>
                      <p className="text-[11px] font-medium text-muted-foreground max-w-[200px] leading-relaxed mx-auto">
                        This user hasn't earned any badges.
                      </p>
                    </div>
                  </div>
                ) : (
                  <motion.div variants={containerVariants} className="grid grid-cols-2 gap-4 flex-grow content-start">
                    {user.badges.map((b: any) => {
                      const badgeTheme = BADGE_THEMES[b.name] || BADGE_THEMES.default;
                      return (
                        <motion.div
                          variants={itemVariants}
                          key={b.id}
                          className="p-5 rounded-[1.25rem] bg-card border border-border hover:border-muted-foreground/40 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group cursor-crosshair relative overflow-hidden"
                        >
                          {/* 3D Spin Medal */}
                          <div
                            className={`w-14 h-14 rounded-full mb-3.5 flex items-center justify-center bg-gradient-to-tr ${badgeTheme.gradient} shadow-md`}
                            style={{ transformStyle: "preserve-3d", transition: "transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = "rotateY(180deg) scale(1.1)"}
                            onMouseLeave={(e) => e.currentTarget.style.transform = "rotateY(0deg) scale(1)"}
                          >
                            <div className="absolute inset-0 bg-white/20 rounded-full" style={{ transform: "translateZ(-1px)" }} />
                            <Trophy size={24} className="text-white drop-shadow-md relative z-10" />
                          </div>
                          <span className="text-[11px] font-black text-foreground uppercase tracking-wide leading-snug">
                            {b.name}
                          </span>
                          {b.earnedAt && (
                            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-1.5">
                              {new Date(b.earnedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            </motion.div>


          </div>
        </div>
      </motion.div>
    </div>
  );
}
