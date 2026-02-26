"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/app/components/ChatContext";

// Types
type Mode = "beginner" | "expert" | "interview";
type Theme = "dark" | "light" | "neon" | "pastel";

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
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "Selection Sort",
      theory: "Interactive Algorithm Visualization",
      extraContext: ``,
    });
  }, []);
  
  // ================= STATE MANAGEMENT =================
  const [array, setArray] = useState<number[]>([64, 25, 12, 22, 11, 9, 34]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<Step | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<Mode>("beginner");
  const [theme, setTheme] = useState<Theme>("dark");
  const [speed, setSpeed] = useState(800);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0, passes: 0 });
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [touchId, setTouchId] = useState<string | null>(null);
  const [inputString, setInputString] = useState("64, 25, 12, 22, 11, 9, 34");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number>();

  // ================= AUDIO UTILITY =================
  const playNote = useCallback((frequency: number, type: OscillatorType = "sine") => {
    if (!soundEnabled) return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.1;
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
    oscillator.stop(ctx.currentTime + 0.1);
  }, [soundEnabled]);

  // ================= SELECTION SORT ALGORITHM =================
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
      explanation: "Let's find the smallest element in the unsorted portion.",
      insight: "Selection sort repeatedly selects the smallest element.",
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
        explanation: `Starting new pass. Current minimum is ${array[minIndex]}.`,
        insight: `We'll scan from index ${i + 1} to find a smaller element.`,
        codeLine: 5,
      });

      for (let j = i + 1; j < n; j++) {
        comparisons++;

        steps.push({
          type: "find",
          array: [...array],
          currentMinIndex: minIndex,
          comparingIndex: j,
          swapIndices: [-1, -1],
          sortedBoundary: i,
          explanation: `Comparing ${array[j]} with current minimum ${array[minIndex]}.`,
          insight: array[j] < array[minIndex] 
            ? `${array[j]} is smaller! Updating minimum.`
            : `${array[minIndex]} is still smaller.`,
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
            explanation: `Found new minimum: ${array[minIndex]} at position ${minIndex}.`,
            insight: "This will move to its correct position.",
            codeLine: 8,
          });
        }
      }

      const swappedArray = [...array];
      if (minIndex !== i) {
        [swappedArray[i], swappedArray[minIndex]] = [swappedArray[minIndex], swappedArray[i]];
        swaps++;

        steps.push({
          type: "swap",
          array: swappedArray,
          currentMinIndex: minIndex,
          comparingIndex: -1,
          swapIndices: [i, minIndex],
          sortedBoundary: i + 1,
          explanation: `Swapped ${swappedArray[i]} and ${swappedArray[minIndex]}.`,
          insight: `${swappedArray[i]} is now in its sorted position.`,
          codeLine: 11,
        });

        [array[i], array[minIndex]] = [array[minIndex], array[i]];
      } else {
        steps.push({
          type: "swap",
          array: [...array],
          currentMinIndex: minIndex,
          comparingIndex: -1,
          swapIndices: [-1, -1],
          sortedBoundary: i + 1,
          explanation: `${array[i]} is already in the correct position.`,
          insight: "No swap needed this pass.",
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
      explanation: "✨ Array is now fully sorted!",
      insight: `Completed in ${passes} passes with ${comparisons} comparisons and ${swaps} swaps.`,
      codeLine: 15,
    });

    setStats({ comparisons, swaps, passes });
    return steps;
  }, []);

  // ================= INITIALIZATION =================
  useEffect(() => {
    const newSteps = generateSteps(array);
    setSteps(newSteps);
    setCurrentStep(newSteps[0]);
    setStepIndex(0);
  }, []);

  const handleArrayChange = (input: string) => {
    const newArray = input
      .split(",")
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n > 0);
    
    if (newArray.length > 0) {
      setArray(newArray);
      setInputString(newArray.join(", "));
      const newSteps = generateSteps(newArray);
      setSteps(newSteps);
      setCurrentStep(newSteps[0]);
      setStepIndex(0);
      setIsPlaying(false);
    }
  };

  const generateRandomArray = () => {
    const length = Math.floor(Math.random() * 6) + 5; // 5-10 elements
    const randomArray = Array.from({ length }, () => Math.floor(Math.random() * 50) + 1);
    setArray(randomArray);
    setInputString(randomArray.join(", "));
    const newSteps = generateSteps(randomArray);
    setSteps(newSteps);
    setCurrentStep(newSteps[0]);
    setStepIndex(0);
    setIsPlaying(false);
  };

  // ================= PLAYBACK CONTROL =================
  useEffect(() => {
    if (!isPlaying) return;

    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setStepIndex(i => i + 1);
      setCurrentStep(steps[stepIndex + 1]);
      
      // Play sound based on operation
      if (soundEnabled) {
        const step = steps[stepIndex + 1];
        if (step.type === "swap" && step.swapIndices[0] !== -1) {
          playNote(440, "triangle");
        } else if (step.type === "find") {
          playNote(330, "sine");
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, steps, speed, soundEnabled, playNote]);

  // ================= 3D CANVAS RENDERING =================
  useEffect(() => {
    if (!canvasRef.current || !currentStep) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rotation = 0;
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set up 3D perspective
      const barWidth = 60;
      const spacing = 20;
      const startX = (canvas.width - (currentStep.array.length * (barWidth + spacing))) / 2;
      const maxValue = Math.max(...currentStep.array);

      // Draw floor grid
      ctx.save();
      ctx.translate(0, canvas.height - 100);
      ctx.strokeStyle = theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
      ctx.lineWidth = 1;
      
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 50, 0);
        ctx.lineTo(i * 50 + 200, 100);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * 20);
        ctx.lineTo(800, i * 20);
        ctx.stroke();
      }
      ctx.restore();

      // Draw bars with 3D effect
      currentStep.array.forEach((value, i) => {
        const x = startX + i * (barWidth + spacing);
        const baseY = canvas.height - 120;
        const height = (value / maxValue) * 200;

        // Determine color
        let color = "#3B82F6"; // Default blue
        if (i < currentStep.sortedBoundary) color = "#8B5CF6"; // Sorted
        if (i === currentStep.currentMinIndex) color = "#EC4899"; // Current min
        if (i === currentStep.comparingIndex) color = "#F59E0B"; // Comparing
        if (currentStep.swapIndices.includes(i)) color = "#EF4444"; // Swapping

        // Add glow effect for active elements
        if (currentStep.swapIndices.includes(i) || i === currentStep.currentMinIndex || i === currentStep.comparingIndex) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 20;
        } else {
          ctx.shadowColor = "rgba(0,0,0,0.3)";
          ctx.shadowBlur = 10;
        }

        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;

        // Front face
        ctx.fillStyle = color;
        ctx.fillRect(x, baseY - height, barWidth, height);

        // Top face
        ctx.fillStyle = adjustColor(color, 30);
        ctx.beginPath();
        ctx.moveTo(x, baseY - height);
        ctx.lineTo(x + 10, baseY - height - 10);
        ctx.lineTo(x + barWidth + 10, baseY - height - 10);
        ctx.lineTo(x + barWidth, baseY - height);
        ctx.closePath();
        ctx.fill();

        // Side face
        ctx.fillStyle = adjustColor(color, -20);
        ctx.beginPath();
        ctx.moveTo(x + barWidth, baseY - height);
        ctx.lineTo(x + barWidth + 10, baseY - height - 10);
        ctx.lineTo(x + barWidth + 10, baseY - 10);
        ctx.lineTo(x + barWidth, baseY);
        ctx.closePath();
        ctx.fill();

        // Reset shadow for text
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Value label
        ctx.fillStyle = theme === "dark" ? "#fff" : "#000";
        ctx.font = "bold 14px monospace";
        ctx.textAlign = "center";
        ctx.fillText(value.toString(), x + barWidth / 2, baseY - height - 20);

        // Index label
        ctx.fillStyle = theme === "dark" ? "#aaa" : "#666";
        ctx.font = "12px monospace";
        ctx.fillText(i.toString(), x + barWidth / 2, baseY + 20);

        // Add floating particles for swapping
        if (currentStep.swapIndices.includes(i)) {
          for (let p = 0; p < 3; p++) {
            const time = Date.now() / 500;
            ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
            ctx.beginPath();
            ctx.arc(
              x + barWidth / 2 + Math.sin(time + p * 2) * 15,
              baseY - height / 2 + Math.cos(time + p * 2) * 10,
              2 + Math.sin(time + p) * 1,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        }
      });

      // Update rotation for next frame
      rotation += 0.005;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentStep, stepIndex, theme]);

  const adjustColor = (color: string, percent: number) => {
    const num = parseInt(color.replace("#", ""), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // ================= THEME STYLES =================
  const getThemeStyles = () => {
    switch (theme) {
      case "dark":
        return {
          bg: "from-gray-950 via-gray-900 to-gray-950",
          card: "bg-gray-900/90 border-gray-800",
          text: "text-gray-100",
          textMuted: "text-gray-400",
          accent: "from-blue-500 to-purple-500",
          glow: "0 0 20px rgba(59,130,246,0.3)",
        };
      case "light":
        return {
          bg: "from-gray-50 via-white to-gray-50",
          card: "bg-white/90 border-gray-200",
          text: "text-gray-900",
          textMuted: "text-gray-600",
          accent: "from-blue-500 to-purple-500",
          glow: "0 4px 20px rgba(0,0,0,0.1)",
        };
      case "neon":
        return {
          bg: "from-black via-purple-950 to-black",
          card: "bg-purple-900/30 border-purple-500/30 backdrop-blur-xl",
          text: "text-purple-100",
          textMuted: "text-purple-300",
          accent: "from-green-400 to-blue-500",
          glow: "0 0 20px rgba(0,255,0,0.3)",
        };
      case "pastel":
        return {
          bg: "from-pink-100 via-purple-100 to-blue-100",
          card: "bg-white/70 border-white/50 backdrop-blur-sm",
          text: "text-gray-800",
          textMuted: "text-gray-600",
          accent: "from-pink-400 to-purple-400",
          glow: "0 4px 20px rgba(255,192,203,0.3)",
        };
    }
  };

  const themeStyles = getThemeStyles();

  // ================= TOUCH GESTURES =================
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setTouchId(touch.identifier.toString());
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchId) return;
      
      const touch = Array.from(e.touches).find(t => t.identifier.toString() === touchId);
      if (!touch) return;

      const deltaX = touch.clientX - (parseInt(touchId) || 0);
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe right - previous step
          setStepIndex(i => Math.max(0, i - 1));
          setCurrentStep(steps[stepIndex - 1]);
        } else {
          // Swipe left - next step
          setStepIndex(i => Math.min(steps.length - 1, i + 1));
          setCurrentStep(steps[stepIndex + 1]);
        }
        setTouchId(null);
      }
    };

    const handleTouchEnd = () => {
      setTouchId(null);
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [touchId, steps, stepIndex]);

  if (!currentStep) return null;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeStyles.bg} transition-colors duration-500`}>
      {/* Ambient noise overlay */}
      <div className="fixed inset-0 bg-noise opacity-5 pointer-events-none" />
      
      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              theme === "neon" ? "bg-green-400" : "bg-blue-400"
            }`}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`${themeStyles.card} backdrop-blur-xl rounded-3xl p-6 border shadow-2xl`}
          style={{ boxShadow: themeStyles.glow }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className={`text-4xl md:text-5xl font-black ${themeStyles.text}`}>
                SELECTION
                <span className={`bg-gradient-to-r ${themeStyles.accent} bg-clip-text text-transparent ml-2`}>
                  SORT 3D
                </span>
              </h1>
              <p className={themeStyles.textMuted}>visualize • understand • master</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : theme === "light" ? "neon" : theme === "neon" ? "pastel" : "dark")}
                className={`p-3 rounded-xl ${themeStyles.card} ${themeStyles.text} border transition-all hover:scale-110`}
              >
                {theme === "dark" && "🌙"}
                {theme === "light" && "☀️"}
                {theme === "neon" && "⚡"}
                {theme === "pastel" && "🎨"}
              </button>

              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as Mode)}
                className={`px-4 py-3 rounded-xl ${themeStyles.card} ${themeStyles.text} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="beginner">🌱 Beginner</option>
                <option value="expert">⚡ Expert</option>
                <option value="interview">💼 Interview</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left Panel - Controls */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="col-span-12 md:col-span-3 space-y-4"
          >
            {/* Input Card */}
            <div className={`${themeStyles.card} backdrop-blur-xl rounded-2xl p-6 border space-y-4`}>
              <h3 className={`font-semibold ${themeStyles.text}`}>📊 Input Array</h3>
              
              <div className="space-y-2">
                <input
                  type="text"
                  value={inputString}
                  onChange={(e) => setInputString(e.target.value)}
                  onBlur={(e) => handleArrayChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleArrayChange(e.currentTarget.value)}
                  placeholder="Enter numbers (e.g., 64, 25, 12)"
                  className={`w-full px-4 py-3 rounded-xl ${themeStyles.card} ${themeStyles.text} border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleArrayChange("64, 25, 12, 22, 11, 9, 34")}
                    className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Reset
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateRandomArray}
                    className="px-4 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Random
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Playback Controls */}
            <div className={`${themeStyles.card} backdrop-blur-xl rounded-2xl p-6 border space-y-4`}>
              <h3 className={`font-semibold ${themeStyles.text}`}>🎮 Playback</h3>
              
              <div className="grid grid-cols-3 gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setStepIndex(i => Math.max(0, i - 1));
                    setCurrentStep(steps[stepIndex - 1]);
                    setIsPlaying(false);
                  }}
                  className={`p-4 rounded-xl ${themeStyles.card} ${themeStyles.text} border hover:bg-opacity-50 transition-all text-xl`}
                >
                  ⏮
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-4 rounded-xl ${
                    isPlaying 
                      ? "bg-gradient-to-r from-orange-500 to-red-500" 
                      : "bg-gradient-to-r from-green-500 to-teal-500"
                  } text-white font-bold transition-all text-xl`}
                >
                  {isPlaying ? "⏸" : "▶"}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setStepIndex(i => Math.min(steps.length - 1, i + 1));
                    setCurrentStep(steps[stepIndex + 1]);
                    setIsPlaying(false);
                  }}
                  className={`p-4 rounded-xl ${themeStyles.card} ${themeStyles.text} border hover:bg-opacity-50 transition-all text-xl`}
                >
                  ⏭
                </motion.button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={themeStyles.textMuted}>Speed</span>
                  <span className={themeStyles.text}>{speed}ms</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="100"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className={themeStyles.textMuted}>Sound Effects</label>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    soundEnabled ? "bg-green-500" : "bg-gray-500"
                  } relative`}
                >
                  <motion.div
                    className="absolute w-4 h-4 bg-white rounded-full top-1"
                    animate={{ x: soundEnabled ? 28 : 4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className={`${themeStyles.card} backdrop-blur-xl rounded-2xl p-6 border space-y-3`}>
              <h3 className={`font-semibold ${themeStyles.text}`}>📈 Statistics</h3>
              
              {[
                { label: "Comparisons", value: stats.comparisons, color: "blue" },
                { label: "Swaps", value: stats.swaps, color: "orange" },
                { label: "Passes", value: stats.passes, color: "green" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex justify-between items-center"
                >
                  <span className={themeStyles.textMuted}>{stat.label}</span>
                  <motion.span
                    key={stat.value}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-2xl font-bold text-${stat.color}-500`}
                  >
                    {stat.value}
                  </motion.span>
                </motion.div>
              ))}

              <div className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-2" />
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className={`p-2 rounded-lg ${themeStyles.card} border text-center`}>
                  <div className={themeStyles.textMuted}>Time</div>
                  <div className={`font-mono font-bold ${themeStyles.text}`}>O(n²)</div>
                </div>
                <div className={`p-2 rounded-lg ${themeStyles.card} border text-center`}>
                  <div className={themeStyles.textMuted}>Space</div>
                  <div className={`font-mono font-bold ${themeStyles.text}`}>O(1)</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Center Panel - 3D Visualization */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="col-span-12 md:col-span-6 space-y-4"
          >
            {/* Main 3D Visualization */}
            <div className={`${themeStyles.card} backdrop-blur-xl rounded-3xl p-6 border relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent opacity-5" />
              
              <div className="relative h-[500px] w-full">
                <canvas
                  ref={canvasRef}
                  width={900}
                  height={500}
                  className="w-full h-full"
                />
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-gray-700">
                {[
                  { color: "bg-purple-500", label: "Sorted" },
                  { color: "bg-pink-500", label: "Current Min" },
                  { color: "bg-yellow-500", label: "Comparing" },
                  { color: "bg-red-500", label: "Swapping" },
                  { color: "bg-blue-500", label: "Unsorted" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div className={`w-3 h-3 ${item.color} rounded-full animate-pulse`} />
                    <span className={themeStyles.textMuted}>{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Explanation Card */}
            {mode === "beginner" && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`${themeStyles.card} backdrop-blur-xl rounded-2xl p-6 border`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">💭</div>
                  <div>
                    <p className={`font-medium mb-1 ${themeStyles.text}`}>
                      {currentStep.explanation}
                    </p>
                    <p className={themeStyles.textMuted}>
                      {currentStep.insight}
                    </p>
                    
                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className={themeStyles.textMuted}>Progress</span>
                        <span className={themeStyles.text}>
                          {Math.round((currentStep.sortedBoundary / array.length) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(currentStep.sortedBoundary / array.length) * 100}%` }}
                          className={`h-full bg-gradient-to-r ${themeStyles.accent}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Panel - Code & Analysis */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="col-span-12 md:col-span-3 space-y-4"
          >
            {/* Code Viewer */}
            <div className={`${themeStyles.card} backdrop-blur-xl rounded-2xl p-6 border`}>
              <h3 className={`font-semibold mb-4 ${themeStyles.text}`}>💻 Code</h3>
              
              <div className={`relative rounded-xl overflow-hidden ${
                theme === "dark" ? "bg-gray-950" : "bg-gray-100"
              }`}>
                <pre className="p-4 text-sm font-mono overflow-x-auto">
                  {`function selectionSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}`.split("\n").map((line, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        backgroundColor: currentStep.codeLine === idx + 1 
                          ? theme === "dark" ? "#374151" : "#E5E7EB"
                          : "transparent",
                        borderLeft: currentStep.codeLine === idx + 1
                          ? "3px solid #3B82F6"
                          : "3px solid transparent",
                        paddingLeft: currentStep.codeLine === idx + 1 ? 12 : 8,
                      }}
                      className="py-0.5"
                    >
                      <code className={themeStyles.text}>{line}</code>
                    </motion.div>
                  ))}
                </pre>
              </div>

              <div className="mt-3 text-center">
                <span className={`px-3 py-1 rounded-full text-xs ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-200"
                } ${themeStyles.text}`}>
                  Line {currentStep.codeLine} executing
                </span>
              </div>
            </div>

            {/* Mini Map */}
            {showMiniMap && (
              <div className={`${themeStyles.card} backdrop-blur-xl rounded-2xl p-6 border`}>
                <h3 className={`font-semibold mb-4 ${themeStyles.text}`}>🗺️ Mini Map</h3>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {steps.map((step, i) => (
                    <motion.button
                      key={i}
                      onClick={() => {
                        setStepIndex(i);
                        setCurrentStep(step);
                        setIsPlaying(false);
                      }}
                      className={`w-full p-2 rounded-lg text-left transition-all ${
                        i === stepIndex
                          ? `bg-gradient-to-r ${themeStyles.accent} text-white`
                          : themeStyles.card
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs">
                          {step.type === "find" && "🔍"}
                          {step.type === "swap" && "🔄"}
                          {step.type === "complete" && "✨"}
                        </span>
                        <span className="text-xs truncate">
                          {step.explanation.substring(0, 20)}...
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Mobile Gesture Hint */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden text-center text-sm text-gray-500 mt-4"
        >
          👆 Swipe left/right to navigate steps
        </motion.div>
      </div>

      <style jsx>{`
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 100px 100px;
        }
      `}</style>
    </div>
  );
}