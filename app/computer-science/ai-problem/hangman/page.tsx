"use client";
// src/components/computer-science/ai-problem/Hangman.jsx
import React, { useState, useEffect } from "react";

// Word database with categories and hints
const WORD_DATABASE = {
  easy: [
    { word: "CAT", hint: "🐱 A furry pet that meows" },
    { word: "DOG", hint: "🐕 Man's best friend" },
    { word: "FISH", hint: "🐠 Swims in water" },
    { word: "BIRD", hint: "🦜 Animal with wings" },
    { word: "BOOK", hint: "📖 You read this" },
    { word: "SUN", hint: "☀️ Shines in the sky" },
    { word: "CAR", hint: "🚗 Vehicle with wheels" },
    { word: "HOUSE", hint: "🏠 Place where you live" }
  ],
  medium: [
    { word: "PYTHON", hint: "🐍 Programming language or snake" },
    { word: "JAVA", hint: "☕ Coffee or programming language" },
    { word: "REACT", hint: "⚛️ JavaScript library for UI" },
    { word: "APPLE", hint: "🍎 Fruit or tech company" },
    { word: "BRAIN", hint: "🧠 Organ in your head" },
    { word: "TIGER", hint: "🐯 Large striped cat" },
    { word: "OCEAN", hint: "🌊 Large body of water" },
    { word: "PIANO", hint: "🎹 Musical instrument" }
  ],
  hard: [
    { word: "ALGORITHM", hint: "📊 Step-by-step procedure" },
    { word: "FUNCTION", hint: "🔄 Reusable code block" },
    { word: "VARIABLE", hint: "📦 Stores data in programming" },
    { word: "DATABASE", hint: "💾 Stores organized data" },
    { word: "COMPILER", hint: "⚙️ Translates code to machine language" },
    { word: "KEYBOARD", hint: "⌨️ Device for typing" },
    { word: "MONITOR", hint: "🖥️ Computer screen" },
    { word: "PROCESSOR", hint: "⚡ Brain of computer" }
  ]
};

