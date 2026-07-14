"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { analyticsService } from "@/lib/analytics";

export interface Project {
  id: string;
  title: string;
  html: string;
  css: string;
  js: string;
  updatedAt: number;
}

export function useProjects(projectType: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialized) {
      loadProjectsFromDB();
      setInitialized(true);
    }
  }, [initialized]);

  const router = useRouter();
  const currentPath = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";

  useEffect(() => {
    if (!activeId && projects.length > 0) {
      setActiveId(projects[0].id);
    }
  }, [activeId, projects]);


  // ---------------------------
  // Load projects from DB
  // ---------------------------
  const loadProjectsFromDB = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/projects?projectType=${projectType}`
      );

      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(currentPath)}`);
        return;
      }

      if (!res.ok) {
        setError("Failed to load projects. Please refresh.");
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.warn("Projects API returned non-array:", data);
        setError("Failed to load projects. Please refresh.");
        return;
      }

      const formatted: Project[] = data.map((p: any) => ({
        id: p.projectId,
        title: p.title,
        html: p.html || "",
        css: p.css || "",
        js: p.js || "",
        updatedAt: Date.now(),
      }));

      setProjects(formatted);
      setError(null);

      if (formatted.length > 0) {
        setActiveId(formatted[0].id);
      }

    } catch (err) {
      console.error("Failed to load projects", err);
      setError("Failed to load projects. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Active project
  // ---------------------------
  const activeProject =
    projects.find((p) => p.id === activeId) || null;

  // ---------------------------
  // Update active project
  // ---------------------------
  const updateActive = (data: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeId
          ? { ...p, ...data, updatedAt: Date.now() }
          : p
      )
    );
  };

  // ---------------------------
  // Create new project
  // ---------------------------
  const createProject = async () => {
    const id = nanoid();

    const project: Project = {
      id,
      title: "Untitled Project",
      html: "",
      css: "",
      js: "",
      updatedAt: Date.now(),
    };

    setProjects((prev) => [project, ...prev]);
    setActiveId(id);
    setError(null);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: id,
          title: project.title,
          html: "",
          css: "",
          js: "",
          projectType: projectType,
        }),
      });

      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(currentPath)}`);
        return;
      }

      if (!res.ok) {
        // Roll back the optimistic insert — it was never persisted.
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setActiveId((cur) => (cur === id ? "" : cur));
        setError("Failed to create project. Please try again.");
        return;
      }

      analyticsService.trackProjectCreated(id);
    } catch (err) {
      console.error("Failed to create project", err);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setActiveId((cur) => (cur === id ? "" : cur));
      setError("Failed to create project. Please try again.");
    }
  };

  // ---------------------------
  // Delete project
  // ---------------------------
  const deleteProject = async (id: string) => {
    const removedIndex = projects.findIndex((p) => p.id === id);
    const removed = projects[removedIndex];
    const wasActive = id === activeId;

    // Remove locally first (optimistic)
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setError(null);

    try {
      const res = await fetch(`/api/projects?projectId=${id}`, {
        method: "DELETE",
      });

      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(currentPath)}`);
        return;
      }

      if (!res.ok) {
        // Roll back — the delete didn't actually happen server-side.
        if (removed) {
          setProjects((prev) => {
            const next = [...prev];
            next.splice(Math.max(0, removedIndex), 0, removed);
            return next;
          });
        }
        setError("Failed to delete project. Please try again.");
        return;
      }

      if (wasActive) {
        setActiveId("");
        // If that was the last project, immediately refetch — the server
        // auto-creates a fresh one when the list is empty, so we never sit
        // with a dangling activeId and a no-op editor. If other projects
        // remain, the hook's own effect auto-selects the first one.
        const remaining = projects.filter((p) => p.id !== id);
        if (remaining.length === 0) {
          await loadProjectsFromDB();
        }
      }
    } catch (err) {
      console.error("Failed to delete project", err);
      if (removed) {
        setProjects((prev) => {
          const next = [...prev];
          next.splice(Math.max(0, removedIndex), 0, removed);
          return next;
        });
      }
      setError("Failed to delete project. Please try again.");
    }
  };


  return {
    projects,
    activeProject,
    setActiveId,
    updateActive,
    createProject,
    deleteProject,
    loadProjectsFromDB,
    loading,
    error,
    setError,
  };
}
