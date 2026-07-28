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
import { Zap } from "lucide-react";

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

  // Probes state
  const [probeRedNodeId, setProbeRedNodeId] = useState<string | null>(null);
  const [probeBlackNodeId, setProbeBlackNodeId] = useState<string | null>(null);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
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
      title: "Ohm's Law Circuit Builder",
      theory: "A fully interactive nodal analysis circuit simulator.",
      extraContext: "If the user asks for help building a circuit, suggest checking the presets dropdown.",
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
          if (newData.length > 150) return newData.slice(newData.length - 150);
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
      } else if (comp.type === 'resistor' || comp.type === 'bulb') {
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
    if (!battery) { alert("No battery found to sweep voltage!"); return; }
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
    }, 150);
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
    <div className="flex flex-col min-h-full w-full bg-background relative">
      <div className="bg-card border-b border-border p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Zap className="text-yellow-500" />
              Ohm's Law Simulator
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Drag tools from the tray onto the grid to build your circuit. 
              Switch to "Select / Move" to edit properties.
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setCircuitState({ past: [], present: emptyState, future: [] })}
              className="px-4 py-2 border border-border rounded-md hover:bg-accent text-sm font-medium"
            >
              Clear Canvas
            </button>
            <select 
              className="px-4 py-2 bg-background border border-border rounded-md hover:bg-accent text-sm font-medium cursor-pointer"
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
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
      </div>

      <div className="flex flex-1 items-stretch">
        <ComponentTray selectedTool={selectedTool} onSelectTool={setSelectedTool} />
        
        <div className="flex-1 bg-background flex flex-col relative border-x border-border/50">
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
        </div>

        <div className="w-72 flex flex-col border-l border-border bg-card">
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
          <div className="min-h-48 border-t border-border">
            <SweepPlot 
              sweepResults={sweepResults} 
              currentOperatingPoint={{ V: globalStats.totalEmf, I: globalStats.totalCurrent }} 
            />
          </div>
        </div>
      </div>

      {/* Multimeter UI (Fixed Position) */}
      <div 
        className={`fixed bottom-32 left-72 bg-card border border-border rounded-lg shadow-xl p-3 w-48 touch-none select-none ${isDraggingMm ? 'cursor-grabbing opacity-90 scale-105' : 'cursor-grab'}`}
        style={{ transform: `translate(${mmPos.x}px, ${mmPos.y}px)`, zIndex: 9999 }}
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
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Multimeter</div>
          <div className="flex gap-1">
            <div className={`w-2 h-2 rounded-full ${probeRedNodeId ? 'bg-red-500' : 'bg-muted'}`} />
            <div className={`w-2 h-2 rounded-full ${probeBlackNodeId ? 'bg-zinc-800' : 'bg-muted'}`} />
          </div>
        </div>
        
        <div className="bg-muted p-2 rounded">
          <div className="font-mono text-xl text-right font-medium">
            {probeRedNodeId && probeBlackNodeId ? 
              ((solverResult.nodeVoltages[probeRedNodeId] || 0) - (solverResult.nodeVoltages[probeBlackNodeId] || 0)).toFixed(2)
              : '---'} V
          </div>
        </div>
        
        {(!probeRedNodeId || !probeBlackNodeId) && (
          <div className="text-center mt-2 text-[10px] text-muted-foreground">
            Select probes from tray
          </div>
        )}
      </div>
    </div>
  );
}
