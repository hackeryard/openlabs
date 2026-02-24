"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/app/components/ChatContext";

// Types
type Mode = "beginner" | "expert" | "interview";
type Language = "javascript" | "python" | "java";
type Variant = "standard" | "optimized" | "cocktail";

interface Step {
  type: "compare" | "swap" | "complete";
  array: number[];
  compareIndices: [number, number];
  swapped: boolean;
  pass: number;
  explanation: string;
  insight: string;
  codeLine: number;
}

interface PassStats {
  passNumber: number;
  swaps: number;
  comparisons: number;
}

export default function BubbleSortVisualizer() {
  // Chatbot 
          const { setExperimentData } = useChat();
        
          useEffect(() => {
            setExperimentData({
              title: "Bubble Sort",
              theory: "Bubble Sort Data Structure Visualizer",
              extraContext: ``,
            });
          }, []);
  // ================= STATE MANAGEMENT =================
  const [inputArray, setInputArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [inputString, setInputString] = useState("64, 34, 25, 12, 22, 11, 90");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<Mode>("beginner");
  const [language, setLanguage] = useState<Language>("javascript");
  const [variant, setVariant] = useState<Variant>("standard");
  const [speed, setSpeed] = useState(600);
  const [stats, setStats] = useState({
    comparisons: 0,
    swaps: 0,
    passes: 0,
    totalPasses: 0,
    isSorted: false,
  });
  const [passHistory, setPassHistory] = useState<PassStats[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // ================= BUBBLE SORT ALGORITHM WITH STEP GENERATION =================
  const generateSteps = useCallback((arr: number[], variant: Variant): Step[] => {
    const steps: Step[] = [];
    const array = [...arr];
    let comparisons = 0;
    let swaps = 0;
    let passes = 0;
    const passStats: PassStats[] = [];
    
    const n = array.length;
    let swapped: boolean;
    let iterationSwaps: number;

    switch (variant) {
      case "standard":
        // Standard Bubble Sort
        for (let i = 0; i < n - 1; i++) {
          passes++;
          swapped = false;
          iterationSwaps = 0;
          
          for (let j = 0; j < n - i - 1; j++) {
            comparisons++;
            
            steps.push({
              type: "compare",
              array: [...array],
              compareIndices: [j, j + 1],
              swapped: false,
              pass: i + 1,
              explanation: `Comparing ${array[j]} and ${array[j + 1]}`,
              insight: array[j] > array[j + 1] 
                ? `${array[j]} is greater than ${array[j + 1]}, they will swap` 
                : `${array[j]} is less than or equal to ${array[j + 1]}, they stay in place`,
              codeLine: 4,
            });

            if (array[j] > array[j + 1]) {
              // Swap elements
              [array[j], array[j + 1]] = [array[j + 1], array[j]];
              swaps++;
              iterationSwaps++;
              
              steps.push({
                type: "swap",
                array: [...array],
                compareIndices: [j, j + 1],
                swapped: true,
                pass: i + 1,
                explanation: `Swapped ${array[j]} and ${array[j + 1]}`,
                insight: "Larger element bubbles up to the right",
                codeLine: 6,
              });
              
              swapped = true;
            }
          }
          
          passStats.push({
            passNumber: i + 1,
            swaps: iterationSwaps,
            comparisons: n - i - 1,
          });
          
          steps.push({
            type: "compare",
            array: [...array],
            compareIndices: [-1, -1],
            swapped: false,
            pass: i + 1,
            explanation: `Pass ${i + 1} complete. ${iterationSwaps} swaps performed.`,
            insight: iterationSwaps === 0 
              ? "No swaps in this pass - array is sorted!" 
              : `Largest element ${Math.max(...array.slice(0, n - i))} is now in place`,
            codeLine: 10,
          });
        }
        break;

      case "optimized":
        // Optimized Bubble Sort with early termination
        for (let i = 0; i < n - 1; i++) {
          passes++;
          swapped = false;
          iterationSwaps = 0;
          
          for (let j = 0; j < n - i - 1; j++) {
            comparisons++;
            
            steps.push({
              type: "compare",
              array: [...array],
              compareIndices: [j, j + 1],
              swapped: false,
              pass: i + 1,
              explanation: `Comparing ${array[j]} and ${array[j + 1]}`,
              insight: "Optimized version stops early if array becomes sorted",
              codeLine: 4,
            });

            if (array[j] > array[j + 1]) {
              [array[j], array[j + 1]] = [array[j + 1], array[j]];
              swaps++;
              iterationSwaps++;
              
              steps.push({
                type: "swap",
                array: [...array],
                compareIndices: [j, j + 1],
                swapped: true,
                pass: i + 1,
                explanation: `Swapped ${array[j]} and ${array[j + 1]}`,
                insight: "Elements swapped - array is becoming more sorted",
                codeLine: 6,
              });
              
              swapped = true;
            }
          }
          
          passStats.push({
            passNumber: i + 1,
            swaps: iterationSwaps,
            comparisons: n - i - 1,
          });
          
          steps.push({
            type: "compare",
            array: [...array],
            compareIndices: [-1, -1],
            swapped: false,
            pass: i + 1,
            explanation: `Pass ${i + 1} complete. ${iterationSwaps} swaps performed.`,
            insight: !swapped 
              ? "✨ Early termination: No swaps means array is sorted!" 
              : `${n - i - 1} comparisons made in this pass`,
            codeLine: 10,
          });
          
          if (!swapped) break;
        }
        break;

      case "cocktail":
        // Cocktail Shaker Sort (bidirectional bubble sort)
        let start = 0;
        let end = n - 1;
        passes = 0;
        
        while (start < end) {
          passes++;
          iterationSwaps = 0;
          
          // Forward pass
          for (let j = start; j < end; j++) {
            comparisons++;
            
            steps.push({
              type: "compare",
              array: [...array],
              compareIndices: [j, j + 1],
              swapped: false,
              pass: passes,
              explanation: `Forward pass: Comparing ${array[j]} and ${array[j + 1]}`,
              insight: "Moving largest element to the end",
              codeLine: 15,
            });

            if (array[j] > array[j + 1]) {
              [array[j], array[j + 1]] = [array[j + 1], array[j]];
              swaps++;
              iterationSwaps++;
              
              steps.push({
                type: "swap",
                array: [...array],
                compareIndices: [j, j + 1],
                swapped: true,
                pass: passes,
                explanation: `Swapped ${array[j]} and ${array[j + 1]}`,
                insight: "Largest element bubbles to the right",
                codeLine: 17,
              });
              
              swapped = true;
            }
          }
          end--;
          
          if (!swapped) break;
          
          passes++;
          swapped = false;
          
          // Backward pass
          for (let j = end - 1; j >= start; j--) {
            comparisons++;
            
            steps.push({
              type: "compare",
              array: [...array],
              compareIndices: [j, j + 1],
              swapped: false,
              pass: passes,
              explanation: `Backward pass: Comparing ${array[j]} and ${array[j + 1]}`,
              insight: "Moving smallest element to the beginning",
              codeLine: 22,
            });

            if (array[j] > array[j + 1]) {
              [array[j], array[j + 1]] = [array[j + 1], array[j]];
              swaps++;
              iterationSwaps++;
              
              steps.push({
                type: "swap",
                array: [...array],
                compareIndices: [j, j + 1],
                swapped: true,
                pass: passes,
                explanation: `Swapped ${array[j]} and ${array[j + 1]}`,
                insight: "Smallest element bubbles to the left",
                codeLine: 24,
              });
              
              swapped = true;
            }
          }
          start++;
          
          passStats.push({
            passNumber: passes,
            swaps: iterationSwaps,
            comparisons: end - start + 1,
          });
          
          if (!swapped) break;
        }
        break;
    }

    setPassHistory(passStats);
    
    steps.push({
      type: "complete",
      array: [...array],
      compareIndices: [-1, -1],
      swapped: false,
      pass: passes,
      explanation: "✨ Bubble Sort complete! The array is now fully sorted.",
      insight: variant === "optimized" 
        ? `Array sorted in ${passes} passes with early optimization`
        : variant === "cocktail"
        ? `Cocktail shaker sort completed in ${passes} passes (bidirectional)`
        : `Standard bubble sort completed in ${n-1} passes`,
      codeLine: 30,
    });

    setStats({
      comparisons,
      swaps,
      passes,
      totalPasses: variant === "standard" ? n - 1 : passes,
      isSorted: true,
    });

    return steps;
  }, []);

  // ================= INITIALIZATION =================
  useEffect(() => {
    reset();
  }, [variant]);

  const reset = () => {
    const arr = inputString
      .split(",")
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n));
    
    setInputArray(arr);
    setSteps(generateSteps(arr, variant));
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

  // ================= CODE SNIPPETS =================
  const codeSnippets = {
    javascript: {
      standard: `function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
      optimized: `function optimizedBubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    
    if (!swapped) break;
  }
  return arr;
}`,
      cocktail: `function cocktailShakerSort(arr) {
  let start = 0;
  let end = arr.length - 1;
  
  while (start < end) {
    let swapped = false;
    
    // Forward pass
    for (let i = start; i < end; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
    end--;
    
    if (!swapped) break;
    swapped = false;
    
    // Backward pass
    for (let i = end - 1; i >= start; i--) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
    start++;
    
    if (!swapped) break;
  }
  return arr;
}`,
    },
    python: {
      standard: `def bubble_sort(arr):
    n = len(arr)
    
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
      optimized: `def optimized_bubble_sort(arr):
    n = len(arr)
    
    for i in range(n - 1):
        swapped = False
        
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        if not swapped:
            break
    return arr`,
      cocktail: `def cocktail_shaker_sort(arr):
    start = 0
    end = len(arr) - 1
    
    while start < end:
        swapped = False
        
        # Forward pass
        for i in range(start, end):
            if arr[i] > arr[i + 1]:
                arr[i], arr[i + 1] = arr[i + 1], arr[i]
                swapped = True
        
        end -= 1
        
        if not swapped:
            break
            
        swapped = False
        
        # Backward pass
        for i in range(end - 1, start - 1, -1):
            if arr[i] > arr[i + 1]:
                arr[i], arr[i + 1] = arr[i + 1], arr[i]
                swapped = True
        
        start += 1
        
        if not swapped:
            break
    return arr`,
    },
    java: {
      standard: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
      optimized: `public static void optimizedBubbleSort(int[] arr) {
    int n = arr.length;
    
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        
        if (!swapped) break;
    }
}`,
      cocktail: `public static void cocktailShakerSort(int[] arr) {
    int start = 0;
    int end = arr.length - 1;
    
    while (start < end) {
        boolean swapped = false;
        
        // Forward pass
        for (int i = start; i < end; i++) {
            if (arr[i] > arr[i + 1]) {
                int temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
            }
        }
        end--;
        
        if (!swapped) break;
        swapped = false;
        
        // Backward pass
        for (int i = end - 1; i >= start; i--) {
            if (arr[i] > arr[i + 1]) {
                int temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
            }
        }
        start++;
        
        if (!swapped) break;
    }
}`,
    },
  };

  // ================= HELPER FUNCTIONS =================
  const getBarColor = (index: number) => {
    if (!currentStep) return isDarkMode ? "#4B5563" : "#60A5FA";
    
    const [i, j] = currentStep.compareIndices;
    
    if (index === i || index === j) {
      return currentStep.type === "swap" ? "#F59E0B" : "#3B82F6";
    }
    
    // Highlight sorted portion
    if (variant === "standard" || variant === "optimized") {
      const sortedUntil = currentStep.pass > 0 
        ? inputArray.length - currentStep.pass 
        : -1;
      if (index > sortedUntil && sortedUntil >= 0) {
        return "#10B981";
      }
    }
    
    return isDarkMode ? "#4B5563" : "#60A5FA";
  };

  // ================= MAIN RENDER =================
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900" 
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-white"
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
          className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
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
          className="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
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
              <h1 className={`text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent`}>
                Bubble Sort Visualizer
              </h1>
              <p className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Watch elements bubble up to their correct positions
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
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              />
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={reset}
                  className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all font-medium"
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

            {/* Variant Selection Card */}
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
                🔄 Algorithm Variant
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: "standard", label: "Standard Bubble Sort", desc: "O(n²) always" },
                  { id: "optimized", label: "Optimized Version", desc: "Early termination" },
                  { id: "cocktail", label: "Cocktail Shaker", desc: "Bidirectional" },
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariant(v.id as Variant)}
                    className={`px-4 py-3 rounded-xl text-left transition-all ${
                      variant === v.id
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                        : isDarkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <div className="font-medium">{v.label}</div>
                    <div className={`text-xs ${
                      variant === v.id ? "text-blue-100" : isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}>{v.desc}</div>
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
                        const [i, j] = currentStep.compareIndices;
                        
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
                                scale: idx === i || idx === j ? 1.1 : 1,
                                y: idx === i || idx === j ? -5 : 0,
                              }}
                              className="w-12 rounded-t-lg cursor-pointer transition-all"
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
                              
                              {/* Bubble animation for swaps */}
                              {currentStep.type === "swap" && (idx === i || idx === j) && (
                                <motion.div
                                  initial={{ scale: 1, opacity: 0.5 }}
                                  animate={{ 
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0]
                                  }}
                                  transition={{ duration: 0.5 }}
                                  className="absolute inset-0 bg-yellow-400 rounded-lg -z-10"
                                />
                              )}
                              
                              {/* Tooltip */}
                              {showTooltips && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                                  <div className={`px-2 py-1 text-xs rounded-lg whitespace-nowrap ${
                                    isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
                                  } shadow-lg`}>
                                    Index: {idx}, Value: {value}
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
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Comparing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Swapping</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Sorted</span>
                      </div>
                    </div>

                    {/* Pass Information */}
                    <div className={`text-center p-4 rounded-xl ${
                      isDarkMode ? "bg-gray-700/50" : "bg-gray-50/50"
                    }`}>
                      <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        Pass {currentStep.pass} 
                        {variant === "cocktail" && currentStep.type === "compare" && 
                          (currentStep.compareIndices[0] < currentStep.compareIndices[1] 
                            ? " → Forward" : " ← Backward")}
                      </span>
                    </div>

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

            {/* Pass Statistics Chart */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`backdrop-blur-xl rounded-3xl p-6 ${
                isDarkMode 
                  ? "bg-gray-800/50 border border-gray-700" 
                  : "bg-white/70 border border-white/20"
              } shadow-xl`}
            >
              <h3 className={`font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                📊 Pass Statistics
              </h3>
              <div className="h-48 flex items-end justify-around gap-2">
                {passHistory.map((pass, idx) => (
                  <div key={idx} className="flex flex-col items-center w-12">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(pass.swaps / Math.max(...passHistory.map(p => p.swaps), 1)) * 100}%` }}
                      className="w-8 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg"
                    />
                    <span className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Pass {pass.passNumber}
                    </span>
                    <span className={`text-xs font-mono ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {pass.swaps} swaps
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Code & Stats */}
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
                <pre className="p-4 text-sm font-mono overflow-x-auto max-h-96">
                  {codeSnippets[language][variant].split('\n').map((line, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        backgroundColor: currentStep?.codeLine === idx + 1 
                          ? isDarkMode ? "#374151" : "#DBEAFE"
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

            {/* Live Stats Card */}
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
                📈 Live Statistics
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-xl ${
                    isDarkMode ? "bg-gray-700/50" : "bg-gray-50/50"
                  }`}>
                    <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Comparisons</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {stats.comparisons}
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${
                    isDarkMode ? "bg-gray-700/50" : "bg-gray-50/50"
                  }`}>
                    <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Swaps</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {stats.swaps}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Current Pass</span>
                    <span className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {currentStep?.pass || 0} / {stats.totalPasses}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Progress</span>
                    <span className={`font-mono font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {Math.round((currentStepIndex / (steps.length - 1)) * 100)}%
                    </span>
                  </div>

                  {currentStep?.type === "swap" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`mt-2 p-2 rounded-lg text-sm text-center ${
                        isDarkMode ? "bg-amber-500/20 text-amber-300" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      🔄 Swapping elements
                    </motion.div>
                  )}
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Time Complexity</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-mono">
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
                  <div className="flex justify-between items-center">
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>In-place</span>
                    <span className="text-emerald-500">✓ Yes</span>
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
                    ? "bg-blue-900/30 border border-blue-800" 
                    : "bg-blue-50/70 border border-blue-100"
                } shadow-xl`}
              >
                <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-blue-300" : "text-blue-800"}`}>
                  💡 Quick Tips
                </h3>
                <ul className={`space-y-2 text-sm ${isDarkMode ? "text-blue-200" : "text-blue-700"}`}>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Largest element bubbles to the end in each pass</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Optimized version stops early if array is sorted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Cocktail shaker works both directions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Blue = comparing, Orange = swapping, Green = sorted</span>
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
          background-image: linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}