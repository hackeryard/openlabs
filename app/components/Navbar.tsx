"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";

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

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  /* ---------------- Nav Links ---------------- */

  const navLinks = [
    { label: "Physics", path: "/physics" },
    { label: "Chemistry", path: "/chemistry" },
    { label: "Biology", path: "/biology" },
    { label: "Computer Science", path: "/computer-science" },
  ];

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

  /* ---------------- Logout ---------------- */
  /* logout moved to profile page */

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
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold">
                OL
              </div>

              <div className="text-xl font-extrabold tracking-tight">
                OpenLabs
              </div>
            </motion.div>
          </Link>

          {/* ---------------- Mobile Toggle ---------------- */}

          <motion.button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            whileTap={{ scale: 0.95 }}
            className="
              md:hidden
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
              animate={{ rotate: open ? 90 : 0 }}
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

          <ul className="hidden md:flex items-center gap-6">
            {navLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.path}
                  className={`
                    px-3 py-2 rounded-md transition
                    ${
                      pathname === item.path
                        ? "bg-white/20 font-semibold"
                        : "hover:bg-white/10"
                    }
                  `}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {!user ? (
              <li>
                <Link
                  href="/login"
                  className="
                    px-4 py-2 rounded-md
                    bg-white text-indigo-700
                    font-semibold
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
              <>
                <li>
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
                      src={
                        user.avatar ||
                        "/images/avatars/avatar1.svg"
                      }
                      alt="profile"
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />
                  </Link>
                </li>

                {/* logout button moved to profile page */}
              </>
            )}
          </ul>
        </div>

        {/* ---------------- Mobile Menu ---------------- */}

        <AnimatePresence>
          {open && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="
                md:hidden
                absolute top-[72px] right-4
                w-56
                bg-white text-slate-800
                rounded-xl
                shadow-2xl
                overflow-hidden
                z-50
              "
            >
              <ul className="p-2 space-y-1">
                {navLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.path}
                      className={`
                        block px-4 py-2 rounded-lg transition
                        ${
                          pathname === item.path
                            ? "bg-indigo-100 text-indigo-700 font-semibold"
                            : "hover:bg-slate-100"
                        }
                      `}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}

                {!user ? (
                  <li>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="
                        block text-center
                        px-4 py-2 rounded-lg
                        bg-indigo-600 text-white
                        font-semibold
                        hover:bg-indigo-700
                        transition
                      "
                    >
                      Log In
                    </Link>
                  </li>
                ) : (
                  <li>
                    {/* logout moved to profile page */}
                    <div className="w-full px-4 py-2 text-center text-sm text-slate-500">Signed in</div>
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