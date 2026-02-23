"use client";
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../ChatContext";

const STORAGE_KEY = "openlabs_light_speed_runs_v1";
const C = 3e8;

const MEDIA = {
    Vacuum: 1.0,
    Air: 1.0003,
    Water: 1.33,
    Glass: 1.5,
    Diamond: 2.42,
};

const COLORS = {
    Vacuum: "#16a34a",
    Air: "#2563eb",
    Water: "#0ea5e9",
    Glass: "#9333ea",
    Diamond: "#dc2626",
};

export default function SpeedOfLightLab() {
    // Chatbot 
    const { setExperimentData } = useChat();
  
  useEffect(() => {
    setExperimentData({
      title: "Speed of Light",
      theory: "demonstration of chsnge in speed of light in different media",
      extraContext: ``,
    });
  }, []);
    const canvasRef = useRef(null);
    const rafRef = useRef(null);

    const tRef = useRef(0);
    const xRef = useRef(
        Object.fromEntries(Object.keys(MEDIA).map(m => [m, 0]))
    );

    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [graphMode, setGraphMode] = useState("d-t");

    const dataRef = useRef([]);

    /* ================= Animation Loop ================= */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        function resize() {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = 320;
        }
        resize();
        window.addEventListener("resize", resize);

        let last = performance.now();

        function step(now) {
            const dt = (now - last) / 1000;
            last = now;

            if (running) {
                tRef.current += dt;

                const distances = {};
                const velocities = {};

                Object.entries(MEDIA).forEach(([m, n]) => {
                    const v = C / n;
                    velocities[m] = v;
                    xRef.current[m] += v * dt;
                    distances[m] = xRef.current[m];
                });

                dataRef.current.push({
                    t: tRef.current,
                    distances,
                    velocities,
                });
                if (dataRef.current.length > 400) dataRef.current.shift();

                setTime(tRef.current);
            }

            draw(ctx, canvas);
            rafRef.current = requestAnimationFrame(step);
        }

        rafRef.current = requestAnimationFrame(step);
        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [running]);

    /* ================= Drawing ================= */
    function draw(ctx, canvas) {
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(0, 0, w, h);

        const lanes = Object.keys(MEDIA);
        const laneHeight = h / lanes.length;
        const scale = 1e-7;

        lanes.forEach((m, i) => {
            const y = i * laneHeight + laneHeight / 2;

            // lane
            ctx.strokeStyle = "#e5e7eb";
            ctx.beginPath();
            ctx.moveTo(20, y);
            ctx.lineTo(w - 20, y);
            ctx.stroke();

            // label + speed
            ctx.fillStyle = "#0f172a";
            ctx.font = "12px sans-serif";
            ctx.fillText(
                `${m}  |  v = ${(C / MEDIA[m]).toExponential(2)} m/s`,
                24,
                y - 10
            );

            // pulse
            const x = 40 + xRef.current[m] * scale;
            ctx.fillStyle = COLORS[m];
            ctx.beginPath();
            ctx.arc(x % (w - 60), y, 6, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    /* ================= Graph ================= */
    function Graph() {
        const canvas = canvasRef.current;
        if (!canvas || dataRef.current.length < 2) return null;

        return (
            <div className="bg-white p-3 rounded shadow">
                <h3 className="text-sm font-semibold mb-2">
                    {graphMode === "d-t" ? "Distance–Time" : "Velocity–Time"} Graph
                </h3>

                <svg width="100%" height="200" viewBox="0 0 500 200">
                    {Object.keys(MEDIA).map((m, idx) => {
                        const maxT = dataRef.current.at(-1).t;
                        const maxVal =
                            graphMode === "d-t"
                                ? Math.max(...dataRef.current.map(d => d.distances[m]))
                                : C;

                        const points = dataRef.current.map(d => {
                            const x = (d.t / maxT) * 480 + 10;
                            const val =
                                graphMode === "d-t" ? d.distances[m] : d.velocities[m];
                            const y = 190 - (val / maxVal) * 170;
                            return `${x},${y}`;
                        });

                        return (
                            <polyline
                                key={m}
                                points={points.join(" ")}
                                fill="none"
                                stroke={COLORS[m]}
                                strokeWidth="2"
                            />
                        );
                    })}
                </svg>
            </div>
        );
    }

    /* ================= Helpers ================= */
    function reset() {
        setRunning(false);
        tRef.current = 0;
        Object.keys(MEDIA).forEach(m => (xRef.current[m] = 0));
        dataRef.current = [];
        setTime(0);
    }

    function exportCSV() {
        const rows = [
            ["time_s", ...Object.keys(MEDIA).map(m => `${m}_distance_m`)],
            ...dataRef.current.map(d => [
                d.t.toFixed(4),
                ...Object.keys(MEDIA).map(m => d.distances[m].toExponential(3)),
            ]),
        ];
        const csv = rows.map(r => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `speed_of_light_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function saveRun() {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        saved.push({ date: new Date().toISOString(), data: dataRef.current });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        alert("Run saved");
    }

function printReport() {
  // Capture graph image from canvas
  const graphImage = canvasRef.current
    ? canvasRef.current.toDataURL("image/png")
    : "";

  // Auto conclusion helpers
  const fastest = Object.keys(MEDIA).reduce((a, b) =>
    MEDIA[a] < MEDIA[b] ? a : b
  );
  const slowest = Object.keys(MEDIA).reduce((a, b) =>
    MEDIA[a] > MEDIA[b] ? a : b
  );

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Speed of Light – Lab Report</title>
  <style>
    body {
      font-family: "Segoe UI", Arial, sans-serif;
      margin: 32px;
      color: #111827;
      line-height: 1.6;
    }

    h1 {
      text-align: center;
      margin-bottom: 4px;
      letter-spacing: 0.5px;
    }

    .subtitle {
      text-align: center;
      color: #6b7280;
      margin-bottom: 28px;
      font-size: 14px;
    }

    h2 {
      margin-top: 28px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 4px;
      font-size: 18px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 16px;
    }

    .info-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 12px;
      font-size: 14px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      font-size: 13px;
    }

    th, td {
      border: 1px solid #e5e7eb;
      padding: 8px;
      text-align: center;
    }

    th {
      background: #f3f4f6;
      font-weight: 600;
    }

    img {
      margin-top: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
    }

    .footer {
      margin-top: 36px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }

    .print-btn {
      margin-top: 24px;
      text-align: center;
    }

    button {
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
    }

    @media print {
      .print-btn {
        display: none;
      }
    }
  </style>
</head>

<body>

  <h1>SPEED OF LIGHT LAB REPORT</h1>
  <div class="subtitle">
    Comparison of Speed of Light in Different Media
  </div>

  <h2>Objectives</h2>
  <ul>
    <li>To study the variation of speed of light in different media.</li>
    <li>To understand the effect of refractive index on speed.</li>
    <li>To compare distances travelled by light in equal time intervals.</li>
  </ul>

  <h2>Theory</h2>
  <p>
    Light travels at its maximum speed in vacuum. When it enters a material
    medium, interactions with atoms cause a reduction in its speed.
    This reduction depends on the refractive index of the medium.
  </p>

  <h2>Formula Used</h2>
  <p style="font-size:16px; text-align:center;"><b>v = c / n</b></p>
  <ul>
    <li><b>v</b> = speed of light in medium (m/s)</li>
    <li><b>c</b> = speed of light in vacuum (3 × 10⁸ m/s)</li>
    <li><b>n</b> = refractive index of the medium</li>
  </ul>

  <h2>Experiment Overview</h2>
  <div class="info-grid">
    <div class="info-card">
      <strong>Speed of Light in Vacuum (c):</strong><br/>
      ${C.toExponential(3)} m/s
    </div>
    <div class="info-card">
      <strong>Total Time Elapsed:</strong><br/>
      ${time.toFixed(3)} s
    </div>
  </div>

  <h2>Observation Table</h2>
  <table>
    <thead>
      <tr>
        <th>Medium</th>
        <th>Refractive Index</th>
        <th>Speed (m/s)</th>
        <th>Distance Travelled (m)</th>
        <th>Time (s)</th>
      </tr>
    </thead>
    <tbody>
      ${Object.keys(MEDIA).map(m => `
        <tr>
          <td>${m}</td>
          <td>${MEDIA[m]}</td>
          <td>${(C / MEDIA[m]).toExponential(3)}</td>
          <td>${xRef.current[m].toExponential(3)}</td>
          <td>${time.toFixed(3)}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <h2>Graphical Analysis</h2>
  <p>Distance–Time comparison of light in different media:</p>
  ${graphImage ? `<img src="${graphImage}" width="100%" />` : "<p>(Graph unavailable)</p>"}

  <h2>Conclusion</h2>
  <p>
    From the experiment, it is observed that light travels fastest in
    <b>${fastest}</b> and slowest in <b>${slowest}</b>.
    This confirms that the speed of light decreases with increasing
    refractive index, validating the relation <b>v = c / n</b>.
  </p>

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
            <h2 className="text-2xl font-semibold">
                Speed of Light in Different Media — Comparison Lab
            </h2>

            {/* Graph + Controls row */}
            <div className="grid md:grid-cols-3 gap-4 items-start">

                {/* LEFT: Controls */}
                <div className="bg-white p-4 rounded shadow space-y-3">
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => setRunning(r => !r)}
                            className="bg-blue-600 text-white py-2 rounded"
                        >
                            {running ? "Pause" : "Start"}
                        </button>

                        <button
                            onClick={reset}
                            className="bg-gray-200 py-2 rounded"
                        >
                            Reset
                        </button>

                        <button
                            onClick={() => setGraphMode(g => (g === "d-t" ? "v-t" : "d-t"))}
                            className="bg-slate-200 py-2 rounded"
                        >
                            Toggle Graph
                        </button>
                    </div>

                    <hr />

                    <div className="flex gap-2">
                        <button
                            onClick={exportCSV}
                            className="flex-1 bg-green-600 text-white py-1 rounded"
                        >
                            CSV
                        </button>
                        <button
                            onClick={saveRun}
                            className="flex-1 bg-orange-500 text-white py-1 rounded"
                        >
                            Save
                        </button>
                    </div>

                    <button
                        onClick={printReport}
                        className="w-full bg-indigo-600 text-white py-1 rounded"
                    >
                        PDF
                    </button>
                </div>

                {/* RIGHT: Graph */}
                <div className="md:col-span-2">
                    <Graph />
                </div>
            </div>

            {/* Canvas (separate, no overlay) */}
            <div className="bg-white p-3 rounded shadow">
                <canvas ref={canvasRef} className="w-full rounded" />
            </div>

            {/* Results */}
            <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">Results</h3>
                <table className="w-full text-sm border">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="border p-2">Medium</th>
                            <th className="border p-2">Speed (m/s)</th>
                            <th className="border p-2">Distance (m)</th>
                            <th className="border p-2">Time (s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(MEDIA).map(m => (
                            <tr key={m}>
                                <td className="border p-2">{m}</td>
                                <td className="border p-2">
                                    {(C / MEDIA[m]).toExponential(3)}
                                </td>
                                <td className="border p-2">
                                    {xRef.current[m].toExponential(3)}
                                </td>
                                <td className="border p-2">
                                    {time.toFixed(3)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

}
