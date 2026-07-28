"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { CircuitState, CircuitNode, CircuitComponent, SolverResult, ComponentType } from "./engine";

interface CircuitCanvasProps {
  state: CircuitState;
  solverResult: SolverResult;
  timeSeriesData?: {time: number, currents: Record<string, number>, voltages: Record<string, number>}[];
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

const GRID_SIZE = 40;

function snapToGrid(x: number, y: number) {
  const offset = GRID_SIZE / 2;
  return {
    x: Math.round((x - offset) / GRID_SIZE) * GRID_SIZE + offset,
    y: Math.round((y - offset) / GRID_SIZE) * GRID_SIZE + offset,
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
  const [startPoint, setStartPoint] = useState<{ x: number, y: number } | null>(null);
  const [currentPoint, setCurrentPoint] = useState<{ x: number, y: number } | null>(null);
  const [hoverPoint, setHoverPoint] = useState<{ x: number, y: number } | null>(null);
  
  // Node dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  // Keyboard shortcut for deleting selected component
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedComponentId) {
        // Prevent deleting if they are typing in an input field somewhere else
        if (document.activeElement?.tagName === 'INPUT') return;
        onDeleteComponent(selectedComponentId);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedComponentId, onDeleteComponent]);

  // Interaction handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const snapped = snapToGrid(x, y);

