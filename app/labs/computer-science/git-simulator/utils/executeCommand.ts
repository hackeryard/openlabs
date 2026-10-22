import {
  RepoState,
  BlobObject,
  TreeObject,
  CommitObject,
  TagObject,
  StashItem,
  MergeConflict,
  CommitDiff,
} from "@/app/types/gitSimualtor";

// Helper to generate realistic 7-char Git hex SHAs
function generateHexSha(): string {
  const chars = "0123456789abcdef";
  let result = "";
  for (let i = 0; i < 7; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// Find all ancestor commit IDs for a given commit
function getAncestors(commitId: string | undefined, objects: RepoState["objects"]): Set<string> {
  const ancestors = new Set<string>();
  if (!commitId) return ancestors;

  const queue = [commitId];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (ancestors.has(cur)) continue;
    ancestors.add(cur);
    const obj = objects[cur];
    if (obj && obj.type === "commit") {
      (obj as CommitObject).parents.forEach((p) => queue.push(p));
    }
  }
  return ancestors;
}

// Find Lowest Common Ancestor (LCA) between two commits in a DAG
function findLCA(
  c1: string,
  c2: string,
  objects: RepoState["objects"]
): string | null {
  const ancestors1 = getAncestors(c1, objects);
  if (ancestors1.has(c2)) return c2;

  const queue = [c2];
  const visited2 = new Set<string>();

  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (visited2.has(cur)) continue;
    visited2.add(cur);

    if (ancestors1.has(cur)) {
      return cur;
    }

    const obj = objects[cur];
    if (obj && obj.type === "commit") {
      (obj as CommitObject).parents.forEach((p) => queue.push(p));
    }
  }
  return null;
}

// Helper to get all files in a commit's tree
function getFilesFromTree(
  treeId: string | undefined,
  objects: RepoState["objects"]
): Record<string, string> {
  const files: Record<string, string> = {};
  if (!treeId) return files;

  const tree = objects[treeId];
  if (!tree || tree.type !== "tree") return files;

  (tree as TreeObject).entries.forEach((entry) => {
    const blob = objects[entry.objectId];
    if (blob && blob.type === "blob") {
      files[entry.name] = (blob as BlobObject).content;
    }
  });

  return files;
}

