"use client";
import React, { useEffect, useRef, useState } from "react";

export default function SimplePendulum({
  initialLength = 1.0,
  initialGravity = 9.81,
  initialDamping = 0.01,
  initialAngleDeg = 20,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const _lastFrameRef = useRef(null);

  // physics refs (avoid rerender)
  const thetaRef = useRef((initialAngleDeg * Math.PI) / 180);
  const thetaVelRef = useRef(0);
  const simTRef = useRef(0);

  // data
  const dataRef = useRef([]); // {t, angleDeg}
  const crossingsRef = useRef([]); // crossing times (for measured period)

  // stateful UI
  const [length, setLength] = useState(Number(initialLength));
  const [gravity, setGravity] = useState(Number(initialGravity));
  const [damping, setDamping] = useState(Number(initialDamping));
  const [initAngleDeg, setInitAngleDeg] = useState(Number(initialAngleDeg));

  const [running, setRunning] = useState(true);
  const [simTime, setSimTime] = useState(0);
  const [theoreticalPeriod, setTheoreticalPeriod] = useState(0);
  const [measuredPeriod, setMeasuredPeriod] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  // stopwatch (for manual timing)
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const stopwatchRef = useRef({ start: null, elapsed: 0 });
  const [stopwatchDisplay, setStopwatchDisplay] = useState("0.000");
  const [laps, setLaps] = useState([]); // manual times recorded

  // manual measurements (user-entered)
  const [manualMeasurements, setManualMeasurements] = useState([]); // {time, note}

  // uncertainty (seconds)
  const [uncertainty, setUncertainty] = useState(0.02);

  // sweep settings & results
  const [sweepRunning, setSweepRunning] = useState(false);
  const [sweepStart, setSweepStart] = useState(0.3);
  const [sweepEnd, setSweepEnd] = useState(3.0);
  const [sweepSteps, setSweepSteps] = useState(8);
  const [sweepResults, setSweepResults] = useState([]); // [{L, T}]

  // UI toggles
  const [showRuler, setShowRuler] = useState(true);
  const [showProtractor, setShowProtractor] = useState(false);

  // draggable bob
  const draggingRef = useRef(false);

  // save/load key
  const STORAGE_KEY = "openlabs_pendulum_runs_v1";

  // compute theoretical period
  useEffect(() => {
    if (length > 0 && gravity > 0) setTheoreticalPeriod(2 * Math.PI * Math.sqrt(length / gravity));
    else setTheoreticalPeriod(0);
  }, [length, gravity]);

  // stopwatch loop
  useEffect(() => {
    let swTimer = null;
    if (stopwatchRunning) {
      if (!stopwatchRef.current.start) stopwatchRef.current.start = performance.now() - stopwatchRef.current.elapsed * 1000;
      swTimer = setInterval(() => {
        const now = performance.now();
        const elapsed = (now - stopwatchRef.current.start) / 1000;
        setStopwatchDisplay(elapsed.toFixed(3));
      }, 40);
    } else {
      if (stopwatchRef.current.start) stopwatchRef.current.elapsed = (performance.now() - stopwatchRef.current.start) / 1000;
      setStopwatchDisplay(stopwatchRef.current.elapsed.toFixed(3));
    }
    return () => clearInterval(swTimer);
  }, [stopwatchRunning]);

  // main canvas animation + physics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // handle HiDPI and size
    function resizeCanvas() {
      const parent = canvas.parentElement;
      const w = Math.min(1000, Math.max(320, parent ? parent.clientWidth - 8 : window.innerWidth - 40));
      const h = Math.round(Math.max(260, Math.min(720, w * 0.6)));
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // initialize sim
    function resetSimInternal() {
      thetaRef.current = (initAngleDeg * Math.PI) / 180;
      thetaVelRef.current = 0;
      simTRef.current = 0;
      dataRef.current = [];
      crossingsRef.current = [];
      setMeasuredPeriod(null);
      setSimTime(0);
      setStatusMsg(running ? "Running..." : "Paused");
    }
    resetSimInternal();

    // physics integrator (fixed-step)
    const fixedDt = 1 / 120; // smaller dt for better zero-cross detection
    let accumulator = 0;
    let lastTime = performance.now();

    function step(now) {
      const elapsed = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      if (running) {
        accumulator += elapsed;
        while (accumulator >= fixedDt) {
          // physics: theta'' = -(g / L) * sin(theta) - damping * theta'
          const theta = thetaRef.current;
          const vel = thetaVelRef.current;
          const acc = -(gravity / length) * Math.sin(theta) - damping * vel;
          const newVel = vel + acc * fixedDt;
          const newTheta = theta + newVel * fixedDt;
          thetaVelRef.current = newVel;
          thetaRef.current = newTheta;

          simTRef.current += fixedDt;

          // detect zero crossing (sign change) using previous angle (if exists)
          const prev = dataRef.current.length ? (dataRef.current[dataRef.current.length - 1].angleDeg * Math.PI) / 180 : null;
          if (prev !== null && prev * newTheta < 0) {
            const crossingTime = simTRef.current;
            crossingsRef.current.push(crossingTime);
            if (crossingsRef.current.length > 12) crossingsRef.current.shift();
            if (crossingsRef.current.length >= 4) {
              const arr = crossingsRef.current;
              const periods = [];
              for (let i = 2; i < arr.length; i++) periods.push(arr[i] - arr[i - 2]);
              const avg = periods.reduce((a, b) => a + b, 0) / periods.length;
              setMeasuredPeriod(avg);
            }
          }

          // store data (cap size)
          dataRef.current.push({ t: simTRef.current, angleDeg: (thetaRef.current * 180) / Math.PI });
          if (dataRef.current.length > 3000) dataRef.current.shift();

          accumulator -= fixedDt;
        }
      }
      draw(ctx, canvas);
      setSimTime(simTRef.current);
      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
    // re-run when physics parameters or running change; effect depends on them in signature below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, length, gravity, damping, initAngleDeg]);

  // draw helper
  function draw(ctx, canvas) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    // background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, w, h);

    // compute drawing positions
    const cx = w / 2;
    const cy = Math.round(h * 0.08) + 6;
    const scaledPixelPerMeter = Math.max(60, Math.min(260, (w * 0.38) / Math.max(length, 0.2)));

    const theta = thetaRef.current;
    const x = cx + scaledPixelPerMeter * length * Math.sin(theta);
    const y = cy + scaledPixelPerMeter * length * Math.cos(theta);

    // rod
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.stroke();

    // bob
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // pivot
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();

    // overlay text
    ctx.fillStyle = "#0f172a";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Time: ${simTRef.current.toFixed(2)} s`, 12, 18);
    ctx.fillText(`Angle: ${(theta * 180 / Math.PI).toFixed(2)}°`, 12, 36);
    ctx.fillText(`Theoretical T: ${theoreticalPeriod.toFixed(3)} s`, 12, 54);
    ctx.fillText(`Measured T: ${measuredPeriod ? measuredPeriod.toFixed(3) + " s" : "—"}`, 12, 72);
    ctx.fillText(`Uncertainty: ±${uncertainty} s`, 12, 90);

    // ruler overlay (vertical) if enabled
    if (showRuler) {
      const left = 20;
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(left, cy - 10);
      ctx.lineTo(left, cy + scaledPixelPerMeter * length + 40);
      ctx.stroke();
      // ticks every 0.5m
      ctx.fillStyle = "#374151";
      for (let m = 0; m <= Math.ceil(length * 2); m++) {
        const ytick = cy + m * (scaledPixelPerMeter * 0.5);
        ctx.fillRect(left - 4, ytick - 1, 8, 2);
        ctx.fillText(`${(m * 0.5).toFixed(1)} m`, left - 46, ytick + 4);
      }
    }

    // protractor overlay if enabled (semi-transparent at pivot)
    if (showProtractor) {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.fillStyle = "#fde68a";
      ctx.arc(cx, cy, 80, -Math.PI / 2 - Math.PI / 2, -Math.PI / 2 + Math.PI / 2);
      ctx.fill();
      ctx.restore();
      // draw angle marker
      ctx.beginPath();
      ctx.strokeStyle = "#b91c1c";
      ctx.lineWidth = 2;
      ctx.moveTo(cx, cy);
      const angX = cx + 60 * Math.sin(theta);
      const angY = cy + 60 * Math.cos(theta);
      ctx.lineTo(angX, angY);
      ctx.stroke();
    }

    // mini plot angle vs time (bottom right)
    drawMiniPlot(ctx, w, h);
  }

  function drawMiniPlot(ctx, w, h) {
    const plotW = Math.min(320, Math.round(w * 0.36));
    const plotH = Math.min(140, Math.round(h * 0.22));
    const plotX = w - plotW - 12;
    const plotY = h - plotH - 12;

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#e6eef8";
    ctx.lineWidth = 1;
    ctx.fillRect(plotX, plotY, plotW, plotH);
    ctx.strokeRect(plotX, plotY, plotW, plotH);

    const pts = dataRef.current;
    const maxPoints = 240;
    const start = Math.max(0, pts.length - maxPoints);
    ctx.beginPath();
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2;
    for (let i = start; i < pts.length; i++) {
      const idx = i - start;
      const px = plotX + (idx / Math.max(1, maxPoints - 1)) * plotW;
      const maxAng = 60;
      const vy = plotY + plotH / 2 - (pts[i].angleDeg / maxAng) * (plotH / 2);
      if (i === start) ctx.moveTo(px, vy);
      else ctx.lineTo(px, vy);
    }
    ctx.stroke();

    ctx.fillStyle = "#0f172a";
    ctx.font = "11px sans-serif";
    ctx.fillText("Angle (deg) vs time", plotX + 6, plotY + plotH - 8);
  }

  // draggable bob handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = () => canvas.getBoundingClientRect();

    function getMouseAngle(mouseX, mouseY) {
      const r = rect();
      const cx = r.left + canvas.clientWidth / 2;
      const cy = r.top + canvas.clientHeight * 0.08 + 6;
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      const ang = Math.atan2(dx, dy); // note swapped for pendulum convention
      return ang;
    }

    function onPointerDown(e) {
      const p = e.touches ? e.touches[0] : e;
      const mx = p.clientX;
      const my = p.clientY;
      // if click near bob (distance)
      const cx = rect().left + canvas.clientWidth / 2;
      const cy = rect().top + canvas.clientHeight * 0.08 + 6;
      const bobX = cx + (canvas.clientWidth * 0.38 / Math.max(length, 0.2)) * length * Math.sin(thetaRef.current);
      const bobY = cy + (canvas.clientWidth * 0.38 / Math.max(length, 0.2)) * length * Math.cos(thetaRef.current);
      const distSq = (mx - bobX) * (mx - bobX) + (my - bobY) * (my - bobY);
      if (distSq < 36 * 4) {
        draggingRef.current = true;
        setRunning(false); // pause while dragging
      }
    }

    function onPointerMove(e) {
      if (!draggingRef.current) return;
      const p = e.touches ? e.touches[0] : e;
      const ang = getMouseAngle(p.clientX, p.clientY);
      // control angle limits to [-pi, pi]
      thetaRef.current = ang;
      thetaVelRef.current = 0;
      // update displayed initial angle (in UI)
      setInitAngleDeg((ang * 180) / Math.PI);
      // also clear data (so measured period restarts)
      dataRef.current = [];
      crossingsRef.current = [];
      setMeasuredPeriod(null);
    }

    function onPointerUp() {
      if (draggingRef.current) {
        draggingRef.current = false;
        // resume running if previously running
        setTimeout(() => setRunning(true), 50);
      }
    }

    canvas.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    // touch support
    canvas.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    return () => {
      canvas.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      canvas.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
    };
  }, [length]);

  // manual stopwatch controls
  function swStartStop() {
    if (stopwatchRunning) {
      // stop
      setStopwatchRunning(false);
      // capture paused elapsed
      stopwatchRef.current.elapsed = Number(stopwatchDisplay);
    } else {
      setStopwatchRunning(true);
    }
  }
  function swLap() {
    if (!stopwatchRunning) return;
    const now = Number(stopwatchDisplay);
    setLaps((s) => [...s, now]);
  }
  function swReset() {
    setStopwatchRunning(false);
    stopwatchRef.current = { start: null, elapsed: 0 };
    setStopwatchDisplay("0.000");
    setLaps([]);
  }
  function recordManualMeasurement(note = "") {
    // use the last stopwatch value as measured period
    const t = Number(stopwatchDisplay);
    if (!t || t <= 0) return;
    setManualMeasurements((m) => [...m, { time: t, note }]);
  }

  // sweep: perform a fast, non-rendering simulation to estimate measured period for many lengths
  async function runSweep() {
    setSweepRunning(true);
    const results = [];
    const steps = Math.max(2, Math.floor(sweepSteps));
    for (let i = 0; i < steps; i++) {
      const L = sweepStart + (i / (steps - 1)) * (sweepEnd - sweepStart);
      // simulate quickly: we'll run physics until we have N zero crossings and take avg
      const T = await simulatePeriodForLength(L, gravity, damping, (initAngleDeg * Math.PI) / 180, 6);
      results.push({ L, T });
      // update UI progressively
      setSweepResults((r) => [...r, { L, T }]);
      // small delay to keep UI responsive
      await new Promise((res) => setTimeout(res, 80));
    }
    setSweepResults(results);
    setSweepRunning(false);
  }

  // fast simulation (no rendering) that returns measured period from zero crossings
  function simulatePeriodForLength(L, g, c, theta0, neededCrossings = 6) {
    return new Promise((resolve) => {
      // fixed-step integrator
      const dt = 1 / 200;
      let theta = theta0;
      let vel = 0;
      let t = 0;
      const crossings = [];
      const maxSim = 60; // seconds hard cap
      while (t < maxSim && crossings.length < neededCrossings) {
        const acc = -(g / L) * Math.sin(theta) - c * vel;
        vel += acc * dt;
        theta += vel * dt;
        t += dt;
        // detect sign change
        // Instead simpler: store previous theta separately
        if (!simulatePeriodForLength.prevTheta) simulatePeriodForLength.prevTheta = theta;
        const prevTheta = simulatePeriodForLength.prevTheta;
        if (prevTheta * theta < 0) {
          crossings.push(t);
          if (crossings.length > 12) crossings.shift();
        }
        simulatePeriodForLength.prevTheta = theta;
        // safety
        if (t > 30 && crossings.length === 0) break;
      }
      // compute average period from alternate crossings if possible
      let measured = null;
      if (crossings.length >= 4) {
        const periods = [];
        for (let i = 2; i < crossings.length; i++) periods.push(crossings[i] - crossings[i - 2]);
        const avg = periods.reduce((a, b) => a + b, 0) / periods.length;
        measured = avg;
      } else {
        // fallback: compute using small-angle theory if no data
        measured = 2 * Math.PI * Math.sqrt(L / g);
      }
      // clean static prev
      simulatePeriodForLength.prevTheta = null;
      resolve(measured);
    });
  }

  // linear fit: fit T vs sqrt(L) -> T = a * sqrt(L) + b
  function fitTSqrtL(results) {
    if (!results || results.length === 0) return null;
    // x = sqrt(L), y = T
    const xs = results.map((r) => Math.sqrt(r.L));
    const ys = results.map((r) => r.T);
    const n = xs.length;
    const meanX = xs.reduce((a, b) => a + b, 0) / n;
    const meanY = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0,
      den = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - meanX) * (ys[i] - meanY);
      den += (xs[i] - meanX) * (xs[i] - meanX);
    }
    const a = den === 0 ? 0 : num / den;
    const b = meanY - a * meanX;
    return { a, b };
  }

  // draw sweep plot (small) on a separate canvas inside a div
  function renderSweepPlot(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    const pts = sweepResults;
    if (!pts || pts.length === 0) return;
    const xs = pts.map((p) => Math.sqrt(p.L));
    const ys = pts.map((p) => p.T);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const margin = 36;
    // axes
    ctx.strokeStyle = "#cbd5e1";
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, h - margin);
    ctx.lineTo(w - margin, h - margin);
    ctx.stroke();
    // points
    ctx.fillStyle = "#2563eb";
    pts.forEach((p) => {
      const xVal = Math.sqrt(p.L);
      const yVal = p.T;
      const x = margin + ((xVal - minX) / (maxX - minX || 1)) * (w - margin * 2);
      const y = h - margin - ((yVal - minY) / (maxY - minY || 1)) * (h - margin * 2);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    // fit line
    const fit = fitTSqrtL(pts);
    if (fit) {
      const x1 = minX;
      const x2 = maxX;
      const y1 = fit.a * x1 + fit.b;
      const y2 = fit.a * x2 + fit.b;
      const sx1 = margin + ((x1 - minX) / (maxX - minX || 1)) * (w - margin * 2);
      const sx2 = margin + ((x2 - minX) / (maxX - minX || 1)) * (w - margin * 2);
      const sy1 = h - margin - ((y1 - minY) / (maxY - minY || 1)) * (h - margin * 2);
      const sy2 = h - margin - ((y2 - minY) / (maxY - minY || 1)) * (h - margin * 2);
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.lineTo(sx2, sy2);
      ctx.stroke();
      // annotate fit
      ctx.fillStyle = "#0f172a";
      ctx.font = "12px sans-serif";
      ctx.fillText(`T ≈ ${fit.a.toFixed(3)}√L + ${fit.b.toFixed(3)}`, margin + 6, margin + 12);
    }
  }

  // save run snapshot
  function saveRun(name = `run_${Date.now()}`) {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const snapshot = {
      name,
      date: new Date().toISOString(),
      params: { length, gravity, damping, initAngleDeg, uncertainty },
      data: dataRef.current.slice(-2000),
      measuredPeriod,
      manualMeasurements,
      sweepResults,
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
    alert("Saved runs cleared");
  }

  // export report: open printable page in new window
  function exportReport() {
    const html = generateReportHTML();
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) {
      alert("Pop-up blocked. Allow pop-ups to open the printable report.");
      return;
    }
    w.document.write(html);
    w.document.close();
  }

  function generateReportHTML() {
    const measured = measuredPeriod ? measuredPeriod.toFixed(4) : "—";
    const csvSnippet = dataRef.current.slice(-200).map((r) => `${r.t.toFixed(4)},${r.angleDeg.toFixed(4)}`).join("\n");
    const fit = fitTSqrtL(sweepResults);
    return `
      <html><head><title>OpenLabs - Simple Pendulum Report</title>
      <style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;color:#111}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px}</style>
      </head><body>
      <h1>OpenLabs - Simple Pendulum Report</h1>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <h2>Parameters</h2>
      <ul>
        <li>Length: ${length} m</li>
        <li>Gravity: ${gravity} m/s²</li>
        <li>Damping: ${damping}</li>
        <li>Initial angle: ${initAngleDeg}°</li>
        <li>Uncertainty: ±${uncertainty} s</li>
      </ul>
      <h2>Results</h2>
      <p>Theoretical period: <strong>${theoreticalPeriod.toFixed(4)} s</strong></p>
      <p>Measured period: <strong>${measured}</strong> s</p>
      <h3>Manual measurements</h3>
      <pre>${manualMeasurements.map(m=>m.time + " s  " + (m.note||"")).join("\n")}</pre>
      <h3>Sweep results (last ${sweepResults.length}):</h3>
      <pre>${sweepResults.map(r=>`L=${r.L.toFixed(3)} m  T=${r.T.toFixed(4)} s`).join("\n")}</pre>
      <p>Fit: ${fit ? `T ≈ ${fit.a.toFixed(4)}√L + ${fit.b.toFixed(4)}` : "—"}</p>
      <h3>Time vs Angle (last 200 points)</h3>
      <pre>time_s,angle_deg\n${csvSnippet}</pre>
      <hr/>
      <p><em>Generated by OpenLabs</em></p>
      <button onclick="window.print()">Print / Save as PDF</button>
      </body></html>
    `;
  }

  // export CSV / JSON
  function exportCSVAll() {
    const rows = [["time_s", "angle_deg"], ...dataRef.current.map((r) => [r.t.toFixed(4), r.angleDeg.toFixed(4)])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pendulum_data_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function exportJSON() {
    const obj = {
      params: { length, gravity, damping, initAngleDeg, uncertainty },
      measuredPeriod,
      data: dataRef.current.slice(-2000),
      manualMeasurements,
      sweepResults,
      date: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pendulum_run_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // small helper: clear sweep results
  useEffect(() => {
    // if sweepResults change, update tiny plot canvas if exists
    const el = document.getElementById("sweep-plot-canvas");
    if (el) renderSweepPlot(el);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sweepResults]);

  // UI
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Simple Pendulum — Virtual Lab</h2>
        <div className="text-sm text-gray-600">Do the experiment like in a real lab: drag the bob, time oscillations, sweep lengths, export reports.</div>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Controls */}
        <div className="md:col-span-1 bg-white p-4 rounded shadow space-y-3">
          <h3 className="font-semibold">Experiment Controls</h3>

          <label className="block text-sm">Length (m)</label>
          <input type="range" min="0.2" max="5" step="0.01" value={length} onChange={(e) => setLength(Number(e.target.value))} />
          <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1" />

          <label className="block text-sm">Gravity (m/s²)</label>
          <input type="range" min="0.1" max="20" step="0.01" value={gravity} onChange={(e) => setGravity(Number(e.target.value))} />
          <input type="number" value={gravity} onChange={(e) => setGravity(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1" />

          <label className="block text-sm">Damping (viscous)</label>
          <input type="range" min="0" max="0.2" step="0.001" value={damping} onChange={(e) => setDamping(Number(e.target.value))} />
          <input type="number" value={damping} onChange={(e) => setDamping(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1" />

          <label className="block text-sm">Initial angle (°) — drag bob or change</label>
          <input type="range" min="-90" max="90" step="0.1" value={initAngleDeg} onChange={(e) => { setInitAngleDeg(Number(e.target.value)); thetaRef.current = (Number(e.target.value) * Math.PI) / 180; thetaVelRef.current = 0; dataRef.current = []; crossingsRef.current = []; setMeasuredPeriod(null); }} />
          <input type="number" value={initAngleDeg} onChange={(e) => { setInitAngleDeg(Number(e.target.value)); thetaRef.current = (Number(e.target.value) * Math.PI) / 180; thetaVelRef.current = 0; }} className="mt-1 w-full border rounded px-2 py-1" />

          <div className="flex gap-2 mt-2">
            <button onClick={() => { setRunning((r) => !r); setStatusMsg(running ? "Paused" : "Running..."); }} className="flex-1 py-2 rounded bg-blue-600 text-white">{running ? "Pause" : "Start"}</button>
            <button onClick={() => { thetaRef.current = (initAngleDeg * Math.PI) / 180; thetaVelRef.current = 0; dataRef.current = []; crossingsRef.current = []; setMeasuredPeriod(null); setSimTime(0); }} className="flex-1 py-2 rounded bg-gray-200">Reset</button>
          </div>

          <label className="block text-sm mt-2">Measurement uncertainty (s)</label>
          <input type="number" step="0.001" value={uncertainty} onChange={(e) => setUncertainty(Number(e.target.value))} className="w-full border rounded px-2 py-1" />

          <div className="mt-2 text-sm">
            <div>Theoretical period: <strong>{theoreticalPeriod.toFixed(4)} s</strong></div>
            <div>Measured period: <strong>{measuredPeriod ? measuredPeriod.toFixed(4) + " s" : "—"}</strong></div>
            <div className="text-xs text-gray-500">Sim time: {simTime.toFixed(2)} s</div>
            <div className="text-xs text-gray-500">Status: {statusMsg}</div>
          </div>

          <div className="mt-3 space-y-1">
            <label className="inline-flex items-center">
              <input type="checkbox" checked={showRuler} onChange={(e)=>setShowRuler(e.target.checked)} className="mr-2" /> Show ruler
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" checked={showProtractor} onChange={(e)=>setShowProtractor(e.target.checked)} className="mr-2" /> Show protractor
            </label>
          </div>
        </div>

        {/* Canvas + mini controls */}
        <div className="md:col-span-2 bg-white p-3 rounded shadow space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <strong>Interactive Pendulum</strong>
              <div className="text-xs text-gray-500">Drag bob to set initial angle. Click play/pause to run.</div>
            </div>
            <div className="text-sm">
              <button onClick={exportCSVAll} className="mr-2 px-3 py-1 bg-green-600 text-white rounded">Export CSV</button>
              <button onClick={exportJSON} className="mr-2 px-3 py-1 bg-yellow-400 rounded">Export JSON</button>
              <button onClick={exportReport} className="px-3 py-1 bg-indigo-600 text-white rounded">Printable Report</button>
            </div>
          </div>

          <div className="w-full min-h-[260px] md:min-h-[360px]">
            <canvas ref={canvasRef} className="w-full rounded-md" />
          </div>

          {/* stopwatch + manual measurement */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm font-medium">Stopwatch (manual timing)</div>
              <div className="text-2xl font-mono my-2">{stopwatchDisplay}s</div>
              <div className="flex gap-2">
                <button onClick={swStartStop} className="flex-1 py-1 rounded bg-blue-600 text-white">{stopwatchRunning ? "Stop" : "Start"}</button>
                <button onClick={swLap} className="py-1 px-3 rounded bg-gray-200">Lap</button>
                <button onClick={swReset} className="py-1 px-3 rounded bg-gray-200">Reset</button>
              </div>
              <div className="mt-2 text-xs">Laps: {laps.length}</div>
              <div className="mt-2">
                <button onClick={()=>recordManualMeasurement()} className="w-full py-1 rounded bg-green-600 text-white">Record Manual Measurement</button>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm font-medium">Manual Measurements</div>
              <div className="text-xs text-gray-500">Times recorded by stopwatch</div>
              <ul className="mt-2 max-h-36 overflow-auto text-sm">
                {laps.concat(manualMeasurements.map(m=>m.time)).map((t,i)=>(
                  <li key={i} className="flex justify-between"><span>#{i+1}</span><span>{(typeof t === 'object' ? t.time : t).toFixed(3)} s</span></li>
                ))}
              </ul>
              <div className="mt-2">
                <button onClick={()=>{ setManualMeasurements(m=>{ const t=Number(stopwatchDisplay); if(!t) return m; return [...m,{time:t,note:"manual"}] })}} className="w-full py-1 rounded bg-indigo-600 text-white">Add stopwatch value</button>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm font-medium">Saved Runs</div>
              <div className="mt-2">
                <button onClick={()=>saveRun()} className="w-full py-1 rounded bg-orange-500 text-white mb-2">Save Current Run</button>
                <button onClick={()=>{ const runs=loadRuns(); if(runs.length===0) alert('No saved runs'); else alert('Saved runs: \\n' + runs.map(r=>r.name + ' - ' + r.date).join('\\n')) }} className="w-full py-1 rounded bg-gray-200 mb-2">List Saved Runs</button>
                <button onClick={()=>clearSavedRuns()} className="w-full py-1 rounded bg-red-500 text-white">Clear Saved Runs</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sweep controls */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Length Sweep — Auto-measure T vs √L</h3>
        <div className="grid md:grid-cols-6 gap-2 items-end">
          <div>
            <label className="block text-xs">Start L (m)</label>
            <input type="number" step="0.01" value={sweepStart} onChange={(e)=>setSweepStart(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-xs">End L (m)</label>
            <input type="number" step="0.01" value={sweepEnd} onChange={(e)=>setSweepEnd(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-xs">Steps</label>
            <input type="number" min="2" step="1" value={sweepSteps} onChange={(e)=>setSweepSteps(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-xs">Init angle (°)</label>
            <input type="number" step="0.1" value={initAngleDeg} onChange={(e)=>setInitAngleDeg(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <button onClick={()=>{ setSweepResults([]); runSweep(); }} disabled={sweepRunning} className="w-full py-2 rounded bg-indigo-600 text-white">{sweepRunning ? "Running..." : "Run Sweep"}</button>
          </div>
          <div>
            <button onClick={()=>{ setSweepResults([]); }} className="w-full py-2 rounded bg-gray-200">Clear</button>
          </div>
        </div>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm">Sweep Results</div>
            <div className="mt-2 max-h-40 overflow-auto text-sm">
              {sweepResults.length===0 ? (
                <div className="text-xs text-gray-500">No results yet</div>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b border-gray-200 text-left p-2">L (m)</th>
                      <th className="border-b border-gray-200 text-left p-2">T (s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sweepResults.map((r, i) => (
                      <tr key={i}>
                        <td className="p-2">{r.L.toFixed(3)}</td>
                        <td className="p-2">{r.T.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div>
            <div className="text-sm">Sweep Plot (T vs √L)</div>
            <div className="mt-2 h-48">
              <canvas id="sweep-plot-canvas" className="w-full h-full border border-gray-200 rounded-md" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Fit: {(() => { const fit = fitTSqrtL(sweepResults); return fit ? `T ≈ ${fit.a.toFixed(4)}√L + ${fit.b.toFixed(4)}` : "—"; })()}
            </div>
          </div>
        </div>
      </div>

      {/* Lab instructions */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Lab Instructions</h3>
        <ol className="list-decimal list-inside text-sm mt-2">
          <li>Drag the bob or set the initial angle, then press Start.</li>
          <li>Use the stopwatch to manually time several oscillations, record times as laps.</li>
          <li>Compare measured period (auto) with theoretical T = 2π√(L/g).</li>
          <li>Run a length sweep to measure T for different L and generate T vs √L plot.</li>
          <li>Export CSV/JSON or open the printable report for submission.</li>
        </ol>
      </div>
    </div>
  );
}
