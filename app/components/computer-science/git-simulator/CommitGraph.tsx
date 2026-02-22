"use client";

import { RepoState, CommitObject } from "@/app/types/gitSimualtor";

type Props = {
  state: RepoState;
};

const LANE_WIDTH = 80;
const ROW_HEIGHT = 70;

export default function CommitGraph({ state }: Props) {
  const branchNames = Object.keys(state.refs);

  const branchLaneMap: Record<string, number> = {};
  branchNames.forEach((branch, index) => {
    branchLaneMap[branch] = index;
  });

  // Collect commits from all refs (simple topo order)
  const visited = new Set<string>();
  const orderedCommits: CommitObject[] = [];

  function walk(commitId: string) {
    if (!commitId || visited.has(commitId)) return;
    visited.add(commitId);

    const commit = state.objects[commitId] as CommitObject;
    if (!commit) return;

    orderedCommits.push(commit);

    commit.parents.forEach((parentId) => walk(parentId));
  }

  Object.values(state.refs).forEach((commitId) => {
    if (commitId) walk(commitId);
  });

  if (orderedCommits.length === 0) {
    return (
      <div className="p-6 border rounded-2xl bg-zinc-900 text-white">
        <h2 className="font-semibold mb-6 text-lg">Repository Graph</h2>
        <p className="text-zinc-400">No commits yet</p>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-2xl bg-zinc-900 text-white overflow-x-auto">
      <h2 className="font-semibold mb-6 text-lg">Repository Graph</h2>

      <div
        className="relative"
        style={{
          width: branchNames.length * LANE_WIDTH + 300,
          height: orderedCommits.length * ROW_HEIGHT,
        }}
      >
        {/* Vertical Lane Lines */}
        {branchNames.map((branch, index) => (
          <div
            key={branch}
            className="absolute top-0 bottom-0 border-l border-zinc-700"
            style={{ left: index * LANE_WIDTH + 20 }}
          />
        ))}

        {/* Commits */}
        {orderedCommits.map((commit, rowIndex) => {
          const branchEntry = Object.entries(state.refs).find(
            ([, id]) => id === commit.id
          );

          const lane =
            branchEntry !== undefined
              ? branchLaneMap[branchEntry[0]]
              : 0;

          const isHead =
            state.HEAD?.type === "commit"
              ? state.HEAD.value === commit.id
              : branchEntry?.[0] === state.HEAD?.value;

          return (
            <div
              key={commit.id}
              className="absolute flex items-start gap-4"
              style={{
                top: rowIndex * ROW_HEIGHT,
                left: lane * LANE_WIDTH,
              }}
            >
              {/* Commit Node */}
              <div
                className={`w-4 h-4 rounded-full mt-2 ${
                  isHead ? "bg-yellow-500" : "bg-green-500"
                }`}
              />

              {/* Commit Info */}
              <div className="bg-zinc-800 px-3 py-2 rounded-lg shadow text-sm min-w-[200px]">
                <div className="font-medium">{commit.message}</div>
                <div className="text-xs text-zinc-400">
                  {commit.id}
                </div>

                {branchEntry && (
                  <div className="mt-1 text-xs bg-blue-600 px-2 py-0.5 rounded inline-block">
                    {branchEntry[0]}
                  </div>
                )}

                {isHead && (
                  <div className="mt-1 text-xs bg-yellow-600 px-2 py-0.5 rounded inline-block ml-1">
                    HEAD
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
