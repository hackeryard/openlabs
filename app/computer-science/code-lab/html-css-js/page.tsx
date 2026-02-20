"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import EditorPanel from "@/app/components/computer-science/code-lab/html-css-js/EditorPanel";
import PreviewPanel from "@/app/components/computer-science/code-lab/html-css-js/PreviewPanel";
import ConsolePanel from "@/app/components/computer-science/code-lab/html-css-js/ConsolePanel";
import { useProjects } from "@/app/hooks/useProjects";
import { Cloud } from 'lucide-react';


type View = "edit" | "preview";

export default function CodeLab() {

  /* ---------------- STATES ---------------- */
  const [view, setView] = useState<View>("edit");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
    deleteProject
  } = useProjects(projectType);

  /* ---------------- EFFECTS ---------------- */

  // Client mount flag (hydration fix)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load projects list from DB
  useEffect(() => {
    loadProjectsFromDB();
  }, []);

  // Load selected project content
  useEffect(() => {
    if (!activeProject?.id) return;
    loadFromDB();
  }, [activeProject?.id]);

  /* ---------------- HELPERS ---------------- */

  const saveToDB = async () => {
    if (!activeProject) return;

    setSaving(true);

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
      setSaving(false);
      router.push(`/login?next=${encodeURIComponent(currentPath)}`);
      return;
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const loadFromDB = async () => {
    if (!activeProject?.id) return;

    const res = await fetch(
      `/api/projects?projectId=${activeProject.id}&projectType=${projectType}`
    );

    if (res.status === 401) {
      router.push(`/login?next=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (!res.ok) return;

    const data = await res.json();

    updateActive({
      html: data.html ?? "",
      css: data.css ?? "",
      js: data.js ?? "",
      title: data.title ?? "Untitled Project",
    });
  };


  const handleSelectProject = async (id: string) => {
    await saveToDB();
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
      <div className="h-screen flex items-center justify-center text-slate-400">
        Loading Editor...
      </div>
    );
  }


  /* ---------------- UI ---------------- */

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-slate-200 overflow-hidden">


      {/* HEADER */}
      <header className="sticky top-0 z-50 h-14 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-[#1e1e1e]/80 backdrop-blur-md">

        {/* Left Section: Logo & Status */}
        <div className="flex items-center gap-4">
          <h1 className="font-bold tracking-tighter text-lg flex items-center gap-1.5 group cursor-default">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center group-hover:rotate-12 transition-transform">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <span className="text-blue-400">Open<span className="text-white/90">Labs</span></span>
          </h1>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">System Live</span>
          </div>
        </div>

        {/* Center Section: Responsive View Switcher */}
        {/* <div className="flex bg-[#0a0a0a] p-1 rounded-xl border border-white/5 shadow-inner">
          {(["edit", "preview"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`relative px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 capitalize ${view === v
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
        </div> */}

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3">
          {saved && (
            <span className="hidden md:block text-green-400 text-[10px] font-mono animate-fade-in">
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

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <aside className="w-56 bg-[#1b1b1b] border-r border-white/10 p-3 overflow-y-auto">

          <button
            onClick={createProject}
            className="w-full mb-3 bg-blue-600 hover:bg-blue-500 py-1 rounded text-sm"
          >
            + New Project
          </button>

          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => p.id && handleSelectProject(p.id)}
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

        {/* EDITOR / PREVIEW */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">

          <section
            className={`${view === "edit" ? "flex" : "hidden"} lg:flex flex-col border-r border-white/10`}
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
            />
          </section>

          <section
            className={`${view === "preview" ? "flex" : "hidden"} lg:flex flex-col h-full bg-white`}
          >
            <div className="flex-1 relative">
              <PreviewPanel
                html={activeProject?.html || ""}
                css={activeProject?.css || ""}
                js={activeProject?.js || ""}
              />
            </div>

            <div className="h-48 lg:h-64 bg-[#1e1e1e] border-t border-white/10">
              <ConsolePanel />
            </div>
          </section>

        </main>

      </div>
    </div>
  );
}
