"use client"

import { useChat } from '@/app/components/ChatContext';
import dynamic from 'next/dynamic'
import React, { useEffect, useState, useCallback } from 'react'
import { useLab } from '@/app/hooks/useXP';
import DailyChallengeCard from '@/app/components/DailyChallengeCard';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Thermometer, 
  Percent, 
  FlaskConical, 
  Sparkles,
  Gauge,
  Info,
  BookOpen,
  HelpCircle,
  Dna
} from 'lucide-react';
import { REACTION_DETAILS } from '@/app/components/chemistry/reactions/reactionDetails';

// Dynamic import of visual simulator to avoid SSR canvas errors
const ReactionSimulation = dynamic(() => import('@/app/components/chemistry/reactions/ReactionSimulation'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 shadow-sm rounded-3xl h-[500px]">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-slate-500 font-bold text-xs tracking-wider uppercase animate-pulse">Initializing 3D Molecular Engine…</p>
    </div>
  ),
})

export default function ChemistryPage() {
  const { completeExperiment } = useLab("chemistry/reaction-simulation", "chemistry", "simulation");
  const { setExperimentData } = useChat();

  // Telemetry state lifted up for Daily Challenge sync
  const [reactionsRun, setReactionsRun] = useState(0);
  const [temperature, setTemperature] = useState(25);
  const [yieldVal, setYieldVal] = useState(0);
  const [activeReactionId, setActiveReactionId] = useState("neutralization");

  // React chatbot theory sync
  useEffect(() => {
    setExperimentData({
      title: "Advanced Chemical Reactions Simulator",
      theory: "Chemical reactions rearrange atomic bonds to form new substances. Thermochemistry dictates the energy profiles, where exothermic reactions release heat (jumps in temperature) and yield factors limit product formation. Standard laboratory conditions serve as our baseline state.",
      extraContext: `Actively running simulations. Total runs: ${reactionsRun}, Current reaction: ${activeReactionId}, Measured thermal temperature: ${temperature}°C, High precision yield: ${yieldVal}%.`,
    });
  }, [reactionsRun, activeReactionId, temperature, yieldVal, setExperimentData]);

  // Handle updates bubbling up from dynamic simulator component
  const handleStateChange = useCallback((state: any) => {
    if (state.activeReactionId) {
      setActiveReactionId(state.activeReactionId);
    }
    if (state.temperature !== undefined) {
      setTemperature(state.temperature);
    }
    if (state.yield !== undefined) {
      setYieldVal(state.yield);
    }
    if (state.runReaction) {
      setReactionsRun(prev => {
        const next = prev + 1;
        // Auto complete the base experiment once a reaction is successfully completed
        if (next >= 1) {
          completeExperiment();
        }
        return next;
      });
    }
  }, [completeExperiment]);

  const activeDetails = REACTION_DETAILS[activeReactionId] || REACTION_DETAILS.neutralization;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-800 p-4 md:p-8 font-sans relative overflow-hidden bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] bg-[size:24px_24px]">
      
      {/* Background ambient backlights */}
      <div className="absolute top-0 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 h-[300px] w-[300px] rounded-full bg-blue-500/5 blur-[90px] pointer-events-none" />

      <div className="max-w-[1360px] mx-auto space-y-6 relative z-10">
        
        {/* Navigation Breadcrumbs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-4">
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <Link href="/chemistry" className="hover:text-slate-950 transition font-medium flex items-center gap-1.5" id="nav-back-chemistry">
              <ArrowLeft className="h-4 w-4" /> Back to Chemistry
            </Link>
            <span>/</span>
            <span className="text-indigo-600 font-bold">Reaction Simulator</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] text-indigo-700 font-extrabold uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/50">
              3D Sandbox Workstation Active
            </span>
          </div>
        </div>

        {/* Dynamic Title Header Block */}
        <div className="space-y-2 text-left">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-150 text-[10px] font-black uppercase tracking-wider">
              Simulation Sandbox
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
            Interactive Chemical Reactions Laboratory
          </h1>
          <p className="text-slate-500 text-sm md:text-base font-medium max-w-3xl">
            Synthesize compounds in a simulated environment. Select chemical configurations, trigger atomic rearrangement physics in real-time, and analyze thermodynamic parameters.
          </p>
        </div>

        {/* Console Workspace Grid Cockpit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Visual Sandbox Viewports (Left Column - lg:col-span-8) */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            <ReactionSimulation onComplete={completeExperiment} onStateChange={handleStateChange} />
          </div>

          {/* Telemetry Instruments & Manual (Right Column - lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col space-y-6 w-full text-left">
            
            {/* Daily Challenge Card console integration */}
            <div id="daily-challenge-panel" className="w-full">
              <DailyChallengeCard 
                labId="chemistry/reaction-simulation" 
                currentParams={{ reactionsRun, temperature, yield: yieldVal }} 
              />
            </div>

            {/* Dynamic Telemetry Readings Dashboard */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4 text-left relative overflow-hidden" id="telemetry-panel">
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-[10px]">
                <Gauge className="h-4 w-4 animate-pulse" /> Telemetry Readings
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg tracking-tight border-b border-slate-100 pb-2">
                Digital System Core
              </h3>
              
              <div className="grid grid-cols-3 gap-3.5 pt-1">
                {/* 1. TEMPERATURE */}
                <div className="flex flex-col justify-between items-center bg-slate-50 border border-slate-150 p-3 rounded-2xl shadow-inner text-center">
                  <div className="w-7 h-7 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-2">
                    <Thermometer className="h-4 w-4" />
                  </div>
                  <span className="text-[9px] text-slate-450 uppercase font-black tracking-wider">System Temp</span>
                  <span className="text-base font-black font-mono text-slate-900 mt-1">
                    {temperature}°C
                  </span>
                </div>

                {/* 2. YIELD */}
                <div className="flex flex-col justify-between items-center bg-slate-50 border border-slate-150 p-3 rounded-2xl shadow-inner text-center">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-2">
                    <Percent className="h-4 w-4" />
                  </div>
                  <span className="text-[9px] text-slate-450 uppercase font-black tracking-wider">Est. Yield</span>
                  <span className="text-base font-black font-mono text-slate-900 mt-1">
                    {yieldVal}%
                  </span>
                </div>

                {/* 3. SIMULATION RUNS */}
                <div className="flex flex-col justify-between items-center bg-slate-50 border border-slate-150 p-3 rounded-2xl shadow-inner text-center">
                  <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-2">
                    <FlaskConical className="h-4 w-4" />
                  </div>
                  <span className="text-[9px] text-slate-450 uppercase font-black tracking-wider">Runs Executed</span>
                  <span className="text-base font-black font-mono text-indigo-600 mt-1">
                    {reactionsRun}
                  </span>
                </div>
              </div>

              {yieldVal === 0 && temperature === 25 ? (
                <div className="text-[10px] font-bold text-slate-400 leading-normal flex items-start gap-2 bg-slate-50/50 p-3 rounded-xl border border-dashed border-slate-200">
                  <Info className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <span>Baseline Standard Conditions (STP) currently active. Click "Initiate Reaction!" to run synthesis physics.</span>
                </div>
              ) : (
                <div className="text-[10px] font-bold text-indigo-700 leading-normal flex items-start gap-2 bg-indigo-50/40 p-3 rounded-xl border border-indigo-100/60 animate-pulse">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span>Telemetry values actively dynamic. Real-time product synthesis complete!</span>
                </div>
              )}
            </div>

            {/* Reaction Monograph Details */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReactionId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4 text-left relative overflow-hidden"
                id="monograph-panel"
              >
                <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-[10px]">
                  <BookOpen className="h-4 w-4" /> Classification Monograph
                </div>
                
                <h3 className="font-extrabold text-slate-900 text-lg tracking-tight border-b border-slate-100 pb-2">
                  Chemical Analysis
                </h3>

                <div className="space-y-4 text-xs font-semibold">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-450 uppercase font-black tracking-wider">Classification</span>
                    <div className="text-sm font-black text-slate-800">{activeDetails.type}</div>
                    <div className={`text-[10px] font-bold ${activeDetails.energy.includes("Exo") ? "text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 inline-block" : "text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 inline-block"}`}>
                      {activeDetails.energy}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-450 uppercase font-black tracking-wider">Real World Context</span>
                    <p className="text-slate-700 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 leading-relaxed font-medium">
                      {activeDetails.context}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] text-slate-450 uppercase font-black tracking-wider">Key Concepts</span>
                    <ul className="space-y-2 font-medium text-slate-600">
                      {activeDetails.facts.map((fact: string, i: number) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-indigo-400 text-base leading-none">•</span>
                          <span className="leading-snug">{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>

      </div>
    </div>
  )
}