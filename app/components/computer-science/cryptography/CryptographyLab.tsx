"use client";

import React, { useState, useEffect } from "react";
import { CryptographyTabId } from "./types";
import CaesarCipherCanvas from "./CaesarCipherCanvas";
import VigenereCanvas from "./VigenereCanvas";
import EnigmaMachineCanvas from "./EnigmaMachineCanvas";
import DiffieHellmanCanvas from "./DiffieHellmanCanvas";
import Sha256AvalancheCanvas from "./Sha256AvalancheCanvas";
import { useLab } from "@/app/hooks/useXP";
import { useChat } from "@/app/components/ChatContext";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";
import {
  KeyRound,
  Grid,
  Cpu,
  ShieldCheck,
  Hash,
  Target,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

interface Mission {
  id: string;
  tab: CryptographyTabId;
  title: string;
  task: string;
  hint: string;
}

const MISSIONS: Mission[] = [
  {
    id: "m1",
    tab: "caesar",
    title: "Mission 1: Auto-Crack Caesar's Code",
    task: "Use the 1-click 'Auto-Crack Key' button to test how Chi-squared letter frequencies detect the secret shift.",
    hint: "The letter 'E' makes up ~12.7% of standard English text!",
  },
  {
    id: "m2",
    tab: "vigenere",
    title: "Mission 2: Polyalphabetic Table Navigation",
    task: "Click any cell on the 26x26 Tabula Recta grid to inspect the row/column intersection.",
    hint: "Vigenère repeats a keyword, so the same letter is enciphered differently depending on position.",
  },
  {
    id: "m3",
    tab: "enigma",
    title: "Mission 3: Enigma's Fatal Flaw",
    task: "Type letters on the Enigma typewriter. Notice that a letter *never* lights up its own lamp!",
    hint: "Because the reflector sends current back on a different circuit, self-encryption is physically impossible.",
  },
  {
    id: "m4",
    tab: "diffie_hellman",
    title: "Mission 4: Complete a Key Agreement",
    task: "Check Alice and Bob's boxes. Verify both arrive at the exact same shared secret key.",
    hint: "Even though Eve sees public values A and B, she cannot calculate S without solving the discrete log.",
  },
  {
    id: "m5",
    tab: "sha256",
    title: "Mission 5: Mine a Bitcoin Block",
    task: "Click 'Mine Block' with target difficulty set to 2 zeros to find a valid Proof-of-Work nonce.",
    hint: "Miners repeat trillions of SHA-256 hashes until finding one with the required leading zeros.",
  },
];

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZZES: Record<CryptographyTabId, QuizQuestion> = {
  caesar: {
    question: "Why can simple Caesar ciphers be easily cracked by computers?",
    options: [
      "Because there are only 25 possible shifts, and letter frequency distributions remain unchanged",
      "Because Caesar used binary code",
      "Because shift ciphers only work on numbers",
      "Because Roman numerals are invalid in cryptography",
    ],
    correctIndex: 0,
    explanation: "With only 25 shift possibilities and preserved letter frequency spikes (like 'E'), computers crack Caesar ciphers instantly!",
  },
  vigenere: {
    question: "Why was the Vigenère cipher called 'Le Chiffre Indéchiffrable' (The Unbreakable Cipher)?",
    options: [
      "It destroyed the alphabet after 1 use",
      "Using a keyword shifts each letter differently, smoothing out single-letter frequency spikes",
      "It requires quantum computers to read",
      "It was written in an unknown ancient language",
    ],
    correctIndex: 1,
    explanation: "Because the shift changes with each letter of the repeating keyword, the letter 'E' might become 'P' in one word and 'X' in the next, defeating simple frequency analysis.",
  },
  enigma: {
    question: "What fatal flaw allowed Alan Turing and Bletchley Park codebreakers to crack Enigma?",
    options: [
      "Enigma machines ran on solar power",
      "A letter could never encrypt to itself",
      "The rotors only turned backwards",
      "Enigma keys were published in German newspapers",
    ],
    correctIndex: 1,
    explanation: "Because current could not loop back onto the same circuit, a letter could NEVER encrypt to itself. This eliminated massive search spaces and enabled the 'Turing Bombe' to decipher messages!",
  },
  diffie_hellman: {
    question: "What mathematical problem protects the Diffie-Hellman Key Exchange from eavesdroppers?",
    options: [
      "The Discrete Logarithm Problem (finding a when given g^a mod p)",
      "Simple addition and subtraction",
      "Calculating the area of a circle",
      "Sorting an array in O(N) time",
    ],
    correctIndex: 0,
    explanation: "While exponentiation g^a mod p is easy to compute forward, reversing it (the Discrete Logarithm) is computationally infeasible for large prime numbers.",
  },
  sha256: {
    question: "What is the 'Avalanche Effect' in cryptographic hash functions?",
    options: [
      "The computer freezes when hashing large files",
      "Changing a single bit of input flips ~50% of the output hash bits unpredictably",
      "Hashes become shorter when text gets longer",
      "Hashes can be decoded back to plaintext instantly",
    ],
    correctIndex: 1,
    explanation: "A good hash function ensures that even microscopic changes (like adding a period) produce completely uncorrelated, random-looking output hashes.",
  },
};

export default function CryptographyLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab(
    "computer-science/cryptography",
    "computerScience",
    "exploration"
  );

  const [activeTab, setActiveTab] = useState<CryptographyTabId>("caesar");
  const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>({});
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  // Challenge metrics
  const [ciphersEncrypted, setCiphersEncrypted] = useState(1);
  const [keysAgreed, setKeysAgreed] = useState(0);
  const [hashesMined, setHashesMined] = useState(0);
  const [experimentCompleted, setExperimentCompleted] = useState(false);

  useEffect(() => {
    setSelectedQuizAnswer(null);
    setQuizAnswered(false);
  }, [activeTab]);

  // AI Chat Context Registration
  useEffect(() => {
    setExperimentData({
      title: "Classical & Modern Cryptography Studio Lab",
      theory: `Interactive Classical and Modern Cryptography Studio.
Explores Classical Substitution Ciphers (Caesar shift, ROT13, frequency analysis, Chi-squared auto-cracker), Polyalphabetic Ciphers (Vigenère 26x26 Tabula Recta, repeating keystreams), WWII Enigma Rotor Machine (3 stepping rotors, turnover notches, Reflector UKW-B, Steckerbrett plugboard, signal trace), Asymmetric Cryptography (Diffie-Hellman Key Exchange, paint color mixing, discrete logarithm trapdoor function), and Cryptographic Hash Functions (SHA-256 bit avalanche effect, Bitcoin Proof-of-Work block mining).`,
      extraContext: {
        activeTab,
      },
    });
  }, [activeTab, setExperimentData]);

  // Award XP
  useEffect(() => {
    if (
      !experimentCompleted &&
      (ciphersEncrypted >= 2 || keysAgreed >= 1 || hashesMined >= 1)
    ) {
      completeExperiment();
      setExperimentCompleted(true);
    }
  }, [ciphersEncrypted, keysAgreed, hashesMined, experimentCompleted, completeExperiment]);

  const activeMission = MISSIONS.find((m) => m.tab === activeTab) || MISSIONS[0];
  const activeQuiz = QUIZZES[activeTab];

  const handleToggleMission = (missionId: string) => {
    setCompletedMissions((prev) => ({
      ...prev,
      [missionId]: !prev[missionId],
    }));
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-background text-foreground space-y-6">
      {/* ── Daily Challenge Floating Card ─────────────────────── */}
      <DailyChallengeCard
        labId="computer-science/cryptography"
        currentParams={{
          ciphersEncrypted: ciphersEncrypted + (activeTab === "caesar" || activeTab === "vigenere" || activeTab === "enigma" ? 1 : 0),
          keysAgreed: keysAgreed + (activeTab === "diffie_hellman" ? 1 : 0),
          hashesMined: hashesMined + (activeTab === "sha256" ? 1 : 0),
        }}
      />

      {/* ── Top Header Toolbar ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-3xl p-5 md:p-6 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <KeyRound size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Classical &amp; Modern Cryptography Studio
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Student-Friendly Lab
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              From Julius Caesar and the WWII Enigma machine to Diffie-Hellman internet keys and Bitcoin SHA-256 mining
            </p>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-2xl border border-border flex-wrap">
          <button
            onClick={() => {
              setActiveTab("caesar");
              setCiphersEncrypted((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "caesar"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <KeyRound size={14} />
            <span>Caesar &amp; Wheel</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("vigenere");
              setCiphersEncrypted((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "vigenere"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Grid size={14} />
            <span>Vigenère Table</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("enigma");
              setCiphersEncrypted((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "enigma"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Cpu size={14} />
            <span>Enigma Machine</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("diffie_hellman");
              setKeysAgreed((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "diffie_hellman"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <ShieldCheck size={14} />
            <span>Diffie-Hellman Keys</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("sha256");
              setHashesMined((c) => c + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "sha256"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            <Hash size={14} />
            <span>SHA-256 &amp; Mining</span>
          </button>
        </div>
      </div>

      {/* ── Student Learning Mission Card ─────────────────────── */}
      <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
            completedMissions[activeMission.id]
              ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
              : "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
          }`}>
            {completedMissions[activeMission.id] ? <CheckCircle2 size={20} /> : <Target size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-primary">Student Guided Goal</span>
              <h3 className="text-sm font-bold text-foreground">{activeMission.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {activeMission.task}
            </p>
            <p className="text-[11px] text-primary/80 italic mt-0.5">
              💡 Hint: {activeMission.hint}
            </p>
          </div>
        </div>

        <button
          onClick={() => handleToggleMission(activeMission.id)}
          className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 border ${
            completedMissions[activeMission.id]
              ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
              : "bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border-primary/20"
          }`}
        >
          {completedMissions[activeMission.id] ? (
            <>
              <CheckCircle2 size={16} />
              <span>Completed! (+50 XP)</span>
            </>
          ) : (
            <>
              <Target size={16} />
              <span>Mark as Completed</span>
            </>
          )}
        </button>
      </div>

      {/* ── Main Workspace Views ───────────────────────────────── */}
      {activeTab === "caesar" && <CaesarCipherCanvas />}
      {activeTab === "vigenere" && <VigenereCanvas />}
      {activeTab === "enigma" && <EnigmaMachineCanvas />}
      {activeTab === "diffie_hellman" && <DiffieHellmanCanvas />}
      {activeTab === "sha256" && <Sha256AvalancheCanvas />}

      {/* ── Student Quick-Check Quiz Widget ───────────────────── */}
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen size={18} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-primary block">Active Recall Checkpoint</span>
              <h3 className="text-sm font-bold text-foreground">Test Your Cryptography Concepts</h3>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
            1 Question Quick Quiz
          </span>
        </div>

        <div className="space-y-3">
          <p className="text-xs sm:text-sm font-bold text-foreground">
            {activeQuiz.question}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {activeQuiz.options.map((opt, idx) => {
              const isSelected = selectedQuizAnswer === idx;
              const isCorrect = idx === activeQuiz.correctIndex;
              let btnStyle = "bg-muted/40 hover:bg-accent border-border text-foreground";

              if (quizAnswered) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold";
                } else if (isSelected && !isCorrect) {
                  btnStyle = "bg-rose-500/20 border-rose-500 text-rose-500 font-bold";
                } else {
                  btnStyle = "bg-muted/20 opacity-50 border-border text-muted-foreground";
                }
              } else if (isSelected) {
                btnStyle = "bg-primary text-primary-foreground border-primary font-bold";
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (!quizAnswered) {
                      setSelectedQuizAnswer(idx);
                      setQuizAnswered(true);
                    }
                  }}
                  className={`p-3 rounded-2xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {quizAnswered && isCorrect && <CheckCircle2 size={16} className="text-emerald-500 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {quizAnswered && (
            <div className="p-3.5 bg-muted/40 border border-border rounded-2xl text-xs space-y-1 mt-2 animate-in fade-in">
              <span className="font-bold text-primary block">
                {selectedQuizAnswer === activeQuiz.correctIndex ? "🎉 Correct!" : "💡 Explanation:"}
              </span>
              <p className="text-muted-foreground leading-relaxed">
                {activeQuiz.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
