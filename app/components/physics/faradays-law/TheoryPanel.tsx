"use client";

import React from "react";
import { BookOpen, Zap, Shield, Magnet, Compass, Layers } from "lucide-react";

export default function TheoryPanel() {
  return (
    <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-lg space-y-6 text-foreground">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
          <BookOpen size={22} />
        </div>
        <div>
          <h2 className="text-base font-black tracking-tight text-foreground">
            Theoretical Principles &amp; Mathematical Formulations
          </h2>
          <p className="text-xs text-muted-foreground">
            Classical Electromagnetism, Maxwell-Faraday equation, Lenz&apos;s conservation law, and mutual induction
          </p>
        </div>
      </div>

      {/* Grid Matrix of 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pillar 1: Faraday's Law */}
        <div className="p-4 rounded-2xl bg-muted/30 border border-border/80 space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wide">
            <Zap size={16} />
            1. Faraday&apos;s Law of Induction
          </div>
          <div className="p-3 bg-slate-950 rounded-xl font-mono text-center text-xs text-sky-400 border border-border">
            &Epsilon; = &minus;N &middot; (d&Phi;<sub>B</sub> / dt)
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The induced electromotive force (&Epsilon;) across a coil of <strong className="text-foreground">N turns</strong> is directly proportional to the negative time derivative of magnetic flux (&Phi;<sub>B</sub> = B &middot; A &middot; cos&theta;). Faster translation of the magnet or higher turn density scales voltage proportionally.
          </p>
        </div>

        {/* Pillar 2: Lenz's Law & Conservation */}
        <div className="p-4 rounded-2xl bg-muted/30 border border-border/80 space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wide">
            <Shield size={16} />
            2. Lenz&apos;s Law (Negative Sign)
          </div>
          <div className="p-3 bg-slate-950 rounded-xl font-mono text-center text-xs text-emerald-400 border border-border">
            B<sub>induced</sub> &oplus; (&minus;&Delta;&Phi;<sub>ext</sub>) &rArr; Energy Conservation
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The direction of any induced current creates a secondary magnetic field that opposes the initial change in magnetic flux that produced it. If this sign were positive, moving a magnet slightly would create runaway accelerating fields, violating the 1st law of thermodynamics.
          </p>
        </div>

        {/* Pillar 3: AC Dynamo Generator */}
        <div className="p-4 rounded-2xl bg-muted/30 border border-border/80 space-y-2">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wide">
            <Magnet size={16} />
            3. AC Dynamo &amp; Commutator Generator
          </div>
          <div className="p-3 bg-slate-950 rounded-xl font-mono text-center text-xs text-amber-400 border border-border">
            &Epsilon;(t) = N &middot; B &middot; A &middot; &omega; &middot; sin(&omega;t)
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Rotating an armature loop at angular velocity &omega; = 2&pi;f inside a uniform B-field modulates flux sinusoidally (&Phi; = BA cos &omega;t). Using <strong className="text-foreground">dual slip rings</strong> produces continuous AC; using a <strong className="text-foreground">split-ring commutator</strong> rectifies it into pulsing DC.
          </p>
        </div>

        {/* Pillar 4: Transformer & Mutual Inductance */}
        <div className="p-4 rounded-2xl bg-muted/30 border border-border/80 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wide">
            <Layers size={16} />
            4. Mutual Inductance &amp; Transformers
          </div>
          <div className="p-3 bg-slate-950 rounded-xl font-mono text-center text-xs text-purple-400 border border-border">
            (V<sub>s</sub> / V<sub>p</sub>) = (N<sub>s</sub> / N<sub>p</sub>) = (I<sub>p</sub> / I<sub>s</sub>)
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            An alternating current in the primary coil establishes a time-varying magnetic flux channeled through the laminated soft-iron core, inducing a proportional voltage in the secondary coil according to turns ratio N<sub>s</sub> / N<sub>p</sub>.
          </p>
        </div>
      </div>

      {/* Maxwell-Faraday Equation Box */}
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
        <span className="text-[10px] font-black uppercase text-primary font-mono tracking-wider">
          Maxwell-Faraday Differential Form:
        </span>
        <div className="p-2 bg-slate-950 rounded-xl font-mono text-xs text-center text-sky-400 border border-border">
          &nabla; &times; E = &minus; &part;B / &part;t &emsp;&hArr;&emsp; &oint; E &middot; dl = &minus; d/dt &iint; B &middot; dA
        </div>
        <p className="text-xs text-muted-foreground">
          A time-dependent magnetic field acts as a source for a non-conservative, curly electric field with non-zero line integral (&oint; E &middot; dl &ne; 0), driving charge carriers through closed conducting loops.
        </p>
      </div>
    </div>
  );
}
