"use client";
// src/components/computer-science/ai-problem/RuleChaining.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RuleChaining() {
  const [activeTab, setActiveTab] = useState("forward");
  const [animationSpeed, setAnimationSpeed] = useState(1000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with light/dark gradient */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-900 rounded-2xl p-8 mb-8 shadow-xl border border-white/10"
        >
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            🔍 Forward & Backward Chaining
          </h1>
          <p className="text-purple-200 text-lg">
            Interactive visualization of rule-based reasoning in AI
          </p>
          
          {/* Speed Control */}
          <div className="mt-4 flex items-center gap-4 bg-black/30 backdrop-blur-sm p-3 rounded-xl w-fit">
            <span className="text-white font-medium">Animation Speed:</span>
            <input 
              type="range" 
              min="500" 
              max="2000" 
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              className="w-48 accent-purple-500"
            />
            <span className="text-white bg-purple-800/50 px-3 py-1 rounded-full">{animationSpeed}ms</span>
          </div>
        </motion.div>

          {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { id: "forward", label: "Forward Chaining", icon: "⬆️", color: "indigo", light: "bg-indigo-900/50", dark: "bg-purple-600" },
            { id: "backward", label: "Backward Chaining", icon: "⬇️", color: "purple", light: "bg-purple-900/50", dark: "bg-pink-600" },
            { id: "compare", label: "Compare Both", icon: "🔄", color: "pink", light: "bg-pink-900/50", dark: "bg-cyan-600" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-xl font-bold transition-all ${
                activeTab === tab.id
                  ? `${tab.dark} text-white shadow-lg shadow-purple-500/30 scale-105`
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <span className="text-2xl mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Always visible */}
          <div className="lg:col-span-1">
            <RuleBase />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === "forward" && <ForwardChainingDemo speed={animationSpeed} />}
            {activeTab === "backward" && <BackwardChainingDemo speed={animationSpeed} />}
            {activeTab === "compare" && <ComparisonView speed={animationSpeed} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// RULE BASE COMPONENT with diagrams
// ==========================================
function RuleBase() {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const categories = [
    {
      id: 1,
      name: "Animal Rules",
      icon: "🦁",
      diagram: "🐾 → 🦁",
      rules: [
        { id: "R1", if: ["has hair", "gives milk"], then: "mammal" },
        { id: "R2", if: ["mammal", "eats meat"], then: "carnivore" },
        { id: "R3", if: ["carnivore", "tawny color", "stripes"], then: "tiger" }
      ]
    },
    {
      id: 2,
      name: "Medical Rules",
      icon: "🏥",
      diagram: "🌡️ → 💊",
      rules: [
        { id: "M1", if: ["fever", "cough"], then: "flu" },
        { id: "M2", if: ["fever", "rash"], then: "measles" },
        { id: "M3", if: ["headache", "nausea"], then: "migraine" }
      ]
    }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-lg h-[600px] overflow-y-auto">
      <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-4">
        📚 Knowledge Base
      </h2>
      
      {categories.map((cat) => (
        <div key={cat.id} className="mb-4">
          <button
            onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
            className="w-full bg-white/5 p-4 rounded-xl text-left hover:bg-white/10 transition border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl mr-2">{cat.icon}</span>
                <span className="text-white font-bold">{cat.name}</span>
              </div>
              <span className="text-sm text-purple-400 bg-white/5 px-3 py-1 rounded-full">
                {cat.diagram}
              </span>
            </div>
          </button>

          <AnimatePresence>
            {expandedCategory === cat.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-2"
              >
                {cat.rules.map((rule) => (
                  <div key={rule.id} className="bg-black/20 p-3 rounded-lg ml-2 border-l-4 border-purple-500">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-purple-400 font-bold">{rule.id}</span>
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">Rule</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-amber-400">IF</span>
                      <div className="flex gap-1">
                        {rule.if.map((cond, i) => (
                          <React.Fragment key={i}>
                            <span className="bg-white/10 px-2 py-0.5 rounded border border-white/10 text-slate-300">
                              {cond}
                            </span>
                            {i < rule.if.length - 1 && <span className="text-slate-500">∧</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <span className="text-green-400">THEN</span>
                      <span className="bg-green-500/20 px-2 py-0.5 rounded border border-green-500/30 text-green-400">
                        {rule.then}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Rule Diagram */}
      <div className="mt-6 p-4 bg-black/30 rounded-xl border border-white/10">
        <h3 className="text-purple-400 font-bold mb-2">📊 Rule Structure</h3>
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">Condition 1</span>
          <span className="text-purple-500">AND</span>
          <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">Condition 2</span>
          <span className="text-purple-400 text-xl">→</span>
          <span className="bg-purple-600 text-white px-3 py-1 rounded-lg">Conclusion</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// FORWARD CHAINING DEMO with diagrams
// ==========================================
function ForwardChainingDemo({ speed }) {
  const [facts, setFacts] = useState(["has hair", "gives milk", "eats meat", "tawny color", "stripes"]);
  const [inferred, setInferred] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);

  const rules = [
    { id: "R1", if: ["has hair", "gives milk"], then: "mammal" },
    { id: "R2", if: ["mammal", "eats meat"], then: "carnivore" },
    { id: "R3", if: ["carnivore", "tawny color", "stripes"], then: "tiger" }
  ];

  const runForwardChain = async () => {
    setIsRunning(true);
    setInferred([]);
    let currentFacts = [...facts];
    let newInferred = [];

    for (const rule of rules) {
      setCurrentRule(rule.id);
      await new Promise(resolve => setTimeout(resolve, speed));

      const canApply = rule.if.every(cond => currentFacts.includes(cond));
      
      if (canApply && !currentFacts.includes(rule.then)) {
        currentFacts.push(rule.then);
        newInferred.push({ rule: rule.id, fact: rule.then });
        setInferred([...newInferred]);
        setFacts([...currentFacts]);
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }
    
    setCurrentRule(null);
    setIsRunning(false);
  };

  const reset = () => {
    setFacts(["has hair", "gives milk", "eats meat", "tawny color", "stripes"]);
    setInferred([]);
    setCurrentRule(null);
    setIsRunning(false);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
          ⬆️ Forward Chaining
        </h2>
        <div className="space-x-3">
          <button
            onClick={reset}
            className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 border border-indigo-200 transition"
          >
            Reset
          </button>
          <button
            onClick={runForwardChain}
            disabled={isRunning}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 shadow-md"
          >
            {isRunning ? "Running..." : "Start"}
          </button>
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
        <div className="flex items-center gap-1">
          <span className="text-2xl">📦</span>
          <span className="text-indigo-600 font-medium">Facts</span>
        </div>
        <span className="text-2xl text-indigo-400">→</span>
        <div className="flex items-center gap-1">
          <span className="text-2xl">⚙️</span>
          <span className="text-purple-600 font-medium">Rules</span>
        </div>
        <span className="text-2xl text-indigo-400">→</span>
        <div className="flex items-center gap-1">
          <span className="text-2xl">✨</span>
          <span className="text-pink-600 font-medium">Conclusions</span>
        </div>
      </div>

      {/* Facts Display */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
          <h3 className="text-indigo-600 font-bold mb-3 flex items-center gap-2">
            <span>📦</span> Initial Facts
          </h3>
          <div className="flex flex-wrap gap-2">
            {facts.map((fact, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1.5 bg-white text-indigo-600 rounded-lg text-sm border border-indigo-200 shadow-sm"
              >
                {fact}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <h3 className="text-green-600 font-bold mb-3 flex items-center gap-2">
            <span>✨</span> Inferred Facts
          </h3>
          <div className="flex flex-wrap gap-2">
            {inferred.map((inf, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1.5 bg-white text-green-600 rounded-lg text-sm border border-green-200 shadow-sm"
              >
                {inf.fact}
              </motion.span>
            ))}
            {inferred.length === 0 && (
              <span className="text-gray-400 text-sm">No facts inferred yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Rules with visual diagrams */}
      <div className="space-y-3">
        {rules.map((rule, index) => (
          <motion.div
            key={rule.id}
            animate={{
              scale: currentRule === rule.id ? 1.02 : 1,
            }}
            className={`p-4 rounded-xl border-2 transition-all ${
              currentRule === rule.id
                ? 'border-indigo-400 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-indigo-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                currentRule === rule.id ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
              }`}>
                {rule.id}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {rule.if.map((cond, i) => (
                    <React.Fragment key={i}>
                      <span className="bg-amber-50 px-2 py-1 rounded border border-amber-200 text-amber-700 text-sm">
                        {cond}
                      </span>
                      {i < rule.if.length - 1 && (
                        <span className="text-gray-400 text-sm">AND</span>
                      )}
                    </React.Fragment>
                  ))}
                  <span className="text-indigo-400 text-xl mx-2">→</span>
                  <span className="bg-green-50 px-3 py-1 rounded border border-green-200 text-green-700 font-medium">
                    {rule.then}
                  </span>
                </div>
              </div>
              {currentRule === rule.id && (
                <motion.div
                  animate={{ rotate: 360 }}
                  className="text-indigo-600 text-xl"
                >
                  ⚡
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Inference Chain Diagram */}
      {inferred.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl border border-indigo-300"
        >
          <h3 className="text-indigo-700 font-bold mb-3">🔗 Inference Chain</h3>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {inferred.map((inf, i) => (
              <React.Fragment key={i}>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border-l-4 border-indigo-400">
                  <span className="text-indigo-600 font-bold">{inf.rule}</span>
                  <span className="text-gray-400 mx-2">→</span>
                  <span className="text-green-600">{inf.fact}</span>
                </div>
                {i < inferred.length - 1 && (
                  <span className="text-indigo-400 text-2xl">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ==========================================
// BACKWARD CHAINING DEMO with diagrams
// ==========================================
function BackwardChainingDemo({ speed }) {
  const [goal, setGoal] = useState("tiger");
  const [steps, setSteps] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [found, setFound] = useState(false);

  const rules = [
    { id: "R1", if: ["has hair", "gives milk"], then: "mammal" },
    { id: "R2", if: ["mammal", "eats meat"], then: "carnivore" },
    { id: "R3", if: ["carnivore", "tawny color", "stripes"], then: "tiger" }
  ];

  const facts = ["has hair", "gives milk", "eats meat", "tawny color", "stripes"];

  const runBackwardChain = async () => {
    setIsRunning(true);
    setSteps([]);
    setFound(false);

    const prove = async (target, depth = 0) => {
      setSteps(prev => [...prev, { text: `🎯 Trying to prove: ${target}`, depth }]);
      await new Promise(resolve => setTimeout(resolve, speed));

      // Check if target is a fact
      if (facts.includes(target)) {
        setSteps(prev => [...prev, { text: `✅ Found fact: ${target}`, depth, success: true }]);
        return true;
      }

      // Find rules that conclude target
      const applicableRules = rules.filter(r => r.then === target);
      
      for (const rule of applicableRules) {
        setSteps(prev => [...prev, { text: `🔍 Trying rule ${rule.id} to prove ${target}`, depth }]);
        await new Promise(resolve => setTimeout(resolve, speed));

        let allTrue = true;
        for (const premise of rule.if) {
          const result = await prove(premise, depth + 1);
          allTrue = allTrue && result;
          if (!allTrue) break;
        }

        if (allTrue) {
          setSteps(prev => [...prev, { text: `✨ Proved ${target} using rule ${rule.id}`, depth, success: true }]);
          return true;
        }
      }

      setSteps(prev => [...prev, { text: `❌ Failed to prove ${target}`, depth, failed: true }]);
      return false;
    };

    const result = await prove(goal);
    setFound(result);
    setIsRunning(false);
  };

  const reset = () => {
    setSteps([]);
    setFound(false);
    setIsRunning(false);
    setGoal("tiger");
  };

  // Goal tree diagram
  const GoalTree = () => (
    <div className="flex justify-center items-center gap-4 mb-4 text-sm">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl border-2 border-purple-400">
          🎯
        </div>
        <span className="text-purple-600 mt-1">Goal</span>
      </div>
      <span className="text-2xl text-purple-400">⬇️</span>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl border-2 border-indigo-400">
          🔍
        </div>
        <span className="text-indigo-600 mt-1">Rules</span>
      </div>
      <span className="text-2xl text-purple-400">⬇️</span>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl border-2 border-green-400">
          ✅
        </div>
        <span className="text-green-600 mt-1">Facts</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
          ⬇️ Backward Chaining
        </h2>
        <div className="space-x-3">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="px-3 py-2 bg-white rounded-lg text-gray-700 w-32 border border-purple-200 focus:border-purple-400 outline-none"
            placeholder="Goal"
          />
          <button
            onClick={reset}
            className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 border border-purple-200 transition"
          >
            Reset
          </button>
          <button
            onClick={runBackwardChain}
            disabled={isRunning}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 shadow-md"
          >
            {isRunning ? "Proving..." : "Start"}
          </button>
        </div>
      </div>

      {/* Goal Tree Diagram */}
      <GoalTree />

      {/* Goal Display */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl mb-4 border border-purple-200">
        <h3 className="text-purple-600 font-bold mb-2 flex items-center gap-2">
          <span>🎯</span> Current Goal
        </h3>
        <div className="text-3xl text-purple-700 font-bold bg-white inline-block px-6 py-2 rounded-xl border-2 border-purple-300">
          {goal}
        </div>
      </div>

      {/* Proof Tree */}
      <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-4 h-[300px] overflow-y-auto mb-4 border border-purple-200">
        <h3 className="text-purple-600 font-bold mb-3 flex items-center gap-2">
          <span>🌳</span> Proof Tree
        </h3>
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="mb-2"
            style={{ marginLeft: `${step.depth * 30}px` }}
          >
            <div className={`flex items-center gap-2 p-2 rounded-lg ${
              step.success ? 'bg-green-50 border-l-4 border-green-400' :
              step.failed ? 'bg-red-50 border-l-4 border-red-400' :
              'bg-white border-l-4 border-purple-400'
            }`}>
              {step.success && <span className="text-green-500">✅</span>}
              {step.failed && <span className="text-red-500">❌</span>}
              {!step.success && !step.failed && <span className="text-purple-500">🔍</span>}
              <span className={`text-sm ${
                step.success ? 'text-green-700' :
                step.failed ? 'text-red-700' :
                'text-gray-700'
              }`}>
                {step.text}
              </span>
            </div>
          </motion.div>
        ))}
        {steps.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">⬆️</div>
            <p className="text-gray-400">Click Start to begin backward chaining</p>
          </div>
        )}
      </div>

      {/* Result */}
      {found && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-400 text-center"
        >
          <span className="text-green-700 font-bold text-xl flex items-center justify-center gap-2">
            <span>🎉</span> Goal Proved Successfully! <span>🎉</span>
          </span>
        </motion.div>
      )}
    </div>
  );
}

// ==========================================
// COMPARISON VIEW with diagrams
// ==========================================
function ComparisonView({ speed }) {
  const [activeDemo, setActiveDemo] = useState("forward");

  const comparisons = [
    {
      aspect: "Approach",
      forward: "Data-Driven (Bottom-Up)",
      backward: "Goal-Driven (Top-Down)",
      forwardIcon: "⬆️",
      backwardIcon: "⬇️"
    },
    {
      aspect: "Start Point",
      forward: "Start with known facts",
      backward: "Start with hypothesis",
      forwardIcon: "📦",
      backwardIcon: "🎯"
    },
    {
      aspect: "Direction",
      forward: "Facts → Conclusions",
      backward: "Goal → Facts",
      forwardIcon: "📊→✨",
      backwardIcon: "🎯→📦"
    },
    {
      aspect: "When to Use",
      forward: "All facts known, many conclusions",
      backward: "Specific goal, many facts",
      forwardIcon: "🔍",
      backwardIcon: "💡"
    }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-pink-200 shadow-lg">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 text-transparent bg-clip-text mb-6 text-center">
        🔄 Forward vs Backward Chaining
      </h2>

      {/* Visual Comparison Diagram */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-4 rounded-xl border-2 border-indigo-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">⬆️</div>
            <h3 className="font-bold text-indigo-700">Forward Chaining</h3>
          </div>
          <div className="flex items-center justify-center gap-1 text-sm">
            <span className="bg-white px-2 py-1 rounded">F1</span>
            <span className="bg-white px-2 py-1 rounded">F2</span>
            <span className="text-indigo-400">→</span>
            <span className="bg-indigo-600 text-white px-2 py-1 rounded">R1</span>
            <span className="text-indigo-400">→</span>
            <span className="bg-white px-2 py-1 rounded border-l-4 border-green-400">C1</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-xl border-2 border-purple-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white">⬇️</div>
            <h3 className="font-bold text-purple-700">Backward Chaining</h3>
          </div>
          <div className="flex items-center justify-center gap-1 text-sm">
            <span className="bg-purple-600 text-white px-2 py-1 rounded">G1</span>
            <span className="text-purple-400">→</span>
            <span className="bg-white px-2 py-1 rounded">R1</span>
            <span className="text-purple-400">→</span>
            <span className="bg-white px-2 py-1 rounded">F1</span>
            <span className="bg-white px-2 py-1 rounded">F2</span>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl overflow-hidden mb-8 border border-pink-200">
        <div className="grid grid-cols-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 text-white font-bold">
          <div>Aspect</div>
          <div className="text-center">Forward Chaining</div>
          <div className="text-center">Backward Chaining</div>
        </div>
        
        {comparisons.map((comp, index) => (
          <div
            key={index}
            className={`grid grid-cols-3 p-4 ${
              index % 2 === 0 ? 'bg-white' : 'bg-indigo-50/50'
            }`}
          >
            <div className="font-bold text-gray-700 flex items-center gap-2">
              <span className="text-indigo-500">{comp.forwardIcon}</span>
              {comp.aspect}
            </div>
            <div className="text-center text-gray-600 flex items-center justify-center gap-2">
              <span className="text-indigo-600">{comp.forwardIcon}</span>
              {comp.forward}
            </div>
            <div className="text-center text-gray-600 flex items-center justify-center gap-2">
              <span className="text-purple-600">{comp.backwardIcon}</span>
              {comp.backward}
            </div>
          </div>
        ))}
      </div>

      {/* Demo Selector with Icons */}
      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={() => setActiveDemo("forward")}
          className={`px-8 py-3 rounded-xl font-bold transition flex items-center gap-2 ${
            activeDemo === "forward"
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-600 border border-indigo-200 hover:bg-indigo-50'
          }`}
        >
          <span>⬆️</span> Try Forward
        </button>
        <button
          onClick={() => setActiveDemo("backward")}
          className={`px-8 py-3 rounded-xl font-bold transition flex items-center gap-2 ${
            activeDemo === "backward"
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'bg-white text-gray-600 border border-purple-200 hover:bg-purple-50'
          }`}
        >
          <span>⬇️</span> Try Backward
        </button>
      </div>

      {/* Live Demo */}
      <div className="mt-4">
        {activeDemo === "forward" ? (
          <ForwardChainingDemo speed={speed} />
        ) : (
          <BackwardChainingDemo speed={speed} />
        )}
      </div>
    </div>
  );
}