"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/app/components/ChatContext";

// Types
type Mode = "beginner" | "expert" | "interview";

interface Step {
  type: "scan" | "select" | "swap" | "complete";
  array: number[];
  currentMinIndex: number;
  scanningIndex: number;
  swapIndices: [number, number];
  sortedBoundary: number;
  explanation: string;
  insight: string;
  codeLine: number;
  foundNewMin?: boolean;
  newMinValue?: number;
}

export default function SelectionSortVisualizer() {
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "Selection Sort",
      theory: "Selection Sort Data Structure Visualizer",
      extraContext: ``,
    });
  }, []);
  
  // ================= STATE MANAGEMENT =================
  const [inputArray, setInputArray] = useState<number[]>([
    64, 25, 12, 22, 11, 9, 34,
  ]);
  const [inputString, setInputString] = useState("64, 25, 12, 22, 11, 9, 34");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<Mode>("beginner");
  const [speed, setSpeed] = useState(1000);
  const [stats, setStats] = useState({
    comparisons: 0,
    swaps: 0,
    passes: 0,
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);
  const [selectedMin, setSelectedMin] = useState<{ value: number, fromIndex: number, toIndex: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // ================= SELECTION SORT ALGORITHM WITH STEP GENERATION =================
  const generateSteps = useCallback((arr: number[]): Step[] => {
    const steps: Step[] = [];
    const array = [...arr];
    let comparisons = 0;
    let swaps = 0;
    let passes = 0;

    const n = array.length;

    // Initial state
    steps.push({
      type: "scan",
      array: [...array],
      currentMinIndex: 0,
      scanningIndex: 1,
      swapIndices: [-1, -1],
      sortedBoundary: 0,
      explanation: "Starting Selection Sort. Let's find the smallest element in the unsorted portion.",
      insight: "Selection sort repeatedly selects the smallest element and moves it to the front.",
      codeLine: 3,
    });

    for (let i = 0; i < n - 1; i++) {
      passes++;
      let minIndex = i;

      steps.push({
        type: "scan",
        array: [...array],
        currentMinIndex: minIndex,
        scanningIndex: i + 1,
        swapIndices: [-1, -1],
        sortedBoundary: i,
        explanation: `Pass ${passes}: Starting new scan at index ${i}`,
        insight: `Current minimum candidate is ${array[minIndex]}`,
        codeLine: 5,
      });

      // Scan for the minimum element
      for (let j = i + 1; j < n; j++) {
        comparisons++;

        steps.push({
          type: "scan",
          array: [...array],
          currentMinIndex: minIndex,
          scanningIndex: j,
          swapIndices: [-1, -1],
          sortedBoundary: i,
          explanation: `Scanning: comparing ${array[j]} with current minimum ${array[minIndex]}`,
          insight: array[j] < array[minIndex]
            ? `🔍 Found smaller element ${array[j]}!`
            : `📏 ${array[minIndex]} is still smaller`,
          codeLine: 7,
        });

        if (array[j] < array[minIndex]) {
          minIndex = j;

          steps.push({
            type: "select",
            array: [...array],
            currentMinIndex: minIndex,
            scanningIndex: j,
            swapIndices: [-1, -1],
            sortedBoundary: i,
            explanation: `✨ Found new minimum: ${array[minIndex]} at position ${minIndex}`,
            insight: "This element will be selected and moved to its correct position",
            codeLine: 8,
            foundNewMin: true,
            newMinValue: array[minIndex],
          });
        }
      }

      // Perform swap or mark as already in place
      if (minIndex !== i) {
        const swappedArray = [...array];
        [swappedArray[i], swappedArray[minIndex]] = [swappedArray[minIndex], swappedArray[i]];
        swaps++;

        steps.push({
          type: "swap",
          array: swappedArray,
          currentMinIndex: minIndex,
          scanningIndex: -1,
          swapIndices: [i, minIndex],
          sortedBoundary: i + 1,
          explanation: `🔄 Swapping ${array[i]} with minimum ${array[minIndex]}`,
          insight: `Moving minimum element from position ${minIndex} to its sorted position ${i}`,
          codeLine: 11,
        });

        // Update the actual array
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
      } else {
        steps.push({
          type: "swap",
          array: [...array],
          currentMinIndex: minIndex,
          scanningIndex: -1,
          swapIndices: [-1, -1],
          sortedBoundary: i + 1,
          explanation: `✓ Element ${array[i]} is already in the correct position`,
          insight: "No swap needed - it's already the minimum",
          codeLine: 11,
        });
      }
    }

    steps.push({
      type: "complete",
      array: [...array],
      currentMinIndex: -1,
      scanningIndex: -1,
      swapIndices: [-1, -1],
      sortedBoundary: n,
      explanation: "✨ Selection Sort complete! The array is now fully sorted.",
      insight: `Time complexity: O(n²) | Space: O(1) | Made ${swaps} swaps`,
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
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n));

    setInputArray(arr);
    setSteps(generateSteps(arr));
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setShowCelebration(false);
    setSelectedMin(null);
  };

  const generateRandomArray = () => {
    const length = Math.floor(Math.random() * 6) + 5; // 5-10 elements
    const randomArray = Array.from({ length }, () => Math.floor(Math.random() * 50) + 10);
    setInputString(randomArray.join(", "));
    setInputArray(randomArray);
    const newSteps = generateSteps(randomArray);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
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

    const timer = setTimeout(
      () => {
        setCurrentStepIndex((i) => i + 1);
      },
      mode === "beginner" ? speed : speed / 2,
    );

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps, mode, speed]);

  const currentStep = steps[currentStepIndex];

  // Handle selection animation based on current step
  useEffect(() => {
    if (currentStep && currentStep.type === "select" && currentStep.foundNewMin) {
      // Select the new minimum
      setSelectedMin({
        value: currentStep.newMinValue!,
        fromIndex: currentStep.currentMinIndex,
        toIndex: -1
      });
    } else if (currentStep && currentStep.type === "swap" && currentStep.swapIndices[0] !== -1) {
      // Swap is happening - animate the minimum moving to its new position
      setSelectedMin({
        value: currentStep.array[currentStep.swapIndices[1]],
        fromIndex: currentStep.swapIndices[1],
        toIndex: currentStep.swapIndices[0]
      });

      // Clear after animation
      setTimeout(() => {
        setSelectedMin(null);
      }, speed * 0.8);
    } else {
      setSelectedMin(null);
    }
  }, [currentStepIndex, currentStep]);

  // ================= CODE SNIPPET =================
  const codeSnippet = `function selectionSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;           // 📍 Assume first element is minimum
    
    // 🔍 Scan unsorted portion for smaller element
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;            // ✨ Found new minimum
      }
    }
    
    // 🔄 Swap if needed
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}`;

  // ================= ANIMATED CARD COMPONENT =================
  const AnimatedCard = ({
    value,
    index,
    color,
    isActive = false,
    isScanning = false,
    showTooltip = false,
    isSorted = false,
    isSwapping = false,
    isSelected = false,
    isMinCandidate = false,
  }: {
    value: number;
    index: number;
    color: string;
    isActive?: boolean;
    isScanning?: boolean;
    showTooltip?: boolean;
    isSorted?: boolean;
    isSwapping?: boolean;
    isSelected?: boolean;
    isMinCandidate?: boolean;
  }) => {
    return (
      <motion.div
        layout
        layoutId={`card-${index}-${value}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: isSelected ? -60 : isActive ? -8 : isScanning ? -4 : 0,
          x: 0,
          rotateZ: isSelected ? 5 : 0,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 1
          }
        }}
        whileHover={{ scale: 1.02 }}
        className="relative group"
        style={{ zIndex: isSelected ? 50 : 1 }}
      >
        <motion.div
          animate={{
            backgroundColor: color,
            boxShadow: isSelected
              ? "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(236, 72, 153, 0.5)"
              : isSwapping
                ? "0 4px 12px rgba(245, 158, 11, 0.5)"
                : isActive
                  ? "0 4px 12px rgba(236, 72, 153, 0.5)"
                  : isMinCandidate
                    ? "0 4px 12px rgba(139, 92, 246, 0.5)"
                    : isScanning
                      ? "0 4px 12px rgba(59, 130, 246, 0.3)"
                      : "0 2px 8px rgba(0,0,0,0.1)",
            scale: isSelected ? 1.1 : isSwapping ? 1.05 : 1,
            borderWidth: isSelected ? 3 : 0,
            borderColor: "rgba(236, 72, 153, 0.5)",
            borderStyle: "solid",
          }}
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center shadow-lg relative overflow-hidden text-white font-bold`}
          style={{ backgroundColor: color }}
        >
          {/* Value */}
          <motion.span
            layout
            className="text-xl"
            animate={isSelected ? {
              scale: [1, 1.2, 1.1],
            } : isSwapping ? {
              scale: [1, 1.1, 1],
            } : {}}
            transition={{ duration: 0.5 }}
          >
            {value}
          </motion.span>

          {/* Index */}
          <span className="text-xs opacity-75 mt-1">{index}</span>

          {/* Sorted badge */}
          {isSorted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
            >
              <span className="text-[10px] text-white">✓</span>
            </motion.div>
          )}

          {/* Selected indicator (minimum found) */}
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="absolute -top-3 -left-3 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center"
            >
              <span className="text-xs text-white">⭐</span>
            </motion.div>
          )}

          {/* Scanning indicator */}
          {isScanning && !isSelected && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full opacity-75"
            />
          )}

          {/* Tooltip */}
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20"
            >
              <div
                className={`px-2 py-1 text-xs rounded-lg whitespace-nowrap ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-800"
                } shadow-lg`}
              >
                Value: {value} {isSelected ? "⭐ minimum" : isSorted ? "✓ sorted" : ""}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    );
  };

  // ================= HELPER FUNCTIONS =================
  const getCardColor = (index: number): string => {
    if (!currentStep) return isDarkMode ? "#4B5563" : "#10B981";

    const [swap1, swap2] = currentStep.swapIndices;

    // Selected minimum - pink with glow
    if (selectedMin && index === selectedMin.fromIndex && selectedMin.toIndex === -1) {
      return "#EC4899";
    }

    // Swapping elements - orange
    if (index === swap1 || index === swap2) {
      return "#F59E0B";
    }
    
    // Current minimum candidate - purple
    if (index === currentStep.currentMinIndex && currentStep.type === "scan") {
      return "#8B5CF6";
    }
    
    // Element being scanned - blue
    if (index === currentStep.scanningIndex && currentStep.scanningIndex >= 0) {
      return "#3B82F6";
    }
    
    // Sorted portion - green
    if (index < currentStep.sortedBoundary) {
      return "#10B981";
    }

    // Unsorted portion - amber
    return isDarkMode ? "#4B5563" : "#F59E0B";
  };

  const isCardSwapping = (index: number): boolean => {
    if (!currentStep || currentStep.type !== "swap") return false;
    const [swap1, swap2] = currentStep.swapIndices;
    return index === swap1 || index === swap2;
  };

  const isCardScanning = (index: number): boolean => {
    if (!currentStep || currentStep.type !== "scan") return false;
    return index === currentStep.scanningIndex;
  };

  const isCardSelected = (index: number): boolean => {
    return !!(selectedMin && index === selectedMin.fromIndex && selectedMin.toIndex === -1);
  };

  const isCardSorted = (index: number): boolean => {
    if (!currentStep) return false;
    return index < currentStep.sortedBoundary;
  };

  const isCardMinCandidate = (index: number): boolean => {
    if (!currentStep || currentStep.type !== "scan") return false;
    return index === currentStep.currentMinIndex && index !== currentStep.scanningIndex;
  };

  // ================= MAIN RENDER =================
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900"
          : "bg-gradient-to-br from-slate-50 via-emerald-50 to-white"
      }`}
    >
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
      <div
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto p-6 space-y-6"
      >
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
              <h1
                className={`text-4xl font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent`}
              >
                Selection Sort Visualizer
              </h1>
              <p
                className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Watch as we find the minimum ✨ and swap it into place 🔄
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
              <h3
                className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                📊 Input Array
              </h3>
              <input
                value={inputString}
                onChange={(e) => setInputString(e.target.value)}
                placeholder="Enter numbers (e.g., 64, 25, 12)"
                className={`w-full px-4 py-3 rounded-xl backdrop-blur-sm border ${
                  isDarkMode
                    ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white/50 border-gray-200 text-gray-800 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
              />

              <div className="grid grid-cols-2 gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={reset}
                  className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  Apply
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generateRandomArray}
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  Random
                </motion.button>
              </div>
            </motion.div>

            {/* Playback Controls */}
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
              <h3
                className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                🎮 Playback Controls
              </h3>

              <div className="flex justify-between gap-2 mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setCurrentStepIndex(Math.max(0, currentStepIndex - 1))
                  }
                  className={`p-3 rounded-xl ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  } shadow-lg transition-all`}
                >
                  ⏮️
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex-1 px-4 py-3 ${
                    isPlaying
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium`}
                >
                  {isPlaying ? "⏸️ Pause" : "▶️ Play"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setCurrentStepIndex(
                      Math.min(steps.length - 1, currentStepIndex + 1),
                    )
                  }
                  className={`p-3 rounded-xl ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  } shadow-lg transition-all`}
                >
                  ⏭️
                </motion.button>
              </div>

              <div>
                <label
                  className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Speed: {speed}ms
                </label>
                <input
                  type="range"
                  min="400"
                  max="3000"
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
              <h3
                className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                📈 Algorithm Statistics
              </h3>

              <div className="space-y-3">
                <motion.div
                  className="flex justify-between items-center"
                  key={stats.comparisons}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    Comparisons
                  </span>
                  <span
                    className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {stats.comparisons}
                  </span>
                </motion.div>
                <motion.div
                  className="flex justify-between items-center"
                  key={stats.swaps}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    Swaps
                  </span>
                  <span
                    className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {stats.swaps}
                  </span>
                </motion.div>
                <motion.div
                  className="flex justify-between items-center"
                  key={stats.passes}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    Passes
                  </span>
                  <span
                    className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {stats.passes}
                  </span>
                </motion.div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />
                <div className="flex justify-between items-center">
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    Time Complexity
                  </span>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-mono">
                    O(n²)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    Space Complexity
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-mono">
                    O(1)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    Stable
                  </span>
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
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                  >
                    {/* Array Visualization */}
                    <div className="flex justify-center items-center gap-3 flex-wrap min-h-[180px] relative">
                      {/* Render all cards */}
                      {currentStep.array.map((value, idx) => (
                        <motion.div
                          key={`${idx}-${value}`}
                          layout
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 35
                          }}
                        >
                          <AnimatedCard
                            value={value}
                            index={idx}
                            color={getCardColor(idx)}
                            isActive={idx === currentStep.currentMinIndex}
                            isScanning={isCardScanning(idx)}
                            isSwapping={isCardSwapping(idx)}
                            showTooltip={showTooltips}
                            isSorted={isCardSorted(idx)}
                            isSelected={isCardSelected(idx)}
                            isMinCandidate={isCardMinCandidate(idx)}
                          />
                        </motion.div>
                      ))}

                      {/* Visual indicator for minimum movement path */}
                      {selectedMin && selectedMin.toIndex !== -1 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-x-0 top-0 flex justify-center pointer-events-none"
                        >
                          <motion.div
                            animate={{
                              x: (selectedMin.toIndex - selectedMin.fromIndex) * 76,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 100,
                              damping: 15,
                              duration: 0.8
                            }}
                            className="relative"
                          >
                            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                              <motion.div
                                initial={{ scale: 0.8, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm whitespace-nowrap shadow-lg"
                              >
                                🔄 Moving minimum {selectedMin.value}
                              </motion.div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </div>

                    {/* Current operation indicator */}
                    {currentStep.currentMinIndex >= 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center"
                      >
                        <div
                          className={`px-4 py-2 rounded-full ${
                            isDarkMode
                              ? currentStep.type === "scan"
                                ? "bg-blue-500/20 text-blue-300"
                                : currentStep.type === "select"
                                  ? "bg-pink-500/20 text-pink-300"
                                  : "bg-orange-500/20 text-orange-300"
                              : currentStep.type === "scan"
                                ? "bg-blue-100 text-blue-700"
                                : currentStep.type === "select"
                                  ? "bg-pink-100 text-pink-700"
                                  : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          <span className="font-medium">
                            {currentStep.type === "scan" && "🔍 Scanning for minimum... "}
                            {currentStep.type === "select" && "⭐ Minimum found: "}
                            {currentStep.type === "swap" && currentStep.swapIndices[0] !== -1 && "🔄 Swapping into place: "}
                            {currentStep.type === "swap" && currentStep.swapIndices[0] === -1 && "✓ Already in place "}
                            {currentStep.type === "select" && (
                              <span className="font-bold">
                                {currentStep.newMinValue}
                              </span>
                            )}
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* Legend */}
                    <div className="flex justify-center gap-4 text-sm flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Sorted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Current Min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Selected Min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Scanning</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Swapping</span>
                      </div>
                    </div>

                    {/* Current Operation Info */}
                    <div
                      className={`text-center p-4 rounded-xl ${
                        isDarkMode ? "bg-gray-700/50" : "bg-gray-50/50"
                      }`}
                    >
                      <span
                        className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}
                      >
                        {currentStep.type === "scan" && "🔍 Scanning for minimum..."}
                        {currentStep.type === "select" && "⭐ Minimum selected!"}
                        {currentStep.type === "swap" &&
                          (currentStep.swapIndices[0] !== -1
                            ? "🔄 Swapping minimum into position"
                            : "✓ Already in correct position")}
                        {currentStep.type === "complete" && "✨ Sorting Complete!"}
                      </span>
                      {currentStep.type === "swap" && currentStep.swapIndices[0] !== -1 && (
                        <span className={`ml-2 text-sm ${isDarkMode ? "text-orange-300" : "text-orange-600"}`}>
                          (Swapping positions {currentStep.swapIndices[0]} and {currentStep.swapIndices[1]})
                        </span>
                      )}
                    </div>

                    {/* Explanation Card (Beginner Mode) */}
                    {mode === "beginner" && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={`mt-4 p-6 rounded-2xl ${
                          isDarkMode
                            ? "bg-gray-700/50 border border-gray-600"
                            : "bg-white/50 border border-gray-200"
                        } backdrop-blur-sm`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">💭</span>
                          <div>
                            <p
                              className={`font-medium mb-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}
                            >
                              {currentStep.explanation}
                            </p>
                            <p
                              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                            >
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
              <h3
                className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                💻 JavaScript Code
              </h3>

              <div
                className={`relative rounded-xl overflow-hidden ${
                  isDarkMode ? "bg-gray-900" : "bg-gray-50"
                }`}
              >
                <pre className="p-4 text-sm font-mono overflow-x-auto">
                  {codeSnippet.split("\n").map((line, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        backgroundColor:
                          currentStep?.codeLine === idx + 1
                            ? isDarkMode
                              ? "#374151"
                              : "#D1FAE5"
                            : "transparent",
                        borderLeft:
                          currentStep?.codeLine === idx + 1
                            ? "3px solid #10B981"
                            : "3px solid transparent",
                        x: currentStep?.codeLine === idx + 1 ? 5 : 0
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="px-2 py-0.5 rounded"
                    >
                      <code
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }
                      >
                        {line}
                      </code>
                    </motion.div>
                  ))}
                </pre>
              </div>

              <div className="mt-3 text-center">
                <span className={`px-3 py-1 rounded-full text-xs ${
                  isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                }`}>
                  🔵 Line {currentStep?.codeLine || 1} executing
                </span>
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
              <h3
                className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                📍 Progress
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      Step
                    </span>
                    <span
                      className={isDarkMode ? "text-white" : "text-gray-800"}
                    >
                      {currentStepIndex + 1} / {steps.length}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                      }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      Sorted Elements
                    </span>
                    <span
                      className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
                    >
                      {currentStep?.sortedBoundary || 0} / {inputArray.length}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      Current Operation
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        currentStep?.type === "scan"
                          ? "bg-blue-100 text-blue-700"
                          : currentStep?.type === "select"
                            ? "bg-pink-100 text-pink-700"
                            : currentStep?.type === "swap"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {currentStep?.type === "scan" && "🔍 Scanning"}
                      {currentStep?.type === "select" && "⭐ Selected"}
                      {currentStep?.type === "swap" && "🔄 Swapping"}
                      {currentStep?.type === "complete" && "✨ Complete"}
                    </span>
                  </div>
                </div>

                {currentStep?.type === "swap" && currentStep.swapIndices[0] !== -1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-2 rounded-lg text-sm text-center ${
                      isDarkMode
                        ? "bg-orange-500/20 text-orange-300"
                        : "bg-orange-100 text-orange-700"
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
                <h3
                  className={`font-semibold mb-3 ${isDarkMode ? "text-emerald-300" : "text-emerald-800"}`}
                >
                  💡 Selection Sort Tips
                </h3>
                <ul
                  className={`space-y-2 text-sm ${isDarkMode ? "text-emerald-200" : "text-emerald-700"}`}
                >
                  <li className="flex items-start gap-2">
                    <span>🔍</span>
                    <span>Scan unsorted portion to find minimum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>⭐</span>
                    <span>Mark the smallest element found</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>🔄</span>
                    <span>Swap it with the first unsorted element</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>📊</span>
                    <span>Only O(n) swaps total - good when swap is expensive</span>
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
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  rotate: { duration: 2, repeat: Infinity },
                  scale: { duration: 1, repeat: Infinity }
                }}
                className="text-7xl"
              >
                🎉 ✨ 🔄
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}