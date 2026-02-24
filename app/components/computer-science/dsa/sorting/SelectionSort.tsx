"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Types
type Mode = "beginner" | "expert" | "interview";

interface Step {
  type: "find" | "swap" | "complete";
  array: number[];
  currentMinIndex: number;
  comparingIndex: number;
  swapIndices: [number, number];
  sortedBoundary: number;
  explanation: string;
  insight: string;
  codeLine: number;
}

export default function SelectionSortVisualizer() {
  // ================= STATE MANAGEMENT =================
  const [inputArray, setInputArray] = useState<number[]>([64, 25, 12, 22, 11, 9, 34]);
  const [inputString, setInputString] = useState("64, 25, 12, 22, 11, 9, 34");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<Mode>("beginner");
  const [speed, setSpeed] = useState(700);
  const [stats, setStats] = useState({
    comparisons: 0,
    swaps: 0,
    passes: 0,
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // ================= SELECTION SORT ALGORITHM WITH STEP GENERATION =================
  const generateSteps = useCallback((arr: number[]): Step[] => {
    const steps: Step[] = [];
    const array = [...arr];
    let comparisons = 0;
    let swaps = 0;
    let passes = 0;
    
    const n = array.length;

    steps.push({
      type: "find",
      array: [...array],
      currentMinIndex: 0,
      comparingIndex: 1,
      swapIndices: [-1, -1],
      sortedBoundary: 0,
      explanation: "Starting Selection Sort. Finding minimum element in unsorted portion.",
      insight: "Selection sort repeatedly selects the smallest element and moves it to the front.",
      codeLine: 3,
    });

    for (let i = 0; i < n - 1; i++) {
      passes++;
      let minIndex = i;

      steps.push({
        type: "find",
        array: [...array],
        currentMinIndex: minIndex,
        comparingIndex: i + 1,
        swapIndices: [-1, -1],
        sortedBoundary: i,
        explanation: `Pass ${passes}: Starting new pass at index ${i}`,
        insight: `Current minimum is ${array[minIndex]} at position ${minIndex}`,
        codeLine: 5,
      });

      // Find the minimum element in unsorted array
      for (let j = i + 1; j < n; j++) {
        comparisons++;
        
        steps.push({
          type: "find",
          array: [...array],
          currentMinIndex: minIndex,
          comparingIndex: j,
          swapIndices: [-1, -1],
          sortedBoundary: i,
          explanation: `Comparing current minimum ${array[minIndex]} with ${array[j]}`,
          insight: array[j] < array[minIndex] 
            ? `✅ ${array[j]} is smaller, updating minimum` 
            : `❌ ${array[minIndex]} is still smaller`,
          codeLine: 7,
        });

        if (array[j] < array[minIndex]) {
          minIndex = j;
          
          steps.push({
            type: "find",
            array: [...array],
            currentMinIndex: minIndex,
            comparingIndex: j,
            swapIndices: [-1, -1],
            sortedBoundary: i,
            explanation: `Found new minimum: ${array[minIndex]} at position ${minIndex}`,
            insight: "This will be swapped into its correct position",
            codeLine: 8,
          });
        }
      }

      // Swap if needed
      if (minIndex !== i) {
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        swaps++;

        steps.push({
          type: "swap",
          array: [...array],
          currentMinIndex: minIndex,
          comparingIndex: -1,
          swapIndices: [i, minIndex],
          sortedBoundary: i + 1,
          explanation: `Swapped ${array[i]} and ${array[minIndex]}`,
          insight: `Element ${array[i]} is now in its correct sorted position`,
          codeLine: 11,
        });
      } else {
        steps.push({
          type: "swap",
          array: [...array],
          currentMinIndex: minIndex,
          comparingIndex: -1,
          swapIndices: [-1, -1],
          sortedBoundary: i + 1,
          explanation: `Element ${array[i]} is already in correct position`,
          insight: "No swap needed - it's already the minimum",
          codeLine: 11,
        });
      }
    }

    steps.push({
      type: "complete",
      array: [...array],
      currentMinIndex: -1,
      comparingIndex: -1,
      swapIndices: [-1, -1],
      sortedBoundary: n,
      explanation: "✨ Selection Sort complete! The array is now fully sorted.",
      insight: `Time complexity: O(n²) | Space: O(1) | Makes O(n) swaps`,
      codeLine: 15,
    });

    setStats({
      comparisons,
      swaps,
      passes,
    });

    return steps;
  }, []);

  // ================= INITIALIZATION =================
  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    const arr = inputString
      .split(",")
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n));
    
    setInputArray(arr);
    setSteps(generateSteps(arr));
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setShowCelebration(false);
  };

  // ================= PLAYBACK CONTROL =================
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStepIndex(i => i + 1);
    }, mode === "beginner" ? speed : speed / 2);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps, mode, speed]);

  const currentStep = steps[currentStepIndex];

  // ================= CODE SNIPPET =================
  const codeSnippet = `function selectionSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    
    // Find minimum in unsorted portion
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    // Swap if needed
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}`;

  // ================= HELPER FUNCTIONS =================
  const getBarColor = (index: number) => {
    if (!currentStep) return isDarkMode ? "#4B5563" : "#10B981";
    
    const [swap1, swap2] = currentStep.swapIndices;
    
    if (index === swap1 || index === swap2) {
      return "#F59E0B"; // Orange for swapping
    }
    if (index === currentStep.currentMinIndex) {
      return "#EC4899"; // Pink for current minimum
    }
    if (index === currentStep.comparingIndex) {
      return "#3B82F6"; // Blue for element being compared
    }
    if (index < currentStep.sortedBoundary) {
      return "#8B5CF6"; // Purple for sorted portion
    }
    
    return isDarkMode ? "#4B5563" : "#10B981";
  };

  // ================= MAIN RENDER =================
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900" 
        : "bg-gradient-to-br from-slate-50 via-emerald-50 to-white"
    }`}>
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 -left-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 -right-4 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        />
      </div>

      {/* Main Container */}
      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`backdrop-blur-xl rounded-3xl p-8 ${
            isDarkMode 
              ? "bg-gray-800/50 border border-gray-700" 
              : "bg-white/70 border border-white/20"
          } shadow-2xl`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent`}>
                Selection Sort Visualizer
              </h1>
              <p className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Repeatedly select the smallest element and move it to the front
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-xl transition-all ${
                  isDarkMode 
                    ? "bg-gray-700 hover:bg-gray-600 text-yellow-400" 
                    : "bg-white hover:bg-gray-50 text-gray-700"
                } shadow-lg`}
              >
                {isDarkMode ? "☀️" : "🌙"}
              </button>
              
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as Mode)}
                className={`px-4 py-3 rounded-xl backdrop-blur-xl border ${
                  isDarkMode 
                    ? "bg-gray-700/50 border-gray-600 text-white" 
                    : "bg-white/50 border-gray-200 text-gray-800"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              >
                <option value="beginner">🌱 Beginner Mode</option>
                <option value="expert">⚡ Expert Mode</option>
                <option value="interview">💼 Interview Mode</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Column - Controls & Input */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            
            {/* Input Card */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`backdrop-blur-xl rounded-2xl p-6 ${
                isDarkMode 
                  ? "bg-gray-800/50 border border-gray-700" 
                  : "bg-white/70 border border-white/20"
              } shadow-xl`}
            >
              <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                📊 Input Array
              </h3>
              <input
                value={inputString}
                onChange={(e) => setInputString(e.target.value)}
                placeholder="Enter numbers (e.g., 64, 25, 12, 22)"
                className={`w-full px-4 py-3 rounded-xl backdrop-blur-sm border ${
                  isDarkMode 
                    ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400" 
                    : "bg-white/50 border-gray-200 text-gray-800 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
              />
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={reset}
                  className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all font-medium"
                >
                  Apply
                </button>
                <button
                  onClick={() => setInputString("64, 25, 12, 22, 11, 9, 34")}
                  className={`px-4 py-3 rounded-xl backdrop-blur-sm border ${
                    isDarkMode 
                      ? "bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50" 
                      : "bg-white/50 border-gray-200 text-gray-800 hover:bg-white/80"
                  } transition-all font-medium`}
                >
                  Random
                </button>
              </div>
            </motion.div>

            {/* Controls Card */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`backdrop-blur-xl rounded-2xl p-6 ${
                isDarkMode 
                  ? "bg-gray-800/50 border border-gray-700" 
                  : "bg-white/70 border border-white/20"
              } shadow-xl`}
            >
              <h3 className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                🎮 Playback Controls
              </h3>
              
              <div className="flex justify-between gap-2 mb-4">
                <button
                  onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                  className={`p-3 rounded-xl ${
                    isDarkMode 
                      ? "bg-gray-700 hover:bg-gray-600 text-white" 
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  } shadow-lg transition-all`}
                >
                  ⏮️
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex-1 px-4 py-3 ${
                    isPlaying 
                      ? "bg-orange-500 hover:bg-orange-600" 
                      : "bg-green-500 hover:bg-green-600"
                  } text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium`}
                >
                  {isPlaying ? "⏸️ Pause" : "▶️ Play"}
                </button>
                <button
                  onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))}
                  className={`p-3 rounded-xl ${
                    isDarkMode 
                      ? "bg-gray-700 hover:bg-gray-600 text-white" 
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  } shadow-lg transition-all`}
                >
                  ⏭️
                </button>
              </div>

              <div>
                <label className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Speed: {speed}ms
                </label>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="100"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`backdrop-blur-xl rounded-2xl p-6 ${
                isDarkMode 
                  ? "bg-gray-800/50 border border-gray-700" 
                  : "bg-white/70 border border-white/20"
              } shadow-xl`}
            >
              <h3 className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                📈 Algorithm Statistics
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Comparisons</span>
                  <span className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {stats.comparisons}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Swaps</span>
                  <span className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {stats.swaps}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Passes</span>
                  <span className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {stats.passes}
                  </span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Time Complexity</span>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-mono">
                    O(n²)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Space Complexity</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-mono">
                    O(1)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Stable</span>
                  <span className="text-amber-500">⚠️ No</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Center Column - Visualization */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            
            {/* Main Visualization Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`backdrop-blur-xl rounded-3xl p-8 ${
                isDarkMode 
                  ? "bg-gray-800/50 border border-gray-700" 
                  : "bg-white/70 border border-white/20"
              } shadow-2xl min-h-[400px]`}
            >
              <AnimatePresence mode="wait">
                {currentStep && (
                  <motion.div
                    key={currentStepIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-8"
                  >
                    
                    {/* Array Visualization with Bars */}
                    <div className="flex justify-center items-end gap-2 h-64">
                      {currentStep.array.map((value, idx) => {
                        const maxValue = Math.max(...currentStep.array);
                        const height = (value / maxValue) * 180 + 20;
                        
                        return (
                          <motion.div
                            key={`${idx}-${value}`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.02 }}
                            className="relative group"
                          >
                            <motion.div
                              animate={{
                                scale: idx === currentStep.currentMinIndex || 
                                       idx === currentStep.comparingIndex ||
                                       idx === currentStep.swapIndices[0] ||
                                       idx === currentStep.swapIndices[1] ? 1.1 : 1,
                                y: idx === currentStep.currentMinIndex ? -5 : 0,
                              }}
                              className="w-10 rounded-t-lg cursor-pointer transition-all"
                              style={{
                                height: `${height}px`,
                                backgroundColor: getBarColor(idx),
                              }}
                            >
                              {/* Value label */}
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-mono font-bold">
                                {value}
                              </div>
                              
                              {/* Index label */}
                              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">
                                {idx}
                              </div>
                              
                              {/* Minimum marker */}
                              {idx === currentStep.currentMinIndex && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-xs"
                                >
                                  ⭐
                                </motion.div>
                              )}
                              
                              {/* Tooltip */}
                              {showTooltips && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                                  <div className={`px-2 py-1 text-xs rounded-lg whitespace-nowrap ${
                                    isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
                                  } shadow-lg`}>
                                    Value: {value}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-4 text-sm flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Sorted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Current Min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Comparing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Swapping</span>
                      </div>
                    </div>

                    {/* Current Operation Info */}
                    <div className={`text-center p-4 rounded-xl ${
                      isDarkMode ? "bg-gray-700/50" : "bg-gray-50/50"
                    }`}>
                      <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        {currentStep.type === "find" && currentStep.comparingIndex !== -1 && "🔍 Finding minimum..."}
                        {currentStep.type === "find" && currentStep.comparingIndex === -1 && "✅ Found minimum!"}
                        {currentStep.type === "swap" && "🔄 Swapping into position"}
                        {currentStep.type === "complete" && "✨ Sorting Complete!"}
                      </span>
                    </div>

                    {/* Explanation Card (Beginner Mode) */}
                    {mode === "beginner" && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className={`mt-4 p-6 rounded-2xl ${
                          isDarkMode 
                            ? "bg-gray-700/50 border border-gray-600" 
                            : "bg-white/50 border border-gray-200"
                        } backdrop-blur-sm`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">💭</span>
                          <div>
                            <p className={`font-medium mb-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                              {currentStep.explanation}
                            </p>
                            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                              {currentStep.insight}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Column - Code & Progress */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            
            {/* Code Card */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`backdrop-blur-xl rounded-2xl p-6 ${
                isDarkMode 
                  ? "bg-gray-800/50 border border-gray-700" 
                  : "bg-white/70 border border-white/20"
              } shadow-xl`}
            >
              <h3 className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                💻 JavaScript Code
              </h3>
              
              <div className={`relative rounded-xl overflow-hidden ${
                isDarkMode ? "bg-gray-900" : "bg-gray-50"
              }`}>
                <pre className="p-4 text-sm font-mono overflow-x-auto">
                  {codeSnippet.split('\n').map((line, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        backgroundColor: currentStep?.codeLine === idx + 1 
                          ? isDarkMode ? "#374151" : "#D1FAE5"
                          : "transparent",
                      }}
                      className="px-2 py-0.5 rounded"
                    >
                      <code className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                        {line}
                      </code>
                    </motion.div>
                  ))}
                </pre>
              </div>
            </motion.div>

            {/* Progress Card */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`backdrop-blur-xl rounded-2xl p-6 ${
                isDarkMode 
                  ? "bg-gray-800/50 border border-gray-700" 
                  : "bg-white/70 border border-white/20"
              } shadow-xl`}
            >
              <h3 className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                📍 Progress
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Step</span>
                    <span className={isDarkMode ? "text-white" : "text-gray-800"}>
                      {currentStepIndex + 1} / {steps.length}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Sorted Elements</span>
                    <span className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {currentStep?.sortedBoundary || 0} / {inputArray.length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Current Operation</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      currentStep?.type === "find" && currentStep.comparingIndex !== -1
                        ? "bg-blue-100 text-blue-700"
                        : currentStep?.type === "find"
                        ? "bg-purple-100 text-purple-700"
                        : currentStep?.type === "swap"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {currentStep?.type === "find" && currentStep.comparingIndex !== -1 && "Finding Min"}
                      {currentStep?.type === "find" && currentStep.comparingIndex === -1 && "Min Found"}
                      {currentStep?.type === "swap" && "Swapping"}
                      {currentStep?.type === "complete" && "Complete"}
                    </span>
                  </div>
                </div>

                {currentStep?.type === "swap" && currentStep.swapIndices[0] !== -1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-2 rounded-lg text-sm text-center ${
                      isDarkMode ? "bg-orange-500/20 text-orange-300" : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    🔄 Swapping positions {currentStep.swapIndices[0]} and {currentStep.swapIndices[1]}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Quick Tips Card */}
            {showTooltips && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`backdrop-blur-xl rounded-2xl p-6 ${
                  isDarkMode 
                    ? "bg-emerald-900/30 border border-emerald-800" 
                    : "bg-emerald-50/70 border border-emerald-100"
                } shadow-xl`}
              >
                <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-emerald-300" : "text-emerald-800"}`}>
                  💡 Selection Sort Tips
                </h3>
                <ul className={`space-y-2 text-sm ${isDarkMode ? "text-emerald-200" : "text-emerald-700"}`}>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Minimizes swaps - only O(n) swaps total</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Good for small arrays where swap cost matters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Not stable - equal elements may swap order</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Always O(n²) comparisons regardless of input</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Think of selecting the smallest card repeatedly</span>
                  </li>
                </ul>
              </motion.div>
            )}
          </div>
        </div>

        {/* Celebration Animation */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
            >
              <div className="text-6xl">🎉</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}