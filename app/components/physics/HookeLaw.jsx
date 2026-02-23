"use client";
// src/components/HookeLawLab.jsx
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../ChatContext";

/**
 * HookeLawLab.jsx
 * Virtual lab for Hooke's law / mass-spring system.
 */

function _fitLine(xs, ys) {
  const n = xs.length;
  if (n === 0) return null;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - meanX) * (ys[i] - meanY);
    den += (xs[i] - meanX) * (xs[i] - meanX);
  }
  const m = den === 0 ? 0 : num / den;
  const b = meanY - m * meanX;
  return { m, b };
}

export default function HookeLaw({
  initialM = 1.0,
  initialK = 10.0,
  initialC = 0.05,
  initialX = 0.5
}) {
  // Chatbot 
    const { setExperimentData } = useChat();
  
  useEffect(() => {
    setExperimentData({
      title: "Hooke Law",
      theory: "Mass spring virtual lab",
      extraContext: ``,
    });
  }, []);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const dataRef = useRef([]); // {t, x}
  const crossingsRef = useRef([]);
  const simTRef = useRef(0);
  const xRef = useRef(initialX);
  const vRef = useRef(0);

  const [m, setM] = useState(initialM);
  const [k, setK] = useState(initialK);
  const [c, setC] = useState(initialC);
  const [x0, setX0] = useState(initialX);
  const [running, setRunning] = useState(true);
  const [theoreticalT, setTheoreticalT] = useState(2 * Math.PI * Math.sqrt(initialM / initialK));
  const [measuredT, setMeasuredT] = useState(null);
  const [_simTime, setSimTime] = useState(0);

  // stopwatch
  const [swRunning, setSwRunning] = useState(false);
  const swRef = useRef({ start: null, elapsed: 0 });
  const [swDisplay, setSwDisplay] = useState("0.000");
  const [laps, setLaps] = useState([]);
  const [manualEntries, setManualEntries] = useState([]);

  // sweep
  const [sweepMode, setSweepMode] = useState("mass"); // mass or k
  const [sweepStart, setSweepStart] = useState(0.2);
  const [sweepEnd, setSweepEnd] = useState(3.0);
  const [sweepSteps, setSweepSteps] = useState(8);
  const [sweepResults, setSweepResults] = useState([]);
  const [sweepRunning, setSweepRunning] = useState(false);

  const [_uncertainty, _setUncertainty] = useState(0.02);
  const [, setStatus] = useState("");
  const [_instrumentNoise, _setInstrumentNoise] = useState(0.005);

  const STORAGE_KEY = "openlabs_hooke_runs_v1";

  // theoretical T update
  useEffect(() => {
    if (m > 0 && k > 0) setTheoreticalT(2 * Math.PI * Math.sqrt(m / k));
    else setTheoreticalT(0);
  }, [m, k]);

  // stopwatch loop
  useEffect(() => {
    let timer = null;
    if (swRunning) {
      if (!swRef.current.start) swRef.current.start = performance.now() - swRef.current.elapsed * 1000;
      timer = setInterval(() => {
        const now = performance.now();
        const elapsed = (now - swRef.current.start) / 1000;
        setSwDisplay(elapsed.toFixed(3));
      }, 40);
    } else {
      if (swRef.current.start) swRef.current.elapsed = (performance.now() - swRef.current.start) / 1000;
      setSwDisplay(swRef.current.elapsed.toFixed(3));
    }
    return () => clearInterval(timer);
  }, [swRunning]);

  // main simulation loop (canvas + physics)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    function resize() {
      const parent = canvas.parentElement;
      const w = parent ? Math.min(900, Math.max(320, parent.clientWidth - 8)) : 800;
      const h = Math.round(Math.max(240, Math.min(600, w * 0.6)));
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    // reset sim
    function resetSim() {
      xRef.current = x0;
      vRef.current = 0;
      simTRef.current = 0;
      dataRef.current = [];
      crossingsRef.current = [];
      setMeasuredT(null);
      setStatus(running ? "Running..." : "Paused");
    }
    resetSim();

    const dt = 1 / 120;
    let acc = 0;
    let last = performance.now();

    function step(now) {
      const elapsed = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (running) {
        acc += elapsed;
        while (acc >= dt) {
          // x'' = -(k/m) x - (c/m) v
          const a = (-(k / m) * xRef.current) - (c / m) * vRef.current;
          vRef.current += a * dt;
          xRef.current += vRef.current * dt;
          simTRef.current += dt;

          // zero crossing detection for period
          const prev = dataRef.current.length ? dataRef.current[dataRef.current.length - 1].x : null;
          if (prev !== null && prev * xRef.current < 0) {
            crossingsRef.current.push(simTRef.current);
            if (crossingsRef.current.length > 12) crossingsRef.current.shift();
            if (crossingsRef.current.length >= 4) {
              const arr = crossingsRef.current;
              const periods = [];
              for (let i = 2; i < arr.length; i++) periods.push(arr[i] - arr[i - 2]);
              const avg = periods.reduce((a, b) => a + b, 0) / periods.length;
              setMeasuredT(avg);
            }
          }

          dataRef.current.push({ t: simTRef.current, x: xRef.current });
          if (dataRef.current.length > 3000) dataRef.current.shift();
          acc -= dt;
        }
      }
      draw(ctx, canvas);
      setSimTime(simTRef.current);
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, m, k, c, x0]);

  function draw(ctx, canvas) {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 0, w, h);

    const ox = 80, oy = 60;
    const pxPerMeter = Math.max(80, Math.min(220, (w - 260) / (Math.max(Math.abs(x0), 1) * 2)));
    const x = ox + pxPerMeter * xRef.current;

    // draw wall
    ctx.fillStyle = "#374151";
    ctx.fillRect(10, oy - 30, 20, 60);

    // spring (zigzag)
    ctx.strokeStyle = "#111827"; ctx.lineWidth = 2;
    ctx.beginPath();
    let sx = 30, sy = oy;
    ctx.moveTo(sx, sy);
    const coils = 8;
    const coilLen = x - 60;
    for (let i = 0; i < coils; i++) {
      const tx = 60 + (i / (coils - 1)) * coilLen;
      const ty = sy + (i % 2 === 0 ? -10 : 10);
      ctx.lineTo(tx, ty);
    }
    ctx.lineTo(x - 30, sy);
    ctx.stroke();

    // block (mass)
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(x - 30, oy - 30, 60, 60);

    // overlays
    ctx.fillStyle = "#0f172a"; ctx.font = "13px sans-serif";
    ctx.fillText(`x = ${xRef.current.toFixed(3)} m`, 12, 18);
    ctx.fillText(`v = ${vRef.current.toFixed(3)} m/s`, 12, 36);
    ctx.fillText(`t = ${simTRef.current.toFixed(2)} s`, 12, 54);
    ctx.fillText(`Theoretical T: ${theoreticalT.toFixed(3)} s`, w - 220, 18);
    ctx.fillText(`Measured T: ${measuredT ? measuredT.toFixed(4) + " s" : "—"}`, w - 220, 36);

    // mini plot x vs t (right)
    const plotW = Math.min(320, Math.round(w * 0.36));
    const plotH = 120;
    const px = w - plotW - 12, py = h - plotH - 12;
    ctx.fillStyle = "#fff"; ctx.fillRect(px, py, plotW, plotH);
    ctx.strokeStyle = "#e6eef8"; ctx.strokeRect(px, py, plotW, plotH);
    const pts = dataRef.current;
    const maxPoints = 240; const start = Math.max(0, pts.length - maxPoints);
    ctx.beginPath(); ctx.strokeStyle = "#2563eb"; ctx.lineWidth = 2;
    for (let i = start; i < pts.length; i++) {
      const idx = i - start;
      const xs = px + (idx / Math.max(1, maxPoints - 1)) * plotW;
      const maxX = Math.max(Math.abs(x0), 0.5) * 2;
      const ys = py + plotH / 2 - (pts[i].x / maxX) * (plotH / 2);
      if (i === start) ctx.moveTo(xs, ys); else ctx.lineTo(xs, ys);
    }
    ctx.stroke();
    ctx.fillStyle = "#0f172a"; ctx.font = "11px sans-serif";
    ctx.fillText("Displacement (m) vs time", px + 6, py + plotH - 8);
  }

  // stopwatch controls
  function swStartStop() {
    if (swRunning) { setSwRunning(false); swRef.current.elapsed = Number(swDisplay); }
    else setSwRunning(true);
  }
  function swLap() { if (!swRunning) return; setLaps(s => [...s, Number(swDisplay)]); }
  function _swReset() { setSwRunning(false); swRef.current = { start: null, elapsed: 0 }; setSwDisplay("0.000"); setLaps([]); }

  function recordManualEntry() {
    // takes last lap or swDisplay as manual measured period
    const t = Number(swDisplay);
    if (!t || t <= 0) return;
    setManualEntries(m => [...m, { time: t, note: "manual" }]);
  }

  // sweep routine: simulate to get measured T for each parameter
  async function runSweep() {
    setSweepRunning(true);
    const results = [];
    const steps = Math.max(2, Math.floor(sweepSteps));
    for (let i = 0; i < steps; i++) {
      const param = sweepStart + (i / (steps - 1)) * (sweepEnd - sweepStart);
      let L, measured;
      if (sweepMode === "mass") {
        L = param; // mass
        measured = await simulateHookePeriod(L, k, c, x0, 6);
        results.push({ m: L, T: measured });
        setSweepResults(r => [...r, { m: L, T: measured }]);
      } else {
        L = param; // k
        measured = await simulateHookePeriod(m, L, c, x0, 6);
        results.push({ k: L, T: measured });
        setSweepResults(r => [...r, { k: L, T: measured }]);
      }
      await new Promise(res => setTimeout(res, 80));
    }
    setSweepResults(results);
    setSweepRunning(false);
  }

  // fast simulation (no render) to detect period via zero crossings
  function simulateHookePeriod(mSim, kSim, cSim, x0Sim, neededCrossings = 6) {
    return new Promise((resolve) => {
      const dt = 1 / 200;
      let x = x0Sim, v = 0, t = 0;
      let crosses = [];
      let prev = x;
      const maxT = 60;
      while (t < maxT && crosses.length < neededCrossings) {
        const a = (-(kSim / mSim) * x) - (cSim / mSim) * v;
        v += a * dt;
        x += v * dt;
        t += dt;
        if (prev * x < 0) crosses.push(t);
        prev = x;
      }
      let measured = null;
      if (crosses.length >= 4) {
        const arr = crosses;
        const per = [];
        for (let i = 2; i < arr.length; i++) per.push(arr[i] - arr[i - 2]);
        measured = per.reduce((a, b) => a + b, 0) / per.length;
      } else measured = 2 * Math.PI * Math.sqrt(mSim / kSim);
      resolve(measured);
    });
  }

  // save/load
  function saveRun(name = `hooke_${Date.now()}`) {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const snapshot = { name, date: new Date().toISOString(), params: { m, k, c, x0 }, measuredT, data: dataRef.current.slice(-2000), sweepResults, manualEntries };
    stored.push(snapshot);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    alert("Saved: " + name);
  }
  function listRuns() { const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); return s; }
  function clearRuns() { localStorage.removeItem(STORAGE_KEY); alert("Cleared saved runs"); }

  function exportCSV() {
    const rows = [["time_s", "x_m"], ...dataRef.current.map(r => [r.t.toFixed(4), r.x.toFixed(6)])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `hooke_${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
  }
  function exportJSON() {
    const obj = { params: { m, k, c, x0 }, measuredT, data: dataRef.current.slice(-2000), sweepResults, manualEntries };
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `hooke_${Date.now()}.json`; a.click(); URL.revokeObjectURL(url);
  }
  function exportReport() {
    const html = `<html><head><title>Hooke Report</title></head><body><h1>Hooke Lab</h1><p>Date: ${new Date().toLocaleString()}</p><p>m=${m} kg, k=${k} N/m, c=${c}</p><p>Theoretical T=${theoreticalT.toFixed(4)} s</p><p>Measured T=${measuredT ? measuredT.toFixed(4) : "—"}</p><pre>${(sweepResults||[]).map(r => JSON.stringify(r)).join("\n")}</pre><button onclick="window.print()">Print</button></body></html>`;
    const w = window.open("", "_blank"); if (!w) return alert("Popup blocked"); w.document.write(html); w.document.close();
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between"><h2 className="text-2xl font-semibold">Hooke's Law — Virtual Lab</h2><div className="text-sm text-gray-600">Mass–spring experiment</div></header>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-white p-4 rounded shadow space-y-3">
          <label className="block text-sm">Mass (kg)</label>
          <input type="range" min="0.1" max="5" step="0.01" value={m} onChange={(e)=>{ setM(Number(e.target.value)); }} />
          <input type="number" value={m} onChange={(e)=>setM(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1" />

          <label className="block text-sm mt-2">Spring constant k (N/m)</label>
          <input type="range" min="1" max="200" step="0.1" value={k} onChange={(e)=>setK(Number(e.target.value))} />
          <input type="number" value={k} onChange={(e)=>setK(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1" />

          <label className="block text-sm mt-2">Damping c</label>
          <input type="range" min="0" max="5" step="0.01" value={c} onChange={(e)=>setC(Number(e.target.value))} />
          <input type="number" value={c} onChange={(e)=>setC(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1" />

          <label className="block text-sm mt-2">Initial displacement x₀ (m)</label>
          <input type="range" min="-2" max="2" step="0.01" value={x0} onChange={(e)=>{ setX0(Number(e.target.value)); xRef.current = Number(e.target.value); dataRef.current = []; crossingsRef.current = []; setMeasuredT(null); }} />
          <input type="number" value={x0} onChange={(e)=>{ setX0(Number(e.target.value)); xRef.current = Number(e.target.value); }} className="mt-1 w-full border rounded px-2 py-1" />

          <div className="flex gap-2 mt-2">
            <button onClick={()=>setRunning(r=>!r)} className="flex-1 py-2 rounded bg-blue-600 text-white">{running?"Pause":"Start"}</button>
            <button onClick={()=>{ xRef.current = x0; vRef.current = 0; dataRef.current = []; crossingsRef.current = []; setMeasuredT(null); setSimTime(0); }} className="flex-1 py-2 rounded bg-gray-200">Reset</button>
          </div>

          <div className="mt-2 text-sm">
            <div>Theoretical T: <strong>{theoreticalT.toFixed(4)} s</strong></div>
            <div>Measured T: <strong>{measuredT ? measuredT.toFixed(4) + " s" : "—"}</strong></div>
            <div className="text-xs text-gray-500">Uncertainty ±{_uncertainty}s</div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-3 rounded shadow">
          <div className="flex items-center justify-between mb-2">
            <div><strong>Mass-Spring Canvas</strong><div className="text-xs text-gray-500">Visualize motion and record data</div></div>
            <div className="flex gap-2">
              <button onClick={exportCSV} className="px-3 py-1 bg-green-600 text-white rounded">Export CSV</button>
              <button onClick={exportJSON} className="px-3 py-1 bg-yellow-400 rounded">Export JSON</button>
              <button onClick={exportReport} className="px-3 py-1 bg-indigo-600 text-white rounded">Printable</button>
            </div>
          </div>
          <div className="w-full min-h-[260px] md:min-h-80">
            <canvas ref={canvasRef} className="w-full rounded-md" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm font-medium">Stopwatch</div>
              <div className="text-2xl font-mono my-2">{swDisplay}s</div>
              <div className="flex gap-2"><button onClick={swStartStop} className="flex-1 py-1 rounded bg-blue-600 text-white">{swRunning?"Stop":"Start"}</button><button onClick={swLap} className="py-1 px-3 rounded bg-gray-200">Lap</button></div>
              <div className="mt-2 text-xs">Laps: {laps.length}</div>
              <div className="mt-2"><button onClick={recordManualEntry} className="w-full py-1 rounded bg-emerald-500 text-white">Record Manual Period</button></div>
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm font-medium">Manual Entries</div>
              <ul className="mt-2 max-h-36 overflow-auto text-sm">{manualEntries.length===0? <div className="text-xs text-gray-500">No entries</div> : manualEntries.map((e,i)=>(<li key={i} className="py-1 border-b">{e.time.toFixed(3)} s — {e.note}</li>))}</ul>
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm font-medium">Saved Runs</div>
              <div className="mt-2"><button onClick={()=>saveRun()} className="w-full py-1 rounded bg-orange-500 text-white mb-2">Save Run</button><button onClick={()=>{ const s=listRuns(); if(s.length===0) alert("No saved"); else alert(s.map(r=>r.name+" "+r.date).join("\n")); }} className="w-full py-1 rounded bg-gray-200 mb-2">List</button><button onClick={()=>clearRuns()} className="w-full py-1 rounded bg-red-500 text-white">Clear</button></div>
            </div>
          </div>
        </div>
      </div>

      {/* sweep */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Sweep — Auto-measure</h3>
        <div className="grid md:grid-cols-6 gap-2 items-end">
          <div><label className="block text-xs">Mode</label><select value={sweepMode} onChange={(e)=>setSweepMode(e.target.value)} className="w-full border rounded px-2 py-1"><option value="mass">Mass</option><option value="k">Spring constant</option></select></div>
          <div><label className="block text-xs">Start</label><input type="number" value={sweepStart} onChange={(e)=>setSweepStart(Number(e.target.value))} className="w-full border rounded px-2 py-1" /></div>
          <div><label className="block text-xs">End</label><input type="number" value={sweepEnd} onChange={(e)=>setSweepEnd(Number(e.target.value))} className="w-full border rounded px-2 py-1" /></div>
          <div><label className="block text-xs">Steps</label><input type="number" min="2" value={sweepSteps} onChange={(e)=>setSweepSteps(Number(e.target.value))} className="w-full border rounded px-2 py-1" /></div>
          <div><button onClick={()=>{ setSweepResults([]); runSweep(); }} className="w-full py-2 rounded bg-indigo-600 text-white">{sweepRunning ? "Running..." : "Run Sweep"}</button></div>
          <div><button onClick={()=>setSweepResults([])} className="w-full py-2 rounded bg-gray-200">Clear</button></div>
        </div>

        <div className="mt-3 grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm">Sweep Results</div>
            <div className="mt-2 max-h-40 overflow-auto text-sm">
              {sweepResults.length === 0 ? (
                <div className="text-xs text-gray-500">No results</div>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b border-gray-200 p-2">Param</th>
                      <th className="border-b border-gray-200 p-2">T (s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sweepResults.map((r, i) => (
                      <tr key={i}>
                        <td className="p-2">{r.m ? `m=${r.m.toFixed(3)}` : `k=${r.k.toFixed(3)}`}</td>
                        <td className="p-2">{r.T.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div><div className="text-sm">Fit (T vs sqrt(m/k) or variant)</div><div className="mt-2 text-xs text-gray-500">Use results to estimate relation</div></div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Lab Instructions</h3>
        <ol className="list-decimal list-inside text-sm mt-2">
          <li>Set mass and spring constant, drag initial displacement or use slider.</li>
          <li>Start simulation and use stopwatch to manually time oscillations (or use auto-measure).</li>
          <li>Run sweep to collect T for different masses or spring constants.</li>
          <li>Export CSV/JSON or printable report for submission.</li>
        </ol>
      </div>
    </div>
  );
}
