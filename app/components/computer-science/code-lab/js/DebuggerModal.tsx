"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RuntimeSnapshot, Task } from "@/app/types/jsDebugger";

type Props = {
  open: boolean;
  onClose: () => void;
  snapshots: RuntimeSnapshot[];
  sourceCode: string;
};

export default function DebuggerModal({
  open,
  onClose,
  snapshots,
  sourceCode,
}: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"stack" | "memory" | "task" | "microtask" | "webapi">("stack");
  const [autoPlay, setAutoPlay] = useState(false);
  const [playInterval, setPlayInterval] = useState<NodeJS.Timeout | null>(null);
  const [showCode, setShowCode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    stack: true,
    webapi: true,
    task: true,
    microtask: true,
    memory: true
  });
  
  // Refs for scrollable containers
  const mainContentRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when modal opens
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset step index when snapshots change
  useEffect(() => {
    setStepIndex(0);
  }, [snapshots]);

  // Handle auto-play
  useEffect(() => {
    if (autoPlay && stepIndex < snapshots.length - 1) {
      const interval = setInterval(() => {
        setStepIndex(prev => {
          if (prev < snapshots.length - 1) {
            return prev + 1;
          } else {
            setAutoPlay(false);
            return prev;
          }
        });
      }, 1000);
      setPlayInterval(interval);
      return () => clearInterval(interval);
    } else if (playInterval) {
      clearInterval(playInterval);
      setPlayInterval(null);
    }
  }, [autoPlay, snapshots.length]);

  // Scroll to top when step changes
  useEffect(() => {
    if (rightPanelRef.current) {
      rightPanelRef.current.scrollTop = 0;
    }
  }, [stepIndex]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Don't render if not open
  if (!open) return null;
  
  const currentSnapshot = snapshots?.[stepIndex];

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col overflow-hidden">
      <div className="bg-[#1a1b26] flex-1 flex flex-col text-white min-h-0">
        {/* Control Bar */}
        <div className="flex-shrink-0 h-auto min-h-14 border-b border-[#2a2b36] flex flex-wrap items-center gap-2 px-2 sm:px-4 py-2 justify-between bg-[#0f0f17]">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <button 
              onClick={() => setStepIndex(0)} 
              className="px-2 sm:px-3 py-1 bg-[#2a2b36] hover:bg-[#3a3b46] rounded-md text-xs sm:text-sm disabled:opacity-50 transition-colors"
              disabled={!snapshots?.length}
            >
              ⏮ <span className="hidden sm:inline ml-1">Restart</span>
            </button>
            <button
              onClick={() => setStepIndex(p => Math.max(0, p - 1))}
              className="px-2 sm:px-3 py-1 bg-[#2a2b36] hover:bg-[#3a3b46] rounded-md text-xs sm:text-sm disabled:opacity-50 transition-colors"
              disabled={!snapshots?.length || stepIndex === 0}
            >
              ← <span className="hidden sm:inline ml-1">Prev</span>
            </button>
            <button
              onClick={() => setStepIndex(p => p < snapshots.length - 1 ? p + 1 : p)}
              className="px-2 sm:px-3 py-1 bg-[#2a2b36] hover:bg-[#3a3b46] rounded-md text-xs sm:text-sm disabled:opacity-50 transition-colors"
              disabled={!snapshots?.length || stepIndex >= snapshots.length - 1}
            >
              <span className="hidden sm:inline mr-1">Next</span> →
            </button>
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm transition-colors ${
                autoPlay ? 'bg-red-500 hover:bg-red-600' : 'bg-[#2a2b36] hover:bg-[#3a3b46]'
              }`}
              disabled={!snapshots?.length}
            >
              {autoPlay ? '⏸' : '▶'} <span className="hidden sm:inline ml-1">{autoPlay ? 'Pause' : 'Play'}</span>
            </button>
          </div>

          <div className="text-xs sm:text-sm text-[#8a8b99] font-mono flex items-center gap-2">
            <span className="hidden xs:inline">Line:</span> {currentSnapshot?.line ?? '-'} 
            {snapshots?.length > 0 && (
              <span className="hidden sm:inline"> ({stepIndex + 1}/{snapshots.length})</span>
            )}
            {currentSnapshot?.error && (
              <span className="text-red-400" title={currentSnapshot.error}>⚠️</span>
            )}
          </div>

          <div className="flex gap-1">
            {isMobile && (
              <button
                onClick={() => setShowCode(!showCode)}
                className="px-2 py-1 bg-[#2a2b36] hover:bg-[#3a3b46] rounded-md text-xs transition-colors sm:hidden"
              >
                {showCode ? '📊' : '📝'}
              </button>
            )}
            <button onClick={onClose} className="px-2 sm:px-3 py-1 bg-[#2a2b36] hover:bg-[#3a3b46] rounded-md text-xs sm:text-sm transition-colors">
              ✕ <span className="hidden sm:inline ml-1">Close</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div ref={mainContentRef} className="flex-1 overflow-y-auto min-h-0">
          <div className="p-2 sm:p-4 md:p-6">
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-2 sm:gap-4 md:gap-6`}>
              
              {/* Left Column - Code */}
              {(!isMobile || showCode) && (
                <div className="bg-[#0f0f17] rounded-lg border border-[#2a2b36] overflow-hidden flex flex-col">
                  <div className="bg-[#2a2b36] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#8a8b99] flex justify-between items-center">
                    <span>📝 JavaScript Code</span>
                    {isMobile && (
                      <button onClick={() => setShowCode(false)} className="text-[#8a8b99] hover:text-white">✕</button>
                    )}
                  </div>
                  <div className="h-[400px] sm:h-[500px] overflow-y-auto p-2 sm:p-4 font-mono text-xs sm:text-sm">
                    {sourceCode.split("\n").map((line, index) => {
                      const lineNumber = index + 1;
                      const isCurrentLine = currentSnapshot?.line === lineNumber;
                      const hasError = currentSnapshot?.error && isCurrentLine;
                      
                      return (
                        <div key={index} className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded flex hover:bg-[#1a1b26] ${isCurrentLine ? hasError ? "bg-red-500/20 border-l-2 sm:border-l-4 border-red-500" : "bg-blue-500/20 border-l-2 sm:border-l-4 border-blue-500" : ""}`}>
                          <span className="text-[#4a4b56] mr-2 sm:mr-3 w-6 sm:w-8 text-right text-xs select-none">{lineNumber}</span>
                          <span className="flex-1 text-[#d4d4d8] break-words whitespace-pre-wrap" title={line}>{line || ' '}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Right Column - Detailed Visualization */}
              {(!isMobile || !showCode) && (
                <div ref={rightPanelRef} className="space-y-3 sm:space-y-4 md:space-y-5 overflow-y-auto max-h-[600px] sm:max-h-[700px] pr-1">
                  
                  {/* Tab Navigation */}
                  <div className="sticky top-0 bg-[#1a1b26] z-10 flex flex-wrap gap-1 p-1 rounded-lg border border-[#2a2b36]">
                    {[
                      { id: 'stack', label: '📚 Stack', color: 'blue', count: currentSnapshot?.stack?.length },
                      { id: 'task', label: '⚡ Task', color: 'blue', count: currentSnapshot?.taskQueue?.length },
                      { id: 'microtask', label: '⚡ Micro', color: 'green', count: currentSnapshot?.microtaskQueue?.length },
                      { id: 'webapi', label: '🌐 APIs', color: 'purple', count: currentSnapshot?.webAPIs?.length },
                      { id: 'memory', label: '💾 Memory', color: 'gray', count: Object.keys(currentSnapshot?.memory || {}).length },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 px-1 py-1.5 text-xs rounded transition-colors relative ${
                          activeTab === tab.id
                            ? `bg-${tab.color}-500/20 border border-${tab.color}-500/40 text-${tab.color}-400`
                            : 'text-[#8a8b99] hover:bg-[#2a2b36]'
                        }`}
                      >
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.label.split(' ')[1] || tab.label}</span>
                        {tab.count > 0 && (
                          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {tab.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Call Stack Section */}
                  <Section
                    title="📚 Call Stack"
                    count={currentSnapshot?.stack?.length || 0}
                    isExpanded={expandedSections.stack}
                    onToggle={() => toggleSection('stack')}
                    color="blue"
                  >
                    {currentSnapshot?.stack?.length ? (
                      <div className="space-y-2">
                        {currentSnapshot.stack.slice().reverse().map((frame, i) => (
                          <div key={i} className="border-l-2 border-blue-500 pl-3 py-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold">{frame.name}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                                {frame.type || 'global'}
                              </span>
                            </div>
                            
                            {/* Function parameters */}
                            {frame.name !== 'global' && (
                              <div className="text-xs text-[#8a8b99] mt-1">
                                <span className="text-yellow-400">Parameters:</span>{' '}
                                {frame.locals && Object.keys(frame.locals)
                                  .filter(key => !key.startsWith('_'))
                                  .slice(0, 3)
                                  .map((key, idx) => (
                                    <span key={key} className="ml-2">
                                      {key}: {formatValue(frame.locals[key])}
                                      {idx < 2 ? ',' : ''}
                                    </span>
                                  ))}
                                {Object.keys(frame.locals || {}).length > 3 && ' ...'}
                              </div>
                            )}
                            
                            {/* Local variables */}
                            {frame.locals && Object.keys(frame.locals).length > 0 && (
                              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                {Object.entries(frame.locals).map(([k, v]) => (
                                  <div key={k} className="bg-[#1a1b26] px-2 py-1 rounded flex justify-between">
                                    <span className="text-[#8a8b99]">{k}:</span>
                                    <span className="text-blue-400 font-mono">{formatValue(v)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Stack trace info */}
                            <div className="text-xs text-[#4a4b56] mt-1">
                              Frame ID: {frame.id}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState message="Call stack is empty" />
                    )}
                  </Section>

                  {/* Web APIs Section */}
                  <Section
                    title="🌐 Web APIs"
                    count={currentSnapshot?.webAPIs?.length || 0}
                    isExpanded={expandedSections.webapi}
                    onToggle={() => toggleSection('webapi')}
                    color="purple"
                  >
                    {currentSnapshot?.webAPIs?.length ? (
                      <div className="space-y-2">
                        {currentSnapshot.webAPIs.map((api, i) => (
                          <div key={i} className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-mono font-bold">{api.name}</span>
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                                  {api.type}
                                </span>
                              </div>
                              <span className="text-xs text-[#8a8b99]">ID: {api.id}</span>
                            </div>
                            
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-[#8a8b99]">Callback:</span>{' '}
                                <span className="text-yellow-400">{api.callback || 'anonymous'}</span>
                              </div>
                              {api.line && (
                                <div>
                                  <span className="text-[#8a8b99]">Line:</span>{' '}
                                  <span className="text-blue-400">{api.line}</span>
                                </div>
                              )}
                              <div>
                                <span className="text-[#8a8b99]">Status:</span>{' '}
                                <span className={`${api.status === 'pending' ? 'text-yellow-400' : 'text-green-400'}`}>
                                  {api.status || 'pending'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState message="No active Web APIs" />
                    )}
                  </Section>

                  {/* Task Queue Section */}
                  <Section
                    title="⚡ Task Queue (Macro)"
                    count={currentSnapshot?.taskQueue?.length || 0}
                    isExpanded={expandedSections.task}
                    onToggle={() => toggleSection('task')}
                    color="blue"
                  >
                    {currentSnapshot?.taskQueue?.length ? (
                      <div className="space-y-2">
                        {currentSnapshot.taskQueue.map((task, i) => (
                          <div key={i} className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-mono font-bold">{task.name}</span>
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                                  {task.type}
                                </span>
                              </div>
                              <span className="text-xs text-[#8a8b99]">#{i + 1}</span>
                            </div>
                            
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-[#8a8b99]">Callback:</span>{' '}
                                <span className="text-yellow-400">{task.callback || task.name}</span>
                              </div>
                              {task.line && (
                                <div>
                                  <span className="text-[#8a8b99]">Created at line:</span>{' '}
                                  <span className="text-blue-400">{task.line}</span>
                                </div>
                              )}
                              <div>
                                <span className="text-[#8a8b99]">Status:</span>{' '}
                                <span className="text-yellow-400">{task.status || 'pending'}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState message="Task queue is empty" />
                    )}
                  </Section>

                  {/* Microtask Queue Section */}
                  <Section
                    title="⚡ Microtask Queue"
                    count={currentSnapshot?.microtaskQueue?.length || 0}
                    isExpanded={expandedSections.microtask}
                    onToggle={() => toggleSection('microtask')}
                    color="green"
                  >
                    {currentSnapshot?.microtaskQueue?.length ? (
                      <div className="space-y-2">
                        {currentSnapshot.microtaskQueue.map((task, i) => (
                          <div key={i} className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-mono font-bold">{task.name}</span>
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                                  {task.type}
                                </span>
                              </div>
                              <span className="text-xs text-[#8a8b99]">#{i + 1}</span>
                            </div>
                            
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-[#8a8b99]">Promise:</span>{' '}
                                <span className="text-yellow-400">{task.callback || task.name}</span>
                              </div>
                              {task.line && (
                                <div>
                                  <span className="text-[#8a8b99]">Line:</span>{' '}
                                  <span className="text-blue-400">{task.line}</span>
                                </div>
                              )}
                              <div>
                                <span className="text-[#8a8b99]">Priority:</span>{' '}
                                <span className="text-green-400">High</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState message="Microtask queue is empty" />
                    )}
                  </Section>

                  {/* Memory Section */}
                  <Section
                    title="💾 Memory"
                    count={Object.keys(currentSnapshot?.memory || {}).length}
                    isExpanded={expandedSections.memory}
                    onToggle={() => toggleSection('memory')}
                    color="gray"
                  >
                    {currentSnapshot?.memory && Object.keys(currentSnapshot.memory).length > 0 ? (
                      <div>
                        {/* Memory stats */}
                        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                          <div className="bg-[#1a1b26] p-2 rounded text-center">
                            <div className="text-[#8a8b99]">Variables</div>
                            <div className="text-lg font-bold text-blue-400">{Object.keys(currentSnapshot.memory).length}</div>
                          </div>
                          <div className="bg-[#1a1b26] p-2 rounded text-center">
                            <div className="text-[#8a8b99]">Functions</div>
                            <div className="text-lg font-bold text-purple-400">
                              {Object.values(currentSnapshot.memory).filter(v => typeof v === 'function').length}
                            </div>
                          </div>
                          <div className="bg-[#1a1b26] p-2 rounded text-center">
                            <div className="text-[#8a8b99]">Objects</div>
                            <div className="text-lg font-bold text-green-400">
                              {Object.values(currentSnapshot.memory).filter(v => v && typeof v === 'object' && !Array.isArray(v)).length}
                            </div>
                          </div>
                        </div>

                        {/* Variable list with types */}
                        <div className="space-y-1 max-h-[300px] overflow-y-auto">
                          {Object.entries(currentSnapshot.memory).map(([k, v]) => {
                            const type = typeof v;
                            const typeColor = 
                              type === 'number' ? 'text-blue-400' :
                              type === 'string' ? 'text-green-400' :
                              type === 'boolean' ? 'text-yellow-400' :
                              type === 'function' ? 'text-purple-400' :
                              'text-[#8a8b99]';
                            
                            return (
                              <motion.div
                                key={k}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#1a1b26] px-3 py-2 rounded flex items-center justify-between hover:bg-[#2a2b36] transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[#8a8b99]">{k}</span>
                                  <span className="text-xs px-1.5 py-0.5 rounded bg-[#2a2b36] text-[#8a8b99]">
                                    {type}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`font-mono ${typeColor} max-w-[200px] truncate`} title={formatValue(v)}>
                                    {formatValue(v)}
                                  </span>
                                  {type === 'function' && (
                                    <span className="text-xs text-[#4a4b56]">()</span>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <EmptyState message="No variables in memory" />
                    )}
                  </Section>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        {snapshots?.length > 0 && (
          <div className="flex-shrink-0 h-12 sm:h-16 border-t border-[#2a2b36] flex items-center px-2 sm:px-4 gap-1 overflow-x-auto bg-[#0f0f17]">
            {snapshots.map((snapshot, i) => (
              <button
                key={i}
                onClick={() => setStepIndex(i)}
                className={`relative flex-shrink-0 group px-2 py-1 text-xs rounded transition-colors ${
                  stepIndex === i ? 'bg-blue-500 text-white' : 'bg-[#2a2b36] hover:bg-[#3a3b46] text-[#8a8b99]'
                }`}
              >
                <span>Line {snapshot.line}</span>
                {snapshot.error && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Helper Components ---------- */

function Section({ 
  title, 
  count, 
  isExpanded, 
  onToggle, 
  color,
  children 
}: { 
  title: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0f0f17] rounded-lg border border-[#2a2b36] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full bg-[#2a2b36] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#8a8b99] flex justify-between items-center hover:bg-[#3a3b46] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span>{title}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full bg-${color}-500/20 text-${color}-400`}>
            {count}
          </span>
        </div>
        <span className="text-lg">{isExpanded ? '▼' : '▶'}</span>
      </button>
      
      {isExpanded && (
        <div className="p-3 sm:p-4">
          {children}
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-[#4a4b56] text-center py-4 sm:py-6 text-xs sm:text-sm italic">
      {message}
    </div>
  );
}

function MemoryTab({ memory }: { memory: Record<string, any> }) {
  const entries = Object.entries(memory);
  
  if (entries.length === 0) {
    return <EmptyState message="No variables in memory" />;
  }

  return (
    <div className="space-y-1 sm:space-y-2">
      {entries.map(([k, v]) => (
        <motion.div
          key={k}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#1a1b26] px-2 sm:px-3 py-1.5 sm:py-2 rounded flex justify-between text-xs sm:text-sm hover:bg-[#2a2b36] transition-colors"
        >
          <span className="font-mono text-[#8a8b99] break-all max-w-[120px] sm:max-w-[200px]" title={k}>
            {k}
          </span>
          <span className="text-blue-400 font-mono break-all max-w-[120px] sm:max-w-[200px] text-right" title={formatValue(v)}>
            {formatValue(v)}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// Helper function to format values for display
function formatValue(value: any): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'function') {
    const funcStr = value.toString();
    return funcStr.length > 30 ? funcStr.substring(0, 27) + '...' : funcStr;
  }
  if (typeof value === 'object') {
    try {
      if (Array.isArray(value)) {
        return `[${value.map(v => formatValue(v)).join(', ')}]`;
      }
      const str = JSON.stringify(value);
      return str.length > 30 ? str.substring(0, 27) + '...' : str;
    } catch {
      return String(value);
    }
  }
  return String(value);
}