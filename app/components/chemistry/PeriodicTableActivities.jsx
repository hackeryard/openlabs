"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  FlaskConical,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  X,
  ChevronRight,
  TrendingUp,
  Scale
} from "lucide-react";

const PRE_LAB_QUESTIONS = [
  {
    id: 1,
    question: "What primarily determines the chemical reactivity and bonding characteristics of an element?",
    options: [
      { text: "The total number of neutrons in the nucleus", isCorrect: false },
      { text: "The number and arrangement of valence (outer shell) electrons", isCorrect: true },
      { text: "The atomic mass of the isotope", isCorrect: false },
      { text: "The year and country where the element was discovered", isCorrect: false }
    ],
    explanation: "Elements in the same group have the same number of valence electrons, which governs how they gain, lose, or share electrons during chemical reactions."
  },
  {
    id: 2,
    question: "How does the atomic radius generally change as you move from left to right across a period?",
    options: [
      { text: "It decreases due to increasing effective nuclear charge (Zeff) pulling electrons closer", isCorrect: true },
      { text: "It increases because more electrons are added to new shells", isCorrect: false },
      { text: "It stays constant because the principal quantum number (n) does not change", isCorrect: false },
      { text: "It fluctuates randomly with no discernible trend", isCorrect: false }
    ],
    explanation: "Across a period, electrons are added to the same principal energy level while protons are added to the nucleus, increasing Zeff and pulling the electron cloud inward."
  },
  {
    id: 3,
    question: "Why are Group 18 elements called 'Noble Gases'?",
    options: [
      { text: "They are extremely acidic and dissolve glassware", isCorrect: false },
      { text: "They have complete valence electron octets (s²p⁶), making them exceptionally inert", isCorrect: true },
      { text: "They conduct electricity better than any metal", isCorrect: false },
      { text: "They are only found in radioactive ore deposits", isCorrect: false }
    ],
    explanation: "Noble gases have full valence shells (Helium has 2, others have 8), giving them high chemical stability and minimal tendency to form bonds under standard conditions."
  }
];

const POST_LAB_QUESTIONS = [
  {
    id: 1,
    question: "Between Lithium (Li, Period 2) and Cesium (Cs, Period 6), which alkali metal is more violently reactive with water and why?",
    options: [
      { text: "Lithium, because its small radius concentrates charge", isCorrect: false },
      { text: "Cesium, because its valence electron is furthest from the nucleus and easiest to lose (lower ionization energy)", isCorrect: true },
      { text: "Both react at exactly the identical rate", isCorrect: false },
      { text: "Neither reacts with water at room temperature", isCorrect: false }
    ],
    explanation: "As you descend Group 1, inner electron shells shield the single valence electron from the nucleus, lowering ionization energy and increasing reactivity."
  },
  {
    id: 2,
    question: "Fluorine (F) is the most electronegative element on the periodic table (3.98 Pauling). What does this mean?",
    options: [
      { text: "It readily loses 3 electrons in any reaction", isCorrect: false },
      { text: "It has the strongest tendency to attract shared bonding electrons toward itself", isCorrect: true },
      { text: "It has the highest atomic mass in Group 17", isCorrect: false },
      { text: "It forms positive cations readily", isCorrect: false }
    ],
    explanation: "Electronegativity is a measure of an atom's ability in a chemical compound to attract shared electrons. Fluorine's small radius and high Zeff make it the strongest electron attractor."
  },
  {
    id: 3,
    question: "When a metal from Group 2 (e.g., Magnesium) reacts with a non-metal from Group 17 (e.g., Chlorine), what type of compound forms?",
    options: [
      { text: "An ionic salt with formula MgCl₂", isCorrect: true },
      { text: "A covalent gas with formula MgCl", isCorrect: false },
      { text: "A metallic alloy with formula Mg₂Cl", isCorrect: false },
      { text: "No reaction occurs between metals and halogens", isCorrect: false }
    ],
    explanation: "Group 2 metals lose 2 valence electrons (forming Mg²⁺), while halogens gain 1 electron each (forming Cl⁻), yielding neutral ionic salt MgCl₂."
  }
];

