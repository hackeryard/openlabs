"use client";

import { RepoState } from "@/app/types/gitSimualtor";

type Props = {
  state: RepoState;
};

export default function StagingArea({ state }: Props) {
  const stagedFiles = Object.keys(state.index);

  return (
    <div className="p-4 border rounded-2xl bg-zinc-900 text-white">
      <h2 className="font-semibold mb-4 text-lg">
        Staging Area (Index)
      </h2>

      {stagedFiles.length === 0 ? (
        <p className="text-sm text-zinc-400">
          Nothing staged
        </p>
      ) : (
        stagedFiles.map((file) => (
          <div
            key={file}
            className="text-sm text-green-400 mb-1"
          >
            {file}
          </div>
        ))
      )}
    </div>
  );
}