"use client";

import { RepoState } from "@/app/types/gitSimualtor";

type Props = {
  state: RepoState;
};

export default function BranchInfo({ state }: Props) {
  const branchNames = Object.keys(state.refs);

  return (
    <div className="p-4 border rounded-2xl bg-zinc-900 text-white">
      <h2 className="font-semibold mb-4 text-lg">Branches</h2>

      {branchNames.length === 0 ? (
        <p className="text-sm text-zinc-400">No branches</p>
      ) : (
        branchNames.map((branch) => {
          const isHead =
            state.HEAD?.type === "branch" &&
            state.HEAD.value === branch;

          return (
            <div
              key={branch}
              className="flex items-center justify-between text-sm mb-2"
            >
              <span>{branch}</span>

              {isHead && (
                <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">
                  HEAD
                </span>
              )}
            </div>
          );
        })
      )}

      {/* Detached HEAD state */}
      {state.HEAD?.type === "commit" && (
        <div className="mt-4 text-xs text-yellow-400">
          Detached HEAD at {state.HEAD.value}
        </div>
      )}
    </div>
  );
}