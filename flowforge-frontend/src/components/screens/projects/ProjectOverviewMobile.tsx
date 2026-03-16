"use client";

import Link from "next/link";
import { CheckCircle2, Folder, Home, UserRound } from "lucide-react";
import type { Project } from "@/features/projects/types";
import type { Task } from "@/features/tasks/types";

type Props = {
  project: Project;
  tasks: Task[];
  onEdit: () => void;
  onCreateTask: () => void;
};

function MobileStatCard({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: string;
  colorClass: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}

function statusBadgeClass(status: string) {
  if (status === "DONE") return "bg-emerald-100 text-emerald-600";
  if (status === "IN_PROGRESS") return "bg-amber-100 text-amber-600";
  return "bg-slate-100 text-slate-600";
}

function MobileTaskRow({ task }: { task: Task }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
      <div className="flex size-10 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-400">
        <CheckCircle2 className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{task.title}</p>
        <p className="text-xs text-slate-500">
          Priority: {task.priority || "N/A"}
        </p>
      </div>

      <span
        className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-tight ${statusBadgeClass(
          task.status
        )}`}
      >
        {task.status}
      </span>
    </div>
  );
}

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-md -translate-x-1/2 items-center justify-around border-t border-slate-200 bg-white px-4 pb-6 pt-3 lg:hidden">
      <Link
        href="/dashboard"
        className="flex flex-col items-center gap-1 text-slate-400"
      >
        <Home className="h-5 w-5" />
        <p className="text-[10px] font-bold uppercase tracking-wider">Home</p>
      </Link>

      <Link
        href="/projects"
        className="flex flex-col items-center gap-1 text-[#1f68f9]"
      >
        <Folder className="h-5 w-5" />
        <p className="text-[10px] font-bold uppercase tracking-wider">
          Projects
        </p>
      </Link>

      <Link
        href="/my-tasks"
        className="flex flex-col items-center gap-1 text-slate-400"
      >
        <CheckCircle2 className="h-5 w-5" />
        <p className="text-[10px] font-bold uppercase tracking-wider">Tasks</p>
      </Link>

      <Link
        href="/profile"
        className="flex flex-col items-center gap-1 text-slate-400"
      >
        <UserRound className="h-5 w-5" />
        <p className="text-[10px] font-bold uppercase tracking-wider">
          Profile
        </p>
      </Link>
    </nav>
  );
}

export default function ProjectOverviewMobile({
  project,
  tasks,
  onEdit,
  onCreateTask,
}: Props) {
  const totalTasks = tasks.length;
  const todoCount = tasks.filter((task) => task.status === "TODO").length;
  const inProgressCount = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;
  const doneCount = tasks.filter((task) => task.status === "DONE").length;

  const recentTasks = [...tasks]
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 4);

  return (
    <div className="lg:hidden">
      <main className="pb-24">
        <div className="p-4">
          <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#1f68f9] to-blue-400 text-white shadow-lg shadow-[#1f68f9]/20">
              <span className="text-3xl">🚀</span>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                {project.name}
              </h2>
              <p className="text-sm text-slate-500">
                Project Key: {project.key}
              </p>
              <div className="mt-1 flex items-center gap-1">
                <span className="inline-block size-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold capitalize text-emerald-600">
                  {project.status === "ARCHIVED" ? "Archived" : "Active"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 px-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Description
              </h3>

              <button
                type="button"
                onClick={onEdit}
                className="rounded-full bg-[#1f68f9]/10 px-3 py-1.5 text-xs font-bold text-[#1f68f9]"
              >
                Edit
              </button>
            </div>

            <p className="text-sm leading-relaxed text-slate-600">
              {project.description ||
                "No description added yet for this project."}
            </p>
          </div>
        </div>

        <div className="mb-6 px-4">
          <h3 className="mb-3 px-1 text-sm font-bold uppercase tracking-wider text-slate-400">
            Task Statistics
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <MobileStatCard
              label="Total"
              value={String(totalTasks)}
              colorClass="text-[#1f68f9]"
            />
            <MobileStatCard
              label="TODO"
              value={String(todoCount)}
              colorClass="text-slate-600"
            />
            <MobileStatCard
              label="In Progress"
              value={String(inProgressCount)}
              colorClass="text-amber-500"
            />
            <MobileStatCard
              label="Done"
              value={String(doneCount)}
              colorClass="text-emerald-500"
            />
          </div>
        </div>

        <div className="mb-6 px-4">
          <div className="mb-3 flex items-center justify-between px-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Recent Tasks
            </h3>

            <button
              type="button"
              onClick={onCreateTask}
              className="text-xs font-bold text-[#1f68f9]"
            >
              + New Task
            </button>
          </div>

          <div className="space-y-2">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <MobileTaskRow key={task.id} task={task} />
              ))
            ) : (
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
                No tasks found for this project yet.
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}