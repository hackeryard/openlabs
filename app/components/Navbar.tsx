"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ChevronDown,
  Atom,
  Flame,
  Dna,
  Binary,
  Calculator,
  ArrowRight,
  Sparkles,
  Trophy,
  Compass,
  Menu,
  X,
  Beaker,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/components/AuthProvider";
import AdminNavbar from "./AdminNavbar";

/* ---------------- Animations ---------------- */

const menuVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 6,
    scale: 0.97,
    transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
  },
};

/* ---------------- Lab Categories Data ---------------- */

interface QuickLink {
  name: string;
  path: string;
}

interface LabCategory {
  label: string;
  path: string;
  count: string;
  description: string;
  icon: typeof Atom;
  colorClass: string;
  iconBgClass: string;
  highlights: QuickLink[];
}

const labCategories: LabCategory[] = [
  {
    label: "Physics",
    path: "/physics",
    count: "16 Labs",
    description: "Mechanics, circuits, optics & waves",
    icon: Atom,
    colorClass: "text-blue-600 dark:text-blue-400 group-hover/cat:text-blue-700 dark:group-hover/cat:text-blue-300",
    iconBgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover/cat:bg-blue-500 group-hover/cat:text-white",
    highlights: [
      { name: "Doppler Effect", path: "/physics/doppler-effect" },
      { name: "Kepler Orbit", path: "/physics/kepler-orbit" },
      { name: "Free Fall", path: "/physics/freefall" },
      { name: "Faraday's Law", path: "/physics/faradays-law" },
    ],
  },
  {
    label: "Chemistry",
    path: "/chemistry",
    count: "12 Labs",
    description: "Periodic table, bonds & titration",
    icon: Flame,
    colorClass: "text-emerald-600 dark:text-emerald-400 group-hover/cat:text-emerald-700 dark:group-hover/cat:text-emerald-300",
    iconBgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover/cat:bg-emerald-500 group-hover/cat:text-white",
    highlights: [
      { name: "Periodic Table", path: "/chemistry/periodictable" },
      { name: "Chemical Bonds", path: "/chemistry/chemicalbonds" },
      { name: "Reaction Simulator", path: "/chemistry/reaction-simulation" },
      { name: "Titration Lab", path: "/chemistry/titration" },
    ],
  },
  {
    label: "Biology",
    path: "/biology",
    count: "13 Labs",
    description: "Cell biology, 3D anatomy & genetics",
    icon: Dna,
    colorClass: "text-rose-600 dark:text-rose-400 group-hover/cat:text-rose-700 dark:group-hover/cat:text-rose-300",
    iconBgClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover/cat:bg-rose-500 group-hover/cat:text-white",
    highlights: [
      { name: "Genetics Lab", path: "/biology/genetics" },
      { name: "Animal Cell", path: "/biology/cell/animal" },
      { name: "Photosynthesis", path: "/biology/photosynthesis" },
      { name: "Human Anatomy", path: "/biology/human" },
    ],
  },
  {
    label: "Mathematics",
    path: "/mathematics",
    count: "13 Labs",
    description: "Calculus, graphing & linear algebra",
    icon: Calculator,
    colorClass: "text-amber-600 dark:text-amber-400 group-hover/cat:text-amber-700 dark:group-hover/cat:text-amber-300",
    iconBgClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover/cat:bg-amber-500 group-hover/cat:text-white",
    highlights: [
      { name: "Function Grapher", path: "/mathematics/functiongrapher" },
      { name: "Calculus Sandbox", path: "/mathematics/calculus" },
      { name: "Linear Algebra", path: "/mathematics/linear-algebra" },
      { name: "Trigonometry", path: "/mathematics/trigonometry" },
    ],
  },
  {
    label: "Computer Science",
    path: "/computer-science",
    count: "42 Labs",
    description: "Algorithms, logic gates & AI",
    icon: Binary,
    colorClass: "text-purple-600 dark:text-purple-400 group-hover/cat:text-purple-700 dark:group-hover/cat:text-purple-300",
    iconBgClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover/cat:bg-purple-500 group-hover/cat:text-white",
    highlights: [
      { name: "HTML/CSS/JS Lab", path: "/computer-science/code-lab/html-css-js" },
      { name: "Logic Gates", path: "/computer-science/logic-gates" },
      { name: "DSA Algorithms", path: "/computer-science/dsa" },
      { name: "Networking Studio", path: "/computer-science/networking" },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [labsOpen, setLabsOpen] = useState(false);
  const [mobileLabsOpen, setMobileLabsOpen] = useState(false);
  const { user } = useAuth();

  const pathname = usePathname();
  const labsRef = useRef<HTMLLIElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- Top-level nav links ---------------- */

  const topLinks = [
    { label: "Tracks", path: "/tracks" },
    { label: "Leaderboard", path: "/leaderboard" },
    { label: "Blog", path: "/blog" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  /* ---------------- Hover handlers with grace timeout ---------------- */

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setLabsOpen(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setLabsOpen(false);
    }, 180);
  };

  /* ---------------- Cleanup timeout on unmount ---------------- */

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  /* ---------------- Close Labs dropdown on outside click ---------------- */

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (labsRef.current && !labsRef.current.contains(e.target as Node)) {
        setLabsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- Close mobile menu on navigation ---------------- */

  useEffect(() => {
    setMobileOpen(false);
    setLabsOpen(false);
    setMobileLabsOpen(false);
  }, [pathname]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------------- Helpers ---------------- */

  const isSubdomain = mounted && typeof window !== "undefined" && window.location.hostname.startsWith("admin.");
  const hasAdminOrModRole = mounted && (user?.role === "admin" || user?.role === "moderator");
  const isAdminRoute = mounted && (pathname.startsWith("/admin") || isSubdomain) && pathname !== "/403" && hasAdminOrModRole;

  if (isAdminRoute) {
    return <AdminNavbar />;
  }

  // If on 403 page on admin subdomain, hide navbar entirely
  if (mounted && pathname === "/403" && isSubdomain) {
    return null;
  }

  const isLabsActive =
    labCategories.some((c) => pathname.startsWith(c.path)) ||
    pathname.startsWith("/labs");

  return (
    <>
      <nav
        data-site-navbar
        className="
          fixed top-0 left-0 w-full
          bg-background/85 backdrop-blur-xl
          text-foreground
          border-b border-border/80
          py-2.5
          z-50
          shadow-xs
          transition-colors duration-200
        "
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* ---------------- Logo ---------------- */}

          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/images/logo.png"
              alt="OpenLabs logo"
              width={34}
              height={34}
              className="w-8 h-8 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-foreground">
                OpenLabs
              </span>
            </div>
          </Link>

          {/* ---------------- Desktop Navigation ---------------- */}

          <ul className="hidden lg:flex items-center gap-1">
            {/* Home */}
            <li className="flex items-center">
              <Link
                href="/"
                className={`
                  h-8 inline-flex items-center justify-center px-3 rounded-lg transition-colors text-xs font-semibold leading-none
                  ${pathname === "/" ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:text-foreground hover:bg-accent/60"}
                `}
              >
                Home
              </Link>
            </li>

            {/* Labs Mega Dropdown */}
            <li
              ref={labsRef}
              className="relative flex items-center"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setLabsOpen((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setLabsOpen(false);
                }}
                aria-expanded={labsOpen}
                aria-haspopup="menu"
                className={`
                  h-8 inline-flex items-center justify-center gap-1.5 px-3 rounded-lg transition-colors text-xs font-semibold leading-none
                  ${isLabsActive ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:text-foreground hover:bg-accent/60"}
                `}
              >
                <span>Virtual Labs</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${labsOpen ? "rotate-180 text-primary" : ""}`}
                />
              </button>

              <AnimatePresence>
                {labsOpen && (
                  <motion.div
                    role="menu"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="
                      absolute top-full -left-52 lg:-left-56 mt-2
                      w-[680px] max-w-[calc(100vw-2.5rem)]
                      bg-card/95 backdrop-blur-2xl text-foreground
                      rounded-2xl
                      shadow-2xl
                      border border-border
                      overflow-hidden
                      z-50
                      ring-1 ring-black/5 dark:ring-white/10
                    "
                  >
                    {/* Header bar */}
                    <div className="px-4 py-2.5 bg-muted/40 border-b border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-primary" />
                        <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                          Explore Interactive STEM Suites
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-xs">
                        96 Simulations
                      </span>
                    </div>

                    {/* 5 Disciplines Grid + Quests Card */}
                    <div className="p-3.5 grid grid-cols-2 gap-2.5">
                      {labCategories.map((cat) => {
                        const Icon = cat.icon;
                        const isCatActive = pathname.startsWith(cat.path);

                        return (
                          <div
                            key={cat.path}
                            className={`
                              group/cat p-2.5 rounded-xl border transition-all duration-200
                              ${isCatActive
                                ? "bg-accent/80 border-primary/40 shadow-xs"
                                : "bg-background/40 hover:bg-accent/60 border-border hover:border-border/80"
                              }
                            `}
                          >
                            {/* Category Header Link */}
                            <Link
                              href={cat.path}
                              onClick={() => setLabsOpen(false)}
                              className="flex items-start gap-2.5 group/link"
                            >
                              <div
                                className={`
                                  w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                                  transition-all duration-200 group-hover/cat:scale-105
                                  ${cat.iconBgClass}
                                `}
                              >
                                <Icon className="w-4 h-4 transition-transform duration-200" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4
                                    className={`
                                      text-xs font-bold tracking-tight transition-colors duration-150 flex items-center gap-1.5
                                      ${cat.colorClass}
                                    `}
                                  >
                                    <span>{cat.label}</span>
                                    <span className="text-[10px] font-normal text-muted-foreground">({cat.count})</span>
                                  </h4>
                                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 -translate-x-1 group-hover/cat:opacity-100 group-hover/cat:translate-x-0 transition-all duration-200" />
                                </div>
                                <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                                  {cat.description}
                                </p>
                              </div>
                            </Link>

                            {/* Popular Quick Links */}
                            <div className="mt-2 pt-1.5 border-t border-border/50 flex flex-wrap gap-1">
                              {cat.highlights.map((item) => (
                                <Link
                                  key={item.path}
                                  href={item.path}
                                  onClick={() => setLabsOpen(false)}
                                  className="
                                    text-[10px] font-medium px-1.5 py-0.5 rounded
                                    bg-muted/70 hover:bg-primary/10 hover:text-primary
                                    text-muted-foreground transition-colors
                                  "
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      {/* 6th Slot: Quests & Leaderboard */}
                      <div className="p-2.5 rounded-xl border border-border bg-gradient-to-br from-indigo-500/10 via-sky-500/5 to-transparent flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                              <Trophy className="w-3.5 h-3.5" />
                            </div>
                            <h4 className="text-xs font-bold text-foreground">
                              Quests & XP Hub
                            </h4>
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">
                            Solve daily challenges, earn experiment badges & level up.
                          </p>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Link
                            href="/leaderboard"
                            onClick={() => setLabsOpen(false)}
                            className="
                              inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg
                              bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs transition
                            "
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Leaderboard</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Footer Bar */}
                    <div className="px-4 py-2 bg-muted/60 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        In-browser simulations &bull; Zero install
                      </span>
                      <Link
                        href="/#labs"
                        onClick={() => setLabsOpen(false)}
                        className="font-bold text-primary hover:underline flex items-center gap-1 group/all"
                      >
                        <span>Explore All 96 Labs</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/all:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Top Links: Leaderboard, Blog, About, Contact */}
            {topLinks.map((link) => (
              <li key={link.label} className="flex items-center">
                <Link
                  href={link.path}
                  className={`
                    h-8 inline-flex items-center justify-center px-3 rounded-lg transition-colors text-xs font-semibold leading-none
                    ${pathname === link.path ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:text-foreground hover:bg-accent/60"}
                  `}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ---------------- Right Action Suite (Auth + Theme Toggle) ---------------- */}

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle className="bg-muted hover:bg-accent border border-border/70 text-foreground" />

            {/* Auth Buttons */}
            {!user ? (
              <div className="hidden sm:flex items-center gap-1.5 pl-1">
                <Link
                  href="/login"
                  className="
                    px-3.5 py-1.5 rounded-xl
                    bg-primary text-primary-foreground
                    font-bold text-xs
                    shadow-xs
                    hover:bg-primary/90
                    transition-all hover:scale-[1.02] active:scale-95
                  "
                >
                  Log In
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 pl-1">
                <Link
                  href="/profile"
                  className="
                    flex items-center gap-2
                    p-1 rounded-full
                    hover:bg-accent
                    transition
                  "
                  title={`${user.name || "User"} Profile`}
                >
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="User profile"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                      {user.name?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4" />}
                    </div>
                  )}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileOpen((v) => !v)}
              className="
                lg:hidden p-2 rounded-xl
                bg-muted border border-border/70 text-foreground
                hover:bg-accent transition
              "
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ---------------- Mobile Dropdown Navigation ---------------- */}

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="
                lg:hidden
                absolute top-[58px] right-4 left-4
                bg-card/95 backdrop-blur-2xl text-foreground
                rounded-2xl
                shadow-2xl
                border border-border
                overflow-hidden
                z-50
                max-h-[calc(100vh-80px)]
                overflow-y-auto
                thin-scrollbar
              "
            >
              <ul id="mobile-navigation" className="p-3 space-y-1 text-xs font-semibold">
                {/* Home */}
                <li>
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className={`
                      block px-3.5 py-2.5 rounded-xl transition
                      ${pathname === "/" ? "bg-primary/10 text-primary font-bold" : "hover:bg-accent"}
                    `}
                  >
                    Home
                  </Link>
                </li>

                {/* Labs Accordion */}
                <li>
                  <button
                    onClick={() => setMobileLabsOpen((v) => !v)}
                    aria-expanded={mobileLabsOpen}
                    aria-controls="mobile-labs-menu"
                    className={`
                      w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition
                      ${isLabsActive ? "bg-primary/10 text-primary font-bold" : "hover:bg-accent"}
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-primary" />
                      <span>Virtual Labs & Simulations</span>
                    </span>
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${mobileLabsOpen ? "rotate-180 text-primary" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileLabsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        id="mobile-labs-menu"
                        className="overflow-hidden"
                      >
                        <div className="pl-3 pr-1 py-1.5 space-y-1.5">
                          {labCategories.map((cat) => {
                            const Icon = cat.icon;
                            return (
                              <div
                                key={cat.path}
                                className="p-2 rounded-xl bg-muted/40 border border-border/60"
                              >
                                <Link
                                  href={cat.path}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-lg ${cat.iconBgClass}`}>
                                      <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-bold text-foreground">
                                      {cat.label}
                                    </span>
                                  </div>
                                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                </Link>

                                <div className="mt-2 flex flex-wrap gap-1 pl-7">
                                  {cat.highlights.map((item) => (
                                    <Link
                                      key={item.path}
                                      href={item.path}
                                      onClick={() => setMobileOpen(false)}
                                      className="
                                        text-[10px] px-2 py-0.5 rounded-md
                                        bg-card text-muted-foreground hover:text-primary
                                        border border-border/40
                                      "
                                    >
                                      {item.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>

                {/* Top links */}
                {topLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`
                        block px-3.5 py-2.5 rounded-xl transition
                        ${pathname === link.path ? "bg-primary/10 text-primary font-bold" : "hover:bg-accent"}
                      `}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}

                {/* Divider */}
                <li><hr className="my-1 border-border" /></li>

                {/* Auth */}
                {!user ? (
                  <li className="pt-1">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="
                        block text-center
                        px-4 py-2.5 rounded-xl
                        bg-primary text-primary-foreground
                        font-bold text-xs
                        shadow-xs
                        hover:bg-primary/90
                        transition
                      "
                    >
                      Log In / Sign Up
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-accent transition"
                    >
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt=""
                          width={28}
                          height={28}
                          className="w-7 h-7 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                          {user.name?.charAt(0).toUpperCase() || <UserIcon className="w-3.5 h-3.5" />}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground">{user.name || "My Profile"}</span>
                        <span className="text-[10px] text-muted-foreground">View Profile & XP</span>
                      </div>
                    </Link>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-14" />
    </>
  );
}
