"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function HillClimbingLab() {
  // Problem: Find maximum of a function (optimization)
  const [function_type, setFunctionType] = useState('quadratic');
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [neighbors, setNeighbors] = useState([]);
  const [bestNeighbor, setBestNeighbor] = useState(null);
  const [step, setStep] = useState(0);
  const [path, setPath] = useState([]);
  const [message, setMessage] = useState('');
  const [log, setLog] = useState([]);
  const [highlightedLine, setHighlightedLine] = useState(null);
  const [autoMode, setAutoMode] = useState(false);
  const [speed, setSpeed] = useState('medium');
  const [showAim, setShowAim] = useState(true);
  const [experimentPhase, setExperimentPhase] = useState('initialization');
  const [localMaxima, setLocalMaxima] = useState(false);
  const [globalMaxima, setGlobalMaxima] = useState(false);
  const [restarts, setRestarts] = useState(0);

  // Define different functions for optimization
  const functions = {
    quadratic: (x) => -Math.pow(x - 2, 2) + 5,
    sinusoidal: (x) => Math.sin(x) * 3 + Math.sin(x * 2) * 2,
    complex: (x) => -Math.pow(x, 4) / 20 + Math.pow(x, 2) / 2 - x / 2 + 3
  };

  const getFunctionName = () => {
    switch(function_type) {
      case 'quadratic': return 'f(x) = -(x-2)² + 5';
      case 'sinusoidal': return 'f(x) = 3sin(x) + 2sin(2x)';
      case 'complex': return 'f(x) = -x⁴/20 + x²/2 - x/2 + 3';
      default: return 'f(x)';
    }
  };

  const evaluateFunction = (x) => {
    return functions[function_type](x);
  };

  const generateNeighbors = (x, stepSize = 0.2) => {
    const leftX = x - stepSize;
    const rightX = x + stepSize;
    
    return [
      { x: leftX, y: evaluateFunction(leftX), direction: '← Left' },
      { x: rightX, y: evaluateFunction(rightX), direction: '→ Right' }
    ];
  };

  const findBestNeighbor = (neighborList) => {
    if (neighborList.length === 0) return null;
    return neighborList.reduce((best, current) => 
      current.y > best.y ? current : best
    );
  };

  const isLocalMaximum = (x, neighborsList) => {
    return neighborsList.every(n => n.y <= currentY);
  };

  const resetProblem = () => {
    const startX = Math.random() * 6 - 2;
    const startY = evaluateFunction(startX);
    
    setCurrentX(startX);
    setCurrentY(startY);
    setPath([{ x: startX, y: startY, step: 0 }]);
    setNeighbors(generateNeighbors(startX));
    setBestNeighbor(null);
    setStep(0);
    setRestarts(0);
    setLocalMaxima(false);
    setGlobalMaxima(false);
    setMessage(`Started at x = ${startX.toFixed(2)}, f(x) = ${startY.toFixed(2)}`);
    setLog([`Hill Climbing started at x = ${startX.toFixed(2)}`]);
    setHighlightedLine(null);
    setExperimentPhase('searching');
  };

  useEffect(() => {
    resetProblem();
  }, [function_type]);

  const hillClimbStep = () => {
    if (localMaxima || globalMaxima) {
      setMessage('Already at maximum! Reset to try again.');
      return;
    }

    setHighlightedLine(1);
    
    const neighborList = generateNeighbors(currentX);
    setNeighbors(neighborList);
    setHighlightedLine(2);

    if (isLocalMaximum(currentX, neighborList)) {
      setLocalMaxima(true);
      
      if (function_type === 'quadratic' && Math.abs(currentX - 2) < 0.1) {
        setGlobalMaxima(true);
        setMessage('GLOBAL MAXIMUM FOUND!');
        setLog([`Step ${step + 1}: Reached global maximum at x = ${currentX.toFixed(2)}`, ...log].slice(0, 6));
        setExperimentPhase('solved');
        setHighlightedLine(7);
      } else {
        setMessage('Stuck at LOCAL MAXIMUM! Try random restart.');
        setLog([`Step ${step + 1}: Stuck at local maximum x = ${currentX.toFixed(2)}`, ...log].slice(0, 6));
        setExperimentPhase('stuck');
        setHighlightedLine(6);
      }
      return;
    }

    const best = findBestNeighbor(neighborList);
    setBestNeighbor(best);
    setHighlightedLine(3);

    if (best && best.y > currentY) {
      setCurrentX(best.x);
      setCurrentY(best.y);
      setPath([...path, { x: best.x, y: best.y, step: step + 1 }]);
      
      setMessage(`Moved ${best.direction} to x = ${best.x.toFixed(2)}, f(x) = ${best.y.toFixed(2)}`);
      setLog([`Step ${step + 1}: Moved ${best.direction} → value improved to ${best.y.toFixed(2)}`, ...log].slice(0, 6));
      setStep(step + 1);
      setHighlightedLine(4);
    }

    if (function_type === 'quadratic' && Math.abs(currentX - 2) < 0.1) {
      setGlobalMaxima(true);
      setMessage('GLOBAL MAXIMUM FOUND!');
      setExperimentPhase('solved');
    }
  };

  const randomRestart = () => {
    const newX = Math.random() * 6 - 2;
    const newY = evaluateFunction(newX);
    
    setCurrentX(newX);
    setCurrentY(newY);
    setPath([{ x: newX, y: newY, step: 0 }]);
    setNeighbors(generateNeighbors(newX));
    setLocalMaxima(false);
    setRestarts(prev => prev + 1);
    
    setMessage(`Random restart at x = ${newX.toFixed(2)}`);
    setLog([`Random restart #${restarts + 1} at x = ${newX.toFixed(2)}`, ...log].slice(0, 6));
    setExperimentPhase('searching');
  };

  const changeFunction = (type) => {
    setFunctionType(type);
    setExperimentPhase('initialization');
    setTimeout(() => resetProblem(), 100);
  };

  const toggleAutoMode = () => {
    setAutoMode(!autoMode);
    if (!autoMode) {
      setMessage('Auto mode enabled - watching hill climbing...');
    }
  };

  useEffect(() => {
    if (autoMode && !localMaxima && !globalMaxima) {
      const timer = setTimeout(() => {
        hillClimbStep();
      }, speed === 'slow' ? 1500 : speed === 'medium' ? 800 : 400);
      
      return () => clearTimeout(timer);
    }
  }, [autoMode, currentX, localMaxima, globalMaxima, speed]);

  const generateCurvePoints = () => {
    const points = [];
    for (let x = -2; x <= 4; x += 0.1) {
      points.push({ x, y: evaluateFunction(x) });
    }
    return points;
  };

  const getPhaseColor = () => {
    switch(experimentPhase) {
      case 'initialization': return '#64748b';
      case 'searching': return '#f97316';
      case 'solved': return '#22c55e';
      case 'stuck': return '#ef4444';
      default: return '#64748b';
    }
  };

  const curvePoints = generateCurvePoints();
  
  const svgWidth = 700;
  const svgHeight = 400;
  const padding = 50;
  
  const xScale = (x) => padding + ((x + 2) / 6) * (svgWidth - 2 * padding);
  const yScale = (y) => svgHeight - padding - ((y + 1) / 8) * (svgHeight - 2 * padding);

  return (
    <div className="container">
      <Head>
        <title>Hill Climbing Algorithm - AI Optimization Visualizer</title>
      </Head>

      {showAim && (
        <div className="aim-banner">
          <button className="close-aim" onClick={() => setShowAim(false)}>X</button>
          <h2>HILL CLIMBING ALGORITHM - INTERACTIVE LAB</h2>
          <div className="aim-content">
            <div className="aim-card">
              <div className="aim-icon">T</div>
              <div className="aim-text">
                <span className="aim-label">OBJECTIVE</span>
                <span className="aim-value">Find global maximum of mathematical functions</span>
              </div>
            </div>
            <div className="aim-card">
              <div className="aim-icon">E</div>
              <div className="aim-text">
                <span className="aim-label">EXPERIMENT</span>
                <span className="aim-value">Start random - always move uphill - observe local optima</span>
              </div>
            </div>
            <div className="aim-card">
              <div className="aim-icon">F</div>
              <div className="aim-text">
                <span className="aim-label">FUNCTION</span>
                <span className="aim-value">{getFunctionName()}</span>
              </div>
            </div>
            <div className="aim-card">
              <div className="aim-icon">C</div>
              <div className="aim-text">
                <span className="aim-label">CHALLENGE</span>
                <span className="aim-value">Local maxima trap - need random restarts</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="header">
        <h1>HILL CLIMBING - LOCAL SEARCH VISUALIZATION</h1>
        <div className="status-group">
          <div className="phase-badge" style={{ background: getPhaseColor(), color: 'white' }}>
            {experimentPhase.toUpperCase()}
          </div>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Steps</span>
              <span className="stat-value">{step}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Restarts</span>
              <span className="stat-value">{restarts}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="viz-section">
          <div className="viz-header">
            <h2>FUNCTION LANDSCAPE</h2>
            <div className="legend">
              <div className="legend-item">
                <span className="legend-dot curve"></span>
                <span>Function Curve</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot current"></span>
                <span>Current</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot path"></span>
                <span>Path</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot neighbor"></span>
                <span>Neighbors</span>
              </div>
            </div>
          </div>

          <div className="graph-container">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="function-svg">
              <defs>
                <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#ef4444" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              
              <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="#1a1a2e" />

              {[-2, -1, 0, 1, 2, 3, 4].map(x => (
                <line
                  key={`grid-x-${x}`}
                  x1={xScale(x)}
                  y1={padding}
                  x2={xScale(x)}
                  y2={svgHeight - padding}
                  stroke="#333355"
                  strokeWidth="0.5"
                  strokeDasharray="4,4"
                />
              ))}
              {[0, 1, 2, 3, 4, 5, 6].map(y => (
                <line
                  key={`grid-y-${y}`}
                  x1={padding}
                  y1={yScale(y)}
                  x2={svgWidth - padding}
                  y2={yScale(y)}
                  stroke="#333355"
                  strokeWidth="0.5"
                  strokeDasharray="4,4"
                />
              ))}

              <path
                d={`M ${curvePoints.map(p => `${xScale(p.x)} ${yScale(p.y)}`).join(' L ')}`}
                fill="none"
                stroke="#f97316"
                strokeWidth="4"
              />

              {path.map((point, index) => {
                if (index === 0) return null;
                const prev = path[index - 1];
                return (
                  <line
                    key={`path-${index}`}
                    x1={xScale(prev.x)}
                    y1={yScale(prev.y)}
                    x2={xScale(point.x)}
                    y2={yScale(point.y)}
                    stroke="#22d3ee"
                    strokeWidth="3"
                    strokeDasharray="6,4"
                  />
                );
              })}

              {neighbors.map((neighbor, idx) => (
                <g key={`neighbor-${idx}`}>
                  <circle
                    cx={xScale(neighbor.x)}
                    cy={yScale(neighbor.y)}
                    r="10"
                    fill="#84cc16"
                    stroke="#1a1a2e"
                    strokeWidth="2"
                  />
                  <text
                    x={xScale(neighbor.x)}
                    y={yScale(neighbor.y) - 18}
                    textAnchor="middle"
                    fill="#84cc16"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {neighbor.direction}
                  </text>
                </g>
              ))}

              <circle
                cx={xScale(currentX)}
                cy={yScale(currentY)}
                r="14"
                fill="#ef4444"
                stroke="#1a1a2e"
                strokeWidth="3"
              />
              <text
                x={xScale(currentX)}
                y={yScale(currentY) - 25}
                textAnchor="middle"
                fill="#ef4444"
                fontSize="12"
                fontWeight="bold"
              >
                CURRENT
              </text>

              {path.map((point, index) => (
                <circle
                  key={`point-${index}`}
                  cx={xScale(point.x)}
                  cy={yScale(point.y)}
                  r="5"
                  fill="#22d3ee"
                  stroke="#1a1a2e"
                  strokeWidth="2"
                />
              ))}

              <text x={svgWidth - 40} y={svgHeight - 15} fill="#888899" fontSize="12" fontWeight="500">x</text>
              <text x={20} y={35} fill="#888899" fontSize="12" fontWeight="500">f(x)</text>
              
              {[-2, -1, 0, 1, 2, 3, 4].map(x => (
                <text
                  key={`label-${x}`}
                  x={xScale(x) - 8}
                  y={svgHeight - padding + 25}
                  fill="#888899"
                  fontSize="10"
                  fontWeight="500"
                >
                  {x}
                </text>
              ))}
            </svg>
          </div>

          <div className="control-panel">
            <button 
              onClick={hillClimbStep}
              disabled={localMaxima || globalMaxima}
              className="btn primary"
            >
              CLIMB STEP
            </button>
            <button 
              onClick={randomRestart}
              className="btn warning"
            >
              RANDOM RESTART
            </button>
            <button 
              onClick={toggleAutoMode}
              className={`btn ${autoMode ? 'success' : 'secondary'}`}
            >
              {autoMode ? 'PAUSE' : 'AUTO CLIMB'}
            </button>
          </div>

          <div className="selector-panel">
            <span className="selector-label">TEST FUNCTION:</span>
            <div className="button-group">
              <button 
                className={function_type === 'quadratic' ? 'active' : ''} 
                onClick={() => changeFunction('quadratic')}
              >
                Simple Peak
              </button>
              <button 
                className={function_type === 'sinusoidal' ? 'active' : ''} 
                onClick={() => changeFunction('sinusoidal')}
              >
                Multiple Peaks
              </button>
              <button 
                className={function_type === 'complex' ? 'active' : ''} 
                onClick={() => changeFunction('complex')}
              >
                Complex
              </button>
            </div>
          </div>

          <div className="selector-panel">
            <span className="selector-label">SPEED:</span>
            <div className="button-group">
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
          </div>

          <div className={`status-card ${localMaxima ? 'stuck' : globalMaxima ? 'solved' : ''}`}>
            <div className="status-icon">
              {globalMaxima ? 'W' : localMaxima ? '!' : '>'}
            </div>
            <div className="status-text">{message}</div>
          </div>

          {localMaxima && !globalMaxima && (
            <div className="warning-card">
              <span>STUCK AT LOCAL MAXIMUM</span>
              <button onClick={randomRestart} className="warning-btn">
                TRY RANDOM RESTART
              </button>
            </div>
          )}
        </div>

        <div className="info-section">
          <div className="card">
            <div className="card-header">
              <span className="card-icon">H</span>
              <h3>HILL CLIMBING ALGORITHM</h3>
            </div>
            <div className="code-block">
              <pre>
                <span className={highlightedLine === 1 ? 'highlight' : ''}>
                  1  function HILL-CLIMBING(problem):
                </span>
                <span className={highlightedLine === 2 ? 'highlight' : ''}>
                  2    current = initial state
                </span>
                <span className={highlightedLine === 3 ? 'highlight' : ''}>
                  3    while true:
                </span>
                <span className={highlightedLine === 4 ? 'highlight' : ''}>
                  4      neighbor = highest-valued successor
                </span>
                <span className={highlightedLine === 5 ? 'highlight' : ''}>
                  5      if neighbor.value - current.value:
                </span>
                <span className={highlightedLine === 6 ? 'highlight' : ''}>
                  6        return current
                </span>
                <span className={highlightedLine === 7 ? 'highlight' : ''}>
                  7      current = neighbor
                </span>
              </pre>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-icon">S</span>
              <h3>CURRENT STATE</h3>
            </div>
            <div className="state-grid">
              <div className="state-item">
                <span className="state-label">x coordinate</span>
                <span className="state-value">{currentX.toFixed(3)}</span>
              </div>
              <div className="state-item">
                <span className="state-label">f(x) value</span>
                <span className="state-value">{currentY.toFixed(3)}</span>
              </div>
              <div className="state-item">
                <span className="state-label">steps taken</span>
                <span className="state-value">{step}</span>
              </div>
              <div className="state-item">
                <span className="state-label">restarts</span>
                <span className="state-value">{restarts}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-icon">N</span>
              <h3>NEIGHBOR ANALYSIS</h3>
            </div>
            <div className="neighbors-list">
              {neighbors.map((neighbor, idx) => (
                <div 
                  key={idx}
                  className={`neighbor-card ${bestNeighbor?.x === neighbor.x ? 'best' : ''}`}
                >
                  <div className="neighbor-direction">{neighbor.direction}</div>
                  <div className="neighbor-details">
                    <span>x = {neighbor.x.toFixed(3)}</span>
                    <span>f(x) = {neighbor.y.toFixed(3)}</span>
                  </div>
                  {bestNeighbor?.x === neighbor.x && (
                    <div className="best-badge">BEST</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-icon">H</span>
              <h3>SEARCH HISTORY</h3>
            </div>
            <div className="history-list">
              {path.slice(-5).reverse().map((point, idx) => (
                <div key={idx} className="history-item">
                  <span className="history-step">Step {point.step}</span>
                  <span className="history-coord">x = {point.x.toFixed(2)}</span>
                  <span className="history-value">f(x) = {point.y.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-icon">L</span>
              <h3>EXPERIMENT LOG</h3>
            </div>
            <div className="log-list">
              {log.map((entry, idx) => (
                <div key={idx} className="log-item">{entry}</div>
              ))}
            </div>
          </div>

          <button 
            onClick={resetProblem}
            className="reset-btn"
          >
            RESET EXPERIMENT
          </button>
        </div>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
          padding: 2rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .aim-banner {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 1rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          position: relative;
          max-width: 1400px;
          margin: 0 auto 2rem auto;
          border: 1px solid #f9731666;
        }

        .close-aim {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #333355;
          border: none;
          color: #888899;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-aim:hover {
          background: #f97316;
          color: white;
        }

        .aim-banner h2 {
          color: #f97316;
          font-size: 1.5rem;
          margin: 0 0 1.5rem 0;
          font-weight: 700;
        }

        .aim-content {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .aim-card {
          background: #0f0f1a;
          padding: 1rem;
          border-radius: 0.8rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid #333355;
        }

        .aim-icon {
          font-size: 1.5rem;
          font-weight: bold;
          color: #f97316;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1a1a2e;
          border-radius: 8px;
        }

        .aim-text {
          display: flex;
          flex-direction: column;
        }

        .aim-label {
          font-size: 0.7rem;
          font-weight: 600;
          color: #f97316;
          text-transform: uppercase;
        }

        .aim-value {
          font-size: 0.85rem;
          color: #cccccc;
          font-weight: 500;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto 1.5rem auto;
        }

        .header h1 {
          color: #f97316;
          font-size: 1.6rem;
          margin: 0;
          font-weight: 700;
        }

        .status-group {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .phase-badge {
          padding: 0.5rem 1.5rem;
          border-radius: 2rem;
          font-weight: 600;
          font-size: 0.8rem;
          letter-spacing: 0.5px;
        }

        .stats {
          display: flex;
          gap: 1.5rem;
          background: #1a1a2e;
          padding: 0.5rem 1.5rem;
          border-radius: 2rem;
          border: 1px solid #333355;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-label {
          color: #888899;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .stat-value {
          color: #f97316;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .main-content {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .viz-section {
          background: #0f0f1a;
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid #333355;
        }

        .viz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .viz-header h2 {
          color: #f97316;
          font-size: 1.1rem;
          margin: 0;
          font-weight: 600;
        }

        .legend {
          display: flex;
          gap: 1.2rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: #888899;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }

        .legend-dot.curve { background: #f97316; }
        .legend-dot.current { background: #ef4444; }
        .legend-dot.path { background: #22d3ee; }
        .legend-dot.neighbor { background: #84cc16; }

        .graph-container {
          background: #1a1a2e;
          border-radius: 1rem;
          padding: 1rem;
          border: 1px solid #333355;
          margin-bottom: 1.5rem;
        }

        .function-svg {
          width: 100%;
          height: auto;
        }

        .control-panel {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.8rem;
          margin-bottom: 1.2rem;
        }

        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.8rem;
          border: none;
          border-radius: 0.6rem;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn.primary {
          background: #f97316;
          color: white;
        }

        .btn.warning {
          background: #84cc16;
          color: white;
        }

        .btn.secondary {
          background: #6366f1;
          color: white;
        }

        .btn.success {
          background: #22c55e;
          color: white;
        }

        .btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .selector-panel {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .selector-label {
          color: #888899;
          font-weight: 500;
          font-size: 0.9rem;
          min-width: 100px;
        }

        .button-group {
          display: flex;
          gap: 0.5rem;
          flex: 1;
        }

        .button-group button {
          flex: 1;
          padding: 0.6rem;
          border: 1px solid #333355;
          background: #1a1a2e;
          color: #888899;
          border-radius: 0.5rem;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
        }

        .button-group button:hover {
          border-color: #f97316;
          color: #f97316;
        }

        .button-group button.active {
          background: #f97316;
          color: white;
          border-color: #f97316;
        }

        .status-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #1a1a2e;
          border-radius: 0.8rem;
          border: 1px solid #333355;
          margin-top: 1rem;
        }

        .status-card.stuck {
          background: #3f1a1a;
          border-color: #ef4444;
        }

        .status-card.solved {
          background: #1a3f1a;
          border-color: #22c55e;
        }

        .status-icon {
          font-size: 1.5rem;
          color: #f97316;
          font-weight: bold;
        }

        .status-text {
          color: #cccccc;
          font-weight: 500;
          flex: 1;
        }

        .warning-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: #3f1a1a;
          border-radius: 0.8rem;
          border: 1px solid #ef4444;
          margin-top: 0.8rem;
          color: #ef4444;
          font-weight: 600;
        }

        .warning-btn {
          padding: 0.5rem 1rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .info-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .card {
          background: #0f0f1a;
          border-radius: 1rem;
          padding: 1.2rem;
          border: 1px solid #333355;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .card-icon {
          font-size: 1rem;
          font-weight: bold;
          color: #f97316;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1a1a2e;
          border-radius: 6px;
        }

        .card-header h3 {
          color: #f97316;
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .code-block {
          background: #1a1a2e;
          border-radius: 0.8rem;
          padding: 1rem;
          font-family: 'Fira Code', monospace;
          font-size: 0.8rem;
          border: 1px solid #333355;
        }

        .code-block pre {
          margin: 0;
          color: #888899;
        }

        .code-block span {
          display: block;
          padding: 0.2rem 0.5rem;
          border-radius: 0.3rem;
        }

        .highlight {
          background: #3f2a1a;
          color: #f97316;
          border-left: 3px solid #f97316;
        }

        .state-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .state-item {
          display: flex;
          flex-direction: column;
        }

        .state-label {
          font-size: 0.7rem;
          color: #888899;
          text-transform: uppercase;
        }

        .state-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #f97316;
        }

        .neighbors-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .neighbor-card {
          padding: 0.8rem;
          background: #1a1a2e;
          border-radius: 0.6rem;
          border: 1px solid #333355;
          position: relative;
        }

        .neighbor-card.best {
          background: #3f2a1a;
          border-color: #f97316;
        }

        .neighbor-direction {
          font-weight: 600;
          color: #84cc16;
          margin-bottom: 0.3rem;
        }

        .neighbor-details {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: #888899;
        }

        .best-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          font-size: 0.7rem;
          font-weight: 600;
          color: #f97316;
        }

        .history-list {
          max-height: 150px;
          overflow-y: auto;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #333355;
          font-size: 0.8rem;
        }

        .history-step {
          color: #888899;
          font-weight: 500;
        }

        .history-coord {
          color: #22d3ee;
          font-weight: 500;
        }

        .history-value {
          color: #f97316;
          font-weight: 600;
        }

        .log-list {
          max-height: 120px;
          overflow-y: auto;
        }

        .log-item {
          font-size: 0.75rem;
          padding: 0.3rem 0;
          border-bottom: 1px solid #333355;
          color: #888899;
        }

        .reset-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: #1a1a2e;
          color: #888899;
          border: 1px solid #333355;
          border-radius: 0.8rem;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .reset-btn:hover {
          border-color: #f97316;
          color: #f97316;
        }

        @media (max-width: 1000px) {
          .main-content {
            grid-template-columns: 1fr;
          }
          
          .aim-content {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .aim-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
