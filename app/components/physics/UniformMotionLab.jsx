"use client";
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../ChatContext";

const STORAGE_KEY = "openlabs_kinematics_runs_v1";

export default function UniformMotionLab({
    initialVelocity = 1,
    initialAcceleration = 0,
    initialPosition = 0,
}) {
    // Chatbot 
    const { setExperimentData } = useChat();
  
  useEffect(() => {
    setExperimentData({
      title: "Uniform Motion",
      theory: "uniform linear motion using a moving object",
      extraContext: ``,
    });
  }, []);
    const canvasRef = useRef(null);
    const rafRef = useRef(null);

    // physics refs
    const xRef = useRef(initialPosition);
    const vRef = useRef(initialVelocity);
    const tRef = useRef(0);

    // state
    const [velocity, setVelocity] = useState(initialVelocity);
    const [acceleration, setAcceleration] = useState(initialAcceleration);
    const [running, setRunning] = useState(false);

    const [time, setTime] = useState(0);
    const [position, setPosition] = useState(initialPosition);

    // ✅ NEW: graph mode
    const [graphMode, setGraphMode] = useState("x-t");
    // "x-t" | "v-t" | "a-t"

    const dataRef = useRef([]); // {t, x, v}

    /* ================= Animation Loop ================= */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        function resize() {
            const w = canvas.parentElement.clientWidth;
            canvas.width = w;
            canvas.height = 340;
        }
        resize();
        window.addEventListener("resize", resize);

        let last = performance.now();

        function step(now) {
            const dt = (now - last) / 1000;
            last = now;

            if (running) {
                tRef.current += dt;
                vRef.current += acceleration * dt;
                xRef.current += vRef.current * dt;

                setTime(tRef.current);
                setPosition(xRef.current);
                setVelocity(vRef.current);

                dataRef.current.push({
                    t: tRef.current,
                    x: xRef.current,
                    v: vRef.current,
                });
                if (dataRef.current.length > 500) dataRef.current.shift();
            }

            draw(ctx, canvas);
            rafRef.current = requestAnimationFrame(step);
        }

        rafRef.current = requestAnimationFrame(step);
        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [running, acceleration, graphMode]);

    /* ================= Drawing ================= */
    function draw(ctx, canvas) {
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        // background
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(0, 0, w, h);

        // scale ticks
        ctx.strokeStyle = "#e5e7eb";
        for (let i = 40; i < w - 40; i += 60) {
            ctx.beginPath();
            ctx.moveTo(i, h / 2 - 10);
            ctx.lineTo(i, h / 2 + 10);
            ctx.stroke();
        }

        // track
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, h / 2);
        ctx.lineTo(w - 40, h / 2);
        ctx.stroke();

        // object
        const scale = 60;
        const xPixel = 40 + xRef.current * scale;

        // shadow
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.fillRect(xPixel - 18, h / 2 + 12, 36, 6);

        // body
        ctx.fillStyle = "#2563eb";
        ctx.beginPath();
        ctx.roundRect(xPixel - 18, h / 2 - 18, 36, 36, 8);
        ctx.fill();

        // direction arrow
        ctx.strokeStyle = velocity >= 0 ? "#16a34a" : "#dc2626";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xPixel, h / 2);
        ctx.lineTo(xPixel + Math.sign(velocity || 1) * 32, h / 2);
        ctx.stroke();

        drawMiniGraph(ctx, w, h);
    }

    /* ================= Graph ================= */
    function drawMiniGraph(ctx, w, h) {
        const gx = w - 300;
        const gy = h - 160;
        const gw = 280;
        const gh = 140;

        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#cbd5f5";
        ctx.fillRect(gx, gy, gw, gh);
        ctx.strokeRect(gx, gy, gw, gh);

        // axes
        ctx.strokeStyle = "#94a3b8";
        ctx.beginPath();
        ctx.moveTo(gx + 40, gy + 10);
        ctx.lineTo(gx + 40, gy + gh - 30);
        ctx.lineTo(gx + gw - 10, gy + gh - 30);
        ctx.stroke();

        // grid
        ctx.strokeStyle = "#e5e7eb";
        for (let i = 1; i <= 4; i++) {
            const y = gy + 10 + (i * (gh - 40)) / 4;
            ctx.beginPath();
            ctx.moveTo(gx + 40, y);
            ctx.lineTo(gx + gw - 10, y);
            ctx.stroke();
        }

        const pts = dataRef.current;
        if (pts.length < 2) return;

        const maxT = pts[pts.length - 1].t || 1;

        let values, label, color;

        if (graphMode === "x-t") {
            values = pts.map(p => p.x);
            label = "Distance–Time (x–t)";
            color = "#16a34a";
        } else if (graphMode === "v-t") {
            values = pts.map(p => p.v);
            label = "Velocity–Time (v–t)";
            color = "#2563eb";
        } else {
            values = pts.map(() => acceleration);
            label = "Acceleration–Time (a–t)";
            color = "#dc2626";
        }

        const maxVal = Math.max(...values.map(v => Math.abs(v)), 1);

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        pts.forEach((p, i) => {
            const x = gx + 40 + (p.t / maxT) * (gw - 50);
            const y =
                gy +
                gh -
                30 -
                ((values[i] + maxVal) / (2 * maxVal)) * (gh - 50);

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        ctx.stroke();

        ctx.fillStyle = "#0f172a";
        ctx.font = "12px sans-serif";
        ctx.fillText(label, gx + 10, gy + 14);
    }

    /* ================= Helpers ================= */
    function reset() {
        setRunning(false);
        tRef.current = 0;
        xRef.current = initialPosition;
        vRef.current = velocity;
        dataRef.current = [];
        setTime(0);
        setPosition(initialPosition);
    }

    function exportCSV() {
        const meta = [
            ["# Kinematics Lab Data Export"],
            [`# Date: ${new Date().toLocaleString()}`],
            [`# Initial Velocity (m/s): ${velocity}`],
            [`# Acceleration (m/s^2): ${acceleration}`],
            ["#"],
        ];

        const headers = ["time_s", "position_m", "velocity_mps"];
        const rows = dataRef.current.map(d => [
            d.t.toFixed(4),
            d.x.toFixed(4),
            d.v.toFixed(4),
        ]);

        const csv = [
            ...meta.map(r => r.join(",")),
            headers.join(","),
            ...rows.map(r => r.join(",")),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `kinematics_lab_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function printReport() {
        const rows = dataRef.current.slice(-200);

        const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Kinematics Lab Report</title>
  <style>
    body {
      font-family: "Segoe UI", Arial, sans-serif;
      margin: 32px;
      color: #111827;
    }
    h1 {
      text-align: center;
      margin-bottom: 4px;
    }
    h2 {
      margin-top: 28px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 4px;
    }
    .subtitle {
      text-align: center;
      color: #6b7280;
      margin-bottom: 24px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 12px;
    }
    .card {
      background: #f9fafb;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      font-size: 13px;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 6px 8px;
      text-align: right;
    }
    th {
      background: #f3f4f6;
      text-align: center;
    }
    .footer {
      margin-top: 32px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
    .print-btn {
      margin-top: 24px;
      text-align: center;
    }
    button {
      padding: 8px 16px;
      font-size: 14px;
    }
  </style>
</head>

<body>
  <h1>KINEMATICS LAB REPORT</h1>
  <div class="subtitle">Uniform & Uniformly Accelerated Motion</div>

  <h2>Experiment Details</h2>
  <div class="grid">
    <div class="card"><strong>Initial Velocity:</strong> ${velocity.toFixed(2)} m/s</div>
    <div class="card"><strong>Acceleration:</strong> ${acceleration.toFixed(2)} m/s²</div>
    <div class="card"><strong>Total Time:</strong> ${time.toFixed(2)} s</div>
    <div class="card"><strong>Final Position:</strong> ${position.toFixed(2)} m</div>
  </div>

  <h2>Observation Table</h2>
  <table>
    <thead>
      <tr>
        <th>Time (s)</th>
        <th>Position (m)</th>
        <th>Velocity (m/s)</th>
      </tr>
    </thead>
    <tbody>
      ${rows.map(r => `
        <tr>
          <td>${r.t.toFixed(3)}</td>
          <td>${r.x.toFixed(3)}</td>
          <td>${r.v.toFixed(3)}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <div class="footer">
    Generated by OpenLabs Virtual Physics Laboratory<br/>
    ${new Date().toLocaleString()}
  </div>

  <div class="print-btn">
    <button onclick="window.print()">Print / Save as PDF</button>
  </div>
</body>
</html>
`;

        const w = window.open("", "_blank");
        w.document.write(html);
        w.document.close();
    }


    function saveRun() {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        saved.push({ date: new Date().toISOString(), params: { velocity, acceleration }, data: dataRef.current });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        alert("Run saved");
    }

    /* ================= UI ================= */
    return (
        <div className="max-w-6xl mx-auto p-4 space-y-4">
            <h2 className="text-2xl font-semibold">
                Kinematics — Uniform & Accelerated Motion Lab
            </h2>

            {/* Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                {[
                    ["Time", `${time.toFixed(2)} s`],
                    ["Position", `${position.toFixed(2)} m`],
                    ["Velocity", `${velocity.toFixed(2)} m/s`],
                    ["Acceleration", `${acceleration.toFixed(2)} m/s²`],
                ].map(([label, val]) => (
                    <div key={label} className="bg-slate-100 p-3 rounded shadow-sm">
                        <div className="text-xs text-gray-500">{label}</div>
                        <div className="font-mono text-lg">{val}</div>
                    </div>
                ))}
            </div>

            {/* Graph Mode Selector */}
            <div className="flex gap-2">
                {[
                    ["x-t", "Distance–Time"],
                    ["v-t", "Velocity–Time"],
                    ["a-t", "Acceleration–Time"],
                ].map(([mode, label]) => (
                    <button
                        key={mode}
                        onClick={() => setGraphMode(mode)}
                        className={`px-3 py-1 rounded text-sm border ${graphMode === mode
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {/* Controls */}
                <div className="bg-white p-4 rounded-xl shadow-md space-y-3">
                    <label className="text-sm">Initial Velocity (m/s)</label>
                    <input type="range" min="-10" max="10" step="0.1" value={velocity}
                        onChange={e => { const v = +e.target.value; setVelocity(v); vRef.current = v; }} />
                    <input type="number" value={velocity}
                        onChange={e => { const v = +e.target.value; setVelocity(v); vRef.current = v; }}
                        className="w-full border rounded px-2 py-1" />

                    <label className="text-sm">Acceleration (m/s²)</label>
                    <input type="range" min="-5" max="5" step="0.1" value={acceleration}
                        onChange={e => setAcceleration(+e.target.value)} />
                    <input type="number" value={acceleration}
                        onChange={e => setAcceleration(+e.target.value)}
                        className="w-full border rounded px-2 py-1" />

                    <div className="flex gap-2 pt-2">
                        <button onClick={() => setRunning(r => !r)} className="flex-1 py-2 bg-blue-600 text-white rounded">
                            {running ? "Pause" : "Start"}
                        </button>
                        <button onClick={reset} className="flex-1 py-2 bg-gray-200 rounded">
                            Reset
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={exportCSV}
                            className="flex-1 py-1 bg-green-600 text-white rounded"
                        >
                            Export CSV
                        </button>
                        <button
                            onClick={saveRun}
                            className="flex-1 py-1 bg-orange-500 text-white rounded"
                        >
                            Save Run
                        </button>
                    </div>

                    <button
                        onClick={printReport}
                        className="w-full mt-2 py-1 bg-indigo-600 text-white rounded"
                    >
                        Printable Report (PDF)
                    </button>

                </div>

                {/* Canvas */}
                <div className="md:col-span-2 bg-white p-3 rounded-xl shadow-md">
                    <canvas ref={canvasRef} className="w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
}
