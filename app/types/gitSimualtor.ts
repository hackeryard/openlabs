// types/gitSimulator.ts

export type BlobObject = {
  type: "blob";
  id: string;
  content: string;
  size?: number;
};

export type TreeEntry = {
  name: string;
  objectId: string; // blob or tree id
  type?: "blob" | "tree";
  mode?: string;
};

export type TreeObject = {
  type: "tree";
  id: string;
  entries: TreeEntry[];
};

export type CommitDiff = {
  file: string;
  status: "added" | "modified" | "deleted";
  oldContent?: string;
  newContent?: string;
};

export type CommitObject = {
  type: "commit";
  id: string;
  tree: string;        // tree id
  parents: string[];   // supports merge
  message: string;
  author?: string;
  timestamp?: number;
  diffs?: CommitDiff[];
};

export type TagObject = {
  type: "tag";
  id: string;
  name: string;
  commitId: string;
  message?: string;
};

export type GitObject =
  | BlobObject
  | TreeObject
  | CommitObject
  | TagObject;

export type FileStatus = "untracked" | "modified" | "staged" | "clean" | "deleted";

export type StashItem = {
  id: string;
  message: string;
  branch: string;
  workingDir: Record<string, string>;
  index: Record<string, string>;
  timestamp: number;
};

export type MergeConflict = {
  file: string;
  currentBranch: string;
  incomingBranch: string;
  currentContent: string;
  incomingContent: string;
  resolved: boolean;
};

export type RemoteRepo = {
  name: string;
  url: string;
  refs: Record<string, string>; // e.g. "main" -> commitId
};

export type RepoState = {
  objects: Record<string, GitObject>;
  refs: Record<string, string>;   // branch -> commit id
  tags?: Record<string, string>;   // tag -> commit id
  remotes?: Record<string, RemoteRepo>;
  HEAD: {
    type: "branch" | "commit";
    value: string;
  } | null;
  index: Record<string, string>;  // staging (file -> blob id)
  workingDir: Record<string, string>; // file -> content
  stash?: StashItem[];
  conflicts?: MergeConflict[];
  history?: string[];
  initialized: boolean;
  activeMissionId?: string;
  completedMissions?: string[];
};