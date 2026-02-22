// types/gitSimulator.ts

export type BlobObject = {
  type: "blob";
  id: string;
  content: string;
};

export type TreeObject = {
  type: "tree";
  id: string;
  entries: {
    name: string;
    objectId: string; // blob id
  }[];
};

export type CommitObject = {
  type: "commit";
  id: string;
  tree: string;        // tree id
  parents: string[];   // supports merge
  message: string;
};

export type GitObject =
  | BlobObject
  | TreeObject
  | CommitObject;

export type RepoState = {
  objects: Record<string, GitObject>;
  refs: Record<string, string>;   // branch -> commit id
  HEAD: {
    type: "branch" | "commit";
    value: string;
  };
  index: Record<string, string>;  // staging (file -> blob id)
  workingDir: Record<string, string>; // file -> content
  initialized: boolean;
};