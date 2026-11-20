"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Zap, Globe, Activity, ShieldAlert, Power, Layers, Split, ArrowRightLeft, CheckCircle2, Info } from "lucide-react";
import { useChat } from "../../ChatContext";

/* ---------------- Types & Constants ---------------- */

type NodePos = { id: string; x: number; y: number; label: string; type: 'client' | 'router' | 'server'; active: boolean };

interface Packet {
    id: number;
    progress: number;
    baseSpeed: number;
    path: NodePos[];
    isDropped: boolean;
    opacity: number;
}

const THEME = {
    client: "#6366f1",
    router: "#f59e0b",
    server: "#10b981",
    packet: "#ef4444",
    link: "#e2e8f0",
    inactive: "#cbd5e1",
};

const PACKET_STEPS = [
  {
    step: 1,
    title: "1. Message Fragmentation",
    short: "Chunking",
    icon: Split,
    desc: "Large files cannot safely travel as a monolithic stream without blocking links or risking total loss on corruption. The application layer data is divided into discrete small packets (typically MTU = 1500 bytes). Each packet receives an IP header with source IP, destination IP, length, checksum, and an incremental sequence number.",
    highlight: "Enables multi-user multiplexing without holding dedicated cables."
  },
  {
    step: 2,
    title: "2. Independent Dynamic Routing",
    short: "Routing",
    icon: ArrowRightLeft,
    desc: "Unlike circuit switching where a fixed wire path is reserved, each packet is routed independently by intermediate routers (e.g., Alpha, Beta, Gamma, Delta). If one router or link fails or gets congested, packets automatically divert along alternate healthy routes to maintain connectivity.",
    highlight: "Click any router in the simulation above to simulate a link failure and witness automatic rerouting!"
  },
  {
    step: 3,
    title: "3. Store-and-Forward & Queueing",
    short: "Queuing",
    icon: Layers,
    desc: "Intermediate routers receive a packet completely, verify its checksum, inspect its routing table, and buffer it in memory queues before sending it to the next hop. If incoming packet burst exceeds link capacity (high traffic load), router queues overflow and packets are discarded/dropped.",
    highlight: "Increase the Traffic Load slider to simulate queue saturation and packet loss."
  },
  {
    step: 4,
    title: "4. Destination Reassembly & ACK",
    short: "Reassembly",
    icon: CheckCircle2,
    desc: "Because packets take different paths with variable latencies, they frequently arrive at the Destination (Server) out of sequence. The Transport Layer (TCP) reorders packets based on sequence numbers, requests retransmission for dropped packets, and assembles the intact original message.",
    highlight: "Ensures 100% data integrity even across unpredictable, lossy networks."
  }
];

