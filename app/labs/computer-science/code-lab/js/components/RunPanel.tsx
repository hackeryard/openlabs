'use client';

import { AlertTriangle, XCircle } from 'lucide-react';

interface RunPanelProps {
  error?: string;
  note?: string;
}

export default function RunPanel({ error, note }: RunPanelProps) {
  if (!error && !note) return null;

  if (error) {
    return (
      <div className="flex items-start gap-2 px-3 py-2.5 border-b border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10">
        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
        <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed font-mono">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 px-3 py-2.5 border-b border-amber-500/30 bg-amber-500/10">
      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
      <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">{note}</p>
    </div>
  );
}
