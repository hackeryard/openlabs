"use client"
// src/components/EnergyConservationLab.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * EnergyConservationLab.jsx
 * - Simulates a block sliding down an incline with optional friction
 * - Shows PE, KE, and Lost energy; plots energy vs time; measures speed
 */

export default function EnergyConservation({
  initialMass = 0.5,
  initialAngleDeg = 30,
  initialHeight = 1.0,
  initialMu = 0.05,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const [m, setM] = useState(Number(initialMass));
  const [angleDeg, setAngleDeg] = useState(Number(initialAngleDeg));
  const [h0, setH0] = useState(Number(initialHeight));
  const [mu, setMu] = useState(Number(initialMu));
  const [g] = useState(9.81);
  const [running, setRunning] = useState(true);

  const sRef = useRef(0); // distance along ramp
  const vRef = useRef(0);
  const tRef = useRef(0);
  const dataRef = useRef([]); // {t, PE, KE, lost}
  const [simTime, setSimTime] = useState(0);
  const [speedBottom, setSpeedBottom] = useState(null);

  useEffect(() => {
    // setup canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    function resize() {
      const parent = canvas.parentElement;
      const w = parent ? Math.min(1000, Math.max(520, parent.clientWidth - 8)) : 800;
      const h = 320;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    // reset
    sRef.current = 0;
    vRef.current = 0;
    tRef.current = 0;
    dataRef.current = [];
    setSpeedBottom(null);

    const dt = 1 / 240;
    let acc = 0;
    let last = performance.now();

    function step(now) {
      const elapsed = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (running) {
        acc += elapsed;
        while (acc >= dt) {
          // incline physics: along slope acceleration = g*sin(theta) - µ g cos(theta)
          const theta = angleDeg * Math.PI / 180;
          const a = g * Math.sin(theta) - mu * g * Math.cos(theta);
          vRef.current += a * dt;
          sRef.current += vRef.current * dt;
          tRef.current += dt;
          // compute energies
          const y = Math.max(0, h0 - sRef.current * Math.sin(theta)); // vertical height
          const PE = m * g * Math.max(y, 0);
          const KE = 0.5 * m * vRef.current * vRef.current;
          const totalInitial = m * g * h0;
          const lost = Math.max(0, totalInitial - (PE + KE));
          dataRef.current.push({ t: tRef.current, PE, KE, lost });
          if (dataRef.current.length > 4000) dataRef.current.shift();

          // stop at bottom: when y <= 0
          if (y <= 0) {
            setSpeedBottom(vRef.current);
            setRunning(false);
            break;
          }
          acc -= dt;
        }
      }
      draw(ctx, canvas);
      setSimTime(tRef.current);
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, m, angleDeg, h0, mu]);

  function draw(ctx, canvas) {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 0, w, h);

    // draw incline
    const pad = 40;
    const len = Math.min(w - 160, 500);
    const theta = angleDeg * Math.PI / 180;
    const x0 = pad, y0 = 80;
    const x1 = x0 + len * Math.cos(theta), y1 = y0 + len * Math.sin(theta);
    ctx.strokeStyle = "#374151"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();

    // draw block position
    const s = Math.max(0, sRef.current);
    const blockX = x0 + s * Math.cos(theta);
    const blockY = y0 + s * Math.sin(theta);
    ctx.fillStyle = "#ef4444"; ctx.fillRect(blockX - 18, blockY - 12, 36, 24);

    // overlays
    ctx.fillStyle = "#0f172a"; ctx.font = "13px sans-serif";
    ctx.fillText(`m=${m} kg  θ=${angleDeg}°  h0=${h0} m  µ=${mu}`, 12, 18);
    ctx.fillText(`t=${tRef.current.toFixed(2)} s  v=${vRef.current.toFixed(3)} m/s`, 12, 36);
    ctx.fillText(`Speed at bottom: ${speedBottom ? speedBottom.toFixed(3) + " m/s" : "—"}`, 12, 54);

    // energy plot
    const plotW = Math.min(340, Math.round(w * 0.38));
    const plotH = 160;
    const px = w - plotW - 12, py = h - plotH - 12;
    ctx.fillStyle = "#fff"; ctx.fillRect(px, py, plotW, plotH); ctx.strokeStyle = "#e6eef8"; ctx.strokeRect(px, py, plotW, plotH);

    const pts = dataRef.current;
    const maxT = Math.max(1, pts.length ? pts[pts.length - 1].t : 1);
    const totalE = m * 9.81 * h0;
    // draw PE (green), KE (blue), lost (orange)
    ctx.beginPath(); ctx.strokeStyle = "#10b981"; ctx.lineWidth = 2;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const x = px + (p.t / maxT) * plotW;
      const y = py + plotH - (p.PE / totalE) * plotH;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.beginPath(); ctx.strokeStyle = "#2563eb"; ctx.lineWidth = 2;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const x = px + (p.t / maxT) * plotW;
      const y = py + plotH - (p.KE / totalE) * plotH;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.beginPath(); ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const x = px + (p.t / maxT) * plotW;
      const y = py + plotH - (p.lost / totalE) * plotH;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = "#0f172a"; ctx.font = "11px sans-serif";
    ctx.fillText("PE (green), KE (blue), Lost (orange) — normalized", px + 6, py + plotH - 8);
  }

  function reset() {
    sRef.current = 0; vRef.current = 0; tRef.current = 0; dataRef.current = []; setSpeedBottom(null); setRunning(false);
  }

  function exportCSV() {
    const rows = [["t_s","PE_J","KE_J","lost_J"], ...dataRef.current.map(p => [p.t.toFixed(4), p.PE.toFixed(6), p.KE.toFixed(6), p.lost.toFixed(6)])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `energy_${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow space-y-4">
      <h3 className="text-xl font-semibold">Energy Conservation — Block on Incline Lab</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-3">
          <label className="block text-sm">Mass (kg)</label>
          <input type="range" min={0.1} max={5} step={0.01} value={m} onChange={(e)=>setM(Number(e.target.value))} />
          <input type="number" value={m} onChange={(e)=>setM(Number(e.target.value))} className="w-full mt-1 border rounded px-2 py-1" />

          <label className="block text-sm mt-2">Incline angle (°)</label>
          <input type="range" min={1} max={60} step={0.1} value={angleDeg} onChange={(e)=>setAngleDeg(Number(e.target.value))} />
          <input type="number" value={angleDeg} onChange={(e)=>setAngleDeg(Number(e.target.value))} className="w-full mt-1 border rounded px-2 py-1" />

          <label className="block text-sm mt-2">Start height (m)</label>
          <input type="range" min={0.1} max={3} step={0.01} value={h0} onChange={(e)=>setH0(Number(e.target.value))} />
          <input type="number" value={h0} onChange={(e)=>setH0(Number(e.target.value))} className="w-full mt-1 border rounded px-2 py-1" />

          <label className="block text-sm mt-2">Friction µ</label>
          <input type="range" min={0} max={0.5} step={0.001} value={mu} onChange={(e)=>setMu(Number(e.target.value))} />
          <input type="number" value={mu} onChange={(e)=>setMu(Number(e.target.value))} className="w-full mt-1 border rounded px-2 py-1" />

          <div className="flex gap-2 mt-2">
            <button onClick={()=>setRunning(r=>!r)} className="flex-1 py-2 rounded bg-blue-600 text-white">{running ? "Pause" : "Start"}</button>
            <button onClick={reset} className="flex-1 py-2 rounded bg-gray-200">Reset</button>
          </div>

          <div className="text-sm mt-2">
            <div>Sim time: {simTime.toFixed(2)} s</div>
            <div>Speed at bottom: {speedBottom ? speedBottom.toFixed(3) + " m/s" : "—"}</div>
          </div>

          <div className="mt-2">
            <button onClick={exportCSV} className="py-2 w-full rounded bg-green-600 text-white">Export CSV</button>
          </div>
        </div>

        <div className="md:col-span-2">
          <canvas ref={canvasRef} className="w-full border rounded" style={{height:320}} />
        </div>
      </div>
    </div>
  );
}
