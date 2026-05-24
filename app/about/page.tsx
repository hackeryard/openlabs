"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Beaker, Users, Target, Globe, Sparkles, GraduationCap, Heart, Zap, Terminal, Atom, Trophy, Calculator } from "lucide-react";

/* ---------------- Animations ---------------- */
const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ---------------- Data ---------------- */
const stats = [
  { value: "25+", label: "Virtual Labs", icon: Beaker, color: "text-blue-500", bg: "bg-blue-50" },
  { value: "4", label: "Subjects Covered", icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-50" },
  { value: "100%", label: "Free & Open", icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
  { value: "24/7", label: "Global Access", icon: Globe, color: "text-indigo-500", bg: "bg-indigo-50" },
];

const values = [
  {
    icon: Target,
    title: "Accessible Education",
    description: "Every student deserves hands-on science experience, regardless of their school's lab equipment or budget constraints.",
    gradient: "from-blue-100 to-cyan-50",
    border: "group-hover:border-blue-200",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    icon: Zap,
    title: "Experiential Learning",
    description: "Interactive simulations beat static textbooks. We believe in learning that involves doing, failing, and exploring.",
    gradient: "from-amber-100 to-orange-50",
    border: "group-hover:border-amber-200",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Guidance",
    description: "Our built-in AI assistant helps explain concepts, answers questions, and guides experiments in real-time.",
    gradient: "from-purple-100 to-pink-50",
    border: "group-hover:border-purple-200",
    iconColor: "text-purple-600",
    iconBg: "bg-purple-100",
  },
  {
    icon: Users,
    title: "Always Expanding",
    description: "New labs, subjects, and features ship continuously. From Physics to Computer Science — OpenLabs grows with what students actually need.",
    gradient: "from-emerald-100 to-teal-50",
    border: "group-hover:border-emerald-200",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
  },
];

const team = [
  {
    name: "Rahul Rajput",
    role: "Founder & Lead Developer",
    bio: "\"Technology shouldn't just deliver information; it should deliver experiences. OpenLabs is my attempt to ensure that the thrill of scientific discovery is never gated by geography or funding.\"",
    initials: "RR",
    gradient: "from-indigo-600 to-cyan-500",
  },
  {
    name: "Aditya",
    role: "Core Team Member",
    bio: "\"Design isn't just how it looks — it's how it works. Every interaction on OpenLabs is crafted to feel effortless, so students focus on the science, not the interface.\"",
    initials: "AD",
    gradient: "from-blue-600 to-teal-500",
  },
  {
    name: "Azhruddin Khan",
    role: "Core Team Member",
    bio: "\"Performance is a feature. Whether you're on a flagship phone or a budget laptop in a school lab, the simulations should run without compromise.\"",
    initials: "AK",
    gradient: "from-emerald-600 to-emerald-400",
  },
  {
    name: "Anshika Gaur",
    role: "Core Team Member",
    bio: "\"Science education fails when accuracy fails. Every virtual experiment on OpenLabs is grounded in real principles — if the numbers don't match the textbook, we fix it.\"",
    initials: "AG",
    gradient: "from-purple-600 to-pink-500",
  }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Light Cinematic Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-slate-200/60 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/80 via-white to-white" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-100/50 rounded-[100%] blur-[120px] mix-blend-multiply pointer-events-none" />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.03] invert" />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-slate-900">
              Brilliant Minds<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500">
                Shouldn't Be Limited By Hardware
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              OpenLabs gives every student access to high-fidelity virtual labs — no equipment, no budget, no limits. Just pure scientific discovery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Floating Stats Bar */}
      <section className="relative z-20 -mt-12 max-w-5xl mx-auto px-6 sm:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 text-center shadow-lg shadow-slate-200/50"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* The Story & Mission */}
      <section className="py-32 relative overflow-hidden bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Our Origin Story</h2>
                <div className="h-1.5 w-20 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full" />
              </div>

              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>
                  OpenLabs was born from a simple, frustrating observation: millions of brilliant students worldwide study advanced science from static textbooks without ever touching real lab equipment.
                </p>
                <p>
                  Not because they lack curiosity, but simply because their schools lack resources. The gap between theory and practice was too wide.
                </p>
                <p>
                  We set out to change that. OpenLabs provides free, browser-based, high-fidelity virtual labs covering Physics, Chemistry, Biology, and Computer Science. You don&apos;t just read about Hooke&apos;s Law—you build the mass-spring system, measure the oscillations, and see the math come alive.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200/50 to-purple-200/50 blur-3xl rounded-full" />
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white/60 backdrop-blur-md p-8 shadow-xl shadow-indigo-100/50 space-y-4">
                {[
                  { subject: "Physics Labs", count: "10", color: "bg-blue-500" },
                  { subject: "Chemistry Labs", count: "4", color: "bg-emerald-500" },
                  { subject: "Biology Labs", count: "3", color: "bg-rose-500" },
                  { subject: "Computer Science Labs", count: "10+", color: "bg-indigo-500" },
                ].map((s) => (
                  <div key={s.subject} className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                      <span className="text-slate-700 font-medium">{s.subject}</span>
                    </div>
                    <span className="text-2xl font-black text-slate-900">{s.count}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Principles Grid */}
      <section className="py-24 bg-white border-y border-slate-200/60 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Core Principles</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">The foundational ideas that drive every feature we build.</p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={container}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={item}
                className={`group relative bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 overflow-hidden transition-all duration-500 hover:-translate-y-1`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${v.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute inset-0 border-2 border-transparent ${v.border} rounded-3xl transition-colors duration-500 pointer-events-none`} />

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl ${v.iconBg} border border-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                    <v.icon className={`w-6 h-6 ${v.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{v.title}</h3>
                  <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
                    {v.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What's Coming */}
      <section className="bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="px-8 py-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-10 tracking-tight">
              What's Coming to OpenLabs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  Icon: Calculator,
                  title: "Mathematics Labs",
                  description: "Interactive algebra, calculus, and geometry labs — the next full subject coming to OpenLabs.",
                  color: "bg-emerald-50 border-emerald-100",
                  iconColor: "text-emerald-600",
                  iconBg: "bg-emerald-100",
                },
                {
                  Icon: Users,
                  title: "Collaborative Labs",
                  description: "Run experiments together in real-time. Share parameters, compare results, learn as a team.",
                  color: "bg-blue-50 border-blue-100",
                  iconColor: "text-blue-600",
                  iconBg: "bg-blue-100",
                },
                {
                  Icon: GraduationCap,
                  title: "Lab Certificates",
                  description: "Complete subject tracks and earn verifiable certificates to showcase your science skills.",
                  color: "bg-purple-50 border-purple-100",
                  iconColor: "text-purple-600",
                  iconBg: "bg-purple-100",
                },
              ].map((item) => (
                <div key={item.title} className={`rounded-2xl border p-6 ${item.color}`}>
                  <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center mb-4`}>
                    <item.Icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Founder / Team */}
      <section className="py-32 relative bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Meet the Team</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">The minds building the future of interactive science education.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={container}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member) => (
              <motion.div key={member.name} variants={item} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 flex flex-col h-full group">
                <div className="relative inline-block mb-6 mx-auto group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-indigo-100 blur-xl rounded-full" />
                  <div className="relative w-20 h-20 mx-auto rounded-full border-[3px] border-white bg-slate-50 flex items-center justify-center overflow-hidden shadow-md">
                    <span className={`text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br ${member.gradient}`}>{member.initials}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-indigo-600 font-bold tracking-wider uppercase text-xs mb-4">{member.role}</p>

                <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-grow italic">
                  {member.bio}
                </p>

                {/* <div className="flex justify-center gap-3 mt-auto">
                  <button className="px-4 py-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors">
                    GitHub
                  </button>
                  <button className="px-4 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors">
                    Twitter
                  </button>
                </div> */}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
