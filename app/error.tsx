"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCw, MessageCircle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to external service if needed
    console.error("Error occurred:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4">
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
          <div className="inline-block p-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full">
            <AlertTriangle className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Oops! Something Went Wrong
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Our lab encountered an unexpected error.
          </p>
        </motion.div>

        {/* Error Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8 p-6 bg-white rounded-xl shadow-sm border-2 border-red-200"
        >
          <div className="text-left">
            <p className="text-sm font-mono text-gray-600 bg-gray-100 p-4 rounded-lg overflow-auto max-h-32">
              {error.message || "An unexpected error occurred. Please try again later."}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-3 font-mono">
                Error ID: <span className="font-bold">{error.digest}</span>
              </p>
            )}
          </div>
        </motion.div>

        {/* Recovery Suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-10 p-6 bg-blue-50 rounded-xl border border-blue-200"
        >
          <h3 className="text-lg font-bold text-blue-900 mb-4">What you can try:</h3>
          <ul className="text-left space-y-2 text-blue-800">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">1.</span>
              <span>Refresh the page to retry the operation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">2.</span>
              <span>Clear your browser cache and try again</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">3.</span>
              <span>Return to the home page and explore other labs</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">4.</span>
              <span>Report the issue if the problem persists</span>
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-600 font-semibold rounded-lg shadow-lg hover:shadow-xl border-2 border-red-600 transition-all hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>

          <Link
            href="https://github.com/rahulra3621/openlabs/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg shadow-lg hover:shadow-xl border-2 border-gray-300 transition-all hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            Report Issue
          </Link>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200"
        >
          <h3 className="text-sm font-bold text-gray-900 mb-3">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            If you continue to experience issues, please reach out to our support team:
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              📧 <span className="font-medium">GitHub Issues:</span>{" "}
              <Link
                href="https://github.com/rahulra3621/openlabs/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Report a Bug
              </Link>
            </li>
            <li>
              👤 <span className="font-medium">Maintainer:</span>{" "}
              <Link
                href="https://github.com/rahulra3621"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                @rahulra3621
              </Link>
            </li>
          </ul>
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
  );
}
