"use client";
import React, { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "openlabs_freefall_runs_v1";

export default function FreeFallLab({
  initialVelocity = 0,
  initialGravity = 9.8,
  initialHeight = 5,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  // physics refs
  const yRef = useRef(initialHeight);
  const vRef = useRef(initialVelocity);
  const tRef = useRef(0);

  // state
  const [velocity, setVelocity] = useState(initialVelocity);
  const [gravity, setGravity] = useState(initialGravity);
  const [height, setHeight] = useState(initialHeight);
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);

  const [graphMode, setGraphMode] = useState("y-t"); // y-t | v-t | a-t
  const dataRef = useRef([]);

  /* ================= Animation Loop ================= */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      const w = canvas.parentElement.clientWidth;
      canvas.width = w;
      canvas.height = 420;
    }
    resize();
    window.addEventListener("resize", resize);

    let last = performance.now();

    function step(now) {
      const dt = (now - last) / 1000;
      last = now;

      if (running && yRef.current > 0) {
        tRef.current += dt;
        vRef.current += gravity * dt;
        yRef.current -= vRef.current * dt;

        if (yRef.current <= 0) {
          yRef.current = 0;
          setRunning(false); // auto stop
        }

        setTime(tRef.current);
        setVelocity(vRef.current);

        dataRef.current.push({
          t: tRef.current,
          y: yRef.current,
          v: vRef.current,
        });
        if (dataRef.current.length > 600) dataRef.current.shift();
      }

      draw(ctx, canvas);
      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [running, gravity, graphMode]);

  /* ================= Drawing ================= */
  function draw(ctx, canvas) {
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, w, h);

    // tower
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2, 40);
    ctx.lineTo(w / 2, h - 60);
    ctx.stroke();

    const scale = (h - 120) / Math.max(height, 0.1);
    const yPixel = 40 + (height - yRef.current) * scale;

    // ground
    ctx.strokeStyle = "#64748b";
    ctx.beginPath();
    ctx.moveTo(w / 2 - 50, h - 60);
    ctx.lineTo(w / 2 + 50, h - 60);
    ctx.stroke();

    // shadow
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.beginPath();
    ctx.ellipse(w / 2, h - 52, 18, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // ball
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.arc(w / 2, yPixel, 14, 0, Math.PI * 2);
    ctx.fill();

    drawGraph(ctx, w, h);
  }

  /* ================= Graph ================= */
  function drawGraph(ctx, w, h) {
    const gx = w - 300;
    const gy = 40;
    const gw = 260;
    const gh = 150;

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#cbd5f5";
    ctx.fillRect(gx, gy, gw, gh);
    ctx.strokeRect(gx, gy, gw, gh);

    ctx.strokeStyle = "#94a3b8";
    ctx.beginPath();
    ctx.moveTo(gx + 40, gy + 10);
    ctx.lineTo(gx + 40, gy + gh - 30);
    ctx.lineTo(gx + gw - 10, gy + gh - 30);
    ctx.stroke();

    const pts = dataRef.current;
    if (pts.length < 2) return;

    const maxT = pts[pts.length - 1].t || 1;

    let values, label, color;
    if (graphMode === "y-t") {
      values = pts.map(p => p.y);
      label = "Height–Time (y–t)";
      color = "#16a34a";
    } else if (graphMode === "v-t") {
      values = pts.map(p => p.v);
      label = "Velocity–Time (v–t)";
      color = "#2563eb";
    } else {
      values = pts.map(() => gravity);
      label = "Acceleration–Time (a–t)";
      color = "#dc2626";
    }

    const maxVal = Math.max(...values.map(v => Math.abs(v)), 1);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    pts.forEach((p, i) => {
      const x = gx + 40 + (p.t / maxT) * (gw - 50);
      const y = gy + gh - 30 - ((values[i] + maxVal) / (2 * maxVal)) * (gh - 50);
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
    yRef.current = height;
    vRef.current = velocity;
    dataRef.current = [];
    setTime(0);
  }

  function exportCSV() {
    const meta = [
      ["# OpenLabs Virtual Physics Laboratory"],
      ["# Experiment: Free Fall"],
      [`# Date: ${new Date().toLocaleString()}`],
      [`# Initial Height (m): ${height}`],
      [`# Gravity (m/s^2): ${gravity}`],
      [`# Initial Velocity (m/s): ${velocity}`],
      ["#"],
    ];

    const headers = ["time_s", "height_m", "velocity_mps"];
    const rows = dataRef.current.map(d => [
      d.t.toFixed(4),
      d.y.toFixed(4),
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
    a.download = `freefall_lab_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function saveRun() {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    saved.push({
      date: new Date().toISOString(),
      params: { gravity, height, velocity },
      data: dataRef.current,
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    alert("Run saved");
  }

    function printReport() {
        const rows = dataRef.current.slice(-200);

        const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Free Fall Lab Report</title>
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
    .subtitle {
      text-align: center;
      color: #6b7280;
      margin-bottom: 24px;
    }
    h2 {
      margin-top: 28px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 4px;
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
  <h1>FREE FALL LAB REPORT</h1>
  <div class="subtitle">Uniformly Accelerated Motion under Gravity</div>

  <h2>Experiment Details</h2>
  <div class="grid">
    <div class="card"><strong>Initial Height:</strong> ${height.toFixed(2)} m</div>
    <div class="card"><strong>Gravity:</strong> ${gravity.toFixed(2)} m/s²</div>
    <div class="card"><strong>Total Time:</strong> ${time.toFixed(2)} s</div>
    <div class="card"><strong>Final Velocity:</strong> ${velocity.toFixed(2)} m/s</div>
  </div>

  <h2>Observation Table</h2>
  <table>
    <thead>
      <tr>
        <th>Time (s)</th>
        <th>Height (m)</th>
        <th>Velocity (m/s)</th>
      </tr>
    </thead>
    <tbody>
      ${rows.map(r => `
        <tr>
          <td>${r.t.toFixed(3)}</td>
          <td>${r.y.toFixed(3)}</td>
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

  /* ================= UI ================= */
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Free Fall — Virtual Physics Lab</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        {[
          ["Time", `${time.toFixed(2)} s`],
          ["Height", `${yRef.current.toFixed(2)} m`],
          ["Velocity", `${velocity.toFixed(2)} m/s`],
          ["Gravity", `${gravity.toFixed(2)} m/s²`],
        ].map(([l, v]) => (
          <div key={l} className="bg-slate-100 p-3 rounded">
            <div className="text-xs text-gray-500">{l}</div>
            <div className="font-mono text-lg">{v}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {["y-t", "v-t", "a-t"].map(m => (
          <button
            key={m}
            onClick={() => setGraphMode(m)}
            className={`px-3 py-1 rounded border ${
              graphMode === m ? "bg-blue-600 text-white" : ""
            }`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow space-y-3">
          <label>Initial Velocity (m/s)</label>
          <input type="range" min="-10" max="10" step="0.1"
            value={velocity}
            onChange={e => {
              const v = +e.target.value;
              setVelocity(v);
              vRef.current = v;
              reset();
            }} />

          <label>Gravity (m/s²)</label>
          <input type="range" min="1" max="20" step="0.1"
            value={gravity}
            onChange={e => setGravity(+e.target.value)} />

          <label>Initial Height (m)</label>
          <input type="number" value={height}
            onChange={e => {
              const h = +e.target.value;
              setHeight(h);
              yRef.current = h;
              reset();
            }}
            className="w-full border rounded px-2 py-1" />

          <div className="flex gap-2">
            <button onClick={() => setRunning(r => !r)}
              className="flex-1 bg-blue-600 text-white py-2 rounded">
              {running ? "Pause" : "Start"}
            </button>
            <button onClick={reset}
              className="flex-1 bg-gray-200 py-2 rounded">
              Reset
            </button>
          </div>

          <div className="flex gap-2">
            <button onClick={exportCSV}
              className="flex-1 bg-green-600 text-white py-1 rounded">
              CSV
            </button>
            <button onClick={saveRun}
              className="flex-1 bg-orange-500 text-white py-1 rounded">
              Save
            </button>
          </div>

          <button onClick={printReport}
            className="w-full bg-indigo-600 text-white py-1 rounded">
            Printable Report (PDF)
          </button>
        </div>

        <div className="md:col-span-2 bg-white p-3 rounded-xl shadow">
          <canvas ref={canvasRef} className="w-full rounded" />
        </div>
      </div>
    </div>
  );
}
