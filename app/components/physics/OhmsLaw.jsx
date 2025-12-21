"use client";
// src/components/OhmsLawLab.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * Ohm's Law — Virtual Lab
 *
 * Features:
 * - Interactive controls: Voltage source (V), Load resistance (R), Internal resistance (r_int)
 * - Last-edited logic to keep V = I * R consistent
 * - Virtual ammeter & voltmeter with simulated measurement noise / uncertainty
 * - Sweep mode (vary V or R) to produce V-I data and fit R
 * - Manual measurement entry, save/load runs, export CSV/JSON, printable report
 * - No external libs required
 */

function fitLine(xs, ys) {
  const n = xs.length;
  if (n === 0) return null;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0,
    den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - meanX) * (ys[i] - meanY);
    den += (xs[i] - meanX) * (xs[i] - meanX);
  }
  const m = den === 0 ? 0 : num / den;
  const b = meanY - m * meanX;
  return { m, b };
}

export default function OhmsLaw({
  initialV = 5,
  initialR = 5,
  initialRint = 0.5,
}) {
  // core states
  const [voltage, setVoltage] = useState(Number(initialV)); // source EMF (V)
  const [resistance, setResistance] = useState(Number(initialR)); // load R (Ω)
  const [rInternal, setRInternal] = useState(Number(initialRint)); // internal resistance (Ω)
  const [current, setCurrent] = useState(() => voltage / (resistance + rInternal)); // actual I through circuit
  const [lastEdited, setLastEdited] = useState("voltage"); // 'voltage' | 'current' | 'resistance'
  const [warning, setWarning] = useState("");

  // instruments & measurement
  const [showAmmeter, setShowAmmeter] = useState(true);
  const [showVoltmeter, setShowVoltmeter] = useState(true);
  const [instrumentNoise, setInstrumentNoise] = useState(0.005); // fraction noise
  const [uncertainty, setUncertainty] = useState(0.01); // absolute seconds? here absolute in A or V measurements displayed

  // manual entries and runs
  const [manualEntries, setManualEntries] = useState([]); // {v_read, i_read, note}
  const dataRef = useRef([]); // sweep / data points [{V, I}]
  const [sweepResults, setSweepResults] = useState([]);
  const [sweepMode, setSweepMode] = useState("voltage"); // 'voltage' or 'resistance'
  const [sweepStart, setSweepStart] = useState(1);
  const [sweepEnd, setSweepEnd] = useState(12);
  const [sweepSteps, setSweepSteps] = useState(8);
  const [sweepRunning, setSweepRunning] = useState(false);

  // local storage key
  const STORAGE_KEY = "openlabs_ohms_runs_v1";

  // canvas refs
  const plotRef = useRef(null);

  // compute physical current through load: I = EMF / (R + r_int)
  useEffect(() => {
    // recalc when base params change, but obey lastEdited logic
    setWarning("");
    if (resistance + rInternal <= 0) {
      setWarning("Total resistance must be > 0");
      setCurrent(0);
      return;
    }

    if (lastEdited === "voltage") {
      setCurrent(voltage / (resistance + rInternal));
    } else if (lastEdited === "current") {
      // when user edits current: adjust voltage (EMF = I*(R + r_internal))
      setVoltage(current * (resistance + rInternal));
    } else if (lastEdited === "resistance") {
      // resistance changed, keep voltage constant and compute current
      setCurrent(voltage / (resistance + rInternal));
    }
    
  }, [voltage, current, resistance, rInternal, lastEdited]);

  // instrument simulated reading: add small noise and rounding to simulate meter precision
  function instrumentRead(value, type = "V") {
    // noise proportional to instrumentNoise fraction of value, plus small absolute uncertainty
    const noiseAmp = Math.abs(value) * instrumentNoise;
    const noise = (Math.random() * 2 - 1) * noiseAmp;
    const noisy = value + noise;
    // simulate rounding: voltmeter 2 decimals, ammeter 3 decimals
    const rounded = type === "V" ? Number(noisy.toFixed(2)) : Number(noisy.toFixed(3));
    return rounded;
  }

  // draw V-I plot (canvas)
  useEffect(() => {
    const canvas = plotRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    // padding
    const pad = 36;
    // use dataRef or generate sweet line based on resistance (I = V/(R + r_int))
    const pts = sweepResults.length ? sweepResults : dataRef.current.length ? dataRef.current : null;

    // compute ranges: V axis 0 .. maxV, I axis 0..maxI
    const maxV = Math.max(voltage, sweepResults.reduce((a, b) => Math.max(a, b.V || 0), voltage), 10) * 1.2;
    const maxI = Math.max(current, sweepResults.reduce((a, b) => Math.max(a, b.I || 0), current), 1) * 1.2;

    // axes
    ctx.strokeStyle = "#e6eef8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, pad);
    ctx.lineTo(pad, H - pad);
    ctx.lineTo(W - pad, H - pad);
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.font = "12px sans-serif";
    ctx.fillText("Voltage → (V)", W - pad - 70, H - pad + 18);
    ctx.fillText("↑ Current (A)", 6, pad + 6);

    // draw theoretical line for current vs voltage (I = V / (R + r_int))
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2;
    ctx.beginPath();
    const segments = 80;
    for (let s = 0; s <= segments; s++) {
      const t = s / segments;
      const Vx = t * maxV;
      const Iy = Vx / (resistance + rInternal);
      const x = pad + (Vx / maxV) * (W - pad * 2);
      const y = H - pad - (Iy / maxI) * (H - pad * 2);
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // draw sweep points if available
    if (pts && pts.length) {
      ctx.fillStyle = "#0f172a";
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const Vx = p.V;
        const Iy = p.I;
        const x = pad + (Vx / maxV) * (W - pad * 2);
        const y = H - pad - (Iy / maxI) * (H - pad * 2);
        ctx.fillStyle = "#10b981"; // green points
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // draw operating point
    const dotX = pad + (voltage / maxV) * (W - pad * 2);
    const dotY = H - pad - (current / maxI) * (H - pad * 2);
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0f172a";
    ctx.fillText(`(${voltage.toFixed(2)} V, ${current.toFixed(3)} A)`, dotX + 8, dotY - 8);

    // annotate fitted line if sweepResults exist
    if (sweepResults.length >= 3) {
      const xs = sweepResults.map((r) => r.V);
      const ys = sweepResults.map((r) => r.I);
      const fit = fitLine(xs, ys);
      if (fit) {
        // slope = dI/dV = 1 / R_total  -> R_est = 1 / slope
        const slope = fit.m;
        const intercept = fit.b;
        const R_est = slope !== 0 ? 1 / slope - 0 : Infinity;
        ctx.fillStyle = "#374151";
        ctx.fillText(`Fit: I = ${slope.toFixed(4)} V + ${intercept.toFixed(4)}`, pad + 8, pad + 12);
        ctx.fillText(`Estimated R_total ≈ ${(R_est === Infinity ? "∞" : R_est.toFixed(3))} Ω`, pad + 8, pad + 28);
      }
    }
  }, [voltage, current, resistance, rInternal, sweepResults]);

  // helper: perform a sweep (non-blocking, UI-updating)
  async function runSweep() {
    setSweepRunning(true);
    const results = [];
    const steps = Math.max(2, Math.floor(sweepSteps));
    if (sweepMode === "voltage") {
      const start = sweepStart;
      const end = sweepEnd;
      for (let i = 0; i < steps; i++) {
        const Vx = start + (i / (steps - 1)) * (end - start);
        const Icalc = Vx / (resistance + rInternal);
        // simulate instrument reading (noise)
        const Vread = instrumentRead(Vx, "V");
        const Iread = instrumentRead(Icalc, "I");
        results.push({ V: Vread, I: Iread });
        setSweepResults((s) => [...s, { V: Vread, I: Iread }]);
        await new Promise((r) => setTimeout(r, 120));
      }
    } else {
      // sweep resistance, keep voltage constant
      const start = Math.max(0.01, sweepStart);
      const end = Math.max(start + 0.01, sweepEnd);
      for (let i = 0; i < steps; i++) {
        const Rx = start + (i / (steps - 1)) * (end - start);
        const It = voltage / (Rx + rInternal);
        const Vload = It * Rx;
        const Vread = instrumentRead(Vload, "V");
        const Iread = instrumentRead(It, "I");
        results.push({ V: Vread, I: Iread, R: Rx });
        setSweepResults((s) => [...s, { V: Vread, I: Iread, R: Rx }]);
        await new Promise((r) => setTimeout(r, 120));
      }
    }
    setSweepResults(results);
    setSweepRunning(false);
  }

  // save / load runs
  function saveRun(name = `run_${Date.now()}`) {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const snapshot = {
      name,
      date: new Date().toISOString(),
      params: { voltage, resistance, rInternal, instrumentNoise, uncertainty },
      measured: { current, sweepResults },
    };
    stored.push(snapshot);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    alert("Saved run: " + name);
  }

  function loadRuns() {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return stored;
  }

  function clearSavedRuns() {
    localStorage.removeItem(STORAGE_KEY);
    alert("Cleared saved runs");
  }

  // export CSV / JSON / report
  function exportCSV() {
    const rows = [["V_source_V", "I_A", "R_load_Ohm", "R_internal"]];
    const line = [voltage.toString(), current.toString(), resistance.toString(), rInternal.toString()];
    rows.push(line);
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ohmslab_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function exportJSON() {
    const obj = { params: { voltage, resistance, rInternal }, current, sweepResults, manualEntries, date: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ohmslab_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function exportReport() {
    const html = `
      <html><head><title>OpenLabs - Ohm's Law Report</title>
      <style>body{font-family:Arial;padding:20px}table{border-collapse:collapse}td,th{border:1px solid #ddd;padding:6px}</style>
      </head><body>
      <h1>OpenLabs - Ohm's Law Report</h1>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <h2>Parameters</h2>
      <ul>
        <li>V_source: ${voltage} V</li>
        <li>Load R: ${resistance} Ω</li>
        <li>Internal r: ${rInternal} Ω</li>
        <li>Instrument noise (frac): ${instrumentNoise}</li>
        <li>Uncertainty: ±${uncertainty}</li>
      </ul>
      <h2>Measured</h2>
      <p>Current: ${current.toFixed(4)} A</p>
      <h3>Sweep Results</h3>
      <pre>${sweepResults.map(r=>`V=${r.V} V, I=${r.I} A${r.R ? `, R=${r.R} Ω` : ""}`).join("\n")}</pre>
      <hr/><p>Generated by OpenLabs</p>
      <button onclick="window.print()">Print / Save as PDF</button>
      </body></html>`;
    const w = window.open("", "_blank");
    if (!w) { alert("Popup blocked"); return; }
    w.document.write(html);
    w.document.close();
  }

  // manual measurement add
  function addManualEntry() {
    const vread = showVoltmeter ? instrumentRead(voltage - current * rInternal, "V") : null; // reading across load
    const iread = showAmmeter ? instrumentRead(current, "I") : null;
    setManualEntries((m) => [...m, { V: vread, I: iread, note: "" }]);
  }

  // UI handlers with last-edited semantics
  function handleVoltageChange(e) {
    const v = Number(e.target.value);
    if (Number.isNaN(v)) return;
    setVoltage(v);
    setLastEdited("voltage");
  }
  function handleCurrentChange(e) {
    const i = Number(e.target.value);
    if (Number.isNaN(i)) return;
    setCurrent(i);
    setLastEdited("current");
  }
  function handleResistanceChange(e) {
    const r = Number(e.target.value);
    if (Number.isNaN(r)) return;
    setResistance(r);
    setLastEdited("resistance");
  }
  function handleRInternalChange(e) {
    const r = Number(e.target.value);
    if (Number.isNaN(r)) return;
    setRInternal(r);
  }

  // (instrumentRead already defined above)

  // initial mount: ensure current consistent with voltage/resistance
  useEffect(() => {
    if (resistance + rInternal <= 0) {
      setWarning("Total resistance must be > 0");
      setCurrent(0);
    } else {
      setCurrent(voltage / (resistance + rInternal));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // small convenience: clear sweep results
  function clearSweep() {
    setSweepResults([]);
    dataRef.current = [];
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Ohm’s Law — Virtual Lab</h2>
        <div className="text-sm text-gray-600">Explore V = I × R — measure with virtual instruments, sweep, and export reports.</div>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Controls */}
        <div className="md:col-span-1 bg-white p-4 rounded shadow space-y-3">
          <h3 className="font-semibold">Circuit Controls</h3>

          <label className="block text-sm">Source EMF (V)</label>
          <input type="range" min={0} max={24} step={0.1} value={voltage} onChange={handleVoltageChange} />
          <input type="number" value={voltage} onChange={handleVoltageChange} className="mt-1 w-full border rounded px-2 py-1" />

          <label className="block text-sm mt-2">Load resistance R (Ω)</label>
          <input type="range" min={0.1} max={1000} step={0.1} value={resistance} onChange={handleResistanceChange} />
          <input type="number" value={resistance} onChange={handleResistanceChange} className="mt-1 w-full border rounded px-2 py-1" />

          <label className="block text-sm mt-2">Internal resistance r_int (Ω)</label>
          <input type="range" min={0} max={10} step={0.01} value={rInternal} onChange={handleRInternalChange} />
          <input type="number" value={rInternal} onChange={handleRInternalChange} className="mt-1 w-full border rounded px-2 py-1" />

          <label className="block text-sm mt-2">Manual current override (A)</label>
          <input type="number" value={current} onChange={handleCurrentChange} className="mt-1 w-full border rounded px-2 py-1" />

          <div className="flex gap-2 mt-2">
            <button onClick={() => { setVoltage(initialV); setResistance(initialR); setRInternal(initialRint); setLastEdited("voltage"); setWarning(""); }} className="flex-1 py-2 rounded bg-gray-200">Reset Params</button>
            <button onClick={addManualEntry} className="flex-1 py-2 rounded bg-green-600 text-white">Record Meter Readings</button>
          </div>

          <div className="text-sm mt-2 text-gray-600">
            <div>Last edited: <strong>{lastEdited}</strong></div>
            {warning && <div className="text-red-600 mt-1">{warning}</div>}
            <div className="mt-2">Computed current: <strong>{current.toFixed(4)} A</strong></div>
            <div>Voltage across load: <strong>{(current * resistance).toFixed(3)} V</strong></div>
            <div className="mt-1 text-xs">Note: total R = R + r_int</div>
          </div>
        </div>

        {/* Visualization & instruments */}
        <div className="md:col-span-2 bg-white p-4 rounded shadow space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* simple SVG circuit */}
              <svg width="420" height="120" viewBox="0 0 420 120" className="rounded">
                {/* battery */}
                <g transform="translate(10,20)">
                  <rect x="0" y="10" width="28" height="80" fill="#fde047" stroke="#b45309" rx="6" />
                  <text x="14" y="55" fontSize="11" textAnchor="middle" fill="#1f2937">EMF {voltage.toFixed(2)}V</text>
                </g>
                {/* wire */}
                <line x1="48" y1="60" x2="180" y2="60" stroke="#374151" strokeWidth="4" />
                {/* resistor */}
                <g transform="translate(180,36)">
                  <rect x="0" y="0" width="120" height="48" rx="6" fill="#ef4444" />
                  <text x="60" y="28" fontSize="12" textAnchor="middle" fill="#fff">R: {resistance.toFixed(2)} Ω</text>
                </g>
                <line x1="300" y1="60" x2="380" y2="60" stroke="#374151" strokeWidth="4" />
                {/* ground */}
                <text x="320" y="100" fontSize="11" fill="#0f172a">r_int {rInternal.toFixed(2)}Ω</text>
              </svg>

              <div>
                <div className="text-sm font-medium">Instruments</div>
                <div className="mt-2 flex gap-2">
                  <label className="inline-flex items-center"><input type="checkbox" checked={showAmmeter} onChange={(e)=>setShowAmmeter(e.target.checked)} className="mr-2"/>Ammeter</label>
                  <label className="inline-flex items-center"><input type="checkbox" checked={showVoltmeter} onChange={(e)=>setShowVoltmeter(e.target.checked)} className="mr-2"/>Voltmeter</label>
                </div>

                <div className="mt-3">
                  {showAmmeter && <div className="p-2 bg-gray-50 rounded border w-40">
                    <div className="text-xs text-gray-500">Ammeter (A)</div>
                    <div className="text-xl font-mono">{instrumentRead(current, "I")} A ±{uncertainty}</div>
                  </div>}
                  {showVoltmeter && <div className="p-2 bg-gray-50 rounded border w-40 mt-2">
                    <div className="text-xs text-gray-500">Voltmeter across load (V)</div>
                    <div className="text-xl font-mono">{instrumentRead(current * resistance, "V")} V ±{uncertainty}</div>
                  </div>}
                </div>
              </div>
            </div>

            <div className="text-sm">
              <div className="mb-2">Instrument noise (frac)</div>
              <input type="range" min="0" max="0.05" step="0.001" value={instrumentNoise} onChange={(e)=>setInstrumentNoise(Number(e.target.value))} />
              <input type="number" step="0.001" value={instrumentNoise} onChange={(e)=>setInstrumentNoise(Number(e.target.value))} className="mt-1 w-28 border rounded px-2 py-1" />
              <div className="mt-2 text-xs">Measurement uncertainty ±{uncertainty}</div>
              <input type="number" step="0.001" value={uncertainty} onChange={(e)=>setUncertainty(Number(e.target.value))} className="mt-1 w-28 border rounded px-2 py-1" />
            </div>
          </div>

          {/* plot */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">V–I Plot</div>
              <div className="text-xs text-gray-500">Red dot = operating point</div>
            </div>
            <canvas ref={plotRef} width={760} height={260} className="w-full border rounded" />
          </div>
        </div>
      </div>

      {/* Sweep controls */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        <h3 className="font-semibold">Sweep & Measurement</h3>
        <div className="grid md:grid-cols-6 gap-2 items-end">
          <div>
            <label className="block text-xs">Sweep mode</label>
            <select value={sweepMode} onChange={(e)=>setSweepMode(e.target.value)} className="w-full border rounded px-2 py-1">
              <option value="voltage">V (vary source)</option>
              <option value="resistance">R (vary load)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs">Start</label>
            <input type="number" step="0.01" value={sweepStart} onChange={(e)=>setSweepStart(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-xs">End</label>
            <input type="number" step="0.01" value={sweepEnd} onChange={(e)=>setSweepEnd(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-xs">Steps</label>
            <input type="number" min="2" value={sweepSteps} onChange={(e)=>setSweepSteps(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <button onClick={()=>{ setSweepResults([]); runSweep(); }} disabled={sweepRunning} className="w-full py-2 rounded bg-indigo-600 text-white">{sweepRunning ? "Running..." : "Run Sweep"}</button>
          </div>
          <div>
            <button onClick={clearSweep} className="w-full py-2 rounded bg-gray-200">Clear</button>
          </div>
        </div>

        <div className="mt-3 grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">Sweep Results</div>
            <div className="mt-2 max-h-40 overflow-auto text-sm">
              {sweepResults.length === 0 ? (
                <div className="text-xs text-gray-500">No results</div>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b border-gray-200 p-2">V (V)</th>
                      <th className="border-b border-gray-200 p-2">I (A)</th>
                      <th className="border-b border-gray-200 p-2">R? (Ω)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sweepResults.map((r, i) => (
                      <tr key={i}>
                        <td className="p-2">{r.V || "—"}</td>
                        <td className="p-2">{r.I || "—"}</td>
                        <td className="p-2">{r.R ? r.R.toFixed(3) : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Manual Entries</div>
            <div className="mt-2 text-sm">
              <button onClick={addManualEntry} className="px-3 py-1 rounded bg-emerald-500 text-white mb-2">Add Entry (read meters)</button>
              <button onClick={()=>setManualEntries([])} className="px-3 py-1 rounded bg-gray-200 ml-2">Clear</button>
              <div className="mt-2">
                <ul className="max-h-40 overflow-auto">
                  {manualEntries.map((m,i)=>(
                    <li key={i} className="flex justify-between text-sm py-1 border-b">{`V=${m.V} V, I=${m.I} A`}<span className="text-xs text-gray-500">{m.note}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save / export / report */}
      <div className="bg-white p-4 rounded shadow flex gap-2">
        <button onClick={() => saveRun()} className="px-3 py-2 bg-orange-500 text-white rounded">Save Run</button>
        <button onClick={() => { const runs=loadRuns(); if (runs.length===0) alert("No saved runs"); else alert(runs.map(r=>r.name+" - "+r.date).join("\n")); }} className="px-3 py-2 bg-gray-200 rounded">List Saved</button>
        <button onClick={() => clearSavedRuns()} className="px-3 py-2 bg-red-500 text-white rounded">Clear Saved</button>
        <div className="flex-1" />
        <button onClick={exportCSV} className="px-3 py-2 bg-green-600 text-white rounded">Export CSV</button>
        <button onClick={exportJSON} className="px-3 py-2 bg-yellow-400 rounded">Export JSON</button>
        <button onClick={exportReport} className="px-3 py-2 bg-indigo-600 text-white rounded">Printable Report</button>
      </div>

      {/* Lab instructions */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Lab Instructions</h3>
        <ol className="list-decimal list-inside text-sm mt-2">
          <li>Set EMF and R. Inspect ammeter and voltmeter readings.</li>
          <li>Record manual entries (press <em>Record Meter Readings</em>) and note instrument readings.</li>
          <li>Run a sweep (vary V or R) to collect V-I data and fit to estimate total resistance.</li>
          <li>Export CSV/JSON or open printable report for submission.</li>
        </ol>
      </div>
    </div>
  );
}
