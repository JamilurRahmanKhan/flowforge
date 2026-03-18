"use client";

import Link from "next/link";
import {
  archiveProject,
  deleteProject,
  unarchiveProject,
} from "@/features/projects/api";
import type { Project } from "@/features/projects/types";
import { Search, Plus, ChevronDown } from "lucide-react";
import { useState } from "react";

type Props = {
  projects: Project[];
  tab: "ACTIVE" | "ARCHIVED";
  search: string;
  onSearchChange: (value: string) => void;
  onTabChange: (value: "ACTIVE" | "ARCHIVED") => void;
  onOpenCreate: () => void;
  onEditProject: (project: Project) => void;
  onProjectUpdated: (project: Project) => void;
  onProjectDeleted: (project: Project) => void;
  sortBy: "RECENT" | "NAME_ASC" | "NAME_DESC";
  onSortChange: (value: "RECENT" | "NAME_ASC" | "NAME_DESC") => void;
  isTabEmpty: boolean;
  isSearchEmpty: boolean;
};

function getProjectInitial(name: string) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "P";
}

function formatUpdatedAt(date?: string) {
  if (!date) return "Updated recently";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Updated recently";

  return `Updated ${parsed.toLocaleDateString()}`;
}

function getProgress(_project: Project) {
  return 74;
}

function getOpenTasks(_project: Project) {
  return 12;
}

function ProjectCard({
  project,
  onEditProject,
  onProjectUpdated,
  onProjectDeleted,
}: {
  project: Project;
  onEditProject: (project: Project) => void;
  onProjectUpdated: (project: Project) => void;
  onProjectDeleted: (project: Project) => void;
}) {
  const [busy, setBusy] = useState(false);

  const initial = getProjectInitial(project.name);
  const progress = getProgress(project);
  const openTasks = getOpenTasks(project);
  const archived = project.status === "ARCHIVED";

  async function handleArchiveToggle(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    e.stopPropagation();

    try {
      setBusy(true);
      const updated = archived
        ? await unarchiveProject(project.id)
        : await archiveProject(project.id);
      onProjectUpdated(updated);
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to update project status"
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setBusy(true);
      await deleteProject(project.id);
      onProjectDeleted(project);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete project");
      setBusy(false);
    }
  }

  function handleEdit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    onEditProject(project);
  }

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f0ff] text-[30px] font-extrabold text-[#2f66f6]">
            {initial}
          </div>

          <div>
            <h3 className="text-[26px] font-extrabold tracking-tight text-slate-900">
              {project.name}
            </h3>
            <p className="mt-1 text-[18px] font-semibold text-slate-400">
              {project.key}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleEdit}
            disabled={busy}
            className="rounded-full border border-slate-200 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.14em] text-slate-600 disabled:opacity-60"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={handleArchiveToggle}
            disabled={busy}
            className="rounded-full border border-slate-200 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.14em] text-slate-600 disabled:opacity-60"
          >
            {archived ? "Restore" : "Archive"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="rounded-full border border-rose-200 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.14em] text-rose-600 disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-[14px] font-extrabold uppercase tracking-[0.22em] text-[#91a3c5]">
          Progress
        </p>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-[20px] font-extrabold text-slate-900">
            {progress}%
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-[20px] font-extrabold text-[#2f66f6]">
            {openTasks} Open Tasks
          </span>
        </div>

        <div className="mt-5 h-3 rounded-full bg-slate-100">
          <div
            className="h-3 rounded-full bg-[#2f66f6]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
        <div className="flex -space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#f3c9ab] text-sm font-extrabold text-slate-700">
            A
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#d9be97] text-sm font-extrabold text-slate-700">
            B
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-sm font-extrabold text-slate-600">
            +3
          </div>
        </div>

        <div className="text-right">
          <div
            className={`inline-flex rounded-full px-5 py-2 text-[14px] font-extrabold uppercase tracking-[0.18em] ${
              archived
                ? "bg-slate-100 text-slate-600"
                : "bg-[#dff3e7] text-[#15924f]"
            }`}
          >
            {archived ? "Archived" : "In Progress"}
          </div>

          <p className="mt-3 text-[16px] font-medium italic text-slate-400">
            {formatUpdatedAt(project.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsListDesktop({
  projects,
  tab,
  search,
  onSearchChange,
  onTabChange,
  onOpenCreate,
  onEditProject,
  onProjectUpdated,
  onProjectDeleted,
  sortBy,
  onSortChange,
  isTabEmpty,
  isSearchEmpty,
}: Props) {
  return (
    <div className="hidden lg:block">
      <div className="rounded-[34px] bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <div className="flex items-start justify-end">
          <button
            type="button"
            onClick={onOpenCreate}
            className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#2f66f6] text-white shadow-[0_16px_32px_rgba(47,102,246,0.28)] transition hover:scale-[1.02]"
          >
            <Plus className="h-8 w-8" />
          </button>
        </div>

        <div className="mt-8 rounded-[30px] border border-slate-200 bg-[#f8fbff] p-5">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search your projects..."
              className="h-16 w-full rounded-[22px] border border-slate-200 bg-white pl-14 pr-4 text-[20px] font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#2f66f6]"
            />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onTabChange("ACTIVE")}
                className={`rounded-full px-8 py-4 text-[16px] font-extrabold transition ${
                  tab === "ACTIVE"
                    ? "bg-[#11286f] text-white"
                    : "border border-slate-200 bg-white text-slate-500"
                }`}
              >
                Active
              </button>

              <button
                type="button"
                onClick={() => onTabChange("ARCHIVED")}
                className={`rounded-full px-8 py-4 text-[16px] font-extrabold transition ${
                  tab === "ARCHIVED"
                    ? "bg-[#11286f] text-white"
                    : "border border-slate-200 bg-white text-slate-500"
                }`}
              >
                Archived
              </button>
            </div>

            <div className="flex items-center gap-4 border-l border-slate-200 pl-8 text-[16px] font-bold text-slate-600">
              <span>Sort by</span>
              <button
                type="button"
                onClick={() => {
                  if (sortBy === "RECENT") onSortChange("NAME_ASC");
                  else if (sortBy === "NAME_ASC") onSortChange("NAME_DESC");
                  else onSortChange("RECENT");
                }}
                className="flex items-center gap-2"
              >
                {sortBy === "RECENT"
                  ? "Recent"
                  : sortBy === "NAME_ASC"
                  ? "Name A-Z"
                  : "Name Z-A"}
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {isSearchEmpty ? (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-[#f8fbff] px-8 py-16 text-center text-[18px] font-semibold text-slate-400">
              No projects match your search.
            </div>
          ) : isTabEmpty ? (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-[#f8fbff] px-8 py-16 text-center text-[18px] font-semibold text-slate-400">
              No {tab === "ACTIVE" ? "active" : "archived"} projects found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEditProject={onEditProject}
                  onProjectUpdated={onProjectUpdated}
                  onProjectDeleted={onProjectDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}