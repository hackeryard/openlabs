"use client";

import { RepoState } from "@/app/types/gitSimualtor";

type Props = {
  state: RepoState;
};

export default function WorkingDirectory({ state }: Props) {
  const files = Object.keys(state.workingDir);

  return (
    <div className="p-4 border border-border rounded-2xl bg-card text-foreground">
      <h2 className="font-semibold mb-4 text-lg">
        Working Directory
      </h2>

      {files.length === 0 ? (
        <p className="text-sm text-muted-foreground">
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