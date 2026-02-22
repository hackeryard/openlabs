"use client";

import { RepoState } from "@/app/types/gitSimualtor";

type Props = {
  state: RepoState;
};

export default function WorkingDirectory({ state }: Props) {
  const files = Object.keys(state.workingDir);

  return (
    <div className="p-4 border rounded-2xl bg-zinc-900 text-white">
      <h2 className="font-semibold mb-4 text-lg">
        Working Directory
      </h2>

      {files.length === 0 ? (
        <p className="text-sm text-zinc-400">
          No files
        </p>
      ) : (
        files.map((file) => (
          <div key={file} className="text-sm mb-1">
            {file}
          </div>
        ))
      )}
    </div>
  );
}