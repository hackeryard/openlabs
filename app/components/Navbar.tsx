"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";

/* ---------------- Animations ---------------- */

const menuVariants: Variants = {
  hidden: { opacity: 0, y: -10, scale: 0.98 },
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

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in by checking for token cookie
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check", { method: "GET" });
        setIsLoggedIn(res.ok);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLoggedIn(false);
      setOpen(false);
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <motion.nav
      layout
      className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white py-3"
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div layout className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold">
            OL
          </div>
          <div className="text-xl font-extrabold tracking-tight">
            OpenLabs
          </div>
        </motion.div>

        {/* Mobile Toggle */}
        <motion.button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          whileTap={{ scale: 0.95 }}
          className="md:hidden p-2 rounded-md bg-white/10 hover:bg-white/20 transition"
        >
          <motion.svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            animate={{ rotate: open ? 90 : 0 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </motion.svg>
        </motion.button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex md:items-center md:gap-8">
          {["Home", "Chemistry", "Physics", "Biology"].map((item) => (
            <li key={item}>
              <Link
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="px-3 py-2 rounded hover:bg-white/10 transition"
              >
                {item}
              </Link>
            </li>
          ))}
          {!isLoggedIn && (
            <li>
              <Link
                href="/login"
                className="px-4 py-2 rounded bg-white text-indigo-700 font-semibold shadow-sm hover:shadow-md transition"
              >
                Log In
              </Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-white/20 text-white font-semibold shadow-sm hover:bg-white/30 transition"
              >
                Log Out
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.ul
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden absolute top-16 right-4 bg-white text-slate-800 p-4 rounded-lg shadow-lg w-48 space-y-1"
          >
            {["Home", "Chemistry", "Physics", "Biology"].map((item) => (
              <li key={item}>
                <Link
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="block px-3 py-2 rounded hover:bg-slate-100 transition"
                  onClick={() => setOpen(false)}
                >
                  {item}
                </Link>
              </li>
            ))}
            {!isLoggedIn && (
              <li>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded bg-indigo-600 text-white font-semibold text-center shadow-sm hover:shadow-md transition"
                  onClick={() => setOpen(false)}
                >
                  Log In
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 rounded bg-indigo-600 text-white font-semibold text-center shadow-sm hover:shadow-md transition"
                >
                  Log Out
                </button>
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