export default function PeriodicTableActivities({ isOpen, onClose, elements, onSelectElement }) {
  const [activeTab, setActiveTab] = useState("prelab"); // 'prelab' | 'experiment' | 'postlab'

  // Pre-lab state
  const [preAnswers, setPreAnswers] = useState({});
  // Post-lab state
  const [postAnswers, setPostAnswers] = useState({});

  // Trend Experiment State
  const [el1Symbol, setEl1Symbol] = useState("Na");
  const [el2Symbol, setEl2Symbol] = useState("Cl");

  if (!isOpen) return null;

  const el1 = elements.find(e => e.symbol === el1Symbol) || elements[10];
  const el2 = elements.find(e => e.symbol === el2Symbol) || elements[16];

  const handlePreSelect = (qId, optionIdx) => {
    if (preAnswers[qId] !== undefined) return; // locked once answered
    setPreAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handlePostSelect = (qId, optionIdx) => {
    if (postAnswers[qId] !== undefined) return;
    setPostAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const preScore = Object.entries(preAnswers).filter(
    ([qId, optIdx]) => PRE_LAB_QUESTIONS.find(q => q.id === Number(qId))?.options[optIdx]?.isCorrect
  ).length;

  const postScore = Object.entries(postAnswers).filter(
    ([qId, optIdx]) => POST_LAB_QUESTIONS.find(q => q.id === Number(qId))?.options[optIdx]?.isCorrect
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 border-b border-border bg-muted/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <FlaskConical size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded">
                  Student Guided Curriculum
                </span>
                <span className="text-xs text-muted-foreground font-medium">Classroom & Self-Study Activity</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Periodic Table Interactive Laboratory
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigator */}
        <div className="grid grid-cols-3 border-b border-border bg-card shrink-0">
          <button
            onClick={() => setActiveTab("prelab")}
            className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === "prelab"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
            }`}
          >
            <HelpCircle size={16} />
            <span>1. Pre-Lab Questions</span>
            {Object.keys(preAnswers).length > 0 && (
              <span className="text-[10px] bg-indigo-500/10 px-1.5 py-0.2 rounded font-mono">
                {preScore}/3
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("experiment")}
            className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === "experiment"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
            }`}
          >
            <Scale size={16} />
            <span>2. Trends Experiment</span>
          </button>

          <button
            onClick={() => setActiveTab("postlab")}
            className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === "postlab"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
            }`}
          >
            <Award size={16} />
            <span>3. Post-Lab Quiz</span>
            {Object.keys(postAnswers).length > 0 && (
              <span className="text-[10px] bg-indigo-500/10 px-1.5 py-0.2 rounded font-mono">
                {postScore}/3
              </span>
            )}
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* TAB 1: PRE-LAB */}
          {activeTab === "prelab" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-muted-foreground flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block text-sm mb-0.5">Pre-Lab Diagnostic Activity</span>
                  Answer these fundamental questions before exploring the elements matrix to test your baseline intuition.
                </div>
                <div className="text-right">
                  <span className="text-lg font-black font-mono text-indigo-600 dark:text-indigo-400">{preScore} / 3</span>
                  <span className="block text-[10px] uppercase font-bold text-muted-foreground">Score</span>
                </div>
              </div>

              {PRE_LAB_QUESTIONS.map((q, qIndex) => {
                const userAns = preAnswers[q.id];
                const hasAnswered = userAns !== undefined;

                return (
                  <div key={q.id} className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-sm">
                    <h3 className="font-bold text-foreground text-sm sm:text-base flex items-start gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-muted text-xs font-mono font-black text-muted-foreground">Q{qIndex + 1}</span>
                      <span>{q.question}</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userAns === optIdx;
                        let btnStyle = "bg-muted/50 hover:bg-muted border-border text-foreground";
                        if (hasAnswered) {
                          if (opt.isCorrect) {
                            btnStyle = "bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold";
                          } else if (isChosen && !opt.isCorrect) {
                            btnStyle = "bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300 line-through";
                          } else {
                            btnStyle = "opacity-40 border-border text-muted-foreground";
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={hasAnswered}
                            onClick={() => handlePreSelect(q.id, optIdx)}
                            className={`p-3 rounded-xl border text-left text-xs transition flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt.text}</span>
                            {hasAnswered && opt.isCorrect && <CheckCircle2 size={16} className="text-emerald-500 shrink-0 ml-2" />}
                            {hasAnswered && isChosen && !opt.isCorrect && <XCircle size={16} className="text-rose-500 shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>

                    {hasAnswered && (
                      <div className="mt-2 p-3 bg-muted/60 rounded-xl text-xs text-muted-foreground border border-border">
                        <strong className="text-foreground">Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveTab("experiment")}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <span>Proceed to Trends Experiment</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: TRENDS EXPERIMENT */}
          {activeTab === "experiment" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-muted-foreground">
                <span className="font-bold text-foreground block text-sm mb-0.5">Comparative Element Trend Experiment</span>
                Select any two elements to directly compare their atomic structure, electronegativity, valence electrons, and periodic grouping to verify the periodic law.
              </div>

              {/* Element Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block">
                    Element A (Test Sample 1)
                  </label>
                  <select
                    value={el1Symbol}
                    onChange={(e) => setEl1Symbol(e.target.value)}
                    className="w-full bg-muted border border-border rounded-xl p-2.5 text-sm font-bold text-foreground outline-none"
                  >
                    {elements.map(e => (
                      <option key={e.symbol} value={e.symbol}>
                        {e.atomicNumber}. {e.name} ({e.symbol}) - {e.category}
                      </option>
                    ))}
                  </select>

                  <div className="pt-2 border-t border-border/60 space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Atomic Number (Z):</span> <span className="font-mono font-bold">{el1.atomicNumber}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Atomic Mass:</span> <span className="font-mono font-bold">{el1.atomicMass} u</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Period & Group:</span> <span className="font-mono font-bold">P{el1.period}, G{el1.group}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Block:</span> <span className="font-mono font-bold">{el1.block}-block</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Electronegativity:</span> <span className="font-mono font-bold text-indigo-500">{el1.electronegativity ?? "N/A (Inert)"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Configuration:</span> <span className="font-mono text-[11px] font-semibold">{el1.electronConfig}</span></div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground block">
                    Element B (Test Sample 2)
                  </label>
                  <select
                    value={el2Symbol}
                    onChange={(e) => setEl2Symbol(e.target.value)}
                    className="w-full bg-muted border border-border rounded-xl p-2.5 text-sm font-bold text-foreground outline-none"
                  >
                    {elements.map(e => (
                      <option key={e.symbol} value={e.symbol}>
                        {e.atomicNumber}. {e.name} ({e.symbol}) - {e.category}
                      </option>
                    ))}
                  </select>

                  <div className="pt-2 border-t border-border/60 space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Atomic Number (Z):</span> <span className="font-mono font-bold">{el2.atomicNumber}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Atomic Mass:</span> <span className="font-mono font-bold">{el2.atomicMass} u</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Period & Group:</span> <span className="font-mono font-bold">P{el2.period}, G{el2.group}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Block:</span> <span className="font-mono font-bold">{el2.block}-block</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Electronegativity:</span> <span className="font-mono font-bold text-indigo-500">{el2.electronegativity ?? "N/A (Inert)"}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Configuration:</span> <span className="font-mono text-[11px] font-semibold">{el2.electronConfig}</span></div>
                  </div>
                </div>
              </div>

              {/* Comparative Analysis Findings */}
              <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                  <TrendingUp size={16} className="text-indigo-500" />
                  <span>Observation & Bonding Prediction</span>
                </h4>
                <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
                  <p>
                    <strong>Electronegativity Difference (ΔEN): </strong>
                    {el1.electronegativity && el2.electronegativity
                      ? `${Math.abs(el1.electronegativity - el2.electronegativity).toFixed(2)} (${
                          Math.abs(el1.electronegativity - el2.electronegativity) > 1.7
                            ? "Predominantly Ionic Bond"
                            : Math.abs(el1.electronegativity - el2.electronegativity) > 0.4
                            ? "Polar Covalent Bond"
                            : "Non-polar Covalent Bond"
                        })`
                      : "Cannot form covalent bond (noble gas or inert element)"}
                  </p>
                  <p>
                    <strong>Shell Expansion (Period {el1.period} vs Period {el2.period}): </strong>
                    {el1.period !== el2.period
                      ? `${el1.period > el2.period ? el1.name : el2.name} occupies higher principal quantum shell (n=${Math.max(el1.period, el2.period)}), exhibiting significant electron shielding.`
                      : `Both elements reside in Period ${el1.period}; differences in radius are driven by nuclear charge (Z=${el1.atomicNumber} vs Z=${el2.atomicNumber}).`}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveTab("postlab")}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <span>Proceed to Post-Lab Mastery Quiz</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: POST-LAB */}
          {activeTab === "postlab" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-muted-foreground flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block text-sm mb-0.5">Post-Lab Application & Mastery Evaluation</span>
                  Test your comprehension of periodic trends, electronegativity, and chemical bonding principles.
                </div>
                <div className="text-right">
                  <span className="text-lg font-black font-mono text-indigo-600 dark:text-indigo-400">{postScore} / 3</span>
                  <span className="block text-[10px] uppercase font-bold text-muted-foreground">Score</span>
                </div>
              </div>

              {POST_LAB_QUESTIONS.map((q, qIndex) => {
                const userAns = postAnswers[q.id];
                const hasAnswered = userAns !== undefined;

                return (
                  <div key={q.id} className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-sm">
                    <h3 className="font-bold text-foreground text-sm sm:text-base flex items-start gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-muted text-xs font-mono font-black text-muted-foreground">Q{qIndex + 1}</span>
                      <span>{q.question}</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userAns === optIdx;
                        let btnStyle = "bg-muted/50 hover:bg-muted border-border text-foreground";
                        if (hasAnswered) {
                          if (opt.isCorrect) {
                            btnStyle = "bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold";
                          } else if (isChosen && !opt.isCorrect) {
                            btnStyle = "bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300 line-through";
                          } else {
                            btnStyle = "opacity-40 border-border text-muted-foreground";
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={hasAnswered}
                            onClick={() => handlePostSelect(q.id, optIdx)}
                            className={`p-3 rounded-xl border text-left text-xs transition flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt.text}</span>
                            {hasAnswered && opt.isCorrect && <CheckCircle2 size={16} className="text-emerald-500 shrink-0 ml-2" />}
                            {hasAnswered && isChosen && !opt.isCorrect && <XCircle size={16} className="text-rose-500 shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>

                    {hasAnswered && (
                      <div className="mt-2 p-3 bg-muted/60 rounded-xl text-xs text-muted-foreground border border-border">
                        <strong className="text-foreground">Scientific Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}

              {Object.keys(postAnswers).length === 3 && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 text-center space-y-2">
                  <div className="inline-flex p-3 rounded-2xl bg-indigo-600 text-white mb-2 shadow-lg shadow-indigo-500/30">
                    <Award size={28} />
                  </div>
                  <h4 className="text-lg font-black text-foreground">
                    Periodic Table Lab Completed!
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    You scored {postScore} / 3 on the post-lab challenge. You have mastered periodic trends, electronegativity, and valence electron reactivity!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex justify-between items-center shrink-0">
          <div className="text-xs text-muted-foreground">
            Progress: Pre-Lab ({Object.keys(preAnswers).length}/3) • Post-Lab ({Object.keys(postAnswers).length}/3)
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-muted hover:bg-accent text-foreground text-xs font-bold transition"
          >
            Close Activities
          </button>
        </div>
      </motion.div>
    </div>
  );
}

