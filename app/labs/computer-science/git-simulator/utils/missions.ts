import { RepoState, CommitObject } from "@/app/types/gitSimualtor";

export type MissionDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface GitMission {
  id: string;
  order: number;
  title: string;
  difficulty: MissionDifficulty;
  xpReward: number;
  category: "Basics" | "Branching" | "Merging" | "Advanced Workflows";
  scenario: string;
  objective: string;
  hints: string[];
  recommendedCommands: string[];
  initialPreset?: "clean" | "feature-branch" | "merge-conflict" | "detached-head" | "rebase-ready" | "stash-demo";
  validator: (state: RepoState) => { passed: boolean; message: string };
}

export const GIT_MISSIONS: GitMission[] = [
  {
    id: "mission-init",
    order: 1,
    title: "Genesis: First Repository & Snapshot",
    difficulty: "Beginner",
    xpReward: 30,
    category: "Basics",
    scenario:
      "You just started a new software project. You need to create an empty Git repository, add your first source code file, and record your inaugural commit.",
    objective: "Initialize the repository with `git init`, create and stage a file (`git add`), then commit with `git commit -m '<message>'`.",
    hints: [
      "Step 1: Run `git init`",
      "Step 2: Create a file with `touch index.js`",
      "Step 3: Stage it with `git add index.js` (or `git add .`)",
      "Step 4: Commit with `git commit -m 'Initial commit'`",
    ],
    recommendedCommands: ["git init", "touch index.js", "git add .", 'git commit -m "Initial commit"'],
    validator: (state: RepoState) => {
      if (!state.initialized) {
        return { passed: false, message: "Repository is not initialized yet. Run `git init`." };
      }
      const commits = Object.values(state.objects).filter((o) => o.type === "commit");
      if (commits.length === 0) {
        return { passed: false, message: "No commits found. Stage a file and run `git commit -m '...'`." };
      }
      return { passed: true, message: "First snapshot committed! You've mastered repository initialization." };
    },
  },
  {
    id: "mission-branch",
    order: 2,
    title: "Parallel Universes: Branching Out",
    difficulty: "Beginner",
    xpReward: 35,
    category: "Branching",
    scenario:
      "Working directly on main is risky for experimental features. Create an isolated feature branch so you can work safely without disrupting production.",
    objective: "Create and switch to a new branch named `feature/ui` or `feature/login`.",
    hints: [
      "Use `git branch feature/ui` followed by `git checkout feature/ui`",
      "Or use the modern shortcut: `git checkout -b feature/ui` (or `git switch -c feature/ui`)",
    ],
    recommendedCommands: ["git checkout -b feature/ui", "git branch", "git status"],
    initialPreset: "clean",
    validator: (state: RepoState) => {
      if (!state.initialized) {
        return { passed: false, message: "Repository not initialized." };
      }
      const activeBranch = state.HEAD?.type === "branch" ? state.HEAD.value : "";
      const branches = Object.keys(state.refs);
      const hasFeature = branches.some((b) => b.startsWith("feature/") || b === "feature");
      const onFeature = activeBranch.startsWith("feature/") || activeBranch === "feature";

      if (!hasFeature) {
        return { passed: false, message: "No branch starting with 'feature/' was found. Run `git branch feature/ui`." };
      }
      if (!onFeature) {
        return { passed: false, message: `Branch created, but HEAD is currently on '${activeBranch}'. Switch using \`git checkout feature/ui\`.` };
      }
      return { passed: true, message: `Awesome! You are now working on branch '${activeBranch}' safely.` };
    },
  },
  {
    id: "mission-fast-forward",
    order: 3,
    title: "The Straight Path: Fast-Forward Merge",
    difficulty: "Intermediate",
    xpReward: 40,
    category: "Merging",
    scenario:
      "Your feature branch work is complete and tested! Since no one touched `main` while you were working, you can perform a clean Fast-Forward merge where main simply catches up.",
    objective: "Create a commit on `feature/auth`, switch back to `main`, and run `git merge feature/auth`.",
    hints: [
      "Ensure you are on `feature/auth` and make a commit (e.g. `touch auth.js`, `git add .`, `git commit -m 'feat: auth'`)",
      "Switch back to main: `git checkout main`",
      "Merge feature/auth: `git merge feature/auth`",
      "Observe how main pointer advances directly to the feature commit without an extra merge commit!",
    ],
    recommendedCommands: ["git checkout main", "git merge feature/auth", "git log --oneline"],
    initialPreset: "clean",
    validator: (state: RepoState) => {
      const mainCommit = state.refs["main"];
      const featureBranch = Object.keys(state.refs).find((b) => b.startsWith("feature"));
      if (!featureBranch) {
        return { passed: false, message: "Create a feature branch first." };
      }
      const featureCommit = state.refs[featureBranch];
      if (!mainCommit || !featureCommit) {
        return { passed: false, message: "Both main and feature must have commits." };
      }
      if (mainCommit !== featureCommit) {
        return { passed: false, message: "main is not pointing to the same commit as your feature branch. Checkout main and run `git merge " + featureBranch + "`." };
      }
      const commits = Object.values(state.objects).filter((o) => o.type === "commit");
      if (commits.length < 2) {
        return { passed: false, message: "Commit at least one change on the feature branch before merging." };
      }
      return { passed: true, message: "Fast-forward merge successful! main advanced directly to feature tip." };
    },
  },
  {
    id: "mission-divergent",
    order: 4,
    title: "Confluence: 3-Way Merge Commit",
    difficulty: "Intermediate",
    xpReward: 45,
    category: "Merging",
    scenario:
      "Both `main` and your colleague's branch `dev` have progressed independently. Merging them requires Git to create a dedicated 3-Way Merge Commit with dual parent references.",
    objective: "Merge branch `feature/auth` into `main` when both have independent commits, creating a merge commit.",
    hints: [
      "Notice the visual graph: `main` has a commit, and `feature/auth` has diverged commits",
      "Switch to main: `git checkout main`",
      "Run `git merge feature/auth`",
      "Inspect the newly generated merge commit with 2 parents!",
    ],
    recommendedCommands: ["git checkout main", "git merge feature/auth", "git log --graph"],
    initialPreset: "feature-branch",
    validator: (state: RepoState) => {
      const currentCommitId = state.HEAD?.type === "branch" ? state.refs[state.HEAD.value] : state.HEAD?.value;
      if (!currentCommitId) return { passed: false, message: "No active commit found." };

      const currentCommit = state.objects[currentCommitId] as CommitObject;
      if (!currentCommit || currentCommit.type !== "commit") {
        return { passed: false, message: "HEAD does not point to a valid commit." };
      }

      if (currentCommit.parents && currentCommit.parents.length >= 2) {
        return { passed: true, message: `3-Way merge completed! Commit ${currentCommitId} successfully unified two parent histories.` };
      }

      return { passed: false, message: "Active commit is not a merge commit. Checkout main and run `git merge feature/auth`." };
    },
  },
  {
    id: "mission-conflict",
    order: 5,
    title: "High Noon: Resolving Merge Conflicts",
    difficulty: "Advanced",
    xpReward: 60,
    category: "Merging",
    scenario:
      "Two developers edited the exact same line in `styles.css`. Git halts the merge and injects conflict markers (`<<<<<<< HEAD`). You must inspect the file, resolve the conflict, stage it, and commit the resolution.",
    objective: "Run `git merge bugfix/theme`, resolve the conflict in `styles.css`, stage with `git add styles.css`, and commit.",
    hints: [
      "Run `git merge bugfix/theme` to trigger the conflict",
      "Run `git status` to see the conflicting unmerged file",
      "Edit or stage the file: `git add styles.css`",
      "Finalize the merge: `git commit -m 'fix: resolve theme styling conflict'`",
    ],
    recommendedCommands: ["git merge bugfix/theme", "git status", "git add styles.css", 'git commit -m "resolve conflict"'],
    initialPreset: "merge-conflict",
    validator: (state: RepoState) => {
      const activeCommitId = state.HEAD?.type === "branch" ? state.refs[state.HEAD.value] : state.HEAD?.value;
      const activeCommit = state.objects[activeCommitId || ""] as CommitObject;

      // If active commit is a merge commit (2 parents) and there are no active conflicts
      if (activeCommit && activeCommit.parents?.length >= 2 && (!state.conflicts || state.conflicts.length === 0)) {
        return { passed: true, message: "Conflict resolved and merge finalized cleanly! Excellent work under pressure." };
      }

      if (state.conflicts && state.conflicts.length > 0) {
        return { passed: false, message: "Merge conflict detected! Run `git add styles.css` and `git commit` to finalize." };
      }

      return { passed: false, message: "Run `git merge bugfix/theme` to initiate the conflict scenario." };
    },
  },
  {
    id: "mission-detached",
    order: 6,
    title: "Time Traveler: The Detached HEAD State",
    difficulty: "Intermediate",
    xpReward: 40,
    category: "Advanced Workflows",
    scenario:
      "A bug was reported in an older version. Check out a historical commit directly by its hash rather than a branch name, placing your workspace into detached HEAD mode.",
    objective: "Use `git checkout <commitId>` or `git switch --detach <commitId>` to detach HEAD at an earlier commit.",
    hints: [
      "Run `git log --oneline` to see available commit hashes",
      "Copy the hash of an earlier commit (e.g. root commit)",
      "Run `git checkout <commitHash>`",
      "Observe the yellow warning: HEAD now points directly to a commit, not a branch!",
    ],
    recommendedCommands: ["git log --oneline", "git checkout c400001", "git status"],
    initialPreset: "clean",
    validator: (state: RepoState) => {
      if (state.HEAD?.type === "commit") {
        return { passed: true, message: `HEAD is successfully detached at commit ${state.HEAD.value}!` };
      }
      return { passed: false, message: "HEAD is currently attached to branch '" + (state.HEAD?.value || "") + "'. Use `git checkout <commitId>` to detach." };
    },
  },
  {
    id: "mission-revert",
    order: 7,
    title: "Safe Rewind: Reverting a Broken Commit",
    difficulty: "Intermediate",
    xpReward: 45,
    category: "Advanced Workflows",
    scenario:
      "In public repositories, rewriting history with `git reset` breaks your teammates' branches. Use `git revert <commitId>` to create an inverse commit that undoes the mistake without destroying history.",
    objective: "Revert the latest commit on main using `git revert <commitId>`.",
    hints: [
      "Run `git log --oneline` to locate the commit hash you want to undo",
      "Run `git revert <commitId>` (or `git revert HEAD`)",
      "Observe a new commit created with message 'Revert \"...\"'",
    ],
    recommendedCommands: ["git log --oneline", "git revert HEAD", "git log"],
    initialPreset: "clean",
    validator: (state: RepoState) => {
      const commits = Object.values(state.objects).filter((o) => o.type === "commit") as CommitObject[];
      const hasRevertCommit = commits.some((c) => c.message.toLowerCase().includes("revert"));
      if (hasRevertCommit) {
        return { passed: true, message: "Commit reverted safely with an inverse commit! Clean public history preserved." };
      }
      return { passed: false, message: "No revert commit detected. Run `git revert <commitId>`." };
    },
  },
  {
    id: "mission-rebase",
    order: 8,
    title: "Clean History: Rebasing a Feature Branch",
    difficulty: "Advanced",
    xpReward: 55,
    category: "Advanced Workflows",
    scenario:
      "Main has moved forward with 2 new commits. Instead of a messy merge commit, rebase your feature branch onto main to linearize your history.",
    objective: "Switch to `feature/search` and run `git rebase main` to replay your feature commits on top of updated main.",
    hints: [
      "Ensure you are on the feature branch: `git checkout feature/search`",
      "Run `git rebase main`",
      "Notice how the base of feature/search moves from the old root to the current tip of main!",
    ],
    recommendedCommands: ["git checkout feature/search", "git rebase main", "git log --graph"],
    initialPreset: "rebase-ready",
    validator: (state: RepoState) => {
      const activeBranch = state.HEAD?.type === "branch" ? state.HEAD.value : "";
      if (activeBranch !== "feature/search") {
        return { passed: false, message: "Please checkout `feature/search` and run `git rebase main`." };
      }
      const mainCommit = state.refs["main"];
      const featureCommit = state.refs["feature/search"];
      if (!mainCommit || !featureCommit) return { passed: false, message: "Branches missing." };

      // In a rebased tree, main's commit must be in the ancestry chain of feature/search
      let cur: string | undefined = featureCommit;
      let foundMain = false;
      const visited = new Set<string>();

      while (cur && !visited.has(cur)) {
        visited.add(cur);
        if (cur === mainCommit) {
          foundMain = true;
          break;
        }
        const c = state.objects[cur] as CommitObject;
        cur = c?.parents?.[0];
      }

      if (foundMain) {
        return { passed: true, message: "Rebase successful! feature/search now neatly builds directly on top of main." };
      }

      return { passed: false, message: "Run `git rebase main` on branch feature/search." };
    },
  },
  {
    id: "mission-stash",
    order: 9,
    title: "Clean Desk: Shelving Changes with Git Stash",
    difficulty: "Intermediate",
    xpReward: 40,
    category: "Basics",
    scenario:
      "You have half-finished edits in your working directory, but urgent work requires switching branches. You cannot commit unfinished code. Stash your changes, switch, and pop them later.",
    objective: "Run `git stash` to save dirty working tree changes, verify the clean working tree, then run `git stash pop`.",
    hints: [
      "Run `git status` to observe modified files",
      "Run `git stash` to shelve them safely",
      "Verify with `git status` that working tree is clean",
      "Restore your work with `git stash pop`",
    ],
    recommendedCommands: ["git status", "git stash", "git stash list", "git stash pop"],
    initialPreset: "stash-demo",
    validator: (state: RepoState) => {
      const hasStashed = (state.stash && state.stash.length > 0) || (state.history && state.history.some((cmd) => cmd.includes("git stash")));
      if (hasStashed) {
        return { passed: true, message: "Git stash command executed! Work shelved and restored with surgical precision." };
      }
      return { passed: false, message: "Run `git stash` to save current uncommitted modifications into the stash." };
    },
  },
  {
    id: "mission-cherry-pick",
    order: 10,
    title: "Precision Surgery: Cherry-Picking a Hotfix",
    difficulty: "Advanced",
    xpReward: 50,
    category: "Advanced Workflows",
    scenario:
      "A critical bugfix was committed on branch `feature/auth` (`c200003`), but the rest of the branch is not ready for release. Cherry-pick only that specific commit into `main`.",
    objective: "Switch to `main` and run `git cherry-pick c200003` to graft just that single fix onto production.",
    hints: [
      "Switch to main: `git checkout main`",
      "Find the commit hash on feature: e.g. `c200003`",
      "Run `git cherry-pick c200003`",
      "Check `git log`: a brand-new commit with the same message and changes now exists on main!",
    ],
    recommendedCommands: ["git checkout main", "git cherry-pick c200003", "git log --oneline"],
    initialPreset: "feature-branch",
    validator: (state: RepoState) => {
      const activeBranch = state.HEAD?.type === "branch" ? state.HEAD.value : "";
      if (activeBranch !== "main") {
        return { passed: false, message: "Checkout `main` before cherry-picking: `git checkout main`." };
      }
      const commits = Object.values(state.objects).filter((o) => o.type === "commit") as CommitObject[];
      const cherryPicked = commits.filter((c) => c.message.includes("initial JWT authentication helper") || c.message.includes("auth"));
      if (cherryPicked.length >= 2) {
        return { passed: true, message: "Cherry-pick successful! You applied the isolated commit without merging unready code." };
      }
      return { passed: false, message: "Run `git cherry-pick c200003` while on branch main." };
    },
  },
];
