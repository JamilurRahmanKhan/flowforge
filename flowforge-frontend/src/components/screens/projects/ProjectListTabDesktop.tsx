"use client";

import { useState } from "react";
import { updateTaskStatus } from "@/features/tasks/api";
import type { Task } from "@/features/tasks/types";

type Props = {
  tasks: Task[];
  onCreateTask: () => void;
  onStatusChanged: () => Promise<void>;
};

function statusBadgeClass(status: string) {
  if (status === "DONE") return "bg-emerald-100 text-emerald-600";
  if (status === "IN_PROGRESS") return "bg-amber-100 text-amber-600";
  return "bg-slate-100 text-slate-600";
}

function priorityBadgeClass(priority: string) {
  const value = priority?.toUpperCase?.() || "";

  if (value === "HIGH" || value === "URGENT") return "bg-rose-100 text-rose-600";
  if (value === "MEDIUM") return "bg-amber-100 text-amber-600";
  return "bg-slate-100 text-slate-600";
}

function formatDueDate(dueDate?: string | null) {
  if (!dueDate) return "No due date";
  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) return "No due date";
  return date.toLocaleDateString();
}

function nextStatus(status: string) {
  if (status === "TODO") return "IN_PROGRESS";
  if (status === "IN_PROGRESS") return "DONE";
  return "TODO";
}

function actionLabel(status: string) {
  if (status === "TODO") return "Start";
  if (status === "IN_PROGRESS") return "Done";
  return "Reset";
}

function StatusAction({
  task,
  onStatusChanged,
}: {
  task: Task;
  onStatusChanged: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);
      await updateTaskStatus(task.id, nextStatus(task.status));
      await onStatusChanged();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="rounded-full bg-[#2563eb] px-3 py-1.5 text-[11px] font-extrabold text-white disabled:opacity-60"
    >
      {loading ? "..." : actionLabel(task.status)}
    </button>
  );
}

export default function ProjectListTabDesktop({
  tasks,
  onCreateTask,
  onStatusChanged,
}: Props) {
  const sortedTasks = [...tasks].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  return (
    <div className="hidden lg:block">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-extrabold tracking-tight text-slate-900">
            Task List
          </h2>
          <p className="mt-1 text-[14px] text-slate-500">
            All tasks inside this project.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateTask}
          className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[14px] font-extrabold text-white shadow-[0_16px_30px_rgba(37,99,235,0.24)]"
        >
          + Add Task
        </button>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1.6fr_0.7fr_0.7fr_0.8fr_0.7fr] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            Task
          </p>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            Status
          </p>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            Priority
          </p>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            Due Date
          </p>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            Action
          </p>
        </div>

        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              className="grid grid-cols-[1.6fr_0.7fr_0.7fr_0.8fr_0.7fr] gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate text-[15px] font-bold text-slate-900">
                  {task.title}
                </p>
                <p className="mt-1 line-clamp-2 text-[13px] leading-6 text-slate-500">
                  {task.description || "No description provided for this task."}
                </p>
              </div>

              <div className="flex items-start">
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide ${statusBadgeClass(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>

              <div className="flex items-start">
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide ${priorityBadgeClass(
                    task.priority
                  )}`}
                >
                  {task.priority || "LOW"}
                </span>
              </div>

              <div className="text-[13px] font-semibold text-slate-500">
                {formatDueDate(task.dueDate)}
              </div>

              <div>
                <StatusAction task={task} onStatusChanged={onStatusChanged} />
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-12 text-center text-[14px] font-medium text-slate-400">
            No tasks found for this project yet.
          </div>
        )}
      </div>
    </div>
  );
}