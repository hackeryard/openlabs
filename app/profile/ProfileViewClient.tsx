"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { analyticsService } from "@/lib/analytics";
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
  Clock,
  CheckCircle2,
  Flame,
  Trophy,
  Sparkles,
  BookOpen,
  Camera,
  ChevronRight,
  Compass,
  GraduationCap,
  Microscope
} from "lucide-react";

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
      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
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
    physics: { stroke: "stroke-indigo-500", border: "hover:border-indigo-400/50", shadow: "hover:shadow-indigo-500/20", text: "text-indigo-600", bg: "bg-indigo-50/50" },
    chemistry: { stroke: "stroke-amber-500", border: "hover:border-amber-400/50", shadow: "hover:shadow-amber-500/20", text: "text-amber-600", bg: "bg-amber-50/50" },
    biology: { stroke: "stroke-emerald-500", border: "hover:border-emerald-400/50", shadow: "hover:shadow-emerald-500/20", text: "text-emerald-600", bg: "bg-emerald-50/50" },
    computerScience: { stroke: "stroke-purple-500", border: "hover:border-purple-400/50", shadow: "hover:shadow-purple-500/20", text: "text-purple-600", bg: "bg-purple-50/50" },
    mathematics: { stroke: "stroke-cyan-500", border: "hover:border-cyan-400/50", shadow: "hover:shadow-cyan-500/20", text: "text-cyan-600", bg: "bg-cyan-50/50" }
  };

  const theme = colorMap[subject] || colorMap.physics;
  const displayName = subject === "computerScience" ? "Comp Sci" : subject;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`bg-white/60 backdrop-blur-md border border-white/80 rounded-3xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${theme.border} ${theme.shadow}`}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-transparent to-${theme.bg.split('-')[1]}-50/50`} />

      <div className="relative w-20 h-20 flex items-center justify-center mb-2">
        <svg className="w-full h-full -rotate-90 drop-shadow-sm">
          <circle cx="40" cy="40" r={radius} className="stroke-slate-100" strokeWidth="6" fill="transparent" />
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
        <span className="absolute text-sm font-black text-slate-700">
          {pct}%
        </span>
      </div>

      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mt-2 truncate w-full px-1 relative z-10">
        {displayName}
      </h4>
      <span className="text-[10px] font-bold text-slate-500 mt-1 relative z-10">
        LVL {level} <span className="opacity-40 px-1">•</span> {xp} XP
      </span>
    </motion.div>
  );
}

function ActivityAreaChart({ activityLog }: { activityLog: any[] }) {
  const data = (activityLog || []).slice(-7);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50/50 border border-slate-200/60 border-dashed rounded-3xl text-sm font-semibold">
        <Activity className="mb-3 opacity-20" size={32} />
        No lab activity recorded this week yet.
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 5);
  const width = 500;
  const height = 140;
  const paddingX = 30;
  const paddingY = 20;
  const chartWidth = width - 2 * paddingX;
  const chartHeight = height - 2 * paddingY;

  const points = data.map((day, i) => {
    const x = paddingX + (i * chartWidth) / (data.length - 1 || 1);
    const y = height - paddingY - (day.count / maxCount) * chartHeight;
    return { x, y, count: day.count, date: day.date };
  });

  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX1 = p0.x + (p1.x - p0.x) / 2;
    const cpY1 = p0.y;
    const cpX2 = p0.x + (p1.x - p0.x) / 2;
    const cpY2 = p1.y;
    linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
  }

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="w-full bg-slate-900/[0.02] border border-white/60 rounded-3xl p-6 relative overflow-hidden group">
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-indigo-500 font-black block mb-1">
            Weekly Throughput
          </span>
          <span className="text-sm text-slate-600 font-semibold">Activity trends over 7 days</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
          <Flame size={14} className="text-orange-500" />
          <span className="text-xs font-bold text-slate-700">
            Peak: {maxCount} / day
          </span>
        </div>
      </div>

      <div className="relative w-full h-[140px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {[0, 0.33, 0.66, 1].map((val, i) => {
            const y = paddingY + val * chartHeight;
            return (
              <line key={i} x1={paddingX} y1={y} x2={width - paddingX} y2={y} className="stroke-slate-200" strokeWidth="1" strokeDasharray="4 4" />
            );
          })}

          <motion.path
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            d={areaPath}
            fill="url(#areaGradient)"
          />

          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {points.map((p, i) => {
            let label = "";
            try {
              const dateObj = new Date(p.date);
              label = dateObj.toLocaleDateString("en-US", { weekday: "short" });
            } catch {
              label = p.date;
            }
            return (
              <motion.g
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + (i * 0.1), type: "spring" }}
                className="group/point cursor-crosshair"
              >
                <circle cx={p.x} cy={p.y} r="12" className="fill-indigo-500/10 opacity-0 group-hover/point:opacity-100 transition-opacity duration-300" />
                <circle cx={p.x} cy={p.y} r="5" className="fill-white stroke-indigo-500 stroke-[3] group-hover/point:scale-125 transition-transform duration-300" />

                <text x={p.x} y={p.y - 16} textAnchor="middle" className="fill-slate-800 text-[10px] font-black opacity-0 group-hover/point:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover/point:translate-y-0">
                  {p.count}
                </text>

                <text x={p.x} y={height - 2} textAnchor="middle" className="fill-slate-400 text-[9px] font-bold uppercase tracking-widest select-none">
                  {label}
                </text>
              </motion.g>
            );
          })}
        </svg>
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
  "First Challenge": { gradient: "from-amber-300 via-yellow-400 to-amber-500", text: "text-amber-800", bg: "bg-amber-50", iconColor: "text-amber-600" },
  "3 Day Streak": { gradient: "from-orange-400 via-red-500 to-rose-600", text: "text-orange-800", bg: "bg-orange-50", iconColor: "text-orange-600" },
  "7 Day Streak": { gradient: "from-fuchsia-500 via-purple-500 to-indigo-600", text: "text-purple-800", bg: "bg-purple-50", iconColor: "text-purple-600" },
  "default": { gradient: "from-indigo-400 via-blue-500 to-cyan-500", text: "text-indigo-800", bg: "bg-indigo-50", iconColor: "text-indigo-600" }
};

export default function ProfileViewClient() {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", bio: "", avatar: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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
      setForm({ username: user.username || "", bio: user.bio || "", avatar: user.avatar || AVATARS[0] });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-purple-500 animate-spin animate-reverse"></div>
          <Microscope className="absolute inset-0 m-auto text-indigo-400 opacity-50" size={24} />
        </div>
        <p className="text-sm font-bold text-slate-400 animate-pulse tracking-widest uppercase">Initializing Workspace...</p>
      </div>
    );
  }

  const handleSave = async () => {
    setError("");
    const raw = (form.username || "").toLowerCase().trim();
    const payload: any = {};
    if (raw && raw !== (user.username || "")) payload.username = raw;
    if ((form.bio || "") !== (user.bio || "")) payload.bio = form.bio;
    if (form.avatar && form.avatar !== user.avatar) {
      payload.avatar = form.avatar;
      payload.replaceAvatar = true;
    }

    if (Object.keys(payload).length === 0) return setEditing(false);

    setSaving(true);
    try {
      const res = await fetch("/api/profile/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setUser(data.user);
      setEditing(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Unknown";
  const totalCompleted = user.completedExperiments?.length || 0;
  const dailyCompleted = user.dailyChallenges?.filter((c: any) => c.completed).length || 0;

  const getRankTitle = (xp: number) => {
    if (xp < 500) return "Junior Apprentice";
    if (xp < 1500) return "Research Assistant";
    if (xp < 3000) return "Lab Fellow";
    if (xp < 6000) return "Senior Investigator";
    return "Chief Laboratory Officer";
  };
  const rank = getRankTitle(user.xp || 0);

  return (
    <div className="min-h-screen bg-[#fafcff] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-slate-50 font-sans relative overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">

      {/* Background Animated Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-indigo-400/10 blur-[100px] mix-blend-multiply pointer-events-none animate-[pulse_8s_infinite]" />
      <div className="absolute bottom-20 right-1/4 w-[30rem] h-[30rem] rounded-full bg-purple-400/10 blur-[120px] mix-blend-multiply pointer-events-none animate-[pulse_10s_infinite_reverse]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto pb-24 px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12 relative z-10"
      >

        {/* --- Profile Header Glass Card --- */}
        <motion.div variants={itemVariants} className="relative bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/80 shadow-[0_8px_40px_rgb(0,0,0,0.03)] overflow-hidden mb-8 group/card">

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
              <div className="relative group cursor-pointer" onClick={() => !editing && setEditing(true)}>
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 rounded-[2.5rem] blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-500" />
                <div className="w-36 h-36 rounded-[2rem] border-4 border-white/90 shadow-2xl bg-white overflow-hidden relative mx-auto md:mx-0 backdrop-blur-sm transform group-hover:scale-[1.02] transition-transform duration-300">
                  <img
                    key={editing ? form.avatar : user.avatar}
                    src={editing ? form.avatar : user.avatar || AVATARS[0]}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                  {!editing && (
                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <Camera className="text-white w-6 h-6 drop-shadow-lg" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 pb-3 w-full space-y-2">
                {!editing ? (
                  <>
                    <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                      <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        {user.name}
                      </h2>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20 self-center md:self-auto">
                        <Sparkles size={12} className="text-indigo-100 animate-pulse" />
                        Scientist Lvl {user.level}
                      </span>
                    </div>
                    <p className="text-indigo-600 font-bold text-sm tracking-wide">@{user.username || "unnamed"}</p>

                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-start gap-4 pt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/50">
                        <Mail size={14} className="text-slate-400" /> {user.email}
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/50">
                        <Calendar size={14} className="text-slate-400" /> Joined {joinDate}
                      </span>
                    </div>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm mx-auto md:mx-0 pt-3 space-y-2">
                    <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block text-left">Your Username</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm select-none">@</span>
                      <input
                        className="block w-full pl-8 pr-4 py-2.5 text-sm font-bold border border-slate-200/80 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all bg-white shadow-sm text-slate-800"
                        value={form.username}
                        placeholder="Username"
                        onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pb-3 w-full md:w-auto justify-center">
                {!editing ? (
                  <>
                    <button onClick={() => setEditing(true)} className="flex items-center justify-center w-12 h-12 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl transition-all shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-0.5 duration-200 group">
                      <Edit2 size={18} className="group-hover:text-indigo-600 transition-colors" />
                    </button>
                    <button onClick={() => {
                      analyticsService.trackLogoutCompleted();
                      fetch("/api/auth/logout", { method: "POST" }).then(() => router.push("/"));
                    }} className="flex items-center justify-center w-12 h-12 bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-500 hover:text-rose-600 rounded-2xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200 group">
                      <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all disabled:opacity-50 text-xs tracking-wider uppercase active:scale-[0.98]">
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button onClick={() => setEditing(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-xs tracking-wider uppercase active:scale-[0.98]">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!editing ? (
                <motion.div
                  key="bio"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-slate-200/50 pt-6 mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="flex-1">
                    <p className="text-slate-600 max-w-3xl text-sm leading-relaxed font-medium text-center md:text-left bg-white/40 p-4 rounded-2xl border border-white/60">
                      {user.bio || "No bio yet. Define your research goals and tell the lab about your scientific journey!"}
                    </p>
                  </div>

                  {/* Rank Status Badge */}
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/80 rounded-2xl px-5 py-3.5 flex items-center gap-4 shrink-0 self-center lg:self-auto shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-white border border-indigo-100 shadow-sm flex items-center justify-center text-indigo-600">
                      <Microscope size={20} />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-indigo-400 font-black block mb-0.5">Current Rank</span>
                      <span className="text-sm font-black text-slate-800 tracking-tight">{rank}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 mt-4 border-t border-slate-200/50 pt-8"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-left">About Your Research</label>
                    <textarea
                      className="w-full rounded-2xl border-slate-200 border p-4 text-sm font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-700 bg-white/80 shadow-inner"
                      rows={3}
                      value={form.bio}
                      onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
                      placeholder="Share your academic goals and interests..."
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 text-left">Select ID Badge Avatar</label>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      {AVATARS.map((path) => (
                        <button
                          key={path}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, avatar: path }))}
                          className={`relative w-20 h-20 rounded-[1.25rem] overflow-hidden border-[3px] transition-all duration-300 hover:scale-105 active:scale-95 bg-white p-1.5 ${form.avatar === path
                            ? "border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105 ring-4 ring-indigo-500/10"
                            : "border-slate-200 hover:border-slate-300 opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
                            }`}
                        >
                          <img src={path} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
                        </button>
                      ))}
                    </div>
                  </div>
                  {error && <p className="text-rose-600 text-xs font-bold bg-rose-50 border border-rose-200 p-4 rounded-xl">{error}</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* --- Main Dashboard Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">

          {/* LEFT COLUMN (2/3 width) */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8 flex flex-col">

            {/* Top Level KPIs */}
            <motion.div variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">

              <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md border border-white/80 rounded-3xl p-5 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(99,102,241,0.12)] group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap size={22} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{user.level}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Current Level</p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md border border-white/80 rounded-3xl p-5 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(249,115,22,0.12)] group">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Flame size={22} />
                </div>
                <div>
                  <h4 className="text-3xl font-black text-slate-800 tracking-tighter">
                    {user.streak} <span className="text-sm text-slate-400 font-bold tracking-normal">day</span>
                  </h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Lab Streak</p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md border border-white/80 rounded-3xl p-5 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)] group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Beaker size={22} />
                </div>
                <div>
                  <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{totalCompleted}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Simulations</p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md border border-white/80 rounded-3xl p-5 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(59,130,246,0.12)] group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Trophy size={22} />
                </div>
                <div>
                  <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{user.xp}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Total XP</p>
                </div>
              </motion.div>

            </motion.div>

            {/* Subject Mastery Panel */}
            <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-8 flex-grow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <Compass size={20} />
                  </div>
                  Core Mastery
                </h3>
              </div>

              {(!user.subjectProgress || user.subjectProgress.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50/50 rounded-3xl border border-slate-200/60 border-dashed text-sm font-semibold">
                  <BookOpen className="mb-3 opacity-20" size={32} />
                  Initialize virtual labs to map your mastery.
                </div>
              ) : (
                <motion.div variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                  {user.subjectProgress.map((s: any) => (
                    <SubjectMasteryCircle key={s.subject} subject={s.subject} xp={s.xp} level={s.level} />
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Recent Log */}
            <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={20} />
                  </div>
                  Experiment Log
                </h3>
                <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
                  View Archive <ChevronRight size={14} />
                </button>
              </div>

              {(!user.completedExperiments || user.completedExperiments.length === 0) ? (
                <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-3xl border border-slate-200/60 border-dashed text-sm font-semibold">
                  No simulations logged. Step into the lab.
                </div>
              ) : (
                <div className="space-y-3">
                  {user.completedExperiments.slice(0, 5).map((exp: any, idx: number) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.01, x: 4 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-500/5 transition-all gap-4 group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1rem] bg-slate-50 text-slate-500 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <Beaker size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 capitalize text-sm tracking-wide">
                            {exp.experimentId?.replace(/-/g, " ")}
                          </p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                            <span className="text-indigo-600">{exp.subject === "computerScience" ? "Comp Sci" : exp.subject}</span>
                            <span className="opacity-30">•</span>
                            <span>{new Date(exp.completedAt).toLocaleDateString()}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right shrink-0 pl-16 sm:pl-0">
                        <span className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 font-black text-xs rounded-full shadow-sm">
                          +{exp.xpEarned || 0} XP
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

          </div>

          {/* RIGHT COLUMN (1/3 width) */}
          <div className="space-y-6 lg:space-y-8 flex flex-col">

            {/* Achievements */}
            <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative overflow-hidden flex flex-col min-h-[420px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-[40px] pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full space-y-6">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-500">
                    <Award size={20} />
                  </div>
                  Badges
                </h3>

                {(!user.badges || user.badges.length === 0) ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-center py-10 space-y-4">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300">
                      <Award size={28} />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-sm font-bold text-slate-700">No Badges Yet</p>
                      <p className="text-[11px] font-medium text-slate-500 max-w-[200px] leading-relaxed mx-auto">
                        Complete your first lab module to start earning achievements.
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
                          className="p-5 rounded-[1.25rem] bg-white border border-slate-100 hover:border-slate-300 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group cursor-crosshair relative overflow-hidden"
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
                          <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide leading-snug">
                            {b.name}
                          </span>
                          {b.earnedAt && (
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
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

            {/* Next Milestone (Replacing simplistic Daily challenge UI with something cooler) */}
            <motion.div variants={itemVariants} className="bg-slate-900 rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-indigo-900/10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-indigo-500/20 to-transparent pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/30 rounded-full blur-[40px] group-hover:bg-purple-400/40 transition-colors duration-700" />

              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/10 text-white backdrop-blur-sm">
                    <Target size={20} />
                  </div>
                  <h3 className="text-base font-bold tracking-wide">Daily Targets</h3>
                </div>

                <div className="flex items-end justify-between border-b border-white/10 pb-5">
                  <div>
                    <h4 className="font-black text-4xl tracking-tighter">{dailyCompleted}</h4>
                    <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mt-1">Challenges Cleared</p>
                  </div>
                </div>

                <XPBar xp={user.xp} level={user.level} color="from-indigo-400 via-purple-400 to-pink-400" />
              </div>
            </motion.div>

            {/* Activity Chart */}
            <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-5">
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Activity size={20} />
                </div>
                Throughput
              </h3>
              <ActivityAreaChart activityLog={user.activityLog} />
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}