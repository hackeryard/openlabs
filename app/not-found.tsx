"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        {/* Animated 404 */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mb-8"
        >
          <h1 className="text-9xl md:text-[150px] font-black bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
            404
          </h1>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            Oops! It looks like you've ventured into uncharted territory. The lab you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Helpful Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12 p-6 bg-white rounded-xl shadow-sm border border-indigo-100"
        >
          <p className="text-gray-700 mb-4 font-medium">
            💡 <span className="font-bold">Pro Tip:</span> Try exploring one of our interactive labs below:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>• <Link href="/chemistry/periodictable" className="text-indigo-600 hover:underline font-medium">Periodic Table</Link></li>
            <li>• <Link href="/physics/freefall" className="text-indigo-600 hover:underline font-medium">Free Fall Experiment</Link></li>
            <li>• <Link href="/biology/cell/animal" className="text-indigo-600 hover:underline font-medium">3D Animal Cell</Link></li>
            <li>• <Link href="/computer-science/code-lab/html-css-js" className="text-indigo-600 hover:underline font-medium">Code Editor</Link></li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>

          <Link
            href="/chemistry"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:shadow-xl border-2 border-indigo-600 transition-all hover:scale-105"
          >
            <Search className="w-5 h-5" />
            Explore Labs
          </Link>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="mt-12 text-6xl opacity-20"
        >
          🔬 🧪 🧬
        </motion.div>
      </motion.div>
    </div>
  );
}
