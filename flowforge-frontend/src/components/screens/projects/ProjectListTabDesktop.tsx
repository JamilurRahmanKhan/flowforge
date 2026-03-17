"use client";

import { useState } from "react";
import { updateTaskStatus } from "@/features/tasks/api";
import type { Task } from "@/features/tasks/types";

type Props = {
  tasks: Task[];
  onCreateTask: () => void;
  onStatusChanged: () => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
};

function statusBadgeClass(status: string) {
  if (status === "DONE") return "bg-emerald-100 text-emerald-700";
  if (status === "IN_PROGRESS") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function priorityBadgeClass(priority: string) {
  const value = priority?.toUpperCase?.() || "";

  if (value === "URGENT" || value === "HIGH") return "bg-rose-100 text-rose-700";
  if (value === "MEDIUM") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
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

function StatusButton({
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
  onEditTask,
  onDeleteTask,
}: Props) {
  const sortedTasks = [...tasks].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  return (
    <div className="hidden lg:block">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-extrabold tracking-tight text-slate-900">
            Task List
          </h2>
          <p className="mt-1 text-[14px] text-slate-500">
            All tasks in this project
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateTask}
          className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[14px] font-extrabold text-white shadow-[0_16px_30px_rgba(37,99,235,0.20)]"
        >
          + Add Task
        </button>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[2fr_0.9fr_0.9fr_1fr_1.4fr] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            Task
          </div>
          <div className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            Status
          </div>
          <div className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            Priority
          </div>
          <div className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            Due Date
          </div>
          <div className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            Actions
          </div>
        </div>

        {sortedTasks.length === 0 ? (
          <div className="px-6 py-14 text-center text-[14px] font-medium text-slate-400">
            No tasks found for this project yet.
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              className="grid grid-cols-[2fr_0.9fr_0.9fr_1fr_1.4fr] gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0"
            >
              <div className="min-w-0">
                <div className="truncate text-[15px] font-bold text-slate-900">
                  {task.title}
                </div>
                <div className="mt-1 line-clamp-2 text-[13px] leading-6 text-slate-500">
                  {task.description || "No description provided for this task."}
                </div>
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

              <div className="flex flex-wrap items-center gap-2">
                <StatusButton task={task} onStatusChanged={onStatusChanged} />
                <button
                  type="button"
                  onClick={() => onEditTask(task)}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-extrabold text-slate-600"
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
        )}
      </div>
    </div>
  );
}