export default function Hangman() {
  const [activeTab, setActiveTab] = useState("demo");
  const [difficulty, setDifficulty] = useState("medium");

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-xl shadow-lg">
        <h1 className="text-3xl font-bold">🎮 Hangman Visual Learning Lab</h1>
        <p className="text-indigo-100 mt-1">Watch the code execute as you play with dynamic words!</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white border-x border-t rounded-b-lg shadow overflow-hidden">
        <button
          onClick={() => setActiveTab("demo")}
          className={`flex-1 py-3 px-4 font-medium text-center transition ${
            activeTab === "demo" 
              ? "bg-indigo-600 text-white" 
              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          📸 Photo Demo
        </button>
        <button
          onClick={() => setActiveTab("experiment")}
          className={`flex-1 py-3 px-4 font-medium text-center transition ${
            activeTab === "experiment" 
              ? "bg-indigo-600 text-white" 
              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          🔬 Code Experiments
        </button>
        <button
          onClick={() => setActiveTab("play")}
          className={`flex-1 py-3 px-4 font-medium text-center transition ${
            activeTab === "play" 
              ? "bg-indigo-600 text-white" 
              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          🎮 Play Game
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white p-6 rounded-b-lg shadow-lg min-h-[600px]">
        {activeTab === "demo" && <DemoTab />}
        {activeTab === "experiment" && <ExperimentTab />}
        {activeTab === "play" && (
          <div className="space-y-4">
            {/* Difficulty & Controls */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">Difficulty:</span>
                <select 
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="px-3 py-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="easy">🌟 Easy (3-4 letters)</option>
                  <option value="medium">⭐⭐ Medium (5-6 letters)</option>
                  <option value="hard">⭐⭐⭐ Hard (7-9 letters)</option>
                </select>
              </div>
              <div className="text-sm text-gray-500">
                Total words: {WORD_DATABASE[difficulty].length}
              </div>
            </div>
            
            {/* Game Area with key to force re-render on difficulty change */}
            <GameArea key={difficulty} difficulty={difficulty} />
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// DEMO TAB - Visual Step by Step
// ==========================================
function DemoTab() {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      step: 1,
      title: "Game Initialization",
      visual: {
        word: "_ _ _ _ _ _",
        guesses: "[]"
      },
      code: `% Word = [p, r, o, l, o, g]
% length(Word, 6)
% play(Word, [])`,
      drawing: `   ┌─────┐
   │     │
         │
         │
         │
         │
   ═══════`,
      explanation: "Computer selects secret word 'PROLOG' (6 letters)"
    },
    {
      step: 2,
      title: "Player guesses 'P'",
      visual: {
        word: "P _ _ _ _ _",
        guesses: "[p]"
      },
      code: `% read(p)
% member(p, []) → false
% play(Word, [p])`,
      drawing: `   ┌─────┐
   │     │
         │
         │
         │
         │
   ═══════`,
      explanation: "✓ 'P' is correct! First letter revealed"
    },
    {
      step: 3,
      title: "Player guesses 'R'",
      visual: {
        word: "P R _ _ _ _",
        guesses: "[r, p]"
      },
      code: `% read(r)
% member(r, [p]) → false
% play(Word, [r, p])`,
      drawing: `   ┌─────┐
   │     │
         │
         │
         │
         │
   ═══════`,
      explanation: "✓ 'R' is correct! Second letter revealed"
    },
    {
      step: 4,
      title: "Player guesses 'O'",
      visual: {
        word: "P R O _ O _",
        guesses: "[o, r, p]"
      },
      code: `% read(o)
% member(o, [r, p]) → false
% 'O' appears at positions 3 and 5`,
      drawing: `   ┌─────┐
   │     │
         │
         │
         │
         │
   ═══════`,
      explanation: "✓ 'O' appears twice! Both positions revealed"
    },
    {
      step: 5,
      title: "Player guesses 'L'",
      visual: {
        word: "P R O L O _",
        guesses: "[l, o, r, p]"
      },
      code: `% read(l)
% member(l, [o, r, p]) → false
% play(Word, [l, o, r, p])`,
      drawing: `   ┌─────┐
   │     │
         │
         │
         │
         │
   ═══════`,
      explanation: "✓ 'L' is correct! Only one letter left"
    },
    {
      step: 6,
      title: "Player guesses 'G' - WIN!",
      visual: {
        word: "P R O L O G 🏆",
        guesses: "[g, l, o, r, p]"
      },
      code: `% read(g)
% member(g, [l, o, r, p]) → false
% all_guessed(Word, [g,l,o,r,p]) → true
% writeln('You won!')`,
      drawing: `   ┌─────┐
   │     │
         │
         │
         │
         │
   ═══════ 🎉`,
      explanation: "✓ GAME WON! All letters guessed correctly!"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-indigo-800 mb-4">📸 Visual Step-by-Step Demo</h2>
      
      {/* Step Navigation */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStep(idx)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
              activeStep === idx 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Step {step.step}
          </button>
        ))}
      </div>

      {/* Active Step Display */}
      <div className="border-2 rounded-xl overflow-hidden shadow-md">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 border-b">
          <span className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            Step {steps[activeStep].step}
          </span>
          <span className="ml-3 font-semibold text-indigo-900">{steps[activeStep].title}</span>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 p-4">
          {/* Visual Column */}
          <div className="bg-white p-3 rounded-lg border-2 border-indigo-200">
            <div className="text-center mb-3">
              <div className="text-3xl font-mono tracking-widest bg-indigo-50 p-3 rounded">
                {steps[activeStep].visual.word}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Guesses: {steps[activeStep].visual.guesses}
              </div>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              {steps[activeStep].explanation}
            </div>
          </div>
          
          {/* Code Column */}
          <div className="bg-gray-900 p-3 rounded-lg">
            <div className="text-gray-400 text-xs mb-1">Prolog Code:</div>
            <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
              {steps[activeStep].code}
            </pre>
          </div>
          
          {/* Hangman Column */}
          <div className="bg-gray-800 p-3 rounded-lg flex items-center justify-center">
            <pre className="text-indigo-300 font-mono text-sm">
              {steps[activeStep].drawing}
            </pre>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

// ==========================================
// EXPERIMENT TAB - Interactive Code Testing
// ==========================================
function ExperimentTab() {
  const [activeExperiment, setActiveExperiment] = useState(0);
  
  const experiments = [
    {
      id: 1,
      title: "Duplicate Detection",
      icon: "🧪",
      color: "purple",
      before: "Guesses = [p, r]",
      guess: "p",
      result: "member(p, [p,r]) → true",
      code: `% Prolog executes:
member(p, [p,r]) → true
writeln('Already guessed!')
play(Word, [p,r])  % No change in guesses`,
      explanation: "✅ Program prevents duplicate guesses!"
    },
    {
      id: 2,
      title: "Wrong Guesses Tracking",
      icon: "⚠️",
      color: "red",
      before: "Wrong count = 5",
      guess: "x",
      result: "member(x, [p,r,o,l]) → false → wrong++",
      code: `% After 6 wrong guesses:
Wrong 1-5: O with parts
Wrong 6:   O
          /|\\
          / \\`,
      explanation: "⚠️ After 6 wrong guesses - GAME OVER!"
    },
    {
      id: 3,
      title: "Win Condition",
      icon: "🏆",
      color: "green",
      before: "Word = [p,r,o,l,o,g]",
      guess: "Guesses = [g,l,o,r,p]",
      result: "all_guessed(Word, Guesses) → true",
      code: `% all_guessed checks each letter:
member(p)? ✓  member(r)? ✓
member(o)? ✓  member(l)? ✓
member(g)? ✓  → WINNER! 🎉`,
      explanation: "✅ All letters guessed - YOU WIN!"
    },
    {
      id: 4,
      title: "List Construction",
      icon: "📋",
      color: "orange",
      before: "Guesses = [r, p]",
      guess: "o",
      result: "[o | [r, p]] = [o, r, p]",
      code: `% Prolog list construction:
[X | Rest] creates new list
[o | [r,p]] = [o, r, p]

play(Word, [o | [r,p]]) → play(Word, [o,r,p])`,
      explanation: "✅ New list created with prepended element"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-indigo-800 mb-4">🔬 Code Experiments</h2>
      
      <div className="grid md:grid-cols-4 gap-2 mb-4">
        {experiments.map((exp, idx) => (
          <button
            key={idx}
            onClick={() => setActiveExperiment(idx)}
            className={`p-3 rounded-lg text-center font-bold transition ${
              activeExperiment === idx 
                ? `bg-${exp.color}-600 text-white` 
                : `bg-${exp.color}-50 text-${exp.color}-800 hover:bg-${exp.color}-100`
            }`}
          >
            {exp.icon} {exp.title}
          </button>
        ))}
      </div>

      <div className={`bg-gradient-to-br from-${experiments[activeExperiment].color}-50 to-pink-50 p-5 rounded-xl border-2 border-${experiments[activeExperiment].color}-200 shadow-md`}>
        <h3 className={`text-lg font-bold text-${experiments[activeExperiment].color}-800 mb-3`}>
          {experiments[activeExperiment].icon} Experiment {experiments[activeExperiment].id}: {experiments[activeExperiment].title}
        </h3>
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-lg">
            <div className="font-mono text-sm">Before: {experiments[activeExperiment].before}</div>
            <div className="font-mono text-sm mt-2">Player guesses: <span className="bg-yellow-100 px-2 py-1 rounded">{experiments[activeExperiment].guess}</span></div>
            <div className="font-mono text-sm mt-2 bg-gray-100 p-2 rounded">
              {experiments[activeExperiment].result}
            </div>
          </div>
          <div className="bg-gray-900 p-3 rounded-lg">
            <pre className="text-green-400 text-xs">
              {experiments[activeExperiment].code}
            </pre>
          </div>
          <p className="text-sm text-gray-600">{experiments[activeExperiment].explanation}</p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// GAME AREA - Fully Dynamic with Word Changes
// ==========================================
function GameArea({ difficulty }) {
  // Function to get random word
  const getRandomWord = () => {
    const words = WORD_DATABASE[difficulty];
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };

  // State for current word
  const [currentWordData, setCurrentWordData] = useState(getRandomWord());
  const [secretWord, setSecretWord] = useState(currentWordData.word.split(''));
  const [hint, setHint] = useState(currentWordData.hint);
  
  // Game state
  const [guesses, setGuesses] = useState([]);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [wrongCount, setWrongCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Update when difficulty changes or new game starts
  useEffect(() => {
    const newWordData = getRandomWord();
    setCurrentWordData(newWordData);
    setSecretWord(newWordData.word.split(''));
    setHint(newWordData.hint);
    resetGame();
  }, [difficulty]);

  // Hangman stages with better visuals
  const hangmanStages = [
    `    ┌─────┐
    │     │
          │
          │
          │
          │
    ═══════`,
    `    ┌─────┐
    │     │
    O     │
          │
          │
          │
    ═══════`,
    `    ┌─────┐
    │     │
    O     │
    │     │
          │
          │
    ═══════`,
    `    ┌─────┐
    │     │
    O     │
   /│     │
          │
          │
    ═══════`,
    `    ┌─────┐
    │     │
    O     │
   /│\\    │
          │
          │
    ═══════`,
    `    ┌─────┐
    │     │
    O     │
   /│\\    │
   /      │
          │
    ═══════`,
    `    ┌─────┐
    │     │
    O     │
   /│\\    │
   / \\    │
          │
    ═══════`
  ];

  const displayWord = secretWord.map(letter => 
    guesses.includes(letter) ? letter : '_'
  ).join(' ');

  const handleGuess = () => {
    const letter = input.toUpperCase();
    
    if (!letter.match(/^[A-Z]$/)) {
      setMessage('❌ Please enter a single letter!');
      setInput('');
      return;
    }

    if (guesses.includes(letter)) {
      setMessage(`⚠️ "${letter}" already guessed!`);
      setInput('');
      return;
    }

    const newGuesses = [...guesses, letter];
    setGuesses(newGuesses);

    if (secretWord.includes(letter)) {
      setMessage(`✅ "${letter}" is correct!`);
      
      if (secretWord.every(l => newGuesses.includes(l))) {
        setGameWon(true);
        setMessage('🎉 CONGRATULATIONS! YOU WON! 🎉');
      }
    } else {
      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);
      setMessage(`❌ "${letter}" is wrong! (${newWrong}/6)`);
      
      if (newWrong >= 6) {
        setGameLost(true);
        setMessage('💀 GAME OVER! The hangman is complete!');
      }
    }
    
    setInput('');
  };

  // Function to start new game with different word
  const startNewGame = () => {
    const newWordData = getRandomWord();
    setCurrentWordData(newWordData);
    setSecretWord(newWordData.word.split(''));
    setHint(newWordData.hint);
    resetGame();
  };

  // Function to reset same word
  const resetGame = () => {
    setGuesses([]);
    setWrongCount(0);
    setGameWon(false);
    setGameLost(false);
    setMessage('');
    setShowHint(false);
    setInput('');
  };

  return (
    <div className="space-y-6">
      {/* Game Header with Word Info */}
      <div className="flex justify-between items-center bg-indigo-50 p-3 rounded-lg">
        <div>
          <span className="font-bold text-indigo-800">Current Word: </span>
          <span className="text-gray-600">{secretWord.length} letters</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetGame}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            🔄 Reset Same Word
          </button>
          <button
            onClick={startNewGame}
            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
          >
            🎲 Random New Word
          </button>
        </div>
      </div>

      {/* Main Game Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Game Visuals */}
        <div className="space-y-4">
          {/* Hangman Drawing */}
          <div className="bg-gray-900 p-4 rounded-xl flex justify-center">
            <pre className="text-indigo-300 font-mono text-sm">
              {gameLost ? hangmanStages[6] : hangmanStages[wrongCount]}
            </pre>
          </div>

          {/* Word Display */}
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-xl text-center border-2 border-indigo-300">
            <div className="text-4xl font-mono tracking-widest mb-2">
              {displayWord}
            </div>
            <div className="text-sm text-gray-600">
              Wrong guesses: {wrongCount}/6
            </div>
          </div>

          {/* Input Area */}
          {!gameWon && !gameLost ? (
            <div className="flex gap-2">
              <input
                type="text"
             
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                className="w-20 h-14 text-center text-2xl font-bold border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 uppercase"
                placeholder="?"
              />
              <button
                onClick={handleGuess}
                className="flex-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold text-lg"
              >
                Guess Letter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={resetGame}
                className="py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
              >
                🔄 Play Again (Same Word)
              </button>
              <button
                onClick={startNewGame}
                className="py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold"
              >
                🎲 New Random Word
              </button>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className={`p-3 rounded-lg text-center font-bold ${
              message.includes('✅') ? 'bg-green-100 text-green-800 border-2 border-green-300' :
              message.includes('❌') ? 'bg-red-100 text-red-800 border-2 border-red-300' :
              message.includes('🎉') ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300 animate-pulse' :
              message.includes('💀') ? 'bg-gray-800 text-white border-2 border-gray-900' :
              'bg-blue-100 text-blue-800 border-2 border-blue-300'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Right Column - Information */}
        <div className="space-y-4">
          {/* Hint Section */}
          <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-300">
            <button
              onClick={() => setShowHint(!showHint)}
              className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 font-bold"
            >
              {showHint ? '🔒 Hide Hint' : '💡 Show Hint'}
            </button>
            {showHint && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-yellow-300">
                <span className="font-bold text-yellow-800">Hint:</span>
                <p className="text-gray-700 mt-1">{hint}</p>
              </div>
            )}
          </div>

          {/* Guessed Letters */}
          <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-300">
            <h3 className="font-bold text-gray-700 mb-2">📝 Guessed Letters:</h3>
            <div className="bg-white p-3 rounded-lg min-h-[60px] font-mono">
              {guesses.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {guesses.map((letter, idx) => (
                    <span key={idx} className={`px-2 py-1 rounded ${
                      secretWord.includes(letter) 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {letter}
                    </span>
                  ))}
                </div>
              ) : '— No guesses yet —'}
            </div>
          </div>

          {/* Code Visualization */}
          <div className="bg-gray-900 p-4 rounded-xl">
            <h3 className="text-white font-bold mb-3">💻 Prolog Code Execution:</h3>
            <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
{`play(Word, Guesses) :-
    show_progress(Word, Guesses),
    ( all_guessed(Word, Guesses)
    -> writeln('You won!')
    ; write('Enter letter: '),
      read(X),
      ( member(X, Guesses)
      -> writeln('Already guessed!'),
         play(Word, Guesses)
      ; play(Word, [X|Guesses])
      )
    ).`}
            </pre>
          </div>

          {/* Current State */}
          <div className="bg-indigo-50 p-4 rounded-xl border-2 border-indigo-300">
            <h3 className="font-bold text-indigo-800 mb-2">📊 Current Program State:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-white p-2 rounded">
                <span className="font-mono">Word:</span>
                <span className="float-right font-mono">[{secretWord.join(',')}]</span>
              </div>
              <div className="bg-white p-2 rounded">
                <span className="font-mono">Guesses:</span>
                <span className="float-right font-mono">[{guesses.join(',')}]</span>
              </div>
              <div className="bg-white p-2 rounded col-span-2">
                <span className="font-mono">all_guessed:</span>
                <span className={`float-right font-bold ${secretWord.every(l => guesses.includes(l)) ? 'text-green-600' : 'text-red-600'}`}>
                  {secretWord.every(l => guesses.includes(l)) ? 'true' : 'false'}
                </span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-300">
            <h3 className="font-bold text-gray-700 mb-2">📈 Statistics:</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-2 rounded">
                Correct: {guesses.filter(g => secretWord.includes(g)).length}
              </div>
              <div className="bg-white p-2 rounded">
                Wrong: {guesses.filter(g => !secretWord.includes(g)).length}
              </div>
              <div className="bg-white p-2 rounded col-span-2">
                Progress: {secretWord.filter(l => guesses.includes(l)).length}/{secretWord.length} letters
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}