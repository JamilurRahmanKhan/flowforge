"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getProjects } from "@/features/projects/api";
import type { Project } from "@/features/projects/types";
import CreateProjectModal from "./CreateProjectModal";
import EditProjectModal from "./EditProjectModal";
import ProjectsEmptyState from "./ProjectsEmptyState";
import ProjectsListMobile from "./ProjectsListMobile";
import ProjectsListDesktop from "./ProjectsListDesktop";
import ProjectToasts, { type ProjectToast } from "./ProjectToasts";

export default function ProjectsListScreen() {
  const router = useRouter();
  const toastIdRef = useRef(1);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"ACTIVE" | "ARCHIVED">("ACTIVE");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"RECENT" | "NAME_ASC" | "NAME_DESC">(
    "RECENT"
  );
  const [error, setError] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [toasts, setToasts] = useState<ProjectToast[]>([]);

  function pushToast(toast: Omit<ProjectToast, "id">) {
    const id = toastIdRef.current++;
    setToasts((prev) => [...prev, { ...toast, id }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }

  function removeToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("flowforge_token")
          : null;

      if (!token) {
        router.replace("/login");
        return;
      }

      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load projects";

      if (message === "UNAUTHORIZED") {
        if (typeof window !== "undefined") {
          localStorage.removeItem("flowforge_token");
        }
        router.replace("/login");
        return;
      }

      setError(message);
      pushToast({
        type: "error",
        title: "Failed to load projects",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function handleProjectCreated(project: Project) {
    setProjects((prev) => [project, ...prev]);
    pushToast({
      type: "success",
      title: "Project created successfully",
      description: `${project.name} is now available in your workspace.`,
    });
  }

  function handleProjectUpdated(updated: Project) {
    setProjects((prev) =>
      prev.map((project) => (project.id === updated.id ? updated : project))
    );

    pushToast({
      type: "success",
      title: "Project updated",
      description: `${updated.name} has been updated successfully.`,
    });
  }

  function handleProjectDeleted(deletedProject: Project) {
    setProjects((prev) =>
      prev.filter((project) => project.id !== deletedProject.id)
    );

    pushToast({
      type: "success",
      title: "Project deleted",
      description: `${deletedProject.name} has been removed from your workspace.`,
    });
  }

  const normalizedSearch = search.trim().toLowerCase();

  const tabProjects = useMemo(() => {
    return projects.filter((project) =>
      tab === "ACTIVE"
        ? project.status === "ACTIVE"
        : project.status === "ARCHIVED"
    );
  }, [projects, tab]);

  const searchedProjects = useMemo(() => {
    if (!normalizedSearch) return tabProjects;

    return tabProjects.filter((project) => {
      return (
        project.name.toLowerCase().includes(normalizedSearch) ||
        project.key.toLowerCase().includes(normalizedSearch) ||
        (project.description || "").toLowerCase().includes(normalizedSearch)
      );
    });
  }, [tabProjects, normalizedSearch]);

  const filteredProjects = useMemo(() => {
    const sorted = [...searchedProjects];

    if (sortBy === "NAME_ASC") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "NAME_DESC") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      sorted.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
    }

    return sorted;
  }, [searchedProjects, sortBy]);

  const isCompletelyEmpty = !loading && !error && projects.length === 0;
  const isTabEmpty = !loading && !error && tabProjects.length === 0;
  const isSearchEmpty =
    !loading && !error && tabProjects.length > 0 && filteredProjects.length === 0;

  return (
    <>
      {loading ? (
        <div className="rounded-[32px] border border-[#e7edf6] bg-white px-6 py-16 text-center text-sm font-semibold text-slate-500 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          Loading projects...
        </div>
      ) : error ? (
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      ) : isCompletelyEmpty ? (
        <ProjectsEmptyState onCreate={() => setOpenCreate(true)} />
      ) : (
        <>
          <ProjectsListMobile
            projects={filteredProjects}
            tab={tab}
            search={search}
            onSearchChange={setSearch}
            onTabChange={setTab}
            onOpenCreate={() => setOpenCreate(true)}
            onEditProject={setEditingProject}
            onProjectUpdated={handleProjectUpdated}
            onProjectDeleted={handleProjectDeleted}
            sortBy={sortBy}
            onSortChange={setSortBy}
            isTabEmpty={isTabEmpty}
            isSearchEmpty={isSearchEmpty}
          />

          <ProjectsListDesktop
            projects={filteredProjects}
            tab={tab}
            search={search}
            onSearchChange={setSearch}
            onTabChange={setTab}
            onOpenCreate={() => setOpenCreate(true)}
            onEditProject={setEditingProject}
            onProjectUpdated={handleProjectUpdated}
            onProjectDeleted={handleProjectDeleted}
            sortBy={sortBy}
            onSortChange={setSortBy}
            isTabEmpty={isTabEmpty}
            isSearchEmpty={isSearchEmpty}
          />
        </>
      )}

      <CreateProjectModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={handleProjectCreated}
        onError={(message) => {
          pushToast({
            type: "error",
            title: "Project creation failed",
            description: message,
          });
        }}
      />

      <EditProjectModal
        open={!!editingProject}
        project={editingProject}
        onClose={() => setEditingProject(null)}
        onUpdated={(project) => {
          handleProjectUpdated(project);
          setEditingProject(null);
        }}
        onError={(message) => {
          pushToast({
            type: "error",
            title: "Project update failed",
            description: message,
          });
        }}
      />

      <ProjectToasts toasts={toasts} onRemove={removeToast} />
    </>
  );
}