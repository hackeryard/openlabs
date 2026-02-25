"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== UTILS: STATISTICAL MODELS ====================
const generateData = () => {
  const points = [];
  // Cluster 1: Regular User Behavior
  for (let i = 0; i < 80; i++) {
    points.push({
      id: `p-${i}`,
      x: 300 + Math.random() * 100,
      y: 200 + Math.random() * 100,
      z: 50 + Math.random() * 50,
      amount: Math.random() * 50,
      type: 'normal',
      label: 'Standard Transaction',
      detected: false
    });
  }
  // Cluster 2: Business Expenses
  for (let i = 0; i < 40; i++) {
    points.push({
      id: `b-${i}`,
      x: 500 + Math.random() * 80,
      y: 400 + Math.random() * 80,
      z: 100 + Math.random() * 30,
      amount: 200 + Math.random() * 100,
      type: 'normal',
      label: 'Business Expense',
      detected: false
    });
  }
  return points;
};

export default function AnomalyDetectionLab() {
  const [data, setData] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [threshold, setThreshold] = useState(150);
  const [view, setView] = useState('2d');
  const [scanActive, setScanActive] = useState(false);
  const [detectedAnomalies, setDetectedAnomalies] = useState([]);

  useEffect(() => {
    setData(generateData());
  }, []);

  // ==================== ANOMALY DETECTION LOGIC ====================
  const processedData = useMemo(() => {
    const centerX = 350;
    const centerY = 250;
    
    return data.map(p => {
      const distance = Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2));
      const isAnomaly = distance > threshold;
      return {
        ...p,
        distance,
        isAnomaly,
        anomalyScore: (distance / 500).toFixed(2)
      };
    });
  }, [data, threshold]);

  // Monitor effect - detects anomalies when scan is active
  useEffect(() => {
    let interval;
    if (scanActive) {
      interval = setInterval(() => {
        // Find undetected anomalies
        const undetectedAnomalies = processedData.filter(p => 
          p.isAnomaly && !p.detected
        );
        
        if (undetectedAnomalies.length > 0) {
          // Randomly select one undetected anomaly to "discover"
          const randomIndex = Math.floor(Math.random() * undetectedAnomalies.length);
          const newAnomaly = undetectedAnomalies[randomIndex];
          
          setDetectedAnomalies(prev => [...prev, newAnomaly.id]);
          
          // Update the data to mark this point as detected
          setData(prevData => 
            prevData.map(point => 
              point.id === newAnomaly.id 
                ? { ...point, detected: true }
                : point
            )
          );
        }
      }, 800); // Detect new anomaly every 800ms
    }
    
    return () => clearInterval(interval);
  }, [scanActive, processedData]);

  const injectAttack = () => {
    const attackPoint = {
      id: `attack-${Date.now()}`,
      x: 100 + Math.random() * 700,
      y: 100 + Math.random() * 400,
      z: 200,
      amount: 5000,
      type: 'malicious',
      label: 'Suspicious Foreign IP',
      detected: false
    };
    setData(prev => [...prev, attackPoint]);
  };

  const resetMonitor = () => {
    setScanActive(false);
    setDetectedAnomalies([]);
    setData(prevData => 
      prevData.map(point => ({ ...point, detected: false }))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
            ANOMALY DETECTION LAB
          </h1>
          <p className="text-slate-400">Statistical Outlier Analysis for Fraud & Network Security</p>
        </div>
        <div className="flex gap-4">
          <button onClick={injectAttack} className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition">
            Inject Malicious Packet
          </button>
          <button onClick={() => {
            setData(generateData());
            resetMonitor();
          }} className="bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
            Reset Dataset
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Controls */}
        <div className="col-span-3 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Sensitivity Threshold</h2>
            <input 
              type="range" min="50" max="400" value={threshold} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setThreshold(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
            <div className="flex justify-between text-xs mt-2 font-mono">
              <span>RELAXED</span>
              <span className="text-cyan-400">{threshold}px</span>
              <span>STRICT</span>
            </div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              *Lowering threshold increases <strong>False Positives</strong>. Raising it increases <strong>Security Risk</strong>.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Detection Insights</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs">Normal Traffic</span>
                <span className="text-cyan-400 font-mono">{processedData.filter(d => !d.isAnomaly).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-red-400">Total Threats</span>
                <span className="text-red-400 font-mono">{processedData.filter(d => d.isAnomaly).length}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-xs text-yellow-400">Detected</span>
                <span className="text-yellow-400 font-mono">{detectedAnomalies.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Remaining</span>
                <span className="text-slate-500 font-mono">{processedData.filter(d => d.isAnomaly).length - detectedAnomalies.length}</span>
              </div>
            </div>
          </div>

          {/* Monitor Status */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Monitor Status</h2>
              <span className={`px-2 py-1 rounded-full text-xs ${scanActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
                {scanActive ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setScanActive(true)}
                disabled={scanActive}
                className="flex-1 bg-cyan-500 text-slate-950 px-4 py-2 rounded-full font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                START
              </button>
              <button 
                onClick={resetMonitor}
                className="flex-1 bg-slate-800 text-slate-300 px-4 py-2 rounded-full font-bold text-sm hover:bg-slate-700"
              >
                RESET
              </button>
            </div>
          </div>
        </div>

        {/* Main Visualizer */}
        <div className="col-span-9 relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden h-[600px]">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          {/* The Data Plot */}
          <svg className="w-full h-full">
            <AnimatePresence>
              {processedData.map((point) => {
                // Determine point color based on status
                let fillColor = '#22d3ee'; // default cyan for normal
                if (point.isAnomaly) {
                  fillColor = detectedAnomalies.includes(point.id) ? '#ef4444' : '#f97316'; // red if detected, orange if undetected
                }
                
                return (
                  <motion.circle
                    key={point.id}
                    initial={{ r: 0 }}
                    animate={{ 
                      r: selectedPoint?.id === point.id ? 12 : (point.isAnomaly ? 7 : 5),
                      cx: point.x,
                      cy: point.y,
                      fill: fillColor,
                    }}
                    whileHover={{ r: 15, strokeWidth: 2, stroke: '#fff' }}
                    className="cursor-crosshair"
                    onClick={() => setSelectedPoint(point)}
                  />
                );
              })}
            </AnimatePresence>

            {/* Radar Scan Animation */}
            {scanActive && (
              <motion.circle
                cx="350" cy="250"
                initial={{ r: 0, opacity: 0.5 }}
                animate={{ r: 800, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="fill-none stroke-cyan-500 stroke-1"
              />
            )}

            {/* Detection Pulse Effect */}
            {scanActive && detectedAnomalies.map((id, index) => {
              const point = processedData.find(p => p.id === id);
              if (!point) return null;
              return (
                <motion.circle
                  key={`pulse-${id}`}
                  cx={point.x}
                  cy={point.y}
                  initial={{ r: 10, opacity: 0.8 }}
                  animate={{ r: 30, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="fill-none stroke-red-500 stroke-2"
                />
              );
            })}
          </svg>

          {/* Point Info Overlay */}
          {selectedPoint && (
            <motion.div 
              initial={{ x: 20, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }}
              className="absolute top-6 right-6 w-64 bg-slate-950/90 border border-slate-700 p-6 rounded-xl backdrop-blur-md shadow-2xl"
            >
              <h3 className={`text-lg font-bold ${selectedPoint.isAnomaly ? 'text-red-400' : 'text-cyan-400'}`}>
                {selectedPoint.isAnomaly ? '⚠️ ANOMALY' : '✓ VERIFIED'}
                {selectedPoint.detected && selectedPoint.isAnomaly && ' 🔴 DETECTED'}
              </h3>
              <div className="mt-4 space-y-2 text-xs font-mono">
                <p><span className="text-slate-500">Source:</span> {selectedPoint.label}</p>
                <p><span className="text-slate-500">Z-Score:</span> {selectedPoint.anomalyScore}</p>
                <p><span className="text-slate-500">Vector:</span> [{Math.round(selectedPoint.x)}, {Math.round(selectedPoint.y)}]</p>
                <p><span className="text-slate-500">Status:</span> {selectedPoint.detected ? 'Detected' : (selectedPoint.isAnomaly ? 'Undetected' : 'Normal')}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="text-[10px] text-slate-400 italic">
                  {selectedPoint.isAnomaly 
                    ? selectedPoint.detected
                      ? "Detected by monitoring system: This anomalous point has been flagged for investigation."
                      : "Undetected anomaly: This point is outside normal parameters but hasn't been caught by monitoring yet."
                    : "Data point matches historical distribution patterns."}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}