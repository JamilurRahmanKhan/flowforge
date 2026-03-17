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

export default function ProjectListTabMobile({
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
    <div className="lg:hidden">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-extrabold tracking-tight text-slate-900">
            Task List
          </h2>
          <p className="mt-1 text-[13px] text-slate-500">
            All tasks in this project
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateTask}
          className="rounded-full bg-[#2563eb] px-4 py-2 text-[12px] font-extrabold text-white shadow-[0_16px_30px_rgba(37,99,235,0.24)]"
        >
          + Add Task
        </button>
      </div>

      <div className="space-y-3">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="line-clamp-2 text-[15px] font-bold leading-6 text-slate-900">
                  {task.title}
                </h3>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${priorityBadgeClass(
                    task.priority
                  )}`}
                >
                  {task.priority || "LOW"}
                </span>
              </div>

              <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-slate-500">
                {task.description || "No description provided for this task."}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide ${statusBadgeClass(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>

                <span className="text-[12px] font-semibold text-slate-400">
                  {formatDueDate(task.dueDate)}
                </span>
              </div>

              <div className="mt-4">
                <StatusAction task={task} onStatusChanged={onStatusChanged} />
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-[13px] font-medium text-slate-400">
            No tasks found for this project yet.
          </div>
        )}
      </div>
    </div>
  );
}