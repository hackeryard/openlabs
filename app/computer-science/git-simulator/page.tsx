"use client";

import { useState } from "react";
import { RepoState } from "@/app/types/gitSimualtor";
import TerminalInput from "@/app/components/computer-science/git-simulator/TerminalInput";
import RepoStatePanel from "@/app/components/computer-science/git-simulator/RepoStatePanel";
import CommitGraph from "@/app/components/computer-science/git-simulator/CommitGraph";
import { executeCommand } from "./utils/executeCommand";

const initialState: RepoState = {
  objects: {},
  refs: {},
  HEAD: null,
  index: {},
  workingDir: {},
  initialized: false,
};

export default function GitVisualizerPage() {
  const [state, setState] = useState<RepoState>(initialState);

  const handleCommand = (command: string) => {
    const { newState, output } = executeCommand(state, command);
    setState(newState);
    return { output };
  };

  return (
    <div className="p-6 space-y-6">
      <TerminalInput onCommand={handleCommand} />

      <RepoStatePanel state={state} />

      <CommitGraph state={state} />
    </div>
  );
}