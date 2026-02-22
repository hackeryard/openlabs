"use client";

import { RepoState } from "@/app/types/gitSimualtor";
import WorkingDirectory from "./WorkingDirectory";
import StagingArea from "./StagingArea";
import BranchInfo from "./BranchInfo";

type Props = {
  state: RepoState;
};

export default function RepoStatePanel({ state }: Props) {
  return (
    <div className="grid grid-cols-3 gap-6 mt-6">
      <WorkingDirectory state={state} />
      <StagingArea state={state} />
      <BranchInfo state={state} />
    </div>
  );
}