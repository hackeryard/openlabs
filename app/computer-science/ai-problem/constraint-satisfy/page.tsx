"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

export default function CSPLab() {
  // CSP Problem: Simple Graph Coloring with 5 nodes
  const [variables, setVariables] = useState(['A', 'B', 'C', 'D', 'E']);
  const [domains, setDomains] = useState({
    A: ['red', 'green', 'blue'],
    B: ['red', 'green', 'blue'],
    C: ['red', 'green', 'blue'],
    D: ['red', 'green', 'blue'],
    E: ['red', 'green', 'blue']
  });
  
  // Constraints: Connected nodes cannot have same color
  const [constraints, setConstraints] = useState([
    { var1: 'A', var2: 'B' },
    { var1: 'A', var2: 'C' },
    { var1: 'B', var2: 'C' },
    { var1: 'B', var2: 'D' },
    { var1: 'C', var2: 'D' },
    { var1: 'C', var2: 'E' },
    { var1: 'D', var2: 'E' }
  ]);

  // Current assignments
  const [assignments, setAssignments] = useState({});
  const [step, setStep] = useState(0);
  const [currentVariable, setCurrentVariable] = useState(null);
  const [currentValue, setCurrentValue] = useState(null);
  const [message, setMessage] = useState('');
  const [log, setLog] = useState([]);
  const [highlightedLine, setHighlightedLine] = useState(null);
  const [constraintChecks, setConstraintChecks] = useState(0);
  const [backtracks, setBacktracks] = useState(0);
  const [solved, setSolved] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [stuckMessage, setStuckMessage] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [resultType, setResultType] = useState(null);
  const [showAim, setShowAim] = useState(true);
  const [experimentPhase, setExperimentPhase] = useState('initialization');
  const [speed, setSpeed] = useState('medium');
  const [autoMode, setAutoMode] = useState(false);

  // Node positions for 2D visualization
  const nodePositions = {
    A: { x: 200, y: 100 },
    B: { x: 100, y: 200 },
    C: { x: 300, y: 200 },
    D: { x: 150, y: 300 },
    E: { x: 350, y: 300 }
  };

  // Color mapping
  const colorValues = {
    red: '#ef4444',
    green: '#10b981',
    blue: '#3b82f6',
    unassigned: '#94a3b8'
  };

  // Reset the problem completely
  const resetProblem = () => {
    setAssignments({});
    setStep(0);
    setCurrentVariable(null);
    setCurrentValue(null);
    setMessage('Problem reset. Ready to solve graph coloring CSP.');
    setLog(['CSP initialized with 5 variables, each with 3 colors']);
    setConstraintChecks(0);
    setBacktracks(0);
    setSolved(false);
    setStuck(false);
    setStuckMessage('');
    setShowResult(false);
    setResultType(null);
    setHighlightedLine(null);
    setExperimentPhase('initialization');
  };

  // Check if current assignment is consistent
  const isConsistent = (varName, value, currentAssignments) => {
    // Check all constraints involving this variable
    for (let constraint of constraints) {
      if (constraint.var1 === varName) {
        if (currentAssignments[constraint.var2] === value) {
          return false;
        }
      }
      if (constraint.var2 === varName) {
        if (currentAssignments[constraint.var1] === value) {
          return false;
        }
      }
    }
    return true;
  };

  // Check if any variable has no valid values left
  const checkIfStuck = () => {
    for (let v of variables) {
      if (!assignments[v]) {
        let hasValidValue = false;
        for (let color of domains[v]) {
          if (isConsistent(v, color, assignments)) {
            hasValidValue = true;
            break;
          }
        }
        if (!hasValidValue) {
          return v;
        }
      }
    }
    return null;
  };

  // Select unassigned variable
  const selectUnassignedVariable = () => {
    for (let v of variables) {
      if (!assignments[v]) {
        return v;
      }
    }
    return null;
  };

  // Order domain values
  const orderDomainValues = (varName) => {
    return domains[varName];
  };

  // Check if assignment is complete and valid
  const isCompleteAndValid = () => {
    if (Object.keys(assignments).length !== variables.length) return false;
    
    for (let c of constraints) {
      if (assignments[c.var1] === assignments[c.var2]) {
        return false;
      }
    }
    return true;
  };

  // Get solution suggestions when stuck
  const getStuckSuggestions = (stuckVar) => {
    const suggestions = [];
    
    const assignedVars = variables.filter(v => assignments[v]);
    if (assignedVars.length > 0) {
      suggestions.push(`Try backtracking - remove assignment from ${assignedVars[assignedVars.length - 1]}`);
    }
    
    suggestions.push('Try a different color combination for previous nodes');
    suggestions.push('Reset the problem and try a different approach');
    
    return suggestions;
  };

  // Check result status
  const checkResult = () => {
    if (isCompleteAndValid()) {
      setResultType('success');
      setShowResult(true);
      setMessage('🎉 SUCCESS! All nodes colored correctly!');
      setExperimentPhase('solved');
    } else {
      const stuckVar = checkIfStuck();
      if (stuckVar) {
        setResultType('stuck');
        setShowResult(true);
        setStuck(true);
        setStuckMessage(`Cannot assign any color to ${stuckVar} with current assignments`);
        setMessage(`❌ STUCK! ${stuckVar} has no valid colors left`);
        setExperimentPhase('stuck');
      }
    }
  };

  // Backtracking search step by step
  const backtrackingStep = () => {
    if (solved) {
      setMessage('Problem already solved! Reset to try again.');
      return;
    }

    const stuckVar = checkIfStuck();
    if (stuckVar) {
      setStuck(true);
      setStuckMessage(`Cannot assign any color to ${stuckVar} with current assignments`);
      setMessage(`❌ STUCK! ${stuckVar} has no valid colors left`);
      setExperimentPhase('stuck');
      setShowResult(true);
      setResultType('stuck');
      return;
    }

    setExperimentPhase('searching');
    
    if (Object.keys(assignments).length === variables.length) {
      if (isCompleteAndValid()) {
        setSolved(true);
        setMessage('🎉 Solution found! All nodes colored.');
        setExperimentPhase('solved');
        setShowResult(true);
        setResultType('success');
        setHighlightedLine(14);
      } else {
        setMessage('⚠️ Assignment complete but constraints violated!');
      }
      return;
    }

    const varName = selectUnassignedVariable();
    if (!varName) return;

    setCurrentVariable(varName);
    setHighlightedLine(4);

    const values = orderDomainValues(varName);
    
    for (let value of values) {
      setCurrentValue(value);
      setConstraintChecks(prev => prev + constraints.length);
      setHighlightedLine(7);

      if (isConsistent(varName, value, assignments)) {
        const newAssignments = { ...assignments, [varName]: value };
        setAssignments(newAssignments);
        setMessage(`Assigned ${varName} = ${value}`);
        setLog([`Step ${step + 1}: Assigned ${varName} = ${value}`, ...log].slice(0, 6));
        setStep(step + 1);
        setHighlightedLine(10);
        
        const nextStuckVar = checkIfStuck();
        if (nextStuckVar) {
          setMessage(`⚠️ Warning: This might lead to being stuck at ${nextStuckVar}`);
        }
        
        if (autoMode) {
          setTimeout(() => backtrackingStep(), speed === 'slow' ? 1000 : speed === 'medium' ? 500 : 200);
        }
        return;
      }
    }

    setBacktracks(prev => prev + 1);
    setMessage(`Backtrack: No valid color for ${varName}`);
    setLog([`Backtrack at ${varName} - no valid colors`, ...log].slice(0, 6));
    setHighlightedLine(12);
    
    const lastVar = variables.find(v => assignments[v] && !variables.slice(variables.indexOf(v) + 1).some(v2 => assignments[v2]));
    if (lastVar) {
      const newAssignments = { ...assignments };
      delete newAssignments[lastVar];
      setAssignments(newAssignments);
      setMessage(`Backtracked: removed ${lastVar} assignment`);
    }
    
    setStep(step + 1);
    
    const afterBacktrackStuck = checkIfStuck();
    if (afterBacktrackStuck) {
      setStuck(true);
      setStuckMessage(`Still stuck! Try resetting the problem.`);
    }
  };

  // Manual step control
  const nextStep = () => {
    backtrackingStep();
    checkResult();
  };

  // Run automatically
  const toggleAutoMode = () => {
    setAutoMode(!autoMode);
    if (!autoMode) {
      setMessage('Auto mode enabled - watch the algorithm solve!');
    }
  };

  // Manually assign a color to a node
  const manualAssign = (node, color) => {
    if (solved) return;
    
    setConstraintChecks(prev => prev + constraints.length);
    
    if (isConsistent(node, color, assignments)) {
      const newAssignments = { ...assignments, [node]: color };
      setAssignments(newAssignments);
      setMessage(`Manually assigned ${node} = ${color}`);
      setLog([`Manual: ${node} = ${color}`, ...log].slice(0, 6));
      
      if (Object.keys(newAssignments).length === variables.length) {
        if (isCompleteAndValid()) {
          setSolved(true);
          setMessage('🎉 Solution found! All nodes colored.');
          setExperimentPhase('solved');
          setShowResult(true);
          setResultType('success');
        }
      }
      
      const stuckVar = checkIfStuck();
      if (stuckVar) {
        setStuck(true);
        setStuckMessage(`Cannot assign any color to ${stuckVar} with current assignments`);
        setMessage(`❌ STUCK! ${stuckVar} has no valid colors left`);
        setExperimentPhase('stuck');
        setShowResult(true);
        setResultType('stuck');
      }
    } else {
      setMessage(`❌ Constraint violation: ${node} cannot be ${color} with current assignments`);
    }
  };

  // Suggest solution when stuck
  const suggestSolution = () => {
    // A valid solution for the graph
    const solution = {
      A: 'red',
      B: 'green',
      C: 'blue',
      D: 'red',
      E: 'green'
    };
    
    setAssignments(solution);
    setSolved(true);
    setMessage('🎉 Solution applied! All nodes colored correctly.');
    setLog(['Applied working solution', ...log].slice(0, 6));
    setExperimentPhase('solved');
    setShowResult(true);
    setResultType('success');
  };

  // Get phase color
  const getPhaseColor = () => {
    switch(experimentPhase) {
      case 'initialization': return '#94a3b8';
      case 'searching': return '#3b82f6';
      case 'solved': return '#10b981';
      case 'stuck': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="container">
      <Head>
        <title>CSP Lab - Constraint Satisfaction Problem Visualizer</title>
      </Head>

      {/* Experiment AIM Banner - Clearly Visible */}
      <AnimatePresence>
        {showAim && (
          <motion.div 
            className="aim-banner"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
          >
            <button className="close-aim" onClick={() => setShowAim(false)}>✕</button>
            <h2>🔬 CSP EXPERIMENT: GRAPH COLORING PROBLEM</h2>
            <div className="aim-content">
              <div className="aim-item">
                <span className="aim-label">🎯 AIM:</span>
                <span>Study Constraint Satisfaction Problem using Backtracking Search</span>
              </div>
              <div className="aim-item">
                <span className="aim-label">🧪 EXPERIMENT:</span>
                <span>Color 5 connected nodes with 3 colors (no adjacent nodes share same color)</span>
              </div>
              <div className="aim-item">
                <span className="aim-label">📊 VARIABLES:</span>
                <span>A, B, C, D, E (5 nodes)</span>
              </div>
              <div className="aim-item">
                <span className="aim-label">⚡ CONSTRAINTS:</span>
                <span>A≠B, A≠C, B≠C, B≠D, C≠D, C≠E, D≠E (7 constraints)</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="header">
        <h1>🗂️ CONSTRAINT SATISFACTION PROBLEM · GRAPH COLORING</h1>
        <div className="status-group">
          <div className="phase-badge" style={{ background: getPhaseColor() }}>
            {experimentPhase.toUpperCase()}
          </div>
          <div className="stats">
            <span>📊 Checks: {constraintChecks}</span>
            <span>↩️ Backtracks: {backtracks}</span>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div 
            className="result-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className={`result-content ${resultType}`}>
              <button className="close-result" onClick={() => setShowResult(false)}>✕</button>
              {resultType === 'success' ? (
                <>
                  <span className="result-icon">🏆</span>
                  <h3>SOLUTION FOUND!</h3>
                  <p>All 5 nodes colored correctly with no constraint violations.</p>
                  <div className="result-details">
                    <div>✓ {Object.keys(assignments).length} variables assigned</div>
                    <div>✓ {constraintChecks} constraint checks performed</div>
                    <div>✓ {backtracks} backtracks needed</div>
                  </div>
                </>
              ) : (
                <>
                  <span className="result-icon">⚠️</span>
                  <h3>STUCK! No valid moves left</h3>
                  <p>{stuckMessage}</p>
                  <div className="stuck-suggestions">
                    <h4>Suggestions:</h4>
                    {getStuckSuggestions(stuckMessage.split(' ')[2]).map((s, i) => (
                      <div key={i} className="suggestion-item">• {s}</div>
                    ))}
                  </div>
                  <div className="result-actions">
                    <button onClick={suggestSolution} className="suggest-btn">
                      Show Working Solution
                    </button>
                    <button onClick={resetProblem} className="reset-result-btn">
                      Reset Problem
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="main-content">
        {/* LEFT SIDE - 2D VISUALIZATION */}
        <div className="viz-section">
          <div className="viz-header">
            <h2>🔷 GRAPH · 2D CSP VISUALIZATION</h2>
            <div className="legend">
              <span><span className="color-dot" style={{background: colorValues.red}}></span> Red</span>
              <span><span className="color-dot" style={{background: colorValues.green}}></span> Green</span>
              <span><span className="color-dot" style={{background: colorValues.blue}}></span> Blue</span>
              <span><span className="color-dot" style={{background: colorValues.unassigned}}></span> Unassigned</span>
            </div>
          </div>

          {/* 2D SVG Graph */}
          <div className="graph-container">
            <svg viewBox="0 0 500 400" className="graph-svg">
              {/* Draw connections (constraints) */}
              {constraints.map((c, idx) => {
                const pos1 = nodePositions[c.var1];
                const pos2 = nodePositions[c.var2];
                const bothAssigned = assignments[c.var1] && assignments[c.var2];
                const conflict = bothAssigned && assignments[c.var1] === assignments[c.var2];
                
                return (
                  <motion.line
                    key={`constraint-${idx}`}
                    x1={pos1.x}
                    y1={pos1.y}
                    x2={pos2.x}
                    y2={pos2.y}
                    stroke={conflict ? '#ef4444' : bothAssigned ? '#10b981' : '#cbd5e1'}
                    strokeWidth={conflict ? 3 : bothAssigned ? 2 : 1}
                    strokeDasharray={conflict ? '5,5' : 'none'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  />
                );
              })}

              {/* Draw nodes */}
              {variables.map(v => {
                const pos = nodePositions[v];
                const color = assignments[v] ? colorValues[assignments[v]] : colorValues.unassigned;
                const isCurrent = currentVariable === v;
                const hasConflict = constraints.some(c => 
                  (c.var1 === v || c.var2 === v) && 
                  assignments[c.var1] && assignments[c.var2] && 
                  assignments[c.var1] === assignments[c.var2]
                );

                return (
                  <g key={v}>
                    <motion.circle
                      cx={pos.x}
                      cy={pos.y}
                      r="30"
                      fill={color}
                      stroke={hasConflict ? '#ef4444' : isCurrent ? '#fbbf24' : '#1e293b'}
                      strokeWidth={hasConflict ? 4 : isCurrent ? 4 : 2}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      style={{ cursor: 'pointer' }}
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontWeight="bold"
                      fontSize="16"
                    >
                      {v}
                    </text>
                    {isCurrent && currentValue && (
                      <motion.text
                        x={pos.x}
                        y={pos.y - 45}
                        textAnchor="middle"
                        fill="#fbbf24"
                        fontSize="12"
                        initial={{ y: pos.y - 35, opacity: 0 }}
                        animate={{ y: pos.y - 45, opacity: 1 }}
                      >
                        Trying {currentValue}
                      </motion.text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Manual color picker */}
            <div className="manual-controls">
              <span className="manual-title">🎨 Manual Assignment (Click to assign):</span>
              <div className="manual-grid">
                {variables.map(v => (
                  <div key={v} className="manual-row">
                    <span className="node-label">{v}</span>
                    <button 
                      className="color-btn red" 
                      onClick={() => manualAssign(v, 'red')}
                      disabled={solved || stuck}
                    >Red</button>
                    <button 
                      className="color-btn green" 
                      onClick={() => manualAssign(v, 'green')}
                      disabled={solved || stuck}
                    >Green</button>
                    <button 
                      className="color-btn blue" 
                      onClick={() => manualAssign(v, 'blue')}
                      disabled={solved || stuck}
                    >Blue</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="control-panel">
            <motion.button 
              onClick={nextStep}
              disabled={solved || stuck}
              className="next-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ▶ NEXT STEP (Backtracking)
            </motion.button>
            <motion.button 
              onClick={toggleAutoMode}
              className={`auto-btn ${autoMode ? 'active' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={solved || stuck}
            >
              {autoMode ? '⏸️ PAUSE' : '▶ AUTO RUN'}
            </motion.button>
            <motion.button 
              onClick={resetProblem}
              className="reset-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ↻ RESET CSP
            </motion.button>
          </div>

          {/* Speed Control */}
          <div className="speed-control">
            <span>⚡ Speed:</span>
            <button 
              className={speed === 'slow' ? 'active' : ''} 
              onClick={() => setSpeed('slow')}
            >Slow</button>
            <button 
              className={speed === 'medium' ? 'active' : ''} 
              onClick={() => setSpeed('medium')}
            >Medium</button>
            <button 
              className={speed === 'fast' ? 'active' : ''} 
              onClick={() => setSpeed('fast')}
            >Fast</button>
          </div>

          {/* Current Status */}
          <div className={`status-message ${stuck ? 'stuck' : solved ? 'solved' : ''}`}>
            {message}
          </div>

          {/* Stuck Warning */}
          {stuck && !showResult && (
            <div className="stuck-warning">
              <span>⚠️ You're stuck! </span>
              <button onClick={suggestSolution} className="suggest-mini-btn">
                Show Solution
              </button>
              <button onClick={resetProblem} className="reset-mini-btn">
                Reset
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE - CODE & INFO */}
        <div className="info-section">
          {/* CSP Algorithm Code */}
          <div className="code-panel">
            <h3>🤖 BACKTRACKING CSP ALGORITHM</h3>
            <div className="code">
              <pre>
                <span className={highlightedLine === 1 ? 'highlight' : ''}>
                  1  function BACKTRACKING(assignment):
                </span>
                <span className={highlightedLine === 2 ? 'highlight' : ''}>
                  2    if assignment complete: return assignment
                </span>
                <span className={highlightedLine === 3 ? 'highlight' : ''}>
                  3    
                </span>
                <span className={highlightedLine === 4 ? 'highlight' : ''}>
                  4    var = SELECT-UNASSIGNED-VARIABLE()
                </span>
                <span className={highlightedLine === 5 ? 'highlight' : ''}>
                  5    for each value in ORDER-DOMAIN-VALUES(var):
                </span>
                <span className={highlightedLine === 6 ? 'highlight' : ''}>
                  6      
                </span>
                <span className={highlightedLine === 7 ? 'highlight' : ''}>
                  7      if value consistent with assignment:
                </span>
                <span className={highlightedLine === 8 ? 'highlight' : ''}>
                  8        add {`{var = value}`} to assignment
                </span>
                <span className={highlightedLine === 9 ? 'highlight' : ''}>
                  9        
                </span>
                <span className={highlightedLine === 10 ? 'highlight' : ''}>
                  10       result = BACKTRACKING(assignment)
                </span>
                <span className={highlightedLine === 11 ? 'highlight' : ''}>
                  11       if result != failure: return result
                </span>
                <span className={highlightedLine === 12 ? 'highlight' : ''}>
                  12       remove {`{var = value}`} from assignment
                </span>
                <span className={highlightedLine === 13 ? 'highlight' : ''}>
                  13    
                </span>
                <span className={highlightedLine === 14 ? 'highlight' : ''}>
                  14    return failure
                </span>
              </pre>
            </div>
          </div>

          {/* Current Action */}
          <div className="action-panel">
            <span className="label">⚡ CURRENT ACTION</span>
            <span className="value">
              {currentVariable ? `Trying ${currentVariable} = ${currentValue || '?'}` : 'Waiting for step'}
            </span>
          </div>

          {/* Constraint Display */}
          <div className="constraint-panel">
            <h3>🔗 ACTIVE CONSTRAINTS</h3>
            <div className="constraint-list">
              {constraints.map((c, i) => {
                const var1Assigned = assignments[c.var1];
                const var2Assigned = assignments[c.var2];
                const conflict = var1Assigned && var2Assigned && assignments[c.var1] === assignments[c.var2];
                
                return (
                  <motion.div 
                    key={i} 
                    className={`constraint-item ${conflict ? 'conflict' : ''}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {c.var1} ≠ {c.var2}
                    {conflict && <span className="conflict-badge">❌ Conflict</span>}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Current Assignments */}
          <div className="assignments-panel">
            <h3>📊 CURRENT ASSIGNMENTS</h3>
            <div className="assignments-grid">
              {variables.map(v => (
                <div key={v} className="assignment-item">
                  <span className="var-name">{v}:</span>
                  <span 
                    className="var-value"
                    style={{ 
                      background: assignments[v] ? colorValues[assignments[v]] : '#e2e8f0',
                      color: assignments[v] ? 'white' : '#1e293b'
                    }}
                  >
                    {assignments[v] || 'unassigned'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Domain Values */}
          <div className="domains-panel">
            <h3>🎨 DOMAIN VALUES</h3>
            <div className="domain-display">
              {variables.map(v => (
                <div key={v} className="domain-item">
                  <span className="domain-var">{v}:</span>
                  <span className="domain-colors">
                    {domains[v].map(color => (
                      <span 
                        key={color} 
                        className="domain-color"
                        style={{ background: colorValues[color] }}
                      >
                        {color}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Experiment Log */}
          <div className="log-panel">
            <h3>📋 EXPERIMENT LOG</h3>
            <div className="log-list">
              {log.map((entry, i) => (
                <div key={i} className="log-item">{entry}</div>
              ))}
            </div>
          </div>

          {/* Solution Status */}
          <div className="solution-status">
            {solved && <div className="solved-badge">✅ SOLUTION FOUND</div>}
            {stuck && !solved && <div className="stuck-badge">❌ STUCK - NO VALID MOVES</div>}
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0b1120 0%, #1a2234 100%);
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* AIM Banner - Highly Visible */
        .aim-banner {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          color: white;
          padding: 1.5rem 2rem;
          border-radius: 1rem;
          margin-bottom: 2rem;
          position: relative;
          max-width: 1400px;
          margin: 0 auto 2rem auto;
          border: 2px solid #fbbf24;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }

        .close-aim {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-aim:hover {
          background: rgba(255,255,255,0.3);
        }

        .aim-banner h2 {
          font-size: 1.8rem;
          margin: 0 0 1rem 0;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .aim-content {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          background: rgba(255,255,255,0.1);
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .aim-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
        }

        .aim-label {
          font-weight: bold;
          color: #fbbf24;
          min-width: 100px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto 1.5rem auto;
        }

        .header h1 {
          color: white;
          font-size: 1.8rem;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .status-group {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .phase-badge {
          padding: 0.5rem 1.5rem;
          border-radius: 2rem;
          font-weight: bold;
          color: white;
          font-size: 0.9rem;
          text-transform: uppercase;
        }

        .stats {
          display: flex;
          gap: 1rem;
          background: #1e293b;
          padding: 0.5rem 1.5rem;
          border-radius: 2rem;
          color: #cbd5e1;
          font-size: 0.9rem;
        }

        /* Result Modal */
        .result-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .result-content {
          background: #1e293b;
          padding: 2rem;
          border-radius: 2rem;
          max-width: 500px;
          position: relative;
          text-align: center;
          border: 3px solid;
        }

        .result-content.success {
          border-color: #10b981;
        }

        .result-content.stuck {
          border-color: #ef4444;
        }

        .close-result {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #2d3748;
          border: none;
          color: #cbd5e1;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
        }

        .result-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        .result-content h3 {
          color: white;
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .result-content p {
          color: #cbd5e1;
          margin-bottom: 1.5rem;
        }

        .result-details {
          background: #2d3748;
          padding: 1rem;
          border-radius: 1rem;
          text-align: left;
          color: #cbd5e1;
        }

        .stuck-suggestions {
          background: #2d3748;
          padding: 1rem;
          border-radius: 1rem;
          text-align: left;
          margin: 1rem 0;
        }

        .stuck-suggestions h4 {
          color: #fbbf24;
          margin: 0 0 0.5rem 0;
        }

        .suggestion-item {
          color: #cbd5e1;
          padding: 0.2rem 0;
        }

        .result-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .suggest-btn, .reset-result-btn {
          flex: 1;
          padding: 0.8rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: bold;
          cursor: pointer;
        }

        .suggest-btn {
          background: #10b981;
          color: white;
        }

        .reset-result-btn {
          background: #3b82f6;
          color: white;
        }

        .main-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Visualization Section */
        .viz-section {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 1.5rem;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .viz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .viz-header h2 {
          color: white;
          font-size: 1.3rem;
          margin: 0;
        }

        .legend {
          display: flex;
          gap: 1.5rem;
          color: white;
          font-size: 0.9rem;
        }

        .color-dot {
          display: inline-block;
          width: 14px;
          height: 14px;
          border-radius: 4px;
          margin-right: 4px;
        }

        .graph-container {
          background: #1e293b;
          border-radius: 1rem;
          padding: 1.5rem;
        }

        .graph-svg {
          width: 100%;
          height: auto;
          background: #0f172a;
          border-radius: 0.5rem;
        }

        .manual-controls {
          margin-top: 1.5rem;
          background: #2d3748;
          padding: 1.5rem;
          border-radius: 0.5rem;
          color: white;
        }

        .manual-title {
          display: block;
          margin-bottom: 1rem;
          color: #fbbf24;
          font-weight: bold;
          font-size: 1rem;
        }

        .manual-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.8rem;
        }

        .manual-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .node-label {
          width: 30px;
          font-weight: bold;
          color: #94a3b8;
        }

        .color-btn {
          padding: 0.3rem 0.8rem;
          border: none;
          border-radius: 0.3rem;
          font-size: 0.8rem;
          cursor: pointer;
          color: white;
          font-weight: bold;
        }

        .color-btn.red { background: #ef4444; }
        .color-btn.green { background: #10b981; }
        .color-btn.blue { background: #3b82f6; }
        .color-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .control-panel {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 0.5rem;
          margin: 1.5rem 0;
        }

        .next-btn, .auto-btn, .reset-btn {
          padding: 0.8rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .next-btn { background: #3b82f6; color: white; }
        .auto-btn { background: #8b5cf6; color: white; }
        .auto-btn.active { background: #10b981; }
        .reset-btn { background: #64748b; color: white; }

        .speed-control {
          display: flex;
          gap: 0.8rem;
          align-items: center;
          color: white;
          font-size: 0.9rem;
        }

        .speed-control button {
          padding: 0.3rem 1rem;
          border: 1px solid #4b5563;
          background: transparent;
          color: #cbd5e1;
          border-radius: 0.3rem;
          cursor: pointer;
        }

        .speed-control button.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .status-message {
          margin-top: 1rem;
          padding: 0.8rem;
          background: #2d3748;
          border-radius: 0.5rem;
          color: #fbbf24;
          font-size: 1rem;
          text-align: center;
        }

        .status-message.stuck {
          background: #ef4444;
          color: white;
        }

        .status-message.solved {
          background: #10b981;
          color: white;
        }

        .stuck-warning {
          margin-top: 0.8rem;
          padding: 0.8rem;
          background: #ef4444;
          border-radius: 0.5rem;
          color: white;
          display: flex;
          gap: 0.8rem;
          align-items: center;
          justify-content: center;
        }

        .suggest-mini-btn, .reset-mini-btn {
          padding: 0.3rem 0.8rem;
          border: none;
          border-radius: 0.3rem;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .suggest-mini-btn {
          background: #fbbf24;
          color: #1e293b;
        }

        .reset-mini-btn {
          background: white;
          color: #1e293b;
        }

        /* Info Section */
        .info-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .code-panel, .action-panel, .constraint-panel, 
        .assignments-panel, .domains-panel, .log-panel, .solution-status {
          background: #1e293b;
          border-radius: 1rem;
          padding: 1.2rem;
          border: 1px solid #334155;
        }

        .code-panel h3, .constraint-panel h3, 
        .assignments-panel h3, .domains-panel h3, .log-panel h3 {
          color: #3b82f6;
          margin: 0 0 0.8rem 0;
          font-size: 1rem;
        }

        .code pre {
          margin: 0;
          font-family: 'Fira Code', monospace;
          color: #a0aec0;
          font-size: 0.8rem;
          line-height: 1.8;
        }

        .code span {
          display: block;
          padding: 0.2rem 0.5rem;
          border-radius: 2px;
        }

        .highlight {
          background: #2d3748;
          color: #fbbf24;
          border-left: 4px solid #fbbf24;
        }

        .action-panel {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .action-panel .label {
          color: #a0aec0;
          font-size: 0.9rem;
          font-weight: bold;
        }

        .action-panel .value {
          color: #fbbf24;
          font-weight: bold;
          font-size: 1.1rem;
        }

        .constraint-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .constraint-item {
          background: #2d3748;
          padding: 0.5rem;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          color: #cbd5e0;
          position: relative;
        }

        .constraint-item.conflict {
          background: #ef4444;
          color: white;
        }

        .conflict-badge {
          margin-left: 0.5rem;
          font-size: 0.7rem;
        }

        .assignments-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.8rem;
        }

        .assignment-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .var-name {
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: bold;
        }

        .var-value {
          font-size: 0.8rem;
          padding: 0.3rem 0.8rem;
          border-radius: 1rem;
          margin-top: 0.3rem;
        }

        .domain-display {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .domain-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
        }

        .domain-var {
          width: 40px;
          color: #94a3b8;
          font-weight: bold;
        }

        .domain-colors {
          display: flex;
          gap: 0.5rem;
        }

        .domain-color {
          padding: 0.2rem 0.6rem;
          border-radius: 0.3rem;
          color: white;
          font-size: 0.7rem;
          font-weight: bold;
        }

        .log-item {
          font-size: 0.8rem;
          padding: 0.3rem 0;
          border-bottom: 1px solid #334155;
          color: #cbd5e0;
        }

        .solved-badge {
          background: #10b981;
          color: white;
          padding: 0.5rem;
          border-radius: 0.5rem;
          text-align: center;
          font-weight: bold;
        }

        .stuck-badge {
          background: #ef4444;
          color: white;
          padding: 0.5rem;
          border-radius: 0.5rem;
          text-align: center;
          font-weight: bold;
        }

        @media (max-width: 1000px) {
          .main-content {
            grid-template-columns: 1fr;
          }
          
          .aim-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}