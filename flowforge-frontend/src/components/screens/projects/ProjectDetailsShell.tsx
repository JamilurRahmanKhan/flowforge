"use client";

import Link from "next/link";
import {
  Archive,
  Bell,
  CheckCircle2,
  ChevronLeft,
  Folder,
  LayoutGrid,
  MessageSquare,
  MoreHorizontal,
  Settings,
  UserRound,
  Users,
  Zap,
  RotateCcw,
} from "lucide-react";
import type { Project } from "@/features/projects/types";

type TabKey = "overview" | "board" | "list" | "members" | "activity";

type Props = {
  project: Project;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onArchive?: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
};

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "board", label: "Board" },
  { key: "list", label: "List" },
  { key: "members", label: "Members" },
  { key: "activity", label: "Activity" },
];

function DesktopSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-full flex-col justify-between p-6">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#1f68f9] text-white">
              <Zap className="h-5 w-5" />
            </div>

            <div className="flex flex-col">
              <h1 className="text-base font-bold leading-none text-slate-900">
                FlowForge
              </h1>
              <p className="text-xs font-medium text-slate-500">Workspace</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 transition-colors hover:bg-[#1f68f9]/5 hover:text-[#1f68f9]"
            >
              <LayoutGrid className="h-5 w-5" />
              <span className="text-sm font-semibold">Dashboard</span>
            </Link>

            <Link
              href="/projects"
              className="flex items-center gap-3 rounded-lg bg-[#1f68f9]/10 px-3 py-2.5 text-[#1f68f9]"
            >
              <Folder className="h-5 w-5" />
              <span className="text-sm font-semibold">Projects</span>
            </Link>

            <Link
              href="/my-tasks"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 transition-colors hover:bg-[#1f68f9]/5 hover:text-[#1f68f9]"
            >
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-semibold">Tasks</span>
            </Link>

            <Link
              href="/members"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 transition-colors hover:bg-[#1f68f9]/5 hover:text-[#1f68f9]"
            >
              <Users className="h-5 w-5" />
              <span className="text-sm font-semibold">Team</span>
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 transition-colors hover:bg-[#1f68f9]/5 hover:text-[#1f68f9]"
            >
              <Settings className="h-5 w-5" />
              <span className="text-sm font-semibold">Settings</span>
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Storage Usage
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-[72%] bg-[#1f68f9]" />
            </div>
            <p className="mt-2 text-[10px] text-slate-500">
              7.2 GB of 10 GB used
            </p>
          </div>

          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f68f9] py-3 font-bold text-white shadow-lg shadow-[#1f68f9]/20 transition hover:bg-[#1f68f9]/90">
            <span className="text-lg">+</span>
            <span className="text-sm">New Project</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function MobileHeader({
  project,
  activeTab,
  onTabChange,
  onArchive,
  onDelete,
}: {
  project: Project;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onArchive?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1f68f9]/10 text-[#1f68f9]"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-900">
              FlowForge
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Project Key: {project.key}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onArchive}
          className="rounded-lg p-2 transition hover:bg-slate-100"
        >
          {project.status === "ARCHIVED" ? (
            <RotateCcw className="h-5 w-5 text-slate-700" />
          ) : (
            <MoreHorizontal className="h-5 w-5 text-slate-700" />
          )}
        </button>
      </div>

      <div className="hide-scrollbar flex gap-6 overflow-x-auto border-b border-slate-100 px-4">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`shrink-0 border-b-2 pb-3 pt-2 ${
                active
                  ? "border-[#1f68f9] text-[#1f68f9]"
                  : "border-transparent text-slate-500"
              }`}
            >
              <p className={`text-sm ${active ? "font-bold" : "font-medium"}`}>
                {tab.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DesktopHeader({
  project,
  activeTab,
  onTabChange,
  onArchive,
  onDelete,
}: {
  project: Project;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onArchive?: () => void;
  onDelete?: () => void;
}) {
  return (
    <>
      <header className="hidden h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8 lg:flex">
        <div className="flex items-center gap-4">
          <Link href="/projects" className="text-slate-400">
            <ChevronLeft className="h-5 w-5" />
          </Link>

          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            {project.name} ({project.key})
          </h2>

          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
              project.status === "ARCHIVED"
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {project.status === "ARCHIVED" ? "Archived" : "Active"}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative max-w-xs">
            <SearchIcon />
          </div>

          <div className="flex items-center gap-3">
            <button className="flex size-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100">
              <Bell className="h-5 w-5" />
            </button>
            <button className="flex size-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100">
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>

          <div className="h-8 w-px bg-slate-200" />

          <div className="flex items-center gap-3">
            <div className="size-9 overflow-hidden rounded-full bg-slate-200">
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-600">
                JR
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onArchive}
                className="rounded-lg p-2 transition hover:bg-slate-100"
              >
                {project.status === "ARCHIVED" ? (
                  <RotateCcw className="h-5 w-5 text-slate-700" />
                ) : (
                  <Archive className="h-5 w-5 text-slate-700" />
                )}
              </button>

              <button
                type="button"
                onClick={onDelete}
                className="rounded-full p-2 text-rose-500 transition hover:bg-rose-50"
                title="Delete Project"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="hidden border-b border-slate-200 bg-white px-8 lg:flex">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`border-b-2 px-6 py-3 text-sm transition-colors ${
                active
                  ? "border-[#1f68f9] font-bold text-[#1f68f9]"
                  : "border-transparent font-semibold text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </>
  );
}

function SearchIcon() {
  return (
    <>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 3a6 6 0 104.472 10.01l3.259 3.259a1 1 0 001.414-1.414l-3.259-3.26A6 6 0 009 3zm-4 6a4 4 0 118 0 4 4 0 01-8 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <input
        className="w-64 rounded-lg border-none bg-slate-50 py-2 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-[#1f68f9]/20"
        placeholder="Search tasks..."
        type="text"
      />
    </>
  );
}

export default function ProjectDetailsShell({
  project,
  activeTab,
  onTabChange,
  onArchive,
  onDelete,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-900">
      <div className="flex min-h-screen overflow-hidden">
        <DesktopSidebar />

        <main className="flex flex-1 flex-col overflow-hidden">
          <MobileHeader
            project={project}
            activeTab={activeTab}
            onTabChange={onTabChange}
            onArchive={onArchive}
            onDelete={onDelete}
          />
          <DesktopHeader
            project={project}
            activeTab={activeTab}
            onTabChange={onTabChange}
            onArchive={onArchive}
            onDelete={onDelete}
          />

          <div className="hide-scrollbar flex-1 overflow-y-auto p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}