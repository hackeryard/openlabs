"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Leaf, Info, HelpCircle, Activity, Settings2 } from "lucide-react";
import { useChat } from "@/app/components/ChatContext";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

import { SimulatorState, RateOutput } from "./lib/types";
import { calculateRate } from "./lib/rateModel";
import ControlSliders from "./components/ControlSliders";
import LimitingFactorCallout from "./components/LimitingFactorCallout";
import PresetScenarios from "./components/PresetScenarios";
import RateGraph from "./components/RateGraph";
import BubbleAnimation from "./components/BubbleAnimation";
import LeafDiagram from "./components/LeafDiagram";

const INITIAL_STATE: SimulatorState = {
  light: 50,
  co2: 420, // Current atmospheric default
  water: 80,
  temperature: 25,
};

export default function PhotosynthesisLab() {
  const { completeExperiment } = useLab("biology/photosynthesis", "biology", "simulation");
  const { setExperimentData } = useChat();

  const [state, setState] = useState<SimulatorState>(INITIAL_STATE);
  const [rateOutput, setRateOutput] = useState<RateOutput>({ rate: 0, limitingFactor: "None" });
  const [rateHistory, setRateHistory] = useState<number[]>([]);
  
  // Ref to track max rate achieved for challenge tracking
  const maxRateRef = useRef(0);
  const limitingFactorsFound = useRef(new Set<string>());

  // Update AI context when lab loads
  useEffect(() => {
    setExperimentData({
      title: "Photosynthesis Simulator",
      theory: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.",
      extraContext: "Variables: Light Intensity (0-100%), CO2 Concentration (0-2000ppm), Water (0-100%), Temperature (0-50°C). Limiting factors apply.",
    });
  }, [setExperimentData]);

  // Compute rate immediately when state changes
  useEffect(() => {
    const output = calculateRate(state);
    setRateOutput(output);
    
    // Tracking for challenges
    if (output.rate > maxRateRef.current) {
      maxRateRef.current = output.rate;
    }
    if (output.limitingFactor !== "None") {
      limitingFactorsFound.current.add(output.limitingFactor);
    }

    // Complete experiment conditions: achieve > 95% rate and find at least 3 distinct limiting factors
    if (maxRateRef.current > 95 && limitingFactorsFound.current.size >= 3) {
      completeExperiment();
    }
  }, [state, completeExperiment]);

  // Record rate history for the graph (2 samples per second)
  useEffect(() => {
    const interval = setInterval(() => {
      setRateHistory((prev) => {
        const newHistory = [...prev, rateOutput.rate];
        if (newHistory.length > 60) return newHistory.slice(1);
        return newHistory;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [rateOutput.rate]);

  const handleSliderChange = (key: keyof SimulatorState, value: number) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handlePresetSelect = (newState: SimulatorState) => {
    setState(newState);
  };

  return (
    <main className="min-h-screen bg-[#fafafa] text-slate-800 pb-16 pt-20 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Breadcrumbs & Lab Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest">
            <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/biology" className="hover:text-emerald-700 transition-colors">Biology Labs</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Photosynthesis</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Leaf className="w-8 h-8 text-emerald-600" />
            Photosynthesis Simulator
          </h1>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed font-medium">
            Explore how Light, CO₂, Water, and Temperature interact to determine the rate of photosynthesis. Note: This model is a simplified teaching approximation of biological processes.
          </p>
        </div>

        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Biology Lab
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Interactive Simulation
          </span>
        </div>
      </div>

      <DailyChallengeCard 
        labId="biology/photosynthesis" 
        currentParams={{ 
          maxRateAchieved: maxRateRef.current,
          limitingFactorsIdentified: limitingFactorsFound.current.size
        }} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Visualizations & Graph */}
        <div className="lg:col-span-7 flex flex-col h-full space-y-4">
          
          {/* Main Visualizer Container */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 flex flex-col gap-4">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                <Activity className="w-4 h-4 text-emerald-600" />
                Live Experiment View
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Leaf Diagram */}
              <div className="flex flex-col gap-2">
                <LeafDiagram rate={rateOutput.rate} />
                <p className="text-center text-[10px] text-slate-500 font-medium">Cross section responds to photosynthetic activity.</p>
              </div>
              
              {/* Bubble Output Visualizer */}
              <div className="relative w-full aspect-video md:aspect-auto md:h-full rounded-2xl overflow-hidden shadow-inner flex items-center justify-center min-h-[160px]">
                <BubbleAnimation rate={rateOutput.rate} />
              </div>
            </div>

            {/* Rate Graph */}
            <div className="h-40 w-full mt-2">
              <RateGraph data={rateHistory} />
            </div>

          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex gap-3 text-sm text-blue-800">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Blackman's Law of Limiting Factors</p>
              <p className="text-blue-700/80 text-xs leading-relaxed">
                When a process depends on multiple factors, its rate is limited by the factor nearest to its minimum value. Increasing a non-limiting factor has no effect.
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: Controls */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                <Settings2 className="w-4 h-4 text-slate-500" />
                Environmental Controls
              </h2>
            </div>

            <PresetScenarios onSelect={handlePresetSelect} currentState={state} />

            <div className="my-6 border-t border-slate-100"></div>

            <ControlSliders 
              state={state} 
              onChange={handleSliderChange} 
              limitingFactor={rateOutput.limitingFactor} 
            />

          </div>

          {/* Dynamic Callout */}
          <LimitingFactorCallout factor={rateOutput.limitingFactor} />

        </div>

      </div>
    </main>
  );
}
