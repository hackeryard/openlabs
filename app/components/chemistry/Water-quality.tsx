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
import {
  Droplets,
  Settings,
  Activity,
  Eye,
  Waves,
  Beaker,
  FileText,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Skull,
  Play,
  RotateCcw,
  BookOpen,
  Sliders,
  Info,
  ClipboardList
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
type ParameterKey = 'ph' | 'turbidity' | 'dissolvedOxygen' | 'tds' | 'nitrates' | 'heavyMetals';

interface TestResult {
  id: number;
  timestamp: string;
  wqi: number;
  status: string;
  issues: number;
}

interface ExperimentStep {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  action: string;
}

interface ParameterInfo {
  name: string;
  description: string;
  healthImpact: string;
  treatment: string;
  icon: LucideIcon;
  color: string;
}

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

export default function WaterQualityLab({ onComplete }: { onComplete?: () => void }) {
  // ==================== STATE MANAGEMENT ====================
  const [step, setStep] = useState(1);
  const [showTutorial, setShowTutorial] = useState(true);
  const [selectedParameter, setSelectedParameter] = useState<ParameterKey>('ph');
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
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('low');
  const [waterStatus, setWaterStatus] = useState('Safe for Drinking');
  const [recommendedAction, setRecommendedAction] = useState('No treatment needed');
  const [contaminationSources, setContaminationSources] = useState<string[]>([]);
  const [labNotes, setLabNotes] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  // ==================== EXPERIMENT PROCEDURE STEPS ====================
  const experimentSteps: ExperimentStep[] = [
    {
      id: 1,
      title: "Sample Collection",
      description: "Collect water sample from source using sterile container. Label with location, date, and time.",
      icon: Droplets,
      action: "Collect Sample"
    },
    {
      id: 2,
      title: "Sensor Calibration",
      description: "Calibrate all sensors using standard calibration solutions. Ensure probes are clean.",
      icon: Settings,
      action: "Calibrate Sensors"
    },
    {
      id: 3,
      title: "pH Measurement",
      description: "Immerse pH probe in sample. Wait for reading to stabilize. Record value.",
      icon: Activity,
      action: "Measure pH"
    },
    {
      id: 4,
      title: "Turbidity Test",
      description: "Fill turbidity tube. Compare with standard or use turbidity meter.",
      icon: Eye,
      action: "Check Turbidity"
    },
    {
      id: 5,
      title: "Dissolved Oxygen",
      description: "Use DO meter with stirring. Ensure probe membrane is clean.",
      icon: Waves,
      action: "Measure DO"
    },
    {
      id: 6,
      title: "TDS & Chemical Analysis",
      description: "Measure TDS with conductivity meter. Test for nitrates and heavy metals.",
      icon: Beaker,
      action: "Run Analysis"
    },
    {
      id: 7,
      title: "Data Recording",
      description: "Record all readings in lab notebook. Compare with WHO standards.",
      icon: FileText,
      action: "Record Data"
    },
    {
      id: 8,
      title: "AI Analysis",
      description: "Run AI algorithm to calculate Water Quality Index and get recommendations.",
      icon: Cpu,
      action: "Analyze Results"
    }
  ];

  // ==================== WATER PARAMETER INFO ====================
  const parameterInfo: Record<ParameterKey, ParameterInfo> = {
    ph: {
      name: "pH Level",
      description: "Measures acidity/alkalinity. Low pH = acidic, High pH = alkaline.",
      healthImpact: "Extreme pH can cause metal leaching, skin irritation, and affects taste.",
      treatment: "Acidic: Add alkali (lime). Alkaline: Add acid (citric).",
      icon: Activity,
      color: "#3b82f6"
    },
    turbidity: {
      name: "Turbidity",
      description: "Measures water clarity. Caused by suspended particles.",
      healthImpact: "High turbidity protects pathogens, reduces disinfection efficiency.",
      treatment: "Filtration, sedimentation, coagulation.",
      icon: Eye,
      color: "#f97316"
    },
    dissolvedOxygen: {
      name: "Dissolved Oxygen",
      description: "Oxygen dissolved in water. Essential for aquatic life.",
      healthImpact: "Low DO indicates pollution, causes fish kills, bad odors.",
      treatment: "Aeration, reduce organic pollution.",
      icon: Waves,
      color: "#10b981"
    },
    tds: {
      name: "Total Dissolved Solids",
      description: "Dissolved minerals and salts.",
      healthImpact: "High TDS affects taste, causes scaling, may indicate contamination.",
      treatment: "Reverse osmosis, distillation, deionization.",
      icon: Beaker,
      color: "#8b5cf6"
    },
    nitrates: {
      name: "Nitrates",
      description: "From fertilizers, sewage, industrial waste.",
      healthImpact: "Causes methemoglobinemia (blue baby syndrome), cancer risk.",
      treatment: "Ion exchange, reverse osmosis, biological denitrification.",
      icon: AlertTriangle,
      color: "#f59e0b"
    },
    heavyMetals: {
      name: "Heavy Metals",
      description: "Lead, mercury, arsenic, cadmium from industry.",
      healthImpact: "Toxic to nervous system, causes organ damage, cancer.",
      treatment: "Precipitation, adsorption, ion exchange, reverse osmosis.",
      icon: Skull,
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
    const issues: string[] = [];
    const sources: string[] = [];

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
    let newRiskLevel: RiskLevel = 'low';
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
    const issues: string[] = [];
    const sources: string[] = [];

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
        <div className="header-text-block">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Control Deck</span>
          </div>
          <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">Configure active parameter overrides and calibrate sensor arrays</p>
        </div>
        <div className="header-controls">
          <button 
            className="tutorial-btn flex items-center gap-1.5"
            onClick={() => setShowTutorial(!showTutorial)}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {showTutorial ? 'Hide Lab Manual' : 'Open Lab Manual'}
          </button>
          <button 
            className={`mode-btn flex items-center gap-1.5 ${manualMode ? 'active' : ''}`}
            onClick={() => setManualMode(!manualMode)}
          >
            {manualMode ? <Sliders className="w-3.5 h-3.5 text-teal-600" /> : <Settings className="w-3.5 h-3.5 animate-spin [animation-duration:10s]" />}
            {manualMode ? 'Manual Calibrator Active' : 'Spectrophotometer Auto Mode'}
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
            <h2 className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              How to Use This Lab
            </h2>
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
          {experimentSteps.map((s, i) => {
            const IconComp = s.icon;
            return (
              <div 
                key={s.id}
                className={`progress-step ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}
                onClick={() => setStep(s.id)}
              >
                <IconComp className="w-3.5 h-3.5 shrink-0" />
                <span className="step-label">{s.id}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid */}
      <div className="main-grid">
        {/* Left Column - Experiment Steps & Controls */}
        <div className="left-col">
          {/* Current Step Details */}
          <div className="card step-card">
            <h2 className="flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-teal-600" />
              Step {step}: {experimentSteps[step-1].title}
            </h2>
            <p className="step-description">{experimentSteps[step-1].description}</p>
            <div className="step-controls">
              <button 
                className="action-btn flex items-center justify-center gap-1.5"
                onClick={() => {
                  setLabNotes([`✅ ${experimentSteps[step-1].action} completed`, ...labNotes].slice(0, 5));
                  if (step < 8) {
                    setStep(step + 1);
                  } else {
                    if (onComplete) onComplete();
                  }
                }}
              >
                {experimentSteps[step-1].action}
              </button>
            </div>
          </div>

          {/* Manual Controls (visible only in manual mode) */}
          {manualMode ? (
            <div className="card manual-card">
              <h2 className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-500 animate-pulse" />
                Manual Parameter Control
              </h2>
              <p className="step-description">Adjust sliders to simulate different water conditions</p>
              
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
          ) : (
            /* Covered Space dynamically: Diagnostics Card */
            <div className="card bg-gradient-to-b from-teal-50/50 to-white border-teal-200/50">
              <h2 className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-teal-600 animate-pulse" />
                Sensor Calibration
              </h2>
              <p className="step-description">Active spectroscopic telemetry diagnostics and automatic system status</p>
              <div className="space-y-3 text-xs font-semibold">
                <div className="flex justify-between items-center bg-muted border border-border p-2.5 rounded-xl">
                  <span className="text-muted-foreground uppercase text-[9.5px] tracking-wider font-black">Optics Calibrator</span>
                  <span className="text-foreground font-mono">540nm Green Laser</span>
                </div>
                <div className="flex justify-between items-center bg-muted border border-border p-2.5 rounded-xl">
                  <span className="text-muted-foreground uppercase text-[9.5px] tracking-wider font-black">Absorption Coeff</span>
                  <span className="text-foreground font-mono">0.125 OD/cm</span>
                </div>
                <div className="flex justify-between items-center bg-muted border border-border p-2.5 rounded-xl">
                  <span className="text-muted-foreground uppercase text-[9.5px] tracking-wider font-black">System Signal</span>
                  <span className="text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200/50 animate-pulse">OPTIMIZED</span>
                </div>
              </div>
            </div>
          )}

          {/* Experiment Controls */}
          <div className="card controls-card">
            <h2 className="flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-muted-foreground" />
              Experiment Controls
            </h2>
            <div className="button-grid">
              <button 
                className="control-btn primary flex items-center justify-center gap-1"
                onClick={runTest}
              >
                <Play className="w-3 h-3 fill-white" />
                Run Test
              </button>
              <button 
                className="control-btn secondary flex items-center justify-center gap-1"
                onClick={recordResult}
              >
                <FileText className="w-3 h-3" />
                Record
              </button>
              <button 
                className="control-btn reset flex items-center justify-center gap-1"
                onClick={resetExperiment}
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
          </div>

          {/* Lab Notes */}
          <div className="card notes-card">
            <h2 className="flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-indigo-500" />
              Lab Notebook
            </h2>
            <div className="notes-list">
              {labNotes.map((note, i) => (
                <div key={i} className="note-item flex items-start gap-1.5">
                  {note.startsWith('✅') ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /> :
                   note.startsWith('⚠️') ? <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" /> :
                   note.startsWith('🔬') ? <Activity className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" /> :
                   note.startsWith('📊') ? <ClipboardList className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" /> :
                   <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />}
                  <span>{note.replace(/^[^\w\s]+/, '').trim()}</span>
                </div>
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
            <h2><Activity className="inline w-4 h-4 mr-1.5 text-teal-600 animate-pulse" /> Current Water Parameters</h2>
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
            <h2><Sliders className="inline w-4 h-4 mr-1.5 text-indigo-500" /> Parameter Distribution</h2>
            <div className="chart-container">
              <Bar data={parameterChartData} options={chartOptions} />
            </div>
          </div>

          {/* WHO Comparison Chart */}
          <div className="card chart-card">
            <h2><ClipboardList className="inline w-4 h-4 mr-1.5 text-blue-500" /> WHO Standards Comparison</h2>
            <div className="chart-container">
              <Bar data={whoComparisonData} options={barOptions} />
            </div>
          </div>

          {/* Contamination Pie Chart */}
          <div className="card chart-card">
            <h2><Droplets className="inline w-4 h-4 mr-1.5 text-emerald-500" /> Contamination Sources</h2>
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
            <h2><Droplets className="inline w-4 h-4 mr-1.5 text-teal-600" /> Water Quality Index</h2>
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
            <div className={`wqi-status ${riskLevel} flex items-center justify-center gap-1.5`}>
              {riskLevel === 'low' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
               riskLevel === 'moderate' ? <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" /> :
               riskLevel === 'high' ? <XCircle className="w-4 h-4 text-rose-500" /> :
               <Skull className="w-4 h-4 text-rose-800" />}
              {waterStatus.replace(/^[^\w\s]+/, '').trim()}
            </div>
          </div>

          {/* AI Analysis Card */}
          <div className="card ai-card">
            <h2><Cpu className="inline w-4 h-4 mr-1.5 text-indigo-400" /> AI Water Analysis</h2>
            <div className="ai-content">
              <div className="ai-risk">
                <span className="risk-label">Risk Level:</span>
                <span className={`risk-value ${riskLevel}`}>{riskLevel.toUpperCase()}</span>
              </div>
              <div className="ai-recommendation">
                <strong className="rec-title">AI Recommendation:</strong> {recommendedAction}
              </div>
              {contaminationSources.length > 0 && (
                <div className="ai-sources">
                  <strong className="source-title">Possible Sources:</strong>
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
            <h2><Info className="inline w-4 h-4 mr-1.5 text-indigo-600" /> Parameter Details</h2>
            <div className="parameter-selector">
              {(Object.keys(parameterInfo) as ParameterKey[]).map(key => {
                const IconComp = parameterInfo[key].icon;
                return (
                  <button
                    key={key}
                    className={`param-btn flex items-center justify-center gap-1.5 ${selectedParameter === key ? 'active' : ''}`}
                    onClick={() => setSelectedParameter(key)}
                  >
                    <IconComp className="w-3.5 h-3.5 shrink-0" />
                    <span>{parameterInfo[key].name}</span>
                  </button>
                );
              })}
            </div>
            <div className="parameter-details">
              <h3>{parameterInfo[selectedParameter].name}</h3>
              <p><strong>Description:</strong> {parameterInfo[selectedParameter].description}</p>
              <p><strong>Health Impact:</strong> {parameterInfo[selectedParameter].healthImpact}</p>
              <p><strong>Treatment:</strong> {parameterInfo[selectedParameter].treatment}</p>
            </div>
          </div>

          {/* Test Results History */}
          <div className="card history-card">
            <h2><ClipboardList className="inline w-4 h-4 mr-1.5 text-muted-foreground" /> Recent Test Results</h2>
            <div className="history-list">
              {testResults.map((result) => (
                <div key={result.id} className="history-item">
                  <span className="history-time">{result.timestamp}</span>
                  <span className="history-wqi">WQI: {result.wqi}</span>
                  <span className={`history-status ${result.wqi > 80 ? 'safe' : result.wqi > 60 ? 'moderate' : 'unsafe'}`}>
                    {result.wqi > 80 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
                     result.wqi > 60 ? <AlertTriangle className="w-4 h-4 text-amber-500" /> :
                     <XCircle className="w-4 h-4 text-rose-500" />}
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
          padding: 1.5rem 0;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .header {
          max-width: 100%;
          margin: 0 auto 1.5rem auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 1.5rem;
          padding: 1.25rem 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }

        .header-controls {
          display: flex;
          gap: 0.75rem;
        }

        .tutorial-btn, .mode-btn {
          padding: 0.6rem 1.2rem;
          border: none;
          border-radius: 1rem;
          font-weight: 800;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .tutorial-btn {
          background: #e0f2fe;
          color: #0369a1;
          border: 1px solid #bae6fd;
        }
        .tutorial-btn:hover {
          background: #bae6fd;
          transform: translateY(-1px);
        }

        .mode-btn {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
        }
        .mode-btn:hover {
          background: #e2e8f0;
          transform: translateY(-1px);
        }

        .mode-btn.active {
          background: #ccfbf1;
          color: #0d9488;
          border-color: #99f6e4;
        }
        .mode-btn.active:hover {
          background: #99f6e4;
        }

        .tutorial-panel {
          background: white;
          border-radius: 2rem;
          padding: 2rem;
          margin-bottom: 2rem;
          max-width: 1400px;
          margin: 0 auto 2rem auto;
          box-shadow: 0 4px 15px -3px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
        }

        .tutorial-panel h2 {
          color: #0f172a;
          margin: 0 0 1.25rem 0;
          font-size: 1.25rem;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .tutorial-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .tutorial-step {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          font-size: 12px;
          color: #475569;
          font-weight: 550;
          line-height: 1.4;
        }

        .step-num {
          width: 26px;
          height: 26px;
          background: #0d9488;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 0.75rem;
          flex-shrink: 0;
          box-shadow: 0 2px 4px rgba(13,148,136,0.2);
        }

        .progress-bar {
          max-width: 100%;
          margin: 0 auto 2rem auto;
          background: white;
          border-radius: 3rem;
          padding: 0.6rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 10px rgba(0,0,0,0.03);
        }

        .progress-steps {
          display: flex;
          justify-content: space-between;
          gap: 0.5rem;
          overflow-x: auto;
        }

        .progress-step {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1.2rem;
          border-radius: 2rem;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.02em;
          border: 1px solid transparent;
        }

        .progress-step.active {
          background: #0d9488;
          color: white;
          box-shadow: 0 4px 10px rgba(13,148,136,0.2);
        }

        .progress-step.completed {
          background: #ccfbf1;
          color: #0d9488;
          border-color: #99f6e4;
        }

        .step-icon {
          font-size: 1.1rem;
        }

        .step-label {
          font-weight: 800;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 320px 1fr 320px;
          gap: 1.5rem;
          max-width: 100%;
          margin: 0 auto;
        }

        .card {
          background: white;
          border-radius: 2rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card:hover {
          box-shadow: 0 10px 20px rgba(0,0,0,0.06);
          transform: translateY(-1px);
        }

        .card h2 {
          color: #0f172a;
          margin: 0 0 1.25rem 0;
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #475569;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 0.5rem;
        }

        .step-card {
          background: linear-gradient(to bottom, #f0fdfa, white);
          border-color: #ccfbf1;
        }

        .step-description {
          color: #475569;
          margin-bottom: 1.25rem;
          font-size: 12px;
          font-weight: 550;
          line-height: 1.5;
        }

        .action-btn {
          width: 100%;
          padding: 0.9rem;
          background: #0d9488;
          color: white;
          border: none;
          border-radius: 1rem;
          font-weight: 800;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(13,148,136,0.25);
          transition: all 0.2s;
        }
        .action-btn:hover {
          background: #0f766e;
          box-shadow: 0 6px 14px rgba(13,148,136,0.35);
          transform: translateY(-1px);
        }

        .manual-card {
          background: linear-gradient(to bottom, #fefaf0, white);
          border-color: #fee2e2;
        }

        .slider-group {
          margin-bottom: 1.5rem;
        }

        .slider-group label {
          display: block;
          font-weight: 800;
          font-size: 11px;
          color: #334155;
          margin-bottom: 0.5rem;
        }

        .slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #e2e8f0;
          outline: none;
          cursor: pointer;
          accent-color: #0d9488;
        }

        .slider-labels {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          font-weight: 755;
          color: #94a3b8;
          margin-top: 0.4rem;
        }

        .button-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.6rem;
        }

        .control-btn {
          padding: 0.8rem;
          border: none;
          border-radius: 1rem;
          font-weight: 800;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .control-btn.primary {
          background: #0d9488;
          color: white;
          box-shadow: 0 4px 8px rgba(13,148,136,0.25);
        }
        .control-btn.primary:hover {
          background: #0f766e;
          transform: translateY(-1px);
        }

        .control-btn.secondary {
          background: #8b5cf6;
          color: white;
          box-shadow: 0 4px 8px rgba(139,92,246,0.25);
        }
        .control-btn.secondary:hover {
          background: #7c3aed;
          transform: translateY(-1px);
        }

        .control-btn.reset {
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }
        .control-btn.reset:hover {
          background: #e2e8f0;
          transform: translateY(-1px);
        }

        .notes-list {
          max-height: 180px;
          overflow-y: auto;
        }

        .note-item {
          padding: 0.75rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          margin-bottom: 0.5rem;
          font-size: 11px;
          font-weight: 550;
          color: #475569;
          line-height: 1.4;
        }

        .note-empty {
          color: #94a3b8;
          font-style: italic;
          font-size: 11px;
          font-weight: 500;
        }

        .measurements-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .measurement-item {
          text-align: center;
          padding: 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 1.25rem;
        }

        .measurement-label {
          display: block;
          font-size: 9px;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .measurement-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 900;
          font-family: monospace;
          color: #0f172a;
        }

        .measurement-unit {
          font-size: 0.7rem;
          font-weight: 755;
          color: #94a3b8;
        }

        .chart-container {
          height: 200px;
          position: relative;
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
          font-size: 14px;
          font-weight: 900;
          margin-top: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .wqi-status.low { color: #0d9488; }
        .wqi-status.moderate { color: #d97706; }
        .wqi-status.high { color: #dc2626; }
        .wqi-status.critical { color: #7f1d1d; }

        .ai-card {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          border-color: #1e293b;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        .ai-card h2 {
          color: #94a3b8;
          border-bottom-color: rgba(255,255,255,0.05);
        }

        .ai-risk {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          align-items: center;
        }

        .risk-label {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
        }

        .risk-value {
          font-weight: 900;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .risk-value.low { color: #2dd4bf; }
        .risk-value.moderate { color: #fbbf24; }
        .risk-value.high { color: #f87171; }
        .risk-value.critical { color: #ef4444; }

        .ai-recommendation, .ai-sources {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 1rem;
          border-radius: 1rem;
          margin-bottom: 1rem;
          font-size: 11px;
          line-height: 1.5;
        }

        .rec-title, .source-title {
          display: block;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          margin-bottom: 0.4rem;
        }

        .ai-sources ul {
          margin: 0.5rem 0 0 0;
          padding-left: 1.2rem;
        }

        .ai-sources li {
          margin-bottom: 0.3rem;
          font-weight: 550;
        }

        .parameter-selector {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.4rem;
          margin-bottom: 1.25rem;
        }

        .param-btn {
          padding: 0.5rem;
          border: 1px solid #e2e8f0;
          background: white;
          color: #64748b;
          border-radius: 0.75rem;
          cursor: pointer;
          font-size: 11px;
          font-weight: 755;
          transition: all 0.2s;
        }
        .param-btn:hover {
          border-color: #cbd5e1;
          color: #334155;
        }

        .param-btn.active {
          background: #0d9488;
          color: white;
          border-color: #0d9488;
          box-shadow: 0 2px 6px rgba(13,148,136,0.2);
        }

        .parameter-details {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 1.25rem;
          border-radius: 1.25rem;
        }

        .parameter-details h3 {
          margin: 0 0 0.5rem 0;
          font-size: 12px;
          font-weight: 900;
          color: #1e293b;
        }

        .parameter-details p {
          margin: 0.4rem 0;
          font-size: 11px;
          font-weight: 550;
          color: #475569;
          line-height: 1.45;
        }

        .history-list {
          max-height: 180px;
          overflow-y: auto;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0.5rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .history-time {
          font-size: 9px;
          font-weight: 755;
          color: #94a3b8;
        }

        .history-wqi {
          font-weight: 900;
          font-size: 12px;
          font-family: monospace;
          color: #0f172a;
        }

        .history-status.safe { color: #0d9488; }
        .history-status.moderate { color: #d97706; }
        .history-status.unsafe { color: #dc2626; }

        .history-empty {
          color: #94a3b8;
          font-style: italic;
          font-size: 11px;
          font-weight: 500;
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
