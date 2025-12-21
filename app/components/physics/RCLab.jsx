// src/components/RCLab.jsx
"use client";
import React, { useEffect, useRef, useState } from "react";

/**
 * RCLab.jsx
 * - Simulates charging/discharging of an RC circuit: Vc' = (Vsource - Vc) / (R C)
 * - Controls: R (Ω), C (F), Vsource (V), switch: charge/discharge
 * - Plots Vc(t) and I(t); estimates tau (time constant)
 */

function exponentialFitTau(data) {
  // data: [{t, v}] assume charging from 0 towards V0; find t where v = 0.632*V0
  if (!data || data.length === 0) return null;
  const V0 = data[data.length - 1].v;
  const target = 0.632 * V0;
  // find first index where v >= target
  for (let i = 1; i < data.length; i++) {
    if (data[i].v >= target) {
      // linear interpolate between i-1 and i
      const a = data[i - 1], b = data[i];
      const frac = (target - a.v) / (b.v - a.v || 1e-9);
      return a.t + frac * (b.t - a.t);
    }
  }
  return null;
}

export default function RCLab({
  initialR = 10000,
  initialC = 1e-6,
  initialV = 5,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const dataRef = useRef([]); // {t, v, i}
  const tRef = useRef(0);
  const vcRef = useRef(0);
  const [R, setR] = useState(Number(initialR));
  const [C, setC] = useState(Number(initialC));
  const [Vsource, setVsource] = useState(Number(initialV));
  const [mode, setMode] = useState("idle"); // 'idle'|'charge'|'discharge'
  const [running, setRunning] = useState(true);
  const [tauMeasured, setTauMeasured] = useState(null);
  const [_simTime, setSimTime] = useState(0);

  // integrate
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      const parent = canvas.parentElement;
      const w = parent ? Math.min(900, Math.max(480, parent.clientWidth - 8)) : 800;
      const h = 300;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    tRef.current = 0;
    vcRef.current = 0;
    dataRef.current = [];
    setTauMeasured(null);

    const dt = 1 / 240;
    let acc = 0;
    let last = performance.now();

    function step(now) {
      const elapsed = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (running && mode !== "idle") {
        acc += elapsed;
        while (acc >= dt) {
          if (mode === "charge") {
            // dVc/dt = (Vs - Vc) / (R*C)
            const dvc = (Vsource - vcRef.current) / (R * C);
            vcRef.current += dvc * dt;
            const i = (Vsource - vcRef.current) / R;
            tRef.current += dt;
            dataRef.current.push({ t: tRef.current, v: vcRef.current, i });
            if (dataRef.current.length > 4000) dataRef.current.shift();
          } else if (mode === "discharge") {
            // discharge into R: dVc/dt = -Vc / (R*C)
            const dvc = -vcRef.current / (R * C);
            vcRef.current += dvc * dt;
            const i = vcRef.current / R;
            tRef.current += dt;
            dataRef.current.push({ t: tRef.current, v: vcRef.current, i });
            if (dataRef.current.length > 4000) dataRef.current.shift();
          }
          acc -= dt;
        }
      } else {
        // idle: keep pushing slow sampling for plotting
        if (dataRef.current.length === 0 || (performance.now() - last > 200)) {
          dataRef.current.push({ t: tRef.current, v: vcRef.current, i: vcRef.current / Math.max(R, 1e-9) });
        }
      }
      draw(ctx, canvas);
      setSimTime(tRef.current);
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, mode, R, C, Vsource]);

  // update tau measurement whenever data updates
  useEffect(() => {
    const id = setInterval(() => {
      const t = exponentialFitTau(dataRef.current.filter(d=>d.v >= 0));
      setTauMeasured(t);
    }, 300);
    return () => clearInterval(id);
  }, []);

  function draw(ctx, canvas) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 0, w, h);
    // plot Vc(t) on left, I(t) on bottom small
    const pad = 36;
    const plotW = w - pad * 2;
    const plotH = h - pad * 2;
    ctx.strokeStyle = "#e6eef8"; ctx.strokeRect(pad, pad, plotW, plotH);

    // get ranges
    const pts = dataRef.current;
    const maxT = Math.max(1, pts.length ? pts[pts.length - 1].t : 1);
    const maxV = Math.max(Vsource, 1);
    const maxI = Math.max(...(pts.map(p=>Math.abs(p.i)||0)), Vsource / Math.max(R,1e-9), 1);

    // draw Vc(t)
    ctx.beginPath(); ctx.strokeStyle = "#2563eb"; ctx.lineWidth = 2;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const x = pad + (p.t / (maxT || 1)) * plotW;
      const y = pad + plotH - (p.v / maxV) * plotH;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = "#0f172a"; ctx.font = "12px sans-serif";
    ctx.fillText(`Vc (V) — blue`, pad + 6, pad + 14);

    // draw I(t) as thinner orange line scaled to right vertical area
    ctx.beginPath(); ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 1.5;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const x = pad + (p.t / (maxT || 1)) * plotW;
      const y = pad + plotH - (Math.abs(p.i) / maxI) * plotH;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = "#92400e"; ctx.fillText(`I (A) — orange (abs)`, pad + 6, pad + 30);

    // draw operating text
    ctx.fillStyle = "#0f172a"; ctx.fillText(`Mode: ${mode}`, w - 160, 20);
    ctx.fillText(`R=${R.toLocaleString()} Ω  C=${C} F  V=${Vsource} V`, w - 260, 38);
    ctx.fillText(`τ measured ≈ ${tauMeasured ? tauMeasured.toFixed(4) + " s" : "—"}`, w - 260, 56);

    // draw last point indicator
    if (pts.length) {
      const last = pts[pts.length - 1];
      const x = pad + (last.t / (maxT || 1)) * plotW;
      const y = pad + plotH - (last.v / maxV) * plotH;
      ctx.fillStyle = "#dc2626"; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#0f172a"; ctx.fillText(`Vc=${last.v.toFixed(3)} V`, x + 8, y - 8);
    }
  }

  function startCharge() {
    // begin fresh charge: set vc to 0 and reset time
    vcRef.current = 0;
    tRef.current = 0;
    dataRef.current = [];
    setMode("charge");
    setTimeout(()=>setRunning(true), 10);
  }
  function startDischarge() {
    // assume capacitor charged to Vsource before discharge
    vcRef.current = Vsource;
    tRef.current = 0;
    dataRef.current = [];
    setMode("discharge");
    setTimeout(()=>setRunning(true), 10);
  }
  function stop() {
    setMode("idle");
  }
  function reset() {
    vcRef.current = 0;
    tRef.current = 0;
    dataRef.current = [];
    setTauMeasured(null);
    setMode("idle");
    setRunning(false);
  }

  // export CSV
  function exportCSV() {
    const rows = [["t_s","Vc_V","I_A"], ...dataRef.current.map(p => [p.t.toFixed(6), p.v.toFixed(6), p.i.toFixed(6)])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `RC_${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4 bg-white rounded shadow">
      <h3 className="text-xl font-semibold">RC Circuit — Charge & Discharge Lab</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-3">
          <label className="block text-sm">Resistance R (Ω)</label>
          <input type="range" min={10} max={1e6} step={10} value={R} onChange={(e) => setR(Number(e.target.value))} />
          <input type="number" value={R} onChange={(e)=>setR(Number(e.target.value))} className="w-full mt-1 border rounded px-2 py-1" />

          <label className="block text-sm">Capacitance C (F)</label>
          <input type="range" min={1e-9} max={1e-3} step={1e-9} value={C} onChange={(e)=>setC(Number(e.target.value))} />
          <input type="number" value={C} onChange={(e)=>setC(Number(e.target.value))} className="w-full mt-1 border rounded px-2 py-1" />

          <label className="block text-sm">Source V (V)</label>
          <input type="range" min={0} max={20} step={0.1} value={Vsource} onChange={(e)=>setVsource(Number(e.target.value))} />
          <input type="number" value={Vsource} onChange={(e)=>setVsource(Number(e.target.value))} className="w-full mt-1 border rounded px-2 py-1" />

          <div className="flex gap-2">
            <button onClick={startCharge} className="flex-1 py-2 rounded bg-blue-600 text-white">Charge</button>
            <button onClick={startDischarge} className="flex-1 py-2 rounded bg-orange-500 text-white">Discharge</button>
          </div>
          <div className="flex gap-2">
            <button onClick={stop} className="flex-1 py-2 rounded bg-gray-200">Stop</button>
            <button onClick={reset} className="flex-1 py-2 rounded bg-gray-200">Reset</button>
          </div>

          <div className="text-sm text-gray-700">
            <div>Measured τ ≈ <strong>{tauMeasured ? tauMeasured.toFixed(4) + " s" : "—"}</strong></div>
            <div className="text-xs text-gray-500">Theoretical τ = R × C = {(R * C).toExponential(3)} s</div>
          </div>

          <div className="mt-2 flex gap-2">
            <button onClick={exportCSV} className="flex-1 py-2 rounded bg-green-600 text-white">Export CSV</button>
          </div>
        </div>

        <div className="md:col-span-2">
          <canvas ref={canvasRef} className="w-full border rounded" style={{height:300}} />
        </div>
      </div>
    </div>
  );
}
