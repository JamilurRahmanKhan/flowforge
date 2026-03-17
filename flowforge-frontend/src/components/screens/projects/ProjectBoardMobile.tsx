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

function labelFor(status: "TODO" | "IN_PROGRESS" | "DONE") {
  if (status === "TODO") return "To Do";
  if (status === "IN_PROGRESS") return "In Progress";
  return "Done";
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

function MobileTaskCard({
  task,
  onStatusChanged,
  onEditTask,
  onDeleteTask,
}: {
  task: Task;
  onStatusChanged: () => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
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
        <h4 className="line-clamp-2 text-[14px] font-bold leading-6 text-slate-900">
          {task.title}
        </h4>

        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide ${priorityClass(
            task.priority
          )}`}
        >
          {task.priority || "LOW"}
        </span>
      </div>

      <p className="mt-2 line-clamp-2 text-[12px] leading-6 text-slate-500">
        {task.description || "No description provided."}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400">
          Due: {formatDueDate(task.dueDate)}
        </span>

        <button
          type="button"
          onClick={handleStatusChange}
          disabled={loading}
          className="rounded-full bg-[#2563eb] px-3 py-1.5 text-[11px] font-extrabold text-white disabled:opacity-60"
        >
          {loading ? "..." : actionLabel(task.status)}
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
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
  );
}

function Section({
  status,
  tasks,
  onStatusChanged,
  onEditTask,
  onDeleteTask,
}: {
  status: "TODO" | "IN_PROGRESS" | "DONE";
  tasks: Task[];
  onStatusChanged: () => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}) {
  const label = labelFor(status);

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-extrabold tracking-tight text-slate-900">
          {label}
        </h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-extrabold text-slate-700">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <MobileTaskCard
              key={task.id}
              task={task}
              onStatusChanged={onStatusChanged}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-center text-[12px] font-medium text-slate-400">
            No tasks in {label.toLowerCase()}.
          </div>
        )}
      </div>
    </section>
  );
}

export default function ProjectBoardMobile({
  tasks,
  onCreateTask,
  onStatusChanged,
  onEditTask,
  onDeleteTask,
}: Props) {
  const grouped = groupTasks(tasks);

  return (
    <div className="lg:hidden">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[20px] font-extrabold tracking-tight text-slate-900">
          Project Board
        </h2>

        <button
          type="button"
          onClick={onCreateTask}
          className="rounded-full bg-[#2563eb] px-4 py-2 text-[12px] font-extrabold text-white shadow-[0_16px_30px_rgba(37,99,235,0.24)]"
        >
          + Add Task
        </button>
      </div>

      <Section
        status="TODO"
        tasks={grouped.TODO}
        onStatusChanged={onStatusChanged}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
      />
      <Section
        status="IN_PROGRESS"
        tasks={grouped.IN_PROGRESS}
        onStatusChanged={onStatusChanged}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
      />
      <Section
        status="DONE"
        tasks={grouped.DONE}
        onStatusChanged={onStatusChanged}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
      />
    </div>
  );
}