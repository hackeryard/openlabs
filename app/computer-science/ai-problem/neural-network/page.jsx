"use client";
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const canvasRef = useRef(null);
  const [network, setNetwork] = useState(null);
  const [inputValues, setInputValues] = useState([0.5, 0.8]);
  const [weights, setWeights] = useState([]);
  const [activations, setActivations] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState('xor');
  const [explanation, setExplanation] = useState('');
  const [layerOutputs, setLayerOutputs] = useState([]);

  // ============================================
  // EXPERIMENT HEADER
  // ============================================
  const experimentInfo = {
    title: "🧠 Neural Signal Flow Visualizer",
    aim: "To visualize how signals flow through a neural network - input layer → hidden layers → output layer with glowing nodes and dynamic connections",
    realProblem: "Understanding how AI processes information internally",
    experiment: "Input values pass through neural layers, nodes glow based on activation, connection thickness shows weight strength",
    understanding: "Neural network's internal processing becomes clearly visible - see exactly how data transforms as it flows through the network"
  };

  // ============================================
  // PROBLEM DEFINITIONS
  // ============================================
  const problems = {
    xor: {
      name: "XOR Logic Gate",
      description: "Network learns XOR logic: Output is 1 when inputs are different",
      inputs: [
        { label: "Input A", value: 0 },
        { label: "Input B", value: 1 }
      ],
      truthTable: [
        { in1: 0, in2: 0, out: 0 },
        { in1: 0, in2: 1, out: 1 },
        { in1: 1, in2: 0, out: 1 },
        { in1: 1, in2: 1, out: 0 }
      ],
      explanation: "XOR is a classic problem that single-layer networks can't solve. It needs hidden layers to learn the non-linear pattern."
    },
    and: {
      name: "AND Logic Gate",
      description: "Network learns AND logic: Output is 1 only when both inputs are 1",
      inputs: [
        { label: "Input A", value: 1 },
        { label: "Input B", value: 1 }
      ],
      truthTable: [
        { in1: 0, in2: 0, out: 0 },
        { in1: 0, in2: 1, out: 0 },
        { in1: 1, in2: 0, out: 0 },
        { in1: 1, in2: 1, out: 1 }
      ],
      explanation: "AND is a linearly separable problem - a single layer can learn it. The network simply activates when both inputs are high."
    },
    or: {
      name: "OR Logic Gate",
      description: "Network learns OR logic: Output is 1 if at least one input is 1",
      inputs: [
        { label: "Input A", value: 0 },
        { label: "Input B", value: 1 }
      ],
      truthTable: [
        { in1: 0, in2: 0, out: 0 },
        { in1: 0, in2: 1, out: 1 },
        { in1: 1, in2: 0, out: 1 },
        { in1: 1, in2: 1, out: 1 }
      ],
      explanation: "OR is the simplest gate - the network activates if any input is high. Shows basic neural activation."
    },
    halfAdder: {
      name: "Half Adder",
      description: "Network adds two bits: Outputs Sum and Carry",
      inputs: [
        { label: "Bit A", value: 1 },
        { label: "Bit B", value: 1 }
      ],
      truthTable: [
        { in1: 0, in2: 0, out: "Sum:0, Carry:0" },
        { in1: 0, in2: 1, out: "Sum:1, Carry:0" },
        { in1: 1, in2: 0, out: "Sum:1, Carry:0" },
        { in1: 1, in2: 1, out: "Sum:0, Carry:1" }
      ],
      explanation: "Half adder combines XOR and AND - shows how networks can learn multiple outputs simultaneously."
    }
  };

  // ============================================
  // REAL WORLD APPLICATIONS
  // ============================================
  const applications = [
    {
      icon: "📸",
      title: "Image Recognition",
      description: "Neural networks power facial recognition in phones, object detection in cameras, and medical image diagnosis"
    },
    {
      icon: "🎵",
      title: "Music Recommendations",
      description: "Spotify and YouTube use neural networks to recommend songs and videos based on your listening history"
    },
    {
      icon: "🗣️",
      title: "Voice Assistants",
      description: "Siri, Alexa, and Google Assistant use neural networks to understand and respond to your voice commands"
    },
    {
      icon: "🚗",
      title: "Self-Driving Cars",
      description: "Tesla and Waymo use neural networks to detect pedestrians, read traffic signs, and navigate roads"
    },
    {
      icon: "🏥",
      title: "Medical Diagnosis",
      description: "AI helps doctors detect cancer in X-rays, predict diseases, and analyze patient data"
    },
    {
      icon: "📧",
      title: "Spam Detection",
      description: "Gmail uses neural networks to automatically filter spam emails from your inbox"
    },
    {
      icon: "📈",
      title: "Stock Market Prediction",
      description: "Financial institutions use neural networks to predict market trends and make trading decisions"
    },
    {
      icon: "🎮",
      title: "Game AI",
      description: "Video games use neural networks to create intelligent opponents that learn from player behavior"
    },
    {
      icon: "🌍",
      title: "Language Translation",
      description: "Google Translate uses neural networks to translate between hundreds of languages"
    }
  ];

  // Initialize network on load
  useEffect(() => {
    initializeNetwork();
  }, []);

  // Recalculate forward pass when inputs change
  useEffect(() => {
    if (network && weights.length > 0) {
      calculateForwardPass(inputValues);
    }
  }, [inputValues, weights]);

  // Redraw when network changes
  useEffect(() => {
    if (network) {
      drawNetwork();
    }
  }, [network, activations, weights, inputValues, isAnimating]);

  // Animation loop
  useEffect(() => {
    let interval;
    if (isAnimating) {
      interval = setInterval(() => {
        animateSignalFlow();
      }, 1000 / (10 * animationSpeed));
    }
    return () => clearInterval(interval);
  }, [isAnimating, animationSpeed, network, weights]);

  // Initialize neural network structure
  const initializeNetwork = () => {
    // Create a 3-layer network: 2 inputs, 4 hidden, 1 output
    const newNetwork = {
      layers: [
        { name: 'Input Layer', neurons: 2, type: 'input' },
        { name: 'Hidden Layer 1', neurons: 4, type: 'hidden' },
        { name: 'Hidden Layer 2', neurons: 3, type: 'hidden' },
        { name: 'Output Layer', neurons: 1, type: 'output' }
      ]
    };

    // Initialize random weights
    const newWeights = [
      // Input to Hidden1 [2][4]
      [
        [0.5, -0.3, 0.8, -0.2],
        [-0.4, 0.6, -0.7, 0.9]
      ],
      // Hidden1 to Hidden2 [4][3]
      [
        [0.3, -0.5, 0.7],
        [-0.2, 0.4, -0.6],
        [0.8, -0.3, 0.2],
        [-0.7, 0.5, -0.4]
      ],
      // Hidden2 to Output [3][1]
      [
        [0.6],
        [-0.8],
        [0.4]
      ]
    ];

    setNetwork(newNetwork);
    setWeights(newWeights);
    
    calculateForwardPass(inputValues);
    setExplanation("Network initialized! Move the sliders to see real-time changes in node activations and connection thickness.");
  };

  // Calculate forward pass through network
  const calculateForwardPass = (inputs) => {
    if (!network || !weights || weights.length === 0) return;

    const newActivations = [];
    
    // Input layer
    newActivations.push([...inputs]);
    
    // Layer 1: Input to Hidden1
    const hidden1 = [];
    for (let j = 0; j < 4; j++) {
      let sum = 0;
      for (let i = 0; i < 2; i++) {
        sum += inputs[i] * weights[0][i][j];
      }
      // Sigmoid activation
      hidden1[j] = 1 / (1 + Math.exp(-sum));
    }
    newActivations.push(hidden1);

    // Layer 2: Hidden1 to Hidden2
    const hidden2 = [];
    for (let j = 0; j < 3; j++) {
      let sum = 0;
      for (let i = 0; i < 4; i++) {
        sum += hidden1[i] * weights[1][i][j];
      }
      hidden2[j] = 1 / (1 + Math.exp(-sum));
    }
    newActivations.push(hidden2);

    // Layer 3: Hidden2 to Output
    const output = [];
    for (let j = 0; j < 1; j++) {
      let sum = 0;
      for (let i = 0; i < 3; i++) {
        sum += hidden2[i] * weights[2][i][j];
      }
      output[j] = 1 / (1 + Math.exp(-sum));
    }
    newActivations.push(output);

    setActivations(newActivations);
    
    // Calculate layer outputs for display
    const outputs = {
      input: inputs.map(v => v.toFixed(2)),
      hidden1: hidden1.map(v => v.toFixed(2)),
      hidden2: hidden2.map(v => v.toFixed(2)),
      output: output.map(v => v.toFixed(2))
    };
    setLayerOutputs(outputs);
  };

  // Animate signal flow
  const animateSignalFlow = () => {
    if (!network || !weights) return;

    // Create small variations in input for animation
    const newInputs = inputValues.map(v => {
      return Math.max(0, Math.min(1, v + (Math.random() - 0.5) * 0.05));
    });
    setInputValues(newInputs);
  };

  // Update input value
  const updateInput = (index, value) => {
    const newInputs = [...inputValues];
    newInputs[index] = parseFloat(value);
    setInputValues(newInputs);
  };

  // Randomize weights
  const randomizeWeights = () => {
    const newWeights = [
      // Input to Hidden1
      [
        [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
        [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1]
      ],
      // Hidden1 to Hidden2
      [
        [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
        [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
        [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
        [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1]
      ],
      // Hidden2 to Output
      [
        [Math.random() * 2 - 1],
        [Math.random() * 2 - 1],
        [Math.random() * 2 - 1]
      ]
    ];
    
    setWeights(newWeights);
    calculateForwardPass(inputValues);
    setExplanation("Weights randomized! See how the network's behavior and connections change.");
  };

  // Apply problem-specific weights
  const applyProblem = (problem) => {
    setSelectedProblem(problem);
    
    // Set appropriate inputs based on problem
    if (problem === 'xor') {
      setInputValues([0, 1]);
      // XOR weights
      const newWeights = [
        // Input to Hidden1 - creates XOR pattern
        [
          [5.0, -5.0, 5.0, -5.0],
          [5.0, -5.0, -5.0, 5.0]
        ],
        // Hidden1 to Hidden2
        [
          [4.0, -4.0, 2.0],
          [-4.0, 4.0, 2.0],
          [2.0, 2.0, -4.0],
          [2.0, 2.0, -4.0]
        ],
        // Hidden2 to Output
        [
          [8.0],
          [-8.0],
          [0.0]
        ]
      ];
      setWeights(newWeights);
      setExplanation(problems.xor.explanation);
    } else if (problem === 'and') {
      setInputValues([1, 1]);
      // AND weights
      const newWeights = [
        [
          [3.0, 1.0, 1.0, 1.0],
          [3.0, 1.0, 1.0, 1.0]
        ],
        [
          [2.0, 1.0, 1.0],
          [2.0, 1.0, 1.0],
          [1.0, 1.0, 1.0],
          [1.0, 1.0, 1.0]
        ],
        [
          [10.0],
          [0.0],
          [0.0]
        ]
      ];
      setWeights(newWeights);
      setExplanation(problems.and.explanation);
    } else if (problem === 'or') {
      setInputValues([0, 1]);
      // OR weights
      const newWeights = [
        [
          [4.0, 1.0, 1.0, 1.0],
          [4.0, 1.0, 1.0, 1.0]
        ],
        [
          [3.0, 1.0, 1.0],
          [3.0, 1.0, 1.0],
          [1.0, 1.0, 1.0],
          [1.0, 1.0, 1.0]
        ],
        [
          [8.0],
          [0.0],
          [0.0]
        ]
      ];
      setWeights(newWeights);
      setExplanation(problems.or.explanation);
    } else if (problem === 'halfAdder') {
      setInputValues([1, 1]);
      setExplanation(problems.halfAdder.explanation);
    }
    
    calculateForwardPass(inputValues);
  };

  // Draw the neural network on canvas
  const drawNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas || !network || !activations || activations.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Layer positions
    const layerX = [150, 350, 550, 750];
    
    // Draw connections first (so they appear behind nodes)
    ctx.lineWidth = 2;
    
    // Layer 1 to Layer 2 connections
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 4; j++) {
        const weight = weights[0]?.[i]?.[j] || 0;
        const thickness = Math.abs(weight) * 2 + 1;
        const opacity = Math.min(0.8, Math.abs(weight) * 0.5 + 0.3);
        
        ctx.beginPath();
        ctx.moveTo(layerX[0], 150 + i * 100);
        ctx.lineTo(layerX[1], 100 + j * 60);
        
        // Color based on weight sign
        if (weight > 0) {
          ctx.strokeStyle = `rgba(76, 175, 80, ${opacity})`;
        } else {
          ctx.strokeStyle = `rgba(244, 67, 54, ${opacity})`;
        }
        
        ctx.lineWidth = thickness;
        ctx.stroke();
      }
    }

    // Layer 2 to Layer 3 connections
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        const weight = weights[1]?.[i]?.[j] || 0;
        const thickness = Math.abs(weight) * 2 + 1;
        const opacity = Math.min(0.8, Math.abs(weight) * 0.5 + 0.3);
        
        ctx.beginPath();
        ctx.moveTo(layerX[1], 100 + i * 60);
        ctx.lineTo(layerX[2], 120 + j * 70);
        
        if (weight > 0) {
          ctx.strokeStyle = `rgba(76, 175, 80, ${opacity})`;
        } else {
          ctx.strokeStyle = `rgba(244, 67, 54, ${opacity})`;
        }
        
        ctx.lineWidth = thickness;
        ctx.stroke();
      }
    }

    // Layer 3 to Layer 4 connections
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 1; j++) {
        const weight = weights[2]?.[i]?.[j] || 0;
        const thickness = Math.abs(weight) * 2 + 1;
        const opacity = Math.min(0.8, Math.abs(weight) * 0.5 + 0.3);
        
        ctx.beginPath();
        ctx.moveTo(layerX[2], 120 + i * 70);
        ctx.lineTo(layerX[3], 250);
        
        if (weight > 0) {
          ctx.strokeStyle = `rgba(76, 175, 80, ${opacity})`;
        } else {
          ctx.strokeStyle = `rgba(244, 67, 54, ${opacity})`;
        }
        
        ctx.lineWidth = thickness;
        ctx.stroke();
      }
    }

    // Draw neurons (nodes)
    const layers = [
      { count: 2, yPositions: [150, 250] },
      { count: 4, yPositions: [100, 160, 220, 280] },
      { count: 3, yPositions: [120, 190, 260] },
      { count: 1, yPositions: [250] }
    ];

    layers.forEach((layer, layerIdx) => {
      layer.yPositions.forEach((y, neuronIdx) => {
        const x = layerX[layerIdx];
        const activation = activations[layerIdx]?.[neuronIdx] || 0;
        
        // Node glow based on activation
        const gradient = ctx.createRadialGradient(x, y, 10, x, y, 35);
        if (layerIdx === 0) {
          // Input layer - blue glow
          gradient.addColorStop(0, `rgba(33, 150, 243, ${activation})`);
          gradient.addColorStop(1, 'rgba(33, 150, 243, 0)');
        } else if (layerIdx === layers.length - 1) {
          // Output layer - gold glow
          gradient.addColorStop(0, `rgba(255, 215, 0, ${activation})`);
          gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        } else {
          // Hidden layers - purple glow
          gradient.addColorStop(0, `rgba(156, 39, 176, ${activation * 0.8})`);
          gradient.addColorStop(1, 'rgba(156, 39, 176, 0)');
        }
        
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Node border
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        if (layerIdx === 0) {
          ctx.strokeStyle = '#2196F3';
        } else if (layerIdx === layers.length - 1) {
          ctx.strokeStyle = '#ffd700';
        } else {
          ctx.strokeStyle = '#9C27B0';
        }
        ctx.lineWidth = 3;
        ctx.stroke();

        // Node fill
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        if (layerIdx === 0) {
          ctx.fillStyle = `rgba(33, 150, 243, ${0.2 + activation * 0.6})`;
        } else if (layerIdx === layers.length - 1) {
          ctx.fillStyle = `rgba(255, 215, 0, ${0.2 + activation * 0.6})`;
        } else {
          ctx.fillStyle = `rgba(156, 39, 176, ${0.1 + activation * 0.5})`;
        }
        ctx.fill();

        // Activation value text
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(activation.toFixed(2), x, y + 40);
      });
    });

    // Layer labels
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#ffd700';
    ctx.fillText('INPUT', layerX[0] - 40, 30);
    ctx.fillText('HIDDEN 1', layerX[1] - 40, 30);
    ctx.fillText('HIDDEN 2', layerX[2] - 40, 30);
    ctx.fillText('OUTPUT', layerX[3] - 40, 30);
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Neural Signal Flow Visualizer</title>
        <meta name="description" content="2D Interactive Neural Network with Signal Flow Visualization" />
      </Head>

      {/* Header with Experiment Info */}
      <div style={styles.header}>
        <h1 style={styles.title}>{experimentInfo.title}</h1>
        <div style={styles.experimentCard}>
          <div style={styles.experimentRow}>
            <span style={styles.label}>🎯 AIM:</span>
            <span style={styles.value}>{experimentInfo.aim}</span>
          </div>
          <div style={styles.experimentRow}>
            <span style={styles.label}>🌍 REAL PROBLEM:</span>
            <span style={styles.value}>{experimentInfo.realProblem}</span>
          </div>
          <div style={styles.experimentRow}>
            <span style={styles.label}>⚙️ EXPERIMENT:</span>
            <span style={styles.value}>{experimentInfo.experiment}</span>
          </div>
          <div style={styles.experimentRow}>
            <span style={styles.label}>👀 VISUALIZATION:</span>
            <span style={styles.value}>{experimentInfo.understanding}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Left Panel - Controls and Info */}
        <div style={styles.leftPanel}>
          {/* Problem Selector */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🧪 Select Problem</h3>
            <div style={styles.buttonGrid}>
              <button 
                style={{...styles.problemBtn, ...(selectedProblem === 'xor' ? styles.activeBtn : {})}}
                onClick={() => applyProblem('xor')}
              >
                XOR Gate
              </button>
              <button 
                style={{...styles.problemBtn, ...(selectedProblem === 'and' ? styles.activeBtn : {})}}
                onClick={() => applyProblem('and')}
              >
                AND Gate
              </button>
              <button 
                style={{...styles.problemBtn, ...(selectedProblem === 'or' ? styles.activeBtn : {})}}
                onClick={() => applyProblem('or')}
              >
                OR Gate
              </button>
              <button 
                style={{...styles.problemBtn, ...(selectedProblem === 'halfAdder' ? styles.activeBtn : {})}}
                onClick={() => applyProblem('halfAdder')}
              >
                Half Adder
              </button>
            </div>
            {selectedProblem && (
              <div style={styles.problemInfo}>
                <h4 style={styles.problemName}>{problems[selectedProblem].name}</h4>
                <p style={styles.problemDesc}>{problems[selectedProblem].description}</p>
              </div>
            )}
          </div>

          {/* Input Controls */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🎮 Input Values</h3>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>
                Input 1:
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={inputValues[0]}
                  onChange={(e) => updateInput(0, e.target.value)}
                  style={styles.slider}
                />
                <span style={styles.inputValue}>{inputValues[0].toFixed(2)}</span>
              </label>
              <label style={styles.inputLabel}>
                Input 2:
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={inputValues[1]}
                  onChange={(e) => updateInput(1, e.target.value)}
                  style={styles.slider}
                />
                <span style={styles.inputValue}>{inputValues[1].toFixed(2)}</span>
              </label>
            </div>
            <p style={styles.hint}>⬆️ Move sliders to see real-time changes in the network!</p>
          </div>

          {/* Network Controls */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>⚙️ Network Controls</h3>
            <div style={styles.controlGroup}>
              <button style={styles.controlBtn} onClick={randomizeWeights}>
                🎲 Randomize Weights
              </button>
              <button 
                style={{...styles.controlBtn, backgroundColor: isAnimating ? '#f44336' : '#4CAF50'}}
                onClick={() => setIsAnimating(!isAnimating)}
              >
                {isAnimating ? '⏸️ Stop Animation' : '▶️ Start Animation'}
              </button>
              <label style={styles.speedLabel}>
                Speed:
                <input 
                  type="range" 
                  min="0.5" 
                  max="3" 
                  step="0.5"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                  style={styles.slider}
                />
                <span>{animationSpeed}x</span>
              </label>
            </div>
          </div>

          {/* Truth Table */}
          {selectedProblem && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📊 Truth Table</h3>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Input A</th>
                      <th style={styles.th}>Input B</th>
                      <th style={styles.th}>Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems[selectedProblem].truthTable.map((row, i) => (
                      <tr key={i}>
                        <td style={styles.td}>{row.in1}</td>
                        <td style={styles.td}>{row.in2}</td>
                        <td style={styles.td}>{row.out}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Center Panel - Neural Network Visualization */}
        <div style={styles.centerPanel}>
          <div style={styles.canvasContainer}>
            <canvas 
              ref={canvasRef} 
              width={900} 
              height={500}
              style={styles.canvas}
            ></canvas>
          </div>

          {/* Layer Outputs */}
          <div style={styles.outputsContainer}>
            <div style={styles.outputCard}>
              <h4 style={styles.outputTitle}>Input Layer</h4>
              <div style={styles.outputValues}>
                {layerOutputs.input?.map((val, i) => (
                  <span key={i} style={styles.outputValue}>{val}</span>
                ))}
              </div>
            </div>
            <div style={styles.outputCard}>
              <h4 style={styles.outputTitle}>Hidden Layer 1</h4>
              <div style={styles.outputValues}>
                {layerOutputs.hidden1?.map((val, i) => (
                  <span key={i} style={styles.outputValue}>{val}</span>
                ))}
              </div>
            </div>
            <div style={styles.outputCard}>
              <h4 style={styles.outputTitle}>Hidden Layer 2</h4>
              <div style={styles.outputValues}>
                {layerOutputs.hidden2?.map((val, i) => (
                  <span key={i} style={styles.outputValue}>{val}</span>
                ))}
              </div>
            </div>
            <div style={styles.outputCard}>
              <h4 style={styles.outputTitle}>Output Layer</h4>
              <div style={styles.outputValues}>
                {layerOutputs.output?.map((val, i) => (
                  <span key={i} style={styles.outputValue}>{val}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time status */}
          <div style={styles.statusBar}>
            <span>🔴 Live Update: Input changed → Network recalculated → Visualization updated</span>
          </div>
        </div>

        {/* Right Panel - Explanation and Applications */}
        <div style={styles.rightPanel}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🧠 How It Works</h3>
            <div style={styles.explanationContent}>
              <p style={styles.explanationText}>{explanation || "Select a problem to see how the network processes information."}</p>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📖 Legend</h3>
            <div style={styles.legendGrid}>
              <div style={styles.legendItem}>
                <span style={{...styles.legendColor, backgroundColor: '#2196F3'}}></span>
                <span>Input Layer</span>
              </div>
              <div style={styles.legendItem}>
                <span style={{...styles.legendColor, backgroundColor: '#9C27B0'}}></span>
                <span>Hidden Layers</span>
              </div>
              <div style={styles.legendItem}>
                <span style={{...styles.legendColor, backgroundColor: '#ffd700'}}></span>
                <span>Output Layer</span>
              </div>
              <div style={styles.legendItem}>
                <span style={{...styles.legendColor, backgroundColor: '#4CAF50'}}></span>
                <span>Positive Weight</span>
              </div>
              <div style={styles.legendItem}>
                <span style={{...styles.legendColor, backgroundColor: '#f44336'}}></span>
                <span>Negative Weight</span>
              </div>
              <div style={styles.legendItem}>
                <span style={styles.glowExample}>●</span>
                <span>Glow = Activation</span>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📝 Step-by-Step</h3>
            <div style={styles.stepsList}>
              <div style={styles.step}>
                <span style={styles.stepNumber}>1</span>
                <span>Input values enter network</span>
              </div>
              <div style={styles.step}>
                <span style={styles.stepNumber}>2</span>
                <span>Multiply by weights (connection thickness)</span>
              </div>
              <div style={styles.step}>
                <span style={styles.stepNumber}>3</span>
                <span>Sum inputs at each node</span>
              </div>
              <div style={styles.step}>
                <span style={styles.stepNumber}>4</span>
                <span>Apply activation function (node glow)</span>
              </div>
              <div style={styles.step}>
                <span style={styles.stepNumber}>5</span>
                <span>Pass to next layer</span>
              </div>
              <div style={styles.step}>
                <span style={styles.stepNumber}>6</span>
                <span>Final output at last layer</span>
              </div>
            </div>
          </div>

          {/* REAL WORLD APPLICATIONS SECTION */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🌍 Real World Applications</h3>
            <div style={styles.applicationsGrid}>
              {applications.map((app, index) => (
                <div key={index} style={styles.applicationItem}>
                  <span style={styles.appIcon}>{app.icon}</span>
                  <div style={styles.appContent}>
                    <strong style={styles.appTitle}>{app.title}</strong>
                    <p style={styles.appDescription}>{app.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p>✨ Move the input sliders to see real-time changes in node brightness and connection thickness!</p>
      </div>
    </div>
  );
}

// ============================================
// STYLES
// ============================================
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)',
    color: 'white',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    maxWidth: '1400px',
    margin: '0 auto 20px'
  },
  title: {
    color: '#ffd700',
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '15px',
    textShadow: '0 0 20px rgba(255,215,0,0.3)'
  },
  experimentCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '15px',
    padding: '20px',
    border: '1px solid #4a4a6a'
  },
  experimentRow: {
    marginBottom: '10px',
    lineHeight: '1.6'
  },
  label: {
    color: '#ffd700',
    fontWeight: 'bold',
    marginRight: '10px'
  },
  value: {
    color: '#a8a8c0'
  },
  mainContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '300px 1fr 350px',
    gap: '20px'
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  centerPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '15px',
    padding: '20px',
    border: '1px solid #4a4a6a'
  },
  cardTitle: {
    color: '#ffd700',
    fontSize: '1.2rem',
    marginBottom: '15px',
    borderBottom: '1px solid #4a4a6a',
    paddingBottom: '10px'
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px'
  },
  problemBtn: {
    padding: '10px',
    background: 'transparent',
    border: '1px solid #4a4a6a',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  activeBtn: {
    background: '#ffd700',
    borderColor: '#ffd700',
    color: '#1a1a2e'
  },
  problemInfo: {
    marginTop: '15px',
    padding: '10px',
    background: 'rgba(255,215,0,0.1)',
    borderRadius: '8px'
  },
  problemName: {
    color: '#ffd700',
    marginBottom: '5px'
  },
  problemDesc: {
    color: '#a8a8c0',
    fontSize: '0.9rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  inputLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#a8a8c0'
  },
  slider: {
    flex: 1,
    height: '5px',
    background: '#4a4a6a',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  inputValue: {
    minWidth: '40px',
    color: '#ffd700',
    fontWeight: 'bold'
  },
  hint: {
    color: '#4a4a6a',
    fontSize: '0.9rem',
    marginTop: '10px',
    fontStyle: 'italic'
  },
  controlGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  controlBtn: {
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
    backgroundColor: '#2196F3'
  },
  speedLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#a8a8c0'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '8px',
    background: '#4a4a6a',
    color: '#ffd700',
    textAlign: 'center'
  },
  td: {
    padding: '8px',
    textAlign: 'center',
    borderBottom: '1px solid #4a4a6a'
  },
  canvasContainer: {
    background: '#1e1e2e',
    borderRadius: '15px',
    padding: '20px',
    border: '1px solid #4a4a6a',
    overflow: 'auto'
  },
  canvas: {
    width: '100%',
    height: 'auto',
    display: 'block'
  },
  outputsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px'
  },
  outputCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '15px',
    textAlign: 'center'
  },
  outputTitle: {
    color: '#ffd700',
    fontSize: '0.9rem',
    marginBottom: '10px'
  },
  outputValues: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  outputValue: {
    background: '#1e1e2e',
    padding: '5px',
    borderRadius: '5px',
    fontSize: '0.9rem'
  },
  statusBar: {
    background: 'rgba(76, 175, 80, 0.1)',
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#4CAF50',
    fontSize: '0.9rem',
    border: '1px solid #4CAF50'
  },
  explanationContent: {
    minHeight: '100px',
    color: '#a8a8c0',
    lineHeight: '1.6'
  },
  explanationText: {
    margin: 0
  },
  legendGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    color: '#a8a8c0'
  },
  legendColor: {
    width: '20px',
    height: '20px',
    borderRadius: '4px'
  },
  glowExample: {
    color: '#ffd700',
    fontSize: '20px',
    textShadow: '0 0 10px #ffd700'
  },
  stepsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px'
  },
  stepNumber: {
    background: '#ffd700',
    color: '#1a1a2e',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  applicationsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxHeight: '400px',
    overflowY: 'auto'
  },
  applicationItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '10px',
    transition: 'all 0.3s',
    cursor: 'pointer'
  },
  appIcon: {
    fontSize: '1.5rem'
  },
  appContent: {
    flex: 1
  },
  appTitle: {
    color: '#ffd700',
    display: 'block',
    marginBottom: '4px',
    fontSize: '0.95rem'
  },
  appDescription: {
    color: '#a8a8c0',
    fontSize: '0.85rem',
    lineHeight: '1.4'
  },
  footer: {
    maxWidth: '1400px',
    margin: '20px auto 0',
    textAlign: 'center',
    color: '#4a4a6a',
    padding: '20px',
    borderTop: '1px solid #4a4a6a'
  }
};