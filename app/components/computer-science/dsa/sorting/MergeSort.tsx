"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/app/components/ChatContext";

// Types
type Mode = "beginner" | "expert" | "interview";
type Language = "javascript" | "python" | "java";

interface Step {
  type: "split" | "compare" | "merge" | "complete";
  leftArray: number[];
  rightArray: number[];
  mergedArray: number[];
  activeIndices: { left?: number; right?: number };
  depth: number;
  explanation: string;
  insight: string;
  codeLine: number;
}

interface TreeNode {
  id: string;
  value: number[];
  left?: TreeNode;
  right?: TreeNode;
  depth: number;
  isActive: boolean;
  isMerged: boolean;
}

export default function MergeSortVisualizer() {
  // Chatbot 
          const { setExperimentData } = useChat();
        
          useEffect(() => {
            setExperimentData({
              title: "Merge Sort",
              theory: "Merge Sort Data Structure Visualizer",
              extraContext: ``,
            });
          }, []);
  // ================= STATE MANAGEMENT =================
  const [inputArray, setInputArray] = useState<number[]>([38, 27, 43, 3, 9, 82, 10]);
  const [inputString, setInputString] = useState("38, 27, 43, 3, 9, 82, 10");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<Mode>("beginner");
  const [language, setLanguage] = useState<Language>("javascript");
  const [speed, setSpeed] = useState(800);
  const [recursionTree, setRecursionTree] = useState<TreeNode | null>(null);
  const [stats, setStats] = useState({
    comparisons: 0,
    functionCalls: 0,
    maxDepth: 0,
    memoryUsage: 0,
    mergeOperations: 0,
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // ================= MERGE SORT ALGORITHM WITH STEP GENERATION =================
  const generateSteps = useCallback((arr: number[]): Step[] => {
    const steps: Step[] = [];
    let comparisons = 0;
    let functionCalls = 0;
    let mergeOperations = 0;

    const buildRecursionTree = (array: number[], depth: number = 0): TreeNode => {
      const node: TreeNode = {
        id: Math.random().toString(36).substr(2, 9),
        value: array,
        depth,
        isActive: false,
        isMerged: false,
      };

      if (array.length > 1) {
        const mid = Math.floor(array.length / 2);
        node.left = buildRecursionTree(array.slice(0, mid), depth + 1);
        node.right = buildRecursionTree(array.slice(mid), depth + 1);
      }

      return node;
    };

    const merge = (left: number[], right: number[], depth: number): number[] => {
      const merged: number[] = [];
      let i = 0, j = 0;
      
      mergeOperations++;
      
      while (i < left.length && j < right.length) {
        comparisons++;
        
        steps.push({
          type: "compare",
          leftArray: left,
          rightArray: right,
          mergedArray: [...merged],
          activeIndices: { left: i, right: j },
          depth,
          explanation: `Comparing ${left[i]} and ${right[j]} to determine which is smaller.`,
          insight: "We compare the smallest unmerged elements from both halves.",
          codeLine: 8,
        });

        if (left[i] <= right[j]) {
          merged.push(left[i]);
          i++;
        } else {
          merged.push(right[j]);
          j++;
        }

        steps.push({
          type: "merge",
          leftArray: left,
          rightArray: right,
          mergedArray: [...merged],
          activeIndices: { left: i - 1, right: j - 1 },
          depth,
          explanation: `Placing ${merged[merged.length - 1]} into the merged array.`,
          insight: "Smaller elements are merged first to maintain sorted order.",
          codeLine: 10,
        });
      }

      // Add remaining elements
      const remaining = [...merged, ...left.slice(i), ...right.slice(j)];
      
      steps.push({
        type: "merge",
        leftArray: left,
        rightArray: right,
        mergedArray: remaining,
        activeIndices: {},
        depth,
        explanation: "All elements merged! This subarray is now sorted.",
        insight: "Merging two sorted arrays takes O(n) time.",
        codeLine: 16,
      });

      return remaining;
    };

    const sort = (array: number[], depth: number = 0): number[] => {
      functionCalls++;

      if (array.length <= 1) {
        steps.push({
          type: "split",
          leftArray: array,
          rightArray: [],
          mergedArray: [],
          activeIndices: {},
          depth,
          explanation: `Base case reached: array [${array}] is already sorted.`,
          insight: "Arrays of size 0 or 1 are trivially sorted.",
          codeLine: 4,
        });
        return array;
      }

      const mid = Math.floor(array.length / 2);
      
      steps.push({
        type: "split",
        leftArray: array.slice(0, mid),
        rightArray: array.slice(mid),
        mergedArray: [],
        activeIndices: {},
        depth,
        explanation: `Dividing array into [${array.slice(0, mid)}] and [${array.slice(mid)}]`,
        insight: "Division continues until we reach single elements.",
        codeLine: 5,
      });

      const left = sort(array.slice(0, mid), depth + 1);
      const right = sort(array.slice(mid), depth + 1);
      
      return merge(left, right, depth);
    };

    const tree = buildRecursionTree(arr);
    setRecursionTree(tree);
    
    sort(arr);
    
    steps.push({
      type: "complete",
      leftArray: [],
      rightArray: [],
      mergedArray: [...arr].sort((a, b) => a - b),
      activeIndices: {},
      depth: 0,
      explanation: "✨ Merge Sort complete! The array is now fully sorted.",
      insight: "Time complexity: O(n log n) | Space complexity: O(n)",
      codeLine: 20,
    });

    setStats({
      comparisons,
      functionCalls,
      maxDepth: Math.max(...steps.map(s => s.depth)),
      memoryUsage: arr.length * 2,
      mergeOperations,
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
      
      // Update recursion tree active node
      if (recursionTree) {
        updateTreeActiveNode(recursionTree, steps[currentStepIndex + 1]?.depth || 0);
      }
    }, mode === "beginner" ? speed : speed / 2);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps, mode, speed, recursionTree]);

  const updateTreeActiveNode = (node: TreeNode, targetDepth: number): boolean => {
    if (node.depth === targetDepth) {
      node.isActive = true;
      return true;
    }
    
    node.isActive = false;
    let found = false;
    
    if (node.left && updateTreeActiveNode(node.left, targetDepth)) found = true;
    if (node.right && updateTreeActiveNode(node.right, targetDepth)) found = true;
    
    return found;
  };

  const currentStep = steps[currentStepIndex];

  // ================= CODE SNIPPETS =================
  const codeSnippets = {
    javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    return result + left[i:] + right[j:]`,
    java: `public class MergeSort {
    public static int[] mergeSort(int[] arr) {
        if (arr.length <= 1) return arr;
        
        int mid = arr.length / 2;
        int[] left = mergeSort(Arrays.copyOfRange(arr, 0, mid));
        int[] right = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));
        
        return merge(left, right);
    }
    
    private static int[] merge(int[] left, int[] right) {
        int[] result = new int[left.length + right.length];
        int i = 0, j = 0, k = 0;
        
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result[k++] = left[i++];
            } else {
                result[k++] = right[j++];
            }
        }
        
        while (i < left.length) result[k++] = left[i++];
        while (j < right.length) result[k++] = right[j++];
        
        return result;
    }
}`,
  };

  // ================= RENDER RECURSION TREE (IMPROVED SPACING) =================
  const renderTreeNode = (node: TreeNode, x: number = 0, y: number = 0, level: number = 0, totalNodes: number = 1) => {
    if (!node) return null;
    
    // Dynamic spacing based on depth
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
            {renderTreeNode(node.left, x - horizontalSpacing, y + verticalSpacing, level + 1)}
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
            {renderTreeNode(node.right, x + horizontalSpacing, y + verticalSpacing, level + 1)}
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
            r={Math.max(20, 30 - level * 2)}
            fill={node.isActive ? "#6366F1" : isDarkMode ? "#374151" : "#F3F4F6"}
            stroke={node.isMerged ? "#10B981" : "#6366F1"}
            strokeWidth="2"
            className="cursor-pointer transition-all duration-300 hover:filter hover:drop-shadow-lg"
          />
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dy=".3em"
            fill={node.isActive ? "white" : isDarkMode ? "#E5E7EB" : "#1F2937"}
            fontSize="12"
            fontWeight="500"
            className="select-none"
          >
            {node.value.length}
          </text>
        </motion.g>
      </g>
    );
  };

  // ================= MAIN RENDER =================
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" 
        : "bg-gradient-to-br from-slate-50 via-indigo-50 to-white"
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
          className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
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
              <h1 className={`text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
                Merge Sort Studio
              </h1>
              <p className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Understand Divide and Conquer in 30 seconds through interactive visualization
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
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
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
                placeholder="Enter numbers (e.g., 38, 27, 43, 3)"
                className={`w-full px-4 py-3 rounded-xl backdrop-blur-sm border ${
                  isDarkMode 
                    ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400" 
                    : "bg-white/50 border-gray-200 text-gray-800 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
              />
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={reset}
                  className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all font-medium"
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
                📈 Algorithm Insights
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Comparisons</span>
                  <span className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {stats.comparisons}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Function Calls</span>
                  <span className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {stats.functionCalls}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Max Depth</span>
                  <span className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {stats.maxDepth}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Memory Usage</span>
                  <span className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {stats.memoryUsage} units
                  </span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Time Complexity</span>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-mono">
                    O(n log n)
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
              <AnimatePresence mode="wait">
                {currentStep && (
                  <motion.div
                    key={currentStepIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-8"
                  >
                    
                    {/* Split View or Merge Animation */}
                    <div className="flex justify-around items-center gap-4">
                      
                      {/* Left Array */}
                      {currentStep.leftArray.length > 0 && (
                        <div className="flex-1">
                          <div className="text-center mb-3">
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                              isDarkMode 
                                ? "bg-indigo-500/20 text-indigo-300" 
                                : "bg-indigo-100 text-indigo-700"
                            }`}>
                              Left Half
                            </span>
                          </div>
                          <div className="flex justify-center gap-2 flex-wrap">
                            {currentStep.leftArray.map((value, idx) => (
                              <motion.div
                                key={`left-${idx}`}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ scale: 1.1 }}
                                className={`relative w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg
                                  ${currentStep.activeIndices.left === idx 
                                    ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-xl scale-110 z-10" 
                                    : isDarkMode
                                      ? "bg-gray-700 text-gray-200"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                              >
                                {value}
                                {currentStep.activeIndices.left === idx && (
                                  <motion.div
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="absolute -inset-1 bg-indigo-400 rounded-xl -z-10 opacity-50 blur-sm"
                                  />
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Merge Arrow (visible during merge) */}
                      {currentStep.type === "merge" && currentStep.mergedArray.length > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-2xl"
                        >
                          ➡️
                        </motion.div>
                      )}

                      {/* Right Array */}
                      {currentStep.rightArray.length > 0 && (
                        <div className="flex-1">
                          <div className="text-center mb-3">
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                              isDarkMode 
                                ? "bg-purple-500/20 text-purple-300" 
                                : "bg-purple-100 text-purple-700"
                            }`}>
                              Right Half
                            </span>
                          </div>
                          <div className="flex justify-center gap-2 flex-wrap">
                            {currentStep.rightArray.map((value, idx) => (
                              <motion.div
                                key={`right-${idx}`}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ scale: 1.1 }}
                                className={`relative w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg
                                  ${currentStep.activeIndices.right === idx 
                                    ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl scale-110 z-10" 
                                    : isDarkMode
                                      ? "bg-gray-700 text-gray-200"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                              >
                                {value}
                                {currentStep.activeIndices.right === idx && (
                                  <motion.div
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="absolute -inset-1 bg-purple-400 rounded-xl -z-10 opacity-50 blur-sm"
                                  />
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Merged Array (Bottom) */}
                    {currentStep.mergedArray.length > 0 && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mt-8"
                      >
                        <div className="text-center mb-3">
                          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                            isDarkMode 
                              ? "bg-emerald-500/20 text-emerald-300" 
                              : "bg-emerald-100 text-emerald-700"
                          }`}>
                            Merged Array {currentStep.type === "complete" ? "✓" : ""}
                          </span>
                        </div>
                        <div className="flex justify-center gap-2 flex-wrap">
                          {currentStep.mergedArray.map((value, idx) => (
                            <motion.div
                              key={`merged-${idx}`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ 
                                type: "spring",
                                delay: idx * 0.1 
                              }}
                              className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg
                                ${isDarkMode 
                                  ? "bg-emerald-600 text-white" 
                                  : "bg-emerald-500 text-white"
                                } shadow-lg`}
                            >
                              {value}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Explanation Card (Beginner Mode) */}
                    {mode === "beginner" && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className={`mt-8 p-6 rounded-2xl ${
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

            {/* Recursion Tree Visualization - IMPROVED SPACING */}
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
              <h3 className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                🌳 Recursion Tree
              </h3>
              <div className="min-w-[800px] h-[350px] relative">
                <svg width="100%" height="100%" viewBox="0 0 800 350" preserveAspectRatio="xMidYMid meet">
                  {recursionTree && renderTreeNode(recursionTree, 400, 40, 0)}
                </svg>
              </div>
              <div className="flex justify-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Active Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-emerald-500"></div>
                  <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Merged</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Waiting</span>
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
                <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
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
              
              <div className={`relative rounded-xl overflow-hidden ${
                isDarkMode ? "bg-gray-900" : "bg-gray-50"
              }`}>
                <pre className="p-4 text-sm font-mono overflow-x-auto">
                  {codeSnippets[language].split('\n').map((line, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        backgroundColor: currentStep?.codeLine === idx + 1 
                          ? isDarkMode ? "#374151" : "#E0E7FF"
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
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Current Operation</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      currentStep?.type === "split" 
                        ? "bg-blue-100 text-blue-700"
                        : currentStep?.type === "compare"
                        ? "bg-yellow-100 text-yellow-700"
                        : currentStep?.type === "merge"
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 text-purple-700"
                    }`}>
                      {currentStep?.type || "Ready"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Current Depth</span>
                    <span className={`font-mono ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {currentStep?.depth || 0}
                    </span>
                  </div>
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
                    ? "bg-indigo-900/30 border border-indigo-800" 
                    : "bg-indigo-50/70 border border-indigo-100"
                } shadow-xl`}
              >
                <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-indigo-300" : "text-indigo-800"}`}>
                  💡 Quick Tips
                </h3>
                <ul className={`space-y-2 text-sm ${isDarkMode ? "text-indigo-200" : "text-indigo-700"}`}>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Click on tree nodes to explore subarrays</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Watch the highlighted elements during comparison</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Code highlights sync with current operation</span>
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
          background-image: linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}