"use client";

import type { Project } from "@/features/projects/types";
import type { Task } from "@/features/tasks/types";

type Props = {
  project: Project;
  tasks: Task[];
  onEdit: () => void;
  onCreateTask: () => void;
};

function StatCard({
  title,
  value,
  subtitle,
  colorClass,
  iconBg,
}: {
  title: string;
  value: string;
  subtitle: string;
  colorClass: string;
  iconBg: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div
          className={`flex size-10 items-center justify-center rounded-lg ${iconBg}`}
        >
          <span className={`text-lg font-bold ${colorClass}`}>●</span>
        </div>
      </div>

      <h3 className="mb-1 text-sm font-semibold text-slate-500">{title}</h3>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}

function statusBadgeClass(status: string) {
  if (status === "DONE") return "bg-emerald-100 text-emerald-600";
  if (status === "IN_PROGRESS") return "bg-amber-100 text-amber-600";
  return "bg-slate-100 text-slate-600";
}

function RecentTaskRow({ task }: { task: Task }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
      <div className="flex size-10 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-400">
        <CheckIcon />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">
          {task.title}
        </p>
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

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M16.707 5.293a1 1 0 010 1.414l-7.2 7.2a1 1 0 01-1.414 0l-3.2-3.2a1 1 0 111.414-1.414L8.8 11.786l6.493-6.493a1 1 0 011.414 0z" />
    </svg>
  );
}

export default function ProjectOverviewDesktop({
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
    .slice(0, 5);

  return (
    <div className="hidden lg:block">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 grid grid-cols-4 gap-6">
          <StatCard
            title="Total Tasks"
            value={String(totalTasks)}
            subtitle="All project tasks"
            colorClass="text-blue-600"
            iconBg="bg-blue-50"
          />
          <StatCard
            title="To Do"
            value={String(todoCount)}
            subtitle="Pending work"
            colorClass="text-slate-600"
            iconBg="bg-slate-50"
          />
          <StatCard
            title="In Progress"
            value={String(inProgressCount)}
            subtitle="Currently active"
            colorClass="text-amber-600"
            iconBg="bg-amber-50"
          />
          <StatCard
            title="Done"
            value={String(doneCount)}
            subtitle="Completed tasks"
            colorClass="text-emerald-600"
            iconBg="bg-emerald-50"
          />
        </div>

        <div className="col-span-8 space-y-6">
          <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Description
                </h3>
                <p className="mt-2 text-[15px] leading-7 text-slate-600">
                  {project.description ||
                    "No description added yet for this project."}
                </p>
              </div>

              <button
                type="button"
                onClick={onEdit}
                className="rounded-full bg-[#1f68f9]/10 px-4 py-2 text-sm font-bold text-[#1f68f9]"
              >
                Edit
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Recent Tasks
              </h3>

              <button
                type="button"
                onClick={onCreateTask}
                className="rounded-full bg-[#1f68f9] px-4 py-2 text-sm font-bold text-white"
              >
                + New Task
              </button>
            </div>

            <div className="space-y-3">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <RecentTaskRow key={task.id} task={task} />
                ))
              ) : (
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
                  No tasks found for this project yet.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="col-span-4 space-y-6">
          <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
              Project Info
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Project Name
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {project.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Project Key
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {project.key}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Visibility
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {project.visibility || "PUBLIC"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Workflow
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {project.defaultWorkflow || "Standard Agile (Kanban)"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Status
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {project.status}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
              Task Summary
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Total</span>
                <span className="font-bold text-slate-900">{totalTasks}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">TODO</span>
                <span className="font-bold text-slate-900">{todoCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">IN PROGRESS</span>
                <span className="font-bold text-slate-900">
                  {inProgressCount}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">DONE</span>
                <span className="font-bold text-slate-900">{doneCount}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}