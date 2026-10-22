import { RepoState, CommitObject, TreeObject, BlobObject } from "@/app/types/gitSimualtor";

export type PresetKey =
  | "clean"
  | "feature-branch"
  | "merge-conflict"
  | "detached-head"
  | "rebase-ready"
  | "stash-demo"
  | "custom";

export interface PresetMeta {
  id: PresetKey;
  name: string;
  badge: string;
  description: string;
  recommendedCommand: string;
}

export const PRESET_METAS: PresetMeta[] = [
  {
    id: "clean",
    name: "Clean Starter Repo",
    badge: "Basic",
    description: "Initialized repository with an initial commit on main.",
    recommendedCommand: "git checkout -b feature/login",
  },
  {
    id: "feature-branch",
    name: "Feature Branch Workflow",
    badge: "Branching",
    description: "main and feature/auth diverged with independent commits.",
    recommendedCommand: "git merge feature/auth",
  },
  {
    id: "merge-conflict",
    name: "Merge Conflict Simulator",
    badge: "Advanced",
    description: "main and bugfix/theme both modified styles.css with conflicting code.",
    recommendedCommand: "git merge bugfix/theme",
  },
  {
    id: "detached-head",
    name: "Detached HEAD State",
    badge: "Inspection",
    description: "HEAD is detached directly onto an earlier commit rather than a branch.",
    recommendedCommand: "git switch main",
  },
  {
    id: "rebase-ready",
    name: "Rebase vs Merge Playground",
    badge: "Rebase",
    description: "main has advanced ahead of feature/search. Ready for git rebase main.",
    recommendedCommand: "git rebase main",
  },
  {
    id: "stash-demo",
    name: "Git Stash & Dirty Tree",
    badge: "Stash",
    description: "Uncommitted edits in working directory and staging area.",
    recommendedCommand: "git stash",
  },
];

/**
 * Creates deterministic sample objects and states for the presets.
 */
