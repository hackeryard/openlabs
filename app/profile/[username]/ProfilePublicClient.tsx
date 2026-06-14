"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Dna, 
  BookOpen, 
  Beaker, 
  Zap, 
  Calendar, 
  Trophy, 
  Sparkles,
  Award,
  Flame
} from "lucide-react";
import UniversalLoader from "@/app/components/UniversalLoader";

function XPBar({ xp, level, color = "from-indigo-500 to-blue-500" }: { xp: number; level: number; color?: string }) {
  const next = level * 100;
  const pct = Math.min(100, Math.round((xp / next) * 100));
  return (
    <div className="space-y-1.5 w-full">
      <div className="relative w-full bg-slate-100 rounded-full h-3 p-[2px] border border-slate-200/50 shadow-inner overflow-hidden">
        <div
          className={`bg-gradient-to-r ${color} h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] relative`}
          style={{ width: `${pct}%` }}
        >
          <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/25 rounded-full animate-[pulse_1.5s_infinite]" />
        </div>
      </div>
      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        <span>{xp} XP earned</span>
        <span>{next - xp} XP to Level {level + 1}</span>
      </div>
    </div>
  );
}

const AVATARS = [
  "/images/avatars/avatar1.svg",
  "/images/avatars/avatar2.svg",
  "/images/avatars/avatar3.svg",
  "/images/avatars/avatar4.svg",
];

