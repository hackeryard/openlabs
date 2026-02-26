"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/app/components/ChatContext";

// Types
type Mode = "beginner" | "expert" | "interview";
type Language = "javascript" | "python" | "java";
type PivotStrategy = "first" | "last" | "middle" | "random";

interface Step {
  type: "pivot" | "partition" | "swap" | "complete";
  array: number[];
  pivotIndex: number;
  leftIndex: number;
  rightIndex: number;
  partitionIndex?: number;
  depth: number;
  explanation: string;
  insight: string;
  codeLine: number;
  swapIndices?: [number, number]; // Track which indices are swapping
}

interface TreeNode {
  id: string;
  value: number;
  indices: [number, number];
  left?: TreeNode;
  right?: TreeNode;
  depth: number;
  isActive: boolean;
  isPivot: boolean;
}

export default function QuickSortVisualizer() {
  // Chatbot
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "Quick Sort",
      theory: "Quick Sort Data Structure Visualizer",
      extraContext: ``,
    });
  }, []);
  // ================= STATE MANAGEMENT =================
  const [inputArray, setInputArray] = useState<number[]>([
    38, 27, 43, 3, 9, 82, 10,
  ]);
  const [inputString, setInputString] = useState("38, 27, 43, 3, 9, 82, 10");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<Mode>("beginner");
  const [language, setLanguage] = useState<Language>("javascript");
  const [pivotStrategy, setPivotStrategy] = useState<PivotStrategy>("last");
  const [speed, setSpeed] = useState(800);
  const [recursionTree, setRecursionTree] = useState<TreeNode | null>(null);
  const [stats, setStats] = useState({
    comparisons: 0,
    swaps: 0,
    partitions: 0,
    maxDepth: 0,
    memoryUsage: 0,
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // ================= QUICK SORT ALGORITHM WITH STEP GENERATION =================
  const generateSteps = useCallback(
    (arr: number[], strategy: PivotStrategy): Step[] => {
      const steps: Step[] = [];
      const array = [...arr];
      let comparisons = 0;
      let swaps = 0;
      let partitions = 0;

      const buildRecursionTree = (
        subarray: number[],
        startIdx: number,
        endIdx: number,
        depth: number = 0,
      ): TreeNode | null => {
        if (startIdx > endIdx) return null;

        const mid = Math.floor((startIdx + endIdx) / 2);
        const node: TreeNode = {
          id: Math.random().toString(36).substr(2, 9),
          value: array[mid],
          indices: [startIdx, endIdx],
          depth,
          isActive: false,
          isPivot: false,
        };

        if (startIdx < endIdx) {
          node.left = buildRecursionTree(array, startIdx, mid - 1, depth + 1);
          node.right = buildRecursionTree(array, mid + 1, endIdx, depth + 1);
        }

        return node;
      };

      const choosePivot = (low: number, high: number): number => {
        switch (strategy) {
          case "first":
            return low;
          case "last":
            return high;
          case "middle":
            return Math.floor((low + high) / 2);
          case "random":
            return Math.floor(Math.random() * (high - low + 1)) + low;
          default:
            return high;
        }
      };

      const partition = (arr: number[], low: number, high: number): number => {
        partitions++;
        const pivotIndex = choosePivot(low, high);
        const pivotValue = arr[pivotIndex];

        // Move pivot to end
        if (pivotIndex !== high) {
          [arr[pivotIndex], arr[high]] = [arr[high], arr[pivotIndex]];
          swaps++;
          
          steps.push({
            type: "swap",
            array: [...arr],
            pivotIndex: high,
            leftIndex: low,
            rightIndex: high - 1,
            depth: low === 0 && high === arr.length - 1 ? 0 : 1,
            explanation: `Moving pivot ${pivotValue} to the end`,
            insight: "Pivot is moved to the end for easier partitioning",
            codeLine: 5,
            swapIndices: [pivotIndex, high],
          });
        }

        steps.push({
          type: "pivot",
          array: [...arr],
          pivotIndex: high,
          leftIndex: low,
          rightIndex: high - 1,
          depth: low === 0 && high === arr.length - 1 ? 0 : 1,
          explanation: `Selected pivot: ${pivotValue} at position ${high}`,
          insight:
            strategy === "random"
              ? "Random pivot helps avoid worst-case O(n²) on sorted arrays"
              : `${strategy} element pivot strategy chosen`,
          codeLine: 5,
        });

        let i = low - 1;

        for (let j = low; j < high; j++) {
          comparisons++;

          steps.push({
            type: "partition",
            array: [...arr],
            pivotIndex: high,
            leftIndex: i + 1,
            rightIndex: j,
            depth: low === 0 && high === arr.length - 1 ? 0 : 1,
            explanation: `Comparing ${arr[j]} with pivot ${pivotValue}`,
            insight:
              arr[j] <= pivotValue
                ? `${arr[j]} is ≤ pivot, will move to left partition`
                : `${arr[j]} is > pivot, stays in right partition`,
            codeLine: 8,
          });

          if (arr[j] <= pivotValue) {
            i++;
            if (i !== j) {
              [arr[i], arr[j]] = [arr[j], arr[i]];
              swaps++;

              steps.push({
                type: "swap",
                array: [...arr],
                pivotIndex: high,
                leftIndex: i,
                rightIndex: j,
                partitionIndex: i,
                depth: low === 0 && high === arr.length - 1 ? 0 : 1,
                explanation: `Swapped ${arr[i]} and ${arr[j]}`,
                insight: "Elements smaller than pivot move to the left",
                codeLine: 10,
                swapIndices: [i, j],
              });
            }
          }
        }

        // Place pivot in correct position
        if (i + 1 !== high) {
          [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
          swaps++;

          steps.push({
            type: "swap",
            array: [...arr],
            pivotIndex: i + 1,
            leftIndex: low,
            rightIndex: high,
            partitionIndex: i + 1,
            depth: low === 0 && high === arr.length - 1 ? 0 : 1,
            explanation: `Pivot placed at position ${i + 1}`,
            insight: "All elements left of pivot are smaller, right are larger",
            codeLine: 16,
            swapIndices: [i + 1, high],
          });
        }

        return i + 1;
      };

      const quickSort = (
        arr: number[],
        low: number,
        high: number,
        depth: number = 0,
      ) => {
        if (low < high) {
          const pi = partition(arr, low, high);

          quickSort(arr, low, pi - 1, depth + 1);
          quickSort(arr, pi + 1, high, depth + 1);
        }
      };

      // Build initial recursion tree
      const tree = buildRecursionTree(array, 0, array.length - 1);
      setRecursionTree(tree);

      quickSort(array, 0, array.length - 1);

      steps.push({
        type: "complete",
        array: [...array],
        pivotIndex: -1,
        leftIndex: -1,
        rightIndex: -1,
        depth: 0,
        explanation: "✨ Quick Sort complete! The array is now fully sorted.",
        insight:
          "Average time complexity: O(n log n) | Space complexity: O(log n)",
        codeLine: 22,
      });

      setStats({
        comparisons,
        swaps,
        partitions,
        maxDepth: Math.max(...steps.map((s) => s.depth)),
        memoryUsage: Math.log2(arr.length) * 8, // Stack space estimation
      });

      return steps;
    },
    [],
  );

  // ================= INITIALIZATION =================
  useEffect(() => {
    reset();
  }, [pivotStrategy]);

  const reset = () => {
    const arr = inputString
      .split(",")
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n));

    setInputArray(arr);
    setSteps(generateSteps(arr, pivotStrategy));
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

    const timer = setTimeout(
      () => {
        setCurrentStepIndex((i) => i + 1);

        // Update recursion tree active node
        if (recursionTree) {
          updateTreeActiveNode(
            recursionTree,
            steps[currentStepIndex + 1]?.depth || 0,
          );
        }
      },
      mode === "beginner" ? speed : speed / 2,
    );

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps, mode, speed, recursionTree]);

  const updateTreeActiveNode = (
    node: TreeNode,
    targetDepth: number,
  ): boolean => {
    if (node.depth === targetDepth) {
      node.isActive = true;
      return true;
    }

    node.isActive = false;
    let found = false;

    if (node.left && updateTreeActiveNode(node.left, targetDepth)) found = true;
    if (node.right && updateTreeActiveNode(node.right, targetDepth))
      found = true;

    return found;
  };

  const currentStep = steps[currentStepIndex];

  // ================= CODE SNIPPETS =================
  const codeSnippets = {
    javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
    python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
    
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
    java: `public class QuickSort {
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
    
    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        
        return i + 1;
    }
}`,
  };

  // ================= RENDER RECURSION TREE =================
  const renderTreeNode = (
    node: TreeNode,
    x: number = 0,
    y: number = 0,
    level: number = 0,
  ) => {
    if (!node) return null;

    const horizontalSpacing = Math.max(60, 180 / (level + 1));
    const verticalSpacing = 70;

    return (
      <g key={node.id}>
        {node.left && (
          <>
            <line
              x1={x}
              y1={y}
              x2={x - horizontalSpacing}
              y2={y + verticalSpacing}
              stroke={isDarkMode ? "#4B5563" : "#CBD5E1"}
              strokeWidth="2"
              strokeDasharray="4,3"
            />
            {renderTreeNode(
              node.left,
              x - horizontalSpacing,
              y + verticalSpacing,
              level + 1,
            )}
          </>
        )}
        {node.right && (
          <>
            <line
              x1={x}
              y1={y}
              x2={x + horizontalSpacing}
              y2={y + verticalSpacing}
              stroke={isDarkMode ? "#4B5563" : "#CBD5E1"}
              strokeWidth="2"
              strokeDasharray="4,3"
            />
            {renderTreeNode(
              node.right,
              x + horizontalSpacing,
              y + verticalSpacing,
              level + 1,
            )}
          </>
        )}
        <motion.g
          initial={{ scale: 0 }}
          animate={{
            scale: node.isActive ? 1.2 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <circle
            cx={x}
            cy={y}
            r={Math.max(18, 25 - level * 2)}
            fill={
              node.isActive ? "#F59E0B" : isDarkMode ? "#374151" : "#F3F4F6"
            }
            stroke={node.isPivot ? "#10B981" : "#F59E0B"}
            strokeWidth="2"
            className="cursor-pointer transition-all duration-300 hover:filter hover:drop-shadow-lg"
          />
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dy=".3em"
            fill={node.isActive ? "white" : isDarkMode ? "#E5E7EB" : "#1F2937"}
            fontSize="10"
            fontWeight="500"
            className="select-none"
          >
            {node.value}
          </text>
        </motion.g>
      </g>
    );
  };

  // ================= SMOOTH ANIMATED BAR COMPONENT =================
  const AnimatedBar = ({ 
    value, 
    index, 
    color, 
    isActive = false,
    showTooltip = false,
    isSwapping = false,
    swapDirection = "right"
  }: { 
    value: number; 
    index: number; 
    color: string; 
    isActive?: boolean;
    showTooltip?: boolean;
    isSwapping?: boolean;
    swapDirection?: "left" | "right";
  }) => {
    const maxValue = currentStep ? Math.max(...currentStep.array) : 100;
    const height = (value / maxValue) * 180 + 20;

    return (
      <motion.div
        layout
        layoutId={`bar-${index}-${value}`}
        initial={false}
        animate={{ 
          scale: isActive ? 1.1 : 1,
          y: isActive ? -5 : 0,
          backgroundColor: color,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 30,
            mass: 1,
            backgroundColor: { duration: 0.3 }
          }
        }}
        whileHover={{ scale: 1.05 }}
        className="relative group cursor-pointer"
        style={{ height: `${height}px` }}
      >
        {/* Bar with gradient and effects */}
        <motion.div 
          className="w-full h-full rounded-t-lg shadow-lg relative overflow-hidden"
          style={{ 
            background: `linear-gradient(180deg, ${color}dd 0%, ${color} 80%)`,
            boxShadow: isSwapping ? '0 0 20px rgba(245, 158, 11, 0.6)' : undefined
          }}
        >
          {/* Swirl effect during swap */}
          {isSwapping && (
            <motion.div
              initial={{ scale: 0, opacity: 0.5, rotate: 0 }}
              animate={{
                scale: [1, 1.8, 0],
                opacity: [0.6, 1, 0],
                rotate: 360
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeOut"
              }}
              className="absolute inset-0 bg-orange-300 rounded-full blur-xl"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px'
              }}
            />
          )}

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 1
            }}
          />

          {/* Particle effects during swap */}
          {isSwapping && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 0.5 }}
                  animate={{
                    x: [0, (i % 2 === 0 ? 20 : -20)],
                    y: [-10, -30],
                    opacity: [0.5, 0],
                    scale: [1, 0.5]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeOut"
                  }}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                  style={{ left: '50%', top: '50%' }}
                />
              ))}
            </>
          )}
        </motion.div>

        {/* Value label */}
        <motion.div 
          layout
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-mono font-bold"
        >
          {value}
        </motion.div>

        {/* Index label */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">
          {index}
        </div>

        {/* Pivot crown for pivot element */}
        {currentStep?.pivotIndex === index && (
          <motion.div
            initial={{ scale: 0, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            className="absolute -top-8 left-1/2 transform -translate-x-1/2"
          >
            <span className="text-lg">👑</span>
          </motion.div>
        )}

        {/* Tooltip */}
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10"
          >
            <div
              className={`px-2 py-1 text-xs rounded-lg whitespace-nowrap ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-white text-gray-800"
              } shadow-lg`}
            >
              Index: {index}, Value: {value}
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  // ================= HELPER FUNCTIONS =================
  const getBarColor = (index: number) => {
    if (!currentStep) return isDarkMode ? "#4B5563" : "#93C5FD";

    if (index === currentStep.pivotIndex) {
      return "#F59E0B"; // Orange for pivot
    }
    if (index === currentStep.leftIndex) {
      return "#10B981"; // Green for left pointer
    }
    if (index === currentStep.rightIndex) {
      return "#EF4444"; // Red for right pointer
    }
    if (
      currentStep.partitionIndex !== undefined &&
      index <= currentStep.partitionIndex
    ) {
      return "#8B5CF6"; // Purple for partitioned left
    }

    return isDarkMode ? "#4B5563" : "#93C5FD";
  };

  const isBarSwapping = (index: number): boolean => {
    return currentStep?.swapIndices?.includes(index) || false;
  };

  const getSwapDirection = (index: number): "left" | "right" => {
    if (!currentStep?.swapIndices) return "right";
    const [i, j] = currentStep.swapIndices;
    if (index === i) return "right";
    if (index === j) return "left";
    return "right";
  };

  // ================= MAIN RENDER =================
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900"
          : "bg-gradient-to-br from-slate-50 via-orange-50 to-white"
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
          className="absolute top-0 -left-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
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
          className="absolute top-0 -right-4 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
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
                className={`text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent`}
              >
                Quick Sort Studio
              </h1>
              <p
                className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Watch elements glide and swap with smooth animations
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
                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
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
                placeholder="Enter numbers (e.g., 38, 27, 43, 3)"
                className={`w-full px-4 py-3 rounded-xl backdrop-blur-sm border ${
                  isDarkMode
                    ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white/50 border-gray-200 text-gray-800 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all`}
              />

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={reset}
                  className="px-4 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all font-medium"
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

            {/* Pivot Strategy Card */}
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
              <h3
                className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                🎯 Pivot Strategy
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {(["first", "last", "middle", "random"] as PivotStrategy[]).map(
                  (strategy) => (
                    <motion.button
                      key={strategy}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPivotStrategy(strategy)}
                      className={`px-3 py-2 rounded-lg text-sm capitalize transition-all ${
                        pivotStrategy === strategy
                          ? "bg-orange-500 text-white shadow-lg"
                          : isDarkMode
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {strategy}
                    </motion.button>
                  ),
                )}
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
              <h3
                className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                🎮 Playback Controls
              </h3>

              <div className="flex justify-between gap-2 mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
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
              <h3
                className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                📈 Algorithm Insights
              </h3>

              <div className="space-y-3">
                <motion.div 
                  className="flex justify-between items-center"
                  key={stats.comparisons}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
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
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
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
                  key={stats.partitions}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    Partitions
                  </span>
                  <span
                    className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {stats.partitions}
                  </span>
                </motion.div>
                <motion.div 
                  className="flex justify-between items-center"
                  key={stats.maxDepth}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    Max Depth
                  </span>
                  <span
                    className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {stats.maxDepth}
                  </span>
                </motion.div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />
                <div className="flex justify-between items-center">
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    Time Complexity
                  </span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-mono">
                    O(n log n) avg
                  </span>
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
              {currentStep && (
                <motion.div
                  key={currentStepIndex}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  {/* Array Visualization with Smooth Bars */}
                  <div className="flex justify-center items-end gap-4 h-64 px-4">
                    {currentStep.array.map((value, idx) => (
                      <motion.div
                        key={`${idx}-${value}`}
                        layout
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 40,
                          mass: 1.2
                        }}
                        className="w-12"
                      >
                        <AnimatedBar
                          value={value}
                          index={idx}
                          color={getBarColor(idx)}
                          isActive={
                            idx === currentStep.pivotIndex ||
                            idx === currentStep.leftIndex ||
                            idx === currentStep.rightIndex
                          }
                          showTooltip={showTooltips}
                          isSwapping={isBarSwapping(idx)}
                          swapDirection={getSwapDirection(idx)}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Legend */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center gap-6 text-sm flex-wrap"
                  >
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-amber-500"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                      <span
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }
                      >
                        Pivot
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-emerald-500"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                      />
                      <span
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }
                      >
                        Left Pointer
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-red-500"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                      />
                      <span
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }
                      >
                        Right Pointer
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-purple-500"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 1.5 }}
                      />
                      <span
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }
                      >
                        Partitioned
                      </span>
                    </div>
                  </motion.div>

                  {/* Pointer Indicators with Bounce */}
                  <motion.div 
                    className="flex justify-center gap-4 text-sm font-mono flex-wrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {currentStep.leftIndex >= 0 && (
                      <motion.div 
                        className="flex items-center gap-2"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <span className={isDarkMode ? "text-emerald-400" : "text-emerald-600"}>
                          ← Left: {currentStep.leftIndex} ({currentStep.array[currentStep.leftIndex]})
                        </span>
                      </motion.div>
                    )}
                    {currentStep.rightIndex >= 0 && (
                      <motion.div 
                        className="flex items-center gap-2"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                      >
                        <span className={isDarkMode ? "text-red-400" : "text-red-600"}>
                          Right: {currentStep.rightIndex} ({currentStep.array[currentStep.rightIndex]}) →
                        </span>
                      </motion.div>
                    )}
                    {currentStep.pivotIndex >= 0 && (
                      <motion.div 
                        className="flex items-center gap-2"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <span className={isDarkMode ? "text-amber-400" : "text-amber-600"}>
                          👑 Pivot: {currentStep.array[currentStep.pivotIndex]}
                        </span>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Explanation Card (Beginner Mode) */}
                  {mode === "beginner" && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className={`mt-8 p-6 rounded-2xl ${
                        isDarkMode
                          ? "bg-gray-700/50 border border-gray-600"
                          : "bg-white/50 border border-gray-200"
                      } backdrop-blur-sm`}
                    >
                      <div className="flex items-start gap-3">
                        <motion.span
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="text-2xl"
                        >
                          💭
                        </motion.span>
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
            </motion.div>

            {/* Recursion Tree Visualization */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`backdrop-blur-xl rounded-3xl p-6 ${
                isDarkMode
                  ? "bg-gray-800/50 border border-gray-700"
                  : "bg-white/70 border border-white/20"
              } shadow-xl overflow-x-auto`}
            >
              <h3
                className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                🌳 Recursion Tree
              </h3>
              <div className="min-w-[800px] h-[350px] relative">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 350"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {recursionTree && renderTreeNode(recursionTree, 400, 40, 0)}
                </svg>
              </div>
              <div className="flex justify-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-3 h-3 rounded-full bg-amber-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    Active Node
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-3 h-3 rounded-full border-2 border-emerald-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                  />
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    Pivot Node
                  </span>
                </div>
              </div>
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
              <div className="flex justify-between items-center mb-4">
                <h3
                  className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}
                >
                  💻 Code
                </h3>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className={`px-2 py-1 text-sm rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  } border`}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <div
                className={`relative rounded-xl overflow-hidden ${
                  isDarkMode ? "bg-gray-900" : "bg-gray-50"
                }`}
              >
                <pre className="p-4 text-sm font-mono overflow-x-auto">
                  {codeSnippets[language].split("\n").map((line, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        backgroundColor:
                          currentStep?.codeLine === idx + 1
                            ? isDarkMode
                              ? "#374151"
                              : "#FEE2E2"
                            : "transparent",
                        borderLeft:
                          currentStep?.codeLine === idx + 1
                            ? "4px solid #F59E0B"
                            : "4px solid transparent",
                        x: currentStep?.codeLine === idx + 1 ? 5 : 0
                      }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
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
                      transition={{ 
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        duration: 0.5 
                      }}
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <motion.div 
                    className="flex justify-between text-sm"
                    key={currentStep?.type}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      Current Operation
                    </span>
                    <motion.span
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        currentStep?.type === "pivot"
                          ? "bg-amber-100 text-amber-700"
                          : currentStep?.type === "partition"
                            ? "bg-blue-100 text-blue-700"
                            : currentStep?.type === "swap"
                              ? "bg-green-100 text-green-700"
                              : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {currentStep?.type || "Ready"}
                    </motion.span>
                  </motion.div>

                  <motion.div 
                    className="flex justify-between text-sm"
                    key={currentStep?.depth}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      Current Depth
                    </span>
                    <motion.span
                      initial={{ y: -5 }}
                      animate={{ y: 0 }}
                      className={`font-mono ${isDarkMode ? "text-white" : "text-gray-800"}`}
                    >
                      {currentStep?.depth || 0}
                    </motion.span>
                  </motion.div>

                  {currentStep?.pivotIndex !== undefined &&
                    currentStep.pivotIndex >= 0 && (
                      <motion.div 
                        className="flex justify-between text-sm"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                      >
                        <span
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          Pivot Value
                        </span>
                        <motion.span 
                          className={`font-mono font-bold text-amber-500`}
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          {currentStep.array[currentStep.pivotIndex]}
                        </motion.span>
                      </motion.div>
                    )}
                </div>
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
                <h3
                  className={`font-semibold mb-3 ${isDarkMode ? "text-amber-300" : "text-amber-800"}`}
                >
                  💡 Quick Tips
                </h3>
                <motion.ul
                  className={`space-y-2 text-sm ${isDarkMode ? "text-amber-200" : "text-amber-700"}`}
                >
                  {[
                    "Pivot selection affects performance",
                    "Elements smaller than pivot go left, larger go right",
                    "Watch the pointers move during partition",
                    "Try different pivot strategies",
                  ].map((tip, i) => (
                    <motion.li
                      key={i}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-start gap-2"
                    >
                      <motion.span
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                      >
                        •
                      </motion.span>
                      <span>{tip}</span>
                    </motion.li>
                  ))}
                </motion.ul>
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
                🎉
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}