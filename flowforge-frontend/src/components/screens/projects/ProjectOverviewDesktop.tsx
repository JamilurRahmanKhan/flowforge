"use client";

import type { Project } from "@/features/projects/types";
import type { Task } from "@/features/tasks/types";

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
        {label}
      </p>
      <p className="mt-3 text-[34px] font-extrabold tracking-tight text-[#0f172a]">
        {value}
      </p>
      <div className="mt-4 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
    </div>
  );
}

function formatDueDate(value?: string | null) {
  if (!value) return "No due date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No due date";
  return date.toLocaleDateString();
}

export default function ProjectOverviewDesktop({
  project,
  tasks,
  onEdit,
  onCreateTask,
}: {
  project: Project;
  tasks: Task[];
  onEdit: () => void;
  onCreateTask: () => void;
}) {
  const todo = tasks.filter((task) => task.status === "TODO").length;
  const inProgress = tasks.filter((task) => task.status === "IN_PROGRESS").length;
  const done = tasks.filter((task) => task.status === "DONE").length;

  const recentTasks = [...tasks].slice(0, 5);

  return (
    <div className="hidden lg:block space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
            Project Summary
          </p>
          <h2 className="mt-3 text-[34px] font-extrabold tracking-tight text-[#0f172a]">
            Overview
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-full border border-[#dbe4f0] px-4 py-2.5 text-[13px] font-extrabold text-[#334155]"
          >
            Edit Project
          </button>
          <button
            type="button"
            onClick={onCreateTask}
            className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[13px] font-extrabold text-white"
          >
            + Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <StatCard label="Total Tasks" value={String(tasks.length)} accent="#2563eb" />
        <StatCard label="To Do" value={String(todo)} accent="#94a3b8" />
        <StatCard label="In Progress" value={String(inProgress)} accent="#f59e0b" />
        <StatCard label="Done" value={String(done)} accent="#22c55e" />
      </div>

      <div className="grid grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="rounded-[28px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <h3 className="text-[22px] font-extrabold tracking-tight text-[#0f172a]">
            Recent Tasks
          </h3>

          <div className="mt-6 space-y-4">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-[20px] border border-[#eef2f7] bg-[#f8fafc] px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-extrabold text-[#0f172a]">
                        {task.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-6 text-[#64748b]">
                        {task.description || "No description provided."}
                      </p>
                    </div>

                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#475569]">
                      {task.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[20px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-5 py-8 text-center text-[14px] font-medium text-[#94a3b8]">
                No tasks yet for this project.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <h3 className="text-[22px] font-extrabold tracking-tight text-[#0f172a]">
            Project Info
          </h3>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                Project Key
              </p>
              <p className="mt-2 text-[16px] font-bold text-[#0f172a]">{project.key}</p>
            </div>

            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                Visibility
              </p>
              <p className="mt-2 text-[16px] font-bold text-[#0f172a]">
                {project.visibility || "PRIVATE"}
              </p>
            </div>

            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                Default Workflow
              </p>
              <p className="mt-2 text-[16px] font-bold text-[#0f172a]">
                {project.defaultWorkflow || "KANBAN"}
              </p>
            </div>

            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                Next Due Date
              </p>
              <p className="mt-2 text-[16px] font-bold text-[#0f172a]">
                {formatDueDate(
                  tasks
                    .filter((task) => !!task.dueDate)
                    .sort(
                      (a, b) =>
                        new Date(a.dueDate || "").getTime() -
                        new Date(b.dueDate || "").getTime()
                    )[0]?.dueDate || null
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}