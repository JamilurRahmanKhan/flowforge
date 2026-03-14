"use client";

import Link from "next/link";
import { unarchiveProject } from "@/features/projects/api";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Folder,
  LayoutGrid,
  MoreHorizontal,
  Search,
  UserRound,
} from "lucide-react";
import type { Project } from "@/features/projects/types";

type Props = {
  projects: Project[];
  tab: "ACTIVE" | "ARCHIVED";
  search: string;
  onSearchChange: (value: string) => void;
  onTabChange: (value: "ACTIVE" | "ARCHIVED") => void;
  onOpenCreate: () => void;
  onProjectStatusChanged: () => void;
  sortBy: "RECENT" | "NAME_ASC" | "NAME_DESC";
  onSortChange: (value: "RECENT" | "NAME_ASC" | "NAME_DESC") => void;
  isTabEmpty: boolean;
  isSearchEmpty: boolean;
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

function projectVisual(index: number) {
  const visuals = [
    {
      initialsBg: "bg-[#dbeafe]",
      initialsText: "text-[#2563eb]",
      progressText: "text-[#2563eb]",
      progressFill: "bg-[#2563eb]",
      statusBg: "bg-[#e9f8ef]",
      statusText: "text-[#159947]",
      status: "IN PROGRESS",
      progress: 74,
      openTasks: 12,
      updated: "Updated 2h ago",
    },
    {
      initialsBg: "bg-[#f3e8ff]",
      initialsText: "text-[#9333ea]",
      progressText: "text-[#9333ea]",
      progressFill: "bg-[#a855f7]",
      statusBg: "bg-[#fff3de]",
      statusText: "text-[#d97706]",
      status: "PLANNING",
      progress: 32,
      openTasks: 8,
      updated: "Updated 5h ago",
    },
    {
      initialsBg: "bg-[#ffedd5]",
      initialsText: "text-[#ea580c]",
      progressText: "text-[#ea580c]",
      progressFill: "bg-[#f97316]",
      statusBg: "bg-[#eef4ff]",
      statusText: "text-[#2563eb]",
      status: "REVIEW",
      progress: 95,
      openTasks: 2,
      updated: "Updated 10m ago",
    },
  ];

  return visuals[index % visuals.length];
}

function MobileProjectCard({
  project,
  index,
  tab,
  onProjectStatusChanged,
}: {
  project: Project;
  index: number;
  tab: "ACTIVE" | "ARCHIVED";
  onProjectStatusChanged: () => void;
}) {
  async function handleRestore(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    await unarchiveProject(project.id);
    onProjectStatusChanged();
  }

  const visual = projectVisual(index);

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block rounded-[28px] bg-white px-7 py-7 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
    >
      <div className="flex items-start justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className={`flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full ${visual.initialsBg}`}
          >
            <span className={`text-[16px] font-extrabold ${visual.initialsText}`}>
              {initialsFromName(project.name)}
            </span>
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-[20px] font-extrabold tracking-tight text-[#0f172a]">
              {project.name}
            </h3>
            <p className="mt-1 text-[13px] uppercase tracking-[0.12em] text-[#94a3b8]">
              {project.key}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className="rounded-full p-1 text-[#cbd5e1]"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-8">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
          Progress
        </p>

        <div className="mt-3 flex items-center gap-2 text-[15px]">
          <span className="font-extrabold text-[#0f172a]">{visual.progress}%</span>
          <span className="text-[#cbd5e1]">•</span>
          <span className={`font-extrabold ${visual.progressText}`}>
            {visual.openTasks} Open Tasks
          </span>
        </div>

        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-[#e9eef5]">
          <div
            className={`h-full rounded-full ${visual.progressFill}`}
            style={{ width: `${visual.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-7 border-t border-[#edf2f7] pt-5">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex">
            <div className="z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#f2d1bc] text-[11px] font-bold text-[#334155]">
              A
            </div>
            <div className="-ml-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#dbc0a5] text-[11px] font-bold text-[#334155]">
              B
            </div>
            <div className="-ml-2 z-30 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#f8fafc] text-[11px] font-bold text-[#334155]">
              +3
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-flex rounded-xl px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] ${visual.statusBg} ${visual.statusText}`}
            >
              {project.status === "ARCHIVED" ? "ARCHIVED" : visual.status}
            </span>

            <p className="mt-2 text-[12px] italic text-[#94a3b8]">
              {visual.updated}
            </p>

            {tab === "ARCHIVED" ? (
              <button
                type="button"
                onClick={handleRestore}
                className="mt-3 rounded-full bg-[#eef4ff] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#2563eb]"
              >
                Restore
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}

function BottomProjectsNav() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 rounded-t-[28px] border-t border-[#e6ebf3] bg-white/95 px-4 pb-[max(env(safe-area-inset-bottom),14px)] pt-5 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-md items-end justify-around">
        <Link href="/dashboard" className="flex flex-col items-center gap-2 text-[#94a3b8]">
          <LayoutGrid className="h-6 w-6" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.16em]">
            Home
          </span>
        </Link>

        <Link href="/projects" className="flex flex-col items-center gap-2 text-[#2563eb]">
          <Folder className="h-6 w-6 fill-current" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.16em]">
            Projects
          </span>
        </Link>

        <Link href="/my-tasks" className="flex flex-col items-center gap-2 text-[#94a3b8]">
          <CheckCircle2 className="h-6 w-6" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.16em]">
            Tasks
          </span>
        </Link>

        <Link href="/profile" className="flex flex-col items-center gap-2 text-[#94a3b8]">
          <UserRound className="h-6 w-6" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.16em]">
            Profile
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function ProjectsListMobile({
  projects,
  tab,
  search,
  onSearchChange,
  onTabChange,
  onOpenCreate,
  onProjectStatusChanged,
  sortBy,
  onSortChange,
  isTabEmpty,
  isSearchEmpty,
}: Props) {
    function sortLabel(value: "RECENT" | "NAME_ASC" | "NAME_DESC") {
      if (value === "NAME_ASC") return "A–Z";
      if (value === "NAME_DESC") return "Z–A";
      return "Recent";
    }
  const showEmpty = isTabEmpty || isSearchEmpty;

  return (
    <div className="min-h-screen bg-[#f5f7fb] pb-32 lg:hidden">
      <div className="mx-auto w-full max-w-md px-7 pt-10">
        <header className="mb-9 flex items-center justify-between">
          <h1 className="text-[28px] font-extrabold tracking-tight text-[#020617]">
            Projects
          </h1>

          <button
            onClick={onOpenCreate}
            className="flex h-[56px] w-[56px] items-center justify-center rounded-[20px] bg-[#2563eb] text-white shadow-[0_18px_32px_rgba(37,99,235,0.28)]"
          >
            <span className="text-[34px] leading-none">+</span>
          </button>
        </header>

        <div className="rounded-[26px]">
          <div className="rounded-[24px] border border-[#e6ebf3] bg-white px-5 py-[18px] shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <div className="relative">
              <Search className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a3b8]" />
              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search your projects..."
                className="w-full bg-transparent pl-9 text-[15px] text-[#334155] outline-none placeholder:text-[#9aa9c2]"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onTabChange("ACTIVE")}
                className={`rounded-full px-6 py-3 text-[14px] font-extrabold ${
                  tab === "ACTIVE"
                    ? "bg-[#0f1d46] text-white shadow-[0_10px_22px_rgba(15,29,70,0.18)]"
                    : "border border-[#dfe7f2] bg-white text-[#334155]"
                }`}
              >
                Active
              </button>

              <button
                onClick={() => onTabChange("ARCHIVED")}
                className={`rounded-full px-6 py-3 text-[14px] font-extrabold ${
                  tab === "ARCHIVED"
                    ? "bg-[#0f1d46] text-white shadow-[0_10px_22px_rgba(15,29,70,0.18)]"
                    : "border border-[#dfe7f2] bg-white text-[#334155]"
                }`}
              >
                Archived
              </button>
            </div>

            <div className="flex items-center gap-3 pl-3">
              <div className="h-8 w-px bg-[#e2e8f0]" />
              <select
                value={sortBy}
                onChange={(e) =>
                  onSortChange(e.target.value as "RECENT" | "NAME_ASC" | "NAME_DESC")
                }
                className="bg-transparent text-[14px] font-bold text-[#334155] outline-none"
              >
                <option value="RECENT">Recent</option>
                <option value="NAME_ASC">A–Z</option>
                <option value="NAME_DESC">Z–A</option>
              </select>
            </div>
          </div>
        </div>

        <section className="mt-9 space-y-6">
          {showEmpty ? (
            <div className="rounded-[28px] border border-[#e6ebf3] bg-white px-6 py-12 text-center shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
              <h3 className="text-[20px] font-extrabold tracking-tight text-[#0f172a]">
                {isSearchEmpty
                  ? "No matching projects"
                  : tab === "ARCHIVED"
                  ? "No archived projects"
                  : "No active projects"}
              </h3>

              <p className="mt-3 text-[14px] leading-7 text-[#64748b]">
                {isSearchEmpty
                  ? "Try a different project name, key, or description."
                  : tab === "ARCHIVED"
                  ? "Archived projects will appear here."
                  : "Create a project to start tracking work."}
              </p>

              {isSearchEmpty ? (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="mt-5 rounded-full bg-[#eef4ff] px-5 py-2.5 text-[13px] font-extrabold text-[#2563eb]"
                >
                  Clear Search
                </button>
              ) : null}
            </div>
          ) : (
            projects.map((project, index) => (
              <MobileProjectCard
                key={project.id}
                project={project}
                index={index}
                tab={tab}
                onProjectStatusChanged={onProjectStatusChanged}
              />
            ))
          )}
        </section>

        {!showEmpty ? (
          <>
            <button className="mt-10 w-full rounded-full border border-[#dfe7f2] bg-white px-6 py-5 text-[16px] font-extrabold text-[#334155] shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              Show 12 more projects
            </button>

            <div className="mt-8 flex items-center justify-center gap-3 pb-4">
              <button className="flex h-12 w-12 items-center justify-center rounded-full border border-[#dfe7f2] bg-white text-[#94a3b8]">
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2563eb] text-[18px] font-extrabold text-white shadow-[0_12px_24px_rgba(37,99,235,0.24)]">
                1
              </button>

              <button className="flex h-12 w-12 items-center justify-center rounded-full border border-[#dfe7f2] bg-white text-[18px] font-extrabold text-[#334155]">
                2
              </button>

              <button className="flex h-12 w-12 items-center justify-center rounded-full border border-[#dfe7f2] bg-white text-[18px] font-extrabold text-[#334155]">
                3
              </button>

              <span className="px-1 text-lg font-extrabold text-[#94a3b8]">...</span>

              <button className="flex h-12 w-12 items-center justify-center rounded-full border border-[#dfe7f2] bg-white text-[#94a3b8]">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </>
        ) : null}
      </div>

      <BottomProjectsNav />
    </div>
  );
}