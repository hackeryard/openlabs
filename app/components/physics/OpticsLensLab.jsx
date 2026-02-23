"use client"
// src/components/OpticsLensLab.jsx
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../ChatContext";

/**
 * OpticsLensLab.jsx
 *
 * Simple thin-lens lab:
 * - Interactive canvas with draggable object (left of lens)
 * - Controls: object distance (do), object height, focal length (f)
 * - Calculates image distance (di) using 1/f = 1/do + 1/di
 * - Draws principal rays (parallel->focus, center, focus->parallel)
 * - Toggle extended rays for virtual images
 * - Sweep mode and export/save functionality
 *
 * Sign convention used here (simple, classroom-friendly):
 * - Object distance do > 0 when object is left of lens.
 * - Focal length f > 0 for converging (convex) lens, f < 0 for diverging (concave).
 * - Image distance di computed using di = 1 / (1/f - 1/do); di > 0 indicates image to the right (real),
 *   di < 0 indicates image is on the same side as object (virtual).
 */

function _safeNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export default function OpticsLensLab({
  initialF = 0.1, // meters (100 mm)
  initialDo = 0.25, // meters
  initialObjH = 0.05, // meters (5 cm)
}) {
  // Chatbot 
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "Wave Optics",
      theory: "Wave optics diffraction and interference lab.",
      extraContext: ``,
    });
  }, []);
  const canvasRef = useRef(null);
  const [f, setF] = useState(Number(initialF)); // focal length (m)
  const [doDist, setDoDist] = useState(Number(initialDo)); // object distance (m)
  const [objH, setObjH] = useState(Number(initialObjH)); // object height (m)
  const [showExtended, setShowExtended] = useState(true);
  const [simRunning, _setSimRunning] = useState(true);

  // sweep
  const [sweepMode, setSweepMode] = useState("object"); // object | focal
  const [sweepStart, setSweepStart] = useState(0.1);
  const [sweepEnd, setSweepEnd] = useState(0.6);
  const [sweepSteps, setSweepSteps] = useState(10);
  const [sweepResults, setSweepResults] = useState([]);
  const [sweepRunning, setSweepRunning] = useState(false);

  // measured / computed values
  const [di, setDi] = useState(null);
  const [mag, setMag] = useState(null);
  const [uncertainty, _setUncertainty] = useState(0.002); // absolute meters / magnification units for display

  // manual entries & saved runs
  const [manualEntries, setManualEntries] = useState([]); // {do, di, mag, note}
  const STORAGE_KEY = "openlabs_optics_runs_v1";

  // canvas drawing parameters
  const pxPerMeterRef = useRef(1000); // will be set on resize
  const lensXRef = useRef(0.5); // lens x coordinate in canvas logical meters (center)
  const objectXRef = useRef(0); // object x coordinate in logical meters relative to lens (object left negative)
  const _dragRef = useRef(false);

  // compute thin lens formula (safe)
  function computeImageDistance(focal, doVal) {
    // avoid divide by zero
    if (focal === 0) return null;
    if (doVal === 0) return null;
    // 1/f = 1/do + 1/di -> 1/di = 1/f - 1/do -> di = 1 / (1/f - 1/do)
    const denom = (1 / focal) - (1 / doVal);
    if (Math.abs(denom) < 1e-12) return null;
    const result = 1 / denom;
    return result;
  }

  // update di/mag whenever inputs change
  useEffect(() => {
    const diCalc = computeImageDistance(f, doDist);
    setDi(diCalc);
    if (diCalc === null) setMag(null);
    else {
      const m = -diCalc / doDist;
      setMag(m);
    }
  }, [f, doDist, objH]);

  // canvas draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      const parent = canvas.parentElement;
      const width = parent ? Math.min(1100, Math.max(560, parent.clientWidth - 8)) : 800;
      const height = 400;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // choose logical scaling so that typical distances (0.05-0.6 m) fit the canvas
      // map a horizontal range (left_m .. right_m) to canvas width
      // We want lens centered at 0.5*width logical meters; compute pxPerMeter accordingly.
      // Choose logical visible width such that 1 meter ~ ~ pxPerMeter pixels.
      const visibleMeters = 1.4; // around 1.4 m visible width
      pxPerMeterRef.current = width / visibleMeters;
      lensXRef.current = visibleMeters * 0.5; // lens at middle (in meters)
      // compute objectX in meters from lens: lens position - doDist
      objectXRef.current = lensXRef.current - doDist;
    }

    resize();
    window.addEventListener("resize", resize);

    function draw() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, w, h);

      const pxPerM = pxPerMeterRef.current;
      const lensXpx = lensXRef.current * pxPerM;
      const lensYpx = h / 2;

      // draw optical axis
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, lensYpx);
      ctx.lineTo(w, lensYpx);
      ctx.stroke();

      // draw lens (simple vertical line with flair)
      ctx.fillStyle = f >= 0 ? "#60a5fa" : "#fca5a5";
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 2;
      const lensHeight = 160;
      const lensHalf = lensHeight / 2;
      // lens body
      ctx.beginPath();
      ctx.moveTo(lensXpx, lensYpx - lensHalf);
      ctx.lineTo(lensXpx, lensYpx + lensHalf);
      ctx.stroke();
      // small arrows to indicate convex/concave
      if (f >= 0) {
        // convex: draw arcs on both sides
        ctx.beginPath();
        ctx.ellipse(lensXpx - 10, lensYpx, 16, 40, 0, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(lensXpx + 10, lensYpx, 16, 40, 0, Math.PI / 2, -Math.PI / 2);
        ctx.stroke();
      } else {
        // concave: small arcs reversed
        ctx.beginPath(); ctx.ellipse(lensXpx - 6, lensYpx, 10, 30, 0, Math.PI / 2, -Math.PI / 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(lensXpx + 6, lensYpx, 10, 30, 0, -Math.PI / 2, Math.PI / 2); ctx.stroke();
      }

      // draw focal points on axis
      const fpx = pxPerM * f; // length in pixels
      if (f !== 0 && Number.isFinite(fpx)) {
        ctx.fillStyle = "#0f172a";
        const Fx = lensXpx + fpx;
        const Fn = lensXpx - fpx;
        ctx.beginPath(); ctx.arc(Fx, lensYpx, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(Fn, lensYpx, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillText("F", Fx + 6, lensYpx - 6);
        ctx.fillText("F'", Fn - 12, lensYpx - 6);
      }

      // object position (left of lens)
      const objectX_m = lensXRef.current - doDist; // meters logical
      const objectX = objectX_m * pxPerM;
      const objTopY = lensYpx - objH * pxPerM; // scale object height by pxPerM for simplicity
      // draw object (arrow)
      ctx.strokeStyle = "#0f172a";
      ctx.fillStyle = "#047857";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(objectX, lensYpx);
      ctx.lineTo(objectX, objTopY);
      ctx.stroke();
      // arrow head
      ctx.beginPath();
      ctx.moveTo(objectX, objTopY);
      ctx.lineTo(objectX - 8, objTopY + 12);
      ctx.lineTo(objectX + 8, objTopY + 12);
      ctx.fill();

      // draw object distance label
      ctx.fillStyle = "#0f172a";
      ctx.font = "12px sans-serif";
      ctx.fillText(`Object (do=${doDist.toFixed(3)} m)`, objectX - 60, lensYpx + 18);

      // compute image distance di (signed)
      const diCalc = computeImageDistance(f, doDist);
      const _imageXpx = diCalc !== null ? lensXpx + diCalc * pxPerM : null;
      const imageH = diCalc !== null ? - (diCalc / doDist) * objH : null; // magnification times height (m)

      // draw rays: 3 principal rays traced from object top
      // ray A: from object top -> parallel to axis -> refracts through focal point on right (for convex)
      // ray B: through center -> undeviated
      // ray C: through focal point on left -> emerges parallel on right
      const top = { x: objectX, y: objTopY };
      const axisY = lensYpx;
      const rightFar = w - 20;

      // helper to draw a ray segment
      const strokeRay = (pts, color = "#dc2626", dashed = false, width = 1.5) => {
        ctx.beginPath();
        ctx.setLineDash(dashed ? [6, 6] : []);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
        ctx.setLineDash([]);
      };

      // Ray A (parallel -> focus)
      // segment1: objectTop -> point at lens plane (parallel)
      const lensPlaneX = lensXpx;
      const A1 = { x: top.x, y: top.y };
      const A2 = { x: lensPlaneX, y: top.y };
      // refracted: line from lens plane to focal point on right (if f>0), else diverging: draw ray as if to virtual focal point
      const F_right_x = lensPlaneX + f * pxPerM;
      const A3 = { x: F_right_x, y: axisY }; // focal point on right
      // draw refracted ray from lens to far right through focal point
      // compute direction vector from lens plane point to focal point
      let refractedDir = null;
      if (f === 0 || !Number.isFinite(f)) {
        refractedDir = { x: 1, y: 0 };
      } else {
        refractedDir = { x: A3.x - A2.x, y: A3.y - A2.y };
      }
      // extend refracted to far right
      const tA = (rightFar - A2.x) / (refractedDir.x || 1e-9);
      const A_far = { x: A2.x + refractedDir.x * (tA), y: A2.y + refractedDir.y * (tA) };

      strokeRay([A1, A2], "#2563eb", false, 1.5);
      // refracted ray: if lens is converging (f>0) draw through focus; if diverging (f<0) draw virtual extension dashed to left
      if (f > 0) {
        strokeRay([A2, A_far], "#2563eb", false, 1.5);
      } else {
        // diverging: ray emerges away from axis — draw dashed extension backward to indicate virtual focus
        const leftFar = 20;
        // direction for diverging ray: from lens plane to a point that lines up as if it came from focal point on right of lens (virtual)
        // For concave lens, treat as if refracted ray goes away from axis; approximate by reflecting focal geometry
        const A_virtFar = { x: leftFar, y: A2.y + (leftFar - A2.x) * (refractedDir.y / (refractedDir.x || 1e-9)) };
        strokeRay([A2, A_far], "#2563eb", false, 1.5);
        if (showExtended) strokeRay([A2, { x: A2.x - refractedDir.x * 4, y: A2.y - refractedDir.y * 4 }], "#2563eb", true, 1);
      }

      // Ray B: center ray (goes straight through center of lens)
      const centerX = lensPlaneX;
      const C1 = { x: top.x, y: top.y };
      // center point slightly offset vertically through lens center
      const centerTarget = { x: centerX + 2, y: axisY + 2 };
      // draw straight line from object top through lens center and beyond
      const dirB = { x: centerTarget.x - C1.x, y: centerTarget.y - C1.y };
      const tB = (rightFar - C1.x) / (dirB.x || 1e-9);
      const B_far = { x: C1.x + dirB.x * tB, y: C1.y + dirB.y * tB };
      strokeRay([C1, B_far], "#10b981", false, 1.5);

      // Ray C: through focal point on left -> emerges parallel
      // focal point on left:
      const F_left_x = lensPlaneX - f * pxPerM;
      const Cstart = { x: top.x, y: top.y };
      const CtoFleft = { x: F_left_x, y: axisY };
      // segment from object top to focal point on left: draw dashed (virtual pass)
      strokeRay([Cstart, CtoFleft], "#f59e0b", true, 1);
      // after lens emerges parallel to axis from lens plane point
      const _lensPlanePoint = { x: lensPlaneX, y: CtoFleft.y + (lensPlaneX - CtoFleft.x) * (CtoFleft.y === top.y ? 0 : (top.y - CtoFleft.y) / (top.x - CtoFleft.x || 1)) };
      // simpler: emergent parallel line at height top.y
      const emergent = { x: rightFar, y: top.y };
      strokeRay([{ x: lensPlaneX, y: top.y }, emergent], "#f59e0b", false, 1.5);

      // If image exists to the right (real), draw image arrow
      if (diCalc !== null && Number.isFinite(diCalc)) {
        const imageX = lensXpx + diCalc * pxPerM;
        const imageTopY = lensYpx - imageH * pxPerM;
        // draw image arrow (blue)
        ctx.strokeStyle = "#1f2937";
        ctx.fillStyle = "#3b82f6";
        ctx.beginPath(); ctx.moveTo(imageX, lensYpx); ctx.lineTo(imageX, imageTopY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(imageX, imageTopY); ctx.lineTo(imageX - 8, imageTopY + 12); ctx.lineTo(imageX + 8, imageTopY + 12); ctx.fill();
        ctx.fillStyle = "#0f172a"; ctx.fillText(`Image (di=${diCalc !== null ? diCalc.toFixed(3) : "—"} m)`, imageX + 8, lensYpx + 18);
      } else {
        // no finite image (rare), do nothing
      }

      // annotation: magnification
      if (mag !== null) {
        ctx.fillStyle = "#0f172a"; ctx.fillText(`Magnification m = ${mag.toFixed(3)}`, 12, 18);
      } else {
        ctx.fillStyle = "#0f172a"; ctx.fillText(`Magnification m = —`, 12, 18);
      }

      // small legend
      ctx.fillStyle = "#0f172a"; ctx.font = "11px sans-serif";
      ctx.fillText("Rays: blue (parallel→focus), green (center), orange (focus→parallel)", 12, h - 12);
    }

    // initial draw and interval
    draw();
    const id = setInterval(() => { if (simRunning) draw(); }, 50);

    return () => {
      clearInterval(id);
      window.removeEventListener("resize", resize);
    };

  }, [f, doDist, objH, showExtended, simRunning, mag, di]);

  // Pointer interactions: drag object vertically or horizontally to set doDist and objH
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = () => canvas.getBoundingClientRect();
    let dragging = false;
    let dragMode = null; // "move" or "height"
    function screenToLogical(clientX, clientY) {
      const r = rect();
      const pxPerM = pxPerMeterRef.current;
      const _lensXpx = lensXRef.current * pxPerM;
      const x_m = (clientX - r.left) / pxPerM;
      const y_m = (clientY - r.top - (canvas.clientHeight / 2)) / -pxPerM; // y upwards in meters
      return { x_m, y_m };
    }
    function onDown(e) {
      e.preventDefault();
      const p = e.touches ? e.touches[0] : e;
      const { x_m, y_m } = screenToLogical(p.clientX, p.clientY);
      // convert logical to canvas meters where lens center at lensXRef.current
      const _objX_m = lensXRef.current - doDist;
      const objY_m = objH;
      // compute distance in meters
      const dx = x_m - _objX_m;
      const dy = y_m - objY_m;
      const _dist = Math.sqrt(dx * dx + dy * dy);
      // if click close to object top, allow drag height; else if near object base allow move horizontally
      if (Math.abs(dx) < 0.05 && Math.abs(y_m) < 0.5 && Math.abs(dy) < 0.2) {
        dragging = true;
        dragMode = "height";
      } else if (Math.abs(dx) < 0.3 && Math.abs(dy) < 1.0) {
        dragging = true;
        dragMode = "move";
      } else {
        dragging = false;
      }
    }
    function onMove(e) {
      if (!dragging) return;
      const p = e.touches ? e.touches[0] : e;
      const { x_m, y_m } = screenToLogical(p.clientX, p.clientY);
      const _objX_m = lensXRef.current - doDist;
      if (dragMode === "move") {
        // compute new do as lensX - x_m
        const newDo = Math.max(0.02, Math.min(2.0, Math.abs(lensXRef.current - x_m)));
        setDoDist(Number(newDo.toFixed(4)));
      } else if (dragMode === "height") {
        const newH = Math.max(0.005, Math.min(0.5, Math.abs(y_m)));
        setObjH(Number(newH.toFixed(4)));
      }
    }
    function onUp() { dragging = false; dragMode = null; }
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    return () => {
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("touchstart", onDown);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };

  }, [doDist, objH, f]);

  // manual entry
  function addManualEntry(note = "") {
    if (!di || !Number.isFinite(di)) {
      setManualEntries((m) => [...m, { do: doDist, di: null, mag: null, note }]);
    } else {
      setManualEntries((m) => [...m, { do: doDist, di: Number(di.toFixed(6)), mag: Number((mag || 0).toFixed(6)), note }]);
    }
  }

  // save/load
  function saveRun(name = `optics_${Date.now()}`) {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const payload = {
      name,
      date: new Date().toISOString(),
      params: { f, do: doDist, objH, uncertainty },
      result: { di, mag },
      manualEntries,
      sweepResults,
    };
    stored.push(payload);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    alert("Saved run: " + name);
  }
  function listRuns() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  }
  function clearRuns() {
    localStorage.removeItem(STORAGE_KEY);
    alert("Cleared saved runs");
  }

  // export CSV/JSON/report
  function exportCSV() {
    const rows = [["do_m", "di_m", "magnification"]];
    rows.push([doDist.toString(), di !== null ? di.toString() : "", mag !== null ? mag.toString() : ""]);
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `optics_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function exportJSON() {
    const obj = { params: { f, do: doDist, objH }, result: { di, mag }, manualEntries, sweepResults, date: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `optics_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function exportReport() {
    const html = `
      <html><head><title>Optics Report</title><style>body{font-family:Arial;padding:20px}</style></head><body>
      <h1>Optics — Thin Lens Report</h1>
      <p>Date: ${new Date().toLocaleString()}</p>
      <h2>Parameters</h2>
      <ul>
        <li>Focal length: ${f} m</li>
        <li>Object distance do: ${doDist} m</li>
        <li>Object height: ${objH} m</li>
      </ul>
      <h2>Results</h2>
      <p>Image distance di: ${di !== null ? di.toFixed(6) + " m" : "—"}</p>
      <p>Magnification: ${mag !== null ? mag.toFixed(6) : "—"}</p>
      <h3>Manual entries</h3><pre>${manualEntries.map(e => `do=${e.do} m, di=${e.di}, m=${e.mag}  ${e.note || ""}`).join("\n")}</pre>
      <button onclick="window.print()">Print / Save as PDF</button>
      </body></html>`;
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return alert("Popup blocked.");
    w.document.write(html);
    w.document.close();
  }

  // sweep routine
  async function runSweep() {
    setSweepRunning(true);
    setSweepResults([]);
    const steps = Math.max(2, Math.floor(sweepSteps));
    const results = [];
    if (sweepMode === "object") {
      for (let i = 0; i < steps; i++) {
        const doVal = sweepStart + (i / (steps - 1)) * (sweepEnd - sweepStart);
        const diVal = computeImageDistance(f, doVal);
        const magVal = diVal !== null ? -diVal / doVal : null;
        results.push({ do: doVal, di: diVal, mag: magVal });
        setSweepResults((s) => [...s, { do: doVal, di: diVal, mag: magVal }]);
        await new Promise((r) => setTimeout(r, 80));
      }
    } else {
      for (let i = 0; i < steps; i++) {
        const fVal = sweepStart + (i / (steps - 1)) * (sweepEnd - sweepStart);
        const diVal = computeImageDistance(fVal, doDist);
        const magVal = diVal !== null ? -diVal / doDist : null;
        results.push({ f: fVal, di: diVal, mag: magVal });
        setSweepResults((s) => [...s, { f: fVal, di: diVal, mag: magVal }]);
        await new Promise((r) => setTimeout(r, 80));
      }
    }
    setSweepResults(results);
    setSweepRunning(false);
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Optics — Thin Lens Lab</h2>
        <div className="text-sm text-gray-600">Interactive ray diagram — thin lens equation 1/f = 1/do + 1/di</div>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Controls */}
        <div className="md:col-span-1 bg-white p-4 rounded shadow space-y-3">
          <div>
            <label className="block text-sm font-medium">Focal length f (m) — (+) converging, (−) diverging</label>
            <input type="range" min={-0.5} max={0.5} step={0.001} value={f} onChange={(e) => setF(Number(e.target.value))} />
            <input type="number" value={f} onChange={(e) => setF(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1" />
          </div>

          <div>
            <label className="block text-sm font-medium">Object distance do (m)</label>
            <input type="range" min={0.02} max={1.2} step={0.001} value={doDist} onChange={(e) => setDoDist(Number(e.target.value))} />
            <input type="number" value={doDist} onChange={(e) => setDoDist(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1" />
          </div>

          <div>
            <label className="block text-sm font-medium">Object height (m)</label>
            <input type="range" min={0.005} max={0.5} step={0.001} value={objH} onChange={(e) => setObjH(Number(e.target.value))} />
            <input type="number" value={objH} onChange={(e) => setObjH(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1" />
          </div>

          <div className="mt-2">
            <label className="inline-flex items-center"><input type="checkbox" checked={showExtended} onChange={(e) => setShowExtended(e.target.checked)} className="mr-2" /> Show extended rays</label>
          </div>

          <div className="mt-2 text-sm">
            <div>Image distance di: <strong>{di !== null ? di.toFixed(4) + " m" : "—"}</strong></div>
            <div>Magnification m: <strong>{mag !== null ? mag.toFixed(4) : "—"}</strong></div>
            <div className="text-xs text-gray-500">Positive di = image on right (real). Negative di = image on left (virtual).</div>
          </div>

          <div className="flex gap-2 mt-2">
            <button onClick={() => addManualEntry()} className="flex-1 py-2 rounded bg-green-600 text-white">Record Measurement</button>
            <button onClick={() => { setDoDist(initialDo); setF(initialF); setObjH(initialObjH); setManualEntries([]); setSweepResults([]); }} className="flex-1 py-2 rounded bg-gray-200">Reset</button>
          </div>

          <div className="mt-2">
            <button onClick={() => saveRun()} className="w-full py-2 rounded bg-orange-500 text-white">Save Run</button>
          </div>
        </div>

        {/* Canvas */}
        <div className="md:col-span-2 bg-white p-3 rounded shadow">
          <div className="flex items-center justify-between mb-2">
            <div><strong>Ray diagram — drag object to move</strong><div className="text-xs text-gray-500">Drag horizontally near the object to change do, drag vertically near object top to change height</div></div>
            <div className="flex gap-2">
              <button onClick={exportCSV} className="px-3 py-1 bg-green-600 text-white rounded">Export CSV</button>
              <button onClick={exportJSON} className="px-3 py-1 bg-yellow-400 rounded">Export JSON</button>
              <button onClick={exportReport} className="px-3 py-1 bg-indigo-600 text-white rounded">Printable Report</button>
            </div>
          </div>
          <canvas ref={canvasRef} className="w-full border rounded" style={{ height: 380 }} />
          <div className="mt-2 text-xs text-gray-500">Tip: click/touch near the object arrow to drag height, or drag horizontally to move object distance.</div>
        </div>
      </div>

      {/* Sweep */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Sweep — collect di & magnification</h3>
        <div className="grid md:grid-cols-6 gap-2 items-end">
          <div>
            <label className="block text-xs">Mode</label>
            <select value={sweepMode} onChange={(e) => setSweepMode(e.target.value)} className="w-full border rounded px-2 py-1">
              <option value="object">Vary object distance (do)</option>
              <option value="focal">Vary focal length (f)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs">Start</label>
            <input type="number" step="0.001" value={sweepStart} onChange={(e) => setSweepStart(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-xs">End</label>
            <input type="number" step="0.001" value={sweepEnd} onChange={(e) => setSweepEnd(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-xs">Steps</label>
            <input type="number" min="2" step="1" value={sweepSteps} onChange={(e) => setSweepSteps(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <button onClick={() => { setSweepResults([]); runSweep(); }} disabled={sweepRunning} className="w-full py-2 rounded bg-indigo-600 text-white">{sweepRunning ? "Running..." : "Run Sweep"}</button>
          </div>
          <div>
            <button onClick={() => setSweepResults([])} className="w-full py-2 rounded bg-gray-200">Clear</button>
          </div>
        </div>

        <div className="mt-3 grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">Sweep Results</div>
            <div className="mt-2 max-h-40 overflow-auto text-sm">
              {sweepResults.length === 0 ? <div className="text-xs text-gray-500">No results</div> :
                <table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr><th style={{ padding: 6 }}>Param</th><th style={{ padding: 6 }}>di (m)</th><th style={{ padding: 6 }}>m</th></tr></thead><tbody>
                  {sweepResults.map((r, i) => (<tr key={i}><td style={{ padding: 6 }}>{r.do ? `do=${r.do.toFixed(3)}` : r.f ? `f=${r.f.toFixed(3)}` : "-"}</td><td style={{ padding: 6 }}>{r.di !== null ? r.di.toFixed(4) : "—"}</td><td style={{ padding: 6 }}>{r.mag !== null ? r.mag.toFixed(4) : "—"}</td></tr>))}
                </tbody></table>}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium">Manual Entries</div>
            <div className="mt-2 text-sm">
              <div className="mt-2">
                <button onClick={() => addManualEntry()} className="px-3 py-1 rounded bg-emerald-500 text-white mb-2">Add Current Measurement</button>
                <button onClick={() => setManualEntries([])} className="px-3 py-1 rounded bg-gray-200 ml-2 mb-2">Clear</button>
                <ul className="max-h-40 overflow-auto">
                  {manualEntries.map((m, i) => (<li key={i} className="py-1 border-b text-sm">{`do=${m.do} m, di=${m.di || "—"}, m=${m.mag || "—"} ${m.note || ""}`}</li>))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save / export */}
      <div className="bg-white p-4 rounded shadow flex gap-2">
        <button onClick={() => saveRun()} className="px-3 py-2 bg-orange-500 text-white rounded">Save Run</button>
        <button onClick={() => { const runs = listRuns(); if (!runs || runs.length === 0) alert("No saved runs"); else alert(runs.map(r => r.name + " - " + r.date).join("\n")); }} className="px-3 py-2 bg-gray-200 rounded">List Saved</button>
        <button onClick={() => clearRuns()} className="px-3 py-2 bg-red-500 text-white rounded">Clear Saved</button>
        <div className="flex-1" />
        <button onClick={exportCSV} className="px-3 py-2 bg-green-600 text-white rounded">Export CSV</button>
        <button onClick={exportJSON} className="px-3 py-2 bg-yellow-400 rounded">Export JSON</button>
        <button onClick={exportReport} className="px-3 py-2 bg-indigo-600 text-white rounded">Printable Report</button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Lab Instructions</h3>
        <ol className="list-decimal list-inside text-sm mt-2">
          <li>Set focal length and object distance (or drag object). Observe the ray diagram and image location.</li>
          <li>Use magnification and di to understand real vs virtual images; switch focal length sign to simulate concave lens.</li>
          <li>Run sweeps (vary do or f) to collect data and export CSV/JSON for analysis.</li>
        </ol>
      </div>
    </div>
  );
}
