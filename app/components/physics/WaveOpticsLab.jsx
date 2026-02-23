"use client";
// src/components/WaveOpticsLab.jsx
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../ChatContext";

/**
 * WaveOpticsLab.jsx
 *
 * - Simulates Fraunhofer diffraction & interference:
 *   Modes: single-slit, double-slit, diffraction grating (N slits)
 * - Uses canvas to draw intensity vs position on screen, with a zoomed central view.
 * - Controls to change wavelength (nm), slit width a (µm), slit separation d (µm),
 *   number of slits N (grating), screen distance L (m), intensity scale and resolution.
 * - Exports CSV, saves runs to localStorage, click on canvas to read (x, intensity).
 *
 * Physics formulas (Fraunhofer, small-angle approx sinθ ≈ x / L):
 *  - single-slit envelope: E_env = sinc(β) where β = π a sinθ / λ, sinc(β) = sin(β)/β
 *  - double-slit interference: I ∝ cos^2(α) * sinc^2(β) where α = π d sinθ / λ
 *  - N-slit (grating): I ∝ ( sin(N γ) / sin(γ) )^2 * sinc^2(β) where γ = π d sinθ / λ
 *
 * Units: user-friendly UI uses nm/µm; conversions done internally to meters.
 */

function sinc(x) {
  if (Math.abs(x) < 1e-8) return 1;
  return Math.sin(x) / x;
}

