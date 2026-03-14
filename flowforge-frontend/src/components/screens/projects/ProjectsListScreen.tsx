"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getProjects } from "@/features/projects/api";
import type { Project } from "@/features/projects/types";
import CreateProjectModal from "./CreateProjectModal";
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
  const [sortBy, setSortBy] = useState<"RECENT" | "NAME_ASC" | "NAME_DESC">("RECENT");
  const [error, setError] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
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
        <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] text-slate-500">
          Loading projects...
        </div>
      ) : error ? (
        <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6">
          <div className="max-w-md rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
            {error}
          </div>
        </div>
      ) : isCompletelyEmpty ? (
        <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6">
          <div className="w-full max-w-xl">
            <ProjectsEmptyState onCreate={() => setOpenCreate(true)} />
          </div>
        </div>
      ) : (
        <>
          <ProjectsListMobile
            projects={filteredProjects}
            tab={tab}
            search={search}
            onSearchChange={setSearch}
            onTabChange={setTab}
            onOpenCreate={() => setOpenCreate(true)}
            onProjectStatusChanged={loadProjects}
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
            onProjectStatusChanged={loadProjects}
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
        onCreated={(project) => {
          setProjects((prev) => [project, ...prev]);
          pushToast({
            type: "success",
            title: "Project created successfully",
            description: `${project.name} is now available in your workspace.`,
          });
        }}
        onError={(message) => {
          pushToast({
            type: "error",
            title: "Project creation failed",
            description: message,
          });
        }}
      />

      <ProjectToasts toasts={toasts} onRemove={removeToast} />
    </>
  );
}