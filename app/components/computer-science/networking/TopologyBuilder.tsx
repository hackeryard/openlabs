"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Monitor, Share2, Plus, Zap, Trash2, Play,
    RotateCcw, X, Settings2, Info, LayoutTemplate,
    Network, Cpu
} from "lucide-react";
import { useChat } from "../../ChatContext";

/* ---------------- Types ---------------- */

type DeviceType = 'pc' | 'router' | 'switch';

interface Device {
    id: string;
    type: DeviceType;
    x: number;
    y: number;
    label: string;
    ip?: string;
}

interface Connection {
    id: string;
    fromId: string;
    toId: string;
}

const DEVICE_ICONS = {
    pc: <Monitor size={22} />,
    router: <Zap size={22} />,
    switch: <Share2 size={22} />,
};

const DEVICE_COLORS = {
    pc: "bg-blue-600 shadow-blue-500/20",
    router: "bg-amber-600 shadow-amber-500/20",
    switch: "bg-emerald-600 shadow-emerald-500/20",
};

export default function TopologyBuilder() {
    // Chatbot 
    const { setExperimentData } = useChat();

    useEffect(() => {
        setExperimentData({
            title: "Topology Builder",
            theory: "Computer networking topology builder and simulation visualizer.",
            extraContext: ``,
        });
    }, []);
    const [devices, setDevices] = useState<Device[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isLinking, setIsLinking] = useState<string | null>(null);
    const [simulatingPath, setSimulatingPath] = useState<string[] | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    const selectedDevice = useMemo(() =>
        devices.find(d => d.id === selectedId), [devices, selectedId]
    );

    /* ---------------- Topology Templates ---------------- */

    const loadTemplate = (type: 'star' | 'bus' | 'ring') => {
        setDevices([]);
        setConnections([]);
        const centerX = 400;
        const centerY = 200;
        const newDevices: Device[] = [];
        const newConns: Connection[] = [];

        if (type === 'star') {
            const centralSwitch: Device = { id: 'star-hub', type: 'switch', x: centerX, y: centerY, label: 'CORE-SWITCH' };
            newDevices.push(centralSwitch);
            for (let i = 0; i < 5; i++) {
                const angle = (i * 2 * Math.PI) / 5;
                const pc: Device = {
                    id: `pc-${i}`, type: 'pc', label: `HOST-${i + 1}`,
                    x: centerX + Math.cos(angle) * 150, y: centerY + Math.sin(angle) * 150,
                    ip: `192.168.1.${i + 10}`
                };
                newDevices.push(pc);
                newConns.push({ id: `c-${i}`, fromId: 'star-hub', toId: pc.id });
            }
        } else if (type === 'bus') {
            for (let i = 0; i < 5; i++) {
                const pc: Device = {
                    id: `b-pc-${i}`, type: 'pc', label: `B-HOST-${i + 1}`,
                    x: 150 + i * 130, y: i % 2 === 0 ? 100 : 300,
                    ip: `10.0.0.${i + 1}`
                };
                newDevices.push(pc);
                if (i > 0) newConns.push({ id: `bc-${i}`, fromId: newDevices[i - 1].id, toId: pc.id });
            }
        } else if (type === 'ring') {
            for (let i = 0; i < 6; i++) {
                const angle = (i * 2 * Math.PI) / 6;
                const router: Device = {
                    id: `r-node-${i}`, type: 'router', label: `R-NODE-${i + 1}`,
                    x: centerX + Math.cos(angle) * 140, y: centerY + Math.sin(angle) * 140,
                };
                newDevices.push(router);
                if (i > 0) newConns.push({ id: `rc-${i}`, fromId: newDevices[i - 1].id, toId: router.id });
            }
            newConns.push({ id: 'ring-close', fromId: newDevices[5].id, toId: newDevices[0].id });
        }

        setDevices(newDevices);
        setConnections(newConns);
    };

    /* ---------------- Handlers ---------------- */

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData("deviceType") as DeviceType;
        if (!containerRef.current || !type) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.round((e.clientX - rect.left - 32) / 32) * 32;
        const y = Math.round((e.clientY - rect.top - 32) / 32) * 32;
        const newDevice: Device = {
            id: `dev-${Date.now()}`, type, x, y,
            label: `${type.toUpperCase()}-${devices.length + 1}`,
            ip: type === 'switch' ? undefined : `192.168.1.${devices.length + 1}`
        };
        setDevices((prev) => [...prev, newDevice]);
    };

    const simulateRouting = () => {
        if (devices.length < 2) return;
        const startNode = devices[0].id;
        const endNode = devices[devices.length - 1].id;
        const queue: string[][] = [[startNode]];
        const visited = new Set();

        while (queue.length > 0) {
            const path = queue.shift()!;
            const node = path[path.length - 1];
            if (node === endNode) {
                setSimulatingPath(path);
                setTimeout(() => setSimulatingPath(null), 5000);
                return;
            }
            if (!visited.has(node)) {
                visited.add(node);
                const neighbors = connections
                    .filter(c => c.fromId === node || c.toId === node)
                    .map(c => c.fromId === node ? c.toId : c.fromId);
                for (const neighbor of neighbors) queue.push([...path, neighbor]);
            }
        }
    };

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">

            {/* 1. Sidebar: Controls & Library */}
            <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col z-20">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="text-sm font-black tracking-tighter flex items-center gap-2">
                        <Network size={20} className="text-indigo-400" /> TOPOLOGY LAB
                    </h2>
                    <Cpu size={16} className="text-slate-600" />
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-8 custom-scrollbar">

                    {/* Templates Section */}
                    <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                            <LayoutTemplate size={12} /> Standard Templates
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            <TemplateBtn label="Star Topology" onClick={() => loadTemplate('star')} desc="Central Hub Architecture" />
                            <TemplateBtn label="Bus Topology" onClick={() => loadTemplate('bus')} desc="Linear Multi-drop Link" />
                            <TemplateBtn label="Ring Topology" onClick={() => loadTemplate('ring')} desc="Closed Loop Point-to-Point" />
                        </div>
                    </div>

                    {/* Library Section */}
                    <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Device Library</h3>
                        <div className="space-y-3">
                            <DraggableItem type="pc" icon={<Monitor size={20} />} label="End Device (PC)" onDragStart={(e) => e.dataTransfer.setData("deviceType", "pc")} />
                            <DraggableItem type="switch" icon={<Share2 size={20} />} label="L2 Switch" onDragStart={(e) => e.dataTransfer.setData("deviceType", "switch")} />
                            <DraggableItem type="router" icon={<Zap size={20} />} label="L3 Router" onDragStart={(e) => e.dataTransfer.setData("deviceType", "router")} />
                        </div>
                    </div>

                    {/* Properties Panel */}
                    {selectedDevice && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Device Settings</span>
                                <button onClick={() => setSelectedId(null)} className="text-slate-500 hover:text-white"><X size={14} /></button>
                            </div>
                            <div className="space-y-3">
                                <input
                                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-1 ring-indigo-500 outline-none"
                                    value={selectedDevice.label}
                                    onChange={(e) => setDevices(prev => prev.map(d => d.id === selectedId ? { ...d, label: e.target.value } : d))}
                                />
                                {selectedDevice.ip && (
                                    <input
                                        className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-indigo-300"
                                        value={selectedDevice.ip}
                                        onChange={(e) => setDevices(prev => prev.map(d => d.id === selectedId ? { ...d, ip: e.target.value } : d))}
                                    />
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-800 space-y-3 bg-slate-900/50">
                    <button onClick={simulateRouting} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2">
                        <Play size={16} fill="currentColor" /> Test Routing
                    </button>
                    <button onClick={() => { setDevices([]); setConnections([]); }} className="w-full py-3 bg-slate-800 hover:bg-red-900/20 text-slate-400 hover:text-red-400 rounded-xl font-bold text-sm transition-all">
                        <RotateCcw size={16} className="inline mr-2" /> Clear Workspace
                    </button>
                </div>
            </aside>

            {/* 2. Main Builder Canvas */}
            <main
                ref={containerRef}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className={`relative flex-1 bg-slate-950 overflow-hidden transition-all ${isLinking ? 'cursor-crosshair bg-indigo-950/10' : ''}`}
            >
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />

                <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                    {connections.map((conn) => {
                        const from = devices.find(d => d.id === conn.fromId);
                        const to = devices.find(d => d.id === conn.toId);
                        if (!from || !to) return null;

                        const isPath = simulatingPath?.includes(from.id) && simulatingPath?.includes(to.id);
                        const pathIdxFrom = simulatingPath?.indexOf(from.id) ?? -1;
                        const pathIdxTo = simulatingPath?.indexOf(to.id) ?? -1;
                        const isSequential = Math.abs(pathIdxFrom - pathIdxTo) === 1;

                        return (
                            <g key={conn.id}>
                                <line
                                    x1={from.x + 32} y1={from.y + 32} x2={to.x + 32} y2={to.y + 32}
                                    stroke="transparent" strokeWidth="24" className="pointer-events-auto cursor-pointer"
                                    onClick={() => setConnections(prev => prev.filter(c => c.id !== conn.id))}
                                />
                                <motion.line
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                    x1={from.x + 32} y1={from.y + 32} x2={to.x + 32} y2={to.y + 32}
                                    stroke={isPath && isSequential ? "#818cf8" : "#334155"}
                                    strokeWidth={isPath && isSequential ? 4 : 2}
                                    strokeDasharray={isPath && isSequential ? "0" : "8,8"}
                                />
                                {isPath && isSequential && (
                                    <motion.circle
                                        r="5" fill="#818cf8"
                                        animate={{
                                            cx: [from.x + 32, to.x + 32],
                                            cy: [from.y + 32, to.y + 32]
                                        }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                )}
                            </g>
                        );
                    })}
                </svg>

                {devices.map((device) => (
                    <motion.div
                        key={device.id}
                        drag dragMomentum={false}
                        onDrag={(e, info) => {
                            setDevices(prev => prev.map(d =>
                                d.id === device.id ? { ...d, x: d.x + info.delta.x, y: d.y + info.delta.y } : d
                            ));
                        }}
                        onClick={() => {
                            if (isLinking && isLinking !== device.id) {
                                setConnections(prev => [...prev, { id: `c-${Date.now()}`, fromId: isLinking, toId: device.id }]);
                                setIsLinking(null);
                            } else {
                                setSelectedId(device.id);
                            }
                        }}
                        className="absolute z-10 p-2"
                        style={{ x: device.x, y: device.y }}
                    >
                        <div className={`
              w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all relative group
              ${selectedId === device.id ? 'ring-4 ring-indigo-500 scale-110 shadow-indigo-500/10' : 'hover:scale-105'}
              ${isLinking === device.id ? 'ring-4 ring-emerald-500 animate-pulse' : ''}
              ${DEVICE_COLORS[device.type]}
            `}>
                            {DEVICE_ICONS[device.type]}

                            <AnimatePresence>
                                {selectedId === device.id && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute -top-16 left-1/2 -translate-x-1/2 flex gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-700 shadow-2xl">
                                        <button onClick={(e) => { e.stopPropagation(); setIsLinking(device.id); setSelectedId(null); }} className="p-2 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-colors"><Plus size={16} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); setDevices(d => d.filter(x => x.id !== device.id)); setConnections(c => c.filter(x => x.fromId !== device.id && x.toId !== device.id)); }} className="p-2 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"><Trash2 size={16} /></button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="mt-3 text-center pointer-events-none">
                            <p className="text-[10px] font-black text-slate-100 uppercase tracking-tighter">{device.label}</p>
                            {device.ip && <p className="text-[8px] font-mono text-slate-500 tracking-widest">{device.ip}</p>}
                        </div>
                    </motion.div>
                ))}

                {/* Legend / HUD */}
                <div className="absolute top-8 right-8 pointer-events-none space-y-4">
                    <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-[2rem] border border-white/5 shadow-2xl max-w-[240px]">
                        <h4 className="text-[10px] font-black text-indigo-400 mb-3 tracking-[0.2em] uppercase">Diagnostic Console</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${simulatingPath ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`} />
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Routing: {simulatingPath ? 'ACTIVE' : 'IDLE'}</span>
                            </div>
                            <p className="text-[9px] text-slate-500 leading-relaxed italic">
                                * Click connections to delete them. Drag devices to reposition. Use templates to study network behavior.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

/* ---------------- Sub-components ---------------- */

function TemplateBtn({ label, onClick, desc }: { label: string, onClick: () => void, desc: string }) {
    return (
        <button onClick={onClick} className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-left hover:border-indigo-500 transition-all group">
            <p className="text-xs font-bold text-slate-300 group-hover:text-indigo-400">{label}</p>
            <p className="text-[9px] text-slate-600 group-hover:text-slate-400">{desc}</p>
        </button>
    );
}

function DraggableItem({ type, icon, label, onDragStart }: any) {
    return (
        <div
            draggable onDragStart={onDragStart}
            className="flex items-center gap-4 p-4 bg-slate-800/30 border border-slate-700/50 rounded-2xl cursor-grab hover:border-indigo-500 transition-all group active:cursor-grabbing shadow-inner"
        >
            <div className={`p-2 rounded-xl ${DEVICE_COLORS[type as DeviceType]} shadow-lg group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-100 uppercase tracking-tighter">{label}</span>
        </div>
    );
}