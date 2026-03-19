"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  ListTodo,
  Trash2,
  ArrowRight,
  Search,
  CalendarDays,
  MessageSquare,
} from "lucide-react";
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

function isOverdue(task: Task) {
  if (!task.dueDate || task.status === "DONE") return false;
  const due = new Date(task.dueDate);
  if (Number.isNaN(due.getTime())) return false;

  const now = new Date();
  due.setHours(23, 59, 59, 999);
  return due.getTime() < now.getTime();
}

function priorityTone(priority?: string | null) {
  if (priority === "URGENT") return "bg-rose-100 text-rose-700";
  if (priority === "HIGH") return "bg-orange-100 text-orange-700";
  if (priority === "MEDIUM") return "bg-blue-100 text-blue-700";
  return "bg-slate-100 text-slate-700";
}

function priorityLabel(priority?: string | null) {
  return priority || "LOW";
}

export default function MyTasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "TODO" | "IN_PROGRESS" | "DONE">("ALL");
  const [search, setSearch] = useState("");

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
    const normalized = search.trim().toLowerCase();

    return tasks
      .filter((task) => {
        const matchesFilter = filter === "ALL" ? true : task.status === filter;
        const matchesSearch =
          !normalized ||
          task.title.toLowerCase().includes(normalized) ||
          (task.description || "").toLowerCase().includes(normalized);

        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
  }, [tasks, filter, search]);

  const todoCount = tasks.filter((task) => task.status === "TODO").length;
  const inProgressCount = tasks.filter((task) => task.status === "IN_PROGRESS").length;
  const doneCount = tasks.filter((task) => task.status === "DONE").length;
  const overdueCount = tasks.filter((task) => isOverdue(task)).length;

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
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-8 lg:gap-12 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex-1">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
              Personal Task Flow
            </p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950">
              My Tasks
            </h1>
            <p className="mt-3 max-w-md text-sm sm:text-base leading-relaxed text-slate-600">
              Review your assigned tasks, move work forward, and keep discussions
              connected through comments.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 sm:px-5 sm:py-6">
              <div className="flex items-center gap-2 text-slate-500">
                <ListTodo className="h-4 w-4 flex-shrink-0" />
                <p className="text-xs font-bold uppercase tracking-wide">To Do</p>
              </div>
              <p className="mt-3 text-3xl sm:text-4xl font-bold text-slate-950">{todoCount}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 sm:px-5 sm:py-6">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock3 className="h-4 w-4 flex-shrink-0" />
                <p className="text-xs font-bold uppercase tracking-wide">Progress</p>
              </div>
              <p className="mt-3 text-3xl sm:text-4xl font-bold text-slate-950">
                {inProgressCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 sm:px-5 sm:py-6">
              <div className="flex items-center gap-2 text-slate-500">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <p className="text-xs font-bold uppercase tracking-wide">Done</p>
              </div>
              <p className="mt-3 text-3xl sm:text-4xl font-bold text-slate-950">{doneCount}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 sm:px-5 sm:py-6">
              <div className="flex items-center gap-2 text-slate-500">
                <CalendarDays className="h-4 w-4 flex-shrink-0" />
                <p className="text-xs font-bold uppercase tracking-wide">Overdue</p>
              </div>
              <p className="mt-3 text-3xl sm:text-4xl font-bold text-slate-950">{overdueCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["ALL", "TODO", "IN_PROGRESS", "DONE"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setFilter(value as "ALL" | "TODO" | "IN_PROGRESS" | "DONE")
                }
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  filter === value
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                {value === "IN_PROGRESS" ? "IN PROGRESS" : value}
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-500 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-slate-300 border-t-blue-600 animate-spin mb-3" />
          <p className="text-sm font-medium">Loading tasks...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h3 className="text-2xl font-bold text-slate-950">Assigned Tasks</h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {filteredTasks.length} item{filteredTasks.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-4">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const overdue = isOverdue(task);
                  const selected = activeTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      className={`rounded-xl border p-5 transition cursor-pointer ${
                        selected
                          ? "border-blue-300 bg-blue-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex flex-col gap-4 sm:gap-5">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveTaskId((prev) => (prev === task.id ? null : task.id))
                          }
                          className="w-full text-left"
                        >
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h4 className="text-lg font-bold text-slate-950">
                              {task.title}
                            </h4>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${badgeClass(
                                task.status
                              )}`}
                            >
                              {task.status.replace("_", " ")}
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${priorityTone(
                                task.priority
                              )}`}
                            >
                              {priorityLabel(task.priority)}
                            </span>

                            {overdue ? (
                              <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold uppercase text-rose-700">
                                Overdue
                              </span>
                            ) : null}
                          </div>

                          <p className="line-clamp-2 text-sm text-slate-600">
                            {task.description || "No description provided."}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                            <div className="inline-flex items-center gap-1.5">
                              <CalendarDays className="h-3.5 w-3.5" />
                              <span>Due: {formatDueDate(task.dueDate)}</span>
                            </div>

                            <div className="inline-flex items-center gap-1.5">
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span>Comments</span>
                            </div>
                          </div>
                        </button>

                        <div className="flex flex-wrap items-center gap-2 sm:justify-end pt-2 border-t border-slate-100">
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
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm font-medium text-slate-500">
                  No tasks found for the current filters.
                </div>
              )}
            </div>
          </section>

          <section className="xl:sticky xl:top-6 xl:h-fit">
            {activeTaskId ? (
              <TaskCommentsPanel taskId={activeTaskId} />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                <MessageSquare className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-500">
                  Select a task to view and add comments.
                </p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
