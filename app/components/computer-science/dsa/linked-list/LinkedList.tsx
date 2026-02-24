"use client";
import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  RotateCcw, 
  ArrowRight, 
  Link as LinkIcon, 
  RefreshCw,
  Zap, 
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/app/components/ChatContext";

type ListType = "singly" | "doubly" | "circular" | "circular-doubly";

const UniversalLinkedList: React.FC = () => {
    // Chatbot 
    const { setExperimentData } = useChat();
  
    useEffect(() => {
      setExperimentData({
        title: "LinkedList",
        theory: "LinkedList Data Structure Visualizer",
        extraContext: ``,
      });
    }, []);
  // 1. Pehle se koi node nahi aayega, khali list rahegi
  const [list, setList] = useState<string[]>([]);
  const [type, setType] = useState<ListType>("singly");
  const [inputValue, setInputValue] = useState<string>("");
  
  // 2. Default position hamesha list ki length (Tail) par rahegi
  const [posValue, setPosValue] = useState<number>(0); 
  const [logs, setLogs] = useState<{ text: string; type: string }[]>([]);
  const maxSize = 8;

  // Jab bhi list change ho, next default position ko tail (list.length) par set karo
  useEffect(() => {
    setPosValue(list.length);
  }, [list.length]);

  const addLog = (text: string, type: "success" | "error" | "info") => {
    setLogs((prev) => [{ text, type }, ...prev].slice(0, 4));
  };

  const handleInsert = () => {
    if (!inputValue.trim()) {
      addLog("Value enter karo Guru!", "error");
      return;
    }
    if (list.length >= maxSize) {
      addLog("Limit reach ho gayi (Max 8 Nodes)", "error");
      return;
    }

    const newList = [...list];
    // Default insertion ab Tail par hai
    const insertIdx = Math.min(Math.max(0, posValue), list.length);
    newList.splice(insertIdx, 0, inputValue.trim());
    
    setList(newList);
    addLog(`Inserted node with value ${inputValue} at position ${insertIdx}`, "success");
    setInputValue("");
  };

  const deleteNode = (index: number) => {
    const val = list[index];
    const newList = list.filter((_, i) => i !== index);
    setList(newList);
    addLog(`Deleted node with value ${val} from position ${index}`, "info");
  };

  const reset = () => {
    setList([]);
    addLog("List ekdum saaf kar di gayi hai", "info");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
              <LinkIcon size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">LinkedList.<span className="text-indigo-600">Pro</span></h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Start Adding Nodes...</p>
            </div>
          </div>

          <div className="relative group">
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as ListType)}
              className="appearance-none bg-slate-50 border-2 border-slate-200 py-3 px-6 pr-12 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 transition-all cursor-pointer"
            >
              <option value="singly">Singly Linked List</option>
              <option value="doubly">Doubly Linked List</option>
              <option value="circular">Circular Linked List</option>
              <option value="circular-doubly">Circular Doubly</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={18} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Zap size={14} className="text-amber-500 fill-amber-500" /> Action Center
              </label>

              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 ml-1 uppercase">New Node Data</span>
                  <input
                    type="text" value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleInsert()}
                    placeholder="Enter value (e.g. 55)"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 ml-1 uppercase">Insert At Position</span>
                  <div className="relative">
                    <input
                      type="number" value={posValue}
                      min="0" max={list.length}
                      onChange={(e) => setPosValue(parseInt(e.target.value) || 0)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-mono font-bold text-indigo-600"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 pointer-events-none">
                      (TAIL = {list.length})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button onClick={handleInsert} className="bg-indigo-600 text-white p-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95">
                    <Plus size={20} strokeWidth={3} /> ADD NODE
                  </button>
                  <button onClick={reset} className="bg-slate-100 text-slate-500 p-4 rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95">
                    <RotateCcw size={18} strokeWidth={3} /> RESET
                  </button>
                </div>
              </div>

              {/* Console Logs */}
              <div className="mt-4 pt-4 border-t border-slate-50 space-y-2">
                {logs.length === 0 && <p className="text-[10px] text-center text-slate-300 font-bold uppercase py-2">Waiting for input...</p>}
                {logs.map((log, i) => (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} key={i} className={`text-[10px] p-3 rounded-xl border flex items-center gap-2 font-bold ${
                    log.type === 'error' ? 'bg-rose-50 text-rose-500 border-rose-100' : 
                    log.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    'bg-indigo-50 text-indigo-600 border-indigo-100'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${log.type === 'error' ? 'bg-rose-400' : 'bg-indigo-400'}`} />
                    {log.text.toUpperCase()}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Visualization Canvas */}
          <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-sm p-10 min-h-[550px] flex flex-wrap content-center justify-center gap-y-24 relative overflow-hidden">
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            {(type === "circular" || type === "circular-doubly") && list.length > 1 && (
               <div className="absolute inset-x-20 bottom-12 h-36 border-x-4 border-b-4 border-dashed border-indigo-100 rounded-b-[120px] flex justify-center items-end pb-4 transition-all">
                  <span className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.3em]">Circular Loop Connect</span>
                  <ArrowRight className="absolute left-0 -top-3 -rotate-90 text-indigo-100" size={28}/>
               </div>
            )}

            <AnimatePresence mode="popLayout">
              {list.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-center">
                  <motion.div
                    layout
                    initial={{ scale: 0, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: -30 }}
                    className="relative group"
                  >
                    {/* Node Visual */}
                    <div className="flex border-[3px] border-slate-800 rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(79,70,229,1)] bg-white transition-all hover:shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] hover:translate-x-1 hover:translate-y-1">
                      
                      {/* Prev Pointer Slot (For Doubly) */}
                      {(type === "doubly" || type === "circular-doubly") && (
                        <div className="w-8 bg-slate-50 border-r-2 border-slate-800 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-slate-300" />
                        </div>
                      )}

                      <div className="px-8 py-5 flex items-center justify-center font-black text-2xl bg-white min-w-[80px]">
                        {item}
                      </div>

                      {/* Next Pointer Slot */}
                      <div className="w-10 bg-slate-800 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
                      </div>
                    </div>

                    {/* Delete Node Trigger */}
                    <button 
                      onClick={() => deleteNode(index)}
                      className="absolute -top-5 -right-3 bg-rose-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-125 hover:bg-rose-600 z-30"
                    >
                      <Trash2 size={16} strokeWidth={3} />
                    </button>

                    <div className="absolute -bottom-10 left-0 right-0 text-center text-[11px] font-black text-slate-300 uppercase tracking-widest">
                      {index === 0 ? "HEAD" : index === list.length-1 ? "TAIL" : `IDX ${index}`}
                    </div>
                  </motion.div>

                  {/* Arrows */}
                  {index < list.length - 1 ? (
                    <div className="flex flex-col items-center mx-3">
                       <ArrowRight size={32} className="text-slate-800" strokeWidth={3} />
                       {(type === "doubly" || type === "circular-doubly") && (
                         <motion.div initial={{ width: 0 }} animate={{ width: 40 }} className="h-1 bg-indigo-300 mt-1.5 relative rounded-full">
                            <div className="absolute -left-1 -top-1 border-t-[6px] border-b-[6px] border-r-[8px] border-transparent border-r-indigo-300" />
                         </motion.div>
                       )}
                    </div>
                  ) : (
                    <div className="ml-8">
                      {type.includes("circular") ? (
                        <div className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full font-black text-[10px] shadow-lg shadow-indigo-100">
                           <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '4s' }} /> LOOPING
                        </div>
                      ) : (
                        <span className="font-black text-slate-200 text-xl tracking-tighter">NULL</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </AnimatePresence>

            {list.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center group cursor-default">
                <div className="relative">
                  <LinkIcon size={140} className="text-slate-100 group-hover:text-indigo-50 transition-colors" strokeWidth={0.5} />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Plus size={40} className="text-slate-200 animate-pulse" />
                  </div>
                </div>
                <p className="text-sm font-black text-slate-300 mt-6 tracking-[0.4em] uppercase">No Nodes Detected</p>
                <p className="text-[10px] text-slate-400 mt-2 font-bold">ADD YOUR FIRST DATA FROM THE LEFT PANEL</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalLinkedList;