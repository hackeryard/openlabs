"use client";

import { useState, useEffect, useRef } from 'react';
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
  Filler,
  BarElement,
  RadialLinearScale,
} from 'chart.js';
import { Line, Bar, Pie, Radar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  RadialLinearScale
);

// Define types
interface BrainRegion {
  active: number;
  color: string;
}

interface BrainRegions {
  prefrontal: BrainRegion;
  motor: BrainRegion;
  sensory: BrainRegion;
  visual: BrainRegion;
  auditory: BrainRegion;
  hippocampus: BrainRegion;
}

interface NeuralData {
  spikes: number[];
  lfp: number[];
  coherence: number[];
  firingRates: number[];
  timeStamps: number[];
}

interface SpikeData {
  time: number;
  amplitude: number;
  region: string;
  neuron: number;
}

interface FrequencyBands {
  delta: number;
  theta: number;
  alpha: number;
  beta: number;
  gamma: number;
}

export default function BrainNeuronSimulator() {
  // ==================== STATE MANAGEMENT ====================
  const [experimentActive, setExperimentActive] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('prefrontal');
  const [stimulusType, setStimulusType] = useState('visual');
  const [neuronActivity, setNeuronActivity] = useState('normal');
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Canvas ref for 2D visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  
  // Neural parameters
  const [parameters, setParameters] = useState({
    firingRate: 45.2,
    membranePotential: -65,
    spikeAmplitude: 100,
    refractoryPeriod: 2,
    synapticStrength: 0.8,
    backgroundNoise: 0.15,
    connectivity: 0.6,
    plasticity: 0.3
  });

  // Real-time neural data
  const [neuralData, setNeuralData] = useState<NeuralData>({
    spikes: [],
    lfp: [],
    coherence: [],
    firingRates: [],
    timeStamps: []
  });

  const [spikeHistory, setSpikeHistory] = useState<SpikeData[]>([]);
  
  const [frequencyBands, setFrequencyBands] = useState<FrequencyBands>({
    delta: 2.4,
    theta: 5.1,
    alpha: 9.8,
    beta: 18.3,
    gamma: 32.7
  });

  const [brainRegions, setBrainRegions] = useState<BrainRegions>({
    prefrontal: { active: 45, color: '#3b82f6' },
    motor: { active: 32, color: '#ef4444' },
    sensory: { active: 38, color: '#10b981' },
    visual: { active: 52, color: '#f59e0b' },
    auditory: { active: 28, color: '#8b5cf6' },
    hippocampus: { active: 41, color: '#ec4899' }
  });

  // ==================== EXPERIMENT AIM ====================
  const experimentAim = {
    title: "🧠 Brain Neuron Signal Analysis",
    objective: "To study neural firing patterns, synaptic transmission, and brain region connectivity in response to various stimuli",
    hypothesis: "Different stimuli types (visual, auditory, tactile) will activate distinct neural pathways with characteristic firing patterns and frequency bands",
    methodology: [
      "Apply controlled stimuli to neural populations",
      "Record extracellular action potentials (spikes)",
      "Analyze local field potentials (LFP)",
      "Calculate spike timing and firing rates",
      "Measure cross-region coherence",
      "Identify frequency band modulation"
    ],
    expectedOutcomes: [
      "Stimulus-specific neural encoding patterns",
      "Region-dependent frequency responses",
      "Synaptic plasticity indicators",
      "Network synchronization metrics"
    ]
  };

  // ==================== EXPERIMENT STEPS ====================
  const experimentSteps = [
    {
      id: 1,
      title: "Electrode Placement",
      description: "Position microelectrode array in target brain region (prefrontal cortex). Check impedance (0.5-2 MΩ).",
      icon: "🔌",
      action: "Place Electrodes"
    },
    {
      id: 2,
      title: "Signal Calibration",
      description: "Calibrate recording system. Set sampling rate (20 kHz). Apply 300-5000 Hz bandpass filter.",
      icon: "⚙️",
      action: "Calibrate"
    },
    {
      id: 3,
      title: "Baseline Recording",
      description: "Record 60 seconds of spontaneous activity. Establish baseline firing rates.",
      icon: "📊",
      action: "Record Baseline"
    },
    {
      id: 4,
      title: "Apply Stimulus",
      description: "Present stimulus (visual/auditory/tactile). Record evoked potentials.",
      icon: "⚡",
      action: "Apply Stimulus"
    },
    {
      id: 5,
      title: "Spike Sorting",
      description: "Isolate single units. Cluster waveforms based on amplitude and shape.",
      icon: "📈",
      action: "Sort Spikes"
    },
    {
      id: 6,
      title: "Frequency Analysis",
      description: "Compute power spectrum. Analyze delta (1-4 Hz), theta (4-8 Hz), alpha (8-13 Hz), beta (13-30 Hz), gamma (30-80 Hz) bands.",
      icon: "📉",
      action: "Analyze Frequencies"
    },
    {
      id: 7,
      title: "Connectivity Analysis",
      description: "Calculate cross-correlation and coherence between regions.",
      icon: "🔗",
      action: "Analyze Connectivity"
    },
    {
      id: 8,
      title: "Data Interpretation",
      description: "Generate neural activity report. Compare with known patterns.",
      icon: "📝",
      action: "Interpret Results"
    }
  ];

  // ==================== BRAIN REGION INFO ====================
  const regionInfo: Record<string, { name: string; function: string; role: string; disorders: string; color: string; icon: string }> = {
    prefrontal: {
      name: "Prefrontal Cortex",
      function: "Decision making, personality, social behavior",
      role: "Executive functions, planning complex behavior",
      disorders: "ADHD, schizophrenia, depression",
      color: "#3b82f6",
      icon: "🧠"
    },
    motor: {
      name: "Motor Cortex",
      function: "Movement execution and planning",
      role: "Voluntary movement control",
      disorders: "Parkinson's, cerebral palsy",
      color: "#ef4444",
      icon: "💪"
    },
    sensory: {
      name: "Somatosensory Cortex",
      function: "Touch, pressure, pain, temperature",
      role: "Sensory processing and integration",
      disorders: "Neuropathy, chronic pain",
      color: "#10b981",
      icon: "🤚"
    },
    visual: {
      name: "Visual Cortex",
      function: "Visual processing and pattern recognition",
      role: "Image formation, motion detection",
      disorders: "Visual agnosia, blindness",
      color: "#f59e0b",
      icon: "👁️"
    },
    auditory: {
      name: "Auditory Cortex",
      function: "Sound processing and language",
      role: "Speech perception, sound localization",
      disorders: "Auditory processing disorder",
      color: "#8b5cf6",
      icon: "👂"
    },
    hippocampus: {
      name: "Hippocampus",
      function: "Memory formation and spatial navigation",
      role: "Learning, memory consolidation",
      disorders: "Alzheimer's, amnesia",
      color: "#ec4899",
      icon: "🗺️"
    }
  };

  // ==================== 2D NEURAL VISUALIZATION ====================
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 400;
      canvas.height = 300;
      const context = canvas.getContext('2d');
      setCtx(context);
    }
  }, []);

  useEffect(() => {
    if (!ctx || !experimentActive) return;

    let animationFrame: number;
    let time = 0;

    const drawNeuralNetwork = () => {
      ctx.clearRect(0, 0, 400, 300);
      
      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 400, 300);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#1e293b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 300);

      // Draw neurons (nodes)
      const neurons = [
        { x: 100, y: 100, active: Math.sin(time) * 0.5 + 0.5 },
        { x: 200, y: 80, active: Math.cos(time * 1.3) * 0.5 + 0.5 },
        { x: 300, y: 120, active: Math.sin(time * 0.8) * 0.5 + 0.5 },
        { x: 150, y: 200, active: Math.cos(time * 1.1) * 0.5 + 0.5 },
        { x: 250, y: 220, active: Math.sin(time * 1.5) * 0.5 + 0.5 },
        { x: 180, y: 150, active: Math.cos(time * 0.9) * 0.5 + 0.5 },
        { x: 280, y: 170, active: Math.sin(time * 1.2) * 0.5 + 0.5 },
        { x: 120, y: 250, active: Math.cos(time * 1.4) * 0.5 + 0.5 },
        { x: 320, y: 200, active: Math.sin(time * 0.7) * 0.5 + 0.5 },
        { x: 220, y: 280, active: Math.cos(time * 1.6) * 0.5 + 0.5 }
      ];

      // Draw connections (synapses)
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const dist = Math.hypot(neurons[i].x - neurons[j].x, neurons[i].y - neurons[j].y);
          if (dist < 150) {
            const activity = (neurons[i].active + neurons[j].active) / 2;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${activity * 0.5})`;
            ctx.lineWidth = 1 + activity * 2;
            ctx.moveTo(neurons[i].x, neurons[i].y);
            ctx.lineTo(neurons[j].x, neurons[j].y);
            ctx.stroke();

            // Draw action potential propagation
            if (activity > 0.7) {
              const t = (time % 1);
              const midX = (neurons[i].x + neurons[j].x) / 2;
              const midY = (neurons[i].y + neurons[j].y) / 2;
              
              ctx.beginPath();
              ctx.arc(midX, midY, 3 + Math.sin(time * 10) * 2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(time * 10) * 0.3})`;
              ctx.fill();
            }
          }
        }
      }

      // Draw neurons
      neurons.forEach((neuron) => {
        // Glow effect
        const gradient = ctx.createRadialGradient(neuron.x, neuron.y, 0, neuron.x, neuron.y, 20);
        gradient.addColorStop(0, `rgba(59, 130, 246, ${neuron.active})`);
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Neuron body
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = neuron.active > 0.7 ? '#60a5fa' : '#3b82f6';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw spikes
        if (neuron.active > 0.8) {
          for (let i = 0; i < 3; i++) {
            const angle = (time * 10 + i * 2) % (Math.PI * 2);
            ctx.beginPath();
            ctx.moveTo(
              neuron.x + Math.cos(angle) * 12,
              neuron.y + Math.sin(angle) * 12
            );
            ctx.lineTo(
              neuron.x + Math.cos(angle) * 20,
              neuron.y + Math.sin(angle) * 20
            );
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(time * 20) * 0.3})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      });

      // Draw time-varying activity
      ctx.fillStyle = 'white';
      ctx.font = '12px monospace';
      ctx.fillText(`Firing Rate: ${parameters.firingRate.toFixed(1)} Hz`, 10, 20);
      ctx.fillText(`Membrane Potential: ${parameters.membranePotential.toFixed(1)} mV`, 10, 40);

      time += 0.05;
      animationFrame = requestAnimationFrame(drawNeuralNetwork);
    };

    drawNeuralNetwork();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [ctx, experimentActive, parameters.firingRate, parameters.membranePotential]);

  // ==================== SIMULATION ====================
  useEffect(() => {
    if (!experimentActive) return;

    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);

      // Generate spike data
      const newSpike: SpikeData = {
        time: recordingTime,
        amplitude: parameters.spikeAmplitude * (0.8 + Math.random() * 0.4),
        region: selectedRegion,
        neuron: Math.floor(Math.random() * 10)
      };

      setSpikeHistory(prev => [...prev.slice(-50), newSpike]);

      // Update firing rate based on stimulus
      let baseRate = 40;
      switch(stimulusType) {
        case 'visual': baseRate = 45 + Math.sin(recordingTime * 0.1) * 10; break;
        case 'auditory': baseRate = 35 + Math.cos(recordingTime * 0.15) * 8; break;
        case 'tactile': baseRate = 30 + Math.sin(recordingTime * 0.2) * 12; break;
        default: baseRate = 40 + Math.random() * 10;
      }

      setParameters(prev => ({
        ...prev,
        firingRate: baseRate * (0.9 + Math.random() * 0.2),
        membranePotential: -65 + Math.sin(recordingTime * 0.5) * 10 + (Math.random() - 0.5) * 5
      }));

      // Update frequency bands
      setFrequencyBands({
        delta: 2 + Math.sin(recordingTime * 0.1) * 1 + Math.random(),
        theta: 5 + Math.cos(recordingTime * 0.15) * 2 + Math.random(),
        alpha: 10 + Math.sin(recordingTime * 0.2) * 3 + Math.random(),
        beta: 18 + Math.cos(recordingTime * 0.25) * 4 + Math.random(),
        gamma: 32 + Math.sin(recordingTime * 0.3) * 5 + Math.random()
      });

      // Update brain region activity - FIXED VERSION
      setBrainRegions((prev: BrainRegions): BrainRegions => {
        // Create a new object with the same structure
        const updated: BrainRegions = {
          prefrontal: { ...prev.prefrontal },
          motor: { ...prev.motor },
          sensory: { ...prev.sensory },
          visual: { ...prev.visual },
          auditory: { ...prev.auditory },
          hippocampus: { ...prev.hippocampus }
        };
        
        // Update each region's activity
        (Object.keys(updated) as Array<keyof BrainRegions>).forEach(region => {
          const variation = Math.sin(recordingTime * 0.1 + Math.random()) * 10;
          updated[region] = {
            ...updated[region],
            active: Math.max(0, Math.min(100, updated[region].active + variation))
          };
        });
        
        return updated;
      });

      // Update neural data arrays
      setNeuralData((prev: NeuralData): NeuralData => {
        const newTime = prev.timeStamps.length > 0 
          ? prev.timeStamps[prev.timeStamps.length - 1] + 0.1 
          : 0;
        
        return {
          spikes: [...prev.spikes.slice(-100), parameters.firingRate * (0.5 + Math.random())],
          lfp: [...prev.lfp.slice(-100), parameters.membranePotential + (Math.random() - 0.5) * 10],
          coherence: [...prev.coherence.slice(-100), 0.5 + Math.random() * 0.3],
          firingRates: [...prev.firingRates.slice(-100), parameters.firingRate],
          timeStamps: [...prev.timeStamps.slice(-100), newTime]
        };
      });

    }, 500);

    return () => clearInterval(interval);
  }, [experimentActive, recordingTime, selectedRegion, stimulusType, parameters]);

  // ==================== CHART DATA ====================
  const spikeRasterData = {
    labels: neuralData.timeStamps.map(t => t.toFixed(1)),
    datasets: [
      {
        label: 'Neuron 1',
        data: neuralData.spikes.map((s, i) => i % 3 === 0 ? s : null),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointRadius: 2
      },
      {
        label: 'Neuron 2',
        data: neuralData.spikes.map((s, i) => i % 3 === 1 ? s * 0.8 : null),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        pointRadius: 2
      },
      {
        label: 'Neuron 3',
        data: neuralData.spikes.map((s, i) => i % 3 === 2 ? s * 1.2 : null),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        pointRadius: 2
      }
    ]
  };

  const frequencySpectrumData = {
    labels: ['Delta (1-4 Hz)', 'Theta (4-8 Hz)', 'Alpha (8-13 Hz)', 'Beta (13-30 Hz)', 'Gamma (30-80 Hz)'],
    datasets: [
      {
        label: 'Power (dB)',
        data: [
          frequencyBands.delta * 10,
          frequencyBands.theta * 8,
          frequencyBands.alpha * 6,
          frequencyBands.beta * 4,
          frequencyBands.gamma * 2
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderRadius: 8
      }
    ]
  };

  const regionRadarData = {
    labels: ['Prefrontal', 'Motor', 'Sensory', 'Visual', 'Auditory', 'Hippocampus'],
    datasets: [
      {
        label: 'Neural Activity',
        data: [
          brainRegions.prefrontal.active,
          brainRegions.motor.active,
          brainRegions.sensory.active,
          brainRegions.visual.active,
          brainRegions.auditory.active,
          brainRegions.hippocampus.active
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        pointBackgroundColor: '#3b82f6'
      }
    ]
  };

  const lfpData = {
    labels: neuralData.timeStamps.map(t => t.toFixed(1)),
    datasets: [
      {
        label: 'Local Field Potential (mV)',
        data: neuralData.lfp,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const coherenceData = {
    labels: neuralData.timeStamps.map(t => t.toFixed(1)),
    datasets: [
      {
        label: 'Cross-region Coherence',
        data: neuralData.coherence,
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const spikeIntervalData = {
    labels: ['1-10', '10-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90-100'],
    datasets: [
      {
        label: 'Spike Count',
        data: [12, 8, 15, 22, 18, 25, 30, 28, 20, 14].map(v => v * (parameters.firingRate / 50)),
        backgroundColor: '#f59e0b',
        borderRadius: 8
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { 
        beginAtZero: false,
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      x: { 
        grid: { color: 'rgba(255,255,255,0.1)' }
      }
    }
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { 
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      x: { 
        grid: { display: false }
      }
    }
  };

  const radarOptions: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(255,255,255,0.1)' },
        pointLabels: { color: '#94a3b8' }
      }
    }
  };

  // ==================== HANDLERS ====================
  const startExperiment = () => {
    setExperimentActive(true);
  };

  const stopExperiment = () => {
    setExperimentActive(false);
  };

  const resetExperiment = () => {
    setExperimentActive(false);
    setRecordingTime(0);
    setSpikeHistory([]);
    setNeuralData({
      spikes: [],
      lfp: [],
      coherence: [],
      firingRates: [],
      timeStamps: []
    });
    setParameters({
      firingRate: 45.2,
      membranePotential: -65,
      spikeAmplitude: 100,
      refractoryPeriod: 2,
      synapticStrength: 0.8,
      backgroundNoise: 0.15,
      connectivity: 0.6,
      plasticity: 0.3
    });
  };

  const applyStimulus = () => {
    setParameters(prev => ({
      ...prev,
      firingRate: prev.firingRate * 1.5,
      membranePotential: -55
    }));
    setTimeout(() => {
      setParameters(prev => ({
        ...prev,
        firingRate: prev.firingRate / 1.5,
        membranePotential: -65
      }));
    }, 1000);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>🧠 Brain Neuron Signal Simulator</h1>
        <div className="header-controls">
          <button 
            className="tutorial-btn"
            onClick={() => setShowTutorial(!showTutorial)}
          >
            {showTutorial ? '📘 Hide Guide' : '📘 Show Guide'}
          </button>
          <button 
            className={`mode-btn ${experimentActive ? 'active' : ''}`}
            onClick={experimentActive ? stopExperiment : startExperiment}
          >
            {experimentActive ? '⏸️ Pause' : '▶️ Start'}
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
            <h2>📋 Experiment Guide: Neural Signal Analysis</h2>
            <div className="tutorial-steps">
              <div className="tutorial-step">
                <span className="step-num">1</span>
                <span><strong>Electrode Placement:</strong> Position microelectrodes in target brain region</span>
              </div>
              <div className="tutorial-step">
                <span className="step-num">2</span>
                <span><strong>Signal Acquisition:</strong> Record extracellular spikes and LFP</span>
              </div>
              <div className="tutorial-step">
                <span className="step-num">3</span>
                <span><strong>Spike Sorting:</strong> Isolate single-unit activity</span>
              </div>
              <div className="tutorial-step">
                <span className="step-num">4</span>
                <span><strong>Frequency Analysis:</strong> Examine brain oscillations (delta to gamma)</span>
              </div>
              <div className="tutorial-step">
                <span className="step-num">5</span>
                <span><strong>Connectivity:</strong> Measure cross-region coherence</span>
              </div>
              <div className="tutorial-step">
                <span className="step-num">6</span>
                <span><strong>Interpretation:</strong> Relate patterns to cognitive function</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Experiment Aim Card */}
      <div className="aim-card">
        <h2>🎯 Experiment Aim: {experimentAim.title}</h2>
        <div className="aim-content">
          <p><strong>Objective:</strong> {experimentAim.objective}</p>
          <p><strong>Hypothesis:</strong> {experimentAim.hypothesis}</p>
          <div className="aim-grid">
            <div>
              <strong>Methodology:</strong>
              <ul>
                {experimentAim.methodology.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Expected Outcomes:</strong>
              <ul>
                {experimentAim.expectedOutcomes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="control-panel">
        <div className="control-group">
          <label>Brain Region:</label>
          <select 
            value={selectedRegion} 
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="control-select"
          >
            {Object.keys(regionInfo).map(key => (
              <option key={key} value={key}>{regionInfo[key].name}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Stimulus Type:</label>
          <select 
            value={stimulusType} 
            onChange={(e) => setStimulusType(e.target.value)}
            className="control-select"
          >
            <option value="visual">Visual (Light Flash)</option>
            <option value="auditory">Auditory (Tone)</option>
            <option value="tactile">Tactile (Vibration)</option>
          </select>
        </div>

        <div className="control-group">
          <label>Neuron Type:</label>
          <select 
            value={neuronActivity} 
            onChange={(e) => setNeuronActivity(e.target.value)}
            className="control-select"
          >
            <option value="normal">Pyramidal (Excitatory)</option>
            <option value="interneuron">Interneuron (Inhibitory)</option>
            <option value="purkinje">Purkinje (Cerebellum)</option>
          </select>
        </div>

        <button className="stimulus-btn" onClick={applyStimulus}>
          ⚡ Apply Stimulus
        </button>

        <button className="reset-btn" onClick={resetExperiment}>
          ↻ Reset
        </button>
      </div>

      {/* Main Grid */}
      <div className="main-grid">
        {/* Left Column - 2D Visualization & Parameters */}
        <div className="left-col">
          {/* 2D Neural Network Visualization */}
          <div className="card viz-card">
            <h2>🎨 2D Neural Network Activity</h2>
            <div className="canvas-container">
              <canvas 
                ref={canvasRef} 
                width="400" 
                height="300"
                style={{ width: '100%', height: 'auto', borderRadius: '1rem' }}
              />
            </div>
            <div className="viz-legend">
              <span className="legend-item">🔵 Active Neuron</span>
              <span className="legend-item">⚡ Action Potential</span>
              <span className="legend-item">🔗 Synaptic Connection</span>
            </div>
          </div>

          {/* Neural Parameters */}
          <div className="card params-card">
            <h2>⚙️ Neural Parameters</h2>
            <div className="params-grid">
              <div className="param-item">
                <span className="param-label">Firing Rate:</span>
                <span className="param-value">{parameters.firingRate.toFixed(1)} Hz</span>
              </div>
              <div className="param-item">
                <span className="param-label">Membrane Potential:</span>
                <span className="param-value">{parameters.membranePotential.toFixed(1)} mV</span>
              </div>
              <div className="param-item">
                <span className="param-label">Spike Amplitude:</span>
                <span className="param-value">{parameters.spikeAmplitude.toFixed(0)} µV</span>
              </div>
              <div className="param-item">
                <span className="param-label">Refractory Period:</span>
                <span className="param-value">{parameters.refractoryPeriod.toFixed(1)} ms</span>
              </div>
              <div className="param-item">
                <span className="param-label">Synaptic Strength:</span>
                <span className="param-value">{parameters.synapticStrength.toFixed(2)}</span>
              </div>
              <div className="param-item">
                <span className="param-label">Connectivity:</span>
                <span className="param-value">{(parameters.connectivity * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Brain Region Activity */}
          <div className="card regions-card">
            <h2>📊 Brain Region Activity</h2>
            <div className="regions-grid">
              {Object.keys(brainRegions).map(region => (
                <div key={region} className="region-item">
                  <span className="region-name">
                    <span style={{ color: brainRegions[region as keyof BrainRegions].color }}>●</span> 
                    {regionInfo[region].name}
                  </span>
                  <div className="region-bar-container">
                    <div 
                      className="region-bar"
                      style={{ 
                        width: `${brainRegions[region as keyof BrainRegions].active}%`,
                        backgroundColor: brainRegions[region as keyof BrainRegions].color
                      }}
                    />
                    <span className="region-value">{brainRegions[region as keyof BrainRegions].active.toFixed(0)} Hz</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column - Charts */}
        <div className="middle-col">
          {/* Spike Raster Plot */}
          <div className="card chart-card">
            <h2>📈 Multi-unit Spike Raster</h2>
            <div className="chart-container">
              <Line data={spikeRasterData} options={chartOptions} />
            </div>
          </div>

          {/* Frequency Spectrum */}
          <div className="card chart-card">
            <h2>📊 Frequency Band Power</h2>
            <div className="chart-container">
              <Bar data={frequencySpectrumData} options={barOptions} />
            </div>
          </div>

          {/* LFP Recording */}
          <div className="card chart-card">
            <h2>📉 Local Field Potential (LFP)</h2>
            <div className="chart-container">
              <Line data={lfpData} options={chartOptions} />
            </div>
          </div>

          {/* Coherence Analysis */}
          <div className="card chart-card">
            <h2>🔄 Cross-region Coherence</h2>
            <div className="chart-container">
              <Line data={coherenceData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Right Column - Analysis & 3D Views */}
        <div className="right-col">
          {/* 3D Brain Visualization (simulated with CSS) */}
          <div className="card brain-3d-card">
            <h2>🧠 3D Brain Activity Map</h2>
            <div className="brain-3d-container">
              <div className="brain-3d">
                <div className="brain-lobe frontal" style={{ backgroundColor: brainRegions.prefrontal.color, opacity: brainRegions.prefrontal.active / 100 + 0.3 }}>
                  <span>Frontal</span>
                  <div className="activity-indicator" style={{ height: `${brainRegions.prefrontal.active}%` }} />
                </div>
                <div className="brain-lobe parietal" style={{ backgroundColor: brainRegions.motor.color, opacity: brainRegions.motor.active / 100 + 0.3 }}>
                  <span>Parietal</span>
                  <div className="activity-indicator" style={{ height: `${brainRegions.motor.active}%` }} />
                </div>
                <div className="brain-lobe temporal" style={{ backgroundColor: brainRegions.auditory.color, opacity: brainRegions.auditory.active / 100 + 0.3 }}>
                  <span>Temporal</span>
                  <div className="activity-indicator" style={{ height: `${brainRegions.auditory.active}%` }} />
                </div>
                <div className="brain-lobe occipital" style={{ backgroundColor: brainRegions.visual.color, opacity: brainRegions.visual.active / 100 + 0.3 }}>
                  <span>Occipital</span>
                  <div className="activity-indicator" style={{ height: `${brainRegions.visual.active}%` }} />
                </div>
                <div className="brain-lobe cerebellum" style={{ backgroundColor: brainRegions.hippocampus.color, opacity: brainRegions.hippocampus.active / 100 + 0.3 }}>
                  <span>Cerebellum</span>
                  <div className="activity-indicator" style={{ height: `${brainRegions.hippocampus.active}%` }} />
                </div>
              </div>
              <p className="brain-note">Hover for region details • Activity: Color intensity</p>
            </div>
          </div>

          {/* Region Radar Chart */}
          <div className="card chart-card">
            <h2>📡 Regional Activity Radar</h2>
            <div className="chart-container radar">
              <Radar data={regionRadarData} options={radarOptions} />
            </div>
          </div>

          {/* Spike Interval Histogram */}
          <div className="card chart-card">
            <h2>📊 Spike Interval Distribution</h2>
            <div className="chart-container">
              <Bar data={spikeIntervalData} options={barOptions} />
            </div>
          </div>

          {/* Region Information */}
          <div className="card info-card">
            <h2>🔬 {regionInfo[selectedRegion].name}</h2>
            <div className="region-details">
              <p><strong>Function:</strong> {regionInfo[selectedRegion].function}</p>
              <p><strong>Role:</strong> {regionInfo[selectedRegion].role}</p>
              <p><strong>Associated Disorders:</strong> {regionInfo[selectedRegion].disorders}</p>
              <p><strong>Current Activity:</strong> {brainRegions[selectedRegion as keyof BrainRegions].active.toFixed(1)} Hz</p>
              <p><strong>Dominant Frequency:</strong> {
                frequencyBands.alpha > frequencyBands.beta ? 'Alpha (8-13 Hz)' :
                frequencyBands.beta > frequencyBands.gamma ? 'Beta (13-30 Hz)' :
                'Gamma (30-80 Hz)'
              }</p>
            </div>
          </div>

          {/* Recent Spikes */}
          <div className="card spikes-card">
            <h2>⚡ Recent Action Potentials</h2>
            <div className="spikes-list">
              {spikeHistory.slice(-5).reverse().map((spike, i) => (
                <div key={i} className="spike-item">
                  <span className="spike-time">t={spike.time.toFixed(1)}s</span>
                  <span className="spike-amp">{spike.amplitude.toFixed(0)} µV</span>
                  <span className="spike-neuron">Neuron {spike.neuron}</span>
                </div>
              ))}
              {spikeHistory.length === 0 && (
                <div className="spikes-empty">No spikes detected</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0f1e 0%, #1a1f2e 100%);
          padding: 1.5rem;
          font-family: 'Inter', -apple-system, sans-serif;
          color: #e2e8f0;
        }

        .header {
          max-width: 1400px;
          margin: 0 auto 1.5rem auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header h1 {
          color: #60a5fa;
          font-size: 2rem;
          margin: 0;
          text-shadow: 0 0 10px rgba(96, 165, 250, 0.3);
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
          background: #10b981;
          color: white;
        }

        .mode-btn.active {
          background: #ef4444;
        }

        .tutorial-panel {
          background: #1e293b;
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          max-width: 1400px;
          margin: 0 auto 1.5rem auto;
          border: 1px solid #334155;
        }

        .tutorial-panel h2 {
          color: #60a5fa;
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
          background: #0f172a;
          border-radius: 0.5rem;
          border: 1px solid #334155;
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

        .aim-card {
          background: #1e293b;
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          max-width: 1400px;
          margin: 0 auto 1.5rem auto;
          border: 1px solid #334155;
          border-left: 4px solid #60a5fa;
        }

        .aim-card h2 {
          color: #60a5fa;
          margin: 0 0 1rem 0;
        }

        .aim-content {
          color: #cbd5e1;
        }

        .aim-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 1rem;
        }

        .aim-grid ul {
          margin: 0.5rem 0 0 0;
          padding-left: 1.2rem;
        }

        .aim-grid li {
          margin: 0.3rem 0;
        }

        .control-panel {
          max-width: 1400px;
          margin: 0 auto 1.5rem auto;
          background: #1e293b;
          border-radius: 1rem;
          padding: 1rem;
          display: flex;
          gap: 1rem;
          align-items: center;
          border: 1px solid #334155;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .control-group label {
          color: #94a3b8;
          font-size: 0.9rem;
        }

        .control-select {
          padding: 0.5rem;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 0.5rem;
          color: #e2e8f0;
          outline: none;
        }

        .stimulus-btn {
          padding: 0.5rem 1rem;
          background: #f59e0b;
          color: #0f172a;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
        }

        .reset-btn {
          padding: 0.5rem 1rem;
          background: #475569;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 350px 1fr 350px;
          gap: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .card {
          background: #1e293b;
          border-radius: 1.5rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid #334155;
        }

        .card h2 {
          color: #60a5fa;
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
        }

        .canvas-container {
          background: #0f172a;
          border-radius: 1rem;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .viz-legend {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .legend-item {
          color: #94a3b8;
          font-size: 0.8rem;
        }

        .params-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .param-item {
          background: #0f172a;
          padding: 0.8rem;
          border-radius: 0.8rem;
          text-align: center;
        }

        .param-label {
          display: block;
          color: #94a3b8;
          font-size: 0.8rem;
        }

        .param-value {
          display: block;
          color: #60a5fa;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .regions-grid {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .region-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .region-name {
          width: 100px;
          color: #cbd5e1;
          font-size: 0.9rem;
        }

        .region-bar-container {
          flex: 1;
          height: 24px;
          background: #0f172a;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
        }

        .region-bar {
          height: 100%;
          transition: width 0.3s;
        }

        .region-value {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        .chart-container {
          height: 200px;
        }

        .chart-container.radar {
          height: 250px;
        }

        .brain-3d-container {
          perspective: 1000px;
        }

        .brain-3d {
          height: 250px;
          position: relative;
          transform-style: preserve-3d;
          transform: rotateX(10deg) rotateY(20deg);
        }

        .brain-lobe {
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
          transition: all 0.3s;
          overflow: hidden;
        }

        .brain-lobe:hover {
          transform: scale(1.1);
          z-index: 10;
        }

        .brain-lobe.frontal {
          top: 20px;
          left: 50px;
          transform: translateZ(20px);
        }

        .brain-lobe.parietal {
          top: 20px;
          right: 50px;
          transform: translateZ(10px);
        }

        .brain-lobe.temporal {
          bottom: 20px;
          left: 30px;
          transform: translateZ(-10px);
        }

        .brain-lobe.occipital {
          bottom: 20px;
          right: 30px;
          transform: translateZ(0);
        }

        .brain-lobe.cerebellum {
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%) translateZ(-20px);
        }

        .activity-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: rgba(255,255,255,0.3);
          transition: height 0.3s;
        }

        .brain-note {
          text-align: center;
          color: #94a3b8;
          font-size: 0.8rem;
          margin-top: 1rem;
        }

        .region-details {
          background: #0f172a;
          padding: 1rem;
          border-radius: 0.8rem;
        }

        .region-details p {
          margin: 0.5rem 0;
          color: #cbd5e1;
        }

        .spikes-list {
          max-height: 150px;
          overflow-y: auto;
        }

        .spike-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;
          border-bottom: 1px solid #334155;
          color: #cbd5e1;
        }

        .spike-time {
          color: #60a5fa;
        }

        .spike-amp {
          color: #f59e0b;
        }

        .spike-neuron {
          color: #10b981;
        }

        .spikes-empty {
          color: #64748b;
          font-style: italic;
          text-align: center;
        }

        @media (max-width: 1200px) {
          .main-grid {
            grid-template-columns: 1fr;
          }
          
          .tutorial-steps {
            grid-template-columns: 1fr;
          }

          .aim-grid {
            grid-template-columns: 1fr;
          }

          .control-panel {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}