"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, 
  Trash2, 
  RotateCcw, 
  Link as LinkIcon, 
  ChevronDown,
  CircleDot,
  CornerRightDown,
  ArrowLeftRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ListType = "singly" | "doubly" | "circular" | "circular-doubly";

const UniversalLinkedList: React.FC = () => {
  const [list, setList] = useState<string[]>([]);
  const [type, setType] = useState<ListType>("singly");
  const [inputValue, setInputValue] = useState<string>("");
  const [posValue, setPosValue] = useState<number>(0); 
  const [logs, setLogs] = useState<{ text: string; type: string }[]>([]);
  
  const maxSize = 16;
  const nodesPerRow = 4; // Controls the "Snake" wrapping

  useEffect(() => {
    setPosValue(list.length);
  }, [list.length]);

  const addLog = (text: string, type: "success" | "error" | "info") => {
    setLogs((prev) => [{ text, type }, ...prev].slice(0, 3));
  };

  const handleInsert = () => {
    if (!inputValue.trim()) return addLog("Enter a value!", "error");
    if (list.length >= maxSize) return addLog("List Full!", "error");

    const newList = [...list];
    const insertIdx = Math.min(Math.max(0, posValue), list.length);
    newList.splice(insertIdx, 0, inputValue.trim());
    
    setList(newList);
    addLog(`Added ${inputValue} at index ${insertIdx}`, "success");
    setInputValue("");
  };

  const deleteNode = (index: number) => {
    const newList = list.filter((_, i) => i !== index);
    setList(newList);
    addLog(`Removed node at index ${index}`, "info");
  };

  // --- ARROW COMPONENTS ---
  const CurvedArrow = ({ isDoubly }: { isDoubly: boolean }) => (
    <div className="flex flex-col items-center justify-center w-12 h-full">
      <div className="h-[2px] w-full bg-slate-800 relative">
        <div className="absolute right-0 -top-[5px] border-y-[6px] border-y-transparent border-l-[10px] border-l-slate-800" />
        {isDoubly && (
          <div className="absolute left-0 -top-[5px] border-y-[6px] border-y-transparent border-r-[10px] border-r-slate-400" />
        )}
      </div>
    </div>
  );

  // --- CIRCULAR LAYOUT (Fixing Overlap with Arcs) ---
  const CircularLayout = () => {
    const radius = 140;
    const centerX = 200;
    const centerY = 200;

    return (
      <svg viewBox="0 0 400 400" className="w-full max-w-[500px] h-auto overflow-visible">
        <defs>
          <marker id="head" orient="auto" markerWidth="3" markerHeight="4" refX="0.1" refY="2">
            <path d="M0,0 V4 L2,2 Z" fill="#4f46e5" />
          </marker>
          <marker id="back" orient="auto" markerWidth="3" markerHeight="4" refX="0.1" refY="2">
            <path d="M0,0 V4 L2,2 Z" fill="#94a3b8" />
          </marker>
        </defs>
        
        {list.map((_, i) => {
          const angle1 = (i * 2 * Math.PI) / list.length - Math.PI / 2;
          const angle2 = ((i + 1) * 2 * Math.PI) / list.length - Math.PI / 2;
          
          const x1 = centerX + radius * Math.cos(angle1);
          const y1 = centerY + radius * Math.sin(angle1);
          const x2 = centerX + radius * Math.cos(angle2);
          const y2 = centerY + radius * Math.sin(angle2);

          // Calculate Arc Midpoint for separation
          const midAngle = (angle1 + angle2) / 2;
          const offset = 25;
          const qx = centerX + (radius + offset) * Math.cos(midAngle);
          const qy = centerY + (radius + offset) * Math.sin(midAngle);
          const qx2 = centerX + (radius - offset) * Math.cos(midAngle);
          const qy2 = centerY + (radius - offset) * Math.sin(midAngle);

          return (
            <g key={i}>
              {/* Forward Path (Outer Arc) */}
              <path 
                d={`M ${x1} ${y1} Q ${qx} ${qy} ${x2} ${y2}`} 
                fill="none" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4 2"
                markerEnd="url(#head)"
              />
              {/* Backward Path (Inner Arc) for Doubly */}
              {(type === "circular-doubly") && (
                <path 
                  d={`M ${x2} ${y2} Q ${qx2} ${qy2} ${x1} ${y1}`} 
                  fill="none" stroke="#cbd5e1" strokeWidth="2"
                  markerEnd="url(#back)"
                />
              )}
            </g>
          );
        })}

        {list.map((item, i) => {
          const angle = (i * 2 * Math.PI) / list.length - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return (
            <foreignObject key={i} x={x - 30} y={y - 25} width="60" height="50">
              <div className="bg-white border-2 border-slate-800 rounded-lg flex items-center justify-center h-full font-black text-sm shadow-sm relative group">
                {item}
                <button onClick={() => deleteNode(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"><Trash2 size={10}/></button>
              </div>
            </foreignObject>
          );
        })}
      </svg>
    );
  };

  // --- SNAKE/GRID LAYOUT ---
  const SnakeLayout = () => {
    return (
      <div className="grid grid-cols-4 gap-y-16 gap-x-4 p-4 w-full max-w-4xl">
        {list.map((item, index) => {
          const isEndOfRow = (index + 1) % nodesPerRow === 0 && index !== list.length - 1;
          const isLastNode = index === list.length - 1;

          return (
            <div key={index} className="flex items-center relative">
              <motion.div layout className="relative group flex border-2 border-slate-800 rounded-xl overflow-hidden bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                {(type === "doubly") && <div className="w-4 bg-slate-50 border-r border-slate-800 flex items-center justify-center"><CircleDot size={8} className="text-slate-300"/></div>}
                <div className="px-6 py-4 font-black min-w-[60px] text-center">{item}</div>
                <div className="w-6 bg-slate-800 flex items-center justify-center"><CircleDot size={8} className="text-indigo-400"/></div>
                <button onClick={() => deleteNode(index)} className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 z-50"><Trash2 size={12}/></button>
              </motion.div>

              {!isLastNode && !isEndOfRow && <CurvedArrow isDoubly={type === "doubly"} />}

              {isEndOfRow && (
                <div className="absolute -bottom-12 right-1/2 translate-x-1/2 flex flex-col items-center">
                  <CornerRightDown className="text-slate-400" size={30} />
                  <div className="text-[8px] font-black text-slate-300 uppercase">Next Line</div>
                </div>
              )}

              {isLastNode && (
                <div className="ml-4 text-[10px] font-black text-slate-300 uppercase italic">
                  {type.includes("circular") ? "LOOPING..." : "NULL"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-3xl border-2 border-slate-800 shadow-[8px_8px_0px_rgba(79,70,229,1)]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-xl text-white"><LinkIcon /></div>
            <h1 className="text-2xl font-black uppercase italic">Linked<span className="text-indigo-600 underline">List.</span></h1>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <select value={type} onChange={(e) => setType(e.target.value as ListType)} className="bg-slate-50 border-2 border-slate-800 p-2 rounded-xl font-bold outline-none">
              <option value="singly">Singly</option>
              <option value="doubly">Doubly</option>
              <option value="circular">Circular</option>
              <option value="circular-doubly">Circular Doubly</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border-2 border-slate-800 space-y-4">
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Data..." className="w-full p-4 bg-slate-100 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold" />
            <div className="flex gap-2">
                <input type="number" value={posValue} onChange={(e) => setPosValue(parseInt(e.target.value))} className="w-20 p-4 bg-slate-100 rounded-2xl font-bold" />
                <button onClick={handleInsert} className="flex-1 bg-indigo-600 text-white font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-transform uppercase">Add Node</button>
            </div>
            <button onClick={() => setList([])} className="w-full p-3 border-2 border-slate-200 text-slate-400 font-bold rounded-2xl flex items-center justify-center gap-2"><RotateCcw size={16}/> RESET</button>
            
            <div className="space-y-2">
              {logs.map((log, i) => (
                <div key={i} className={`text-[10px] p-2 rounded-lg font-bold uppercase ${log.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>• {log.text}</div>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-8 bg-white rounded-3xl border-2 border-slate-800 min-h-[500px] flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
            {list.length === 0 ? <p className="font-black text-slate-200 text-3xl uppercase tracking-widest">Empty List</p> : 
             type.includes("circular") ? <CircularLayout /> : <SnakeLayout />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalLinkedList;