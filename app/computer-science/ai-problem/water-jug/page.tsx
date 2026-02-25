"use client";

import { useState, useEffect } from 'react';

export default function WaterJugProblem() {
  // Problem configuration
  const [jug1Capacity, setJug1Capacity] = useState(5);
  const [jug2Capacity, setJug2Capacity] = useState(3);
  const [target, setTarget] = useState(4);
  
  // Current state
  const [jug1Amount, setJug1Amount] = useState(0);
  const [jug2Amount, setJug2Amount] = useState(0);
  
  // Solution tracking
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // ==================== BFS ALGORITHM ====================
  const findSolution = () => {
    // Clear previous states
    setError('');
    
    // Validation
    if (target > Math.max(jug1Capacity, jug2Capacity)) {
      setError(`Target (${target}L) cannot be larger than both jugs!`);
      return;
    }

    // GCD check for solvability
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    if (target % gcd(jug1Capacity, jug2Capacity) !== 0) {
      setError(`Target (${target}L) must be divisible by GCD of ${jug1Capacity} and ${jug2Capacity} (${gcd(jug1Capacity, jug2Capacity)}L)`);
      return;
    }

    // BFS to find shortest path
    const queue = [{ jug1: 0, jug2: 0, steps: [] }];
    const visited = new Set(['0,0']);
    
    while (queue.length > 0) {
      const current = queue.shift();
      const { jug1, jug2, steps: currentSteps } = current;
      
      // Check if target reached
      if (jug1 === target || jug2 === target) {
        const finalSteps = [...currentSteps, { jug1, jug2, action: 'Goal reached!' }];
        setSteps(finalSteps);
        setCurrentStep(0);
        updateDisplay(finalSteps[0]);
        return;
      }
      
      // Generate all possible moves
      const moves = [
        // Fill jug1
        {
          jug1: jug1Capacity,
          jug2: jug2,
          action: `Fill ${jug1Capacity}L jug (from ${jug1}L → ${jug1Capacity}L)`
        },
        // Fill jug2
        {
          jug1: jug1,
          jug2: jug2Capacity,
          action: `Fill ${jug2Capacity}L jug (from ${jug2}L → ${jug2Capacity}L)`
        },
        // Empty jug1
        {
          jug1: 0,
          jug2: jug2,
          action: `Empty ${jug1Capacity}L jug (${jug1}L → 0L)`
        },
        // Empty jug2
        {
          jug1: jug1,
          jug2: 0,
          action: `Empty ${jug2Capacity}L jug (${jug2}L → 0L)`
        },
        // Pour jug1 to jug2
        {
          jug1: Math.max(0, jug1 - (jug2Capacity - jug2)),
          jug2: Math.min(jug2Capacity, jug2 + jug1),
          action: `Pour from ${jug1Capacity}L jug to ${jug2Capacity}L jug`
        },
        // Pour jug2 to jug1
        {
          jug1: Math.min(jug1Capacity, jug1 + jug2),
          jug2: Math.max(0, jug2 - (jug1Capacity - jug1)),
          action: `Pour from ${jug2Capacity}L jug to ${jug1Capacity}L jug`
        }
      ];
      
      // Add valid moves to queue
      for (const move of moves) {
        const stateKey = `${move.jug1},${move.jug2}`;
        if (!visited.has(stateKey)) {
          visited.add(stateKey);
          queue.push({
            jug1: move.jug1,
            jug2: move.jug2,
            steps: [...currentSteps, { jug1, jug2, action: move.action }]
          });
        }
      }
    }
    
    setError('No solution found!');
  };

  // Update display for current step
  const updateDisplay = (step) => {
    setJug1Amount(step.jug1);
    setJug2Amount(step.jug2);
    setMessage(step.action);
  };

  // Navigate through steps
  const goToStep = (index) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStep(index);
      updateDisplay(steps[index]);
    }
  };

  // ==================== JUG COMPONENT ====================
  const Jug = ({ capacity, amount, label, color }) => {
    const percentage = (amount / capacity) * 100;
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-64 border-4 border-gray-800 rounded-t-lg rounded-b-lg bg-gray-100">
          {/* Water */}
          <div 
            className={`absolute bottom-0 w-full transition-all duration-500 ${color}`}
            style={{ height: `${percentage}%` }}
          >
            <div className="absolute top-0 w-full h-2 bg-white opacity-50"></div>
          </div>
          
          {/* Measurement lines */}
          {[...Array(capacity + 1)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-full border-b border-gray-400 border-dashed"
              style={{ bottom: `${(i / capacity) * 100}%` }}
            >
              <span className="absolute -right-6 text-xs">{capacity - i}L</span>
            </div>
          ))}
        </div>
        
        <div className="mt-2 text-center">
          <div className="font-bold">{label}</div>
          <div className="text-2xl font-bold" style={{ color: color.includes('blue') ? '#3B82F6' : '#8B5CF6' }}>
            {amount}L
          </div>
        </div>
      </div>
    );
  };

  // ==================== MAIN RENDER ====================
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-6">
          💧 Water Jug Problem: Step-by-Step Visualization
        </h1>
        
        {/* Problem Statement */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <h2 className="text-xl font-bold mb-2">📋 Problem Statement</h2>
          <p className="text-gray-700">
            You have two jugs: <strong className="text-blue-600">{jug1Capacity}L</strong> and <strong className="text-purple-600">{jug2Capacity}L</strong>. 
            You need to measure exactly <strong className="text-green-600">{target}L</strong> of water.
            You can fill a jug, empty a jug, or pour water from one jug to the other.
            Find the shortest sequence of steps to achieve the target.
          </p>
        </div>
        
        {/* Configuration */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <h2 className="text-lg font-bold mb-3">⚙️ Configure Problem</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Jug 1 Capacity: {jug1Capacity}L</label>
              <input
                type="range"
                min="1"
                max="10"
                value={jug1Capacity}
                onChange={(e) => setJug1Capacity(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Jug 2 Capacity: {jug2Capacity}L</label>
              <input
                type="range"
                min="1"
                max="10"
                value={jug2Capacity}
                onChange={(e) => setJug2Capacity(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target: {target}L</label>
              <input
                type="range"
                min="1"
                max={Math.max(jug1Capacity, jug2Capacity)}
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          <button
            onClick={findSolution}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-bold"
          >
            Find Solution
          </button>
          
          {error && (
            <div className="mt-3 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p className="font-bold">❌ Error</p>
              <p>{error}</p>
            </div>
          )}
        </div>
        
        {/* Visualization */}
        {steps.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Current Step Info */}
            <div className="text-center mb-4">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            
            {/* Jugs */}
            <div className="flex justify-center items-center gap-8 mb-6">
              <Jug 
                capacity={jug1Capacity}
                amount={jug1Amount}
                label="Jug 1"
                color="bg-gradient-to-t from-blue-500 to-blue-400"
              />
              
              <div className="text-2xl text-gray-500">→</div>
              
              <Jug 
                capacity={jug2Capacity}
                amount={jug2Amount}
                label="Jug 2"
                color="bg-gradient-to-t from-purple-500 to-purple-400"
              />
            </div>
            
            {/* Current Action */}
            <div className="bg-yellow-100 p-3 rounded-lg text-center mb-4">
              <p className="font-bold text-lg">{message}</p>
            </div>
            
            {/* Step Navigation */}
            <div className="flex justify-center gap-2 mb-4">
              <button
                onClick={() => goToStep(currentStep - 1)}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                ← Previous
              </button>
              <button
                onClick={() => goToStep(currentStep + 1)}
                disabled={currentStep === steps.length - 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next →
              </button>
            </div>
            
            {/* All Steps */}
            <div className="mt-6">
              <h3 className="font-bold mb-2">📝 Complete Step-by-Step Solution:</h3>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    onClick={() => goToStep(index)}
                    className={`p-3 rounded-lg cursor-pointer border ${
                      index === currentStep 
                        ? 'bg-blue-100 border-blue-500' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold">Step {index + 1}:</span>
                      <span>{step.action}</span>
                      <span className="ml-auto font-mono">
                        ({step.jug1}L, {step.jug2}L)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {steps.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🪣</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Configure and click "Find Solution" to begin
            </h2>
            <p className="text-gray-500">
              You'll see each step explained visually with the exact water amounts
            </p>
          </div>
        )}
        
        {/* Algorithm Explanation */}
        <div className="bg-white rounded-lg shadow-lg p-4 mt-6">
          <h2 className="text-lg font-bold mb-2">🔍 How the Algorithm Works</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-blue-600">BFS Algorithm:</h3>
              <ul className="list-disc pl-4 text-sm space-y-1">
                <li>Starts from (0,0) - both jugs empty</li>
                <li>Explores all possible moves level by level</li>
                <li>Visited set prevents repeating states</li>
                <li>Guarantees shortest path to target</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-purple-600">Mathematical Rule:</h3>
              <ul className="list-disc pl-4 text-sm space-y-1">
                <li>Solution exists only if target ≤ max(jug1, jug2)</li>
                <li>Target must be divisible by GCD of capacities</li>
                <li>GCD({jug1Capacity}, {jug2Capacity}) = {
                  (() => {
                    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
                    return gcd(jug1Capacity, jug2Capacity);
                  })()
                }</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}