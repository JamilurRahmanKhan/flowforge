"use client";

import Link from "next/link";
import type { Project } from "@/features/projects/types";
import ProjectsEmptyState from "./ProjectsEmptyState";

type Props = {
  projects: Project[];
  tab: "ACTIVE" | "ARCHIVED";
  search: string;
  onSearchChange: (value: string) => void;
  onTabChange: (tab: "ACTIVE" | "ARCHIVED") => void;
  onOpenCreate: () => void;
  onProjectStatusChanged: () => void;
  sortBy: "RECENT" | "NAME_ASC" | "NAME_DESC";
  onSortChange: (value: "RECENT" | "NAME_ASC" | "NAME_DESC") => void;
  isTabEmpty: boolean;
  isSearchEmpty: boolean;
};

function formatUpdatedAt(value?: string | null) {
  if (!value) return "Recently updated";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently updated";
  return `Updated ${date.toLocaleDateString()}`;
}

function progressValue(project: Project) {
  if (project.status === "ARCHIVED") return 100;
  return 74;
}

function progressLabel(project: Project) {
  if (project.status === "ARCHIVED") return "Archived";
  return "12 Open Tasks";
}

function statusLabel(project: Project) {
  if (project.status === "ARCHIVED") return "ARCHIVED";
  return "IN PROGRESS";
}

function statusClass(project: Project) {
  if (project.status === "ARCHIVED") {
    return "bg-slate-100 text-slate-600";
  }
  return "bg-emerald-100 text-emerald-700";
}

function ProjectCard({
  project,
}: {
  project: Project;
}) {
  const progress = progressValue(project);

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block rounded-[28px] border border-[#e7edf6] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dfeafe] text-[22px] font-extrabold text-[#2563eb]">
            {project.name?.slice(0, 1)?.toUpperCase() || "P"}
          </div>

          <div>
            <h3 className="text-[18px] font-extrabold tracking-tight text-[#0f172a]">
              {project.name}
            </h3>
            <p className="mt-1 text-[14px] font-medium text-[#8a94a6]">
              {project.key}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-[#c0cad9]"
          onClick={(e) => e.preventDefault()}
        >
          •••
        </button>
      </div>

      <div className="mt-8">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
          Progress
        </p>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-[18px] font-extrabold text-[#0f172a]">
            {progress}%
          </span>
          <span className="text-[14px] font-bold text-[#2563eb]">
            {progressLabel(project)}
          </span>
        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#e9eef6]">
          <div
            className="h-full rounded-full bg-[#2563eb]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[#edf2f7] pt-5">
        <div className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ecd0ba] text-[12px] font-extrabold text-[#475569]">
            A
          </div>
          <div className="-ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#d8c1a3] text-[12px] font-extrabold text-[#475569]">
            B
          </div>
          <div className="-ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f5f9] text-[12px] font-extrabold text-[#475569]">
            +3
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span
            className={`rounded-full px-4 py-2 text-[12px] font-extrabold tracking-[0.16em] ${statusClass(
              project
            )}`}
          >
            {statusLabel(project)}
          </span>

          <span className="text-[13px] font-medium italic text-[#94a3b8]">
            {formatUpdatedAt(project.createdAt)}
          </span>
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
  sortBy,
  onSortChange,
  isTabEmpty,
  isSearchEmpty,
}: Props) {
  return (
    <div className="hidden lg:block">
      <section className="rounded-[36px] bg-white px-9 py-9 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-[52px] font-extrabold leading-none tracking-tight text-[#0b132b]">Projects</h1>
            <p className="mt-5 text-[18px] font-medium text-[#64748b]">Manage active and archived projects across your workspace.</p>
          </div>
          <button type="button" onClick={onOpenCreate} className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#2563eb] text-[38px] leading-none text-white shadow-[0_20px_40px_rgba(37,99,235,0.22)]">
            +
          </button>
        </div>

        <div className="mt-10 rounded-[30px] border border-[#edf2f7] bg-[#f8fafc] p-5">
          <div className="rounded-[22px] border border-[#dde6f1] bg-white px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="text-[22px] text-[#94a3b8]">⌕</span>
              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search your projects..."
                className="w-full border-0 bg-transparent text-[18px] font-medium text-[#334155] outline-none placeholder:text-[#94a3b8]"
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onTabChange("ACTIVE")}
                className={`rounded-full px-8 py-4 text-[16px] font-extrabold ${
                  tab === "ACTIVE" ? "bg-[#0f1f5c] text-white" : "border border-[#d9e2ef] bg-white text-[#475569]"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => onTabChange("ARCHIVED")}
                className={`rounded-full px-8 py-4 text-[16px] font-extrabold ${
                  tab === "ARCHIVED" ? "bg-[#0f1f5c] text-white" : "border border-[#d9e2ef] bg-white text-[#475569]"
                }`}
              >
                Archived
              </button>
            </div>

            <div className="flex items-center gap-4 border-l border-[#d9e2ef] pl-8">
              <label htmlFor="projects-sort" className="text-[16px] font-bold text-[#475569]">Sort by</label>
              <select
                id="projects-sort"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as "RECENT" | "NAME_ASC" | "NAME_DESC")}
                className="border-0 bg-transparent text-[16px] font-bold text-[#334155] outline-none"
              >
                <option value="RECENT">Recent</option>
                <option value="NAME_ASC">Name A-Z</option>
                <option value="NAME_DESC">Name Z-A</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {isTabEmpty || isSearchEmpty ? (
            <ProjectsEmptyState tab={tab} isSearchEmpty={isSearchEmpty} onCreate={onOpenCreate} />
          ) : (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}