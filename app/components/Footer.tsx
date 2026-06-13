import React from "react";
import Link from "next/link";
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
  return (
    <footer className="bg-gradient-to-r from-slate-800 to-indigo-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <Link
                key={item.label}
                href={item.url}
                aria-label={item.label}
                className="hover:text-white transition-colors"
              >
                {item.label}
              </Link>
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
      </div>

      {/* -------- Bottom Bar -------- */}
      <div className="mt-6 text-center text-xs text-slate-400">
        OpenLabs - Built for interactive learning
      </div>
    </footer>
  );
}
