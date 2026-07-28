"use client";

import React from "react";
import { ComponentType } from "./engine";
import { Battery, Zap, Activity, ToggleLeft, ActivitySquare, Monitor, Lightbulb, Grid3x3, Settings2, ShieldAlert, LightbulbOff } from "lucide-react";

interface ComponentTrayProps {
  selectedTool: ComponentType | 'select' | 'delete' | 'probe_red' | 'probe_black';
  onSelectTool: (tool: ComponentType | 'select' | 'delete' | 'probe_red' | 'probe_black') => void;
}

export default function ComponentTray({ selectedTool, onSelectTool }: ComponentTrayProps) {
  const selectionTools: { id: ComponentType | 'select' | 'delete' | 'probe_red' | 'probe_black'; label: string; icon: React.ReactNode; color?: string }[] = [
    { id: 'select', label: 'Select / Move', icon: <Grid3x3 size={20} /> },
    { id: 'delete', label: 'Delete', icon: <div className="text-red-500 font-bold">X</div> },
    { id: 'probe_red', label: 'Red Probe', icon: <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white" />, color: 'text-red-500' },
    { id: 'probe_black', label: 'Black Probe', icon: <div className="w-4 h-4 rounded-full bg-zinc-800 border-2 border-white" />, color: 'text-zinc-500' },
  ];

  const componentTools: { id: ComponentType; label: string; icon: React.ReactNode }[] = [
    { id: 'wire', label: 'Wire', icon: <div className="w-6 h-1 bg-current" /> },
    { id: 'battery', label: 'Battery', icon: <Battery size={20} /> },
    { id: 'resistor', label: 'Resistor', icon: <Activity size={20} /> },
    { id: 'potentiometer', label: 'Var Resistor', icon: <Settings2 size={20} /> },
    { id: 'capacitor', label: 'Capacitor', icon: <Zap size={20} /> },
    { id: 'switch', label: 'Switch', icon: <ToggleLeft size={20} /> },
    { id: 'bulb', label: 'Bulb', icon: <Lightbulb size={20} /> },
    { id: 'led', label: 'LED', icon: <LightbulbOff size={20} /> },
    { id: 'fuse', label: 'Fuse', icon: <ShieldAlert size={20} /> },
  ];

  const meterTools: { id: ComponentType; label: string; icon: React.ReactNode }[] = [
    { id: 'ammeter', label: 'Ammeter', icon: <ActivitySquare size={20} /> },
    { id: 'voltmeter', label: 'Voltmeter', icon: <Monitor size={20} /> },
  ];

  const renderTool = (tool: { id: string; label: string; icon: React.ReactNode; color?: string }) => (
    <button
      key={tool.id}
      onClick={() => onSelectTool(tool.id as any)}
      className={`flex items-center gap-3 py-2.5 px-3 rounded-md transition-colors ${
        selectedTool === tool.id
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      {tool.icon}
      <span className={`font-medium ${tool.color || ''}`}>{tool.label}</span>
    </button>
  );

  return (
    <div className="bg-card border-r border-border w-64 p-4 flex flex-col gap-2 h-full">
      <h2 className="font-semibold text-lg mb-2">Tools & Components</h2>
      
      <div className="flex flex-col gap-1">
        {selectionTools.map(renderTool)}
      </div>

      <hr className="my-2 border-border/50" />
      
      <div className="flex flex-col gap-1">
        {componentTools.map(renderTool)}
      </div>

      <hr className="my-2 border-border/50" />
      
      <div className="flex flex-col gap-1">
        {meterTools.map(renderTool)}
      </div>
    </div>
  );
}
