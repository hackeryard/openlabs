import { nanoid } from "nanoid";
import {
  RepoState,
  BlobObject,
  TreeObject,
  CommitObject,
} from "@/app/types/gitSimualtor";

export function executeCommand(
  state: RepoState,
  input: string
): { newState: RepoState; output: string } {
  const tokens = input.trim().split(" ");
  const cmd = tokens[0];

  if (!state.initialized && input !== "git init") {
    return { newState: state, output: "Repository not initialized." };
  }

  // ---------------- INIT ----------------
  if (input === "git init") {
    if (state.initialized)
      return { newState: state, output: "Already initialized." };

    return {
      newState: {
        ...state,
        initialized: true,
        refs: { main: "" },
        HEAD: { type: "branch", value: "main" },
      },
      output: "Initialized empty Git repository.",
    };
  }

  // ---------------- TOUCH ----------------
  if (cmd === "touch") {
    const file = tokens[1];
    return {
      newState: {
        ...state,
        workingDir: { ...state.workingDir, [file]: "" },
      },
      output: `Created ${file}`,
    };
  }

  // ---------------- ADD ----------------
  if (tokens[0] === "git" && tokens[1] === "add") {
    const file = tokens[2];
    const content = state.workingDir[file];

    if (content === undefined)
      return { newState: state, output: "File not found." };

    const blobId = nanoid(8);
    const blob: BlobObject = { type: "blob", id: blobId, content };

    return {
      newState: {
        ...state,
        objects: { ...state.objects, [blobId]: blob },
        index: { ...state.index, [file]: blobId },
      },
      output: `Added ${file}`,
    };
  }

  // ---------------- COMMIT ----------------
  if (tokens[0] === "git" && tokens[1] === "commit") {
    if (Object.keys(state.index).length === 0)
      return { newState: state, output: "Nothing to commit." };

    const messageMatch = input.match(/-m\s+"(.+)"/);
    const message = messageMatch ? messageMatch[1] : "Commit";

    const treeId = nanoid(8);
    const tree: TreeObject = {
      type: "tree",
      id: treeId,
      entries: Object.entries(state.index).map(([name, blobId]) => ({
        name,
        objectId: blobId,
      })),
    };

    const parent =
      state.HEAD?.type === "branch"
        ? state.refs[state.HEAD.value]
        : state.HEAD?.value;

    const commitId = nanoid(8);

    const commit: CommitObject = {
      type: "commit",
      id: commitId,
      tree: treeId,
      parents: parent ? [parent] : [],
      message,
    };

    let newRefs = { ...state.refs };

    if (state.HEAD?.type === "branch") {
      newRefs[state.HEAD.value] = commitId;
    }

    return {
      newState: {
        ...state,
        objects: {
          ...state.objects,
          [treeId]: tree,
          [commitId]: commit,
        },
        refs: newRefs,
        index: {},
      },
      output: `[${commitId}] ${message}`,
    };
  }

  // ---------------- BRANCH ----------------
  if (tokens[0] === "git" && tokens[1] === "branch") {
    const branchName = tokens[2];
    const currentCommit =
      state.HEAD?.type === "branch"
        ? state.refs[state.HEAD.value]
        : state.HEAD?.value;

    return {
      newState: {
        ...state,
        refs: { ...state.refs, [branchName]: currentCommit || "" },
      },
      output: `Branch ${branchName} created.`,
    };
  }

  // ---------------- CHECKOUT ----------------
  if (tokens[0] === "git" && tokens[1] === "checkout") {
    const target = tokens[2];

    if (state.refs[target]) {
      return {
        newState: {
          ...state,
          HEAD: { type: "branch", value: target },
        },
        output: `Switched to branch ${target}`,
      };
    }

    if (state.objects[target]) {
      return {
        newState: {
          ...state,
          HEAD: { type: "commit", value: target },
        },
        output: `Detached HEAD at ${target}`,
      };
    }

    return { newState: state, output: "Invalid checkout target." };
  }

  // ---------------- LOG ----------------
  if (tokens[0] === "git" && tokens[1] === "log") {
    let commitId =
      state.HEAD?.type === "branch"
        ? state.refs[state.HEAD.value]
        : state.HEAD?.value;

    let output = "";

    while (commitId) {
      const commit = state.objects[commitId] as CommitObject;
      output += `commit ${commit.id}\n    ${commit.message}\n\n`;
      commitId = commit.parents[0];
    }

    return { newState: state, output: output || "No commits." };
  }

  // ---------------- STATUS ----------------
  if (tokens[0] === "git" && tokens[1] === "status") {
    const staged = Object.keys(state.index);
    const working = Object.keys(state.workingDir);

    return {
      newState: state,
      output: `
On branch ${state.HEAD?.value}

Staged files:
${staged.join("\n") || "None"}

Working directory:
${working.join("\n") || "Empty"}
`,
    };
  }

  // ---------------- RESET ----------------
  if (tokens[0] === "git" && tokens[1] === "reset") {
    const mode = tokens[2];
    const commitId = tokens[3];

    if (!state.objects[commitId])
      return { newState: state, output: "Invalid commit." };

    let newState = { ...state };

    if (state.HEAD?.type === "branch") {
      newState.refs[state.HEAD.value] = commitId;
    } else {
      newState.HEAD = { type: "commit", value: commitId };
    }

    if (mode === "--hard") {
      newState.index = {};
      newState.workingDir = {};
    }

    if (mode === "--mixed") {
      newState.index = {};
    }

    return {
      newState,
      output: `Reset to ${commitId} (${mode})`,
    };
  }

  return { newState: state, output: "Unknown command." };
}