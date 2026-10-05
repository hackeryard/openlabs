// app/components/physics/general-relativity/TheoryModal.tsx
"use client";

import React, { useState } from "react";
import {
  X,
  BookOpen,
  Award,
  Sparkles,
  Layers,
  Atom,
  Clock,
  Compass,
  Radio,
  Eye,
  Waves,
  Cpu,
} from "lucide-react";

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TheoryModal({ isOpen, onClose }: TheoryModalProps) {
  const [activeChapter, setActiveChapter] = useState<number>(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                General Relativity & Spacetime Mechanics Handbook
              </h2>
              <p className="text-xs text-muted-foreground">
                Mathematical Foundations, Exact Field Solutions & Relativistic Astrodynamics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chapter Tabs */}
        <div className="flex items-center border-b border-border bg-muted/30 px-4 overflow-x-auto no-scrollbar gap-1 py-1.5 text-xs">
          {[
            { id: 1, title: "1. Equivalence Principle", icon: Compass },
            { id: 2, title: "2. Field Equations", icon: Cpu },
            { id: 3, title: "3. Schwarzschild Metric", icon: Layers },
            { id: 4, title: "4. Kerr & Ergosphere", icon: Atom },
            { id: 5, title: "5. Empirical Proofs", icon: Award },
            { id: 6, title: "6. Gravitational Waves", icon: Waves },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeChapter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveChapter(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-card text-foreground font-semibold shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-sky-400" : ""}`} />
                {tab.title}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-sm text-foreground space-y-4 leading-relaxed">
          {activeChapter === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20">
                <h3 className="font-bold text-sky-400 text-base mb-1">
                  The Einstein Equivalence Principle (EEP)
                </h3>
                <p className="text-xs text-muted-foreground">
                  In 1907, Albert Einstein had what he described as the "happiest thought of my life": for an observer falling freely from the roof of a house, there exists no gravitational field during the fall.
                </p>
              </div>

              <h4 className="font-bold text-foreground">1. Weak Equivalence Principle (WEP)</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Inertial mass (m_i in F = m_i a) and gravitational mass (m_g in F = G M m_g / r²) are identically equal: <strong>m_i ≡ m_g</strong> to at least 1 part in 10¹⁵ (verified by the MICROSCOPE satellite in 2022). Consequently, all bodies fall with the exact same acceleration in a vacuum, regardless of composition.
              </p>

              <h4 className="font-bold text-foreground">2. Einstein's Elevator Thought Experiment</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                No local experiment performed inside a closed, windowless laboratory can distinguish between uniform acceleration in flat Minkowski spacetime (with proper acceleration a = g) and being at rest in a static gravitational field with acceleration due to gravity g.
              </p>

              <div className="p-3 rounded-xl bg-muted/60 border border-border text-center font-mono text-xs">
                Uniform Acceleration (a) ⟺ Static Gravitational Field (g)
              </div>

              <h4 className="font-bold text-foreground">3. Gravity as Spacetime Curvature</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Because all test particles follow identical trajectories regardless of mass, gravity cannot be a standard force field like electromagnetism. Instead, gravity is the manifestation of the <strong>geometry of four-dimensional spacetime itself</strong>. Freely falling particles follow the straightest possible paths through curved spacetime, known as <strong>geodesics</strong>.
              </p>
            </div>
          )}

          {activeChapter === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <h3 className="font-bold text-amber-400 text-base mb-1">
                  The Einstein Field Equations (EFE)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Formulated in November 1915, these ten coupled nonlinear partial differential equations relate the local geometry of spacetime to the local matter-energy density.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-border text-center font-mono text-sm sm:text-base font-bold text-sky-400">
                G_μν + Λ g_μν = (8πG / c⁴) T_μν
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-muted/40 border border-border">
                  <strong className="text-sky-400 block mb-1">Geometric Side (Left):</strong>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>G_μν:</strong> Einstein Tensor (R_μν - ½ R g_μν)</li>
                    <li><strong>R_μν:</strong> Ricci Curvature Tensor</li>
                    <li><strong>R:</strong> Ricci Curvature Scalar</li>
                    <li><strong>g_μν:</strong> 4×4 Spacetime Metric Tensor</li>
                    <li><strong>Λ:</strong> Cosmological Constant (Dark Energy)</li>
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-muted/40 border border-border">
                  <strong className="text-amber-400 block mb-1">Matter-Energy Side (Right):</strong>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>T_μν:</strong> Stress-Energy-Momentum Tensor</li>
                    <li><strong>T₀₀:</strong> Relativistic Energy Density (ρ c²)</li>
                    <li><strong>T₀ᵢ:</strong> Energy Flux / Momentum Density</li>
                    <li><strong>T_ij:</strong> Shear Stress and Isotropic Pressure (p)</li>
                    <li><strong>8πG/c⁴:</strong> Einstein Gravitational Constant</li>
                  </ul>
                </div>
              </div>

              <h4 className="font-bold text-foreground">John Wheeler's Famous Dictum:</h4>
              <blockquote className="border-l-4 border-sky-400 pl-4 py-1 italic text-muted-foreground text-xs">
                "Spacetime tells matter how to move; matter tells spacetime how to curve."
              </blockquote>
            </div>
          )}

          {activeChapter === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <h3 className="font-bold text-purple-400 text-base mb-1">
                  The Schwarzschild Metric (1916)
                </h3>
                <p className="text-xs text-muted-foreground">
                  The first exact analytical solution to the Einstein field equations, discovered by Karl Schwarzschild while serving on the Russian front in World War I.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-border text-center font-mono text-xs sm:text-sm font-bold text-purple-300">
                ds² = -(1 - r_s/r) c²dt² + (1 - r_s/r)⁻¹ dr² + r² (dθ² + sin²θ dφ²)
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <strong className="text-sky-400">1. Schwarzschild Radius (r_s = 2GM/c²):</strong>
                  <p className="text-muted-foreground mt-0.5">
                    For Earth, r_s ≈ 8.87 mm; for the Sun, r_s ≈ 2.95 km. The event horizon is a coordinate singularity in standard Schwarzschild coordinates, but physically smooth in Kruskal-Szekeres coordinates.
                  </p>
                </div>
                <div>
                  <strong className="text-amber-400">2. Photon Sphere (r = 1.5 r_s):</strong>
                  <p className="text-muted-foreground mt-0.5">
                    Unstable circular orbit where photons of light can orbit the black hole indefinitely. Any perturbation causes light to either escape to infinity or plunge across the event horizon.
                  </p>
                </div>
                <div>
                  <strong className="text-emerald-400">3. Innermost Stable Circular Orbit (ISCO = 3.0 r_s):</strong>
                  <p className="text-muted-foreground mt-0.5">
                    The closest distance a massive particle can execute a stable circular orbit. Inside 3 r_s, effective potential wells disappear, causing matter in accretion disks to plunge into the black hole.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <h3 className="font-bold text-rose-400 text-base mb-1">
                  The Kerr Metric & Ergosphere (1963)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Roy Kerr's groundbreaking solution for stationary, axisymmetric, uncharged rotating black holes with angular momentum J.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-foreground">1. Boyer-Lindquist Geometry</h4>
                <p className="text-muted-foreground">
                  Characterized by mass M and spin parameter a = J / (Mc). Real event horizons exist only for subcritical spins: <strong>a* = a/M ≤ 1.0</strong> (Thorne limit a* ≈ 0.998).
                </p>

                <h4 className="font-bold text-foreground">2. The Ergosphere & Static Limit</h4>
                <p className="text-muted-foreground">
                  The static limit lies at r_E(θ) = M + √(M² - a² cos²θ). Between r_E and the outer event horizon r_+, spacetime itself is dragged into corotation (frame dragging). Particles cannot remain stationary with respect to distant observers.
                </p>

                <h4 className="font-bold text-foreground">3. The Penrose Process</h4>
                <p className="text-muted-foreground">
                  Because g_00 flips sign inside the ergosphere, particles can enter negative-energy orbits relative to infinity. A particle splitting inside the ergosphere allows one fragment to fall into the hole with negative energy while the escaping fragment emerges with <strong>more energy than the parent particle had</strong>, extracting up to 29% of the black hole's rest mass!
                </p>
              </div>
            </div>
          )}

          {activeChapter === 5 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <h3 className="font-bold text-emerald-400 text-base mb-1">
                  Classic & Modern Observational Tests
                </h3>
                <p className="text-xs text-muted-foreground">
                  General Relativity has withstood every experimental test with extraordinary precision over more than a century.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-2.5 rounded-lg bg-card border border-border">
                  <strong className="text-foreground">1. Perihelion Advance of Mercury (1915)</strong>
                  <p className="text-muted-foreground mt-0.5">
                    Accounted for the residual 42.98 ± 0.04 arcsec/century advance that Newtonian gravitational perturbations by other planets could not explain.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-card border border-border">
                  <strong className="text-foreground">2. Eddington Solar Eclipse Expedition (1919)</strong>
                  <p className="text-muted-foreground mt-0.5">
                    Measured 1.75 arcsec light bending during a total solar eclipse, precisely confirming 4GM/(c²R) versus Newton's half-strength 2GM/(c²R).
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-card border border-border">
                  <strong className="text-foreground">3. Pound-Rebka Experiment (1959)</strong>
                  <p className="text-muted-foreground mt-0.5">
                    Used Mössbauer spectroscopy at Harvard University to verify gravitational redshift Δf/f = g h / c² across a height of 22.5 meters.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-card border border-border">
                  <strong className="text-foreground">4. Global Positioning System (1977–Present)</strong>
                  <p className="text-muted-foreground mt-0.5">
                    Direct engineering proof: GPS clocks drift by +38.7 microseconds/day (+45.9 μs/day GR blueshift minus 7.2 μs/day SR dilation).
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-card border border-border">
                  <strong className="text-foreground">5. Event Horizon Telescope (2019 & 2022)</strong>
                  <p className="text-muted-foreground mt-0.5">
                    Direct interferometric imaging of the photon shadow and accretion flow around M87* (6.5 billion M☉) and Sagittarius A* (4.15 million M☉).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 6 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20">
                <h3 className="font-bold text-sky-400 text-base mb-1">
                  Gravitational Waves & Spacetime Topology
                </h3>
                <p className="text-xs text-muted-foreground">
                  Ripples in the curvature of spacetime propagating at the speed of light, predicted by Einstein in 1916 and detected directly by LIGO in 2015.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-foreground">1. The Quadrupole Formula</h4>
                <p className="text-muted-foreground">
                  Unlike electromagnetic dipole radiation, gravitational radiation requires a time-varying mass quadrupole moment: P_GW = (G / 5 c⁵) ⟨(d³I_jk / dt³)²⟩.
                </p>

                <h4 className="font-bold text-foreground">2. GW150914: The First Direct Detection</h4>
                <p className="text-muted-foreground">
                  On September 14, 2015, LIGO detected the merger of two black holes (36 M☉ and 29 M☉) into a final rotating black hole (62 M☉). In the final 0.2 seconds, <strong>3.0 solar masses were converted directly into gravitational radiation</strong>, radiating more peak power than all stars in the observable universe combined.
                </p>

                <h4 className="font-bold text-foreground">3. Penrose-Carter Conformal Diagrams</h4>
                <p className="text-muted-foreground">
                  Using conformal coordinate mappings, infinite spacetime is represented within a finite geometric diamond where all light rays travel at 45° angles. This maps the causal boundaries: Future Null Infinity (ℐ⁺), Spatial Infinity (i⁰), and the spacelike Singularity (r = 0).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-card/80 flex items-center justify-between text-xs text-muted-foreground">
          <span>OpenLabs Theoretical Physics Series</span>
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            Close Handbook
          </button>
        </div>
      </div>
    </div>
  );
}
