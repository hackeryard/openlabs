"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";

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
    try {
      const res = await fetch(
        `/api/projects?projectType=${projectType}`
      );

      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(currentPath)}`);
        return;
      }

      if (!res.ok) return;

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.warn("Projects API returned non-array:", data);
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

      if (formatted.length > 0) {
        setActiveId(formatted[0].id);
      }

    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };


  // Load once on mount
  // useEffect(() => {
  //   loadProjectsFromDB();
  // }, []);

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
  };

  // ---------------------------
  // Delete project
  // ---------------------------
  const deleteProject = async (id: string) => {
    // Remove locally first
    setProjects((prev) => prev.filter((p) => p.id !== id));

    // Delete from DB
    const res = await fetch(`/api/projects?projectId=${id}`, {
      method: "DELETE",
    });

    if (res.status === 401) {
      router.push(`/login?next=${encodeURIComponent(currentPath)}`);
      return;
    }

    // If deleting active project, clear activeId
    if (id === activeId) {
      setActiveId("");
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
  };
}