export function executeCommand(
  state: RepoState,
  rawInput: string
): { newState: RepoState; output: string } {
  const input = rawInput.trim();
  if (!input) return { newState: state, output: "" };

  const history = [...(state.history || []), input];

  // ==================== HELPER COMMANDS ====================
  if (input === "clear") {
    return {
      newState: { ...state, history },
      output: "__CLEAR__",
    };
  }

  if (input === "history") {
    return {
      newState: { ...state, history },
      output: (state.history || []).map((cmd, i) => `  ${i + 1}  ${cmd}`).join("\n") || "No history.",
    };
  }

  if (input === "help" || input === "git help" || input === "git --help") {
    return {
      newState: { ...state, history },
      output: `Available OpenLabs Git Commands:
  • Setup:
      git init [name]                 Initialize empty git repository
  • File Operations:
      touch <file>                    Create an empty file
      echo "<content>" > <file>       Create or overwrite file with content
      edit <file> <content>           Update file content
      rm <file>                       Remove file from working directory
      ls                              List files in working directory
      cat <file>                      Print file contents
  • Staging & Committing:
      git add <file> | . | -A         Stage file(s) for the next commit
      git restore --staged <file>     Unstage a file
      git commit -m "<message>"       Commit staged changes
      git status                      Show working directory & staging status
  • Branching & Moving:
      git branch                      List branches (* indicates active branch)
      git branch <name>               Create a new branch
      git branch -d <name>            Delete a branch
      git checkout <branch|commit>    Switch to branch or detached commit
      git checkout -b <branch>        Create and switch to new branch
      git switch <branch>             Switch branch (modern Git)
      git switch -c <branch>          Create and switch branch (modern Git)
  • Merging & History:
      git merge <branch>              Merge branch into active branch (Fast-Forward or 3-Way)
      git rebase <targetBranch>       Rebase current branch onto target branch
      git cherry-pick <commitId>      Apply specific commit onto current HEAD
      git revert <commitId>           Create inverse commit undoing specified commit
      git reset [--soft|--mixed|--hard] <id>  Reset current HEAD to target commit
  • Stash & Tags:
      git stash [push -m "<msg>"]     Shelve uncommitted modifications
      git stash list                  List stashed changesets
      git stash pop                   Restore most recent stashed change
      git tag <tagname> [<commitId>]  Create a tag pointer
  • Inspection:
      git log [--oneline] [-n <num>]  Display commit history
      git diff [--staged]             Show changes between stages
      git show <commitId>             Inspect commit details and tree diffs`,
    };
  }

  // Check initialization for git commands
  if (!state.initialized && input !== "git init" && !input.startsWith("git init ")) {
    if (input.startsWith("git ")) {
      return {
        newState: { ...state, history },
        output: "fatal: not a git repository (or any of the parent directories): .git\nRun 'git init' to initialize.",
      };
    }
  }

  // ==================== GIT INIT ====================
  if (input === "git init" || input.startsWith("git init ")) {
    if (state.initialized) {
      return {
        newState: { ...state, history },
        output: `Reinitialized existing Git repository in /openlabs-repo/.git/`,
      };
    }

    return {
      newState: {
        ...state,
        initialized: true,
        objects: {},
        refs: { main: "" },
        tags: {},
        remotes: {},
        HEAD: { type: "branch", value: "main" },
        index: {},
        workingDir: state.workingDir || {},
        stash: [],
        conflicts: [],
        history,
      },
      output: "Initialized empty Git repository in /openlabs-repo/.git/\nActive branch: main (ready for your first commit).",
    };
  }

  // ==================== FILE SYSTEM OPERATIONS ====================
  if (input.startsWith("touch ")) {
    const filename = input.slice(6).trim();
    if (!filename) {
      return { newState: { ...state, history }, output: "touch: missing file operand" };
    }
    const current = state.workingDir[filename];
    return {
      newState: {
        ...state,
        workingDir: {
          ...state.workingDir,
          [filename]: current !== undefined ? current : "",
        },
        history,
      },
      output: `Created empty file: ${filename}`,
    };
  }

  // echo "content" > file.ext
  const echoMatch = input.match(/^echo\s+["'](.*)["']\s*>\s*([a-zA-Z0-9_\-./]+)$/);
  if (echoMatch) {
    const content = echoMatch[1];
    const filename = echoMatch[2];
    return {
      newState: {
        ...state,
        workingDir: {
          ...state.workingDir,
          [filename]: content,
        },
        history,
      },
      output: `Wrote ${content.length} bytes to ${filename}`,
    };
  }

  // edit <file> <content...>
  if (input.startsWith("edit ")) {
    const rest = input.slice(5).trim();
    const firstSpace = rest.indexOf(" ");
    if (firstSpace === -1) {
      return { newState: { ...state, history }, output: "Usage: edit <filename> <content...>" };
    }
    const filename = rest.slice(0, firstSpace);
    const content = rest.slice(firstSpace + 1);
    return {
      newState: {
        ...state,
        workingDir: {
          ...state.workingDir,
          [filename]: content,
        },
        history,
      },
      output: `Updated ${filename}`,
    };
  }

  if (input === "ls" || input === "ls -la" || input === "dir") {
    const files = Object.keys(state.workingDir);
    if (files.length === 0) {
      return { newState: { ...state, history }, output: "Directory is empty." };
    }
    const lines = files.map((f) => {
      const size = state.workingDir[f]?.length || 0;
      const isStaged = !!state.index[f];
      return `  -rw-r--r-- 1 dev staff ${size.toString().padStart(4, " ")}B ${f}${isStaged ? " [staged]" : ""}`;
    });
    return {
      newState: { ...state, history },
      output: `total ${files.length}\n${lines.join("\n")}`,
    };
  }

  if (input.startsWith("cat ")) {
    const filename = input.slice(4).trim();
    if (!filename || state.workingDir[filename] === undefined) {
      return { newState: { ...state, history }, output: `cat: ${filename}: No such file or directory` };
    }
    return {
      newState: { ...state, history },
      output: state.workingDir[filename] || "(empty file)",
    };
  }

  if (input.startsWith("rm ") && !input.startsWith("rm -")) {
    const filename = input.slice(3).trim();
    if (state.workingDir[filename] === undefined) {
      return { newState: { ...state, history }, output: `rm: cannot remove '${filename}': No such file` };
    }
    const newWorking = { ...state.workingDir };
    delete newWorking[filename];
    return {
      newState: {
        ...state,
        workingDir: newWorking,
        history,
      },
      output: `Removed ${filename} from working directory`,
    };
  }

  // ==================== GIT ADD ====================
  if (input.startsWith("git add")) {
    const args = input.slice(7).trim();
    if (!args) {
      return { newState: { ...state, history }, output: "Nothing specified, nothing added. Maybe you wanted to say 'git add .'?" };
    }

    const newObjects = { ...state.objects };
    const newIndex = { ...state.index };
    const filesToAdd: string[] = [];

    if (args === "." || args === "-A" || args === "--all" || args === "*") {
      filesToAdd.push(...Object.keys(state.workingDir));
    } else {
      const specifiedFiles = args.split(/\s+/);
      for (const f of specifiedFiles) {
        if (state.workingDir[f] !== undefined) {
          filesToAdd.push(f);
        } else {
          return {
            newState: { ...state, history },
            output: `fatal: pathspec '${f}' did not match any files`,
          };
        }
      }
    }

    if (filesToAdd.length === 0) {
      return { newState: { ...state, history }, output: "Nothing to add (working directory is clean or empty)." };
    }

    filesToAdd.forEach((filename) => {
      const content = state.workingDir[filename] ?? "";
      const blobId = "b_" + generateHexSha();
      const blob: BlobObject = {
        type: "blob",
        id: blobId,
        content,
        size: content.length,
      };
      newObjects[blobId] = blob;
      newIndex[filename] = blobId;
    });

    // If there were conflicts on any of these files, mark them resolved
    const remainingConflicts = (state.conflicts || []).filter(
      (c) => !filesToAdd.includes(c.file)
    );

    return {
      newState: {
        ...state,
        objects: newObjects,
        index: newIndex,
        conflicts: remainingConflicts,
        history,
      },
      output: `Staged ${filesToAdd.length} file${filesToAdd.length > 1 ? "s" : ""} to index (${filesToAdd.join(", ")}).`,
    };
  }

  // ==================== GIT RESTORE --STAGED / GIT RESET <file> ====================
  if (input.startsWith("git restore --staged ") || input.startsWith("git reset HEAD ")) {
    const filename = input.includes("--staged")
      ? input.split("--staged")[1].trim()
      : input.split("HEAD")[1].trim();

    if (!state.index[filename]) {
      return { newState: { ...state, history }, output: `fatal: pathspec '${filename}' did not match any staged files` };
    }

    const newIndex = { ...state.index };
    delete newIndex[filename];

    return {
      newState: {
        ...state,
        index: newIndex,
        history,
      },
      output: `Unstaged changes for '${filename}'`,
    };
  }

  // ==================== GIT COMMIT ====================
  if (input.startsWith("git commit")) {
    if (Object.keys(state.index).length === 0) {
      return {
        newState: { ...state, history },
        output: "On branch " + (state.HEAD?.value || "main") + "\nNothing to commit, working tree clean (or changes not staged).\nUse 'git add <file>' to stage changes.",
      };
    }

    let message = "Snapshot commit";
    const mMatch = input.match(/-m\s+["'](.*)["']/);
    if (mMatch) {
      message = mMatch[1];
    } else if (input.includes("-m")) {
      const parts = input.split("-m")[1]?.trim();
      message = parts?.replace(/["']/g, "") || "Commit message";
    }

    // 1. Create Tree Object from staging index
    const treeId = "t_" + generateHexSha();
    const treeEntries = Object.entries(state.index).map(([name, objectId]) => ({
      name,
      objectId,
      type: "blob" as const,
      mode: "100644",
    }));

    const treeObj: TreeObject = {
      type: "tree",
      id: treeId,
      entries: treeEntries,
    };

    // 2. Determine parent(s)
    const currentCommitId =
      state.HEAD?.type === "branch"
        ? state.refs[state.HEAD.value]
        : state.HEAD?.value;

    const parents: string[] = [];
    if (currentCommitId) {
      parents.push(currentCommitId);
    }

    // If active merge was happening with a second parent (from merge conflict)
    // Check if there was an incoming branch
    if (state.conflicts && state.conflicts.length > 0) {
      return {
        newState: { ...state, history },
        output: "error: Committing is not possible because you have unmerged files.\nFix conflicts and run 'git add <file>' before committing.",
      };
    }

    // 3. Compute Diffs relative to parent tree
    const parentTreeId = (state.objects[currentCommitId || ""] as CommitObject)?.tree;
    const oldFiles = getFilesFromTree(parentTreeId, state.objects);
    const newFiles = getFilesFromTree(treeId, { ...state.objects, [treeId]: treeObj });

    const diffs: CommitDiff[] = [];
    Object.keys(newFiles).forEach((f) => {
      if (oldFiles[f] === undefined) {
        diffs.push({ file: f, status: "added", newContent: newFiles[f] });
      } else if (oldFiles[f] !== newFiles[f]) {
        diffs.push({ file: f, status: "modified", oldContent: oldFiles[f], newContent: newFiles[f] });
      }
    });
    Object.keys(oldFiles).forEach((f) => {
      if (newFiles[f] === undefined) {
        diffs.push({ file: f, status: "deleted", oldContent: oldFiles[f] });
      }
    });

    // 4. Create Commit Object
    const commitId = "c_" + generateHexSha();
    const commitObj: CommitObject = {
      type: "commit",
      id: commitId,
      tree: treeId,
      parents,
      message,
      author: "OpenLabs Student <student@openlabs.org.in>",
      timestamp: Date.now(),
      diffs,
    };

    const newObjects = {
      ...state.objects,
      [treeId]: treeObj,
      [commitId]: commitObj,
    };

    // 5. Advance branch or detached HEAD
    let newRefs = { ...state.refs };
    let newHEAD = state.HEAD;

    if (state.HEAD?.type === "branch") {
      newRefs[state.HEAD.value] = commitId;
    } else {
      newHEAD = { type: "commit", value: commitId };
    }

    return {
      newState: {
        ...state,
        objects: newObjects,
        refs: newRefs,
        HEAD: newHEAD,
        index: {}, // Staging area clears after commit
        history,
      },
      output: `[${state.HEAD?.value || "detached"} ${commitId.slice(2)}] ${message}\n ${diffs.length} file${diffs.length > 1 ? "s" : ""} changed, ${treeEntries.length} objects stored.`,
    };
  }

  // ==================== GIT STATUS ====================
  if (input === "git status" || input === "git status -s") {
    const isDetached = state.HEAD?.type === "commit";
    const branchName = isDetached ? `HEAD detached at ${state.HEAD?.value}` : state.HEAD?.value || "main";

    const headCommitId = state.HEAD?.type === "branch" ? state.refs[state.HEAD.value] : state.HEAD?.value;
    const headCommit = state.objects[headCommitId || ""] as CommitObject;
    const committedFiles = getFilesFromTree(headCommit?.tree, state.objects);

    const stagedFiles = Object.keys(state.index);
    const workingFiles = Object.keys(state.workingDir);

    // Staged changes
    const stagedLines = stagedFiles.map((f) => {
      if (committedFiles[f] === undefined) return `\tnew file:   ${f}`;
      return `\tmodified:   ${f}`;
    });

    // Unstaged modified files
    const unstagedModified: string[] = [];
    const untracked: string[] = [];

    workingFiles.forEach((f) => {
      const stagedBlobId = state.index[f];
      const currentContent = state.workingDir[f];

      if (stagedBlobId) {
        const stagedBlob = state.objects[stagedBlobId] as BlobObject;
        if (stagedBlob && stagedBlob.content !== currentContent) {
          unstagedModified.push(`\tmodified:   ${f}`);
        }
      } else if (committedFiles[f] !== undefined) {
        if (committedFiles[f] !== currentContent) {
          unstagedModified.push(`\tmodified:   ${f}`);
        }
      } else {
        untracked.push(`\t${f}`);
      }
    });

    let output = `On branch ${branchName}\n`;
    if (!headCommitId) {
      output += "No commits yet\n\n";
    }

    if (state.conflicts && state.conflicts.length > 0) {
      output += `\nYou have unmerged paths. (fix conflicts and run 'git add <file>')\nUnmerged paths:\n`;
      state.conflicts.forEach((c) => {
        output += `\tboth modified:   ${c.file}\n`;
      });
      output += "\n";
    }

    if (stagedLines.length > 0) {
      output += `Changes to be committed:\n  (use "git restore --staged <file>..." to unstage)\n${stagedLines.join("\n")}\n\n`;
    }

    if (unstagedModified.length > 0) {
      output += `Changes not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n${unstagedModified.join("\n")}\n\n`;
    }

    if (untracked.length > 0) {
      output += `Untracked files:\n  (use "git add <file>..." to include in what will be committed)\n${untracked.join("\n")}\n\n`;
    }

    if (stagedLines.length === 0 && unstagedModified.length === 0 && untracked.length === 0) {
      output += "nothing to commit, working tree clean";
    }

    return { newState: { ...state, history }, output: output.trim() };
  }

  // ==================== GIT BRANCH ====================
  if (input === "git branch") {
    const branches = Object.keys(state.refs);
    if (branches.length === 0) {
      return { newState: { ...state, history }, output: "No branches exist yet." };
    }
    const currentBranch = state.HEAD?.type === "branch" ? state.HEAD.value : null;
    const output = branches
      .map((b) => (b === currentBranch ? `* \x1b[32m${b}\x1b[0m` : `  ${b}`))
      .join("\n");
    return { newState: { ...state, history }, output };
  }

  // git branch -d / -D <branch>
  if (input.startsWith("git branch -d ") || input.startsWith("git branch -D ")) {
    const branchName = input.replace(/git branch -[dD]\s+/, "").trim();
    if (!state.refs[branchName]) {
      return { newState: { ...state, history }, output: `error: branch '${branchName}' not found.` };
    }
    if (state.HEAD?.type === "branch" && state.HEAD.value === branchName) {
      return { newState: { ...state, history }, output: `error: Cannot delete the branch '${branchName}' which you are currently on.` };
    }
    const newRefs = { ...state.refs };
    delete newRefs[branchName];
    return {
      newState: { ...state, refs: newRefs, history },
      output: `Deleted branch ${branchName}.`,
    };
  }

  // git branch -m <old> <new> or git branch -m <new>
  if (input.startsWith("git branch -m ")) {
    const parts = input.slice(14).trim().split(/\s+/);
    let oldName = state.HEAD?.type === "branch" ? state.HEAD.value : "";
    let newName = parts[0];
    if (parts.length >= 2) {
      oldName = parts[0];
      newName = parts[1];
    }
    if (!state.refs[oldName]) {
      return { newState: { ...state, history }, output: `error: ref '${oldName}' not found` };
    }
    const newRefs = { ...state.refs };
    const commitId = newRefs[oldName];
    delete newRefs[oldName];
    newRefs[newName] = commitId;

    let newHEAD = state.HEAD;
    if (state.HEAD?.type === "branch" && state.HEAD.value === oldName) {
      newHEAD = { type: "branch", value: newName };
    }

    return {
      newState: { ...state, refs: newRefs, HEAD: newHEAD, history },
      output: `Renamed branch ${oldName} to ${newName}.`,
    };
  }

  // git branch <name>
  if (input.startsWith("git branch ")) {
    const branchName = input.slice(11).trim();
    if (!branchName || branchName.startsWith("-")) {
      return { newState: { ...state, history }, output: "fatal: not a valid object name: '" + branchName + "'" };
    }
    if (state.refs[branchName]) {
      return { newState: { ...state, history }, output: `fatal: A branch named '${branchName}' already exists.` };
    }
    const currentCommit =
      state.HEAD?.type === "branch"
        ? state.refs[state.HEAD.value]
        : state.HEAD?.value;

    return {
      newState: {
        ...state,
        refs: { ...state.refs, [branchName]: currentCommit || "" },
        history,
      },
      output: `Created branch '${branchName}' at ${currentCommit ? currentCommit.slice(0, 7) : "(initial)"}`,
    };
  }

  // ==================== GIT CHECKOUT / SWITCH ====================
  // git checkout -b <name> or git switch -c <name>
  if (input.startsWith("git checkout -b ") || input.startsWith("git switch -c ")) {
    const branchName = input.replace(/git (checkout -b|switch -c)\s+/, "").trim();
    if (!branchName) {
      return { newState: { ...state, history }, output: "fatal: missing branch name" };
    }
    if (state.refs[branchName]) {
      return { newState: { ...state, history }, output: `fatal: A branch named '${branchName}' already exists.` };
    }
    const currentCommit =
      state.HEAD?.type === "branch"
        ? state.refs[state.HEAD.value]
        : state.HEAD?.value;

    return {
      newState: {
        ...state,
        refs: { ...state.refs, [branchName]: currentCommit || "" },
        HEAD: { type: "branch", value: branchName },
        history,
      },
      output: `Switched to a new branch '${branchName}'`,
    };
  }

  // git checkout <target> or git switch <target>
  if (input.startsWith("git checkout ") || input.startsWith("git switch ")) {
    const target = input.replace(/git (checkout|switch)\s+/, "").trim();

    // 1. Switch to existing branch
    if (state.refs[target] !== undefined) {
      const commitId = state.refs[target];
      const commitObj = state.objects[commitId] as CommitObject;
      const targetFiles = getFilesFromTree(commitObj?.tree, state.objects);

      return {
        newState: {
          ...state,
          HEAD: { type: "branch", value: target },
          workingDir: Object.keys(targetFiles).length > 0 ? targetFiles : state.workingDir,
          index: {},
          history,
        },
        output: `Switched to branch '${target}'`,
      };
    }

    // 2. Checkout specific commit (detached HEAD)
    const commitMatch = Object.keys(state.objects).find(
      (id) => (id === target || id.includes(target) || id === `c_${target}`) && state.objects[id].type === "commit"
    );

    if (commitMatch) {
      const commitObj = state.objects[commitMatch] as CommitObject;
      const targetFiles = getFilesFromTree(commitObj?.tree, state.objects);

      return {
        newState: {
          ...state,
          HEAD: { type: "commit", value: commitMatch },
          workingDir: Object.keys(targetFiles).length > 0 ? targetFiles : state.workingDir,
          index: {},
          history,
        },
        output: `Note: switching to '${target}'.\nYou are in 'detached HEAD' state. You can look around, make experimental commits, or switch back with 'git switch main'.`,
      };
    }

    return {
      newState: { ...state, history },
      output: `error: pathspec '${target}' did not match any file(s) or branch name known to git`,
    };
  }

  // ==================== GIT MERGE ====================
  if (input.startsWith("git merge")) {
    const targetBranch = input.slice(9).trim();
    if (!targetBranch) {
      return { newState: { ...state, history }, output: "fatal: No branch specified to merge." };
    }

    const currentBranch = state.HEAD?.type === "branch" ? state.HEAD.value : null;
    if (!currentBranch) {
      return { newState: { ...state, history }, output: "fatal: You are in 'detached HEAD' state. Switch to a branch before merging." };
    }

    if (targetBranch === currentBranch) {
      return { newState: { ...state, history }, output: "Already up to date (cannot merge branch into itself)." };
    }

    const currentCommitId = state.refs[currentBranch];
    const targetCommitId = state.refs[targetBranch];

    if (targetCommitId === undefined) {
      return { newState: { ...state, history }, output: `merge: ${targetBranch} - not something we can merge` };
    }

    if (!currentCommitId) {
      // Current branch has no commits, fast-forward directly to target
      const targetCommit = state.objects[targetCommitId] as CommitObject;
      const targetFiles = getFilesFromTree(targetCommit?.tree, state.objects);
      return {
        newState: {
          ...state,
          refs: { ...state.refs, [currentBranch]: targetCommitId },
          workingDir: targetFiles,
          history,
        },
        output: `Fast-forward\nUpdated ${currentBranch} -> ${targetCommitId.slice(0, 7)}`,
      };
    }

    if (currentCommitId === targetCommitId) {
      return { newState: { ...state, history }, output: "Already up to date." };
    }

    // 1. Find Lowest Common Ancestor (LCA)
    const lca = findLCA(currentCommitId, targetCommitId, state.objects);

    // Fast-Forward Case: current commit is the ancestor of target commit
    if (lca === currentCommitId) {
      const targetCommit = state.objects[targetCommitId] as CommitObject;
      const targetFiles = getFilesFromTree(targetCommit?.tree, state.objects);
      return {
        newState: {
          ...state,
          refs: { ...state.refs, [currentBranch]: targetCommitId },
          workingDir: targetFiles,
          history,
        },
        output: `Updating ${currentCommitId.slice(0, 7)}..${targetCommitId.slice(0, 7)}\nFast-forward\nSwitched ${currentBranch} pointer directly to tip of ${targetBranch}.`,
      };
    }

    // Already merged case: target is an ancestor of current
    if (lca === targetCommitId) {
      return { newState: { ...state, history }, output: "Already up to date." };
    }

    // 2. 3-Way Merge Case
    const currentCommit = state.objects[currentCommitId] as CommitObject;
    const targetCommit = state.objects[targetCommitId] as CommitObject;
    const lcaCommit = lca ? (state.objects[lca] as CommitObject) : null;

    const currentFiles = getFilesFromTree(currentCommit?.tree, state.objects);
    const targetFiles = getFilesFromTree(targetCommit?.tree, state.objects);
    const lcaFiles = lcaCommit ? getFilesFromTree(lcaCommit.tree, state.objects) : {};

    const allFileKeys = Array.from(
      new Set([...Object.keys(currentFiles), ...Object.keys(targetFiles), ...Object.keys(lcaFiles)])
    );

    const mergedFiles: Record<string, string> = {};
    const conflicts: MergeConflict[] = [];

    for (const f of allFileKeys) {
      const baseContent = lcaFiles[f];
      const curContent = currentFiles[f];
      const tarContent = targetFiles[f];

      if (curContent === tarContent) {
        // Both kept identical or made same change
        if (curContent !== undefined) mergedFiles[f] = curContent;
      } else if (curContent === baseContent) {
        // Only target changed it
        if (tarContent !== undefined) mergedFiles[f] = tarContent;
      } else if (tarContent === baseContent) {
        // Only current branch changed it
        if (curContent !== undefined) mergedFiles[f] = curContent;
      } else {
        // Both changed it differently! CONFLICT!
        const conflictMarker = `<<<<<<< HEAD\n${curContent || ""}\n=======\n${tarContent || ""}\n>>>>>>> ${targetBranch}`;
        mergedFiles[f] = conflictMarker;
        conflicts.push({
          file: f,
          currentBranch,
          incomingBranch: targetBranch,
          currentContent: curContent || "",
          incomingContent: tarContent || "",
          resolved: false,
        });
      }
    }

    if (conflicts.length > 0) {
      return {
        newState: {
          ...state,
          workingDir: mergedFiles,
          conflicts,
          history,
        },
        output: `Auto-merging ${conflicts.map((c) => c.file).join(", ")}\nCONFLICT (content): Merge conflict in ${conflicts.map((c) => c.file).join(", ")}\nAutomatic merge failed; fix conflicts and then commit the result.`,
      };
    }

    // Clean 3-way merge! Auto-commit the merge commit
    const newObjects = { ...state.objects };
    const treeId = "t_" + generateHexSha();
    const treeEntries = Object.entries(mergedFiles).map(([name, content]) => {
      const blobId = "b_" + generateHexSha();
      newObjects[blobId] = { type: "blob", id: blobId, content, size: content.length };
      return { name, objectId: blobId, type: "blob" as const, mode: "100644" };
    });

    const treeObj: TreeObject = { type: "tree", id: treeId, entries: treeEntries };
    newObjects[treeId] = treeObj;

    const mergeCommitId = "c_" + generateHexSha();
    const mergeCommit: CommitObject = {
      type: "commit",
      id: mergeCommitId,
      tree: treeId,
      parents: [currentCommitId, targetCommitId],
      message: `Merge branch '${targetBranch}' into ${currentBranch}`,
      author: "OpenLabs Student <student@openlabs.org.in>",
      timestamp: Date.now(),
    };
    newObjects[mergeCommitId] = mergeCommit;

    return {
      newState: {
        ...state,
        objects: newObjects,
        refs: { ...state.refs, [currentBranch]: mergeCommitId },
        workingDir: mergedFiles,
        index: {},
        history,
      },
      output: `Merge made by the 'ort' strategy.\nCreated 3-way merge commit ${mergeCommitId.slice(0, 7)} with dual parents [${currentCommitId.slice(0, 7)}, ${targetCommitId.slice(0, 7)}].`,
    };
  }

  // ==================== GIT REBASE ====================
  if (input.startsWith("git rebase")) {
    const targetBranch = input.slice(10).trim();
    if (!targetBranch) {
      return { newState: { ...state, history }, output: "fatal: No rebase target specified." };
    }
    const currentBranch = state.HEAD?.type === "branch" ? state.HEAD.value : null;
    if (!currentBranch) {
      return { newState: { ...state, history }, output: "fatal: Cannot rebase from a detached HEAD." };
    }
    const currentCommitId = state.refs[currentBranch];
    const targetCommitId = state.refs[targetBranch];
    if (!targetCommitId) {
      return { newState: { ...state, history }, output: `fatal: invalid upstream '${targetBranch}'` };
    }

    const lca = findLCA(currentCommitId, targetCommitId, state.objects);
    if (!lca || lca === currentCommitId) {
      // Fast-forward rebase
      return {
        newState: {
          ...state,
          refs: { ...state.refs, [currentBranch]: targetCommitId },
          history,
        },
        output: `Fast-forwarded ${currentBranch} to ${targetBranch}.`,
      };
    }

    // Collect commits on currentBranch that are not in targetBranch
    const commitsToReplay: CommitObject[] = [];
    let cur = currentCommitId;
    while (cur && cur !== lca) {
      const c = state.objects[cur] as CommitObject;
      if (!c) break;
      commitsToReplay.unshift(c);
      cur = c.parents[0];
    }

    if (commitsToReplay.length === 0) {
      return { newState: { ...state, history }, output: `Current branch ${currentBranch} is already up to date.` };
    }

    let parentPointer = targetCommitId;
    const newObjects = { ...state.objects };

    commitsToReplay.forEach((c) => {
      const newCommitId = "c_" + generateHexSha();
      const replayedCommit: CommitObject = {
        ...c,
        id: newCommitId,
        parents: [parentPointer],
        timestamp: Date.now(),
      };
      newObjects[newCommitId] = replayedCommit;
      parentPointer = newCommitId;
    });

    const finalCommit = newObjects[parentPointer] as CommitObject;
    const finalFiles = getFilesFromTree(finalCommit?.tree, newObjects);

    return {
      newState: {
        ...state,
        objects: newObjects,
        refs: { ...state.refs, [currentBranch]: parentPointer },
        workingDir: finalFiles,
        history,
      },
      output: `Successfully rebased and updated refs/heads/${currentBranch}.\nReplayed ${commitsToReplay.length} commits onto tip of ${targetBranch}.`,
    };
  }

  // ==================== GIT CHERRY-PICK ====================
  if (input.startsWith("git cherry-pick")) {
    const targetId = input.slice(15).trim();
    const commitToPick = Object.keys(state.objects).find(
      (id) => (id === targetId || id.includes(targetId)) && state.objects[id].type === "commit"
    );

    if (!commitToPick) {
      return { newState: { ...state, history }, output: `fatal: bad revision '${targetId}'` };
    }

    const sourceCommit = state.objects[commitToPick] as CommitObject;
    const currentCommitId = state.HEAD?.type === "branch" ? state.refs[state.HEAD.value] : state.HEAD?.value;

    const newCommitId = "c_" + generateHexSha();
    const pickedCommit: CommitObject = {
      ...sourceCommit,
      id: newCommitId,
      parents: currentCommitId ? [currentCommitId] : [],
      message: `${sourceCommit.message} (cherry picked from commit ${sourceCommit.id.slice(0, 7)})`,
      timestamp: Date.now(),
    };

    const newObjects = {
      ...state.objects,
      [newCommitId]: pickedCommit,
    };

    let newRefs = { ...state.refs };
    let newHead = state.HEAD;

    if (state.HEAD?.type === "branch") {
      newRefs[state.HEAD.value] = newCommitId;
    } else {
      newHead = { type: "commit", value: newCommitId };
    }

    return {
      newState: {
        ...state,
        objects: newObjects,
        refs: newRefs,
        HEAD: newHead,
        history,
      },
      output: `[${state.HEAD?.value || "detached"} ${newCommitId.slice(2)}] ${pickedCommit.message}`,
    };
  }

  // ==================== GIT REVERT ====================
  if (input.startsWith("git revert")) {
    const targetId = input.slice(10).trim();
    const commitToRevert = Object.keys(state.objects).find(
      (id) => (id === targetId || id.includes(targetId) || (targetId === "HEAD" && id === (state.HEAD?.type === "branch" ? state.refs[state.HEAD.value] : state.HEAD?.value))) && state.objects[id].type === "commit"
    );

    if (!commitToRevert) {
      return { newState: { ...state, history }, output: `fatal: bad revision '${targetId}'` };
    }

    const sourceCommit = state.objects[commitToRevert] as CommitObject;
    const currentCommitId = state.HEAD?.type === "branch" ? state.refs[state.HEAD.value] : state.HEAD?.value;

    const parentId = sourceCommit.parents[0];
    const parentTree = parentId ? (state.objects[parentId] as CommitObject)?.tree : undefined;
    const restoredFiles = getFilesFromTree(parentTree, state.objects);

    const newCommitId = "c_" + generateHexSha();
    const revertCommit: CommitObject = {
      type: "commit",
      id: newCommitId,
      tree: parentTree || "t_" + generateHexSha(),
      parents: currentCommitId ? [currentCommitId] : [],
      message: `Revert "${sourceCommit.message}"\n\nThis reverts commit ${sourceCommit.id}.`,
      author: "OpenLabs Student <student@openlabs.org.in>",
      timestamp: Date.now(),
    };

    const newObjects = {
      ...state.objects,
      [newCommitId]: revertCommit,
    };

    let newRefs = { ...state.refs };
    if (state.HEAD?.type === "branch") {
      newRefs[state.HEAD.value] = newCommitId;
    }

    return {
      newState: {
        ...state,
        objects: newObjects,
        refs: newRefs,
        workingDir: restoredFiles,
        history,
      },
      output: `[${state.HEAD?.value || "detached"} ${newCommitId.slice(2)}] Revert "${sourceCommit.message}"\nCreated inverse commit undoing ${sourceCommit.id.slice(0, 7)}.`,
    };
  }

  // ==================== GIT RESET ====================
  if (input.startsWith("git reset")) {
    const parts = input.slice(9).trim().split(/\s+/);
    let mode = "--mixed";
    let target = parts[0];

    if (parts[0]?.startsWith("--")) {
      mode = parts[0];
      target = parts[1];
    }

    if (!target) {
      return { newState: { ...state, history }, output: "fatal: ambiguous argument: no commit specified" };
    }

    const commitMatch = Object.keys(state.objects).find(
      (id) => (id === target || id.includes(target)) && state.objects[id].type === "commit"
    );

    if (!commitMatch) {
      return { newState: { ...state, history }, output: `fatal: Cannot do reset to '${target}'` };
    }

    let newState = { ...state, history };
    if (newState.HEAD?.type === "branch") {
      newState.refs = { ...newState.refs, [newState.HEAD.value]: commitMatch };
    } else {
      newState.HEAD = { type: "commit", value: commitMatch };
    }

    if (mode === "--hard") {
      const commitObj = state.objects[commitMatch] as CommitObject;
      const files = getFilesFromTree(commitObj?.tree, state.objects);
      newState.index = {};
      newState.workingDir = files;
    } else if (mode === "--mixed") {
      newState.index = {};
    }

    return {
      newState,
      output: `HEAD is now at ${commitMatch.slice(0, 7)} (${mode})`,
    };
  }

  // ==================== GIT STASH ====================
  if (input === "git stash" || input.startsWith("git stash push")) {
    const hasUncommitted =
      Object.keys(state.index).length > 0 ||
      Object.keys(state.workingDir).length > 0;

    if (!hasUncommitted) {
      return { newState: { ...state, history }, output: "No local changes to save" };
    }

    const stashId = "stash@{" + (state.stash?.length || 0) + "}";
    const branch = state.HEAD?.type === "branch" ? state.HEAD.value : "detached";
    const msg = input.includes("-m")
      ? input.split("-m")[1]?.replace(/["']/g, "").trim() || "WIP on " + branch
      : `WIP on ${branch}: ${new Date().toLocaleTimeString()}`;

    const newStashItem: StashItem = {
      id: stashId,
      message: msg,
      branch,
      workingDir: { ...state.workingDir },
      index: { ...state.index },
      timestamp: Date.now(),
    };

    // Revert working directory to HEAD commit tree
    const currentCommitId = state.HEAD?.type === "branch" ? state.refs[state.HEAD.value] : state.HEAD?.value;
    const headFiles = currentCommitId ? getFilesFromTree((state.objects[currentCommitId] as CommitObject)?.tree, state.objects) : {};

    return {
      newState: {
        ...state,
        workingDir: headFiles,
        index: {},
        stash: [newStashItem, ...(state.stash || [])],
        history,
      },
      output: `Saved working directory and index state "${msg}"\nWorking tree clean.`,
    };
  }

  if (input === "git stash list") {
    if (!state.stash || state.stash.length === 0) {
      return { newState: { ...state, history }, output: "Stash is empty." };
    }
    const output = state.stash
      .map((s, idx) => `stash@{${idx}}: ${s.message}`)
      .join("\n");
    return { newState: { ...state, history }, output };
  }

  if (input === "git stash pop") {
    if (!state.stash || state.stash.length === 0) {
      return { newState: { ...state, history }, output: "error: No stash entries found." };
    }
    const [popped, ...restStash] = state.stash;
    return {
      newState: {
        ...state,
        workingDir: { ...state.workingDir, ...popped.workingDir },
        index: { ...state.index, ...popped.index },
        stash: restStash,
        history,
      },
      output: `Dropped ${popped.id} (${popped.message})\nRestored uncommitted modifications to working tree and staging area.`,
    };
  }

  if (input === "git stash drop" || input === "git stash clear") {
    return {
      newState: { ...state, stash: [], history },
      output: "Dropped all stash entries.",
    };
  }

  // ==================== GIT TAG ====================
  if (input === "git tag") {
    const tags = Object.keys(state.tags || {});
    return {
      newState: { ...state, history },
      output: tags.length > 0 ? tags.join("\n") : "No tags defined.",
    };
  }

  if (input.startsWith("git tag -d ")) {
    const tagName = input.slice(11).trim();
    const newTags = { ...(state.tags || {}) };
    delete newTags[tagName];
    return {
      newState: { ...state, tags: newTags, history },
      output: `Deleted tag '${tagName}'`,
    };
  }

  if (input.startsWith("git tag ")) {
    const parts = input.slice(8).trim().split(/\s+/);
    const tagName = parts[0];
    const targetCommit = parts[1] || (state.HEAD?.type === "branch" ? state.refs[state.HEAD.value] : state.HEAD?.value);

    if (!targetCommit) {
      return { newState: { ...state, history }, output: "fatal: Failed to resolve 'HEAD' as a valid ref." };
    }

    const tagObj: TagObject = {
      type: "tag",
      id: "tag_" + generateHexSha(),
      name: tagName,
      commitId: targetCommit,
    };

    return {
      newState: {
        ...state,
        tags: { ...(state.tags || {}), [tagName]: targetCommit },
        objects: { ...state.objects, [tagObj.id]: tagObj },
        history,
      },
      output: `Created tag '${tagName}' pointing to ${targetCommit.slice(0, 7)}`,
    };
  }

  // ==================== GIT LOG ====================
  if (input.startsWith("git log")) {
    const isOneLine = input.includes("--oneline");
    const isGraph = input.includes("--graph");

    const startCommit =
      state.HEAD?.type === "branch"
        ? state.refs[state.HEAD.value]
        : state.HEAD?.value;

    if (!startCommit) {
      return { newState: { ...state, history }, output: "fatal: your current branch does not have any commits yet" };
    }

    // Topological/linear traverse from startCommit
    const commits: CommitObject[] = [];
    const queue = [startCommit];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);

      const commit = state.objects[id] as CommitObject;
      if (commit && commit.type === "commit") {
        commits.push(commit);
        commit.parents.forEach((p) => queue.push(p));
      }
    }

    if (commits.length === 0) {
      return { newState: { ...state, history }, output: "No commits." };
    }

    let output = "";
    commits.forEach((c) => {
      // Find branch or tag labels
      const branchLabels = Object.entries(state.refs)
        .filter(([, id]) => id === c.id)
        .map(([b]) => (b === state.HEAD?.value ? `HEAD -> ${b}` : b));

      const tagLabels = Object.entries(state.tags || {})
        .filter(([, id]) => id === c.id)
        .map(([t]) => `tag: ${t}`);

      const allDecorations = [...branchLabels, ...tagLabels];
      const decorationStr = allDecorations.length > 0 ? ` (${allDecorations.join(", ")})` : "";

      if (isOneLine) {
        output += `${c.id.slice(0, 7)}${decorationStr} ${c.message}\n`;
      } else {
        output += `commit ${c.id}${decorationStr}\n`;
        if (c.parents.length > 1) {
          output += `Merge: ${c.parents.map((p) => p.slice(0, 7)).join(" ")}\n`;
        }
        output += `Author: ${c.author || "OpenLabs Contributor <dev@openlabs.org.in>"}\n`;
        output += `Date:   ${new Date(c.timestamp || Date.now()).toUTCString()}\n\n`;
        output += `    ${c.message}\n\n`;
      }
    });

    return { newState: { ...state, history }, output: output.trim() };
  }

  // ==================== GIT DIFF ====================
  if (input === "git diff" || input === "git diff --staged") {
    const isStaged = input.includes("--staged");
    const headCommitId = state.HEAD?.type === "branch" ? state.refs[state.HEAD.value] : state.HEAD?.value;
    const committedFiles = getFilesFromTree((state.objects[headCommitId || ""] as CommitObject)?.tree, state.objects);

    let output = "";

    if (isStaged) {
      // Compare Staging Index vs HEAD
      Object.entries(state.index).forEach(([file, blobId]) => {
        const stagedBlob = state.objects[blobId] as BlobObject;
        const oldContent = committedFiles[file] || "";
        const newContent = stagedBlob?.content || "";

        output += `diff --git a/${file} b/${file}\n`;
        output += `--- a/${file}\n+++ b/${file}\n`;
        if (oldContent) output += `-${oldContent.replace(/\n/g, "\n-")}\n`;
        if (newContent) output += `+${newContent.replace(/\n/g, "\n+")}\n`;
      });
    } else {
      // Compare Working Tree vs Staging Index (or HEAD)
      Object.entries(state.workingDir).forEach(([file, currentContent]) => {
        const stagedId = state.index[file];
        const baseContent = stagedId
          ? (state.objects[stagedId] as BlobObject)?.content || ""
          : committedFiles[file] || "";

        if (currentContent !== baseContent) {
          output += `diff --git a/${file} b/${file}\n`;
          output += `--- a/${file}\n+++ b/${file}\n`;
          if (baseContent) output += `-${baseContent.replace(/\n/g, "\n-")}\n`;
          if (currentContent) output += `+${currentContent.replace(/\n/g, "\n+")}\n`;
        }
      });
    }

    return {
      newState: { ...state, history },
      output: output.trim() || "No diff found.",
    };
  }

  // ==================== GIT SHOW ====================
  if (input.startsWith("git show")) {
    const target = input.slice(8).trim() || (state.HEAD?.type === "branch" ? state.refs[state.HEAD.value] : state.HEAD?.value);
    const commitMatch = Object.keys(state.objects).find(
      (id) => (id === target || id.includes(target || "")) && state.objects[id].type === "commit"
    );

    if (!commitMatch) {
      return { newState: { ...state, history }, output: `fatal: bad object ${target}` };
    }

    const c = state.objects[commitMatch] as CommitObject;
    let output = `commit ${c.id}\n`;
    output += `Author: ${c.author || "Dev <dev@openlabs.org.in>"}\n`;
    output += `Date:   ${new Date(c.timestamp || Date.now()).toUTCString()}\n\n`;
    output += `    ${c.message}\n\n`;

    const tree = state.objects[c.tree] as TreeObject;
    if (tree && tree.entries) {
      output += `Tree entries in this commit:\n`;
      tree.entries.forEach((e) => {
        output += `  ${e.mode || "100644"} ${e.type} ${e.objectId.slice(0, 7)}  ${e.name}\n`;
      });
    }

    return { newState: { ...state, history }, output };
  }

  // ==================== UNKNOWN COMMAND ====================
  return {
    newState: { ...state, history },
    output: `git: '${input}' is not a valid git command. See 'git help' for a list of supported commands.`,
  };
}