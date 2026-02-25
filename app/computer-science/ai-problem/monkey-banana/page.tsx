"use client";
// src/components/computer-science/ai-problem/MonkeyBanana.jsx
import React, { useState } from "react";

export default function MonkeyBanana() {
  // Simulator state
  const [state, setState] = useState({
    monkeyPos: 'atdoor',
    monkeyOn: 'onfloor',
    boxPos: 'atwindow',
    hasBanana: 'hasnot'
  });
  
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const [activeAction, setActiveAction] = useState(null);
  const [showTheory, setShowTheory] = useState(true);

  // Prolog code with explanations
  const prologCode = [
    { line: 1, code: "% MONKEY-BANANA PROBLEM", desc: "Classic AI state space search" },
    { line: 2, code: "", desc: "" },
    { line: 3, code: "% state(MonkeyPos, MonkeyOn, BoxPos, HasBanana)", desc: "State representation" },
    { line: 4, code: "% MonkeyPos: atdoor, atwindow, atmiddle", desc: "Three possible positions" },
    { line: 5, code: "% MonkeyOn: onfloor, onbox", desc: "Monkey on floor or box" },
    { line: 6, code: "% BoxPos: atdoor, atwindow, atmiddle", desc: "Box positions" },
    { line: 7, code: "% HasBanana: has, hasnot", desc: "Whether banana is obtained" },
    { line: 8, code: "", desc: "" },
    { line: 9, code: "% ===== ACTION 1: MOVE =====", desc: "Monkey moves between positions" },
    { line: 10, code: "move(state(P1, onfloor, B, H),", desc: "Precondition: Monkey on floor" },
    { line: 11, code: "     state(P2, onfloor, B, H)) :-", desc: "Effect: Monkey position changes" },
    { line: 12, code: "    different(P1, P2).", desc: "Must move to different position" },
    { line: 13, code: "", desc: "" },
    { line: 14, code: "% ===== ACTION 2: PUSH =====", desc: "Monkey pushes box" },
    { line: 15, code: "push(state(P, onfloor, P, H),", desc: "Precondition: Monkey & box together" },
    { line: 16, code: "     state(P2, onfloor, P2, H)) :-", desc: "Effect: Both move together" },
    { line: 17, code: "    different(P, P2).", desc: "Must push to different position" },
    { line: 18, code: "", desc: "" },
    { line: 19, code: "% ===== ACTION 3: CLIMB =====", desc: "Monkey climbs onto box" },
    { line: 20, code: "climb(state(P, onfloor, P, H),", desc: "Precondition: Together on floor" },
    { line: 21, code: "      state(P, onbox, P, H)).", desc: "Effect: Monkey now on box" },
    { line: 22, code: "", desc: "" },
    { line: 23, code: "% ===== ACTION 4: GRAB =====", desc: "Monkey grabs banana" },
    { line: 24, code: "grab(state(P, onbox, P, hasnot),", desc: "Precondition: On box, no banana" },
    { line: 25, code: "     state(P, onbox, P, has)).", desc: "Effect: HAS BANANA! (GOAL)" },
    { line: 26, code: "", desc: "" },
    { line: 27, code: "% ===== HELPER =====", desc: "Different positions predicate" },
    { line: 28, code: "different(atdoor, atwindow).", desc: "Door ≠ Window" },
    { line: 29, code: "different(atdoor, atmiddle).", desc: "Door ≠ Middle" },
    { line: 30, code: "different(atwindow, atmiddle).", desc: "Window ≠ Middle" },
    { line: 31, code: "different(atwindow, atdoor).", desc: "Window ≠ Door" },
    { line: 32, code: "different(atmiddle, atdoor).", desc: "Middle ≠ Door" },
    { line: 33, code: "different(atmiddle, atwindow).", desc: "Middle ≠ Window" },
  ];

  const positions = [
    { id: 'atdoor', label: 'DOOR', icon: '🚪', x: 15, color: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', btn: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'atwindow', label: 'WINDOW', icon: '🪟', x: 50, color: 'cyan', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', btn: 'bg-cyan-500 hover:bg-cyan-600' },
    { id: 'atmiddle', label: 'MIDDLE', icon: '📍', x: 85, color: 'amber', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', btn: 'bg-amber-500 hover:bg-amber-600' }
  ];

  // Action validations
  const canMove = (toPos) => {
    if (state.monkeyOn !== 'onfloor') return false;
    if (state.monkeyPos === toPos) return false;
    return true;
  };

  const canPush = (toPos) => {
    if (state.monkeyOn !== 'onfloor') return false;
    if (state.monkeyPos !== state.boxPos) return false;
    if (state.monkeyPos === toPos) return false;
    return true;
  };

  const canClimb = () => {
    if (state.monkeyOn !== 'onfloor') return false;
    if (state.monkeyPos !== state.boxPos) return false;
    return true;
  };

  const canGrab = () => {
    if (state.hasBanana === 'has') return false;
    if (state.monkeyOn !== 'onbox') return false;
    if (state.monkeyPos !== 'atmiddle') return false;
    return true;
  };

  // Actions with code highlighting
  const handleMove = (toPos) => {
    if (!canMove(toPos)) {
      setMessage('❌ Cannot move: Invalid action');
      return;
    }

    setActiveAction('MOVE');
    setCurrentLine(10);
    setTimeout(() => setCurrentLine(11), 800);
    setTimeout(() => setCurrentLine(12), 1600);

    const newState = { ...state, monkeyPos: toPos };
    setState(newState);
    setHistory([...history, { 
      action: 'move', 
      from: state.monkeyPos, 
      to: toPos,
      state: newState
    }]);
    setMessage(`✅ Monkey moved to ${toPos}`);
    
    setTimeout(() => { setCurrentLine(0); setActiveAction(null); }, 2500);
  };

  const handlePush = (toPos) => {
    if (!canPush(toPos)) {
      setMessage('❌ Cannot push: Monkey and box must be together');
      return;
    }

    setActiveAction('PUSH');
    setCurrentLine(15);
    setTimeout(() => setCurrentLine(16), 800);
    setTimeout(() => setCurrentLine(17), 1600);

    const newState = { ...state, monkeyPos: toPos, boxPos: toPos };
    setState(newState);
    setHistory([...history, { 
      action: 'push', 
      to: toPos,
      state: newState
    }]);
    setMessage(`✅ Monkey pushed box to ${toPos}`);
    
    setTimeout(() => { setCurrentLine(0); setActiveAction(null); }, 2500);
  };

  const handleClimb = () => {
    if (!canClimb()) {
      setMessage('❌ Cannot climb: Monkey and box must be together');
      return;
    }

    setActiveAction('CLIMB');
    setCurrentLine(20);
    setTimeout(() => setCurrentLine(21), 1000);

    const newState = { ...state, monkeyOn: 'onbox' };
    setState(newState);
    setHistory([...history, { 
      action: 'climb',
      state: newState
    }]);
    setMessage('✅ Monkey climbed onto box');
    
    setTimeout(() => { setCurrentLine(0); setActiveAction(null); }, 2000);
  };

  const handleGrab = () => {
    if (!canGrab()) {
      setMessage('❌ Cannot grab: Monkey must be on box at middle');
      return;
    }

    setActiveAction('GRAB');
    setCurrentLine(24);
    setTimeout(() => setCurrentLine(25), 1000);

    const newState = { ...state, hasBanana: 'has' };
    setState(newState);
    setHistory([...history, { 
      action: 'grab',
      state: newState
    }]);
    setMessage('🎉 SUCCESS! Monkey got the banana!');
    
    setTimeout(() => { setCurrentLine(0); setActiveAction(null); }, 2000);
  };

  const resetSimulator = () => {
    setState({
      monkeyPos: 'atdoor',
      monkeyOn: 'onfloor',
      boxPos: 'atwindow',
      hasBanana: 'hasnot'
    });
    setHistory([]);
    setMessage('');
    setCurrentLine(0);
    setActiveAction(null);
  };

  // Helper to get position style
  const getPositionStyle = (posId) => {
    const pos = positions.find(p => p.id === posId);
    return { left: `${pos?.x || 0}%`, transform: 'translateX(-50%)' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>🐒</span> Monkey-Banana Problem: AI State Space Search
          </h1>
          <p className="text-indigo-100 text-sm mt-1">Prolog implementation with real-time visualization</p>
        </div>
      </div>

      {/* Theory Toggle */}
      <div className="max-w-7xl mx-auto px-6 py-3">
        <button
          onClick={() => setShowTheory(!showTheory)}
          className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition"
        >
          <span className="text-xl">{showTheory ? '▼' : '▶'}</span>
          {showTheory ? 'Hide Theory' : 'Show Theory'}
        </button>
      </div>

      {/* Theory Section */}
      {showTheory && (
        <div className="max-w-7xl mx-auto px-6 pb-6">
          <div className="bg-white rounded-xl shadow-md border-l-4 border-indigo-500 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">📚 Understanding the Problem</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-indigo-50 p-3 rounded-lg">
                <span className="font-bold text-indigo-700">🎯 Goal:</span>
                <p className="text-gray-600 mt-1">Monkey must get banana hanging from ceiling at MIDDLE position</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <span className="font-bold text-purple-700">📦 Objects:</span>
                <p className="text-gray-600 mt-1">Monkey (🐒), Box (📦), Banana (🍌) at DOOR, WINDOW, or MIDDLE</p>
              </div>
              <div className="bg-pink-50 p-3 rounded-lg">
                <span className="font-bold text-pink-700">⚡ Actions:</span>
                <p className="text-gray-600 mt-1">MOVE, PUSH, CLIMB, GRAB - each with preconditions</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Visualization & Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Visualization Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 px-5 py-3 border-b border-gray-200">
                <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  Current Environment State
                </h2>
              </div>
              
              <div className="p-6">
                <div className="relative h-72 bg-gradient-to-b from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
                  {/* Base positions (always visible) */}
                  {positions.map((pos) => (
                    <div
                      key={`base-${pos.id}`}
                      className="absolute bottom-0"
                      style={{ left: `${pos.x}%`, transform: 'translateX(-50%)' }}
                    >
                      <div className="text-center">
                        {/* Position label - always visible */}
                        <div className="mb-16">
                          <span className={`text-xs font-mono ${pos.bg} ${pos.text} px-2 py-1 rounded-full border ${pos.border}`}>
                            {pos.icon} {pos.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Banana - always at middle */}
                  <div
                    className="absolute bottom-24"
                    style={{ left: `85%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="text-center">
                      <div className={`text-3xl ${state.hasBanana === 'has' ? 'text-yellow-500' : ''}`}>
                        {state.hasBanana === 'has' ? '🍌✨' : '🍌'}
                      </div>
                    </div>
                  </div>

                  {/* Box */}
                  <div
                    className="absolute bottom-16"
                    style={getPositionStyle(state.boxPos)}
                  >
                    <div className="text-center">
                      <div className="text-4xl filter drop-shadow-lg">📦</div>
                    </div>
                  </div>

                  {/* Monkey */}
                  <div
                    className="absolute bottom-16"
                    style={getPositionStyle(state.monkeyPos)}
                  >
                    <div className="text-center">
                      {state.monkeyOn === 'onbox' && state.monkeyPos === state.boxPos ? (
                        // Monkey on box - show monkey above box
                        <div className="relative">
                          <div className="text-4xl">📦</div>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-4xl">
                            🐒
                          </div>
                        </div>
                      ) : (
                        // Monkey on floor
                        <div className="text-4xl">🐒</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Ground */}
                  <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-amber-700 to-amber-600 rounded-b-xl"></div>
                </div>
              </div>
            </div>

            {/* State Display */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-5 py-3 border-b border-gray-200">
                <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Current Prolog State
                </h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className={`${positions.find(p => p.id === state.monkeyPos)?.bg || 'bg-gray-50'} p-3 rounded-lg border`}>
                    <div className="text-xs text-gray-500 mb-1">Monkey</div>
                    <div className="font-mono text-sm font-bold">{state.monkeyPos}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <div className="text-xs text-gray-500 mb-1">On</div>
                    <div className="font-mono text-sm font-bold">{state.monkeyOn}</div>
                  </div>
                  <div className={`${positions.find(p => p.id === state.boxPos)?.bg || 'bg-gray-50'} p-3 rounded-lg border`}>
                    <div className="text-xs text-gray-500 mb-1">Box</div>
                    <div className="font-mono text-sm font-bold">{state.boxPos}</div>
                  </div>
                  <div className={`${state.hasBanana === 'has' ? 'bg-green-50' : 'bg-gray-50'} p-3 rounded-lg border`}>
                    <div className="text-xs text-gray-500 mb-1">Banana</div>
                    <div className="font-mono text-sm font-bold">{state.hasBanana}</div>
                  </div>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="text-green-400 font-mono text-sm">
                    state({state.monkeyPos}, {state.monkeyOn}, {state.boxPos}, {state.hasBanana})
                  </div>
                </div>
              </div>
            </div>

            {/* Action Controls */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-5 py-3 border-b border-gray-200">
                <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Available Actions
                </h2>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Move & Push */}
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-medium text-blue-700 mb-3">🚶 MOVE Monkey</h3>
                      <div className="space-y-2">
                        {positions.map(pos => (
                          <button
                            key={pos.id}
                            onClick={() => handleMove(pos.id)}
                            disabled={state.hasBanana === 'has' || !canMove(pos.id)}
                            className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all ${
                              state.hasBanana === 'has' || !canMove(pos.id)
                                ? 'bg-gray-300 cursor-not-allowed'
                                : pos.btn
                            }`}
                          >
                            {pos.icon} Move to {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h3 className="font-medium text-purple-700 mb-3">📦 PUSH Box</h3>
                      <div className="space-y-2">
                        {positions.map(pos => (
                          <button
                            key={pos.id}
                            onClick={() => handlePush(pos.id)}
                            disabled={state.hasBanana === 'has' || !canPush(pos.id)}
                            className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all ${
                              state.hasBanana === 'has' || !canPush(pos.id)
                                ? 'bg-gray-300 cursor-not-allowed'
                                : pos.btn
                            }`}
                          >
                            {pos.icon} Push to {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Climb & Grab */}
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h3 className="font-medium text-orange-700 mb-3">🧗 CLIMB & GRAB</h3>
                      <div className="space-y-3">
                        <button
                          onClick={handleClimb}
                          disabled={state.hasBanana === 'has' || !canClimb()}
                          className={`w-full px-4 py-3 rounded-lg text-sm font-bold text-white transition-all ${
                            state.hasBanana === 'has' || !canClimb()
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-orange-500 hover:bg-orange-600'
                          }`}
                        >
                          🧗 CLIMB onto Box
                        </button>

                        <button
                          onClick={handleGrab}
                          disabled={state.hasBanana === 'has' || !canGrab()}
                          className={`w-full px-4 py-3 rounded-lg text-sm font-bold text-white transition-all ${
                            state.hasBanana === 'has' || !canGrab()
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-green-500 hover:bg-green-600'
                          }`}
                        >
                          🍌 GRAB Banana
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={resetSimulator}
                          className="px-4 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all"
                        >
                          🔄 Reset
                        </button>
                        <button
                          onClick={() => {
                            setMessage('💡 Hint: Move to WINDOW → Push box to MIDDLE → Climb → Grab');
                            setTimeout(() => setMessage(''), 4000);
                          }}
                          className="px-4 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all"
                        >
                          💡 Hint
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {message && (
                  <div className={`mt-4 p-4 rounded-lg text-sm font-medium ${
                    message.includes('🎉') 
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : message.includes('✅')
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : message.includes('💡')
                      ? 'bg-amber-100 text-amber-700 border border-amber-300'
                      : 'bg-red-100 text-red-700 border border-red-300'
                  }`}>
                    {message}
                  </div>
                )}
              </div>
            </div>

            {/* History */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-5 py-3 border-b border-gray-200">
                <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                  Execution History
                </h2>
              </div>
              
              <div className="p-6 max-h-48 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No actions executed yet</p>
                ) : (
                  <div className="space-y-3">
                    {history.map((h, idx) => (
                      <div key={idx} className="border-l-4 border-indigo-300 pl-3 py-1">
                        <div className="text-xs font-mono text-indigo-600 mb-1">
                          Step {idx+1}: {h.action.toUpperCase()}
                        </div>
                        <div className="text-xs font-mono bg-gray-50 p-2 rounded border">
                          state({h.state.monkeyPos}, {h.state.monkeyOn}, {h.state.boxPos}, {h.state.hasBanana})
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Reference */}
          <div className="lg:col-span-1 space-y-6">
            {/* Problem Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3">
                <h2 className="font-semibold text-white">📋 Problem</h2>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600">
                  Monkey wants banana at MIDDLE. Box at WINDOW initially. Monkey must move box, climb, and grab.
                </p>
              </div>
            </div>

            {/* State Format */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3">
                <h2 className="font-semibold text-white">📊 State Format</h2>
              </div>
              <div className="p-5">
                <div className="bg-indigo-50 p-3 rounded-lg mb-3">
                  <code className="text-sm font-mono text-indigo-700">state(MonkeyPos, MonkeyOn, BoxPos, HasBanana)</code>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>MonkeyPos:</span>
                    <span className="font-mono text-xs bg-blue-100 px-2 py-1 rounded">atdoor, atwindow, atmiddle</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MonkeyOn:</span>
                    <span className="font-mono text-xs bg-purple-100 px-2 py-1 rounded">onfloor, onbox</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BoxPos:</span>
                    <span className="font-mono text-xs bg-amber-100 px-2 py-1 rounded">atdoor, atwindow, atmiddle</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HasBanana:</span>
                    <span className="font-mono text-xs bg-green-100 px-2 py-1 rounded">has, hasnot</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prolog Code */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-5 py-3">
                <h2 className="font-semibold text-green-400">● Prolog Code</h2>
              </div>
              <div className="p-5 max-h-96 overflow-y-auto bg-gray-50">
                <pre className="text-xs font-mono">
                  {prologCode.map((line, idx) => (
                    <div
                      key={idx}
                      className={`py-0.5 px-2 transition ${
                        currentLine === line.line 
                          ? 'bg-yellow-200 border-l-4 border-yellow-500' 
                          : ''
                      }`}
                    >
                      <span className="text-gray-400 mr-2">{line.line.toString().padStart(2, '0')}</span>
                      <span className={currentLine === line.line ? 'text-gray-900' : 'text-gray-700'}>
                        {line.code}
                      </span>
                      {currentLine === line.line && (
                        <span className="ml-3 text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                          ← executing {activeAction}
                        </span>
                      )}
                    </div>
                  ))}
                </pre>
              </div>
            </div>

            {/* Solution Path */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3">
                <h2 className="font-semibold text-white">🏆 Solution</h2>
              </div>
              <div className="p-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">1</span>
                    <span>move(atdoor → atwindow)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm">2</span>
                    <span>push(atwindow → atmiddle)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-sm">3</span>
                    <span>climb</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">4</span>
                    <span>grab</span>
                  </div>
                  <div className="mt-4 p-3 bg-green-100 rounded-lg">
                    <code className="text-sm font-mono text-green-700">
                      state(atmiddle, onbox, atmiddle, has)
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Goal Banner */}
        {state.hasBanana === 'has' && (
          <div className="mt-6 p-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl shadow-lg">
            <p className="text-white text-center font-bold text-xl">🎉 GOAL ACHIEVED! Monkey has the banana! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}