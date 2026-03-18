"use client";

import { useEffect, useMemo, useState } from "react";
import { deleteTask, getMyTasks, updateTaskStatus } from "@/features/tasks/api";
import type { Task } from "@/features/tasks/types";
import TaskCommentsPanel from "./TaskCommentsPanel";

function badgeClass(status: string) {
  if (status === "DONE") return "bg-emerald-100 text-emerald-700";
  if (status === "IN_PROGRESS") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
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

function formatDueDate(value?: string | null) {
  if (!value) return "No due date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No due date";
  return date.toLocaleDateString();
}

export default function MyTasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "TODO" | "IN_PROGRESS" | "DONE">("ALL");

  async function loadTasks() {
    try {
      setLoading(true);
      setError("");
      const data = await getMyTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    if (filter === "ALL") return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [tasks, filter]);

  async function handleStatusChange(task: Task) {
    try {
      const updated = await updateTaskStatus(task.id, nextStatus(task.status));
      setTasks((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task status");
    }
  }

  async function handleDelete(taskId: string) {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      if (activeTaskId === taskId) {
        setActiveTaskId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
              Personal Task Flow
            </p>
            <h2 className="mt-3 text-[40px] font-extrabold tracking-tight text-[#0f172a]">
              My Tasks
            </h2>
            <p className="mt-4 text-[16px] leading-7 text-[#64748b]">
              Review your assigned tasks, update their status, and collaborate with comments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["ALL", "TODO", "IN_PROGRESS", "DONE"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setFilter(value as "ALL" | "TODO" | "IN_PROGRESS" | "DONE")
                }
                className={`rounded-full px-4 py-2 text-[12px] font-extrabold ${
                  filter === value
                    ? "bg-[#2563eb] text-white"
                    : "border border-[#dbe4f0] text-[#334155]"
                }`}
              >
                {value === "IN_PROGRESS" ? "IN PROGRESS" : value}
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="rounded-[24px] border border-[#e6ebf3] bg-white px-6 py-10 text-center text-[#64748b] shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          Loading tasks...
        </div>
      ) : error ? (
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[28px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <h3 className="text-[24px] font-extrabold tracking-tight text-[#0f172a]">
              Assigned Tasks
            </h3>

            <div className="mt-6 space-y-4">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`rounded-[22px] border p-5 transition ${
                      activeTaskId === task.id
                        ? "border-[#2563eb] bg-[#f8fbff]"
                        : "border-[#eef2f7] bg-[#f8fafc]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveTaskId((prev) => (prev === task.id ? null : task.id))
                          }
                          className="truncate text-left text-[16px] font-extrabold text-[#0f172a]"
                        >
                          {task.title}
                        </button>
                        <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-[#64748b]">
                          {task.description || "No description provided."}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${badgeClass(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-[12px] font-bold text-[#64748b]">
                        Due: {formatDueDate(task.dueDate)}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(task)}
                          className="rounded-full bg-[#2563eb] px-3 py-1.5 text-[11px] font-extrabold text-white"
                        >
                          {actionLabel(task.status)}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(task.id)}
                          className="rounded-full border border-rose-200 px-3 py-1.5 text-[11px] font-extrabold text-rose-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[20px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-5 py-10 text-center text-[14px] font-medium text-[#94a3b8]">
                  No tasks found for this filter.
                </div>
              )}
            </div>
          </section>

          <section>
            {activeTaskId ? (
              <TaskCommentsPanel taskId={activeTaskId} />
            ) : (
              <div className="rounded-[24px] border border-dashed border-[#dbe4f0] bg-white px-5 py-10 text-center text-[14px] font-medium text-[#94a3b8]">
                Select a task to view and add comments.
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}