export default function PacketSwitchingLab({ onComplete }: { onComplete?: () => void }) {
    // Chatbot 
    const { setExperimentData } = useChat();

    useEffect(() => {
        setExperimentData({
            title: "Packet Switching",
            theory: "Computer networking packet switching visualisation.",
            extraContext: ``,
        });
    }, []);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const packetsRef = useRef<Packet[]>([]);
    const animationRef = useRef<number>(0);

    const [metrics, setMetrics] = useState({ delivered: 0, dropped: 0 });
    const [congestion, setCongestion] = useState(0.3);
    const [isSimulating, setIsSimulating] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    const [nodes, setNodes] = useState<Record<string, NodePos>>({
        CLIENT: { id: 'CLIENT', x: 80, y: 200, label: "Source", type: 'client', active: true },
        R_ALPHA: { id: 'R_ALPHA', x: 300, y: 100, label: "Alpha", type: 'router', active: true },
        R_BETA: { id: 'R_BETA', x: 300, y: 300, label: "Beta", type: 'router', active: true },
        R_GAMMA: { x: 500, y: 100, label: "Gamma", type: 'router', active: true, id: 'R_GAMMA' },
        R_DELTA: { x: 500, y: 300, label: "Delta", type: 'router', active: true, id: 'R_DELTA' },
        SERVER: { id: 'SERVER', x: 720, y: 200, label: "Destination", type: 'server', active: true },
    });

    /* ---------------- Actions ---------------- */

    const toggleNode = (id: string) => {
        if (nodes[id].type !== 'router') return;
        setNodes(prev => ({
            ...prev,
            [id]: { ...prev[id], active: !prev[id].active }
        }));
    };

    const getValidPaths = () => {
        const possiblePaths = [
            [nodes.CLIENT, nodes.R_ALPHA, nodes.R_GAMMA, nodes.SERVER],
            [nodes.CLIENT, nodes.R_BETA, nodes.R_DELTA, nodes.SERVER],
            [nodes.CLIENT, nodes.R_ALPHA, nodes.R_DELTA, nodes.SERVER],
            [nodes.CLIENT, nodes.R_BETA, nodes.R_GAMMA, nodes.SERVER],
        ];
        return possiblePaths.filter(path => path.every(node => node.active));
    };

    const triggerBurst = () => {
        const validPaths = getValidPaths();
        if (validPaths.length === 0) return;

        const burstSize = Math.floor(8 + congestion * 12);
        const newPackets: Packet[] = Array.from({ length: burstSize }).map((_, i) => ({
            id: Math.random() + i,
            progress: 0,
            baseSpeed: 0.004 + Math.random() * 0.002,
            path: validPaths[Math.floor(Math.random() * validPaths.length)],
            isDropped: false,
            opacity: 1,
        }));

        packetsRef.current = [...packetsRef.current, ...newPackets];
        setIsSimulating(true);
    };

    const resetLab = () => {
        packetsRef.current = [];
        setMetrics({ delivered: 0, dropped: 0 });
        setIsSimulating(false);
    };

    /* ---------------- Animation Engine ---------------- */

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawLinks(ctx);

            const currentPackets = packetsRef.current;

            for (let i = currentPackets.length - 1; i >= 0; i--) {
                const p = currentPackets[i];

                // 1. DYNAMIC SPEED & JITTER
                const currentSpeed = p.baseSpeed * (1 - congestion * 0.85);
                // Visual stuttering increases significantly with load
                const jitter = (Math.random() - 0.5) * (congestion * 0.008);
                p.progress += Math.max(0.0002, currentSpeed + jitter);

                // 2. REFINED LOSS PROBABILITY (Exponential)
                // Check loss at router hops (approx 33% and 66% through path)
                const isAtRouterHop = (p.progress > 0.31 && p.progress < 0.35) || (p.progress > 0.64 && p.progress < 0.68);

                if (!p.isDropped && isAtRouterHop) {
                    // Loss probability: Load^3 gives a curve that spikes at the end
                    const dropChance = Math.pow(congestion, 3) * 0.4;
                    if (Math.random() < dropChance) {
                        p.isDropped = true;
                        setMetrics(m => ({ ...m, dropped: m.dropped + 1 }));
                    }
                }

                // 3. DELIVERY & CLEANUP
                if (p.progress >= 1) {
                    if (!p.isDropped) {
                        setMetrics(m => {
                            const newDelivered = m.delivered + 1;
                            if (newDelivered >= 10 && onComplete) {
                                onComplete();
                            }
                            return { ...m, delivered: newDelivered };
                        });
                    }
                    currentPackets.splice(i, 1);
                    continue;
                }

                if (p.isDropped) {
                    p.opacity -= 0.025; // Dropped packets fade faster
                    if (p.opacity <= 0) {
                        currentPackets.splice(i, 1);
                        continue;
                    }
                }

                drawPacket(ctx, p);
            }

            drawNodes(ctx);
            if (currentPackets.length === 0 && isSimulating) setIsSimulating(false);
            animationRef.current = requestAnimationFrame(animate);
        };

        const drawLinks = (ctx: CanvasRenderingContext2D) => {
            ctx.setLineDash([10, 5]);
            ctx.lineWidth = 1.5;
            const drawLine = (from: NodePos, to: NodePos) => {
                ctx.strokeStyle = (from.active && to.active) ? THEME.link : "#f1f5f9";
                ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke();
            };
            drawLine(nodes.CLIENT, nodes.R_ALPHA); drawLine(nodes.CLIENT, nodes.R_BETA);
            drawLine(nodes.R_ALPHA, nodes.R_GAMMA); drawLine(nodes.R_ALPHA, nodes.R_DELTA);
            drawLine(nodes.R_BETA, nodes.R_GAMMA); drawLine(nodes.R_BETA, nodes.R_DELTA);
            drawLine(nodes.R_GAMMA, nodes.SERVER); drawLine(nodes.R_DELTA, nodes.SERVER);
            ctx.setLineDash([]);
        };

        const drawNodes = (ctx: CanvasRenderingContext2D) => {
            Object.values(nodes).forEach(node => {
                const color = node.active ? THEME[node.type] : THEME.inactive;
                ctx.shadowBlur = node.active ? 15 : 0; ctx.shadowColor = color;
                ctx.fillStyle = color;
                ctx.beginPath(); ctx.arc(node.x, node.y, 20, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;
                ctx.fillStyle = node.active ? "#1e293b" : "#94a3b8";
                ctx.font = "bold 10px Inter"; ctx.textAlign = "center";
                ctx.fillText(node.label, node.x, node.y + 38);
            });
        };

        const drawPacket = (ctx: CanvasRenderingContext2D, p: Packet) => {
            const segmentCount = p.path.length - 1;
            const segmentIdx = Math.min(Math.floor(p.progress * segmentCount), segmentCount - 1);
            const segmentProgress = (p.progress * segmentCount) % 1;
            const start = p.path[segmentIdx];
            const end = p.path[segmentIdx + 1];
            const x = start.x + (end.x - start.x) * segmentProgress;
            const y = start.y + (end.y - start.y) * segmentProgress;

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.isDropped ? "#94a3b8" : THEME.packet;
            if (!p.isDropped) { ctx.shadowBlur = 8; ctx.shadowColor = THEME.packet; }
            ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationRef.current);
    }, [congestion, nodes, isSimulating]);

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                            <Globe size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">Data Mesh Lab</h1>
                    </div>
                    <p className="text-muted-foreground font-medium">Test network resiliency. Toggle routers to observe rerouting and traffic loss.</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <MetricCard label="Delivered" value={metrics.delivered} color="text-emerald-600" />
                    <MetricCard label="Dropped" value={metrics.dropped} color="text-red-500" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
                        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-5 flex items-center gap-2">
                            <Zap size={14} className="text-amber-500" /> Control Plane
                        </h3>
                        <button
                            onClick={triggerBurst}
                            disabled={getValidPaths().length === 0}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-muted text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 mb-3"
                        >
                            <Play size={20} fill="currentColor" /> Inject Data
                        </button>
                        <button onClick={resetLab} className="w-full py-3 bg-muted hover:bg-accent text-muted-foreground rounded-2xl font-bold text-sm transition-all border border-border">
                            <RotateCcw size={16} className="inline mr-2" /> Reset Metrics
                        </button>
                    </div>

                    <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Traffic Load</h3>
                            <span className="text-xs font-black bg-primary/10 text-primary px-2.5 py-1 rounded-lg">
                                {(congestion * 100).toFixed(0)}%
                            </span>
                        </div>
                        <input
                            type="range" min="0" max="1" step="0.05"
                            value={congestion}
                            onChange={(e) => setCongestion(parseFloat(e.target.value))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-600 mb-4"
                        />
                        <div className="space-y-3">
                            <StatusRow label="Latency" active={congestion > 0.4} />
                            <StatusRow label="Loss Probability" active={congestion > 0.7} />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-9 relative">
                    <div className="absolute inset-0 z-30 pointer-events-none">
                        {Object.values(nodes).map(node => (
                            node.type === 'router' && (
                                <button
                                    key={node.id}
                                    onClick={() => toggleNode(node.id)}
                                    style={{ left: `${(node.x / 800) * 100}%`, top: `${(node.y / 400) * 100}%`, transform: 'translate(-50%, -50%)' }}
                                    className="absolute w-12 h-12 pointer-events-auto rounded-full group flex items-center justify-center"
                                >
                                    <div className="opacity-0 group-hover:opacity-100 bg-black/80 text-white text-[9px] py-1 px-2 rounded absolute bottom-full mb-2 whitespace-nowrap">
                                        Toggle Node Power
                                    </div>
                                </button>
                            )
                        ))}
                    </div>

                    <div className="relative bg-card border-2 border-border rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden">
                        <div className="absolute top-8 left-8 z-20">
                            <div className="px-4 py-2 bg-card/90 backdrop-blur-xl border border-border rounded-2xl shadow-sm flex items-center gap-3">
                                <Activity size={14} className={isSimulating ? "text-emerald-500" : "text-muted-foreground"} />
                                <span className="text-[11px] font-black text-foreground uppercase tracking-tighter">
                                    {getValidPaths().length === 0 ? 'Network Partitioned' : isSimulating ? 'Processing Traffic' : 'Network Ready'}
                                </span>
                            </div>
                        </div>

                        <canvas ref={canvasRef} width={800} height={400} className="w-full h-auto block bg-card" />
                    </div>

                    <div className="mt-6 flex justify-center gap-8">
                        <Legend dot={THEME.client} text="Source" />
                        <Legend dot={THEME.router} text="Router (Click to toggle)" />
                        <Legend dot={THEME.inactive} text="Failed Node" />
                    </div>
                </div>
            </div>

            {/* ── Step-by-Step Educational Guide for Packet Switching ── */}
            <div className="mt-12 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-black uppercase tracking-wider">
                                Step-by-Step Guide
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">How Packet Switching Works</span>
                        </div>
                        <h2 className="text-2xl font-black text-foreground tracking-tight">The 4 Core Steps of Packet Switching</h2>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted px-3.5 py-2 rounded-xl">
                        <Info size={16} className="text-indigo-500 shrink-0" />
                        <span>Click steps below to explore how data moves across the mesh</span>
                    </div>
                </div>

                {/* Steps Tabs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {PACKET_STEPS.map((stepItem, idx) => {
                        const Icon = stepItem.icon;
                        const isSelected = activeStep === idx;
                        return (
                            <button
                                key={stepItem.step}
                                onClick={() => setActiveStep(idx)}
                                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                                    isSelected
                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                        : "bg-card border-border hover:border-border/80 hover:bg-muted/50 text-foreground"
                                }`}
                            >
                                <div className={`p-2 rounded-xl shrink-0 ${isSelected ? "bg-white/20 text-white" : "bg-muted text-indigo-500"}`}>
                                    <Icon size={18} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Step {stepItem.step}</div>
                                    <div className="text-xs font-bold leading-tight">{stepItem.short}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Active Step Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-muted/40 p-6 rounded-2xl border border-border">
                    <div className="lg:col-span-8 space-y-3">
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                            {PACKET_STEPS[activeStep].title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {PACKET_STEPS[activeStep].desc}
                        </p>
                        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                            💡 {PACKET_STEPS[activeStep].highlight}
                        </div>
                    </div>

                    {/* Interactive Packet Header Inspector */}
                    <div className="lg:col-span-4 bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center justify-between">
                                <span>Packet Header Inspector</span>
                                <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded font-mono font-bold">IPv4 / TCP</span>
                            </div>
                            <div className="space-y-1.5 font-mono text-[11px]">
                                <div className="flex justify-between py-1 border-b border-border/50">
                                    <span className="text-muted-foreground">Source IP:</span>
                                    <span className="font-semibold text-foreground">192.168.1.45</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-border/50">
                                    <span className="text-muted-foreground">Dest IP:</span>
                                    <span className="font-semibold text-foreground">10.0.0.12</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-border/50">
                                    <span className="text-muted-foreground">Sequence #:</span>
                                    <span className="font-semibold text-indigo-500">#{(activeStep + 1) * 2} of 8</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-border/50">
                                    <span className="text-muted-foreground">TTL (Hops):</span>
                                    <span className="font-semibold text-foreground">64</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-muted-foreground">Payload Size:</span>
                                    <span className="font-semibold text-foreground">1,460 Bytes</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-border text-[10px] text-muted-foreground text-center">
                            Standard MTU Packet Frame
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------------- Components ---------------- */

function MetricCard({ label, value, color }: any) {
    return (
        <div className="bg-card px-5 py-3 rounded-2xl border border-border shadow-sm flex-1 md:min-w-[140px]">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-2xl font-black ${color} font-mono tracking-tighter`}>{value}</p>
        </div>
    );
}

function StatusRow({ label, active }: { label: string, active: boolean }) {
    return (
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
            <span className="text-muted-foreground">{label}</span>
            <span className={active ? "text-red-500 font-black" : "text-emerald-500"}>{active ? "Elevated" : "Optimal"}</span>
        </div>
    );
}

function Legend({ dot, text }: { dot: string, text: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dot }} />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tight">{text}</span>
        </div>
    );
}