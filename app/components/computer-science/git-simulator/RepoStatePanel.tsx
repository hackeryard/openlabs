"use client";

import { RepoState } from "@/app/types/gitSimualtor";
import GitZonesView from "./GitZonesView";

type Props = {
  state: RepoState;
  onRunCommand?: (command: string) => void;
  onOpenFileEditor?: (filename: string, content: string, isConflict?: boolean) => void;
};

export default function RepoStatePanel({ state, onRunCommand, onOpenFileEditor }: Props) {
  return (
    <GitZonesView
      state={state}
      onRunCommand={onRunCommand || (() => {})}
      onOpenFileEditor={onOpenFileEditor || (() => {})}
    />
  );
}