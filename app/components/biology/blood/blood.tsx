"use client";

import { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function BloodTransfusionLab() {
  // Experiment Info
  const experimentInfo = {
    title: "Blood Group & Blood Transfusion Compatibility Simulator",
    aim: "To understand ABO and Rh blood group systems and determine safe blood transfusion compatibility"
  };

  // Theory Data
  const theory = {
    abo: "Type A: A antigens + anti-B | Type B: B antigens + anti-A | Type AB: Universal Recipient | Type O: Universal Donor",
    rh: "Rh+: Has D antigen | Rh-: Lacks D antigen, can develop anti-Rh antibodies"
  };

  // State Management
  const [donorBlood, setDonorBlood] = useState('A');
  const [donorRh, setDonorRh] = useState('+');
  const [recipientBlood, setRecipientBlood] = useState('A');
  const [recipientRh, setRecipientRh] = useState('+');
  const [compatibilityResult, setCompatibilityResult] = useState<any>(null);
  const [agglutinationIntensity, setAgglutinationIntensity] = useState(0);
  const [bloodFlowEfficiency, setBloodFlowEfficiency] = useState(100);
  const [survivalProbability, setSurvivalProbability] = useState(100);
  const [riskLevel, setRiskLevel] = useState('LOW');
  const [aiReasoning, setAiReasoning] = useState('');
  const [simulationActive, setSimulationActive] = useState(false);
  const [transfusionProgress, setTransfusionProgress] = useState(0);
  const [timeData, setTimeData] = useState<number[]>([]);
  const [intensityData, setIntensityData] = useState<number[]>([]);
  const [flowData, setFlowData] = useState<number[]>([]);
  const [survivalData, setSurvivalData] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  // Compatibility Matrix
  const compatibilityMatrix: Record<string, any> = {
    'O-': { canDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], antigens: [], antibodies: ['A', 'B'] },
    'O+': { canDonateTo: ['O+', 'A+', 'B+', 'AB+'], antigens: [], antibodies: ['A', 'B'] },
    'A-': { canDonateTo: ['A-', 'A+', 'AB-', 'AB+'], antigens: ['A'], antibodies: ['B'] },
    'A+': { canDonateTo: ['A+', 'AB+'], antigens: ['A'], antibodies: ['B'] },
    'B-': { canDonateTo: ['B-', 'B+', 'AB-', 'AB+'], antigens: ['B'], antibodies: ['A'] },
    'B+': { canDonateTo: ['B+', 'AB+'], antigens: ['B'], antibodies: ['A'] },
    'AB-': { canDonateTo: ['AB-', 'AB+'], antigens: ['A', 'B'], antibodies: [] },
    'AB+': { canDonateTo: ['AB+'], antigens: ['A', 'B'], antibodies: [] }
  };

  // Risk Assessment Engine
  const assessRisk = (donor: { blood: string; rh: string }, recip: { blood: string; rh: string }) => {
    const donorType = donor.blood + donor.rh;
    const recipType = recip.blood + recip.rh;
    const donorInfo = compatibilityMatrix[donorType];
    const recipInfo = compatibilityMatrix[recipType];
    
    let reasoning: string[] = [];
    let riskScore = 0;
    let agglutination = 0;
    let flowReduction = 0;

    if (donorInfo.antigens.some((ag: string) => recipInfo.antibodies.includes(ag))) {
      reasoning.push(`⚠️ CRITICAL: Recipient has anti-${donorInfo.antigens.filter((ag: string) => recipInfo.antibodies.includes(ag)).join(', ')} antibodies`);
      riskScore += 70;
      agglutination += 80;
      flowReduction += 70;
    } else {
      reasoning.push(`✅ ABO compatible: No antigen-antibody mismatch`);
    }

    if (donor.rh === '+' && recip.rh === '-') {
      reasoning.push(`⚠️ Rh Incompatibility: Rh- receiving Rh+ blood`);
      riskScore += 30;
      agglutination += 20;
      flowReduction += 15;
    } else {
      reasoning.push(`✅ Rh compatible`);
    }

    riskScore = Math.min(100, riskScore);
    agglutination = Math.min(100, agglutination);
    flowReduction = Math.min(100, flowReduction);
    
    let riskLvl = riskScore < 30 ? 'LOW' : riskScore < 60 ? 'MODERATE' : 'HIGH';
    const survivalProb = 100 - (riskScore * 0.8);
    const bloodFlowEff = 100 - flowReduction;

    return {
      compatible: riskScore < 50,
      riskScore,
      riskLevel: riskLvl,
      agglutination,
      bloodFlowEff,
      survivalProb,
      reasoning: reasoning.join('\n'),
      donorType,
      recipType
    };
  };

  // Check Compatibility
  const checkCompatibility = () => {
    const result = assessRisk(
      { blood: donorBlood, rh: donorRh },
      { blood: recipientBlood, rh: recipientRh }
    );
    
    setCompatibilityResult(result);
    setAgglutinationIntensity(result.agglutination);
    setBloodFlowEfficiency(result.bloodFlowEff);
    setSurvivalProbability(result.survivalProb);
    setRiskLevel(result.riskLevel);
    setAiReasoning(result.reasoning);
    setSimulationActive(true);
    setTransfusionProgress(0);
    setTimeData([]);
    setIntensityData([]);
    setFlowData([]);
    setSurvivalData([]);
    timeRef.current = 0;
  };

  // Canvas Animation - Real-time Blood Transfusion Visualization
  useEffect(() => {
    if (!simulationActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const drawBloodVessel = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw blood vessel walls
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#5D4037');
      gradient.addColorStop(0.1, '#8D6E63');
      gradient.addColorStop(0.9, '#8D6E63');
      gradient.addColorStop(1, '#5D4037');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Vessel interior
      ctx.fillStyle = '#FFEBEE';
      ctx.fillRect(10, 20, width - 20, height - 40);

      // Draw flow direction arrows
      ctx.fillStyle = '#B71C1C';
      ctx.font = 'bold 14px Arial';
      for (let i = 0; i < 3; i++) {
        const arrowX = (Date.now() * 0.1 + i * 150) % width;
        ctx.fillText('→', arrowX, 35);
      }

      // Draw blood cells
      const rbcCount = 25;
      for (let i = 0; i < rbcCount; i++) {
        const baseX = (Date.now() * 0.03 + i * 35) % (width + 100) - 50;
        const baseY = 50 + Math.sin(Date.now() * 0.002 + i * 0.5) * 15 + (i % 5) * 30;
        
        // Cell position affected by agglutination
        let x = baseX;
        let y = baseY;
        
        if (compatibilityResult && !compatibilityResult.compatible) {
          // Clump cells together in incompatible case
          const clumpFactor = agglutinationIntensity / 100;
          const clumpX = (i % 5) * 15 * clumpFactor;
          const clumpY = Math.floor(i / 5) * 20 * clumpFactor;
          x = baseX * (1 - clumpFactor * 0.5) + clumpX;
          y = baseY * (1 - clumpFactor * 0.3) + clumpY;
        }

        // Draw RBC (donut shape)
        ctx.beginPath();
        ctx.ellipse(x, y, 12, 6, 0, 0, Math.PI * 2);
        
        // Color based on blood type
        let cellColor = '#4CAF50'; // O default
        if (donorBlood === 'A') cellColor = '#E53935';
        else if (donorBlood === 'B') cellColor = '#1E88E5';
        else if (donorBlood === 'AB') cellColor = '#8E24AA';
        
        // Darken color if incompatible
        if (compatibilityResult && !compatibilityResult.compatible) {
          cellColor = '#B71C1C';
        }
        
        ctx.fillStyle = cellColor;
        ctx.fill();
        
        // Inner circle (donut effect)
        ctx.beginPath();
        ctx.ellipse(x, y, 5, 2.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#FFEBEE';
        ctx.fill();

        // Rh factor marker
        if (donorRh === '+') {
          ctx.beginPath();
          ctx.arc(x + 7, y - 4, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#FFD700';
          ctx.fill();
        }

        // Label
        ctx.fillStyle = 'white';
        ctx.font = '6px Arial';
        ctx.fillText(donorBlood, x - 4, y + 2);
      }

      // Draw antibodies (Y-shaped) in incompatible case
      if (compatibilityResult && !compatibilityResult.compatible) {
        for (let i = 0; i < 8; i++) {
          const x = (Date.now() * 0.05 + i * 60) % width;
          const y = 40 + (i * 25) % (height - 80);
          
          ctx.strokeStyle = `rgba(183, 28, 28, ${agglutinationIntensity / 120})`;
          ctx.lineWidth = 2;
          
          // Y shape
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + 12);
          ctx.moveTo(x, y + 4);
          ctx.lineTo(x - 6, y + 9);
          ctx.moveTo(x, y + 4);
          ctx.lineTo(x + 6, y + 9);
          ctx.stroke();
        }
      }

      // Draw blocked area if severe agglutination
      if (agglutinationIntensity > 60) {
        const blockX = width - 80;
        const blockHeight = (agglutinationIntensity / 100) * (height - 60);
        ctx.fillStyle = `rgba(183, 28, 28, 0.4)`;
        ctx.fillRect(blockX, 30, 60, blockHeight);
        
        ctx.fillStyle = '#B71C1C';
        ctx.font = 'bold 12px Arial';
        ctx.fillText('BLOCKED', blockX + 5, height / 2);
      }

      // Flow efficiency indicator
      const flowBarWidth = (bloodFlowEfficiency / 100) * (width - 40);
      ctx.fillStyle = '#333';
      ctx.fillRect(20, height - 25, width - 40, 8);
      ctx.fillStyle = bloodFlowEfficiency > 50 ? '#4CAF50' : bloodFlowEfficiency > 20 ? '#FF9800' : '#F44336';
      ctx.fillRect(20, height - 25, flowBarWidth, 8);
      
      ctx.fillStyle = 'white';
      ctx.font = '10px Arial';
      ctx.fillText(`Flow: ${bloodFlowEfficiency.toFixed(1)}%`, 20, height - 30);
    };

    const animate = () => {
      drawBloodVessel();
      
      if (timeRef.current < 60) {
        setTimeData(prev => [...prev, timeRef.current]);
        setIntensityData(prev => [...prev, agglutinationIntensity + Math.random() * 5]);
        setFlowData(prev => [...prev, bloodFlowEfficiency - Math.random() * 3]);
        setSurvivalData(prev => [...prev, survivalProbability + Math.random() * 2]);
        setTransfusionProgress(prev => Math.min(100, prev + 2));
        timeRef.current++;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [simulationActive, compatibilityResult, donorBlood, donorRh, agglutinationIntensity, bloodFlowEfficiency]);

  // Chart Data
  const intensityChartData = {
    labels: timeData,
    datasets: [{
      label: 'Agglutination %',
      data: intensityData,
      borderColor: '#E53935',
      backgroundColor: 'rgba(229, 57, 53, 0.2)',
      fill: true,
      tension: 0.4
    }]
  };

  const flowChartData = {
    labels: timeData,
    datasets: [{
      label: 'Blood Flow %',
      data: flowData,
      borderColor: '#1E88E5',
      backgroundColor: 'rgba(30, 136, 229, 0.2)',
      fill: true,
      tension: 0.4
    }]
  };

  const survivalChartData = {
    labels: timeData,
    datasets: [{
      label: 'Survival %',
      data: survivalData,
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      fill: true,
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: 'white' } },
      x: { grid: { display: false }, ticks: { color: 'white' } }
    },
    plugins: { legend: { labels: { color: 'white', font: { size: 10 } } } }
  };

  const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  return (
    <div style={s.container}>
      {/* Header */}
      <div style={s.header}>
        <h1 style={s.title}>🩸 {experimentInfo.title}</h1>
        <p style={s.aim}>{experimentInfo.aim}</p>
        <div style={s.theoryBar}>
          <span><strong>ABO:</strong> {theory.abo}</span>
          <span><strong>Rh:</strong> {theory.rh}</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={s.mainContent}>
        
        {/* Left Panel - Controls */}
        <div style={s.leftPanel}>
          <div style={s.card}>
            <h3 style={s.cardTitle}>🩸 Donor Blood</h3>
            <div style={s.buttonGroup}>
              {['A', 'B', 'AB', 'O'].map(type => (
                <button key={type} style={{...s.bloodBtn, ...(donorBlood === type ? s.activeBtn : {})}} onClick={() => setDonorBlood(type)}>
                  {type}
                </button>
              ))}
            </div>
            <div style={s.buttonGroup}>
              <button style={{...s.rhBtn, ...(donorRh === '+' ? s.activeRh : {})}} onClick={() => setDonorRh('+')}>Rh+</button>
              <button style={{...s.rhBtn, ...(donorRh === '-' ? s.activeRh : {})}} onClick={() => setDonorRh('-')}>Rh-</button>
            </div>
            <div style={s.antigenBox}>Antigens: {compatibilityMatrix[donorBlood + donorRh]?.antigens.join(', ') || 'None'}</div>
          </div>

          <div style={s.card}>
            <h3 style={s.cardTitle}>🧬 Recipient Blood</h3>
            <div style={s.buttonGroup}>
              {['A', 'B', 'AB', 'O'].map(type => (
                <button key={type} style={{...s.bloodBtn, ...(recipientBlood === type ? s.activeBtn : {})}} onClick={() => setRecipientBlood(type)}>
                  {type}
                </button>
              ))}
            </div>
            <div style={s.buttonGroup}>
              <button style={{...s.rhBtn, ...(recipientRh === '+' ? s.activeRh : {})}} onClick={() => setRecipientRh('+')}>Rh+</button>
              <button style={{...s.rhBtn, ...(recipientRh === '-' ? s.activeRh : {})}} onClick={() => setRecipientRh('-')}>Rh-</button>
            </div>
            <div style={s.antibodyBox}>Antibodies: {compatibilityMatrix[recipientBlood + recipientRh]?.antibodies.map((ab: string) => `Anti-${ab}`).join(', ') || 'None'}</div>
          </div>

          <button style={s.checkBtn} onClick={checkCompatibility}>🔬 Test Compatibility</button>

          {/* Result Card - Minimal info */}
          {compatibilityResult && (
            <div style={s.resultCard}>
              <div style={s.resultIcon}>{compatibilityResult.compatible ? '✅' : '❌'}</div>
              <div style={s.resultText}>{compatibilityResult.compatible ? 'Compatible' : 'Incompatible'}</div>
              <div style={s.resultBadge}>
                <span style={{color: riskLevel === 'LOW' ? '#4CAF50' : riskLevel === 'MODERATE' ? '#FF9800' : '#F44336'}}>
                  {riskLevel} RISK
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Center Panel - Visualization */}
        <div style={s.centerPanel}>
          <div style={s.vizCard}>
            <h3 style={s.cardTitle}>🔬 Real-Time Blood Transfusion Analysis</h3>
            <canvas ref={canvasRef} width={550} height={280} style={s.canvas}></canvas>
            <div style={s.legend}>
              <span><span style={{color:'#E53935'}}>⬤</span> Type A</span>
              <span><span style={{color:'#1E88E5'}}>⬤</span> Type B</span>
              <span><span style={{color:'#8E24AA'}}>⬤</span> Type AB</span>
              <span><span style={{color:'#4CAF50'}}>⬤</span> Type O</span>
              <span><span style={{color:'#FFD700'}}>⬤</span> Rh+</span>
              <span><span style={{color:'#B71C1C'}}>⚡</span> Antibody</span>
            </div>
          </div>

          {/* Charts Row */}
          <div style={s.chartsRow}>
            <div style={s.chartCard}><Line data={intensityChartData} options={chartOptions} /></div>
            <div style={s.chartCard}><Line data={flowChartData} options={chartOptions} /></div>
            <div style={s.chartCard}><Line data={survivalChartData} options={chartOptions} /></div>
          </div>

          {/* Metrics Bar */}
          <div style={s.metricsBar}>
            <div style={s.metricItem}>
              <span>Agglutination</span>
              <div style={s.progressBg}><div style={{...s.progressFill, width:`${agglutinationIntensity}%`,background:'#E53935'}}></div></div>
              <span>{agglutinationIntensity.toFixed(0)}%</span>
            </div>
            <div style={s.metricItem}>
              <span>Blood Flow</span>
              <div style={s.progressBg}><div style={{...s.progressFill, width:`${bloodFlowEfficiency}%`,background:'#1E88E5'}}></div></div>
              <span>{bloodFlowEfficiency.toFixed(0)}%</span>
            </div>
            <div style={s.metricItem}>
              <span>Survival</span>
              <div style={s.progressBg}><div style={{...s.progressFill, width:`${survivalProbability}%`,background:'#4CAF50'}}></div></div>
              <span>{survivalProbability.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Empty now */}
        <div style={s.rightPanel}></div>
      </div>

      {/* Bottom Section - Compatibility Matrix and Analysis Side by Side */}
      <div style={s.bottomSection}>
        {/* Compatibility Matrix */}
        <div style={s.matrixSection}>
          <div style={s.matrixCard}>
            <h3 style={s.cardTitle}>📊 Compatibility Matrix</h3>
            <div style={s.tableContainer}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.tableHeader}>Donor ↓</th>
                    {bloodTypes.map(t => (
                      <th key={t} style={s.tableHeader}>{t}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bloodTypes.map(donor => (
                    <tr key={donor}>
                      <td style={s.donorCell}>{donor}</td>
                      {bloodTypes.map(recipient => {
                        const compatible = compatibilityMatrix[donor]?.canDonateTo.includes(recipient);
                        return (
                          <td 
                            key={recipient} 
                            style={{
                              ...s.compatCell, 
                              backgroundColor: compatible ? '#2e7d32' : '#c62828',
                            }}
                          >
                            {compatible ? '✓' : '✗'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Analysis Results - Now beside matrix */}
        {compatibilityResult && (
          <div style={s.analysisSection}>
            <div style={s.analysisCard}>
              <h3 style={s.cardTitle}>🧪 Detailed Analysis Results</h3>
              <div style={s.analysisContent}>
                <div style={s.analysisGrid}>
                  <div style={s.analysisItem}>
                    <span style={s.analysisLabel}>Donor Type:</span>
                    <span style={s.analysisValue}>{compatibilityResult.donorType}</span>
                  </div>
                  <div style={s.analysisItem}>
                    <span style={s.analysisLabel}>Recipient Type:</span>
                    <span style={s.analysisValue}>{compatibilityResult.recipType}</span>
                  </div>
                  <div style={s.analysisItem}>
                    <span style={s.analysisLabel}>Risk Score:</span>
                    <span style={s.analysisValue}>{compatibilityResult.riskScore.toFixed(0)}%</span>
                  </div>
                  <div style={s.analysisItem}>
                    <span style={s.analysisLabel}>Risk Level:</span>
                    <span style={{...s.analysisValue, color: riskLevel === 'LOW' ? '#4CAF50' : riskLevel === 'MODERATE' ? '#FF9800' : '#F44336'}}>
                      {riskLevel}
                    </span>
                  </div>
                  <div style={s.analysisItem}>
                    <span style={s.analysisLabel}>Agglutination:</span>
                    <span style={s.analysisValue}>{agglutinationIntensity.toFixed(0)}%</span>
                  </div>
                  <div style={s.analysisItem}>
                    <span style={s.analysisLabel}>Blood Flow:</span>
                    <span style={s.analysisValue}>{bloodFlowEfficiency.toFixed(0)}%</span>
                  </div>
                  <div style={s.analysisItem}>
                    <span style={s.analysisLabel}>Survival Prob.:</span>
                    <span style={s.analysisValue}>{survivalProbability.toFixed(1)}%</span>
                  </div>
                  <div style={s.analysisItem}>
                    <span style={s.analysisLabel}>Status:</span>
                    <span style={{...s.analysisValue, color: compatibilityResult.compatible ? '#4CAF50' : '#F44336'}}>
                      {compatibilityResult.compatible ? 'Compatible' : 'Incompatible'}
                    </span>
                  </div>
                </div>
                <hr style={{borderColor:'#4a4a6a', margin:'15px 0'}}/>
                <div style={s.reasoningBox}>
                  <strong style={{color:'#FFD700'}}>🧬 Immunological Response:</strong>
                  <p style={{fontSize:'0.8rem', whiteSpace:'pre-line', lineHeight:'1.6', marginTop:'10px', color:'#a8a8c0'}}>
                    {aiReasoning}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles - Updated for bottom section with side-by-side layout
const s: Record<string, React.CSSProperties> = {
  container: { 
    minHeight: '100vh', 
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)', 
    color: 'white', 
    padding: '15px', 
    fontFamily: 'Arial, sans-serif',
    overflowX: 'hidden',
    width: '100%',
    maxWidth: '100vw'
  },
  header: { textAlign: 'center', marginBottom: '15px' },
  title: { color: '#FFD700', fontSize: '1.6rem', marginBottom: '5px' },
  aim: { color: '#a8a8c0', fontSize: '0.85rem', marginBottom: '8px' },
  theoryBar: { display: 'flex', justifyContent: 'center', gap: '40px', fontSize: '0.75rem', color: '#a8a8c0', flexWrap: 'wrap' },
  mainContent: { display: 'grid', gridTemplateColumns: '220px 1fr 220px', gap: '15px', maxWidth: '1600px', margin: '0 auto', width: '100%' },
  leftPanel: { display: 'flex', flexDirection: 'column', gap: '10px' },
  centerPanel: { display: 'flex', flexDirection: 'column', gap: '10px' },
  rightPanel: { display: 'flex', flexDirection: 'column', gap: '10px' },
  card: { background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px', border: '1px solid #4a4a6a' },
  cardTitle: { color: '#FFD700', fontSize: '0.9rem', marginBottom: '10px' },
  buttonGroup: { display: 'flex', gap: '5px', marginBottom: '8px', flexWrap: 'wrap' },
  bloodBtn: { flex: 1, padding: '8px', background: 'transparent', border: '1px solid #4a4a6a', borderRadius: '5px', color: 'white', cursor: 'pointer', fontSize: '0.85rem', minWidth: '45px' },
  activeBtn: { background: '#FFD700', borderColor: '#FFD700', color: '#1a1a2e' },
  rhBtn: { flex: 1, padding: '8px', background: 'transparent', border: '1px solid #4a4a6a', borderRadius: '5px', color: 'white', cursor: 'pointer', fontSize: '0.85rem' },
  activeRh: { background: '#FFD700', borderColor: '#FFD700', color: '#1a1a2e' },
  antigenBox: { background: 'rgba(76, 175, 80, 0.3)', padding: '8px', borderRadius: '5px', textAlign: 'center', fontSize: '0.75rem' },
  antibodyBox: { background: 'rgba(229, 57, 53, 0.3)', padding: '8px', borderRadius: '5px', textAlign: 'center', fontSize: '0.75rem' },
  checkBtn: { width: '100%', padding: '12px', background: 'linear-gradient(135deg, #4CAF50, #2196F3)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' },
  resultCard: { background: 'rgba(255,215,0,0.15)', borderRadius: '10px', padding: '12px', border: '1px solid #FFD700', textAlign: 'center' },
  resultIcon: { fontSize: '1.4rem', marginBottom: '5px' },
  resultText: { fontSize: '0.9rem', marginBottom: '5px' },
  resultBadge: { fontSize: '0.75rem', padding: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px' },
  vizCard: { background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px', border: '1px solid #4a4a6a' },
  canvas: { width: '100%', height: 'auto', background: '#1e1e2e', borderRadius: '5px' },
  legend: { display: 'flex', gap: '12px', fontSize: '0.7rem', marginTop: '8px', flexWrap: 'wrap' },
  chartsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' },
  chartCard: { background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px', height: '130px', border: '1px solid #4a4a6a' },
  metricsBar: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px', border: '1px solid #4a4a6a' },
  metricItem: { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem' },
  progressBg: { height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' },
  progressFill: { height: '100%', transition: 'width 0.3s' },
  
  // New styles for bottom section
  bottomSection: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 380px', 
    gap: '15px', 
    maxWidth: '1600px', 
    margin: '15px auto 0', 
    width: '100%',
    paddingBottom: '20px'
  },
  matrixSection: { 
    width: '100%'
  },
  matrixCard: { 
    background: 'rgba(255,255,255,0.05)', 
    borderRadius: '10px', 
    padding: '15px', 
    border: '1px solid #4a4a6a', 
    width: '100%' 
  },
  tableContainer: { 
    overflowX: 'auto', 
    marginBottom: '5px', 
    width: '100%' 
  },
  table: { 
    width: '100%', 
    borderCollapse: 'collapse', 
    fontSize: '0.7rem', 
    minWidth: '500px' 
  },
  tableHeader: { 
    background: '#4a4a6a', 
    padding: '6px 4px', 
    textAlign: 'center', 
    fontWeight: 'bold', 
    border: '1px solid #5a5a7a' 
  },
  donorCell: { 
    background: '#4a4a6a', 
    padding: '6px 4px', 
    textAlign: 'center', 
    fontWeight: 'bold', 
    border: '1px solid #5a5a7a' 
  },
  compatCell: { 
    padding: '6px 4px', 
    textAlign: 'center', 
    fontWeight: 'bold', 
    border: '1px solid #5a5a7a', 
    transition: 'all 0.2s', 
    color: 'white' 
  },
  analysisSection: { 
    width: '100%'
  },
  analysisCard: { 
    background: 'rgba(255,255,255,0.05)', 
    borderRadius: '10px', 
    padding: '15px', 
    border: '1px solid #4a4a6a', 
    height: 'fit-content' 
  },
  analysisContent: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '10px' 
  },
  analysisGrid: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '10px' 
  },
  analysisItem: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '4px',
    background: 'rgba(0,0,0,0.2)',
    padding: '8px',
    borderRadius: '6px'
  },
  analysisLabel: { 
    color: '#a8a8c0', 
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  analysisValue: { 
    color: 'white', 
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  reasoningBox: { 
    background: 'rgba(0,0,0,0.3)', 
    padding: '12px', 
    borderRadius: '8px', 
    marginTop: '5px' 
  }
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `button:hover { transform: translateY(-1px); } * { box-sizing: border-box; }`;
  document.head.appendChild(style);
}