    if (selectedTool === 'select' || selectedTool.startsWith('probe_')) {
      // Find if we clicked on a node directly
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
        onPushHistory(); // Save state before drag starts
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
      // Finished drawing a component!
      
      // Look for existing nodes at these coordinates to reuse their IDs
      const startNode = Object.values(state.nodes).find(n => n.x === startPoint.x && n.y === startPoint.y);
      const endNode = Object.values(state.nodes).find(n => n.x === currentPoint.x && n.y === currentPoint.y);

      const node1Id = startNode ? startNode.id : `${startPoint.x},${startPoint.y}`;
      const node2Id = endNode ? endNode.id : `${currentPoint.x},${currentPoint.y}`;
      
      let initialValue = 0;
      if (selectedTool === 'battery') initialValue = 5; // 5V
      if (selectedTool === 'resistor' || selectedTool === 'bulb' || selectedTool === 'led') initialValue = 10; 
      if (selectedTool === 'potentiometer') initialValue = 100;
      
      onAddComponent({
        type: selectedTool as ComponentType,
        node1: node1Id,
        node2: node2Id,
        value: initialValue,
        isOpen: false,
        internalResistance: 0.1, // only used for battery
        maxCurrent: selectedTool === 'fuse' ? 2 : undefined,
        color: selectedTool === 'led' ? 'red' : undefined,
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
      // Always allow selecting components unless delete tool is active
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

  // Render nodes
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
      setOffset(prev => prev + dt * 0.05); // strictly increasing, no wrap to prevent stutter
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Helper to render component shape
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
    const strokeColor = isSelected ? "#3b82f6" : "#64748b"; // blue-500 or slate-500
    const strokeWidth = isSelected ? 4 : 2;

    const current = solverResult.componentCurrents[comp.id] || 0;
    const voltage = solverResult.componentVoltages[comp.id] || 0;
    const hasCurrent = Math.abs(current) > 1e-4;
    
    // For text readability
    const isUpsideDown = Math.abs(angle) > 90;
    const textTransform = isUpsideDown ? `rotate(180)` : ``;
    const textYOffset = isUpsideDown ? 25 : -20;

    
    // SVG group transformed to match the line
    return (
      <g 
        key={comp.id} 
        transform={`translate(${midX}, ${midY}) rotate(${angle})`}
        onClick={(e) => handleComponentClick(e, comp.id)}
        onContextMenu={(e) => handleContextMenu(e, comp.id)}
        onDoubleClick={(e) => handleComponentDoubleClick(e, comp)}
        className="cursor-pointer"
      >
        {/* Invisible hit area for easier clicking */}
        <rect x={-length/2} y={-15} width={length} height={30} fill="transparent" />
        
        {/* Wires leading to component */}
        <line x1={-length/2} y1={0} x2={-15} y2={0} stroke={strokeColor} strokeWidth={strokeWidth} />
        <line x1={15} y1={0} x2={length/2} y2={0} stroke={strokeColor} strokeWidth={strokeWidth} />

        {/* Component Symbol */}
        {comp.type === 'wire' && (
          <line x1={-15} y1={0} x2={15} y2={0} stroke={strokeColor} strokeWidth={strokeWidth} />
        )}

        {comp.type === 'resistor' && (
          <polyline 
            points="-15,0 -10,-10 -5,10 0,-10 5,10 10,-10 15,0" 
            fill="none" 
            stroke={strokeColor} 
            strokeWidth={strokeWidth} 
          />
        )}

        {comp.type === 'battery' && (
          <g>
            <line x1={-15} y1={0} x2={-5} y2={0} stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1={5} y1={0} x2={15} y2={0} stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Long thin line (positive) */}
            <line x1={-5} y1={-12} x2={-5} y2={12} stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Short thick line (negative) */}
            <line x1={5} y1={-6} x2={5} y2={6} stroke={strokeColor} strokeWidth={strokeWidth * 2} />
            {/* + sign */}
            <text x={-12} y={-15} fontSize="10" fill={strokeColor} textAnchor="middle">+</text>
            {/* Label */}
            <text x={0} y={textYOffset} fontSize="12" fill="var(--foreground)" textAnchor="middle" transform={textTransform}>
              {comp.value}V
            </text>
          </g>
        )}

        {comp.type === 'potentiometer' && (
          <g>
            <polyline 
              points="-15,0 -10,-10 -5,10 0,-10 5,10 10,-10 15,0" 
              fill="none" 
              stroke={strokeColor} 
              strokeWidth={strokeWidth} 
            />
            {/* Arrow indicating variable */}
            <line x1={-12} y1={12} x2={12} y2={-12} stroke={strokeColor} strokeWidth={strokeWidth} />
            <polygon points="12,-12 6,-12 10,-8" fill={strokeColor} />
          </g>
        )}

        {comp.type === 'fuse' && (
          <g>
            <rect x={-12} y={-6} width={24} height={12} fill="transparent" stroke={strokeColor} strokeWidth={strokeWidth} />
            {comp.isOpen ? (
              <text x={0} y={4} fontSize="14" fill="red" textAnchor="middle">×</text>
            ) : (
              <line x1={-12} y1={0} x2={12} y2={0} stroke={strokeColor} strokeWidth={strokeWidth} />
            )}
          </g>
        )}

        {comp.type === 'led' && (
          <g>
            <polygon points="-5,-8 -5,8 5,0" fill="transparent" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1={5} y1={-8} x2={5} y2={8} stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1={-15} y1={0} x2={-5} y2={0} stroke={strokeColor} strokeWidth={strokeWidth} />
            
            {/* Light emission */}
            {(() => {
              const p = solverResult.componentPowers[comp.id] || 0;
              // LED lights up if current flows positive (Node1 -> Node2)
              // Wait, solver handles negative current. If current > 1e-4, it's flowing forward.
              if (current > 1e-4 && p > 0.001) {
                const color = comp.color || 'red';
                const intensity = Math.min(p / 0.1, 1);
                return <circle cx={0} cy={0} r={12 + intensity * 8} fill={color} opacity={0.2 + intensity * 0.5} pointerEvents="none" />;
              }
              return null;
            })()}
          </g>
        )}

        {comp.type === 'switch' && (
          <g>
            {comp.isOpen ? (
              <line x1={-15} y1={0} x2={10} y2={-10} stroke={strokeColor} strokeWidth={strokeWidth} />
            ) : (
              <line x1={-15} y1={0} x2={15} y2={0} stroke={strokeColor} strokeWidth={strokeWidth} />
            )}
            <circle cx={-15} cy={0} r={2} fill={strokeColor} />
            <circle cx={15} cy={0} r={2} fill={strokeColor} />
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
            <circle cx={0} cy={0} r={12} fill="var(--bg-card)" stroke={strokeColor} strokeWidth={strokeWidth} />
            <text x={0} y={4} fontSize="12" fontWeight="bold" fill={strokeColor} textAnchor="middle">A</text>
            <text x={0} y={textYOffset} fontSize="12" fill="var(--foreground)" textAnchor="middle" transform={textTransform}>
              {Math.abs(current).toFixed(2)}A
            </text>
          </g>
        )}

        {comp.type === 'voltmeter' && (
          <g>
            <circle cx={0} cy={0} r={12} fill="var(--bg-card)" stroke={strokeColor} strokeWidth={strokeWidth} />
            <text x={0} y={4} fontSize="12" fontWeight="bold" fill={strokeColor} textAnchor="middle">V</text>
            <text x={0} y={textYOffset} fontSize="12" fill="var(--foreground)" textAnchor="middle" transform={textTransform}>
              {voltage.toFixed(2)}V
            </text>
          </g>
        )}

        {comp.type === 'bulb' && (
          <g>
            {/* Glow effect based on power */}
            <circle cx={0} cy={0} r={14} fill={strokeColor} fillOpacity="0.1" />
            <path d="M -8 -4 Q 0 -12 8 -4 L 4 4 L -4 4 Z" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1={-4} y1={4} x2={-2} y2={10} stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1={4} y1={4} x2={2} y2={10} stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1={-2} y1={10} x2={2} y2={10} stroke={strokeColor} strokeWidth={strokeWidth} />
            
            {/* Light emission */}
            {(() => {
              const p = solverResult.componentPowers[comp.id] || 0;
              if (p > 0.1) {
                const maxP = 20; // W
                const intensity = Math.min(p / maxP, 1);
                return <circle cx={0} cy={0} r={15 + intensity * 15} fill="yellow" opacity={0.2 + intensity * 0.4} />;
              }
              return null;
            })()}
          </g>
        )}
        
        {/* Animated current dots */}
        {hasCurrent && (
          <g transform={current < 0 ? "rotate(180)" : ""}>
            {/* Always animate left-to-right in local space, since we rotate the whole group if negative */}
            {(() => {
              // Speed scales directly with current. 
              // 1A = speed 1.0. 0.1A = speed 0.1.
              // To prevent it being too fast, we can cap it or scale it.
              const visualCurrent = Math.abs(current);
              // Max visual speed multiplier capped at 5x to avoid aliasing
              const speedMult = Math.min(visualCurrent, 5); 
              // Don't animate if current is effectively zero
              if (speedMult < 0.001) return null;

              const finalOffset = -offset * speedMult;
              
              return (
                <line 
                  x1={-length/2} y1={0} x2={length/2} y2={0} 
                  stroke="#ef4444" // red
                  strokeWidth={3} 
                  strokeDasharray="4 16" 
                  strokeDashoffset={finalOffset} 
                  fill="none" 
                  pointerEvents="none"
                  opacity={0.7}
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
      {/* Grid Pattern */}
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        <defs>
          <pattern id="dot-grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
            <circle cx={GRID_SIZE/2} cy={GRID_SIZE/2} r="1.5" fill="var(--border-border)" />
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
        {/* Draw active line */}
        {isDrawing && startPoint && currentPoint && (
          <line 
            x1={startPoint.x} 
            y1={startPoint.y} 
            x2={currentPoint.x} 
            y2={currentPoint.y} 
            stroke="#94a3b8" 
            strokeWidth="3" 
            strokeDasharray="5 5" 
          />
        )}

        {/* Hover ghost node */}
        {hoverPoint && !isDrawing && !draggingNodeId && (
          <circle 
            cx={hoverPoint.x} 
            cy={hoverPoint.y} 
            r={6} 
            fill="none" 
            stroke="#94a3b8" 
            strokeWidth="2" 
            opacity="0.5"
            pointerEvents="none"
          />
        )}

        {/* Draw components */}
        {components.map(renderComponentShape)}

        {/* Draw nodes (dots at connections) */}
        {nodes.map(node => {
          const isRed = probeRedNodeId === node.id;
          const isBlack = probeBlackNodeId === node.id;
          
          return (
            <circle 
              key={node.id} 
              cx={node.x} 
              cy={node.y} 
              r={isRed || isBlack ? 6 : 4} 
              fill={isRed ? '#ef4444' : isBlack ? '#18181b' : '#334155'} 
              stroke={isRed || isBlack ? '#fff' : 'none'}
              strokeWidth={isRed || isBlack ? 2 : 0}
              className={selectedTool.startsWith('probe_') ? 'cursor-crosshair transition-all' : 'transition-all'}
            />
          );
        })}
      </svg>

      {/* Oscilloscope Overlay */}
      {selectedComponentId && timeSeriesData && timeSeriesData.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 bg-background/90 border border-border rounded-lg shadow-lg p-3 pointer-events-none" style={{ height: '120px' }}>
          <h4 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Oscilloscope: {state.components[selectedComponentId]?.type}</h4>
          <div className="relative w-full h-full">
            <svg width="100%" height="100%" preserveAspectRatio="none">
              {(() => {
                const maxPoints = timeSeriesData.length;
                if (maxPoints < 2) return null;
                
                // Extract voltage data for the selected component
                const data = timeSeriesData.map(d => d.voltages[selectedComponentId] || 0);
                
                // Find min/max for dynamic scaling
                let minV = Math.min(...data, -1);
                let maxV = Math.max(...data, 1);
                // Add some padding
                const range = maxV - minV;
                minV -= range * 0.1;
                maxV += range * 0.1;
                
                // Generate SVG path
                const pathData = data.map((val, i) => {
                  const x = (i / (maxPoints - 1)) * 100; // percentage
                  const y = 100 - ((val - minV) / (maxV - minV)) * 100; // percentage, inverted Y
                  return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
                }).join(' ');

                // Zero line
                const zeroY = 100 - ((0 - minV) / (maxV - minV)) * 100;

                return (
                  <>
                    <line x1="0" y1={`${zeroY}%`} x2="100%" y2={`${zeroY}%`} stroke="var(--border-border)" strokeWidth="1" strokeDasharray="4 4" />
                    <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
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
