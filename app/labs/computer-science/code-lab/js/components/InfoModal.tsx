'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X, Keyboard, Info } from 'lucide-react';

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
}

// All the static help content (previously a permanently-stacked
// "Settings" tab): about-copy, keyboard shortcuts, free-form API list,
// and the color legend. Runtime info never lives here — the dashboard
// must show all of that inline.
export default function InfoModal({ open, onClose }: InfoModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl">
          <div className="flex items-start justify-between gap-3 mb-4">
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <Info className="w-4 h-4 text-primary" />
              About this simulation
            </DialogTitle>
            <button
              onClick={onClose}
              className="shrink-0 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
            <p>
              This is a conceptual model of the JavaScript event loop, not a literal engine trace.
              It&apos;s built to teach execution order — Call Stack, Web APIs, Microtask Queue,
              Macrotask Queue, and how the event loop hands off between them — not to replicate V8
              internals exactly. Use a preset example to see a scripted trace, or switch to
              free-form mode to write and run your own JavaScript.
            </p>

            <div>
              <h4 className="flex items-center gap-1.5 text-sm font-bold text-foreground mb-2">
                <Keyboard className="w-3.5 h-3.5" />
                Keyboard shortcuts
              </h4>
              <ul className="space-y-1">
                <li><Kbd>←</Kbd> / <Kbd>→</Kbd> step backward / forward</li>
                <li><Kbd>Space</Kbd> play / pause</li>
                <li><Kbd>R</Kbd> reset to the start</li>
                <li><Kbd>Ctrl/Cmd + Enter</Kbd> run your code (free-form mode)</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-foreground mb-2">Free-form mode: available APIs</h4>
              <p className="mb-2">
                Beyond the basics (console, setTimeout/setInterval, Promise, async/await,
                queueMicrotask), your code can also use:
              </p>
              <ul className="space-y-1 font-mono">
                <li><code className="text-foreground">fetch(url)</code> — fully simulated, ~300ms latency, no real request</li>
                <li><code className="text-foreground">requestAnimationFrame(fn)</code> / <code className="text-foreground">cancelAnimationFrame(id)</code></li>
                <li><code className="text-foreground">requestIdleCallback(fn)</code> / <code className="text-foreground">cancelIdleCallback(id)</code></li>
                <li><code className="text-foreground">button.addEventListener(type, fn)</code> / <code className="text-foreground">button.click()</code> — simulates a user click from your own code</li>
                <li><code className="text-foreground">process.nextTick(fn)</code> / <code className="text-foreground">setImmediate(fn)</code> — Node runtime mode only</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-foreground mb-2">Color legend</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                <LegendItem color="bg-blue-500" label="Call Stack" />
                <LegendItem color="bg-violet-500" label="Web APIs" />
                <LegendItem color="bg-emerald-500" label="Microtask Queue" />
                <LegendItem color="bg-amber-500" label="Macrotask Queue" />
                <LegendItem color="bg-rose-500" label="rAF Queue" />
                <LegendItem color="bg-teal-500" label="Node Queues" />
                <LegendItem color="bg-indigo-500" label="Event Loop" />
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px] text-foreground">
      {children}
    </kbd>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-[11px] font-medium">{label}</span>
    </span>
  );
}
