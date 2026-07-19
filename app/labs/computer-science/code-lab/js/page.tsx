"use client";

import { useEffect, useState } from "react";
import EventLoopVisualizer from "./components/EventLoopVisualizer";
import { useChat } from "@/app/components/ChatContext";
import { useLab } from "@/app/hooks/useXP";
import DailyChallengeCard from "@/app/components/DailyChallengeCard";

export default function EventLoopPage() {
  const { completeExperiment } = useLab(
    "computer-science/code-lab/js",
    "computerScience",
    "editor"
  );

  const { setExperimentData } = useChat();

  const [examplesCompleted, setExamplesCompleted] = useState(0);
  const [predictCorrect, setPredictCorrect] = useState(0);
  const [freeformRunsCompleted, setFreeformRunsCompleted] = useState(0);

  useEffect(() => {
    setExperimentData({
      title: "JavaScript Event Loop Visualizer",
      theory: "Interactive visualization of the JS event loop: Call Stack, Web APIs, Microtask Queue, Macrotask Queue, and the Event Loop mechanism.",
      extraContext: `This lab teaches how JavaScript's single-threaded runtime handles asynchronous operations through the event loop. Key concept: microtasks (Promise .then, async/await continuations) always drain completely before any macrotask (setTimeout, setInterval) runs — even if the macrotask was queued first.`,
    });
  }, []);

  // Measure the real height of the site's fixed navbar (rather than
  // guessing a rem value) so the lab's internal panels size against
  // the actual remaining viewport instead of an assumed 4rem.
  useEffect(() => {
    const navEl = document.querySelector<HTMLElement>("[data-site-navbar]");
    if (!navEl) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--code-lab-nav-h",
        `${navEl.getBoundingClientRect().height}px`
      );
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(navEl);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <DailyChallengeCard
        labId="computer-science/code-lab/js"
        currentParams={{ predictCorrect, examplesCompleted, freeformRunsCompleted }}
      />
      <div className="min-h-[calc(100vh-var(--code-lab-nav-h,4rem))] w-full flex flex-col min-h-0">
        <EventLoopVisualizer
          onExperimentComplete={completeExperiment}
          onExamplesCompletedChange={setExamplesCompleted}
          onPredictCorrectChange={setPredictCorrect}
          onFreeformRunsChange={setFreeformRunsCompleted}
        />
      </div>
    </>
  );
}