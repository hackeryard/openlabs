"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

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
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.96,
    transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
  },
};

/* ---------------- Lab Categories ---------------- */

const labCategories = [
  { label: "Physics", path: "/physics" },
  { label: "Chemistry", path: "/chemistry" },
  { label: "Biology", path: "/biology" },
  { label: "Computer Science", path: "/computer-science" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [labsOpen, setLabsOpen] = useState(false);
  const [mobileLabsOpen, setMobileLabsOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const labsRef = useRef<HTMLLIElement>(null);

  /* ---------------- Top-level nav links ---------------- */

  const topLinks = [
    { label: "Blog", path: "/blog" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

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

  /* ---------------- Load User ---------------- */

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me");

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data.user || null);
      } catch (error) {
        console.error("Failed to load user:", error);
        setUser(null);
      }
    };

    loadUser();
  }, [pathname]);

  /* ---------------- Helpers ---------------- */

  const isLabsActive = labCategories.some((c) => pathname.startsWith(c.path));

  return (
    <>
      <motion.nav
        layout
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
                src={'/images/logo.png'}
                alt="OpanLabs Logo"
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

          <motion.button
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            whileTap={{ scale: 0.95 }}
            className="
              lg:hidden
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

            {/* Labs Dropdown */}
            <li ref={labsRef} className="relative">
              <button
                onClick={() => setLabsOpen((v) => !v)}
                className={`
                  flex items-center gap-1 px-3 py-2 rounded-md transition text-sm font-medium
                  ${isLabsActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"}
                `}
              >
                Labs
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${labsOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {labsOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="
                      absolute top-full left-0 mt-2
                      w-56
                      bg-white text-slate-800
                      rounded-xl
                      shadow-2xl
                      border border-slate-100
                      overflow-hidden
                      z-50
                    "
                  >
                    <div className="p-2 space-y-0.5">
                      {labCategories.map((cat) => (
                        <Link
                          key={cat.path}
                          href={cat.path}
                          className={`
                            flex items-center px-3 py-2.5 rounded-lg transition text-sm
                            ${pathname.startsWith(cat.path)
                              ? "bg-indigo-50 text-indigo-700 font-semibold"
                              : "hover:bg-slate-50 text-slate-700"
                            }
                          `}
                        >
                          {cat.label}
                        </Link>
                      ))}
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
                    src={user.avatar || "/images/avatars/avatar1.svg"}
                    alt="profile"
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                </Link>
              </li>
            )}
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
                bg-white text-slate-800
                rounded-xl
                shadow-2xl
                overflow-hidden
                z-50
              "
            >
              <ul className="p-2 space-y-0.5">
                {/* Home */}
                <li>
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className={`
                      block px-4 py-2.5 rounded-lg transition text-sm font-medium
                      ${pathname === "/" ? "bg-indigo-100 text-indigo-700 font-semibold" : "hover:bg-slate-100"}
                    `}
                  >
                    Home
                  </Link>
                </li>

                {/* Labs Accordion */}
                <li>
                  <button
                    onClick={() => setMobileLabsOpen((v) => !v)}
                    className={`
                      w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition text-sm font-medium
                      ${isLabsActive ? "bg-indigo-100 text-indigo-700 font-semibold" : "hover:bg-slate-100"}
                    `}
                  >
                    <span>Labs</span>
                    <ChevronDown
                      size={14}
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
                        className="overflow-hidden"
                      >
                        <div className="pl-4 py-1 space-y-0.5">
                          {labCategories.map((cat) => (
                            <Link
                              key={cat.path}
                              href={cat.path}
                              onClick={() => setMobileOpen(false)}
                              className={`
                                flex items-center px-4 py-2 rounded-lg transition text-sm
                                ${pathname.startsWith(cat.path)
                                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                                  : "hover:bg-slate-50 text-slate-600"
                                }
                              `}
                            >
                              {cat.label}
                            </Link>
                          ))}
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
                        block px-4 py-2.5 rounded-lg transition text-sm font-medium
                        ${pathname === link.path ? "bg-indigo-100 text-indigo-700 font-semibold" : "hover:bg-slate-100"}
                      `}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}

                {/* Divider */}
                <li><hr className="my-1 border-slate-200" /></li>

                {/* Auth */}
                {!user ? (
                  <li>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="
                        block text-center
                        px-4 py-2.5 rounded-lg
                        bg-indigo-600 text-white
                        font-semibold text-sm
                        hover:bg-indigo-700
                        transition
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
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-100 transition"
                    >
                      <Image
                        src={user.avatar || "/images/avatars/avatar1.svg"}
                        alt="profile"
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-slate-700">My Profile</span>
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