export function getPresetState(preset: PresetKey): RepoState {
  switch (preset) {
    case "clean": {
      const blobReadme: BlobObject = {
        type: "blob",
        id: "b101010",
        content: "# OpenLabs Project\nWelcome to interactive Git simulation.",
        size: 56,
      };
      const blobCode: BlobObject = {
        type: "blob",
        id: "b101020",
        content: 'console.log("Hello, OpenLabs!");',
        size: 32,
      };
      const tree1: TreeObject = {
        type: "tree",
        id: "t101000",
        entries: [
          { name: "README.md", objectId: blobReadme.id, type: "blob" },
          { name: "index.js", objectId: blobCode.id, type: "blob" },
        ],
      };
      const commit1: CommitObject = {
        type: "commit",
        id: "c100001",
        tree: tree1.id,
        parents: [],
        message: "Initial commit: add project scaffold and README",
        author: "Dev <dev@openlabs.org.in>",
        timestamp: Date.now() - 3600000 * 2,
        diffs: [
          { file: "README.md", status: "added", newContent: blobReadme.content },
          { file: "index.js", status: "added", newContent: blobCode.content },
        ],
      };

      return {
        initialized: true,
        objects: {
          [blobReadme.id]: blobReadme,
          [blobCode.id]: blobCode,
          [tree1.id]: tree1,
          [commit1.id]: commit1,
        },
        refs: {
          main: commit1.id,
        },
        tags: {
          "v0.1.0": commit1.id,
        },
        HEAD: {
          type: "branch",
          value: "main",
        },
        index: {},
        workingDir: {
          "README.md": blobReadme.content,
          "index.js": blobCode.content,
        },
        stash: [],
        conflicts: [],
        history: ["git init", "git add .", 'git commit -m "Initial commit"'],
      };
    }

    case "feature-branch": {
      // Commit 1 (root)
      const b1: BlobObject = { type: "blob", id: "b201", content: "# My App", size: 9 };
      const t1: TreeObject = { type: "tree", id: "t201", entries: [{ name: "README.md", objectId: b1.id, type: "blob" }] };
      const c1: CommitObject = {
        type: "commit",
        id: "c200001",
        tree: t1.id,
        parents: [],
        message: "feat: setup project baseline",
        author: "Lead <lead@openlabs.org.in>",
        timestamp: Date.now() - 3600000 * 5,
      };

      // Commit 2 on main
      const b2: BlobObject = { type: "blob", id: "b202", content: "const PORT = 3000;\napp.listen(PORT);", size: 36 };
      const t2: TreeObject = {
        type: "tree",
        id: "t202",
        entries: [
          { name: "README.md", objectId: b1.id, type: "blob" },
          { name: "server.js", objectId: b2.id, type: "blob" },
        ],
      };
      const c2: CommitObject = {
        type: "commit",
        id: "c200002",
        tree: t2.id,
        parents: [c1.id],
        message: "chore: add express server listener",
        author: "Lead <lead@openlabs.org.in>",
        timestamp: Date.now() - 3600000 * 4,
      };

      // Commit 3 on feature/auth (branched from c1)
      const b3: BlobObject = { type: "blob", id: "b203", content: "export function auth() { return true; }", size: 39 };
      const t3: TreeObject = {
        type: "tree",
        id: "t203",
        entries: [
          { name: "README.md", objectId: b1.id, type: "blob" },
          { name: "auth.js", objectId: b3.id, type: "blob" },
        ],
      };
      const c3: CommitObject = {
        type: "commit",
        id: "c200003",
        tree: t3.id,
        parents: [c1.id],
        message: "feat(auth): initial JWT authentication helper",
        author: "Contributor <dev@openlabs.org.in>",
        timestamp: Date.now() - 3600000 * 3,
      };

      // Commit 4 on feature/auth
      const b4: BlobObject = { type: "blob", id: "b204", content: "export function login() { return 'token_jwt'; }", size: 48 };
      const t4: TreeObject = {
        type: "tree",
        id: "t204",
        entries: [
          { name: "README.md", objectId: b1.id, type: "blob" },
          { name: "auth.js", objectId: b4.id, type: "blob" },
        ],
      };
      const c4: CommitObject = {
        type: "commit",
        id: "c200004",
        tree: t4.id,
        parents: [c3.id],
        message: "feat(auth): add login handler with JWT generation",
        author: "Contributor <dev@openlabs.org.in>",
        timestamp: Date.now() - 3600000 * 1,
      };

      return {
        initialized: true,
        objects: {
          [b1.id]: b1,
          [b2.id]: b2,
          [b3.id]: b3,
          [b4.id]: b4,
          [t1.id]: t1,
          [t2.id]: t2,
          [t3.id]: t3,
          [t4.id]: t4,
          [c1.id]: c1,
          [c2.id]: c2,
          [c3.id]: c3,
          [c4.id]: c4,
        },
        refs: {
          main: c2.id,
          "feature/auth": c4.id,
        },
        tags: {
          "v1.0-alpha": c1.id,
        },
        HEAD: {
          type: "branch",
          value: "feature/auth",
        },
        index: {},
        workingDir: {
          "README.md": b1.content,
          "auth.js": b4.content,
        },
        stash: [],
        conflicts: [],
        history: ["git checkout -b feature/auth", 'git commit -m "feat(auth): add login handler"'],
      };
    }

    case "merge-conflict": {
      // Base Commit
      const baseCss: BlobObject = { type: "blob", id: "b_base_css", content: "body {\n  color: #111;\n  background: #fff;\n}", size: 45 };
      const baseTree: TreeObject = { type: "tree", id: "t_base", entries: [{ name: "styles.css", objectId: baseCss.id, type: "blob" }] };
      const cBase: CommitObject = {
        type: "commit",
        id: "c300001",
        tree: baseTree.id,
        parents: [],
        message: "style: add base light theme stylesheet",
        author: "Team <team@openlabs.org.in>",
        timestamp: Date.now() - 3600000 * 6,
      };

      // Main Branch Commit (changed background to dark slate)
      const mainCss: BlobObject = { type: "blob", id: "b_main_css", content: "body {\n  color: #f8fafc;\n  background: #0f172a; /* dark slate */\n}", size: 66 };
      const mainTree: TreeObject = { type: "tree", id: "t_main", entries: [{ name: "styles.css", objectId: mainCss.id, type: "blob" }] };
      const cMain: CommitObject = {
        type: "commit",
        id: "c300002",
        tree: mainTree.id,
        parents: [cBase.id],
        message: "feat(theme): configure deep dark slate background on main",
        author: "Alice <alice@openlabs.org.in>",
        timestamp: Date.now() - 3600000 * 3,
      };

      // Bugfix Branch Commit (changed background to midnight purple)
      const bugfixCss: BlobObject = { type: "blob", id: "b_bugfix_css", content: "body {\n  color: #faf5ff;\n  background: #2e1065; /* midnight purple */\n}", size: 70 };
      const bugfixTree: TreeObject = { type: "tree", id: "t_bugfix", entries: [{ name: "styles.css", objectId: bugfixCss.id, type: "blob" }] };
      const cBugfix: CommitObject = {
        type: "commit",
        id: "c300003",
        tree: bugfixTree.id,
        parents: [cBase.id],
        message: "fix(theme): apply high contrast midnight purple on bugfix",
        author: "Bob <bob@openlabs.org.in>",
        timestamp: Date.now() - 3600000 * 2,
      };

      return {
        initialized: true,
        objects: {
          [baseCss.id]: baseCss,
          [mainCss.id]: mainCss,
          [bugfixCss.id]: bugfixCss,
          [baseTree.id]: baseTree,
          [mainTree.id]: mainTree,
          [bugfixTree.id]: bugfixTree,
          [cBase.id]: cBase,
          [cMain.id]: cMain,
          [cBugfix.id]: cBugfix,
        },
        refs: {
          main: cMain.id,
          "bugfix/theme": cBugfix.id,
        },
        tags: {},
        HEAD: {
          type: "branch",
          value: "main",
        },
        index: {},
        workingDir: {
          "styles.css": mainCss.content,
        },
        stash: [],
        conflicts: [],
        history: ["git checkout main", "# Ready to run: git merge bugfix/theme to observe conflict resolution"],
      };
    }

    case "detached-head": {
      const b1: BlobObject = { type: "blob", id: "b401", content: "console.log('v1');", size: 18 };
      const t1: TreeObject = { type: "tree", id: "t401", entries: [{ name: "app.js", objectId: b1.id, type: "blob" }] };
      const c1: CommitObject = {
        type: "commit",
        id: "c400001",
        tree: t1.id,
        parents: [],
        message: "Initial release v1.0",
        author: "Dev <dev@openlabs.org.in>",
        timestamp: Date.now() - 3600000 * 10,
      };

      const b2: BlobObject = { type: "blob", id: "b402", content: "console.log('v2 with fixes');", size: 30 };
      const t2: TreeObject = { type: "tree", id: "t402", entries: [{ name: "app.js", objectId: b2.id, type: "blob" }] };
      const c2: CommitObject = {
        type: "commit",
        id: "c400002",
        tree: t2.id,
        parents: [c1.id],
        message: "feat: add v2 improvements",
        author: "Dev <dev@openlabs.org.in>",
        timestamp: Date.now() - 3600000 * 5,
      };

      const b3: BlobObject = { type: "blob", id: "b403", content: "console.log('v3 latest master');", size: 33 };
      const t3: TreeObject = { type: "tree", id: "t403", entries: [{ name: "app.js", objectId: b3.id, type: "blob" }] };
      const c3: CommitObject = {
        type: "commit",
        id: "c400003",
        tree: t3.id,
        parents: [c2.id],
        message: "feat: v3 breaking changes",
        author: "Dev <dev@openlabs.org.in>",
        timestamp: Date.now() - 3600000 * 1,
      };

      return {
        initialized: true,
        objects: {
          [b1.id]: b1,
          [b2.id]: b2,
          [b3.id]: b3,
          [t1.id]: t1,
          [t2.id]: t2,
          [t3.id]: t3,
          [c1.id]: c1,
          [c2.id]: c2,
          [c3.id]: c3,
        },
        refs: {
          main: c3.id,
        },
        tags: {
          "v1.0": c1.id,
          "v2.0": c2.id,
        },
        HEAD: {
          type: "commit",
          value: c1.id, // Detached at c1
        },
        index: {},
        workingDir: {
          "app.js": b1.content,
        },
        stash: [],
        conflicts: [],
        history: ["git checkout " + c1.id, "Note: HEAD is now detached at commit " + c1.id],
      };
    }

    case "rebase-ready": {
      // Root c1
      const b0: BlobObject = { type: "blob", id: "b500", content: "// base app", size: 11 };
      const t0: TreeObject = { type: "tree", id: "t500", entries: [{ name: "app.js", objectId: b0.id, type: "blob" }] };
      const c1: CommitObject = {
        type: "commit",
        id: "c500001",
        tree: t0.id,
        parents: [],
        message: "feat: base application scaffold",
        author: "Dev <dev@openlabs.org.in>",
        timestamp: Date.now() - 3600000 * 8,
      };

      // main commits c2 and c3
      const c2: CommitObject = {
        type: "commit",
        id: "c500002",
        tree: t0.id,
        parents: [c1.id],
        message: "fix: resolve memory leak in router",
        author: "Lead <lead@openlabs.org.in>",
        timestamp: Date.now() - 3600000 * 6,
      };
      const c3: CommitObject = {
        type: "commit",
        id: "c500003",
        tree: t0.id,
        parents: [c2.id],
        message: "chore: update dependencies and build scripts",
        author: "Lead <lead@openlabs.org.in>",
        timestamp: Date.now() - 3600000 * 4,
      };

      // feature/search commits c4 and c5 (branched from c1)
      const bSearch: BlobObject = { type: "blob", id: "b501", content: "export function search() {}", size: 28 };
      const tSearch: TreeObject = {
        type: "tree",
        id: "t501",
        entries: [
          { name: "app.js", objectId: b0.id, type: "blob" },
          { name: "search.js", objectId: bSearch.id, type: "blob" },
        ],
      };
      const c4: CommitObject = {
        type: "commit",
        id: "c500004",
        tree: tSearch.id,
        parents: [c1.id],
        message: "feat(search): add fuzzy search algorithm",
        author: "SearchDev <search@openlabs.org.in>",
        timestamp: Date.now() - 3600000 * 5,
      };
      const c5: CommitObject = {
        type: "commit",
        id: "c500005",
        tree: tSearch.id,
        parents: [c4.id],
        message: "test(search): add unit test coverage for indexing",
        author: "SearchDev <search@openlabs.org.in>",
        timestamp: Date.now() - 3600000 * 2,
      };

      return {
        initialized: true,
        objects: {
          [b0.id]: b0,
          [bSearch.id]: bSearch,
          [t0.id]: t0,
          [tSearch.id]: tSearch,
          [c1.id]: c1,
          [c2.id]: c2,
          [c3.id]: c3,
          [c4.id]: c4,
          [c5.id]: c5,
        },
        refs: {
          main: c3.id,
          "feature/search": c5.id,
        },
        tags: {},
        HEAD: {
          type: "branch",
          value: "feature/search",
        },
        index: {},
        workingDir: {
          "app.js": b0.content,
          "search.js": bSearch.content,
        },
        stash: [],
        conflicts: [],
        history: ["git checkout feature/search", "# Ready for: git rebase main to linearize commits"],
      };
    }

    case "stash-demo": {
      const b1: BlobObject = { type: "blob", id: "b601", content: "const status = 'stable';", size: 24 };
      const t1: TreeObject = { type: "tree", id: "t601", entries: [{ name: "server.js", objectId: b1.id, type: "blob" }] };
      const c1: CommitObject = {
        type: "commit",
        id: "c600001",
        tree: t1.id,
        parents: [],
        message: "feat: initial stable server configuration",
        author: "Admin <admin@openlabs.org.in>",
        timestamp: Date.now() - 3600000 * 4,
      };

      // Staged blob
      const bStaged: BlobObject = {
        type: "blob",
        id: "b602",
        content: '{\n  "name": "git-simulator-demo",\n  "version": "1.1.0"\n}',
        size: 58,
      };

      return {
        initialized: true,
        objects: {
          [b1.id]: b1,
          [bStaged.id]: bStaged,
          [t1.id]: t1,
          [c1.id]: c1,
        },
        refs: {
          main: c1.id,
        },
        tags: {},
        HEAD: {
          type: "branch",
          value: "main",
        },
        index: {
          "package.json": bStaged.id,
        },
        workingDir: {
          "server.js": "const status = 'wip experimental patch'; // UNCOMMITTED EDIT",
          "package.json": bStaged.content,
          "scratch.txt": "temporary uncommitted notes for experiment",
        },
        stash: [],
        conflicts: [],
        history: [
          "touch scratch.txt",
          "git add package.json",
          "# Working tree is dirty. Try running: git stash",
        ],
      };
    }

    case "custom":
    default: {
      return getPresetState("clean");
    }
  }
}
