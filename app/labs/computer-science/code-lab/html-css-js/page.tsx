"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import EditorPanel from "@/app/components/computer-science/code-lab/html-css-js/EditorPanel";
import PreviewPanel from "@/app/components/computer-science/code-lab/html-css-js/PreviewPanel";
import ConsolePanel from "@/app/components/computer-science/code-lab/html-css-js/ConsolePanel";
import { useProjects } from "@/app/hooks/useProjects";
import { useDebouncedValue } from "@/app/hooks/useDebouncedValue";
import { Cloud, RefreshCw, X, Menu } from 'lucide-react';
import { useChat } from "@/app/components/ChatContext";
import { useLab } from "@/app/hooks/useXP";


type View = "edit" | "preview" | "console";

export default function CodeLab() {
  const { completeExperiment } = useLab("computer-science/code-lab/html-css-js", "computerScience", "editor");
  // Chatbot
  const { setExperimentData } = useChat();

  useEffect(() => {
    setExperimentData({
      title: "HTML CSS JS code viewer.",
      theory: "",
      extraContext: ``,
    });
  }, []);

  /* ---------------- STATES ---------------- */
  const [view, setView] = useState<View>("edit");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pathname = usePathname();
  const projectType = pathname.split('/').pop() || 'html-css-js';
  const router = useRouter();
  const currentPath = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";

  /* ---------------- PROJECT HOOK ---------------- */
  const {
    projects,
    activeProject,
    setActiveId,
    updateActive,
    createProject,
    loadProjectsFromDB,
    deleteProject,
    loading,
    error,
    setError,
  } = useProjects(projectType);

  const displayError = saveError || error;

  /* ---------------- DEBOUNCED PREVIEW ---------------- */
  const debouncedCode = useDebouncedValue(
    {
      html: activeProject?.html || "",
      css: activeProject?.css || "",
      js: activeProject?.js || "",
    },
    500
  );

  /* ---------------- EFFECTS ---------------- */

  // Client mount flag (hydration fix)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Measure the real height of the site's fixed navbar (rather than
  // guessing a rem value) so this full-height shell exactly fills the
  // remaining viewport — any leftover mismatch here reopens page-level
  // scroll and makes our own sticky header collide with the navbar.
  useEffect(() => {
    const navEl = document.querySelector<HTMLElement>("[data-site-navbar]");
    if (!navEl) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--code-lab-nav-h",
        `${navEl.getBoundingClientRect().height}px`
      );
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(navEl);
    return () => observer.disconnect();
  }, []);

  // Load selected project content
  useEffect(() => {
    if (!activeProject?.id) return;
    loadFromDB();
  }, [activeProject?.id]);

  /* ---------------- HELPERS ---------------- */

  // Persists the active project. When `silent` is true (auto-save on
  // project switch) it doesn't flip the "Syncing/Synced" indicator or
  // award XP — only an explicit save should feel like "completing" the lab.
  const persistProject = async (opts?: { silent?: boolean }): Promise<boolean> => {
    if (!activeProject) return false;
    const silent = opts?.silent ?? false;

    if (!silent) setSaving(true);
    setSaveError(null);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: activeProject.id,
          projectType: projectType,
          title: activeProject.title,
          html: activeProject.html,
          css: activeProject.css,
          js: activeProject.js,
        }),
      });

      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(currentPath)}`);
        return false;
      }

      if (!res.ok) {
        setSaveError("Failed to save. Your changes are kept locally — try again.");
        return false;
      }

      if (!silent) {
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }
      return true;
    } catch (err) {
      console.error("Failed to save project", err);
      setSaveError("Failed to save — check your connection.");
      return false;
    } finally {
      if (!silent) setSaving(false);
    }
  };

  const saveToDB = async () => {
    const ok = await persistProject();
    if (ok) completeExperiment();
  };

  const loadFromDB = async () => {
    if (!activeProject?.id) return;

    try {
      const res = await fetch(
        `/api/projects?projectId=${activeProject.id}&projectType=${projectType}`
      );

      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(currentPath)}`);
        return;
      }

      if (!res.ok) {
        setSaveError("Failed to load this project. Please try again.");
        return;
      }

      const data = await res.json();

      updateActive({
        html: data.html ?? "",
        css: data.css ?? "",
        js: data.js ?? "",
        title: data.title ?? "Untitled Project",
      });
    } catch (err) {
      console.error("Failed to load project", err);
      setSaveError("Failed to load this project. Please try again.");
    }
  };


  const handleSelectProject = async (id: string) => {
    // Auto-save silently before switching. persistProject never throws, so
    // this always resolves and the switch always happens even if the save
    // failed (the failure is still surfaced via saveError).
    if (activeProject) {
      await persistProject({ silent: true });
    }
    setActiveId(id);
  };

  const handleDelete = async () => {
    if (!activeProject) return;
    setDeleting(true);
    await deleteProject(activeProject.id);
    setDeleting(false);
  };

  /* ---------------- RENDER GUARD ---------------- */

  if (!mounted) {
    return (
      <div className="h-[calc(100vh-var(--code-lab-nav-h,3.5rem))] flex items-center justify-center text-slate-400">
        Loading Editor...
      </div>
    );
  }


  /* ---------------- UI ---------------- */

  return (
    <div className="flex flex-col h-[calc(100vh-var(--code-lab-nav-h,3.5rem))] bg-[#1e1e1e] text-slate-200 overflow-hidden">


      {/* HEADER (fixed, pinned directly below the site navbar) */}
      <header className="fixed left-0 right-0 top-[var(--code-lab-nav-h,3.5rem)] z-50 h-14 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-[#1e1e1e]/80 backdrop-blur-md">

        {/* Left Section: Sidebar toggle, Logo & Status */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="lg:hidden p-1.5 -ml-1.5 rounded-md hover:bg-white/10 text-slate-300 transition-colors"
            aria-label="Toggle project list"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">System Live</span>
          </div>
        </div>

        {/* Center Section: Mobile/Tablet View Switcher (Edit / Preview / Console) */}
        <div className="flex lg:hidden bg-[#0a0a0a] p-1 rounded-xl border border-white/5 shadow-inner">
          {(["edit", "preview", "console"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 capitalize ${view === v
                ? "bg-white/10 text-blue-400 shadow-sm"
                : "text-slate-500 hover:text-slate-300"
                }`}
            >
              {v}
              {view === v && (
                <span className="absolute inset-0 border border-white/10 rounded-lg pointer-events-none" />
              )}
            </button>
          ))}
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-green-400 text-[10px] font-mono animate-fade-in">
              CHANGES_SYNCED
            </span>
          )}

          <button
            onClick={saveToDB}
            disabled={saving}
            className={`group relative flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all
        ${saving
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-blue-500/50"
              }`}
          >
            <Cloud className={`w-4 h-4 ${saving ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">{saving ? "Syncing..." : "Push to Cloud"}</span>
            <span className="sm:hidden">{saving ? "..." : "Push"}</span>
          </button>
        </div>
      </header>

      {/* Spacer so flow content isn't hidden behind the now-fixed header above */}
      <div className="h-14 shrink-0" />

      {/* ERROR BANNER */}
      {displayError && (
        <div className="w-full flex items-center justify-between gap-3 px-4 py-2 bg-red-500/10 border-b border-red-500/30 text-red-400 text-xs">
          <span>{displayError}</span>
          <div className="flex items-center gap-2 shrink-0">
            {error && (
              <button
                onClick={() => loadProjectsFromDB()}
                className="px-2 py-0.5 rounded border border-red-500/30 hover:bg-red-500/10 transition-colors font-medium"
              >
                Retry
              </button>
            )}
            <button
              onClick={() => { setSaveError(null); setError(null); }}
              className="p-1 rounded hover:bg-red-500/10 transition-colors"
              aria-label="Dismiss error"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* BACKDROP (mobile/tablet only, shown while the drawer is open) — offset below the site's fixed navbar */}
        {sidebarOpen && (
          <div
            className="fixed top-[calc(var(--code-lab-nav-h,3.5rem)+3.5rem)] left-0 right-0 bottom-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR — docked on lg+, a slide-in drawer below lg (also offset below the fixed navbar) */}
        <aside
          className={`fixed lg:relative top-[calc(var(--code-lab-nav-h,3.5rem)+3.5rem)] bottom-0 lg:top-0 lg:bottom-auto left-0 z-40 w-64 lg:w-56 bg-[#1b1b1b] border-r border-white/10 p-3 overflow-y-auto
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          <div className="flex items-center justify-between mb-3 lg:hidden">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">Projects</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded hover:bg-white/10 text-slate-400 transition-colors"
              aria-label="Close project list"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => { createProject(); setSidebarOpen(false); }}
            className="w-full mb-3 bg-blue-600 hover:bg-blue-500 py-1 rounded text-sm"
          >
            + New Project
          </button>

          {loading && projects.length === 0 && (
            <div className="flex items-center justify-center gap-2 text-slate-500 text-xs py-4">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Loading projects...
            </div>
          )}

          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => { p.id && handleSelectProject(p.id); setSidebarOpen(false); }}
              className={`w-full text-left px-2 py-1 rounded mb-1
                ${activeProject?.id === p.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-white/10"
                }`}
            >
              {p.title}
            </button>
          ))}

        </aside>

        {/* EDITOR / PREVIEW / CONSOLE */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">

          <section
            className={`${view === "edit" ? "flex" : "hidden"} lg:flex flex-col border-r border-white/10 overflow-hidden`}
          >
            <EditorPanel
              html={activeProject?.html || ""}
              setHtml={(v) => updateActive({ html: v })}

              css={activeProject?.css || ""}
              setCss={(v) => updateActive({ css: v })}

              js={activeProject?.js || ""}
              setJs={(v) => updateActive({ js: v })}

              title={activeProject?.title || ""}
              setTitle={(v) => updateActive({ title: v })}

              onDelete={handleDelete}
              deleting={deleting}
              onSave={saveToDB}
            />
          </section>

          <div className="flex flex-col overflow-hidden">
            <section
              className={`${view === "preview" ? "flex" : "hidden"} lg:flex flex-1 flex-col bg-white overflow-hidden`}
            >
              <PreviewPanel
                html={debouncedCode.html}
                css={debouncedCode.css}
                js={debouncedCode.js}
              />
            </section>

            <section
              className={`${view === "console" ? "flex h-full" : "hidden"} lg:flex lg:h-48 xl:h-64 flex-col bg-[#1e1e1e] border-t border-white/10 overflow-hidden`}
            >
              <ConsolePanel />
            </section>
          </div>

        </main>

      </div>
    </div>
  );
}