const BADGE_THEMES: Record<string, { gradient: string; text: string; bg: string; iconColor: string }> = {
  "First Challenge": {
    gradient: "from-amber-400 to-yellow-500",
    text: "text-amber-800 border-amber-200 bg-amber-50",
    bg: "bg-amber-500/10",
    iconColor: "text-amber-600"
  },
  "3 Day Streak": {
    gradient: "from-orange-500 to-red-500",
    text: "text-orange-800 border-orange-200 bg-orange-50",
    bg: "bg-orange-500/10",
    iconColor: "text-orange-600"
  },
  "7 Day Streak": {
    gradient: "from-rose-500 to-purple-600",
    text: "text-purple-800 border-purple-200 bg-purple-50",
    bg: "bg-purple-500/10",
    iconColor: "text-purple-600"
  },
  "default": {
    gradient: "from-indigo-500 to-blue-600",
    text: "text-indigo-800 border-indigo-200 bg-indigo-50",
    bg: "bg-indigo-500/10",
    iconColor: "text-indigo-600"
  }
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
      } catch (e) {}
    }
    load();
  }, [username]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <UniversalLoader subject="default" customMessage="Loading public profile..." />
      </div>
    );
  }

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Unknown";
  const totalCompleted = user.completedExperiments?.length || 0;

  const getSubjectColor = (subjectName: string) => {
    const name = subjectName.toLowerCase();
    if (name.includes("physics")) return "from-indigo-500 to-blue-500";
    if (name.includes("chemistry")) return "from-amber-500 to-orange-500";
    if (name.includes("biology")) return "from-emerald-500 to-teal-500";
    if (name.includes("computer")) return "from-purple-500 to-pink-500";
    return "from-violet-500 to-indigo-500";
  };

  return (
    <div className="space-y-8 text-slate-800 font-sans">
      
      {/* Profile Header Card */}
      <div className="relative bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-200/80 overflow-hidden">
        
        {/* Banner with modern abstract mesh gradient */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] bg-[size:16px_16px] opacity-40" />
          
          <motion.div 
            className="absolute top-4 right-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"
            animate={{ x: [0, 10, -10, 0], y: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -bottom-10 left-1/4 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"
            animate={{ x: [0, -15, 15, 0], y: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          />
        </div>

        <div className="px-6 sm:px-8 pb-8 relative z-10">
          <div className="relative flex flex-col md:flex-row items-center md:items-end gap-5 -mt-16 mb-5 text-center md:text-left">
            
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl bg-slate-50 overflow-hidden relative mx-auto md:mx-0 ring-1 ring-slate-200/50">
                <img
                  src={user.avatar || AVATARS[0]}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover bg-white"
                />
              </div>
            </div>

            <div className="flex-1 pb-1 space-y-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {user.name}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 self-center md:self-auto max-w-max mx-auto md:mx-0 shadow-sm">
                  <Sparkles size={12} className="text-indigo-600 animate-pulse" />
                  Level {user.level}
                </span>
              </div>
              <p className="text-indigo-600 font-bold text-sm tracking-wide">@{user.username}</p>

              <div className="flex items-center justify-center md:justify-start gap-1.5 pt-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Calendar size={14} className="text-slate-400" /> 
                Joined {joinDate}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-2">
            <p className="text-slate-600 max-w-3xl text-sm leading-relaxed font-medium text-center md:text-left">
              {user.bio || "This scientist is still writing their story..."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left Stats Section */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* Level Card */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-white border border-slate-200/60 rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 select-none relative overflow-hidden shadow-sm"
            >
              <div className="absolute -right-6 -top-6 w-16 h-16 rounded-full bg-indigo-500/5 blur-xl" />
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Zap size={16} />
              </div>
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Level</p>
                <h4 className="text-xl font-black text-slate-800 leading-tight mt-0.5">{user.level}</h4>
              </div>
            </motion.div>

            {/* Streak Card */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-white border border-slate-200/60 rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 select-none relative overflow-hidden shadow-sm"
            >
              <div className="absolute -right-6 -top-6 w-16 h-16 rounded-full bg-orange-500/5 blur-xl" />
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <Flame size={16} />
              </div>
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Streak</p>
                <h4 className="text-xl font-black text-slate-800 leading-tight mt-0.5">{user.streak}</h4>
              </div>
            </motion.div>

            {/* Labs Completed Card */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-white border border-slate-200/60 rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 select-none relative overflow-hidden shadow-sm"
            >
              <div className="absolute -right-6 -top-6 w-16 h-16 rounded-full bg-emerald-500/5 blur-xl" />
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Beaker size={16} />
              </div>
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Labs Done</p>
                <h4 className="text-xl font-black text-slate-800 leading-tight mt-0.5">{totalCompleted}</h4>
              </div>
            </motion.div>

            {/* Total XP Card */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-white border border-slate-200/60 rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 select-none relative overflow-hidden shadow-sm"
            >
              <div className="absolute -right-6 -top-6 w-16 h-16 rounded-full bg-blue-500/5 blur-xl" />
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Trophy size={16} />
              </div>
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Total XP</p>
                <h4 className="text-xl font-black text-slate-800 leading-tight mt-0.5">{user.xp}</h4>
              </div>
            </motion.div>
          </div>

          {/* Subject Mastery Panel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-6 flex-grow">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Beaker className="text-indigo-600" size={18} />
              Subject Mastery
            </h3>

            {(!user.subjectProgress || user.subjectProgress.length === 0) ? (
              <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/60 border-dashed text-xs font-semibold">
                This user hasn't made subject progress yet.
              </div>
            ) : (
              <div className="space-y-6">
                {user.subjectProgress.map((s: any) => {
                  const subColor = getSubjectColor(s.subject);
                  return (
                    <div key={s.subject} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500" style={{ background: `linear-gradient(to right, ${subColor.split(" ")[1]}, ${subColor.split(" ")[3]})` || "" }} />
                          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                            {s.subject === "computerScience" ? "Computer Science" : s.subject}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-500">
                          Level {s.level} • {s.xp} XP
                        </span>
                      </div>
                      <XPBar xp={s.xp} level={s.level} color={subColor} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Trophy Shelf Section */}
        <div className="flex flex-col">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col h-full min-h-[350px]">
            
            <div className="relative z-10 flex flex-col h-full space-y-6">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="text-amber-500" size={18} />
                Trophy Case
              </h3>

              {(!user.badges || user.badges.length === 0) ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center py-8 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                    <Trophy size={24} className="opacity-40" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-650">No Achievements Displayed</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 flex-grow">
                  {user.badges.map((b: any) => {
                    const badgeTheme = BADGE_THEMES[b.name] || BADGE_THEMES.default;
                    return (
                      <motion.div 
                        whileHover={{ y: -2 }}
                        key={b.id} 
                        className="p-3 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center text-center cursor-default group"
                      >
                        <div 
                          className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center bg-gradient-to-tr ${badgeTheme.gradient} shadow-md shadow-indigo-200/5`}
                          style={{ 
                            transformStyle: "preserve-3d",
                            transition: "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "rotateY(360deg)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "rotateY(0deg)";
                          }}
                        >
                          <Award size={20} className="text-white drop-shadow-sm" />
                        </div>
                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-wider leading-snug">
                          {b.name}
                        </span>
                        {b.earnedAt && (
                          <span className="text-[8px] text-slate-450 font-bold uppercase mt-1">
                            {new Date(b.earnedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
