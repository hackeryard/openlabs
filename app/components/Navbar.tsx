"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ChevronDown,
  Atom,
  Beaker,
  Dna,
  Code,
  Sigma,
  ArrowRight,
  Sparkles,
  Trophy,
  Compass,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/components/AuthProvider";

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
    description: "Mechanics, circuits, optics & waves",
    icon: Atom,
    colorClass: "text-blue-500 dark:text-blue-400 group-hover/cat:text-blue-600 dark:group-hover/cat:text-blue-300",
    iconBgClass: "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 group-hover/cat:bg-blue-500 group-hover/cat:text-white",
    highlights: [
      { name: "Free Fall", path: "/physics/freefall" },
      { name: "Ohm's Law", path: "/physics/ohmslaw" },
      { name: "Projectile", path: "/physics/projectilemotion" },
      { name: "RC Circuit", path: "/physics/rclab" },
    ],
  },
  {
    label: "Chemistry",
    path: "/chemistry",
    description: "Periodic table, bonds & reactions",
    icon: Beaker,
    colorClass: "text-emerald-500 dark:text-emerald-400 group-hover/cat:text-emerald-600 dark:group-hover/cat:text-emerald-300",
    iconBgClass: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover/cat:bg-emerald-500 group-hover/cat:text-white",
    highlights: [
      { name: "Periodic Table", path: "/chemistry/periodictable" },
      { name: "Reactions", path: "/chemistry/reaction-simulation" },
      { name: "Titration", path: "/chemistry/titration" },
      { name: "Bonds", path: "/chemistry/chemicalbonds" },
    ],
  },
  {
    label: "Biology",
    path: "/biology",
    description: "Cell biology, 3D anatomy & neurons",
    icon: Dna,
    colorClass: "text-rose-500 dark:text-rose-400 group-hover/cat:text-rose-600 dark:group-hover/cat:text-rose-300",
    iconBgClass: "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 group-hover/cat:bg-rose-500 group-hover/cat:text-white",
    highlights: [
      { name: "Animal Cell", path: "/biology/cell/animal" },
      { name: "Plant Cell", path: "/biology/cell/plant" },
      { name: "Human Anatomy", path: "/biology/human" },
      { name: "Photosynthesis", path: "/biology/photosynthesis" },
    ],
  },
  {
    label: "Computer Science",
    path: "/computer-science",
    description: "Algorithms, logic gates & code",
    icon: Code,
    colorClass: "text-violet-500 dark:text-violet-400 group-hover/cat:text-violet-600 dark:group-hover/cat:text-violet-300",
    iconBgClass: "bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 group-hover/cat:bg-violet-500 group-hover/cat:text-white",
    highlights: [
      { name: "JS Event Loop", path: "/labs/computer-science/code-lab/js" },
      { name: "Sorting", path: "/labs/computer-science/dsa/sorting/bubble-sort" },
      { name: "Graph Algorithms", path: "/computer-science/dsa/graph-algorithms" },
      { name: "Logic Gates", path: "/labs/computer-science/logic-gates/and-gate" },
      { name: "Git Simulator", path: "/labs/computer-science/git-simulator" },
    ],
  },
  {
    label: "Mathematics",
    path: "/mathematics",
    description: "Interactive curve plotting & analysis",
    icon: Sigma,
    colorClass: "text-indigo-500 dark:text-indigo-400 group-hover/cat:text-indigo-600 dark:group-hover/cat:text-indigo-300",
    iconBgClass: "bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover/cat:bg-indigo-500 group-hover/cat:text-white",
    highlights: [
      { name: "Function Grapher", path: "/mathematics/functiongrapher" },
      { name: "Trigonometry", path: "/mathematics/trigonometry" },
      { name: "Polynomials", path: "/mathematics/polynomials" },
      { name: "Calculus", path: "/mathematics/calculus" },
      { name: "Linear Algebra", path: "/mathematics/linear-algebra" },
      { name: "Statistics", path: "/mathematics/statistics" },
      { name: "Complex Numbers", path: "/mathematics/complex-numbers" },
      { name: "Set Theory & Logic", path: "/mathematics/set-theory" },
      { name: "Geometry Studio", path: "/mathematics/geometry" },
      { name: "Vector Algebra", path: "/mathematics/vector-algebra" },
      { name: "Combinatorics", path: "/mathematics/combinatorics" },
      { name: "Number Theory", path: "/mathematics/number-theory" },
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

  /* ---------------- Helpers ---------------- */

  const isLabsActive =
    labCategories.some((c) => pathname.startsWith(c.path)) ||
    pathname.startsWith("/labs");

  return (
    <>
      <motion.nav
        layout
        data-site-navbar
        className="
          fixed top-0 left-0 w-full
          bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500
          text-white
          py-3
          z-50
          shadow-lg
          backdrop-blur-md
        "
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* ---------------- Logo ---------------- */}

          <Link href="/">
            <motion.div
              layout
              className="flex items-center gap-3 cursor-pointer"
            >
              <Image
                src="/images/logo.png"
                alt="OpenLabs logo"
                width={40}
                height={40}
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold"
              />
              <div className="text-xl font-extrabold tracking-tight">
                OpenLabs
              </div>
            </motion.div>
          </Link>

          {/* ---------------- Mobile Toggle ---------------- */}

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <motion.button
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileOpen((v) => !v)}
              whileTap={{ scale: 0.95 }}
              className="
                p-2
                rounded-md
                bg-white/10
                hover:bg-white/20
                transition
              "
            >
              <motion.svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                animate={{ rotate: mobileOpen ? 90 : 0 }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1],
                }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M4 12H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M4 18H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </motion.svg>
            </motion.button>
          </div>

          {/* ---------------- Desktop Menu ---------------- */}

          <ul className="hidden lg:flex items-center gap-1">
            {/* Home */}
            <li>
              <Link
                href="/"
                className={`
                  px-3 py-2 rounded-md transition text-sm font-medium
                  ${pathname === "/" ? "bg-white/20 font-semibold" : "hover:bg-white/10"}
                `}
              >
                Home
              </Link>
            </li>

            {/* Labs Mega Dropdown with Hover Support */}
            <li
              ref={labsRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setLabsOpen((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setLabsOpen(false);
                }}
                aria-expanded={labsOpen}
                aria-haspopup="menu"
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-md transition text-sm font-medium
                  ${isLabsActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"}
                `}
              >
                <span>Labs</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${labsOpen ? "rotate-180" : ""}`}
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
                      absolute top-full -left-52 lg:-left-60 mt-2
                      w-[640px] max-w-[calc(100vw-2.5rem)]
                      bg-card/95 backdrop-blur-xl text-foreground
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
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Explore Virtual Laboratories
                        </span>
                      </div>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        50+ Simulations
                      </span>
                    </div>

                    {/* 2-Column Grid */}
                    <div className="p-3 grid grid-cols-2 gap-2.5">
                      {labCategories.map((cat) => {
                        const Icon = cat.icon;
                        const isCatActive = pathname.startsWith(cat.path);

                        return (
                          <div
                            key={cat.path}
                            className={`
                              group/cat p-2.5 rounded-xl border transition-all duration-200
                              ${
                                isCatActive
                                  ? "bg-accent/80 border-primary/40 shadow-sm"
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
                                      text-sm font-semibold tracking-tight transition-colors duration-150
                                      ${cat.colorClass}
                                    `}
                                  >
                                    {cat.label}
                                  </h4>
                                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 -translate-x-1 group-hover/cat:opacity-100 group-hover/cat:translate-x-0 transition-all duration-200" />
                                </div>
                                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
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

                      {/* 6th Slot: Daily Challenges & XP Hub Card */}
                      <div className="p-2.5 rounded-xl border border-border bg-gradient-to-br from-indigo-500/10 via-sky-500/5 to-transparent flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                              <Trophy className="w-3.5 h-3.5" />
                            </div>
                            <h4 className="text-xs font-bold text-foreground">
                              Quests & Leaderboard
                            </h4>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Complete challenges, earn XP & climb rankings.
                          </p>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Link
                            href="/leaderboard"
                            onClick={() => setLabsOpen(false)}
                            className="
                              inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg
                              bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition
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
                        In-browser simulations • Zero install
                      </span>
                      <Link
                        href="/physics"
                        onClick={() => setLabsOpen(false)}
                        className="font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        <span>Explore All</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Top links: Blog, About, Contact */}
            {topLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.path}
                  className={`
                    px-3 py-2 rounded-md transition text-sm font-medium
                    ${pathname === link.path ? "bg-white/20 font-semibold" : "hover:bg-white/10"}
                  `}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Leaderboard */}
            {user && (
              <li>
                <Link
                  href="/leaderboard"
                  className={`
                    px-3 py-2 rounded-md transition text-sm font-medium
                    ${pathname === "/leaderboard" ? "bg-white/20 font-semibold text-white" : "hover:bg-white/10 text-white"}
                  `}
                >
                  Leaderboard
                </Link>
              </li>
            )}

            {/* Auth / Avatar */}
            {!user ? (
              <li className="ml-2">
                <Link
                  href="/login"
                  className="
                    px-4 py-2 rounded-md
                    bg-white text-indigo-700
                    font-semibold text-sm
                    shadow-sm
                    hover:bg-slate-100
                    hover:shadow-md
                    transition
                  "
                >
                  Log In
                </Link>
              </li>
            ) : (
              <li className="ml-2">
                <Link
                  href="/profile"
                  className="
                    flex items-center gap-2
                    p-1 rounded-full
                    hover:bg-white/10
                    transition
                  "
                >
                  <Image
                    src={user.avatar || "/images/avatars/avatar-01.png"}
                    alt="User profile"
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                </Link>
              </li>
            )}
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </div>

        {/* ---------------- Mobile Menu ---------------- */}

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="
                lg:hidden
                absolute top-[72px] right-4 left-4
                bg-card text-foreground
                rounded-2xl
                shadow-2xl
                border border-border
                overflow-hidden
                z-50
                max-h-[calc(100vh-90px)]
                overflow-y-auto
                thin-scrollbar
              "
            >
              <ul id="mobile-navigation" className="p-3 space-y-1">
                {/* Home */}
                <li>
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className={`
                      block px-3.5 py-2.5 rounded-xl transition text-sm font-medium
                      ${pathname === "/" ? "bg-primary/10 text-primary font-semibold" : "hover:bg-accent"}
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
                      w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-sm font-medium
                      ${isLabsActive ? "bg-primary/10 text-primary font-semibold" : "hover:bg-accent"}
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-primary" />
                      <span>Labs & Simulations</span>
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${mobileLabsOpen ? "rotate-180" : ""}`}
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
                                className="p-2 rounded-lg bg-muted/40 border border-border/60"
                              >
                                <Link
                                  href={cat.path}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className={`p-1.5 rounded-md ${cat.iconBgClass}`}>
                                      <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-semibold text-foreground">
                                      {cat.label}
                                    </span>
                                  </div>
                                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                                </Link>

                                <div className="mt-2 flex flex-wrap gap-1 pl-8">
                                  {cat.highlights.map((item) => (
                                    <Link
                                      key={item.path}
                                      href={item.path}
                                      onClick={() => setMobileOpen(false)}
                                      className="
                                        text-[11px] px-2 py-0.5 rounded-md
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
                        block px-3.5 py-2.5 rounded-xl transition text-sm font-medium
                        ${pathname === link.path ? "bg-primary/10 text-primary font-semibold" : "hover:bg-accent"}
                      `}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}

                {/* Leaderboard */}
                {user && (
                  <li>
                    <Link
                      href="/leaderboard"
                      onClick={() => setMobileOpen(false)}
                      className={`
                        block px-3.5 py-2.5 rounded-xl transition text-sm font-medium
                        ${pathname === "/leaderboard" ? "bg-primary/10 text-primary font-semibold" : "hover:bg-accent text-foreground"}
                      `}
                    >
                      Leaderboard
                    </Link>
                  </li>
                )}

                {/* Divider */}
                <li><hr className="my-1 border-border" /></li>

                {/* Auth */}
                {!user ? (
                  <li>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="
                        block text-center
                        px-4 py-2.5 rounded-xl
                        bg-indigo-600 text-white
                        font-semibold text-sm
                        hover:bg-indigo-700
                        transition shadow-sm
                      "
                    >
                      Log In
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-accent transition"
                    >
                      <Image
                        src={user.avatar || "/images/avatars/avatar-01.png"}
                        alt=""
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-foreground">My Profile</span>
                    </Link>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-14" />
    </>
  );
}
