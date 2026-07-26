"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { usePathname } from "next/navigation";

const footerLinks = [
  {
    label: "Physics",
    url: "/physics",
  },
  {
    label: "Chemistry",
    url: "/chemistry",
  },
  {
    label: "Biology",
    url: "/biology",
  },
  {
    label: "Computer Science",
    url: "/computer-science",
  },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <footer className="bg-gradient-to-r from-slate-800 to-indigo-900 text-white py-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* -------- Brand -------- */}
        <div>
          <div className="text-lg font-bold">OpenLabs</div>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Interactive science labs for students and educators. Visualize and
            measure experiments across physics, chemistry and biology.
          </p>
        </div>

        {/* -------- Explore -------- */}
        <div>
          <div className="font-semibold">Explore</div>

          <div className="mt-2 text-sm text-slate-200 space-y-1 flex flex-col">
            {footerLinks.map((item) => (
              <motion.div key={item.label} whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
                <Link
                  href={item.url}
                  aria-label={item.label}
                  className="hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* -------- Connect -------- */}
        <div>
          <div className="font-semibold">Connect</div>
          <p className="text-sm text-slate-200 mt-2">
            Email:{" "}
            <a href="mailto:support@openlabs.org.in" className="underline underline-offset-2 hover:opacity-85">
              support@openlabs.org.in
            </a>
          </p>
        </div>
      </motion.div>

      {/* -------- Bottom Bar -------- */}
      <div className="mt-6 text-center text-xs text-slate-400">
        OpenLabs - Built for interactive learning
      </div>
    </footer>
  );
}
