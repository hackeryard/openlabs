"use client";

import React, { useState, useRef, useEffect } from "react";
import { CircuitState, CircuitNode, CircuitComponent, SolverResult, ComponentType } from "./engine";

interface CircuitCanvasProps {
  state: CircuitState;
  solverResult: SolverResult;
  timeSeriesData?: { time: number; currents: Record<string, number>; voltages: Record<string, number> }[];
  selectedTool: ComponentType | 'select' | 'delete' | 'probe_red' | 'probe_black';
  onAddComponent: (comp: Omit<CircuitComponent, 'id'>) => void;
  onDeleteComponent: (id: string) => void;
  onUpdateComponent: (id: string, updates: Partial<CircuitComponent>) => void;
  onMoveNode: (nodeId: string, x: number, y: number) => void;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onPushHistory: () => void;
  probeRedNodeId?: string | null;
  probeBlackNodeId?: string | null;
  onSetProbe?: (color: 'red' | 'black', nodeId: string) => void;
}

const GRID_SIZE = 20;

function snapToGrid(x: number, y: number) {
  return {
    x: Math.round(x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(y / GRID_SIZE) * GRID_SIZE,
  };
}

export default function CircuitCanvas({
  state,
  solverResult,
  timeSeriesData,
  selectedTool,
  onAddComponent,
  onDeleteComponent,
  onUpdateComponent,
  selectedComponentId,
  onSelectComponent,
  onMoveNode,
  onPushHistory,
  probeRedNodeId,
  probeBlackNodeId,
  onSetProbe,
}: CircuitCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number } | null>(null);
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number } | null>(null);
  
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  // Keyboard shortcut for deleting selected component
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedComponentId) {
        if (document.activeElement?.tagName === 'INPUT') return;
        onDeleteComponent(selectedComponentId);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedComponentId, onDeleteComponent]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const snapped = snapToGrid(x, y);

    if (selectedTool === 'select' || selectedTool.startsWith('probe_')) {
      const clickedNode = Object.values(state.nodes).find(n => 
        Math.hypot(n.x - snapped.x, n.y - snapped.y) < 15
      );
      
      if (clickedNode) {
        if (selectedTool === 'probe_red') {
          onSetProbe?.('red', clickedNode.id);
          return;
        } else if (selectedTool === 'probe_black') {
          onSetProbe?.('black', clickedNode.id);
          return;
        }

        setDraggingNodeId(clickedNode.id);
        onPushHistory();
        return;
      }
      onSelectComponent(null);
      return;
    }

    if (selectedTool === 'delete') {
      onSelectComponent(null);
      return;
    }

    setStartPoint(snapped);
    setCurrentPoint(snapped);
    setIsDrawing(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const snapped = snapToGrid(x, y);
    
    setHoverPoint(snapped);

    if (draggingNodeId) {
      onMoveNode(draggingNodeId, snapped.x, snapped.y);
      return;
    }

    if (isDrawing) {
      setCurrentPoint(snapped);
    }
  };

  const handlePointerUp = () => {
    if (draggingNodeId) {
      setDraggingNodeId(null);
      return;
    }

    if (!isDrawing || !startPoint || !currentPoint) {
      setIsDrawing(false);
      return;
    }

    if (startPoint.x !== currentPoint.x || startPoint.y !== currentPoint.y) {
      const startNode = Object.values(state.nodes).find(n => n.x === startPoint.x && n.y === startPoint.y);
      const endNode = Object.values(state.nodes).find(n => n.x === currentPoint.x && n.y === currentPoint.y);

      const node1Id = startNode ? startNode.id : `${startPoint.x},${startPoint.y}`;
      const node2Id = endNode ? endNode.id : `${currentPoint.x},${currentPoint.y}`;
      
      let initialValue = 0;
      if (selectedTool === 'battery') initialValue = 9;
      if (selectedTool === 'resistor') initialValue = 10;
      if (selectedTool === 'bulb') initialValue = 5;
      if (selectedTool === 'led') initialValue = 10; 
      if (selectedTool === 'potentiometer') initialValue = 50;
      if (selectedTool === 'capacitor') initialValue = 0.001;
      
      onAddComponent({
        type: selectedTool as ComponentType,
        node1: node1Id,
        node2: node2Id,
        value: initialValue,
        isOpen: false,
        internalResistance: 0.05,
        maxCurrent: selectedTool === 'fuse' ? 2 : undefined,
        color: selectedTool === 'led' ? '#ef4444' : undefined,
      });
    }

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
  };

  const handleComponentClick = (e: React.MouseEvent, compId: string) => {
    e.stopPropagation();
    if (selectedTool === 'delete') {
      onDeleteComponent(compId);
    } else {
      onSelectComponent(compId);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, compId?: string) => {
    e.preventDefault();
    if (compId) {
      e.stopPropagation();
      onDeleteComponent(compId);
    }
  };

  const handleComponentDoubleClick = (e: React.MouseEvent, comp: CircuitComponent) => {
    e.stopPropagation();
    if (comp.type === 'switch') {
      onUpdateComponent(comp.id, { isOpen: !comp.isOpen });
    }
  };

  const nodes = Object.values(state.nodes);
  const components = Object.values(state.components);

  // Animation logic for current flow
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    const animate = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;
      setOffset(prev => prev + dt * 0.04);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const renderComponentShape = (comp: CircuitComponent) => {
    const n1 = state.nodes[comp.node1];
    const n2 = state.nodes[comp.node2];
    if (!n1 || !n2) return null;

    const dx = n2.x - n1.x;
    const dy = n2.y - n1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    const midX = (n1.x + n2.x) / 2;
    const midY = (n1.y + n2.y) / 2;

    const isSelected = selectedComponentId === comp.id;
    const strokeColor = isSelected ? "#38bdf8" : "#94a3b8";
    const strokeWidth = isSelected ? 3.5 : 2;

    const current = solverResult.componentCurrents[comp.id] || 0;
    const voltage = solverResult.componentVoltages[comp.id] || 0;
    const hasCurrent = Math.abs(current) > 1e-4;
    
    const isUpsideDown = Math.abs(angle) > 90;
    const textTransform = isUpsideDown ? `rotate(180)` : ``;
    const textYOffset = isUpsideDown ? 22 : -18;

    return (
      <g 
        key={comp.id} 
        transform={`translate(${midX}, ${midY}) rotate(${angle})`}
        onClick={(e) => handleComponentClick(e, comp.id)}
        onContextMenu={(e) => handleContextMenu(e, comp.id)}
        onDoubleClick={(e) => handleComponentDoubleClick(e, comp)}
        className="cursor-pointer group"
      >
        <rect x={-length/2} y={-16} width={length} height={32} fill="transparent" />
        
        <line x1={-length/2} y1={0} x2={-15} y2={0} stroke={strokeColor} strokeWidth={strokeWidth} />
        <line x1={15} y1={0} x2={length/2} y2={0} stroke={strokeColor} strokeWidth={strokeWidth} />

        {comp.type === 'wire' && (
          <line x1={-15} y1={0} x2={15} y2={0} stroke={strokeColor} strokeWidth={strokeWidth} />
        )}

        {comp.type === 'resistor' && (
          <g>
            <polyline 
              points="-15,0 -10,-8 -5,8 0,-8 5,8 10,-8 15,0" 
              fill="none" 
              stroke={strokeColor} 
              strokeWidth={strokeWidth} 
            />
            <text x={0} y={textYOffset} fontSize="11" fontWeight="bold" fill="currentColor" textAnchor="middle" transform={textTransform}>
              {comp.value}Ω
            </text>
          </g>
        )}

        {comp.type === 'battery' && (
          <g>
            <line x1={-15} y1={0} x2={-5} y2={0} stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1={5} y1={0} x2={15} y2={0} stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1={-5} y1={-12} x2={-5} y2={12} stroke="#38bdf8" strokeWidth={strokeWidth} />
            <line x1={5} y1={-6} x2={5} y2={6} stroke="#f43f5e" strokeWidth={strokeWidth * 1.8} />
            <text x={-12} y={-14} fontSize="9" fontWeight="bold" fill="#38bdf8" textAnchor="middle">+</text>
            <text x={0} y={textYOffset} fontSize="11" fontWeight="bold" fill="currentColor" textAnchor="middle" transform={textTransform}>
              {comp.value}V
            </text>
          </g>
        )}

        {comp.type === 'potentiometer' && (
          <g>
            <polyline 
              points="-15,0 -10,-8 -5,8 0,-8 5,8 10,-8 15,0" 
              fill="none" 
              stroke={strokeColor} 
              strokeWidth={strokeWidth} 
            />
            <line x1={-10} y1={10} x2={10} y2={-10} stroke="#f59e0b" strokeWidth={strokeWidth} />
            <polygon points="10,-10 5,-10 9,-6" fill="#f59e0b" />
            <text x={0} y={textYOffset} fontSize="11" fontWeight="bold" fill="currentColor" textAnchor="middle" transform={textTransform}>
              {comp.value}Ω
            </text>
          </g>
        )}

        {comp.type === 'fuse' && (
          <g>
            <rect x={-12} y={-6} width={24} height={12} rx={2} fill="transparent" stroke={strokeColor} strokeWidth={strokeWidth} />
            {comp.isOpen ? (
              <text x={0} y={4} fontSize="13" fontWeight="bold" fill="#ef4444" textAnchor="middle">×</text>
            ) : (
              <line x1={-12} y1={0} x2={12} y2={0} stroke="#10b981" strokeWidth={strokeWidth} />
            )}
          </g>
        )}

        {comp.type === 'led' && (
          <g>
            <polygon points="-5,-8 -5,8 5,0" fill="transparent" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1={5} y1={-8} x2={5} y2={8} stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1={-15} y1={0} x2={-5} y2={0} stroke={strokeColor} strokeWidth={strokeWidth} />
            
            {(() => {
              const p = solverResult.componentPowers[comp.id] || 0;
              if (current > 1e-4 && p > 0.001) {
                const color = comp.color || '#ef4444';
                const intensity = Math.min(p / 0.1, 1);
                return <circle cx={0} cy={0} r={12 + intensity * 8} fill={color} opacity={0.25 + intensity * 0.5} pointerEvents="none" />;
              }
              return null;
            })()}
          </g>
        )}

        {comp.type === 'switch' && (
          <g>
            {comp.isOpen ? (
              <line x1={-15} y1={0} x2={8} y2={-10} stroke="#f43f5e" strokeWidth={strokeWidth} />
            ) : (
              <line x1={-15} y1={0} x2={15} y2={0} stroke="#10b981" strokeWidth={strokeWidth} />
            )}
            <circle cx={-15} cy={0} r={3} fill={strokeColor} />
            <circle cx={15} cy={0} r={3} fill={strokeColor} />
          </g>
        )}

        {comp.type === 'capacitor' && (
          <g>
            <line x1={-4} y1={-10} x2={-4} y2={10} stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1={4} y1={-10} x2={4} y2={10} stroke={strokeColor} strokeWidth={strokeWidth} />
          </g>
        )}

        {comp.type === 'ammeter' && (
          <g>
            <circle cx={0} cy={0} r={13} fill="var(--card)" stroke="#38bdf8" strokeWidth={strokeWidth} />
            <text x={0} y={4} fontSize="11" fontWeight="bold" fill="#38bdf8" textAnchor="middle">A</text>
            <text x={0} y={textYOffset} fontSize="11" fontWeight="bold" fill="currentColor" textAnchor="middle" transform={textTransform}>
              {Math.abs(current).toFixed(3)}A
            </text>
          </g>
        )}

        {comp.type === 'voltmeter' && (
          <g>
            <circle cx={0} cy={0} r={13} fill="var(--card)" stroke="#f59e0b" strokeWidth={strokeWidth} />
            <text x={0} y={4} fontSize="11" fontWeight="bold" fill="#f59e0b" textAnchor="middle">V</text>
            <text x={0} y={textYOffset} fontSize="11" fontWeight="bold" fill="currentColor" textAnchor="middle" transform={textTransform}>
              {voltage.toFixed(2)}V
            </text>
          </g>
        )}

        {comp.type === 'bulb' && (
          <g>
            <circle cx={0} cy={0} r={14} fill={strokeColor} fillOpacity="0.1" />
            <path d="M -7 -4 Q 0 -11 7 -4 L 3 4 L -3 4 Z" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1={-3} y1={4} x2={-2} y2={8} stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1={3} y1={4} x2={2} y2={8} stroke={strokeColor} strokeWidth={strokeWidth} />
            
            {(() => {
              const p = solverResult.componentPowers[comp.id] || 0;
              if (p > 0.01) {
                const maxP = 20;
                const intensity = Math.min(p / maxP, 1);
                return (
                  <circle 
                    cx={0} 
                    cy={0} 
                    r={14 + intensity * 16} 
                    fill="#fbbf24" 
                    opacity={0.3 + intensity * 0.5} 
                    className="filter blur-[2px] pointer-events-none"
                  />
                );
              }
              return null;
            })()}
          </g>
        )}
        
        {/* Animated current flow indicators */}
        {hasCurrent && (
          <g transform={current < 0 ? "rotate(180)" : ""}>
            {(() => {
              const visualCurrent = Math.abs(current);
              const speedMult = Math.min(visualCurrent, 4); 
              if (speedMult < 0.001) return null;

              const finalOffset = -offset * speedMult;
              
              return (
                <line 
                  x1={-length/2} y1={0} x2={length/2} y2={0} 
                  stroke="#38bdf8"
                  strokeWidth={3} 
                  strokeDasharray="4 14" 
                  strokeDashoffset={finalOffset} 
                  fill="none" 
                  pointerEvents="none"
                  opacity={0.8}
                />
              );
            })()}
          </g>
        )}
      </g>
    );
  };

  return (
    <div className="flex-1 w-full min-h-full relative overflow-hidden bg-background">
      {/* ─── High-Contrast Grid Dots Pattern ─── */}
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        <defs>
          <pattern id="dot-grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
            <circle cx="0" cy="0" r="1.8" className="fill-slate-500 dark:fill-slate-400 opacity-60 dark:opacity-50" />
            <circle cx={GRID_SIZE} cy="0" r="1.8" className="fill-slate-500 dark:fill-slate-400 opacity-60 dark:opacity-50" />
            <circle cx="0" cy={GRID_SIZE} r="1.8" className="fill-slate-500 dark:fill-slate-400 opacity-60 dark:opacity-50" />
            <circle cx={GRID_SIZE} cy={GRID_SIZE} r="1.8" className="fill-slate-500 dark:fill-slate-400 opacity-60 dark:opacity-50" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>

      <svg 
        ref={svgRef}
        width="100%" 
        height="100%" 
        style={{ position: 'relative', zIndex: 10, touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onContextMenu={(e) => handleContextMenu(e)}
      >
        {isDrawing && startPoint && currentPoint && (
          <line 
            x1={startPoint.x} 
            y1={startPoint.y} 
            x2={currentPoint.x} 
            y2={currentPoint.y} 
            stroke="#38bdf8" 
            strokeWidth="2.5" 
            strokeDasharray="4 4" 
          />
        )}

        {hoverPoint && !isDrawing && !draggingNodeId && (
          <circle 
            cx={hoverPoint.x} 
            cy={hoverPoint.y} 
            r={5.5} 
            fill="none" 
            stroke="#38bdf8" 
            strokeWidth="2" 
            opacity="0.8"
            pointerEvents="none"
          />
        )}

        {components.map(renderComponentShape)}

        {/* ─── High-Contrast Node Connection Dots ─── */}
        {nodes.map(node => {
          const isRed = probeRedNodeId === node.id;
          const isBlack = probeBlackNodeId === node.id;
          
          return (
            <g key={node.id}>
              {/* Outer halo */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isRed || isBlack ? 7 : 5}
                fill={isRed ? 'rgba(239, 68, 68, 0.4)' : isBlack ? 'rgba(15, 23, 42, 0.5)' : 'rgba(56, 189, 248, 0.25)'}
              />
              {/* Core circle */}
              <circle 
                cx={node.x} 
                cy={node.y} 
                r={isRed || isBlack ? 5.5 : 4} 
                fill={isRed ? '#ef4444' : isBlack ? '#0f172a' : '#38bdf8'} 
                stroke="#ffffff"
                strokeWidth={1.5}
                className={selectedTool.startsWith('probe_') ? 'cursor-crosshair transition-all' : 'transition-all cursor-move'}
              />
            </g>
          );
        })}
      </svg>

      {/* Real-Time Oscilloscope Overlay for selected component */}
      {selectedComponentId && timeSeriesData && timeSeriesData.length > 0 && (
        <div className="absolute bottom-3 left-3 right-3 bg-card/90 backdrop-blur-md border border-border rounded-xl shadow-lg p-2.5 pointer-events-none max-w-sm" style={{ height: '95px' }}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Oscilloscope: {state.components[selectedComponentId]?.type}
            </span>
            <span className="text-[10px] font-mono text-primary font-bold">
              {solverResult.componentVoltages[selectedComponentId]?.toFixed(2)}V
            </span>
          </div>
          <div className="relative w-full h-12">
            <svg width="100%" height="100%" preserveAspectRatio="none">
              {(() => {
                const maxPoints = timeSeriesData.length;
                if (maxPoints < 2) return null;
                
                const data = timeSeriesData.map(d => d.voltages[selectedComponentId] || 0);
                
                let minV = Math.min(...data, -1);
                let maxV = Math.max(...data, 1);
                const range = maxV - minV;
                minV -= range * 0.1;
                maxV += range * 0.1;
                
                const pathData = data.map((val, i) => {
                  const x = (i / (maxPoints - 1)) * 100;
                  const y = 100 - ((val - minV) / (maxV - minV)) * 100;
                  return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
                }).join(' ');

                const zeroY = 100 - ((0 - minV) / (maxV - minV)) * 100;

                return (
                  <>
                    <line x1="0" y1={`${zeroY}%`} x2="100%" y2={`${zeroY}%`} stroke="currentColor" className="text-border" strokeWidth="1" strokeDasharray="3 3" />
                    <path d={pathData} fill="none" stroke="#38bdf8" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
