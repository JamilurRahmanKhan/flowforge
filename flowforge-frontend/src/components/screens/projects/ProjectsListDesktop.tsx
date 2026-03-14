"use client";

import Link from "next/link";
import { unarchiveProject } from "@/features/projects/api";
import {
  Bell,
  Folder,
  LayoutGrid,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  CheckCircle2,
  UserRound,
  Zap,
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

function DesktopSidebar() {
  return (
    <aside className="flex h-screen w-[270px] flex-col border-r border-[#e6ebf3] bg-white px-5 py-6">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2563eb] text-white shadow-[0_10px_24px_rgba(37,99,235,0.24)]">
          <Zap className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-[18px] font-extrabold tracking-tight text-[#0f172a]">
            FlowForge
          </h2>
          <p className="text-[11px] font-medium text-[#64748b]">Enterprise</p>
        </div>
      </div>

      <nav className="mt-10 space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-[18px] px-4 py-3 text-[15px] font-bold text-[#475569] hover:bg-[#f8fafc]"
        >
          <LayoutGrid className="h-4 w-4" />
          Dashboard
        </Link>

        <Link
          href="/projects"
          className="flex items-center gap-3 rounded-[18px] bg-[#f1f5f9] px-4 py-3 text-[15px] font-bold text-[#0f172a]"
        >
          <Folder className="h-4 w-4" />
          Projects
        </Link>

        <Link
          href="/my-tasks"
          className="flex items-center gap-3 rounded-[18px] px-4 py-3 text-[15px] font-bold text-[#475569] hover:bg-[#f8fafc]"
        >
          <CheckCircle2 className="h-4 w-4" />
          My Tasks
        </Link>

        <Link
          href="/members"
          className="flex items-center gap-3 rounded-[18px] px-4 py-3 text-[15px] font-bold text-[#475569] hover:bg-[#f8fafc]"
        >
          <UserRound className="h-4 w-4" />
          Members
        </Link>

        <Link
          href="/activity"
          className="flex items-center gap-3 rounded-[18px] px-4 py-3 text-[15px] font-bold text-[#475569] hover:bg-[#f8fafc]"
        >
          <Bell className="h-4 w-4" />
          Activity
        </Link>
      </nav>

      <div className="mt-auto space-y-3 px-2">
        <div className="rounded-[22px] bg-[#0f172a] px-5 py-5 text-white">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/70">
            Pro Plan
          </p>
          <h3 className="mt-3 text-[18px] font-extrabold leading-snug">
            Unlock advanced team collaboration
          </h3>
          <button className="mt-4 rounded-full bg-white px-4 py-2 text-[13px] font-extrabold text-[#0f172a]">
            Upgrade
          </button>
        </div>

        <button className="flex items-center gap-3 rounded-[18px] px-4 py-3 text-[15px] font-bold text-[#475569] hover:bg-[#f8fafc]">
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>
    </aside>
  );
}

function DesktopProjectCard({
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
      className="block rounded-[28px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5"
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
            <h3 className="truncate text-[22px] font-extrabold tracking-tight text-[#0f172a]">
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

export default function ProjectsListDesktop({
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
  const showEmpty = isTabEmpty || isSearchEmpty;

  return (
    <div className="hidden min-h-screen bg-[#f5f7fb] lg:block">
      <div className="grid min-h-screen grid-cols-[270px_1fr]">
        <DesktopSidebar />

        <main className="px-8 py-8 xl:px-10">
          <div className="mx-auto max-w-[1180px]">
            <div className="rounded-[34px] bg-white px-8 py-8 shadow-[0_14px_34px_rgba(15,23,42,0.05)] xl:px-10">
              <div className="mb-9 flex items-start justify-between">
                <div>
                  <h1 className="text-[34px] font-extrabold tracking-tight text-[#020617]">
                    Projects
                  </h1>
                  <p className="mt-2 text-[15px] text-[#64748b]">
                    Manage active and archived projects across your workspace.
                  </p>
                </div>

                <button
                  onClick={onOpenCreate}
                  className="flex h-[56px] w-[56px] items-center justify-center rounded-[20px] bg-[#2563eb] text-white shadow-[0_18px_32px_rgba(37,99,235,0.28)]"
                >
                  <Plus className="h-7 w-7" />
                </button>
              </div>

              <div className="rounded-[30px] border border-[#edf2f7] bg-[#fbfcff] p-5">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search your projects..."
                    className="h-[58px] w-full rounded-[20px] border border-[#dfe7f2] bg-white pl-12 pr-4 text-[15px] text-[#334155] outline-none placeholder:text-[#9aa9c2] focus:border-[#2563eb]"
                  />
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onTabChange("ACTIVE")}
                      className={`rounded-full px-6 py-3 text-[15px] font-extrabold ${
                        tab === "ACTIVE"
                          ? "bg-[#0f1d46] text-white shadow-[0_10px_22px_rgba(15,29,70,0.18)]"
                          : "border border-[#dfe7f2] bg-white text-[#334155]"
                      }`}
                    >
                      Active
                    </button>

                    <button
                      onClick={() => onTabChange("ARCHIVED")}
                      className={`rounded-full px-6 py-3 text-[15px] font-extrabold ${
                        tab === "ARCHIVED"
                          ? "bg-[#0f1d46] text-white shadow-[0_10px_22px_rgba(15,29,70,0.18)]"
                          : "border border-[#dfe7f2] bg-white text-[#334155]"
                      }`}
                    >
                      Archived
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-[#334155]">
                    <div className="h-8 w-px bg-[#e2e8f0]" />
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        onSortChange(e.target.value as "RECENT" | "NAME_ASC" | "NAME_DESC")
                      }
                      className="bg-transparent text-[15px] font-bold outline-none"
                    >
                      <option value="RECENT">Sort by Recent</option>
                      <option value="NAME_ASC">Sort by Name A–Z</option>
                      <option value="NAME_DESC">Sort by Name Z–A</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                {showEmpty ? (
                  <div className="rounded-[28px] border border-[#e6ebf3] bg-white px-8 py-14 text-center shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                    <h3 className="text-[24px] font-extrabold tracking-tight text-[#0f172a]">
                      {isSearchEmpty
                        ? "No matching projects"
                        : tab === "ARCHIVED"
                        ? "No archived projects"
                        : "No active projects"}
                    </h3>

                    <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-7 text-[#64748b]">
                      {isSearchEmpty
                        ? "Try another project name, key, or description."
                        : tab === "ARCHIVED"
                        ? "Archived projects will appear here when you archive them."
                        : "Create a project to start tracking work, progress, and collaboration."}
                    </p>

                    {isSearchEmpty ? (
                      <button
                        type="button"
                        onClick={() => onSearchChange("")}
                        className="mt-6 rounded-full bg-[#eef4ff] px-5 py-2.5 text-[13px] font-extrabold text-[#2563eb]"
                      >
                        Clear Search
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-3">
                    {projects.map((project, index) => (
                       <DesktopProjectCard
                         key={project.id}
                         project={project}
                         index={index}
                         tab={tab}
                         onProjectStatusChanged={onProjectStatusChanged}
                       />
                     ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}