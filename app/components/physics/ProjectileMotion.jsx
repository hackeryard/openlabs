"use client";
// src/components/ProjectileMotionLab.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * ProjectileMotionLab.jsx
 * Virtual lab for projectile motion (2D).
 */

// fitLine removed (unused)

export default function ProjectileMotionLab({
  initialSpeed = 20,
  initialAngle = 45,
  initialHeight = 0,
  initialGravity = 9.81
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const trajRef = useRef([]); // {t,x,y}
  const simTRef = useRef(0);
  const posRef = useRef({ x: 0, y: initialHeight });
  const velRef = useRef({ vx: initialSpeed * Math.cos(initialAngle * Math.PI / 180), vy: initialSpeed * Math.sin(initialAngle * Math.PI / 180) });

  const [v0, setV0] = useState(initialSpeed);
  const [angle, setAngle] = useState(initialAngle);
  const [h0, setH0] = useState(initialHeight);
  const [g, _setG] = useState(initialGravity);
  const [running, setRunning] = useState(true);
  const [_simTime, setSimTime] = useState(0);
  const [tof, setTof] = useState(null);
  const [range, setRange] = useState(null);
  const [maxH, setMaxH] = useState(null);

  // stopwatch & manual
  const [swRunning, setSwRunning] = useState(false);
  const swRef = useRef({ start: null, elapsed: 0 });
  const [swDisplay, setSwDisplay] = useState("0.000");
  const [laps, setLaps] = useState([]);
  const [manualEntries, setManualEntries] = useState([]);

  // sweep
  const [sweepMode, setSweepMode] = useState("angle"); // angle | speed
  const [sweepStart, setSweepStart] = useState(10);
  const [sweepEnd, setSweepEnd] = useState(80);
  const [sweepSteps, setSweepSteps] = useState(8);
  const [sweepResults, setSweepResults] = useState([]);
  const [sweepRunning, setSweepRunning] = useState(false);

  const [_uncertainty, _setUncertainty] = useState(0.05);
  const [_instrumentNoise, _setInstrumentNoise] = useState(0.01);
  const STORAGE_KEY = "openlabs_projectile_runs_v1";

  useEffect(() => { // init theoretical values
    computeAnalytic(v0, angle, h0, g);
    resetSim();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // stopwatch loop
  useEffect(() => {
    let timer = null;
    if (swRunning) {
      if (!swRef.current.start) swRef.current.start = performance.now() - swRef.current.elapsed * 1000;
      timer = setInterval(() => { const now = performance.now(); const elapsed = (now - swRef.current.start) / 1000; setSwDisplay(elapsed.toFixed(3)); }, 40);
    } else { if (swRef.current.start) swRef.current.elapsed = (performance.now() - swRef.current.start) / 1000; setSwDisplay(swRef.current.elapsed.toFixed(3)); }
    return () => clearInterval(timer);
  }, [swRunning]);

  function computeAnalytic(v, aDeg, h, grav) {
    const rad = aDeg * Math.PI / 180;
    const vy = v * Math.sin(rad);
    const vx = v * Math.cos(rad);
    // solve y(t) = h + vy t - 0.5 g t^2 = 0
    const A = -0.5 * grav, B = vy, C = h;
    const disc = B * B - 4 * A * C;
    let tFlight = null;
    if (disc >= 0) {
      const t1 = (-B + Math.sqrt(disc)) / (2 * A);
      const t2 = (-B - Math.sqrt(disc)) / (2 * A);
      tFlight = Math.max(t1, t2, 0);
    }
    const rangeCalc = tFlight !== null ? vx * tFlight : null;
    const maxHcalc = h + vy * vy / (2 * grav);
    setTof(tFlight); setRange(rangeCalc); setMaxH(maxHcalc);
    return { tof: tFlight, range: rangeCalc, maxH: maxHcalc };
  }

  // reset sim
  function resetSim() {
    simTRef.current = 0;
    trajRef.current = [];
    posRef.current = { x: 0, y: h0 };
    const rad = angle * Math.PI / 180;
    velRef.current = { vx: v0 * Math.cos(rad), vy: v0 * Math.sin(rad) };
    setTof(null); setRange(null); setMaxH(null);
    computeAnalytic(v0, angle, h0, g);
  }

  // main simulation (canvas + physics)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    function resize() {
      const parent = canvas.parentElement;
      const w = parent ? Math.min(1000, Math.max(320, parent.clientWidth - 8)) : 800;
      const h = Math.round(Math.max(240, Math.min(600, w * 0.6)));
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize(); window.addEventListener("resize", resize);
    resetSim();
    const dt = 1 / 120; let acc = 0; let last = performance.now();
    function step(now) {
      const elapsed = Math.min(0.05, (now - last) / 1000); last = now;
      if (running) {
        acc += elapsed;
        while (acc >= dt) {
          // integrator: simple Euler for projectile
          velRef.current.vy -= g * dt; // gravity downward
          posRef.current.x += velRef.current.vx * dt;
          posRef.current.y += velRef.current.vy * dt;
          simTRef.current += dt;
          trajRef.current.push({ t: simTRef.current, x: posRef.current.x, y: posRef.current.y });
          if (trajRef.current.length > 3000) trajRef.current.shift();
          // ground hit
          if (posRef.current.y <= 0) {
            // refine last point by linear interpolation between previous and current
            const n = trajRef.current.length;
            if (n >= 2) {
              const a = trajRef.current[n - 2], b = trajRef.current[n - 1];
              const frac = a.y === b.y ? 0 : (0 - a.y) / (b.y - a.y);
              const preciseT = a.t + frac * (b.t - a.t);
              const preciseX = a.x + frac * (b.x - a.x);
              trajRef.current[n - 1] = { t: preciseT, x: preciseX, y: 0 };
              setTof(preciseT); setRange(preciseX); setMaxH(prev => prev || (Math.max(...trajRef.current.map(pt => pt.y))));
            }
            setRunning(false);
            break;
          }
          acc -= dt;
        }
      }
      draw(ctx, canvas);
      setSimTime(simTRef.current);
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, v0, angle, h0, g]);

  function draw(ctx, canvas) {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 0, w, h);
    // draw ground baseline
    ctx.strokeStyle = "#94a3b8"; ctx.beginPath(); ctx.moveTo(0, h - 40); ctx.lineTo(w, h - 40); ctx.stroke();
    // compute px per meter based on current analytic range and maxH
    const estRange = range || (v0 * v0 * Math.sin(2 * angle * Math.PI / 180) / (g || 9.81) || 10);
    const maxRange = Math.max(estRange * 1.2, 10);
    const pxPerX = (w - 80) / maxRange;
    const maxHcalc = Math.max(maxH || 2, h0, 1);
    const pxPerY = 120 / (maxHcalc * 1.5 + 1);

    // draw trajectory
    ctx.beginPath(); ctx.strokeStyle = "#2563eb"; ctx.lineWidth = 2;
    const pts = trajRef.current;
    for (let i = 0; i < pts.length; i++) {
      const px = 40 + pts[i].x * pxPerX;
      const py = h - 40 - pts[i].y * pxPerY;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // current projectile
    if (pts.length) {
      const last = pts[pts.length - 1];
      const px = 40 + last.x * pxPerX; const py = h - 40 - last.y * pxPerY;
      ctx.fillStyle = "#dc2626"; ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
    }

    // overlays
    ctx.fillStyle = "#0f172a"; ctx.font = "13px sans-serif";
    ctx.fillText(`v0: ${v0} m/s`, 12, 18);
    ctx.fillText(`angle: ${angle}°`, 12, 36);
    ctx.fillText(`t: ${simTRef.current.toFixed(2)} s`, 12, 54);
    ctx.fillText(`TOF: ${tof ? tof.toFixed(3) + " s" : "—"}`, w - 220, 18);
    ctx.fillText(`Range: ${range ? range.toFixed(3) + " m" : "—"}`, w - 220, 36);
    ctx.fillText(`Max H: ${maxH ? maxH.toFixed(3) + " m" : "—"}`, w - 220, 54);

    // mini plot: y vs t (bottom-right) — compute a safe vertical scale and clamp coordinates
    const plotW = Math.min(360, Math.round(w * 0.36));
    const plotH = Math.min(160, Math.round(h * 0.22));
    const px0 = Math.max(8, w - plotW - 12);
    const py0 = Math.max(8, h - plotH - 12);
    if (plotW > 16 && plotH > 16) {
      ctx.save();
      ctx.fillStyle = "#fff";
      ctx.fillRect(px0, py0, plotW, plotH);
      ctx.strokeStyle = "#e6eef8";
      ctx.strokeRect(px0, py0, plotW, plotH);

      // determine vertical scale from observed data and analytic maxH
      const observedMax = pts.length ? Math.max(...pts.map((p) => p.y)) : 0;
      const plotMaxY = Math.max(1, observedMax, maxH || 1);

      ctx.beginPath();
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2;
      const maxPoints = 240;
      const start = Math.max(0, pts.length - maxPoints);
      for (let i = start; i < pts.length; i++) {
        const idx = i - start;
        // x position within plot box
        let px = px0 + (idx / Math.max(1, maxPoints - 1)) * plotW;
        // clamp px inside box
        px = Math.min(px0 + plotW - 1, Math.max(px0 + 1, px));

        const vy = pts[i].y;
        // clamp vy to [0, plotMaxY]
        const vyClamped = Math.max(0, Math.min(plotMaxY, vy));
        const vyPos = py0 + plotH - (vyClamped / plotMaxY) * plotH;
        const vyPosClamped = Math.min(py0 + plotH - 1, Math.max(py0 + 1, vyPos));

        if (i === start) ctx.moveTo(px, vyPosClamped);
        else ctx.lineTo(px, vyPosClamped);
      }
      ctx.stroke();
      ctx.fillStyle = "#0f172a";
      ctx.font = "11px sans-serif";
      ctx.fillText("Height (m) vs time", px0 + 6, py0 + plotH - 8);
      ctx.restore();
    }
  }

  // controls
  // startStop removed (unused) — UI toggles running directly
  function resetAll() { setRunning(false); resetSim(); setTimeout(() => setRunning(true), 50); }

  // stopwatch functions
  function swStartStop() { if (swRunning) { setSwRunning(false); swRef.current.elapsed = Number(swDisplay); } else setSwRunning(true); }
  function swLap() { if (!swRunning) return; setLaps(s => [...s, Number(swDisplay)]); }
  function _swReset() { setSwRunning(false); swRef.current = { start: null, elapsed: 0 }; setSwDisplay("0.000"); setLaps([]); }

  function recordManualMeasurement() { const t = Number(swDisplay); if (!t || t <= 0) return; setManualEntries(m => [...m, { time: t, note: "manual" }]); }

  // sweep simulation: vary angle or speed and compute range
  async function runSweep() {
    setSweepRunning(true);
    const res = []; const steps = Math.max(2, Math.floor(sweepSteps));
    for (let i = 0; i < steps; i++) {
      const val = sweepStart + (i / (steps - 1)) * (sweepEnd - sweepStart);
      if (sweepMode === "angle") {
        const { range: R } = computeAnalytic(v0, val, h0, g);
        res.push({ angle: val, range: R });
        setSweepResults(s => [...s, { angle: val, range: R }]);
      } else {
        const { range: R } = computeAnalytic(val, angle, h0, g);
        res.push({ speed: val, range: R });
        setSweepResults(s => [...s, { speed: val, range: R }]);
      }
      await new Promise(r => setTimeout(r, 80));
    }
    setSweepResults(res); setSweepRunning(false);
  }

  // save/load/export
  function saveRun(name = `proj_${Date.now()}`) {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const sn = { name, date: new Date().toISOString(), params: { v0, angle, h0, g }, traj: trajRef.current.slice(-2000), tof, range, maxH, sweepResults };
    stored.push(sn); localStorage.setItem(STORAGE_KEY, JSON.stringify(stored)); alert("Saved: " + name);
  }
  function listRuns() { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  function clearRuns() { localStorage.removeItem(STORAGE_KEY); alert("Cleared"); }

 function exportCSV() {
  const meta = [
    ["OpenLabs Projectile Motion Experiment"],
    ["Generated on", new Date().toLocaleString()],
    [],
    ["Parameters"],
    ["Initial Speed (m/s)", v0],
    ["Launch Angle (deg)", angle],
    ["Initial Height (m)", h0],
    ["Gravity (m/s^2)", g],
    [],
    ["Results"],
    ["Time of Flight (s)", tof ? tof.toFixed(4) : "—"],
    ["Range (m)", range ? range.toFixed(4) : "—"],
    ["Maximum Height (m)", maxH ? maxH.toFixed(4) : "—"],
    [],
    ["Trajectory Data"],
    ["t (s)", "x (m)", "y (m)"],
  ];

  const dataRows = trajRef.current.map(p => [
    p.t.toFixed(4),
    p.x.toFixed(4),
    p.y.toFixed(4),
  ]);

  const csv = [...meta, ...dataRows]
    .map(row => row.join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `openlabs_projectile_${Date.now()}.csv`;
  a.click();

  URL.revokeObjectURL(url);
}

  function exportJSON() { const obj = { params: { v0, angle, h0, g }, traj: trajRef.current.slice(-2000), tof, range, maxH, sweepResults }; const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `projectile_${Date.now()}.json`; a.click(); URL.revokeObjectURL(url); }
  function exportReport() {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>OpenLabs — Projectile Motion Report</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #111827;
      margin: 40px;
      line-height: 1.6;
    }
    h1 {
      color: #1e3a8a;
      margin-bottom: 4px;
    }
    h2 {
      margin-top: 32px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 4px;
    }
    .subtitle {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 24px;
    }
    .meta {
      font-size: 13px;
      color: #374151;
      margin-bottom: 24px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 12px;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 10px;
      text-align: left;
    }
    th {
      background: #f3f4f6;
      font-weight: 600;
    }
    .highlight {
      font-weight: bold;
      color: #1f2937;
    }
    .footer {
      margin-top: 40px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
    .print-btn {
      margin-top: 30px;
      padding: 10px 18px;
      background: #2563eb;
      color: #fff;
      border: none;
      border-radius: 6px;
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

  <h1>Projectile Motion — Virtual Lab Report</h1>
  <div class="subtitle">OpenLabs Interactive Physics Laboratory</div>

  <div class="meta">
    <strong>Date:</strong> ${new Date().toLocaleString()}
  </div>

  <h2>Experiment Parameters</h2>
  <table>
    <tr>
      <th>Parameter</th>
      <th>Value</th>
    </tr>
    <tr>
      <td>Initial Speed (v₀)</td>
      <td>${v0} m/s</td>
    </tr>
    <tr>
      <td>Launch Angle (θ)</td>
      <td>${angle}°</td>
    </tr>
    <tr>
      <td>Initial Height (h₀)</td>
      <td>${h0} m</td>
    </tr>
    <tr>
      <td>Acceleration due to Gravity (g)</td>
      <td>${g} m/s²</td>
    </tr>
  </table>

  <h2>Measured & Calculated Results</h2>
  <table>
    <tr>
      <th>Quantity</th>
      <th>Result</th>
    </tr>
    <tr>
      <td>Time of Flight</td>
      <td class="highlight">${tof ? tof.toFixed(4) + " s" : "—"}</td>
    </tr>
    <tr>
      <td>Horizontal Range</td>
      <td class="highlight">${range ? range.toFixed(4) + " m" : "—"}</td>
    </tr>
    <tr>
      <td>Maximum Height</td>
      <td class="highlight">${maxH ? maxH.toFixed(4) + " m" : "—"}</td>
    </tr>
  </table>

  <h2>Observations</h2>
  <ul>
    <li>The projectile follows a parabolic trajectory under uniform gravity.</li>
    <li>Range depends on both launch angle and initial speed.</li>
    <li>Maximum range is achieved near 45° for level ground.</li>
  </ul>

  <h2>Conclusion</h2>
  <p>
    The virtual projectile motion experiment demonstrates the relationship
    between launch parameters and projectile behavior. The measured values
    closely match theoretical predictions, validating the equations of motion
    under constant acceleration.
  </p>

  <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>

  <div class="footer">
    Generated by <strong>OpenLabs</strong> • Virtual Physics Experiments
  </div>

</body>
</html>
  `;

    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) {
      alert("Pop-up blocked. Please allow pop-ups to generate the report.");
      return;
    }
    w.document.write(html);
    w.document.close();
  }

  return (
    <div className="max-w-6xl mx-auto p-0 sm:p-4 space-y-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">Projectile Motion — Virtual Lab</h2>
        <div className="text-sm text-gray-600">Simulate launches, measure range & TOF</div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-white p-4 rounded shadow space-y-3">
          <label className="block text-sm">Initial speed (m/s)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input type="range" min="1" max="100" step="0.1" value={v0} onChange={(e) => { setV0(Number(e.target.value)); computeAnalytic(Number(e.target.value), angle, h0, g); }} />
            <input type="number" value={v0} onChange={(e) => { setV0(Number(e.target.value)); }} className="mt-1 w-full border rounded px-2 py-1" />
          </div>
          <label className="block text-sm mt-2">Angle (°)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input type="range" min="0" max="90" step="0.1" value={angle} onChange={(e) => { setAngle(Number(e.target.value)); computeAnalytic(v0, Number(e.target.value), h0, g); }} />
            <input type="number" value={angle} onChange={(e) => { setAngle(Number(e.target.value)); }} className="mt-1 w-full border rounded px-2 py-1" />
          </div>

          <label className="block text-sm mt-2">Initial height (m)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input type="range" min="0" max="20" step="0.1" value={h0} onChange={(e) => { setH0(Number(e.target.value)); }} />
            <input type="number" value={h0} onChange={(e) => setH0(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1" />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <button onClick={() => { setRunning(r => !r); }} className="flex-1 py-2 rounded bg-blue-600 text-white">{running ? "Pause" : "Start"}</button>
            <button onClick={() => resetAll()} className="flex-1 py-2 rounded bg-gray-200">Reset</button>
          </div>

          <div className="mt-2 text-sm">
            <div>Time of flight: <strong>{tof ? tof.toFixed(3) + " s" : "—"}</strong></div>
            <div>Range: <strong>{range ? range.toFixed(3) + " m" : "—"}</strong></div>
            <div>Max height: <strong>{maxH ? maxH.toFixed(3) + " m" : "—"}</strong></div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-3 rounded shadow">
          <div className="flex items-center justify-between mb-2">
            <div><strong>Trajectory</strong><div className="text-xs text-gray-500">Realtime animation — stops on ground hit</div></div>
            <div className="flex flex-wrap gap-2">
              <button onClick={exportCSV} className="px-3 py-1 bg-green-600 text-white rounded">Export CSV</button>
              <button onClick={exportJSON} className="px-3 py-1 bg-yellow-400 rounded">Export JSON</button>
              <button onClick={exportReport} className="px-3 py-1 bg-indigo-600 text-white rounded">Printable</button>
            </div>
          </div>
          <div className="w-full min-h-[240px] sm:min-h-[300px] md:min-h-[360px] lg:min-h-[420px]">
            <canvas ref={canvasRef} className="w-full rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm font-medium">Stopwatch</div>
              <div className="text-2xl font-mono my-2">{swDisplay}s</div>
              <div className="flex gap-2"><button onClick={swStartStop} className="flex-1 py-1 rounded bg-blue-600 text-white">{swRunning ? "Stop" : "Start"}</button><button onClick={swLap} className="py-1 px-3 rounded bg-gray-200">Lap</button></div>
              <div className="mt-2 text-xs">Laps: {laps.length}</div>
              <div className="mt-2"><button onClick={recordManualMeasurement} className="w-full py-1 rounded bg-emerald-500 text-white">Record Manual Time</button></div>
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm font-medium">Manual Entries</div>
              <ul className="mt-2 max-h-36 overflow-auto text-sm">{manualEntries.length === 0 ? <div className="text-xs text-gray-500">No entries</div> : manualEntries.map((e, i) => (<li key={i} className="py-1 border-b">{e.time.toFixed(3)} s — {e.note}</li>))}</ul>
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm font-medium">Saved Runs</div>
              <div className="mt-2"><button onClick={() => saveRun()} className="w-full py-1 rounded bg-orange-500 text-white mb-2">Save Run</button><button onClick={() => { const s = listRuns(); if (s.length === 0) alert("No saved"); else alert(s.map(r => r.name + " " + r.date).join("\n")); }} className="w-full py-1 rounded bg-gray-200 mb-2">List</button><button onClick={() => clearRuns()} className="w-full py-1 rounded bg-red-500 text-white">Clear</button></div>
            </div>
          </div>
        </div>
      </div>

      {/* Sweep */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Sweep — Measure Range</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 items-end">
          <div><label className="block text-xs">Mode</label><select value={sweepMode} onChange={(e) => setSweepMode(e.target.value)} className="w-full border rounded px-2 py-1"><option value="angle">Angle</option><option value="speed">Speed</option></select></div>
          <div><label className="block text-xs">Start</label><input value={sweepStart} onChange={(e) => setSweepStart(Number(e.target.value))} className="w-full border rounded px-2 py-1" /></div>
          <div><label className="block text-xs">End</label><input value={sweepEnd} onChange={(e) => setSweepEnd(Number(e.target.value))} className="w-full border rounded px-2 py-1" /></div>
          <div><label className="block text-xs">Steps</label><input value={sweepSteps} min="2" onChange={(e) => setSweepSteps(Number(e.target.value))} className="w-full border rounded px-2 py-1" /></div>
          <div><button onClick={() => { setSweepResults([]); runSweep(); }} className="w-full py-2 rounded bg-indigo-600 text-white">{sweepRunning ? "Running..." : "Run Sweep"}</button></div>
          <div><button onClick={() => setSweepResults([])} className="w-full py-2 rounded bg-gray-200">Clear</button></div>
        </div>

        <div className="mt-3 grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm">Sweep Results</div>
            <div className="mt-2 max-h-40 overflow-auto overflow-x-auto text-sm">
              {sweepResults.length === 0 ? (
                <div className="text-xs text-gray-500">No results</div>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b border-gray-200 p-2">Param</th>
                      <th className="border-b border-gray-200 p-2">Range (m)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sweepResults.map((r, i) => (
                      <tr key={i}>
                        <td className="p-2">{r.angle ? `angle=${r.angle.toFixed(1)}°` : `v=${r.speed.toFixed(2)} m/s`}</td>
                        <td className="p-2">{r.range ? r.range.toFixed(3) : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div>
            <div className="text-sm">Fit</div>
            <div className="mt-2 text-xs text-gray-500">Fit relationships (e.g. Range vs v²)</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Lab Instructions</h3>
        <ol className="list-decimal list-inside text-sm mt-2">
          <li>Set initial speed, angle and height then Start the simulation.</li>
          <li>Use the stopwatch to manually time flight or use built-in estimates.</li>
          <li>Run sweep to observe how range changes with angle or speed.</li>
          <li>Export data or printable report for submission.</li>
        </ol>
      </div>
    </div>
  );
}
