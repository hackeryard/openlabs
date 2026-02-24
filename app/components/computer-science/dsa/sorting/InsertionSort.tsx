"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Types
type Mode = "beginner" | "expert" | "interview";

interface Step {
  type: "select" | "shift" | "insert" | "complete";
  array: number[];
  currentIndex: number;
  comparingIndex: number;
  selectedValue: number;
  insertedAt: number;
  explanation: string;
  insight: string;
  codeLine: number;
}

export default function InsertionSortVisualizer() {
  // ================= STATE MANAGEMENT =================
  const [inputArray, setInputArray] = useState<number[]>([12, 11, 13, 5, 6, 7, 9]);
  const [inputString, setInputString] = useState("12, 11, 13, 5, 6, 7, 9");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<Mode>("beginner");
  const [speed, setSpeed] = useState(700);
  const [stats, setStats] = useState({
    comparisons: 0,
    shifts: 0,
    insertions: 0,
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // ================= INSERTION SORT ALGORITHM WITH STEP GENERATION =================
  const generateSteps = useCallback((arr: number[]): Step[] => {
    const steps: Step[] = [];
    const array = [...arr];
    let comparisons = 0;
    let shifts = 0;
    let insertions = 0;
    
    const n = array.length;

    steps.push({
      type: "select",
      array: [...array],
      currentIndex: 0,
      comparingIndex: -1,
      selectedValue: array[0],
      insertedAt: -1,
      explanation: "Starting Insertion Sort. First element is considered sorted.",
      insight: "Insertion Sort builds the final sorted array one element at a time.",
      codeLine: 3,
    });

    for (let i = 1; i < n; i++) {
      const key = array[i];
      let j = i - 1;

      steps.push({
        type: "select",
        array: [...array],
        currentIndex: i,
        comparingIndex: j,
        selectedValue: key,
        insertedAt: -1,
        explanation: `Selected element ${key} at position ${i} to insert into sorted portion`,
        insight: "We take one unsorted element and insert it into its correct position in the sorted portion.",
        codeLine: 5,
      });

      // Move elements greater than key one position ahead
      while (j >= 0 && array[j] > key) {
        comparisons++;
        
        steps.push({
          type: "shift",
          array: [...array],
          currentIndex: i,
          comparingIndex: j,
          selectedValue: key,
          insertedAt: -1,
          explanation: `${array[j]} is greater than ${key}, shifting ${array[j]} to the right`,
          insight: "Larger elements are shifted to make room for the smaller element.",
          codeLine: 7,
        });

        array[j + 1] = array[j];
        shifts++;
        j--;

        steps.push({
          type: "shift",
          array: [...array],
          currentIndex: i,
          comparingIndex: j,
          selectedValue: key,
          insertedAt: -1,
          explanation: `Shifted element to position ${j + 2}`,
          insight: "Elements keep shifting until we find the correct position.",
          codeLine: 8,
        });
      }

      array[j + 1] = key;
      insertions++;

      steps.push({
        type: "insert",
        array: [...array],
        currentIndex: i,
        comparingIndex: -1,
        selectedValue: key,
        insertedAt: j + 1,
        explanation: `Inserted ${key} at position ${j + 1}`,
        insight: "The element is now in its correct sorted position.",
        codeLine: 11,
      });
    }

    steps.push({
      type: "complete",
      array: [...array],
      currentIndex: -1,
      comparingIndex: -1,
      selectedValue: -1,
      insertedAt: -1,
      explanation: "✨ Insertion Sort complete! The array is now fully sorted.",
      insight: `Time complexity: O(n²) average/worst, O(n) best | Space: O(1)`,
      codeLine: 15,
    });

    setStats({
      comparisons,
      shifts,
      insertions,
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
  const codeSnippet = `function insertionSort(arr) {
  // Start from the second element
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    
    // Move elements greater than key one position ahead
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    // Insert key in its correct position
    arr[j + 1] = key;
  }
  return arr;
}`;

  // ================= HELPER FUNCTIONS =================
  const getBarColor = (index: number) => {
    if (!currentStep) return isDarkMode ? "#4B5563" : "#F59E0B";
    
    if (index === currentStep.insertedAt) {
      return "#10B981"; // Green for just inserted
    }
    if (index === currentStep.currentIndex) {
      return "#EC4899"; // Pink for current element being processed
    }
    if (index === currentStep.comparingIndex) {
      return "#3B82F6"; // Blue for element being compared
    }
    if (index < currentStep.currentIndex && currentStep.currentIndex > 0) {
      return "#8B5CF6"; // Purple for sorted portion
    }
    
    return isDarkMode ? "#4B5563" : "#F59E0B";
  };

  // ================= MAIN RENDER =================
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-amber-900 to-gray-900" 
        : "bg-gradient-to-br from-slate-50 via-amber-50 to-white"
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
          className="absolute top-0 -left-4 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
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
          className="absolute top-0 -right-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
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
              <h1 className={`text-4xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent`}>
                Insertion Sort Visualizer
              </h1>
              <p className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Build sorted array one element at a time by inserting each element into its correct position
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
                } focus:outline-none focus:ring-2 focus:ring-amber-500`}
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
                placeholder="Enter numbers (e.g., 12, 11, 13, 5)"
                className={`w-full px-4 py-3 rounded-xl backdrop-blur-sm border ${
                  isDarkMode 
                    ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400" 
                    : "bg-white/50 border-gray-200 text-gray-800 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
              />
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={reset}
                  className="px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all font-medium"
                >
                  Apply
                </button>
                <button
                  onClick={() => setInputString("12, 11, 13, 5, 6, 7, 9")}
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
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Shifts</span>
                  <span className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {stats.shifts}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Insertions</span>
                  <span className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {stats.insertions}
                  </span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Time Complexity</span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-mono">
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
                  <span className="text-emerald-500">✓ Yes</span>
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
                    
                    {/* Array Visualization with Cards */}
                    <div className="flex justify-center items-center gap-3 flex-wrap">
                      {currentStep.array.map((value, idx) => {
                        const isSorted = idx < currentStep.currentIndex && currentStep.currentIndex > 0;
                        
                        return (
                          <motion.div
                            key={`${idx}-${value}`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative group"
                          >
                            <motion.div
                              animate={{
                                scale: idx === currentStep.insertedAt ? [1, 1.2, 1] : 1,
                                rotateY: idx === currentStep.insertedAt ? [0, 180, 360] : 0,
                              }}
                              transition={{ duration: 0.8 }}
                              className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center shadow-lg
                                ${getBarColor(idx)} 
                                ${isSorted ? 'border-2 border-purple-400' : ''}
                                text-white font-bold relative overflow-hidden`}
                              style={{
                                backgroundColor: getBarColor(idx),
                              }}
                            >
                              <span className="text-xl">{value}</span>
                              <span className="text-xs opacity-75 mt-1">idx:{idx}</span>
                              
                              {/* Sorted badge */}
                              {isSorted && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full flex items-center justify-center text-[10px]"
                                >
                                  ✓
                                </motion.div>
                              )}
                              
                              {/* Tooltip */}
                              {showTooltips && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20">
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

                    {/* Selected element indicator */}
                    {currentStep.selectedValue > 0 && currentStep.type !== "complete" && (
                      <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex justify-center"
                      >
                        <div className={`px-4 py-2 rounded-full ${
                          isDarkMode ? "bg-pink-500/20 text-pink-300" : "bg-pink-100 text-pink-700"
                        }`}>
                          🔍 Currently inserting: <span className="font-bold text-lg">{currentStep.selectedValue}</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Legend */}
                    <div className="flex justify-center gap-4 text-sm flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Sorted Portion</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Current Element</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Comparing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Just Inserted</span>
                      </div>
                    </div>

                    {/* Current Operation Info */}
                    <div className={`text-center p-4 rounded-xl ${
                      isDarkMode ? "bg-gray-700/50" : "bg-gray-50/50"
                    }`}>
                      <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        {currentStep.type === "select" && "🔍 Selecting element to insert"}
                        {currentStep.type === "shift" && "⬅️ Shifting elements right"}
                        {currentStep.type === "insert" && "📥 Inserting element"}
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
                          ? isDarkMode ? "#374151" : "#FEF3C7"
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
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Sorted Elements</span>
                    <span className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {currentStep?.currentIndex || 0} / {inputArray.length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Current Operation</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      currentStep?.type === "select" 
                        ? "bg-purple-100 text-purple-700"
                        : currentStep?.type === "shift"
                        ? "bg-blue-100 text-blue-700"
                        : currentStep?.type === "insert"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {currentStep?.type || "Ready"}
                    </span>
                  </div>
                </div>

                {currentStep?.type === "shift" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-2 rounded-lg text-sm text-center ${
                      isDarkMode ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    ⬅️ Shifting elements to make room
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
                    ? "bg-amber-900/30 border border-amber-800" 
                    : "bg-amber-50/70 border border-amber-100"
                } shadow-xl`}
              >
                <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-amber-300" : "text-amber-800"}`}>
                  💡 Insertion Sort Tips
                </h3>
                <ul className={`space-y-2 text-sm ${isDarkMode ? "text-amber-200" : "text-amber-700"}`}>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Excellent for small arrays (n ≤ 20)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Efficient for nearly sorted data - O(n) best case</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Stable sort - maintains relative order</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Used in Timsort (Python's default sort)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Think of sorting a hand of playing cards</span>
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
          background-image: linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}