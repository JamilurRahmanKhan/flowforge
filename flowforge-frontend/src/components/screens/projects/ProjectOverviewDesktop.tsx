"use client";

import TaskCommentsPanel from "@/components/screens/tasks/TaskCommentsPanel";
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

function actionLabel(status: string) {
  if (status === "TODO") return "Start";
  if (status === "IN_PROGRESS") return "Mark Done";
  return "Reset";
}

function badgeClass(status: string) {
  if (status === "DONE") return "bg-emerald-100 text-emerald-700";
  if (status === "IN_PROGRESS") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

export default function ProjectOverviewDesktop({
  project,
  tasks,
  memberNameMap,
  activeTaskId,
  onSelectTask,
  onEdit,
  onCreateTask,
  onStatusChanged,
  onEditTask,
  onDeleteTask,
}: {
  project: Project;
  tasks: Task[];
  memberNameMap: Record<string, string>;
  activeTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onEdit: () => void;
  onCreateTask: () => void;
  onStatusChanged: (task: Task) => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}) {
  const todo = tasks.filter((task) => task.status === "TODO").length;
  const inProgress = tasks.filter((task) => task.status === "IN_PROGRESS").length;
  const done = tasks.filter((task) => task.status === "DONE").length;

  const recentTasks = [...tasks].slice(0, 5);

  return (
    <div className="space-y-8">
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
                  className={`rounded-[20px] border px-5 py-4 ${
                    activeTaskId === task.id
                      ? "border-[#2563eb] bg-[#f8fbff]"
                      : "border-[#eef2f7] bg-[#f8fafc]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => onSelectTask(task.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="truncate text-[15px] font-extrabold text-[#0f172a]">
                        {task.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-6 text-[#64748b]">
                        {task.description || "No description provided."}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#64748b]">
                        <span>
                          Assignee:{" "}
                          {task.assigneeId
                            ? memberNameMap[task.assigneeId] || "Unknown member"
                            : "Unassigned"}
                        </span>
                        <span>•</span>
                        <span>Due: {formatDueDate(task.dueDate)}</span>
                      </div>
                    </button>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${badgeClass(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onStatusChanged(task)}
                      className="rounded-full bg-[#2563eb] px-3 py-1.5 text-[11px] font-extrabold text-white"
                    >
                      {actionLabel(task.status)}
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditTask(task)}
                      className="rounded-full border border-[#dbe4f0] px-3 py-1.5 text-[11px] font-extrabold text-[#334155]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTask(task)}
                      className="rounded-full border border-rose-200 px-3 py-1.5 text-[11px] font-extrabold text-rose-600"
                    >
                      Delete
                    </button>
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

        <div className="space-y-6">
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

          {activeTaskId ? (
            <TaskCommentsPanel taskId={activeTaskId} />
          ) : (
            <div className="rounded-[24px] border border-dashed border-[#dbe4f0] bg-white px-5 py-10 text-center text-[14px] font-medium text-[#94a3b8]">
              Select a task to view and add comments.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}