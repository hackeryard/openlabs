"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useChat } from "../../ChatContext";
import { useLab } from "@/app/hooks/useXP";
import ComponentTray from "./ComponentTray";
import CircuitCanvas from "./CircuitCanvas";
import PropertiesPanel from "./PropertiesPanel";
import SweepPlot from "./SweepPlot";
import { CircuitState, CircuitComponent, solveCircuit, ComponentType, SolverResult } from "./engine";
import { PRESETS } from "./presets";
import {
  Zap,
  RotateCcw,
  Undo2,
  Redo2,
  Trash2,
  Gauge,
  X,
  Keyboard,
  MousePointer,
  HelpCircle,
  Sparkles,
  Command,
} from "lucide-react";

export default function OhmsLawLab() {
  const { setExperimentData } = useChat();
  const { completeExperiment } = useLab("physics/ohmslaw", "physics", "simulation");

  const emptyState: CircuitState = { nodes: {}, components: {} };

  // State
  const [circuitState, setCircuitState] = useState<{
    past: CircuitState[];
    present: CircuitState;
    future: CircuitState[];
  }>({
    past: [],
    present: PRESETS["simple-series"],
    future: []
  });

  const circuit = circuitState.present;
  const past = circuitState.past;
  const future = circuitState.future;

  const [selectedTool, setSelectedTool] = useState<ComponentType | 'select' | 'delete' | 'probe_red' | 'probe_black'>('select');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  // Multimeter Visibility & Probes state (Closed by default)
  const [isMultimeterOpen, setIsMultimeterOpen] = useState<boolean>(false);
  const [probeRedNodeId, setProbeRedNodeId] = useState<string | null>(null);
  const [probeBlackNodeId, setProbeBlackNodeId] = useState<string | null>(null);

  // Shortcuts Reference Modal state
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);

  // Multimeter Drag State
  const [mmPos, setMmPos] = useState({ x: 0, y: 0 });
  const [isDraggingMm, setIsDraggingMm] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialMmX: 0, initialMmY: 0 });

  // History Management
  const setCircuit = (newStateOrUpdater: CircuitState | ((prev: CircuitState) => CircuitState)) => {
    setCircuitState(prev => {
      const next = typeof newStateOrUpdater === 'function' ? newStateOrUpdater(prev.present) : newStateOrUpdater;
      return { ...prev, present: next };
    });
  };

  const setCircuitWithHistory = (
    newStateOrUpdater: CircuitState | ((prev: CircuitState) => CircuitState)
  ) => {
    setCircuitState(prev => {
      const next = typeof newStateOrUpdater === 'function' ? newStateOrUpdater(prev.present) : newStateOrUpdater;
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: []
      };
    });
  };

  const handleUndo = React.useCallback(() => {
    setCircuitState(prev => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      return {
        past: prev.past.slice(0, -1),
        present: previous,
        future: [prev.present, ...prev.future]
      };
    });
  }, []);

  const handleRedo = React.useCallback(() => {
    setCircuitState(prev => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: prev.future.slice(1)
      };
    });
  }, []);

  const pushHistoryState = React.useCallback(() => {
    setCircuitState(prev => ({
      ...prev,
      past: [...prev.past, prev.present],
      future: []
    }));
  }, []);

  // Keyboard Shortcuts Listener for Fast Circuit Building
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.key) return;
      // Ignore if user is currently typing in an input box
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        return;
      }

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        return;
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Single-Key Tool Selection & Shortcuts (when no Ctrl/Meta modifier)
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        const key = e.key.toLowerCase();
        if (key === 'w') {
          setSelectedTool('wire');
        } else if (key === 'r') {
          setSelectedTool('resistor');
        } else if (key === 'b') {
          setSelectedTool('battery');
        } else if (key === 's') {
          setSelectedTool('switch');
        } else if (key === 'l') {
          setSelectedTool('bulb');
        } else if (key === 'a') {
          setSelectedTool('ammeter');
        } else if (key === 'v') {
          setSelectedTool('voltmeter');
        } else if (key === 'm') {
          setIsMultimeterOpen(prev => !prev);
        } else if (key === 'escape') {
          setSelectedTool('select');
          setSelectedComponentId(null);
          setIsShortcutsModalOpen(false);
        } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
          setIsShortcutsModalOpen(prev => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const [hasCompleted, setHasCompleted] = useState(false);
  const [sweepResults, setSweepResults] = useState<{ V: number; I: number }[]>([]);
  const [isSweeping, setIsSweeping] = useState(false);

  useEffect(() => {
    setExperimentData({
      title: "Ohm's Law Interactive Circuit Builder",
      theory: "A fully interactive nodal analysis circuit simulator verifying V = I·R across series, parallel, and complex resistive networks.",
      extraContext: "Explore changing voltage and resistance, probe voltages with the virtual multimeter, or run automated V-I sweeps.",
    });
  }, [setExperimentData]);

  const solverResultRef = useRef<SolverResult>({
    nodeVoltages: {}, componentCurrents: {}, componentVoltages: {}, componentPowers: {}, time: 0
  });
  const [solverResult, setSolverResult] = useState<SolverResult>(solverResultRef.current);
  const [timeSeriesData, setTimeSeriesData] = useState<{time: number, currents: Record<string, number>, voltages: Record<string, number>}[]>([]);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const animate = (time: number) => {
      const deltaMs = time - lastTime;
      lastTime = time;
      const dt = Math.min(deltaMs / 1000, 0.1);
      const newTime = (solverResultRef.current.time || 0) + dt;
      
      try {
        const result = solveCircuit(circuit, solverResultRef.current, dt, newTime);
        solverResultRef.current = result;
        setSolverResult(result);
        setTimeSeriesData(prev => {
          const newData = [...prev, { time: newTime, currents: result.componentCurrents, voltages: result.componentVoltages }];
          if (newData.length > 100) return newData.slice(newData.length - 100);
          return newData;
        });

        let blownFuses = false;
        const newComponents = { ...circuit.components };
        Object.values(newComponents).forEach(comp => {
          if (comp.type === 'fuse' && !comp.isOpen) {
            const max = comp.maxCurrent || 2;
            const current = Math.abs(result.componentCurrents[comp.id] || 0);
            if (current > max + 1e-4) {
              newComponents[comp.id] = { ...comp, isOpen: true };
              blownFuses = true;
            }
          }
        });
        if (blownFuses) {
          setCircuitState(prev => ({
            ...prev,
            present: { ...prev.present, components: newComponents }
          }));
        }
      } catch (e) {
        console.error("Solver error:", e);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [circuit]);

  const globalStats = useMemo(() => {
    let totalEmf = 0;
    let totalPower = 0;
    let maxSrcCurrent = 0;
    Object.values(circuit.components).forEach(comp => {
      const p = solverResult.componentPowers[comp.id] || 0;
      if (comp.type === 'battery') {
        totalEmf += comp.value;
        maxSrcCurrent = Math.max(maxSrcCurrent, Math.abs(solverResult.componentCurrents[comp.id] || 0));
      } else if (comp.type === 'resistor' || comp.type === 'bulb' || comp.type === 'potentiometer') {
        totalPower += p;
      }
    });
    const totalResistance = maxSrcCurrent > 0 ? totalEmf / maxSrcCurrent : 0;
    return { totalEmf, totalCurrent: maxSrcCurrent, totalResistance, totalPower };
  }, [circuit, solverResult]);

  useEffect(() => {
    if (hasCompleted) return;
    if (globalStats.totalPower > 0.01) {
      completeExperiment();
      setHasCompleted(true);
    }
  }, [globalStats.totalPower, completeExperiment, hasCompleted]);

  const handleAddComponent = (compData: Omit<CircuitComponent, 'id'>) => {
    const id = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    setCircuitWithHistory(prev => {
      const newNodes = { ...prev.nodes };
      [compData.node1, compData.node2].forEach(nodeId => {
        if (!newNodes[nodeId]) {
          const [x, y] = nodeId.split(',').map(Number);
          newNodes[nodeId] = { id: nodeId, x, y };
        }
      });
      return {
        nodes: newNodes,
        components: {
          ...prev.components,
          [id]: { ...compData, id }
        }
      };
    });
    if (compData.type !== 'wire') {
      setSelectedComponentId(id);
      setSelectedTool('select');
    }
  };

  const handleUpdateComponent = (id: string, updates: Partial<CircuitComponent>, saveHistory = true) => {
    const updater = (prev: CircuitState) => {
      if (!prev.components[id]) return prev;
      return {
        ...prev,
        components: {
          ...prev.components,
          [id]: { ...prev.components[id], ...updates }
        }
      };
    };
    if (saveHistory) {
      setCircuitWithHistory(updater);
    } else {
      setCircuit(updater);
    }
  };

  const handleDeleteComponent = (id: string) => {
    setCircuitWithHistory(prev => {
      const newComponents = { ...prev.components };
      delete newComponents[id];
      return { ...prev, components: newComponents };
    });
    if (selectedComponentId === id) setSelectedComponentId(null);
  };

  const handleMoveNode = (nodeId: string, x: number, y: number, saveHistory = false) => {
    const updater = (prev: CircuitState) => {
      const newNodes = { ...prev.nodes };
      const existingNodeAtPos = Object.values(newNodes).find(n => n.id !== nodeId && n.x === x && n.y === y);
      if (existingNodeAtPos) {
        const targetId = existingNodeAtPos.id;
        const newComponents = { ...prev.components };
        Object.keys(newComponents).forEach(compId => {
          const comp = newComponents[compId];
          let updated = false;
          const newComp = { ...comp };
          if (newComp.node1 === nodeId) { newComp.node1 = targetId; updated = true; }
          if (newComp.node2 === nodeId) { newComp.node2 = targetId; updated = true; }
          if (updated) newComponents[compId] = newComp;
        });
        delete newNodes[nodeId];
        return { nodes: newNodes, components: newComponents };
      } else {
        if (newNodes[nodeId]) newNodes[nodeId] = { ...newNodes[nodeId], x, y };
        return { ...prev, nodes: newNodes };
      }
    };
    if (saveHistory) setCircuitWithHistory(updater);
    else setCircuit(updater);
  };

  const runSweep = () => {
    const battery = Object.values(circuit.components).find(c => c.type === 'battery');
    if (!battery) { alert("Please place or select a battery to run the V-I sweep!"); return; }
    setIsSweeping(true);
    const results: { V: number; I: number }[] = [];
    let v = 1;
    const interval = setInterval(() => {
      if (v > 24) {
        clearInterval(interval);
        setIsSweeping(false);
        handleUpdateComponent(battery.id, { value: 12 });
        return;
      }
      const tempCircuit = {
        ...circuit,
        components: {
          ...circuit.components,
          [battery.id]: { ...battery, value: v }
        }
      };
      const res = solveCircuit(tempCircuit);
      const current = Math.abs(res.componentCurrents[battery.id] || 0);
      results.push({ V: v, I: current });
      setSweepResults([...results]);
      handleUpdateComponent(battery.id, { value: v }, false);
      v += 2;
    }, 120);
  };

  const exportCSV = () => {
    if (sweepResults.length === 0) { alert("Run a sweep first to generate data!"); return; }
    const csv = ["Voltage (V),Current (A)"];
    sweepResults.forEach(r => csv.push(`${r.V.toFixed(2)},${r.I.toFixed(3)}`));
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ohms_law_sweep.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full w-full bg-background relative overflow-hidden">
      {/* ─── Compact Top Header Toolbar ─── */}
      <div className="bg-card border-b border-border p-2.5 px-4 flex flex-wrap justify-between items-center gap-2 shadow-sm shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
            <Zap size={18} />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-foreground tracking-tight leading-none">
              Ohm&apos;s Law Circuit Simulator
            </h1>
            <span className="text-[10px] text-muted-foreground font-medium">
              V = I·R &bull; Nodal Analysis &bull; DC/AC Circuits &bull; V-I Sweep
            </span>
          </div>
        </div>

        {/* Toolbar Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Selector */}
          <div className="flex items-center gap-1">
            <select 
              className="px-2.5 py-1 bg-muted/60 border border-border rounded-xl text-xs font-bold text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              onChange={(e) => {
                if (e.target.value) {
                  setCircuitState({ past: [], present: PRESETS[e.target.value as keyof typeof PRESETS], future: [] });
                  e.target.value = "";
                }
              }}
              value=""
            >
              <option value="" disabled>Load Preset Circuit...</option>
              {Object.keys(PRESETS).map(key => (
                <option key={key} value={key}>{key.replace("-", " ").toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Multimeter Toggle Button */}
          <button
            onClick={() => {
              const nextState = !isMultimeterOpen;
              setIsMultimeterOpen(nextState);
              if (!nextState) {
                if (selectedTool.startsWith('probe_')) setSelectedTool('select');
              }
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-sm ${
              isMultimeterOpen
                ? "bg-amber-500 text-black border-amber-400 font-black"
                : "bg-card hover:bg-accent border-border text-muted-foreground hover:text-foreground"
            }`}
            title="Toggle Digital Multimeter (M)"
          >
            <Gauge size={13} />
            <span>Multimeter</span>
            <span className={`w-2 h-2 rounded-full ${isMultimeterOpen ? "bg-black" : "bg-slate-500"}`} />
          </button>

          {/* Shortcuts Reference Button */}
          <button
            onClick={() => setIsShortcutsModalOpen(true)}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition shadow-sm"
            title="Keyboard Shortcuts & Gestures (?)"
          >
            <Keyboard size={13} className="text-primary" />
            <span>Shortcuts</span>
            <kbd className="text-[9px] font-mono px-1 py-0.2 rounded bg-muted text-muted-foreground border border-border">?</kbd>
          </button>

          {/* Undo / Redo */}
          <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-xl border border-border">
            <button
              onClick={handleUndo}
              disabled={past.length === 0}
              className="p-1 rounded-lg hover:bg-accent disabled:opacity-30 transition text-muted-foreground hover:text-foreground"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={13} />
            </button>
            <button
              onClick={handleRedo}
              disabled={future.length === 0}
              className="p-1 rounded-lg hover:bg-accent disabled:opacity-30 transition text-muted-foreground hover:text-foreground"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={13} />
            </button>
          </div>

          {/* Clear Canvas */}
          <button 
            onClick={() => setCircuitState({ past: [], present: emptyState, future: [] })}
            className="px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <Trash2 size={12} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* ─── Main 3-Column Layout ─── */}
      <div className="flex flex-col lg:flex-row flex-1 items-stretch overflow-hidden">
        {/* Left: Component Tray with shortcut badges */}
        <ComponentTray 
          selectedTool={selectedTool} 
          onSelectTool={setSelectedTool}
          isMultimeterOpen={isMultimeterOpen}
          onToggleMultimeter={() => setIsMultimeterOpen(!isMultimeterOpen)}
          onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        />
        
        {/* Center: Interactive Circuit Canvas */}
        <div className="flex-1 bg-background flex flex-col relative min-h-0">
          <CircuitCanvas 
            state={circuit}
            solverResult={solverResult}
            timeSeriesData={timeSeriesData}
            selectedComponentId={selectedComponentId}
            selectedTool={selectedTool}
            onSelectComponent={setSelectedComponentId}
            onAddComponent={handleAddComponent}
            onDeleteComponent={handleDeleteComponent}
            onUpdateComponent={handleUpdateComponent}
            onMoveNode={handleMoveNode}
            onPushHistory={pushHistoryState}
            probeRedNodeId={probeRedNodeId}
            probeBlackNodeId={probeBlackNodeId}
            onSetProbe={(color, nodeId) => {
              if (color === 'red') setProbeRedNodeId(nodeId);
              else setProbeBlackNodeId(nodeId);
              setSelectedTool('select');
            }}
          />

          {/* Subtle Bottom Quick Gestures Hint Strip */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2 bg-card/85 backdrop-blur-md border border-border/80 px-2.5 py-1 rounded-xl shadow-sm text-[10px] text-muted-foreground pointer-events-none select-none">
            <span className="flex items-center gap-1 text-foreground font-bold">
              <MousePointer size={11} className="text-primary" />
              Gestures:
            </span>
            <span>Click &amp; drag on grid &bull; Double-click switch to toggle &bull; Right-click to delete</span>
          </div>
        </div>

        {/* Right: Properties Panel & V-I Sweep Plot */}
        <div className="w-full lg:w-72 flex flex-col lg:border-l border-border bg-card shrink-0 divide-y divide-border overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <PropertiesPanel 
              selectedComponentId={selectedComponentId}
              component={selectedComponentId ? circuit.components[selectedComponentId] : null}
              solverResult={solverResult}
              onUpdate={handleUpdateComponent}
              globalStats={globalStats}
              onPushHistory={pushHistoryState}
            />
          </div>
          <div className="h-52 shrink-0">
            <SweepPlot 
              sweepResults={sweepResults} 
              currentOperatingPoint={{ V: globalStats.totalEmf, I: globalStats.totalCurrent }} 
              onRunSweep={runSweep}
              onExportCSV={exportCSV}
              isSweeping={isSweeping}
            />
          </div>
        </div>
      </div>

      {/* ─── Closable / Draggable Multimeter Overlay (Rendered only when active) ─── */}
      {isMultimeterOpen && (
        <div 
          className={`absolute bottom-6 right-80 bg-slate-950/95 backdrop-blur-md border-2 border-amber-500/50 rounded-2xl shadow-2xl p-3 w-52 touch-none select-none ${isDraggingMm ? 'cursor-grabbing opacity-90 scale-105' : 'cursor-grab'} z-50 animate-in fade-in zoom-in-95 duration-150`}
          style={{ transform: `translate(${mmPos.x}px, ${mmPos.y}px)` }}
          onPointerDown={(e) => {
            setIsDraggingMm(true);
            dragRef.current = { startX: e.clientX, startY: e.clientY, initialMmX: mmPos.x, initialMmY: mmPos.y };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!isDraggingMm) return;
            setMmPos({
              x: dragRef.current.initialMmX + (e.clientX - dragRef.current.startX),
              y: dragRef.current.initialMmY + (e.clientY - dragRef.current.startY)
            });
          }}
          onPointerUp={(e) => {
            setIsDraggingMm(false);
            e.currentTarget.releasePointerCapture(e.pointerId);
          }}
        >
          <div className="flex items-center justify-between mb-1.5 border-b border-border/60 pb-1">
            <div className="flex items-center gap-1.5">
              <Gauge size={13} className="text-amber-500" />
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider">Digital Multimeter</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1">
                <div className={`w-2.5 h-2.5 rounded-full border ${probeRedNodeId ? 'bg-red-500 border-red-300 animate-pulse' : 'bg-slate-800 border-slate-700'}`} title="Red Probe (+)" />
                <div className={`w-2.5 h-2.5 rounded-full border ${probeBlackNodeId ? 'bg-slate-200 border-white animate-pulse' : 'bg-slate-800 border-slate-700'}`} title="Black Probe (-)" />
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMultimeterOpen(false);
                  if (selectedTool.startsWith('probe_')) setSelectedTool('select');
                }}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
                title="Close Multimeter"
              >
                <X size={12} />
              </button>
            </div>
          </div>
          
          <div className="bg-black/90 p-2 rounded-xl border border-white/10 shadow-inner">
            <div className="font-mono text-xl text-right font-black text-amber-400 tracking-wider">
              {probeRedNodeId && probeBlackNodeId ? 
                ((solverResult.nodeVoltages[probeRedNodeId] || 0) - (solverResult.nodeVoltages[probeBlackNodeId] || 0)).toFixed(2)
                : '---.--'} <span className="text-xs text-amber-500/80">V</span>
            </div>
          </div>
          
          {(!probeRedNodeId || !probeBlackNodeId) ? (
            <div className="text-center mt-1.5 text-[9px] text-slate-400 font-medium">
              Select Red (+) and Black (-) probes from left toolbox to measure
            </div>
          ) : (
            <button
              onClick={() => {
                setProbeRedNodeId(null);
                setProbeBlackNodeId(null);
              }}
              className="w-full mt-1.5 py-0.5 text-[9px] bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-md border border-slate-800 transition"
            >
              Clear Probes
            </button>
          )}
        </div>
      )}

      {/* ─── Keyboard Shortcuts & Mouse Gestures Reference Modal ─── */}
      {isShortcutsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Keyboard size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-foreground">Keyboard Shortcuts &amp; Mouse Gestures</h3>
                  <span className="text-[10px] text-muted-foreground font-medium">Build and analyze circuits at lightning speed</span>
                </div>
              </div>
              <button
                onClick={() => setIsShortcutsModalOpen(false)}
                className="p-1.5 hover:bg-accent rounded-xl text-muted-foreground hover:text-foreground transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Tool Hotkeys */}
              <div className="p-3 bg-muted/20 border border-border/70 rounded-2xl space-y-2">
                <span className="text-[10px] font-black uppercase text-primary block tracking-wider">
                  Tool Selection Hotkeys
                </span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {[
                    { key: "W", label: "Wire (0 Ω)" },
                    { key: "R", label: "Resistor" },
                    { key: "B", label: "Battery (DC/AC)" },
                    { key: "S", label: "Switch" },
                    { key: "L", label: "Lightbulb" },
                    { key: "A", label: "Ammeter" },
                    { key: "V", label: "Voltmeter" },
                    { key: "M", label: "Toggle Multimeter" },
                    { key: "Esc", label: "Select / Move tool" },
                  ].map((s) => (
                    <div key={s.key} className="flex justify-between items-center">
                      <span className="text-muted-foreground font-sans text-xs">{s.label}</span>
                      <kbd className="px-1.5 py-0.5 rounded bg-card border border-border shadow-sm font-bold text-foreground">{s.key}</kbd>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editing & Mouse Gestures */}
              <div className="space-y-3">
                <div className="p-3 bg-muted/20 border border-border/70 rounded-2xl space-y-2">
                  <span className="text-[10px] font-black uppercase text-amber-500 block tracking-wider">
                    Editing Actions
                  </span>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-sans text-xs">Delete Selected</span>
                      <kbd className="px-1.5 py-0.5 rounded bg-card border border-border shadow-sm font-bold text-rose-400">Del / Backspace</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-sans text-xs">Undo</span>
                      <kbd className="px-1.5 py-0.5 rounded bg-card border border-border shadow-sm font-bold text-foreground">Ctrl + Z</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-sans text-xs">Redo</span>
                      <kbd className="px-1.5 py-0.5 rounded bg-card border border-border shadow-sm font-bold text-foreground">Ctrl + Y</kbd>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-muted/20 border border-border/70 rounded-2xl space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-emerald-500 block tracking-wider">
                    Mouse Gestures
                  </span>
                  <ul className="text-[11px] text-muted-foreground space-y-1 list-disc pl-3.5 leading-relaxed">
                    <li><strong className="text-foreground">Click &amp; Drag:</strong> Connect two grid dots to place a component or wire.</li>
                    <li><strong className="text-foreground">Double Click:</strong> Double-click any switch to toggle open/closed.</li>
                    <li><strong className="text-foreground">Right Click:</strong> Right-click any component to delete it immediately.</li>
                    <li><strong className="text-foreground">Drag Node:</strong> Grab any circuit intersection to move or merge nodes.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex justify-end">
              <button
                onClick={() => setIsShortcutsModalOpen(false)}
                className="px-4 py-1.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-sm transition hover:bg-primary/90"
              >
                Got It, Let&apos;s Build!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