export default function WaveOpticsLab() {
  // Chatbot 
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "Wave Optics",
      theory: "wave optics diffraction and interference.",
      extraContext: ``,
    });
  }, []);
  const canvasRef = useRef(null);
  const _smallRef = useRef(null);
  const [mode, setMode] = useState("double"); // 'single'|'double'|'grating'
  const [wavelengthNm, setWavelengthNm] = useState(632.8); // nm default HeNe
  const [aMicron, setAMicron] = useState(50); // slit width µm
  const [dMicron, setDMicron] = useState(150); // slit separation µm
  const [Nslits, setNslits] = useState(5); // grating slits
  const [L, setL] = useState(1.2); // screen distance m
  const [I0, _setI0] = useState(1.0);
  const [intensityScale, setIntensityScale] = useState(1.0);
  const [rangeMeters, setRangeMeters] = useState(0.5); // half-screen width in meters
  const [resolution, setResolution] = useState(1200); // sample points across full width
  const [clickInfo, setClickInfo] = useState(null);
  const dataRef = useRef([]); // latest computed intensity points [{x, Inorm}]
  const [savedRunsKey] = useState("openlabs_waveoptics_runs_v1");

  // compute intensity pattern
  function computePattern() {
    const λ = wavelengthNm * 1e-9;
    const a = aMicron * 1e-6;
    const d = dMicron * 1e-6;
    const Lval = L;
    const half = rangeMeters;
    const N = Math.max(1, Math.floor(Nslits));
    const samples = Math.max(200, Math.floor(resolution));
    const xs = new Array(samples);
    const Is = new Array(samples);
    // x runs from -half..+half
    for (let i = 0; i < samples; i++) {
      const x = -half + (i / (samples - 1)) * (2 * half);
      const sinθ = x / Math.sqrt(x * x + Lval * Lval); // use sinθ exact
      const beta = Math.PI * a * sinθ / λ; // envelope
      const gamma = Math.PI * d * sinθ / λ; // interference term
      let envelope = sinc(beta);
      envelope = envelope * envelope; // intensity envelope
      let interference = 1;
      if (mode === "single") {
        interference = 1;
      } else if (mode === "double") {
        interference = Math.cos(gamma);
        interference = interference * interference;
      } else if (mode === "grating") {
        // grating factor: (sin(N*gamma)/sin(gamma))^2 normalized by N^2
        if (Math.abs(Math.sin(gamma)) < 1e-12) {
          interference = (N * N);
        } else {
          const num = Math.sin(N * gamma);
          const den = Math.sin(gamma);
          interference = (num / den) * (num / den);
        }
        // normalize by N^2 so peak is ~1
        interference = interference / (N * N);
      }
      const I = I0 * envelope * interference;
      xs[i] = x;
      Is[i] = I;
    }
    // normalize by max
    const maxI = Math.max(...Is, 1e-12);
    const inorm = Is.map((v) => v / maxI);
    const points = xs.map((x, i) => ({ x, I: inorm[i] }));
    dataRef.current = points;
    return points;
  }

  // draw main canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    function resize() {
      const parent = canvas.parentElement;
      const w = parent ? Math.min(1100, Math.max(560, parent.clientWidth - 8)) : 800;
      const h = 260;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }
    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, wavelengthNm, aMicron, dMicron, Nslits, L, I0, intensityScale, rangeMeters, resolution]);

  function draw() {
    const points = computePattern();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    // background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, w, h);

    // axes & labels
    ctx.fillStyle = "#0f172a";
    ctx.font = "13px sans-serif";
    ctx.fillText(`Mode: ${mode}    λ=${wavelengthNm} nm    a=${aMicron} μm    d=${dMicron} μm    L=${L.toFixed(2)} m`, 8, 18);

    // plot area with margin
    const margin = 44;
    const plotW = w - margin * 2;
    const plotH = h - margin * 2;
    const px = margin;
    const py = margin;

    // draw axis
    ctx.strokeStyle = "#e6eef8";
    ctx.lineWidth = 1;
    ctx.strokeRect(px, py, plotW, plotH);

    // intensity waveform
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#2563eb";
    for (let i = 0; i < points.length; i++) {
      const t = i / (points.length - 1);
      const x = px + t * plotW;
      const y = py + plotH - Math.min(1, points[i].I * intensityScale) * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // fill under curve lightly
    ctx.lineTo(px + plotW, py + plotH);
    ctx.lineTo(px, py + plotH);
    ctx.closePath();
    ctx.fillStyle = "rgba(37,99,235,0.12)";
    ctx.fill();

    // ticks: mark center (x=0)
    ctx.strokeStyle = "#94a3b8";
    ctx.beginPath();
    const centerX = px + plotW * 0.5;
    ctx.moveTo(centerX, py);
    ctx.lineTo(centerX, py + plotH);
    ctx.stroke();
    ctx.fillStyle = "#0f172a";
    ctx.fillText("x = 0", centerX + 6, py + 14);

    // annotate main peaks (rough)
    const peaks = findPeaks(points, 5);
    ctx.fillStyle = "#0f172a";
    ctx.font = "11px sans-serif";
    peaks.slice(0, 6).forEach((p) => {
      const t = (p.index / (points.length - 1));
      const xpx = px + t * plotW;
      const ypos = py + plotH - p.value * plotH - 10;
      ctx.beginPath();
      ctx.fillStyle = "#dc2626";
      ctx.arc(xpx, py + plotH - p.value * plotH, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0f172a";
      ctx.fillText(`${p.x.toFixed(3)} m`, xpx + 6, ypos);
    });

    // small info panel right
    const infoX = px + plotW + 8;
    ctx.fillStyle = "#0f172a";
    ctx.font = "12px sans-serif";
    ctx.fillText(`Intensity scale: ×${intensityScale.toFixed(2)}`, infoX, py + 12);
    // compute basic expected fringe spacing for double-slit: Δx ≈ λ L / d (if d>0)
    const λ = wavelengthNm * 1e-9;
    const d = dMicron * 1e-6;
    let fringeSpacing = null;
    if (d > 0) fringeSpacing = (λ * L) / d;
    if (fringeSpacing) ctx.fillText(`Fringe spacing (Δx) ≈ ${fringeSpacing.toExponential(3)} m`, infoX, py + 30);
    ctx.fillText(`Click plot to read intensity at x`, infoX, py + 48);

    // draw zoomed small canvas (center)
    drawSmallCenter(ctx, points, px, py, plotW, plotH);
  }

  // small center zoom visualization in bottom-left corner
  function drawSmallCenter(ctx, points, px, py, plotW, plotH) {
    // draw a small inset showing zoom around center (±10% of range)
    const insetW = Math.min(260, plotW * 0.4);
    const insetH = Math.min(120, plotH * 0.45);
    const insetX = px + 8;
    const insetY = py + plotH - insetH - 8;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(insetX, insetY, insetW, insetH);
    ctx.strokeStyle = "#c7d2fe";
    ctx.strokeRect(insetX, insetY, insetW, insetH);

    const samples = points.length;
    const centerIndex = Math.floor(samples / 2);
    const halfWindow = Math.floor(samples * 0.05); // 5% window
    const start = Math.max(0, centerIndex - halfWindow);
    const end = Math.min(samples - 1, centerIndex + halfWindow);
    ctx.beginPath();
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1.6;
    for (let i = start; i <= end; i++) {
      const t = (i - start) / Math.max(1, end - start);
      const x = insetX + t * insetW;
      const y = insetY + insetH - points[i].I * insetH;
      if (i === start) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = "#0f172a";
    ctx.font = "10px sans-serif";
    ctx.fillText("Zoom (center)", insetX + 6, insetY + 12);
  }

  // find peaks simple implementation
  function findPeaks(points, maxPeaks = 10) {
    const peaks = [];
    for (let i = 1; i < points.length - 1; i++) {
      if (points[i].I > points[i - 1].I && points[i].I > points[i + 1].I && points[i].I > 0.01) {
        peaks.push({ index: i, value: points[i].I, x: points[i].x });
      }
    }
    peaks.sort((a, b) => b.value - a.value);
    return peaks.slice(0, maxPeaks);
  }

  // click handler to read intensity
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    function onClick(e) {
      const rect = canvas.getBoundingClientRect();
      const px = 44;
      const plotW = canvas.clientWidth - px * 2;
      const xClick = e.clientX - rect.left - px;
      const t = xClick / plotW;
      if (t < 0 || t > 1) return;
      const points = dataRef.current.length ? dataRef.current : computePattern();
      const idx = Math.round(t * (points.length - 1));
      const p = points[idx];
      setClickInfo({ x: p.x, I: p.I });
    }
    canvas.addEventListener("click", onClick);
    return () => canvas.removeEventListener("click", onClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, wavelengthNm, aMicron, dMicron, L, intensityScale, rangeMeters, resolution]);

  // draw initial on mount & whenever params change
  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, wavelengthNm, aMicron, dMicron, Nslits, L, intensityScale, rangeMeters, resolution]);

  // export CSV
  function exportCSV() {
    const points = dataRef.current.length ? dataRef.current : computePattern();
    const rows = [["x_m", "I_norm"], ...points.map((p) => [p.x.toString(), p.I.toString()])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waveoptics_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // save/load runs
  function saveRun(name = `waveoptics_${Date.now()}`) {
    const stored = JSON.parse(localStorage.getItem(savedRunsKey) || "[]");
    const payload = {
      name,
      date: new Date().toISOString(),
      params: { mode, wavelengthNm, aMicron, dMicron, Nslits, L, intensityScale, rangeMeters, resolution },
      pattern: dataRef.current.slice(0, 2000),
    };
    stored.push(payload);
    localStorage.setItem(savedRunsKey, JSON.stringify(stored));
    alert("Saved run: " + name);
  }
  function listRuns() {
    const s = JSON.parse(localStorage.getItem(savedRunsKey) || "[]");
    if (!s.length) alert("No saved runs");
    else alert(s.map((r) => `${r.name} — ${r.date}`).join("\n"));
  }
  function clearRuns() {
    localStorage.removeItem(savedRunsKey);
    alert("Cleared saved runs");
  }

  // printable report
  function exportReport() {
    const pts = dataRef.current.length ? dataRef.current : computePattern();
    const _maxI = Math.max(...pts.map((p) => p.I), 1e-9);
    const html = `
      <html><head><title>Wave Optics Report</title>
      <style>body{font-family:Arial;padding:18px}pre{white-space:pre-wrap}</style></head><body>
      <h1>Wave Optics — Report</h1>
      <p>Date: ${new Date().toLocaleString()}</p>
      <h2>Parameters</h2>
      <ul>
        <li>Mode: ${mode}</li>
        <li>Wavelength: ${wavelengthNm} nm</li>
        <li>Slit width a: ${aMicron} μm</li>
        <li>Slit separation d: ${dMicron} μm</li>
        <li>Number of slits (grating): ${Nslits}</li>
        <li>Screen distance: ${L} m</li>
      </ul>
      <h2>Sample points (first 50)</h2>
      <pre>${pts.slice(0, 50).map(p => `x=${p.x.toFixed(6)} m, I=${(p.I * intensityScale).toFixed(6)}`).join("\n")}</pre>
      <button onclick="window.print()">Print / Save as PDF</button>
      </body></html>`;
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return alert("Popup blocked");
    w.document.write(html);
    w.document.close();
  }

  // sweep example: sweep wavelength across a range and store peak shift
  async function runSweepWavelength(startNm = 400, endNm = 800, steps = 9) {
    setClickInfo(null);
    const original = { wavelengthNm: wavelengthNm };
    const results = [];
    for (let i = 0; i < steps; i++) {
      const val = startNm + (i / (steps - 1)) * (endNm - startNm);
      setWavelengthNm(val);
      await new Promise((r) => setTimeout(r, 120));
      const pts = computePattern();
      // find main peak nearest center
      const centerIdx = Math.floor(pts.length / 2);
      let peakIdx = centerIdx;
      let peakVal = pts[centerIdx].I;
      for (let j = centerIdx; j < pts.length; j++) {
        if (pts[j].I > peakVal) { peakVal = pts[j].I; peakIdx = j; }
        if (pts[j].I < 0.2 * peakVal && j > centerIdx + 40) break;
      }
      const peakX = pts[peakIdx].x;
      results.push({ wavelength: val, peakX, peakI: peakVal });
    }
    // restore
    setWavelengthNm(original.wavelengthNm);
    alert("Sweep complete. Results:\n" + results.map(r => `${r.wavelength} nm -> peakX=${r.peakX.toExponential(3)} m`).join("\n"));
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Wave Optics — Diffraction & Interference Lab</h2>
        <div className="text-sm text-gray-600">Fraunhofer approximation: small-angle diffraction patterns</div>
      </header>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-1 bg-white p-4 rounded shadow space-y-3">
          <label className="block text-sm">Mode</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full border rounded px-2 py-1">
            <option value="single">Single slit</option>
            <option value="double">Double slit</option>
            <option value="grating">Diffraction grating (N slits)</option>
          </select>

          <label className="block text-sm mt-2">Wavelength (nm)</label>
          <input type="range" min={350} max={900} step={1} value={wavelengthNm} onChange={(e) => setWavelengthNm(Number(e.target.value))} />
          <input type="number" value={wavelengthNm} onChange={(e) => setWavelengthNm(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1" />

          <label className="block text-sm mt-2">Slit width a (μm)</label>
          <input type="range" min={1} max={500} step={1} value={aMicron} onChange={(e) => setAMicron(Number(e.target.value))} />
          <input type="number" value={aMicron} onChange={(e) => setAMicron(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1" />

          <label className="block text-sm mt-2">Slit separation d (μm)</label>
          <input type="range" min={1} max={2000} step={1} value={dMicron} onChange={(e) => setDMicron(Number(e.target.value))} />
          <input type="number" value={dMicron} onChange={(e) => setDMicron(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1" />

          {mode === "grating" && <>
            <label className="block text-sm mt-2">Number of slits N</label>
            <input type="range" min={2} max={200} step={1} value={Nslits} onChange={(e) => setNslits(Number(e.target.value))} />
            <input type="number" value={Nslits} onChange={(e) => setNslits(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1" />
          </>}

          <label className="block text-sm mt-2">Screen distance L (m)</label>
          <input type="range" min={0.2} max={5} step={0.01} value={L} onChange={(e) => setL(Number(e.target.value))} />
          <input type="number" value={L} onChange={(e) => setL(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1" />

          <div className="mt-2">
            <label className="block text-sm">Full half-width on screen (m)</label>
            <input type="range" min={0.05} max={2} step={0.01} value={rangeMeters} onChange={(e) => setRangeMeters(Number(e.target.value))} />
            <input type="number" value={rangeMeters} onChange={(e) => setRangeMeters(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1" />
          </div>

          <div className="mt-2 flex gap-2">
            <button onClick={() => draw()} className="flex-1 py-2 rounded bg-blue-600 text-white">Redraw</button>
            <button onClick={() => { setResolution(Math.max(200, resolution + 200)); draw(); }} className="py-2 px-3 rounded bg-gray-200">+Res</button>
          </div>
        </div>

        <div className="md:col-span-3 bg-white p-3 rounded shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm">Intensity vs screen position (click to read)</div>
            <div className="flex gap-2">
              <button onClick={exportCSV} className="px-3 py-1 rounded bg-green-600 text-white">Export CSV</button>
              <button onClick={() => saveRun()} className="px-3 py-1 rounded bg-orange-500 text-white">Save Run</button>
              <button onClick={() => listRuns()} className="px-3 py-1 rounded bg-gray-200">List Saved</button>
              <button onClick={() => clearRuns()} className="px-3 py-1 rounded bg-red-500 text-white">Clear Saved</button>
              <button onClick={() => exportReport()} className="px-3 py-1 rounded bg-indigo-600 text-white">Printable</button>
              <button onClick={() => runSweepWavelength(400, 800, 9)} className="px-3 py-1 rounded bg-violet-600 text-white">Sweep λ 400–800 nm</button>
            </div>
          </div>
          <canvas ref={canvasRef} className="w-full border rounded" style={{ height: 260 }} />
          <div className="mt-2 flex items-start gap-4">
            <div className="text-sm">
              <div>Intensity scale</div>
              <input type="range" min={0.2} max={8} step={0.1} value={intensityScale} onChange={(e) => setIntensityScale(Number(e.target.value))} />
              <div className="mt-1 text-xs">Scale: {intensityScale.toFixed(2)}×</div>
            </div>

            <div className="text-sm">
              <div>Resolution</div>
              <input type="range" min={200} max={2400} step={100} value={resolution} onChange={(e) => setResolution(Number(e.target.value))} />
              <div className="mt-1 text-xs">Samples: {resolution}</div>
            </div>

            <div className="text-sm">
              <div>Last click</div>
              <div className="mt-1 font-mono text-sm">{clickInfo ? `x=${clickInfo.x.toExponential(3)} m, I=${clickInfo.I.toFixed(4)}` : "—"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lab instructions */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Lab Instructions — Wave Optics</h3>
        <ol className="list-decimal list-inside text-sm mt-2">
          <li>Select mode: single slit for envelope-only, double slit for interference & envelope, grating for many-slit pattern.</li>
          <li>Set wavelength λ (nm), slit width a (μm) and slit separation d (μm), and screen distance L (m).</li>
          <li>Click the intensity plot to read the normalized intensity at that screen position.</li>
          <li>Use sweep (λ) to observe how fringe spacing varies with wavelength: Δx ≈ λ L / d (double-slit).</li>
          <li>Export CSV for data analysis or save a run for later review.</li>
        </ol>
      </div>
    </div>
  );
}
