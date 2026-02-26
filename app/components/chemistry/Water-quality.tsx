"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,  
  Filler
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
    BarElement,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function WaterQualityLab() {
  // ==================== STATE MANAGEMENT ====================
  const [step, setStep] = useState(1);
  const [showTutorial, setShowTutorial] = useState(true);
  const [selectedParameter, setSelectedParameter] = useState('ph');
  const [manualMode, setManualMode] = useState(false);
  const [experimentActive, setExperimentActive] = useState(false);
  
  // Manual control values
  const [manualPh, setManualPh] = useState(7.0);
  const [manualTurbidity, setManualTurbidity] = useState(2.0);
  const [manualDo, setManualDo] = useState(7.5);
  const [manualTds, setManualTds] = useState(300);
  const [manualNitrates, setManualNitrates] = useState(10);
  const [manualHeavyMetals, setManualHeavyMetals] = useState(0.02);

  // Sensor data (auto mode)
  const [sensorData, setSensorData] = useState({
    ph: 7.2,
    turbidity: 2.5,
    dissolvedOxygen: 6.8,
    tds: 350,
    temperature: 24.5,
    nitrates: 5.2,
    heavyMetals: 0.03
  });

  const [waterQualityIndex, setWaterQualityIndex] = useState(85);
  const [riskLevel, setRiskLevel] = useState('low');
  const [waterStatus, setWaterStatus] = useState('Safe for Drinking');
  const [recommendedAction, setRecommendedAction] = useState('No treatment needed');
  const [contaminationSources, setContaminationSources] = useState([]);
  const [labNotes, setLabNotes] = useState([]);
  const [testResults, setTestResults] = useState([]);

  // ==================== EXPERIMENT PROCEDURE STEPS ====================
  const experimentSteps = [
    {
      id: 1,
      title: "Sample Collection",
      description: "Collect water sample from source using sterile container. Label with location, date, and time.",
      icon: "🧪",
      action: "Collect Sample"
    },
    {
      id: 2,
      title: "Sensor Calibration",
      description: "Calibrate all sensors using standard calibration solutions. Ensure probes are clean.",
      icon: "⚙️",
      action: "Calibrate Sensors"
    },
    {
      id: 3,
      title: "pH Measurement",
      description: "Immerse pH probe in sample. Wait for reading to stabilize. Record value.",
      icon: "🧪",
      action: "Measure pH"
    },
    {
      id: 4,
      title: "Turbidity Test",
      description: "Fill turbidity tube. Compare with standard or use turbidity meter.",
      icon: "🌫️",
      action: "Check Turbidity"
    },
    {
      id: 5,
      title: "Dissolved Oxygen",
      description: "Use DO meter with stirring. Ensure probe membrane is clean.",
      icon: "💧",
      action: "Measure DO"
    },
    {
      id: 6,
      title: "TDS & Chemical Analysis",
      description: "Measure TDS with conductivity meter. Test for nitrates and heavy metals.",
      icon: "⚗️",
      action: "Run Analysis"
    },
    {
      id: 7,
      title: "Data Recording",
      description: "Record all readings in lab notebook. Compare with WHO standards.",
      icon: "📝",
      action: "Record Data"
    },
    {
      id: 8,
      title: "AI Analysis",
      description: "Run AI algorithm to calculate Water Quality Index and get recommendations.",
      icon: "🤖",
      action: "Analyze Results"
    }
  ];

  // ==================== WATER PARAMETER INFO ====================
  const parameterInfo = {
    ph: {
      name: "pH Level",
      description: "Measures acidity/alkalinity. Low pH = acidic, High pH = alkaline.",
      healthImpact: "Extreme pH can cause metal leaching, skin irritation, and affects taste.",
      treatment: "Acidic: Add alkali (lime). Alkaline: Add acid (citric).",
      icon: "🧪",
      color: "#3b82f6"
    },
    turbidity: {
      name: "Turbidity",
      description: "Measures water clarity. Caused by suspended particles.",
      healthImpact: "High turbidity protects pathogens, reduces disinfection efficiency.",
      treatment: "Filtration, sedimentation, coagulation.",
      icon: "🌫️",
      color: "#f97316"
    },
    dissolvedOxygen: {
      name: "Dissolved Oxygen",
      description: "Oxygen dissolved in water. Essential for aquatic life.",
      healthImpact: "Low DO indicates pollution, causes fish kills, bad odors.",
      treatment: "Aeration, reduce organic pollution.",
      icon: "💧",
      color: "#10b981"
    },
    tds: {
      name: "Total Dissolved Solids",
      description: "Dissolved minerals and salts.",
      healthImpact: "High TDS affects taste, causes scaling, may indicate contamination.",
      treatment: "Reverse osmosis, distillation, deionization.",
      icon: "⚗️",
      color: "#8b5cf6"
    },
    nitrates: {
      name: "Nitrates",
      description: "From fertilizers, sewage, industrial waste.",
      healthImpact: "Causes methemoglobinemia (blue baby syndrome), cancer risk.",
      treatment: "Ion exchange, reverse osmosis, biological denitrification.",
      icon: "⚠️",
      color: "#f59e0b"
    },
    heavyMetals: {
      name: "Heavy Metals",
      description: "Lead, mercury, arsenic, cadmium from industry.",
      healthImpact: "Toxic to nervous system, causes organ damage, cancer.",
      treatment: "Precipitation, adsorption, ion exchange, reverse osmosis.",
      icon: "☠️",
      color: "#ef4444"
    }
  };

  // ==================== SIMULATION CONTROL ====================
  useEffect(() => {
    if (!experimentActive) return;

    const interval = setInterval(() => {
      if (!manualMode) {
        // Auto mode - random fluctuations
        setSensorData({
          ph: 7 + (Math.random() * 1.5 - 0.75),
          turbidity: 2 + (Math.random() * 4 - 2),
          dissolvedOxygen: 6.5 + (Math.random() * 2 - 1),
          tds: 300 + (Math.random() * 150 - 75),
          temperature: 24 + (Math.random() * 2 - 1),
          nitrates: 5 + (Math.random() * 10 - 5),
          heavyMetals: 0.02 + (Math.random() * 0.06 - 0.03)
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [experimentActive, manualMode]);

  // ==================== REAL-TIME WATER QUALITY ANALYSIS ====================
  // This effect runs immediately when any manual parameter changes
  useEffect(() => {
    if (!manualMode) return;
    
    // Direct calculation for instant feedback
    const data = {
      ph: manualPh,
      turbidity: manualTurbidity,
      dissolvedOxygen: manualDo,
      tds: manualTds,
      nitrates: manualNitrates,
      heavyMetals: manualHeavyMetals
    };

    let score = 100;
    const issues = [];
    const sources = [];

    // pH analysis
    if (data.ph < 6.5) {
      score -= 15;
      issues.push(`pH too low (${data.ph.toFixed(1)}) - Acidic water`);
      sources.push('Acidic: Industrial discharge, acid rain');
    } else if (data.ph > 8.5) {
      score -= 15;
      issues.push(`pH too high (${data.ph.toFixed(1)}) - Alkaline water`);
      sources.push('Alkaline: Mineral deposits, wastewater');
    }

    // Turbidity analysis
    if (data.turbidity > 5) {
      score -= 20;
      issues.push(`High turbidity (${data.turbidity.toFixed(1)} NTU) - Suspended particles`);
      sources.push('Turbidity: Soil erosion, urban runoff');
    } else if (data.turbidity > 3) {
      score -= 10;
      issues.push(`Moderate turbidity - Monitor closely`);
    }

    // Dissolved Oxygen analysis
    if (data.dissolvedOxygen < 4) {
      score -= 25;
      issues.push(`Critical low DO (${data.dissolvedOxygen.toFixed(1)} mg/L) - Severe pollution`);
      sources.push('Low DO: Organic waste, sewage, thermal pollution');
    } else if (data.dissolvedOxygen < 6) {
      score -= 15;
      issues.push(`Low DO (${data.dissolvedOxygen.toFixed(1)} mg/L) - Pollution indicator`);
    }

    // TDS analysis
    if (data.tds > 900) {
      score -= 20;
      issues.push(`Very high TDS (${data.tds} ppm) - Excessive minerals`);
      sources.push('High TDS: Industrial waste, saline intrusion');
    } else if (data.tds > 600) {
      score -= 10;
      issues.push(`High TDS (${data.tds} ppm) - Exceeds WHO limit`);
    }

    // Nitrates analysis
    if (data.nitrates > 50) {
      score -= 25;
      issues.push(`Dangerous nitrates (${data.nitrates.toFixed(1)} mg/L) - Agricultural runoff`);
      sources.push('Nitrates: Fertilizers, livestock waste');
    } else if (data.nitrates > 30) {
      score -= 15;
      issues.push(`High nitrates (${data.nitrates.toFixed(1)} mg/L) - Monitor`);
    }

    // Heavy metals analysis
    if (data.heavyMetals > 0.1) {
      score -= 30;
      issues.push(`CRITICAL: Heavy metal contamination (${(data.heavyMetals*1000).toFixed(0)} ppb)`);
      sources.push('Heavy Metals: Industrial discharge, mining');
    } else if (data.heavyMetals > 0.05) {
      score -= 20;
      issues.push(`Heavy metals detected above safe limit`);
    }

    const finalScore = Math.max(0, Math.min(100, score));
    
    // Determine risk level and status
    let newRiskLevel = 'low';
    let newWaterStatus = '✅ SAFE FOR DRINKING';
    let newRecommendedAction = 'No treatment required. Water meets WHO standards.';
    
    if (finalScore >= 80) {
      newRiskLevel = 'low';
      newWaterStatus = '✅ SAFE FOR DRINKING';
      newRecommendedAction = 'No treatment required. Water meets WHO standards.';
    } else if (finalScore >= 60) {
      newRiskLevel = 'moderate';
      newWaterStatus = '⚠️ TREATMENT RECOMMENDED';
      newRecommendedAction = 'Boil or filter before consumption. Test regularly.';
    } else if (finalScore >= 40) {
      newRiskLevel = 'high';
      newWaterStatus = '❌ UNSAFE FOR DRINKING';
      newRecommendedAction = 'Advanced treatment required. Do not consume.';
    } else {
      newRiskLevel = 'critical';
      newWaterStatus = '☠️ HAZARDOUS - DO NOT USE';
      newRecommendedAction = 'Extreme contamination. Notify authorities. Avoid contact.';
    }

    // Update all states
    setWaterQualityIndex(finalScore);
    setRiskLevel(newRiskLevel);
    setWaterStatus(newWaterStatus);
    setRecommendedAction(newRecommendedAction);
    setContaminationSources(sources);

    // Add to test results if experiment is active
    if (experimentActive) {
      setTestResults(prev => [
        {
          id: prev.length + 1,
          timestamp: new Date().toLocaleTimeString(),
          wqi: finalScore,
          status: newWaterStatus,
          issues: issues.length
        },
        ...prev
      ].slice(0, 5));
    }

    // Add lab notes
    if (issues.length > 0) {
      setLabNotes(prev => {
        const newNotes = [`⚠️ ${issues[0]}`, ...prev].slice(0, 3);
        return newNotes;
      });
    }
  }, [manualPh, manualTurbidity, manualDo, manualTds, manualNitrates, manualHeavyMetals, manualMode, experimentActive]);

  // Auto mode analysis - call when sensorData changes in auto mode
  useEffect(() => {
    if (!manualMode && experimentActive) {
      analyzeWaterQuality();
    }
  }, [sensorData, manualMode, experimentActive]);

  const analyzeWaterQuality = () => {
    if (manualMode) return; // Skip if in manual mode
    
    // Use auto data
    const data = sensorData;

    let score = 100;
    const issues = [];
    const sources = [];

    // pH analysis
    if (data.ph < 6.5) {
      score -= 15;
      issues.push(`pH too low (${data.ph.toFixed(1)}) - Acidic water`);
      sources.push('Acidic: Industrial discharge, acid rain');
    } else if (data.ph > 8.5) {
      score -= 15;
      issues.push(`pH too high (${data.ph.toFixed(1)}) - Alkaline water`);
      sources.push('Alkaline: Mineral deposits, wastewater');
    }

    // Turbidity analysis
    if (data.turbidity > 5) {
      score -= 20;
      issues.push(`High turbidity (${data.turbidity.toFixed(1)} NTU) - Suspended particles`);
      sources.push('Turbidity: Soil erosion, urban runoff');
    } else if (data.turbidity > 3) {
      score -= 10;
      issues.push(`Moderate turbidity - Monitor closely`);
    }

    // Dissolved Oxygen analysis
    if (data.dissolvedOxygen < 4) {
      score -= 25;
      issues.push(`Critical low DO (${data.dissolvedOxygen.toFixed(1)} mg/L) - Severe pollution`);
      sources.push('Low DO: Organic waste, sewage, thermal pollution');
    } else if (data.dissolvedOxygen < 6) {
      score -= 15;
      issues.push(`Low DO (${data.dissolvedOxygen.toFixed(1)} mg/L) - Pollution indicator`);
    }

    // TDS analysis
    if (data.tds > 900) {
      score -= 20;
      issues.push(`Very high TDS (${data.tds} ppm) - Excessive minerals`);
      sources.push('High TDS: Industrial waste, saline intrusion');
    } else if (data.tds > 600) {
      score -= 10;
      issues.push(`High TDS (${data.tds} ppm) - Exceeds WHO limit`);
    }

    // Nitrates analysis
    if (data.nitrates > 50) {
      score -= 25;
      issues.push(`Dangerous nitrates (${data.nitrates.toFixed(1)} mg/L) - Agricultural runoff`);
      sources.push('Nitrates: Fertilizers, livestock waste');
    } else if (data.nitrates > 30) {
      score -= 15;
      issues.push(`High nitrates (${data.nitrates.toFixed(1)} mg/L) - Monitor`);
    }

    // Heavy metals analysis
    if (data.heavyMetals > 0.1) {
      score -= 30;
      issues.push(`CRITICAL: Heavy metal contamination (${(data.heavyMetals*1000).toFixed(0)} ppb)`);
      sources.push('Heavy Metals: Industrial discharge, mining');
    } else if (data.heavyMetals > 0.05) {
      score -= 20;
      issues.push(`Heavy metals detected above safe limit`);
    }

    const finalScore = Math.max(0, Math.min(100, score));
    setWaterQualityIndex(finalScore);
    setContaminationSources(sources);

    // Determine risk level and status
    if (finalScore >= 80) {
      setRiskLevel('low');
      setWaterStatus('✅ SAFE FOR DRINKING');
      setRecommendedAction('No treatment required. Water meets WHO standards.');
    } else if (finalScore >= 60) {
      setRiskLevel('moderate');
      setWaterStatus('⚠️ TREATMENT RECOMMENDED');
      setRecommendedAction('Boil or filter before consumption. Test regularly.');
    } else if (finalScore >= 40) {
      setRiskLevel('high');
      setWaterStatus('❌ UNSAFE FOR DRINKING');
      setRecommendedAction('Advanced treatment required. Do not consume.');
    } else {
      setRiskLevel('critical');
      setWaterStatus('☠️ HAZARDOUS - DO NOT USE');
      setRecommendedAction('Extreme contamination. Notify authorities. Avoid contact.');
    }

    // Determine status for test results
    const currentStatus = finalScore >= 80 ? '✅ SAFE FOR DRINKING' : 
                          finalScore >= 60 ? '⚠️ TREATMENT RECOMMENDED' : 
                          finalScore >= 40 ? '❌ UNSAFE FOR DRINKING' : 
                          '☠️ HAZARDOUS - DO NOT USE';

    // Add to test results
    if (experimentActive) {
      setTestResults(prev => [
        {
          id: prev.length + 1,
          timestamp: new Date().toLocaleTimeString(),
          wqi: finalScore,
          status: currentStatus,
          issues: issues.length
        },
        ...prev
      ].slice(0, 5));
    }

    // Add lab notes
    if (issues.length > 0) {
      setLabNotes(prev => [
        `⚠️ ${issues[0]}`,
        ...prev
      ].slice(0, 3));
    }
  };

  // ==================== CHART DATA ====================
  const getCurrentData = () => manualMode ? {
    ph: manualPh,
    turbidity: manualTurbidity,
    dissolvedOxygen: manualDo,
    tds: manualTds,
    nitrates: manualNitrates,
    heavyMetals: manualHeavyMetals
  } : sensorData;

  const currentData = getCurrentData();

  const parameterChartData = {
    labels: ['pH', 'Turbidity', 'DO', 'TDS', 'Nitrates', 'Heavy Metals'],
    datasets: [
      {
        label: 'Current Value (% of limit)',
        data: [
          (currentData.ph / 14) * 100,
          (currentData.turbidity / 10) * 100,
          (currentData.dissolvedOxygen / 12) * 100,
          (currentData.tds / 1000) * 100,
          (currentData.nitrates / 100) * 100,
          (currentData.heavyMetals / 0.5) * 100
        ],
        backgroundColor: [
          '#3b82f6',
          '#f97316',
          '#10b981',
          '#8b5cf6',
          '#f59e0b',
          '#ef4444'
        ],
        borderRadius: 8
      }
    ]
  };

  const whoComparisonData = {
    labels: ['pH', 'Turbidity', 'DO', 'TDS', 'Nitrates', 'Heavy Metals'],
    datasets: [
      {
        label: 'Current Value',
        data: [
          currentData.ph,
          currentData.turbidity,
          currentData.dissolvedOxygen,
          currentData.tds / 100,
          currentData.nitrates / 10,
          currentData.heavyMetals * 100
        ],
        backgroundColor: '#3b82f6',
        borderRadius: 8
      },
      {
        label: 'WHO Limit',
        data: [8.5, 5, 6, 6, 5, 5],
        backgroundColor: '#ef4444',
        borderRadius: 8
      }
    ]
  };

  const pieChartData = {
    labels: ['Safe Parameters', 'Turbidity', 'Nitrates', 'Heavy Metals'],
    datasets: [
      {
        data: [
          100 - (currentData.turbidity * 2 + currentData.nitrates + currentData.heavyMetals * 100),
          currentData.turbidity * 2,
          currentData.nitrates,
          currentData.heavyMetals * 100
        ].map(v => Math.max(0, Math.min(100, v))),
        backgroundColor: ['#10b981', '#f97316', '#f59e0b', '#ef4444'],
        borderWidth: 0
      }
    ]
  };

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,0,0,0.05)' } }
  }
};

const barOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' }
  }
};

  // ==================== MANUAL CONTROL HANDLERS ====================
  const runTest = () => {
    setExperimentActive(true);
    setLabNotes(['🔬 Test initiated - Analyzing water sample...']);
  };

  const resetExperiment = () => {
    setManualPh(7.0);
    setManualTurbidity(2.0);
    setManualDo(7.5);
    setManualTds(300);
    setManualNitrates(10);
    setManualHeavyMetals(0.02);
    setTestResults([]);
    setLabNotes(['🧪 Experiment reset. Ready for new test.']);
  };

  const recordResult = () => {
    setLabNotes([
      `📊 Test recorded: WQI = ${waterQualityIndex} - ${waterStatus}`,
      ...labNotes
    ].slice(0, 5));
  };

  return (
    <div className="container">
      {/* Header with Tutorial Toggle */}
      <div className="header">
        <h1>🧪 Water Quality Analysis Laboratory</h1>
        <div className="header-controls">
          <button 
            className="tutorial-btn"
            onClick={() => setShowTutorial(!showTutorial)}
          >
            {showTutorial ? '📘 Hide Guide' : '📘 Show Guide'}
          </button>
          <button 
            className={`mode-btn ${manualMode ? 'active' : ''}`}
            onClick={() => setManualMode(!manualMode)}
          >
            {manualMode ? '🎮 Manual Mode' : '🤖 Auto Mode'}
          </button>
        </div>
      </div>

      {/* Tutorial Panel */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div 
            className="tutorial-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <h2>📋 How to Use This Lab</h2>
            <div className="tutorial-steps">
              <div className="tutorial-step">
                <span className="step-num">1</span>
                <span>Select <strong>Auto Mode</strong> for real-time simulation or <strong>Manual Mode</strong> to control parameters</span>
              </div>
              <div className="tutorial-step">
                <span className="step-num">2</span>
                <span>Click through each <strong>Experiment Step</strong> to learn the procedure</span>
              </div>
              <div className="tutorial-step">
                <span className="step-num">3</span>
                <span>In Manual Mode, use sliders to adjust water parameters</span>
              </div>
              <div className="tutorial-step">
                <span className="step-num">4</span>
                <span>Click <strong>Run Test</strong> to analyze current water quality</span>
              </div>
              <div className="tutorial-step">
                <span className="step-num">5</span>
                <span>View <strong>Charts</strong> to see parameter comparison with WHO standards</span>
              </div>
              <div className="tutorial-step">
                <span className="step-num">6</span>
                <span>Check <strong>AI Analysis</strong> for recommendations and contamination sources</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Experiment Progress */}
      <div className="progress-bar">
        <div className="progress-steps">
          {experimentSteps.map((s, i) => (
            <div 
              key={s.id}
              className={`progress-step ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}
              onClick={() => setStep(s.id)}
            >
              <span className="step-icon">{s.icon}</span>
              <span className="step-label">{s.id}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="main-grid">
        {/* Left Column - Experiment Steps & Controls */}
        <div className="left-col">
          {/* Current Step Details */}
          <div className="card step-card">
            <h2>Step {step}: {experimentSteps[step-1].title}</h2>
            <p className="step-description">{experimentSteps[step-1].description}</p>
            <div className="step-controls">
              <button 
                className="action-btn"
                onClick={() => {
                  setLabNotes([`✅ ${experimentSteps[step-1].action} completed`, ...labNotes].slice(0, 5));
                  if (step < 8) setStep(step + 1);
                }}
              >
                {experimentSteps[step-1].action}
              </button>
            </div>
          </div>

          {/* Manual Controls (visible only in manual mode) */}
          {manualMode && (
            <div className="card manual-card">
              <h2>🎮 Manual Parameter Control</h2>
              <p>Adjust sliders to simulate different water conditions</p>
              
              <div className="slider-group">
                <label>pH Level: {manualPh.toFixed(1)}</label>
                <input 
                  type="range" 
                  min="0" 
                  max="14" 
                  step="0.1"
                  value={manualPh}
                  onChange={(e) => setManualPh(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>Acidic (0)</span>
                  <span>Neutral (7)</span>
                  <span>Alkaline (14)</span>
                </div>
              </div>

              <div className="slider-group">
                <label>Turbidity: {manualTurbidity.toFixed(1)} NTU</label>
                <input 
                  type="range" 
                  min="0" 
                  max="15" 
                  step="0.1"
                  value={manualTurbidity}
                  onChange={(e) => setManualTurbidity(parseFloat(e.target.value))}
                  className="slider"
                />
              </div>

              <div className="slider-group">
                <label>Dissolved Oxygen: {manualDo.toFixed(1)} mg/L</label>
                <input 
                  type="range" 
                  min="0" 
                  max="12" 
                  step="0.1"
                  value={manualDo}
                  onChange={(e) => setManualDo(parseFloat(e.target.value))}
                  className="slider"
                />
              </div>

              <div className="slider-group">
                <label>TDS: {manualTds} ppm</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1200" 
                  step="10"
                  value={manualTds}
                  onChange={(e) => setManualTds(parseInt(e.target.value))}
                  className="slider"
                />
              </div>

              <div className="slider-group">
                <label>Nitrates: {manualNitrates.toFixed(1)} mg/L</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="0.5"
                  value={manualNitrates}
                  onChange={(e) => setManualNitrates(parseFloat(e.target.value))}
                  className="slider"
                />
              </div>

              <div className="slider-group">
                <label>Heavy Metals: {(manualHeavyMetals*1000).toFixed(0)} ppb</label>
                <input 
                  type="range" 
                  min="0" 
                  max="0.5" 
                  step="0.01"
                  value={manualHeavyMetals}
                  onChange={(e) => setManualHeavyMetals(parseFloat(e.target.value))}
                  className="slider"
                />
              </div>
            </div>
          )}

          {/* Experiment Controls */}
          <div className="card controls-card">
            <h2>🔬 Experiment Controls</h2>
            <div className="button-grid">
              <button 
                className="control-btn primary"
                onClick={runTest}
              >
                ▶ Run Test
              </button>
              <button 
                className="control-btn secondary"
                onClick={recordResult}
              >
                📝 Record Result
              </button>
              <button 
                className="control-btn reset"
                onClick={resetExperiment}
              >
                ↻ Reset
              </button>
            </div>
          </div>

          {/* Lab Notes */}
          <div className="card notes-card">
            <h2>📓 Lab Notebook</h2>
            <div className="notes-list">
              {labNotes.map((note, i) => (
                <div key={i} className="note-item">{note}</div>
              ))}
              {labNotes.length === 0 && (
                <div className="note-empty">No notes yet. Start the experiment!</div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column - Measurements & Charts */}
        <div className="middle-col">
          {/* Current Measurements */}
          <div className="card measurements-card">
            <h2>📊 Current Water Parameters</h2>
            <div className="measurements-grid">
              <div className="measurement-item">
                <span className="measurement-label">pH</span>
                <span className="measurement-value" style={{ color: currentData.ph < 6.5 || currentData.ph > 8.5 ? '#ef4444' : '#10b981' }}>
                  {currentData.ph.toFixed(1)}
                </span>
                <span className="measurement-unit">(6.5-8.5)</span>
              </div>
              <div className="measurement-item">
                <span className="measurement-label">Turbidity</span>
                <span className="measurement-value" style={{ color: currentData.turbidity > 5 ? '#ef4444' : '#10b981' }}>
                  {currentData.turbidity.toFixed(1)}
                </span>
                <span className="measurement-unit">NTU</span>
              </div>
              <div className="measurement-item">
                <span className="measurement-label">DO</span>
                <span className="measurement-value" style={{ color: currentData.dissolvedOxygen < 6 ? '#ef4444' : '#10b981' }}>
                  {currentData.dissolvedOxygen.toFixed(1)}
                </span>
                <span className="measurement-unit">mg/L</span>
              </div>
              <div className="measurement-item">
                <span className="measurement-label">TDS</span>
                <span className="measurement-value" style={{ color: currentData.tds > 600 ? '#ef4444' : '#10b981' }}>
                  {currentData.tds}
                </span>
                <span className="measurement-unit">ppm</span>
              </div>
              <div className="measurement-item">
                <span className="measurement-label">Nitrates</span>
                <span className="measurement-value" style={{ color: currentData.nitrates > 50 ? '#ef4444' : '#10b981' }}>
                  {currentData.nitrates.toFixed(1)}
                </span>
                <span className="measurement-unit">mg/L</span>
              </div>
              <div className="measurement-item">
                <span className="measurement-label">Heavy Metals</span>
                <span className="measurement-value" style={{ color: currentData.heavyMetals > 0.05 ? '#ef4444' : '#10b981' }}>
                  {(currentData.heavyMetals*1000).toFixed(0)} ppb
                </span>
              </div>
            </div>
          </div>

          {/* Parameter Chart */}
          <div className="card chart-card">
            <h2>📈 Parameter Distribution</h2>
            <div className="chart-container">
              <Bar data={parameterChartData} options={chartOptions} />
            </div>
          </div>

          {/* WHO Comparison Chart */}
          <div className="card chart-card">
            <h2>📊 WHO Standards Comparison</h2>
            <div className="chart-container">
              <Bar data={whoComparisonData} options={barOptions} />
            </div>
          </div>

          {/* Contamination Pie Chart */}
          <div className="card chart-card">
            <h2>🥧 Contamination Sources</h2>
            <div className="chart-container pie">
              <Pie 
                data={pieChartData} 
                options={{ 
                  plugins: { 
                    legend: { position: 'bottom' },
                    tooltip: { enabled: true }
                  },
                  maintainAspectRatio: true,
                  responsive: true
                }} 
              />
            </div>
          </div>
        </div>

        {/* Right Column - Analysis & Results */}
        <div className="right-col">
          {/* Water Quality Index */}
          <div className="card wqi-card">
            <h2>💧 Water Quality Index</h2>
            <div className="wqi-meter">
              <svg viewBox="0 0 200 100">
                <path
                  d="M20,80 Q100,10 180,80"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="15"
                />
                <motion.path
                  d="M20,80 Q100,10 180,80"
                  fill="none"
                  stroke={waterQualityIndex > 80 ? '#10b981' : waterQualityIndex > 60 ? '#f97316' : waterQualityIndex > 40 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="15"
                  strokeDasharray="300"
                  initial={{ strokeDashoffset: 300 }}
                  animate={{ strokeDashoffset: 300 - (300 * waterQualityIndex / 100) }}
                  transition={{ duration: 1 }}
                />
                <text x="100" y="40" textAnchor="middle" fill="#0f172a" fontSize="24" fontWeight="bold">
                  {waterQualityIndex}
                </text>
              </svg>
            </div>
            <div className={`wqi-status ${riskLevel}`}>
              {waterStatus}
            </div>
          </div>

          {/* AI Analysis Card */}
          <div className="card ai-card">
            <h2>🤖 AI Water Analysis</h2>
            <div className="ai-content">
              <div className="ai-risk">
                <span className="risk-label">Risk Level:</span>
                <span className={`risk-value ${riskLevel}`}>{riskLevel.toUpperCase()}</span>
              </div>
              <div className="ai-recommendation">
                <strong>Recommendation:</strong> {recommendedAction}
              </div>
              {contaminationSources.length > 0 && (
                <div className="ai-sources">
                  <strong>Possible Sources:</strong>
                  <ul>
                    {contaminationSources.map((src, i) => (
                      <li key={i}>{src}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Parameter Information */}
          <div className="card info-card">
            <h2>🔍 Parameter Details</h2>
            <div className="parameter-selector">
              {Object.keys(parameterInfo).map(key => (
                <button
                  key={key}
                  className={`param-btn ${selectedParameter === key ? 'active' : ''}`}
                  onClick={() => setSelectedParameter(key)}
                >
                  {parameterInfo[key].icon} {parameterInfo[key].name}
                </button>
              ))}
            </div>
            {selectedParameter && (
              <div className="parameter-details">
                <h3>{parameterInfo[selectedParameter].name}</h3>
                <p><strong>Description:</strong> {parameterInfo[selectedParameter].description}</p>
                <p><strong>Health Impact:</strong> {parameterInfo[selectedParameter].healthImpact}</p>
                <p><strong>Treatment:</strong> {parameterInfo[selectedParameter].treatment}</p>
              </div>
            )}
          </div>

          {/* Test Results History */}
          <div className="card history-card">
            <h2>📋 Recent Test Results</h2>
            <div className="history-list">
              {testResults.map((result) => (
                <div key={result.id} className="history-item">
                  <span className="history-time">{result.timestamp}</span>
                  <span className="history-wqi">WQI: {result.wqi}</span>
                  <span className={`history-status ${result.wqi > 80 ? 'safe' : result.wqi > 60 ? 'moderate' : 'unsafe'}`}>
                    {result.wqi > 80 ? '✅' : result.wqi > 60 ? '⚠️' : '❌'}
                  </span>
                </div>
              ))}
              {testResults.length === 0 && (
                <div className="history-empty">No tests recorded yet</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          padding: 1.5rem;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .header {
          max-width: 1400px;
          margin: 0 auto 1.5rem auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header h1 {
          color: #0f172a;
          font-size: 2rem;
          margin: 0;
        }

        .header-controls {
          display: flex;
          gap: 1rem;
        }

        .tutorial-btn, .mode-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tutorial-btn {
          background: #3b82f6;
          color: white;
        }

        .mode-btn {
          background: #8b5cf6;
          color: white;
        }

        .mode-btn.active {
          background: #10b981;
        }

        .tutorial-panel {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          max-width: 1400px;
          margin: 0 auto 1.5rem auto;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .tutorial-panel h2 {
          color: #0f172a;
          margin: 0 0 1rem 0;
        }

        .tutorial-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .tutorial-step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 0.5rem;
        }

        .step-num {
          width: 24px;
          height: 24px;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.8rem;
        }

        .progress-bar {
          max-width: 1400px;
          margin: 0 auto 2rem auto;
          background: white;
          border-radius: 3rem;
          padding: 0.5rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .progress-steps {
          display: flex;
          justify-content: space-between;
        }

        .progress-step {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 0.8rem;
          border-radius: 2rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .progress-step.active {
          background: #3b82f6;
          color: white;
        }

        .progress-step.completed {
          background: #10b981;
          color: white;
        }

        .step-icon {
          font-size: 1rem;
        }

        .step-label {
          font-weight: 600;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 350px 1fr 350px;
          gap: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .card {
          background: white;
          border-radius: 1.5rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .card h2 {
          color: #0f172a;
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
        }

        .step-card {
          background: linear-gradient(135deg, #f8fafc, white);
        }

        .step-description {
          color: #475569;
          margin-bottom: 1rem;
        }

        .action-btn {
          width: 100%;
          padding: 0.8rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }

        .manual-card {
          background: linear-gradient(135deg, #fef3c7, #fffbeb);
        }

        .slider-group {
          margin-bottom: 1.5rem;
        }

        .slider-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.3rem;
        }

        .slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #e2e8f0;
          outline: none;
        }

        .slider-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: #64748b;
          margin-top: 0.3rem;
        }

        .button-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }

        .control-btn {
          padding: 0.8rem;
          border: none;
          border-radius: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }

        .control-btn.primary {
          background: #3b82f6;
          color: white;
        }

        .control-btn.secondary {
          background: #8b5cf6;
          color: white;
        }

        .control-btn.reset {
          background: #64748b;
          color: white;
        }

        .notes-list {
          max-height: 150px;
          overflow-y: auto;
        }

        .note-item {
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 0.5rem;
          margin-bottom: 0.3rem;
          font-size: 0.9rem;
        }

        .note-empty {
          color: #94a3b8;
          font-style: italic;
        }

        .measurements-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .measurement-item {
          text-align: center;
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 0.8rem;
        }

        .measurement-label {
          display: block;
          font-size: 0.8rem;
          color: #64748b;
        }

        .measurement-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .measurement-unit {
          font-size: 0.7rem;
          color: #94a3b8;
        }

        .chart-container {
          height: 200px;
        }

        .chart-container.small {
          height: 150px;
        }

        .chart-container.pie {
          height: 200px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wqi-card {
          text-align: center;
        }

        .wqi-meter svg {
          width: 100%;
          height: 100px;
        }

        .wqi-status {
          font-size: 1.2rem;
          font-weight: 700;
          margin-top: 1rem;
        }

        .wqi-status.low { color: #10b981; }
        .wqi-status.moderate { color: #f97316; }
        .wqi-status.high { color: #ef4444; }
        .wqi-status.critical { color: #7f1d1d; }

        .ai-card {
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: white;
        }

        .ai-risk {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .risk-value {
          font-weight: 700;
        }

        .risk-value.low { color: #10b981; }
        .risk-value.moderate { color: #f97316; }
        .risk-value.high { color: #ef4444; }
        .risk-value.critical { color: #7f1d1d; }

        .ai-recommendation, .ai-sources {
          background: rgba(255,255,255,0.1);
          padding: 1rem;
          border-radius: 0.8rem;
          margin-bottom: 1rem;
        }

        .ai-sources ul {
          margin: 0.5rem 0 0 0;
          padding-left: 1.2rem;
        }

        .parameter-selector {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.3rem;
          margin-bottom: 1rem;
        }

        .param-btn {
          padding: 0.3rem;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .param-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .parameter-details {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 0.8rem;
        }

        .parameter-details h3 {
          margin: 0 0 0.5rem 0;
        }

        .parameter-details p {
          margin: 0.3rem 0;
          font-size: 0.9rem;
        }

        .history-list {
          max-height: 150px;
          overflow-y: auto;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .history-time {
          font-size: 0.8rem;
          color: #64748b;
        }

        .history-wqi {
          font-weight: 600;
        }

        .history-status.safe { color: #10b981; }
        .history-status.moderate { color: #f97316; }
        .history-status.unsafe { color: #ef4444; }

        .history-empty {
          color: #94a3b8;
          font-style: italic;
        }

        @media (max-width: 1200px) {
          .main-grid {
            grid-template-columns: 1fr;
          }
          
          .tutorial-steps {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}