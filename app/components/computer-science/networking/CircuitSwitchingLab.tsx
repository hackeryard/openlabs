"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Zap, Globe, Activity, Lock, Unlock, Link as LinkIcon } from "lucide-react";
import { useChat } from "../../ChatContext";

/* ---------------- Types & Constants ---------------- */

type NodePos = { id: string; x: number; y: number; label: string; type: 'client' | 'router' | 'server'; active: boolean };

interface DataStream {
    id: number;
    progress: number;
    speed: number;
    path: NodePos[];
}

const THEME = {
    client: "#6366f1",
    router: "#f59e0b",
    server: "#10b981",
    stream: "#8b5cf6", // Purple for continuous stream
    link: "#e2e8f0",
    reserved: "#6366f1", // Indigo for reserved circuit
    inactive: "#cbd5e1",
};

export default function CircuitSwitchingLab() {
    // Chatbot 
    const { setExperimentData } = useChat();

    useEffect(() => {
        setExperimentData({
            title: "Circuit Switching",
            theory: "Computer networking circuit switching visualisation.",
            extraContext: ``,
        });
    }, []);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const streamRef = useRef<DataStream | null>(null);
    const animationRef = useRef<number>(0);

    const [metrics, setMetrics] = useState({ totalData: 0, circuitsEstablished: 0 });
    const [isReserved, setIsReserved] = useState(false);
    const [isTransmitting, setIsTransmitting] = useState(false);

    const [nodes] = useState<Record<string, NodePos>>({
        CLIENT: { id: 'CLIENT', x: 80, y: 200, label: "Source", type: 'client', active: true },
        SW_ALPHA: { id: 'SW_ALPHA', x: 300, y: 100, label: "Switch A", type: 'router', active: true },
        SW_BETA: { id: 'SW_BETA', x: 300, y: 300, label: "Switch B", type: 'router', active: true },
        SW_GAMMA: { x: 500, y: 100, label: "Switch C", type: 'router', active: true, id: 'SW_GAMMA' },
        SW_DELTA: { x: 500, y: 300, label: "Switch D", type: 'router', active: true, id: 'SW_DELTA' },
        SERVER: { id: 'SERVER', x: 720, y: 200, label: "Destination", type: 'server', active: true },
    });

    const [reservedPath, setReservedPath] = useState<NodePos[] | null>(null);

    /* ---------------- Actions ---------------- */

    const establishCircuit = () => {
        // Circuit switching logic: Pick one path and lock it
        const possiblePaths = [
            [nodes.CLIENT, nodes.SW_ALPHA, nodes.SW_GAMMA, nodes.SERVER],
            [nodes.CLIENT, nodes.SW_BETA, nodes.SW_DELTA, nodes.SERVER],
        ];
        const path = possiblePaths[Math.floor(Math.random() * possiblePaths.length)];

        setReservedPath(path);
        setIsReserved(true);
        setMetrics(m => ({ ...m, circuitsEstablished: m.circuitsEstablished + 1 }));
    };

    const startTransmission = () => {
        if (!reservedPath) return;
        setIsTransmitting(true);
        streamRef.current = {
            id: Date.now(),
            progress: 0,
            speed: 0.005,
            path: reservedPath
        };
    };

    const releaseCircuit = () => {
        streamRef.current = null;
        setReservedPath(null);
        setIsReserved(false);
        setIsTransmitting(false);
    };

    const resetLab = () => {
        releaseCircuit();
        setMetrics({ totalData: 0, circuitsEstablished: 0 });
    };

    /* ---------------- Animation Engine ---------------- */

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawPhysicalLinks(ctx);
            drawReservedCircuit(ctx);

            if (streamRef.current) {
                const s = streamRef.current;
                s.progress += s.speed;

                if (s.progress >= 1) {
                    setMetrics(m => ({ ...m, totalData: m.totalData + 100 })); // Large chunk of data
                    s.progress = 0; // In circuit switching, data is continuous
                }
                drawStream(ctx, s);
            }

            drawNodes(ctx);
            animationRef.current = requestAnimationFrame(animate);
        };

        const drawPhysicalLinks = (ctx: CanvasRenderingContext2D) => {
            ctx.strokeStyle = THEME.link;
            ctx.setLineDash([]);
            ctx.lineWidth = 2;
            const links = [
                [nodes.CLIENT, nodes.SW_ALPHA], [nodes.CLIENT, nodes.SW_BETA],
                [nodes.SW_ALPHA, nodes.SW_GAMMA], [nodes.SW_BETA, nodes.SW_DELTA],
                [nodes.SW_GAMMA, nodes.SERVER], [nodes.SW_DELTA, nodes.SERVER]
            ];
            links.forEach(([from, to]) => {
                ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke();
            });
        };

        const drawReservedCircuit = (ctx: CanvasRenderingContext2D) => {
            if (!reservedPath) return;
            ctx.strokeStyle = THEME.reserved;
            ctx.lineWidth = 6;
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.moveTo(reservedPath[0].x, reservedPath[0].y);
            reservedPath.forEach(node => ctx.lineTo(node.x, node.y));
            ctx.stroke();
            ctx.globalAlpha = 1.0;
        };

        const drawNodes = (ctx: CanvasRenderingContext2D) => {
            Object.values(nodes).forEach(node => {
                const isPartOfCircuit = reservedPath?.some(n => n.id === node.id);
                const color = isPartOfCircuit ? THEME.reserved : THEME[node.type];

                ctx.shadowBlur = isPartOfCircuit ? 20 : 0; ctx.shadowColor = color;
                ctx.fillStyle = color;
                ctx.beginPath(); ctx.arc(node.x, node.y, 20, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;

                ctx.fillStyle = "#1e293b"; ctx.font = "bold 10px Inter"; ctx.textAlign = "center";
                ctx.fillText(node.label, node.x, node.y + 38);
            });
        };

        const drawStream = (ctx: CanvasRenderingContext2D, s: DataStream) => {
            const segmentCount = s.path.length - 1;
            const segmentIdx = Math.min(Math.floor(s.progress * segmentCount), segmentCount - 1);
            const segmentProgress = (s.progress * segmentCount) % 1;
            const start = s.path[segmentIdx];
            const end = s.path[segmentIdx + 1];
            const x = start.x + (end.x - start.x) * segmentProgress;
            const y = start.y + (end.y - start.y) * segmentProgress;

            // Draw leading "head" of the stream
            ctx.fillStyle = THEME.stream;
            ctx.shadowBlur = 10; ctx.shadowColor = THEME.stream;
            ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();

            // In Circuit Switching, we visualize the data as a continuous flow
            ctx.strokeStyle = THEME.stream;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(s.path[0].x, s.path[0].y);
            for (let i = 0; i <= segmentIdx; i++) ctx.lineTo(s.path[i].x, s.path[i].y);
            ctx.lineTo(x, y);
            ctx.stroke();
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationRef.current);
    }, [isReserved, isTransmitting, reservedPath]);

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                            <Activity size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Circuit Switching Lab</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Establish a dedicated physical path before transmitting continuous data.</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <MetricCard label="MB Transmitted" value={metrics.totalData} color="text-indigo-600" />
                    <MetricCard label="Circuits Setup" value={metrics.circuitsEstablished} color="text-amber-600" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                            <Zap size={14} className="text-amber-500" /> Connection Phase
                        </h3>

                        {!isReserved ? (
                            <button onClick={establishCircuit} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-100">
                                <LinkIcon size={20} /> Establish Circuit
                            </button>
                        ) : !isTransmitting ? (
                            <button onClick={startTransmission} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-100">
                                <Play size={20} fill="currentColor" /> Start Stream
                            </button>
                        ) : (
                            <button onClick={releaseCircuit} className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-100">
                                <Unlock size={20} /> Release Circuit
                            </button>
                        )}

                        <button onClick={resetLab} className="w-full mt-3 py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl font-bold text-sm transition-all border border-slate-200">
                            <RotateCcw size={16} className="inline mr-2" /> Reset Lab
                        </button>
                    </div>

                    <div className="bg-indigo-900 p-6 rounded-3xl text-white shadow-xl shadow-indigo-200">
                        <h3 className="text-[11px] font-bold opacity-60 uppercase tracking-widest mb-3">Network Status</h3>
                        <div className="space-y-4">
                            <StatusIndicator label="Dedicated Path" active={isReserved} />
                            <StatusIndicator label="Continuous Flow" active={isTransmitting} />
                            <StatusIndicator label="Resource Lock" active={isReserved} />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-9">
                    <div className="relative bg-white border-2 border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden">
                        <div className="absolute top-8 left-8 z-20">
                            <div className="px-4 py-2 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-sm flex items-center gap-3">
                                {isReserved ? <Lock size={14} className="text-indigo-600" /> : <Unlock size={14} className="text-slate-300" />}
                                <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">
                                    {isTransmitting ? 'Circuit Active: Data Flowing' : isReserved ? 'Circuit Established: Reserved' : 'Idle: Requesting Connection'}
                                </span>
                            </div>
                        </div>



                        <canvas ref={canvasRef} width={800} height={400} className="w-full h-auto block bg-[#fcfdfe]" />
                    </div>

                    <div className="mt-6 flex justify-center gap-8">
                        <Legend dot={THEME.client} text="Source" />
                        <Legend dot={THEME.reserved} text="Reserved Switch" />
                        <Legend dot={THEME.stream} text="Continuous Stream" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------------- Components ---------------- */

function MetricCard({ label, value, color }: any) {
    return (
        <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex-1 md:min-w-[140px]">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-2xl font-black ${color} font-mono tracking-tighter`}>{value}</p>
        </div>
    );
}

function StatusIndicator({ label, active }: { label: string, active: boolean }) {
    return (
        <div className="flex justify-between items-center text-[10px] font-bold uppercase">
            <span className="opacity-70">{label}</span>
            <span className={active ? "text-emerald-400" : "text-indigo-400"}>{active ? "YES" : "NO"}</span>
        </div>
    );
}

function Legend({ dot, text }: { dot: string, text: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dot }} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{text}</span>
        </div>
    );
}