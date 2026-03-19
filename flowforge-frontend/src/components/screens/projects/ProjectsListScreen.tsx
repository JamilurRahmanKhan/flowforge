"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  FolderKanban,
  Plus,
  Search,
  Trash2,
  Pencil,
  Users,
  CalendarDays,
} from "lucide-react";
import {
  archiveProject,
  deleteProject,
  getProjects,
  unarchiveProject,
} from "@/features/projects/api";
import type { Project } from "@/features/projects/types";
import CreateProjectModal from "./CreateProjectModal";
import EditProjectModal from "./EditProjectModal";

type TabKey = "ACTIVE" | "ARCHIVED";
type SortKey = "recent" | "name";

function formatDate(value?: string | null) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString();
}

function initials(value: string) {
  return value
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

function getProjectStatusTone(status?: string) {
  if (status === "ARCHIVED") {
    return "bg-slate-100 text-slate-600";
  }
  return "bg-emerald-100 text-emerald-700";
}

function estimateProgress(project: Project) {
  if (typeof project.progress === "number") return project.progress;
  return project.status === "ARCHIVED" ? 100 : 74;
}

function estimateOpenTasks(project: Project) {
  if (typeof project.openTaskCount === "number") return project.openTaskCount;
  return 0;
}

function estimateMembers(project: Project) {
  if (typeof project.memberCount === "number") return project.memberCount;
  return 1;
}

export default function ProjectsListScreen() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<TabKey>("ACTIVE");
  const [sortBy, setSortBy] = useState<SortKey>("recent");
  const [search, setSearch] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    let result = projects.filter((project) => {
      const projectStatus = (project.status || "ACTIVE").toUpperCase();
      const inTab =
        tab === "ACTIVE"
          ? projectStatus !== "ARCHIVED"
          : projectStatus === "ARCHIVED";

      const matchesSearch =
        !normalized ||
        project.name.toLowerCase().includes(normalized) ||
        project.key.toLowerCase().includes(normalized) ||
        (project.description || "").toLowerCase().includes(normalized);

      return inTab && matchesSearch;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    return result;
  }, [projects, search, sortBy, tab]);

  const activeCount = projects.filter(
    (project) => (project.status || "ACTIVE").toUpperCase() !== "ARCHIVED"
  ).length;

  const archivedCount = projects.filter(
    (project) => (project.status || "").toUpperCase() === "ARCHIVED"
  ).length;

  function openProject(projectId: string) {
    router.push(`/projects/${projectId}`);
  }

  async function handleArchiveToggle(project: Project) {
    try {
      setBusyId(project.id);
      const updated =
        (project.status || "ACTIVE").toUpperCase() === "ARCHIVED"
          ? await unarchiveProject(project.id)
          : await archiveProject(project.id);

      setProjects((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(projectId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmed) return;

    try {
      setBusyId(projectId);
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((item) => item.id !== projectId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <section className="rounded-[32px] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                Workspace Projects
              </p>
              <h2 className="mt-3 text-[40px] font-extrabold tracking-tight text-[#0f172a]">
                Projects
              </h2>
              <p className="mt-4 text-[16px] leading-7 text-[#64748b]">
                Manage active and archived projects across your workspace with a
                cleaner, faster overview.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-[#e6ebf3] bg-[#f8fafc] px-5 py-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#94a3b8]">
                  Total Projects
                </p>
                <p className="mt-2 text-[28px] font-extrabold text-[#0f172a]">
                  {projects.length}
                </p>
              </div>

              <div className="rounded-[24px] border border-[#e6ebf3] bg-[#f8fafc] px-5 py-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#94a3b8]">
                  Active
                </p>
                <p className="mt-2 text-[28px] font-extrabold text-[#0f172a]">
                  {activeCount}
                </p>
              </div>

              <div className="rounded-[24px] border border-[#e6ebf3] bg-[#f8fafc] px-5 py-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#94a3b8]">
                  Archived
                </p>
                <p className="mt-2 text-[28px] font-extrabold text-[#0f172a]">
                  {archivedCount}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative w-full max-w-[560px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects by name, key, or description..."
                  className="w-full rounded-[18px] border border-[#dbe4ef] bg-white py-3 pl-12 pr-4 text-sm outline-none transition focus:border-[#2563eb]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTab("ACTIVE")}
                  className={`rounded-full px-5 py-2.5 text-sm font-extrabold transition ${
                    tab === "ACTIVE"
                      ? "bg-[#1e3a8a] text-white shadow-[0_10px_24px_rgba(37,99,235,0.22)]"
                      : "border border-[#dbe4ef] text-[#475569]"
                  }`}
                >
                  Active
                </button>

                <button
                  type="button"
                  onClick={() => setTab("ARCHIVED")}
                  className={`rounded-full px-5 py-2.5 text-sm font-extrabold transition ${
                    tab === "ARCHIVED"
                      ? "bg-[#1e3a8a] text-white shadow-[0_10px_24px_rgba(37,99,235,0.22)]"
                      : "border border-[#dbe4ef] text-[#475569]"
                  }`}
                >
                  Archived
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 xl:justify-end">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#64748b]">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="rounded-[14px] border border-[#dbe4ef] bg-white px-3 py-2 text-sm font-bold text-[#334155] outline-none"
                >
                  <option value="recent">Recent</option>
                  <option value="name">Name</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setOpenCreate(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(37,99,235,0.22)] transition hover:translate-y-[-1px]"
              >
                <Plus className="h-4 w-4" />
                New Project
              </button>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 rounded-[22px] border border-[#e6ebf3] bg-[#f8fafc] px-6 py-12 text-center text-sm font-medium text-[#64748b]">
              Loading projects...
            </div>
          ) : error ? (
            <div className="mt-6 rounded-[20px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-6 py-14 text-center">
              <FolderKanban className="mx-auto h-10 w-10 text-[#94a3b8]" />
              <h3 className="mt-4 text-[20px] font-extrabold text-[#0f172a]">
                No projects found
              </h3>
              <p className="mt-2 text-[14px] text-[#64748b]">
                Try changing the search or switch between active and archived.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {filteredProjects.map((project) => {
                const progress = estimateProgress(project);
                const openTasks = estimateOpenTasks(project);
                const members = estimateMembers(project);
                const status = (project.status || "ACTIVE").toUpperCase();
                const busy = busyId === project.id;

                return (
                  <article
                    key={project.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openProject(project.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openProject(project.id);
                      }
                    }}
                    className="group cursor-pointer rounded-[28px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:translate-y-[-2px] hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-[#e9f0ff] text-[20px] font-extrabold text-[#2563eb]">
                          {initials(project.name)}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-[28px] font-extrabold tracking-tight text-[#0f172a]">
                            {project.name}
                          </h3>
                          <p className="mt-1 text-[14px] font-bold uppercase tracking-[0.16em] text-[#94a3b8]">
                            {project.key}
                          </p>
                          <p className="mt-3 line-clamp-2 text-[14px] leading-6 text-[#64748b]">
                            {project.description || "No description added yet."}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-extrabold ${getProjectStatusTone(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#94a3b8]">
                          Progress
                        </p>
                        <p className="mt-2 text-[22px] font-extrabold text-[#0f172a]">
                          {progress}%
                        </p>
                      </div>

                      <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#94a3b8]">
                          Open Tasks
                        </p>
                        <p className="mt-2 text-[22px] font-extrabold text-[#2563eb]">
                          {openTasks}
                        </p>
                      </div>

                      <div className="rounded-[18px] bg-[#f8fafc] px-4 py-3">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#94a3b8]">
                          Members
                        </p>
                        <p className="mt-2 text-[22px] font-extrabold text-[#0f172a]">
                          {members}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#94a3b8]">
                          Completion
                        </span>
                        <span className="text-[13px] font-bold text-[#334155]">
                          {progress}%
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-[#e9eef5]">
                        <div
                          className="h-2.5 rounded-full bg-[#2563eb] transition-all"
                          style={{ width: `${Math.max(6, Math.min(progress, 100))}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#eef2f7] pt-5">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[13px] font-medium text-[#64748b]">
                          <Users className="h-4 w-4" />
                          <span>
                            {members} member{members > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[13px] font-medium text-[#64748b]">
                          <CalendarDays className="h-4 w-4" />
                          <span>
                            Updated {formatDate(project.updatedAt || project.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingProject(project);
                          }}
                          disabled={busy}
                          className="rounded-full border border-[#dbe4f0] px-3 py-2 text-[12px] font-extrabold text-[#334155]"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchiveToggle(project);
                          }}
                          disabled={busy}
                          className="rounded-full border border-[#dbe4f0] px-3 py-2 text-[12px] font-extrabold text-[#334155]"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Archive className="h-3.5 w-3.5" />
                            {status === "ARCHIVED" ? "Restore" : "Archive"}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(project.id);
                          }}
                          disabled={busy}
                          className="rounded-full border border-rose-200 px-3 py-2 text-[12px] font-extrabold text-rose-600"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <CreateProjectModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={(createdProject) => {
          setProjects((prev) => [createdProject, ...prev]);
          setOpenCreate(false);
        }}
      />

      <EditProjectModal
        open={!!editingProject}
        project={editingProject}
        onClose={() => setEditingProject(null)}
        onUpdated={(updatedProject) => {
          setProjects((prev) =>
            prev.map((item) => (item.id === updatedProject.id ? updatedProject : item))
          );
          setEditingProject(null);
        }}
        onError={(message) => setError(message)}
      />
    </>
  );
}