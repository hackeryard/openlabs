"use client";

import React from "react";
import { ComponentType } from "./engine";
import {
  Battery,
  Zap,
  Activity,
  ToggleLeft,
  ActivitySquare,
  Monitor,
  Lightbulb,
  MousePointer2,
  Trash2,
  Settings2,
  ShieldAlert,
  Layers,
  Sparkles,
  Gauge,
  Keyboard,
} from "lucide-react";

interface ComponentTrayProps {
  selectedTool: ComponentType | 'select' | 'delete' | 'probe_red' | 'probe_black';
  onSelectTool: (tool: ComponentType | 'select' | 'delete' | 'probe_red' | 'probe_black') => void;
  isMultimeterOpen: boolean;
  onToggleMultimeter: () => void;
  onOpenShortcuts?: () => void;
}

export default function ComponentTray({
  selectedTool,
  onSelectTool,
  isMultimeterOpen,
  onToggleMultimeter,
  onOpenShortcuts,
}: ComponentTrayProps) {
  const selectionTools: {
    id: ComponentType | 'select' | 'delete';
    label: string;
    icon: React.ReactNode;
    keyCap?: string;
  }[] = [
    { id: 'select', label: 'Select / Move', icon: <MousePointer2 size={15} className="text-sky-400" />, keyCap: 'Esc' },
    { id: 'delete', label: 'Delete', icon: <Trash2 size={15} className="text-rose-500" />, keyCap: 'Del' },
  ];

  const probeTools: {
    id: 'probe_red' | 'probe_black';
    label: string;
    icon: React.ReactNode;
    badge: string;
  }[] = [
    {
      id: 'probe_red',
      label: 'Red Probe (+)',
      icon: <div className="w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white shadow-sm ring-1 ring-red-500/50" />,
      badge: 'V+',
    },
    {
      id: 'probe_black',
      label: 'Black Probe (-)',
      icon: <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-slate-400 shadow-sm" />,
      badge: 'GND',
    },
  ];

  const componentTools: {
    id: ComponentType;
    label: string;
    icon: React.ReactNode;
    hint: string;
    keyCap?: string;
  }[] = [
    { id: 'wire', label: 'Wire', icon: <div className="w-5 h-1 bg-sky-400 rounded-full" />, hint: '0 Ω', keyCap: 'W' },
    { id: 'battery', label: 'Battery', icon: <Battery size={15} className="text-amber-400" />, hint: 'DC / AC', keyCap: 'B' },
    { id: 'resistor', label: 'Resistor', icon: <Activity size={15} className="text-orange-400" />, hint: 'Fixed Ω', keyCap: 'R' },
    { id: 'potentiometer', label: 'Potentiometer', icon: <Settings2 size={15} className="text-amber-500" />, hint: 'Variable' },
    { id: 'switch', label: 'Switch', icon: <ToggleLeft size={15} className="text-emerald-400" />, hint: 'Open/Close', keyCap: 'S' },
    { id: 'bulb', label: 'Incandescent Bulb', icon: <Lightbulb size={15} className="text-yellow-400" />, hint: 'Load', keyCap: 'L' },
    { id: 'led', label: 'LED Diode', icon: <Zap size={15} className="text-rose-400" />, hint: 'Diode' },
    { id: 'capacitor', label: 'Capacitor', icon: <Layers size={15} className="text-indigo-400" />, hint: 'Transient' },
    { id: 'fuse', label: 'Fuse', icon: <ShieldAlert size={15} className="text-rose-500" />, hint: 'Safety' },
  ];

  const meterTools: {
    id: ComponentType;
    label: string;
    icon: React.ReactNode;
    hint: string;
    keyCap?: string;
  }[] = [
    { id: 'ammeter', label: 'Ammeter', icon: <ActivitySquare size={15} className="text-sky-400" />, hint: 'Series (A)', keyCap: 'A' },
    { id: 'voltmeter', label: 'Voltmeter', icon: <Monitor size={15} className="text-amber-400" />, hint: 'Parallel (V)', keyCap: 'V' },
  ];

  const renderToolButton = (tool: {
    id: string;
    label: string;
    icon: React.ReactNode;
    hint?: string;
    badge?: string;
    keyCap?: string;
  }) => {
    const isSelected = selectedTool === tool.id;

    return (
      <button
        key={tool.id}
        onClick={() => onSelectTool(tool.id as any)}
        className={`flex items-center justify-between p-2 rounded-xl text-left transition-all text-xs font-bold border ${
          isSelected
            ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary/30 shadow-md scale-[1.02]"
            : "bg-muted/30 hover:bg-accent border-border/80 text-foreground hover:border-border"
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <div className="w-5 h-5 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
            {tool.icon}
          </div>
          <span className="truncate text-[11px]">{tool.label}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {tool.keyCap && (
            <kbd className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shadow-sm ${
              isSelected ? "bg-black/40 text-white border-white/20" : "bg-card text-muted-foreground border-border"
            }`}>
              {tool.keyCap}
            </kbd>
          )}
          {tool.badge && (
            <span className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded-md ${
              isSelected ? "bg-black/30 text-white" : "bg-muted text-muted-foreground"
            }`}>
              {tool.badge}
            </span>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="bg-card lg:border-r border-border w-full lg:w-64 p-3 flex flex-col justify-between h-auto lg:h-full shrink-0 overflow-y-auto space-y-3">
      <div className="space-y-3">
        <div>
          <h2 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} className="text-primary" />
            Component Toolbox
          </h2>
          <span className="text-[10px] text-muted-foreground font-medium block">
            Click tool or use shortcut key
          </span>
        </div>

        {/* 1. Pointer Tools */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-black uppercase text-muted-foreground tracking-wider block">
            Pointer &amp; Edit
          </span>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
            {selectionTools.map(renderToolButton)}
          </div>
        </div>

        {/* 2. Multimeter Launcher & Probes */}
        <div className="space-y-1.5">
          <button
            onClick={onToggleMultimeter}
            className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all text-xs font-bold border ${
              isMultimeterOpen
                ? "bg-amber-500/20 text-amber-500 border-amber-500/50 shadow-sm"
                : "bg-muted/40 hover:bg-accent border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Gauge size={15} className={isMultimeterOpen ? "text-amber-500 animate-pulse" : "text-muted-foreground"} />
              <span className="text-[11px]">Digital Multimeter</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="text-[9px] font-mono px-1 py-0.5 bg-card border border-border rounded text-muted-foreground">M</kbd>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                isMultimeterOpen ? "bg-amber-500 text-black font-black" : "bg-muted text-muted-foreground"
              }`}>
                {isMultimeterOpen ? "ACTIVE" : "OPEN"}
              </span>
            </div>
          </button>

          {/* Probes only shown when Multimeter is active */}
          {isMultimeterOpen && (
            <div className="space-y-1 pt-1 animate-in fade-in slide-in-from-top-1">
              <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider block">
                Active Multimeter Probes:
              </span>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
                {probeTools.map(renderToolButton)}
              </div>
            </div>
          )}
        </div>

        <hr className="border-border/60" />

        {/* 3. Circuit Elements */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-black uppercase text-muted-foreground tracking-wider block">
            Circuit Elements &amp; Loads
          </span>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
            {componentTools.map(renderToolButton)}
          </div>
        </div>

        <hr className="border-border/60" />

        {/* 4. Measurement Instruments */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-black uppercase text-muted-foreground tracking-wider block">
            Inline Meters
          </span>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
            {meterTools.map(renderToolButton)}
          </div>
        </div>
      </div>

      {/* 5. Shortcuts Reference Trigger Button */}
      {onOpenShortcuts && (
        <button
          onClick={onOpenShortcuts}
          className="w-full mt-2 p-2 rounded-xl border border-border/80 bg-muted/40 hover:bg-accent text-muted-foreground hover:text-foreground text-left text-[11px] font-bold flex items-center justify-between transition shadow-sm"
        >
          <div className="flex items-center gap-1.5">
            <Keyboard size={14} className="text-primary" />
            <span>Shortcuts &amp; Gestures</span>
          </div>
          <kbd className="text-[9px] font-mono px-1 py-0.5 bg-card border border-border rounded">?</kbd>
        </button>
      )}
    </div>
  );
}
