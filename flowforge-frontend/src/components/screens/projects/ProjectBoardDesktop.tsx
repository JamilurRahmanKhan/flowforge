"use client";

import { useState } from "react";
import { updateTaskStatus } from "@/features/tasks/api";
import type { Task } from "@/features/tasks/types";

type Props = {
  tasks: Task[];
  onCreateTask: () => void;
  onStatusChanged: () => Promise<void>;
};

function groupTasks(tasks: Task[]) {
  return {
    TODO: tasks.filter((task) => task.status === "TODO"),
    IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS"),
    DONE: tasks.filter((task) => task.status === "DONE"),
  };
}

function priorityClass(priority: string) {
  const value = priority?.toUpperCase?.() || "";

  if (value === "HIGH" || value === "URGENT") return "bg-rose-100 text-rose-600";
  if (value === "MEDIUM") return "bg-amber-100 text-amber-600";
  return "bg-slate-100 text-slate-600";
}

function statusMeta(status: "TODO" | "IN_PROGRESS" | "DONE") {
  if (status === "TODO") {
    return {
      title: "To Do",
      dot: "bg-slate-400",
      countBg: "bg-slate-100 text-slate-700",
    };
  }
  if (status === "IN_PROGRESS") {
    return {
      title: "In Progress",
      dot: "bg-amber-500",
      countBg: "bg-amber-100 text-amber-700",
    };
  }
  return {
    title: "Done",
    dot: "bg-emerald-500",
    countBg: "bg-emerald-100 text-emerald-700",
  };
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
  if (status === "IN_PROGRESS") return "Mark Done";
  return "Reset";
}

function TaskCard({
  task,
  onStatusChanged,
}: {
  task: Task;
  onStatusChanged: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  async function handleStatusChange() {
    try {
      setLoading(true);
      await updateTaskStatus(task.id, nextStatus(task.status));
      await onStatusChanged();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h4 className="line-clamp-2 text-[15px] font-bold leading-6 text-slate-900">
          {task.title}
        </h4>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${priorityClass(
            task.priority
          )}`}
        >
          {task.priority || "LOW"}
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-[13px] leading-6 text-slate-500">
        {task.description || "No description provided for this task."}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[12px] font-semibold text-slate-400">
          Due: {formatDueDate(task.dueDate)}
        </span>

        <button
          type="button"
          onClick={handleStatusChange}
          disabled={loading}
          className="rounded-full bg-[#2563eb] px-3 py-1.5 text-[11px] font-extrabold text-white disabled:opacity-60"
        >
          {loading ? "Updating..." : actionLabel(task.status)}
        </button>
      </div>
    </div>
  );
}

function Column({
  status,
  tasks,
  onStatusChanged,
}: {
  status: "TODO" | "IN_PROGRESS" | "DONE";
  tasks: Task[];
  onStatusChanged: () => Promise<void>;
}) {
  const meta = statusMeta(status);

  return (
    <div className="flex min-h-[520px] flex-col rounded-[26px] bg-[#f8fafc] p-4">
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <span className={`inline-block h-3 w-3 rounded-full ${meta.dot}`} />
          <h3 className="text-[15px] font-extrabold tracking-tight text-slate-900">
            {meta.title}
          </h3>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${meta.countBg}`}
        >
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onStatusChanged={onStatusChanged} />
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 p-6 text-center text-[13px] font-medium text-slate-400">
            No tasks in {meta.title.toLowerCase()}.
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectBoardDesktop({
  tasks,
  onCreateTask,
  onStatusChanged,
}: Props) {
  const grouped = groupTasks(tasks);

  return (
    <div className="hidden lg:block">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[22px] font-extrabold tracking-tight text-slate-900">
          Project Board
        </h2>

        <button
          type="button"
          onClick={onCreateTask}
          className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[14px] font-extrabold text-white shadow-[0_16px_30px_rgba(37,99,235,0.24)]"
        >
          + Add Task
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Column status="TODO" tasks={grouped.TODO} onStatusChanged={onStatusChanged} />
        <Column
          status="IN_PROGRESS"
          tasks={grouped.IN_PROGRESS}
          onStatusChanged={onStatusChanged}
        />
        <Column status="DONE" tasks={grouped.DONE} onStatusChanged={onStatusChanged} />
      </div>
    </div>
  );
}