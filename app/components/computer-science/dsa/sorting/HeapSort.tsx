"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Types
type Mode = "beginner" | "expert" | "interview";
type HeapType = "max" | "min";

interface Step {
  type: "buildHeap" | "heapify" | "swap" | "extract" | "complete";
  array: number[];
  heapIndex: number;
  compareIndices: [number, number];
  swapped: boolean;
  heapSize: number;
  level: number;
  explanation: string;
  insight: string;
  codeLine: number;
}

interface HeapNode {
  value: number;
  index: number;
  isHeapified: boolean;
  isActive: boolean;
}

export default function HeapSortVisualizer() {
  // ================= STATE MANAGEMENT =================
  const [inputArray, setInputArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [inputString, setInputString] = useState("64, 34, 25, 12, 22, 11, 90");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<Mode>("beginner");
  const [heapType, setHeapType] = useState<HeapType>("max");
  const [speed, setSpeed] = useState(800);
  const [stats, setStats] = useState({
    comparisons: 0,
    swaps: 0,
    heapifyCalls: 0,
    heapSize: 0,
    totalLevels: 0,
  });
  const [heapTree, setHeapTree] = useState<HeapNode[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // ================= HEAP SORT ALGORITHM WITH STEP GENERATION =================
  const generateSteps = useCallback((arr: number[], type: HeapType): Step[] => {
    const steps: Step[] = [];
    const array = [...arr];
    let comparisons = 0;
    let swaps = 0;
    let heapifyCalls = 0;
    
    const n = array.length;

    // Helper function to get heap tree nodes
    const updateHeapTree = (arr: number[], heapSize: number) => {
      const nodes: HeapNode[] = [];
      for (let i = 0; i < arr.length; i++) {
        nodes.push({
          value: arr[i],
          index: i,
          isHeapified: i >= heapSize,
          isActive: false,
        });
      }
      setHeapTree(nodes);
    };

    // Heapify function
    const heapify = (arr: number[], n: number, i: number, level: number = 0) => {
      heapifyCalls++;
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      // Calculate current level in heap tree
      const currentLevel = Math.floor(Math.log2(i + 1));

      // Compare with left child
      if (left < n) {
        comparisons++;
        steps.push({
          type: "heapify",
          array: [...arr],
          heapIndex: i,
          compareIndices: [i, left],
          swapped: false,
          heapSize: n,
          level: currentLevel,
          explanation: `Comparing parent ${arr[i]} with left child ${arr[left]}`,
          insight: type === "max" 
            ? `Checking if ${arr[left]} is greater than ${arr[i]}` 
            : `Checking if ${arr[left]} is smaller than ${arr[i]}`,
          codeLine: 8,
        });

        if ((type === "max" && arr[left] > arr[largest]) || 
            (type === "min" && arr[left] < arr[largest])) {
          largest = left;
        }
      }

      // Compare with right child
      if (right < n) {
        comparisons++;
        steps.push({
          type: "heapify",
          array: [...arr],
          heapIndex: i,
          compareIndices: [i, right],
          swapped: false,
          heapSize: n,
          level: currentLevel,
          explanation: `Comparing ${type === "max" ? "largest" : "smallest"} so far ${arr[largest]} with right child ${arr[right]}`,
          insight: `Right child exists at index ${right}`,
          codeLine: 12,
        });

        if ((type === "max" && arr[right] > arr[largest]) || 
            (type === "min" && arr[right] < arr[largest])) {
          largest = right;
        }
      }

      // Swap if needed
      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        swaps++;

        steps.push({
          type: "heapify",
          array: [...arr],
          heapIndex: largest,
          compareIndices: [i, largest],
          swapped: true,
          heapSize: n,
          level: currentLevel,
          explanation: `Swapped ${arr[i]} and ${arr[largest]} to maintain heap property`,
          insight: `${type === "max" ? "Larger" : "Smaller"} element moves up`,
          codeLine: 16,
        });

        updateHeapTree(arr, n);
        heapify(arr, n, largest, level + 1);
      }
    };

    // Build heap
    steps.push({
      type: "buildHeap",
      array: [...array],
      heapIndex: -1,
      compareIndices: [-1, -1],
      swapped: false,
      heapSize: n,
      level: 0,
      explanation: `Building a ${type} heap from the array`,
      insight: `Heap property: ${type === "max" ? "Parent ≥ Children" : "Parent ≤ Children"}`,
      codeLine: 4,
    });

    updateHeapTree(array, n);

    // Build heap (rearrange array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(array, n, i);
    }

    steps.push({
      type: "buildHeap",
      array: [...array],
      heapIndex: -1,
      compareIndices: [-1, -1],
      swapped: false,
      heapSize: n,
      level: 0,
      explanation: `✨ ${type === "max" ? "Max" : "Min"} heap built successfully!`,
      insight: `Root contains the ${type === "max" ? "largest" : "smallest"} element: ${array[0]}`,
      codeLine: 20,
    });

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
      steps.push({
        type: "extract",
        array: [...array],
        heapIndex: 0,
        compareIndices: [0, i],
        swapped: false,
        heapSize: i,
        level: 0,
        explanation: `Extracting ${type === "max" ? "maximum" : "minimum"} element ${array[0]}`,
        insight: `Moving root to position ${i} (sorted portion)`,
        codeLine: 24,
      });

      // Move current root to end
      [array[0], array[i]] = [array[i], array[0]];
      swaps++;

      steps.push({
        type: "swap",
        array: [...array],
        heapIndex: 0,
        compareIndices: [0, i],
        swapped: true,
        heapSize: i,
        level: 0,
        explanation: `Swapped root with last element`,
        insight: `Element ${array[i]} is now in its final sorted position`,
        codeLine: 26,
      });

      updateHeapTree(array, i);

      // Heapify reduced heap
      heapify(array, i, 0);
    }

    steps.push({
      type: "complete",
      array: [...array],
      heapIndex: -1,
      compareIndices: [-1, -1],
      swapped: false,
      heapSize: 0,
      level: 0,
      explanation: "✨ Heap Sort complete! The array is now fully sorted.",
      insight: `Time complexity: O(n log n) | Space complexity: O(1)`,
      codeLine: 30,
    });

    setStats({
      comparisons,
      swaps,
      heapifyCalls,
      heapSize: n,
      totalLevels: Math.floor(Math.log2(n)) + 1,
    });

    return steps;
  }, []);

  // ================= INITIALIZATION =================
  useEffect(() => {
    reset();
  }, [heapType]);

  const reset = () => {
    const arr = inputString
      .split(",")
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n));
    
    setInputArray(arr);
    setSteps(generateSteps(arr, heapType));
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

  // ================= JAVASCRIPT CODE SNIPPETS (ONLY) =================
  const codeSnippets = {
    max: `function heapSort(arr) {
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
    min: `function heapSort(arr) {
  const n = arr.length;

  // Build min heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, n, i) {
  let smallest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] < arr[smallest]) {
    smallest = left;
  }

  if (right < n && arr[right] < arr[smallest]) {
    smallest = right;
  }

  if (smallest !== i) {
    [arr[i], arr[smallest]] = [arr[smallest], arr[i]];
    heapify(arr, n, smallest);
  }
}`,
  };

  // ================= HELPER FUNCTIONS =================
  const getBarColor = (index: number) => {
    if (!currentStep) return isDarkMode ? "#4B5563" : "#8B5CF6";
    
    const [i, j] = currentStep.compareIndices;
    
    if (index === currentStep.heapIndex) {
      return "#EC4899"; // Pink for current heapify root
    }
    if (index === i || index === j) {
      return currentStep.type === "swap" ? "#F59E0B" : "#3B82F6";
    }
    if (index < currentStep.heapSize) {
      return "#10B981"; // Green for heap portion
    }
    if (index >= currentStep.heapSize && currentStep.heapSize > 0) {
      return "#9CA3AF"; // Gray for sorted portion
    }
    
    return isDarkMode ? "#4B5563" : "#8B5CF6";
  };

  // Render heap tree visualization (ENLARGED)
  const renderHeapTree = () => {
    if (!currentStep) return null;

    const nodes = currentStep.array.map((value, idx) => ({
      value,
      idx,
      isInHeap: idx < currentStep.heapSize,
      isActive: idx === currentStep.heapIndex || 
                idx === currentStep.compareIndices[0] || 
                idx === currentStep.compareIndices[1],
    }));

    // Calculate tree layout with larger dimensions
    const levelWidths = [1, 2, 4, 8, 16];
    const nodeRadius = 35;
    const levelHeight = 90;

    return (
      <svg width="100%" height="280" viewBox="0 0 800 280" preserveAspectRatio="xMidYMid meet">
        {nodes.map((node, idx) => {
          if (idx === 0) return null;
          
          const parentIdx = Math.floor((idx - 1) / 2);
          const parent = nodes[parentIdx];
          
          // Calculate positions
          const level = Math.floor(Math.log2(idx + 1));
          const positionInLevel = idx - Math.pow(2, level) + 1;
          const levelWidth = levelWidths[level] * 80;
          const x = 400 + (positionInLevel - levelWidths[level] / 2) * levelWidth;
          const y = 50 + level * levelHeight;
          
          const parentLevel = Math.floor(Math.log2(parentIdx + 1));
          const parentPosition = parentIdx - Math.pow(2, parentLevel) + 1;
          const parentX = 400 + (parentPosition - levelWidths[parentLevel] / 2) * (levelWidths[parentLevel] * 80);
          const parentY = 50 + parentLevel * levelHeight;

          if (!parent || !parent.isInHeap) return null;

          return (
            <line
              key={`line-${idx}`}
              x1={parentX}
              y1={parentY}
              x2={x}
              y2={y}
              stroke={isDarkMode ? "#4B5563" : "#CBD5E1"}
              strokeWidth="2"
              strokeDasharray={node.isInHeap ? "none" : "5,3"}
            />
          );
        })}

        {nodes.map((node, idx) => {
          const level = Math.floor(Math.log2(idx + 1));
          const positionInLevel = idx - Math.pow(2, level) + 1;
          const levelWidth = levelWidths[level] * 80;
          const x = 400 + (positionInLevel - levelWidths[level] / 2) * levelWidth;
          const y = 50 + level * levelHeight;

          if (!node.isInHeap) return null;

          return (
            <g key={`node-${idx}`}>
              <motion.circle
                cx={x}
                cy={y}
                r={nodeRadius}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: node.isActive ? 1.2 : 1,
                  fill: node.isActive 
                    ? "#EC4899" 
                    : isDarkMode ? "#374151" : "#F3F4F6",
                  stroke: node.isActive ? "#F59E0B" : "#8B5CF6",
                }}
                transition={{ type: "spring" }}
                className="cursor-pointer"
                strokeWidth="3"
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dy=".3em"
                fill={node.isActive ? "white" : isDarkMode ? "#E5E7EB" : "#1F2937"}
                fontSize="16"
                fontWeight="600"
              >
                {node.value}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // ================= MAIN RENDER =================
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" 
        : "bg-gradient-to-br from-slate-50 via-purple-50 to-white"
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
          className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
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
          className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        />
      </div>

      {/* Main Container */}
      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header - UPDATED COLOR */}
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
                Heap Sort Visualizer
              </h1>
              <p className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Visualize the binary heap data structure and priority queue sorting
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
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
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
                placeholder="Enter numbers (e.g., 64, 34, 25, 12)"
                className={`w-full px-4 py-3 rounded-xl backdrop-blur-sm border ${
                  isDarkMode 
                    ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400" 
                    : "bg-white/50 border-gray-200 text-gray-800 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
              />
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={reset}
                  className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all font-medium"
                >
                  Apply
                </button>
                <button
                  onClick={() => setInputString("64, 34, 25, 12, 22, 11, 90")}
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

            {/* Heap Type Selection */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className={`backdrop-blur-xl rounded-2xl p-6 ${
                isDarkMode 
                  ? "bg-gray-800/50 border border-gray-700" 
                  : "bg-white/70 border border-white/20"
              } shadow-xl`}
            >
              <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                🌲 Heap Type
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "max", label: "Max Heap", desc: "Parent ≥ Children", color: "purple" },
                  { id: "min", label: "Min Heap", desc: "Parent ≤ Children", color: "pink" },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setHeapType(type.id as HeapType)}
                    className={`px-4 py-3 rounded-xl text-center transition-all ${
                      heapType === type.id
                        ? `bg-gradient-to-r from-${type.color}-500 to-${type.color === "purple" ? "pink" : "purple"}-500 text-white shadow-lg`
                        : isDarkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <div className="font-medium">{type.label}</div>
                    <div className={`text-xs ${
                      heapType === type.id ? "text-white" : isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}>{type.desc}</div>
                  </button>
                ))}
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
                📈 Heap Statistics
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
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Heapify Calls</span>
                  <span className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {stats.heapifyCalls}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Heap Size</span>
                  <span className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {currentStep?.heapSize || 0}
                  </span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Time Complexity</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-mono">
                    O(n log n)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Space Complexity</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-mono">
                    O(1)
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Center Column - Visualization */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            
            {/* Main Visualization Card - ENLARGED */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`backdrop-blur-xl rounded-3xl p-8 ${
                isDarkMode 
                  ? "bg-gray-800/50 border border-gray-700" 
                  : "bg-white/70 border border-white/20"
              } shadow-2xl min-h-[550px]`}
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
                    
                    {/* Heap Tree Visualization - ENLARGED */}
                    <div className="h-64 overflow-x-auto">
                      {renderHeapTree()}
                    </div>

                    {/* Array Visualization with Bars */}
                    <div className="flex justify-center items-end gap-2 h-48">
                      {currentStep.array.map((value, idx) => {
                        const maxValue = Math.max(...currentStep.array);
                        const height = (value / maxValue) * 140 + 20;
                        
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
                                scale: idx === currentStep.heapIndex || 
                                       idx === currentStep.compareIndices[0] || 
                                       idx === currentStep.compareIndices[1] ? 1.1 : 1,
                                y: idx === currentStep.heapIndex || 
                                    idx === currentStep.compareIndices[0] || 
                                    idx === currentStep.compareIndices[1] ? -5 : 0,
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
                              
                              {/* Heap/Sorted indicators */}
                              {idx < currentStep.heapSize && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-xs text-emerald-500">
                                  🌲
                                </div>
                              )}
                              {idx >= currentStep.heapSize && currentStep.heapSize > 0 && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                                  ✓
                                </div>
                              )}
                              
                              {/* Tooltip */}
                              {showTooltips && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                                  <div className={`px-2 py-1 text-xs rounded-lg whitespace-nowrap ${
                                    isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
                                  } shadow-lg`}>
                                    Index: {idx}, Value: {value}
                                    {idx < currentStep.heapSize ? " (Heap)" : " (Sorted)"}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Heapify Root</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Comparing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Swapping</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Heap</span>
                      </div>
                    </div>

                    {/* Current Operation Info */}
                    <div className={`text-center p-4 rounded-xl ${
                      isDarkMode ? "bg-gray-700/50" : "bg-gray-50/50"
                    }`}>
                      <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        {currentStep.type === "buildHeap" && "🏗️ Building Heap"}
                        {currentStep.type === "heapify" && `🔄 Heapify at level ${currentStep.level}`}
                        {currentStep.type === "extract" && "📤 Extracting Root"}
                        {currentStep.type === "swap" && "🔄 Swapping Elements"}
                        {currentStep.type === "complete" && "✨ Sorting Complete"}
                        {currentStep.heapSize > 0 && currentStep.heapSize < currentStep.array.length && 
                          ` | Heap Size: ${currentStep.heapSize}`}
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
            
            {/* Code Card - Now only JavaScript */}
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
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  💻 JavaScript Code
                </h3>
                <span className={`px-2 py-1 text-xs rounded-lg ${
                  heapType === "max" 
                    ? "bg-purple-100 text-purple-700" 
                    : "bg-pink-100 text-pink-700"
                }`}>
                  {heapType === "max" ? "Max Heap" : "Min Heap"}
                </span>
              </div>
              
              <div className={`relative rounded-xl overflow-hidden ${
                isDarkMode ? "bg-gray-900" : "bg-gray-50"
              }`}>
                <pre className="p-4 text-sm font-mono overflow-x-auto max-h-96">
                  {codeSnippets[heapType].split('\n').map((line, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        backgroundColor: currentStep?.codeLine === idx + 1 
                          ? isDarkMode ? "#374151" : "#F3E8FF"
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
              
              {/* Code explanation badge */}
              <div className="mt-3 text-xs text-center text-gray-500">
                <span className="px-2 py-1 bg-gray-100 rounded-full">
                  🔵 Highlighted line is executing
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
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Current Phase</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      currentStep?.type === "buildHeap" 
                        ? "bg-purple-100 text-purple-700"
                        : currentStep?.type === "heapify"
                        ? "bg-blue-100 text-blue-700"
                        : currentStep?.type === "extract"
                        ? "bg-yellow-100 text-yellow-700"
                        : currentStep?.type === "swap"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {currentStep?.type || "Ready"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Heap Size</span>
                    <span className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {currentStep?.heapSize || 0}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Sorted Portion</span>
                    <span className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {inputArray.length - (currentStep?.heapSize || 0)}
                    </span>
                  </div>
                </div>

                {currentStep?.type === "swap" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-2 rounded-lg text-sm text-center ${
                      isDarkMode ? "bg-amber-500/20 text-amber-300" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    🔄 Swapping elements to maintain heap property
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
                    ? "bg-purple-900/30 border border-purple-800" 
                    : "bg-purple-50/70 border border-purple-100"
                } shadow-xl`}
              >
                <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-purple-300" : "text-purple-800"}`}>
                  💡 Heap Sort Tips
                </h3>
                <ul className={`space-y-2 text-sm ${isDarkMode ? "text-purple-200" : "text-purple-700"}`}>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Heap is a complete binary tree</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Parent at i, children at 2i+1 and 2i+2</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Max heap: parent ≥ children</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Min heap: parent ≤ children</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Heapify ensures heap property after changes</span>
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
          background-image: linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}