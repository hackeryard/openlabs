"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { trackError } from "@/app/lib/tracker";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
    trackError(error, {
      errorType: "boundary",
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="ge-body">
        <style>{`
          .ge-body { background: linear-gradient(to bottom right, #fef2f2, #ffffff, #fff7ed); }
          .ge-icon-ring { background: linear-gradient(to bottom right, #ef4444, #f97316); }
          .ge-heading { color: #111827; }
          .ge-subheading { color: #4b5563; }
          .ge-details-card { background: #ffffff; border-color: #fecaca; }
          .ge-details-text { color: #4b5563; background: #f3f4f6; }
          .ge-details-id { color: #6b7280; }
          .ge-btn-primary { background: linear-gradient(to right, #ea580c, #dc2626); color: #ffffff; }
          .ge-btn-secondary { background: #ffffff; color: #dc2626; border-color: #dc2626; }
          @media (prefers-color-scheme: dark) {
            .ge-body { background: linear-gradient(to bottom right, #1c0a0a, #0a0a0a, #1c1006); }
            .ge-icon-ring { background: linear-gradient(to bottom right, #b91c1c, #c2410c); }
            .ge-heading { color: #f3f4f6; }
            .ge-subheading { color: #9ca3af; }
            .ge-details-card { background: #171717; border-color: #7f1d1d; }
            .ge-details-text { color: #d1d5db; background: #262626; }
            .ge-details-id { color: #9ca3af; }
            .ge-btn-primary { background: linear-gradient(to right, #c2410c, #b91c1c); color: #ffffff; }
            .ge-btn-secondary { background: #171717; color: #f87171; border-color: #b91c1c; }
          }
        `}</style>
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl"
          >
            {/* Animated Error Icon */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-8"
            >
              <div className="ge-icon-ring inline-block p-6 rounded-full">
                <AlertTriangle className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h1 className="ge-heading text-4xl md:text-5xl font-bold mb-2">
                Critical System Error
              </h1>
              <p className="ge-subheading text-xl mb-8">
                We're experiencing a critical issue. Our team has been notified.
              </p>
            </motion.div>

            {/* Error Details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="ge-details-card mb-8 p-6 rounded-xl shadow-sm border-2"
            >
              <div className="text-left">
                <p className="ge-details-text text-sm font-mono p-4 rounded-lg overflow-auto max-h-32 break-words">
                  {error.message || "A critical system error occurred."}
                </p>
                {error.digest && (
                  <p className="ge-details-id text-xs mt-3 font-mono">
                    Error ID: <span className="font-bold">{error.digest}</span>
                  </p>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={reset}
                className="ge-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>

              <Link
                href="/"
                className="ge-btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl border-2 transition-all hover:scale-105"
              >
                <Home className="w-5 h-5" />
                Go Home
              </Link>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="mt-12 text-6xl opacity-10"
            >
              ⚙️
            </motion.div>
          </motion.div>
        </div>
      </body>
    </html>
  );
}
