"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  ListTodo,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { getCurrentUser, updateProfile } from "@/features/profile/api";
import type { CurrentUser } from "@/features/profile/types";
import { getMyTasks } from "@/features/tasks/api";
import type { Task } from "@/features/tasks/types";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString();
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
  due.setHours(23, 59, 59, 999);
  return due.getTime() < Date.now();
}

function badgeClass(status: string) {
  if (status === "DONE") return "bg-emerald-100 text-emerald-700";
  if (status === "IN_PROGRESS") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function priorityClass(priority?: string | null) {
  if (priority === "URGENT") return "bg-rose-100 text-rose-700";
  if (priority === "HIGH") return "bg-orange-100 text-orange-700";
  if (priority === "MEDIUM") return "bg-blue-100 text-blue-700";
  return "bg-slate-100 text-slate-700";
}

function initials(name: string) {
  return name
    .trim()
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-5">
      <div className="flex items-center gap-2">
        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tone}`}>
          {icon}
        </div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
          {label}
        </p>
      </div>
      <p className="mt-4 text-[32px] font-extrabold tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}

export default function ProfileScreen() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [userData, taskData] = await Promise.all([
          getCurrentUser(),
          getMyTasks(),
        ]);

        setUser(userData);
        setName(userData.name);
        setTasks(taskData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleSave() {
    if (!name.trim()) {
      setError("Name is required");
      setSuccess("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await updateProfile({ name: name.trim() });
      setUser(updated);
      setName(updated.name);
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      setSuccess("");
    } finally {
      setSaving(false);
    }
  }

  const taskSummary = useMemo(() => {
    const todo = tasks.filter((task) => task.status === "TODO").length;
    const inProgress = tasks.filter((task) => task.status === "IN_PROGRESS").length;
    const done = tasks.filter((task) => task.status === "DONE").length;
    const overdue = tasks.filter((task) => isOverdue(task)).length;

    return {
      total: tasks.length,
      todo,
      inProgress,
      done,
      overdue,
    };
  }, [tasks]);

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 5);
  }, [tasks]);

  if (loading) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center text-slate-600 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        Loading profile...
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
        {error}
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="bg-gradient-to-r from-[#0f172a] via-[#1e3a8a] to-[#2563eb] px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-white/15 text-[28px] font-extrabold text-white backdrop-blur">
                {initials(user.name || "User")}
              </div>

              <div>
                <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-blue-100/80">
                  Personal Workspace
                </p>
                <h1 className="mt-2 text-[34px] font-extrabold tracking-tight text-white sm:text-[42px]">
                  {user.name}
                </h1>
                <p className="mt-2 text-[15px] text-blue-100">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/15 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur">
                {user.role}
              </span>
              <span className="rounded-full bg-emerald-400/20 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.14em] text-emerald-50 backdrop-blur">
                {user.active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<ListTodo className="h-4 w-4 text-slate-700" />}
              label="Assigned Tasks"
              value={String(taskSummary.total)}
              tone="bg-slate-200"
            />
            <StatCard
              icon={<Clock3 className="h-4 w-4 text-amber-700" />}
              label="In Progress"
              value={String(taskSummary.inProgress)}
              tone="bg-amber-100"
            />
            <StatCard
              icon={<CheckCircle2 className="h-4 w-4 text-emerald-700" />}
              label="Completed"
              value={String(taskSummary.done)}
              tone="bg-emerald-100"
            />
            <StatCard
              icon={<CalendarDays className="h-4 w-4 text-rose-700" />}
              label="Overdue"
              value={String(taskSummary.overdue)}
              tone="bg-rose-100"
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3">
            <UserCircle2 className="h-6 w-6 text-slate-700" />
            <h2 className="text-[24px] font-extrabold tracking-tight text-slate-950">
              Personal Information
            </h2>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Email Address
              </label>
              <input
                value={user.email}
                readOnly
                className="w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
              />
            </div>

            {success ? (
              <div className="rounded-[16px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {success}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-[16px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-[#2563eb] px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(37,99,235,0.22)] disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-slate-700" />
            <h2 className="text-[24px] font-extrabold tracking-tight text-slate-950">
              Account Summary
            </h2>
          </div>

          <div className="mt-6 space-y-5">
            <div className="rounded-[18px] bg-slate-50 p-4">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                Workspace Role
              </p>
              <p className="mt-2 text-[16px] font-bold text-slate-950">{user.role}</p>
            </div>

            <div className="rounded-[18px] bg-slate-50 p-4">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                Status
              </p>
              <p className="mt-2 text-[16px] font-bold text-slate-950">
                {user.active ? "ACTIVE" : "INACTIVE"}
              </p>
            </div>

            <div className="rounded-[18px] bg-slate-50 p-4">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                Joined
              </p>
              <p className="mt-2 text-[16px] font-bold text-slate-950">
                {formatDate(user.createdAt)}
              </p>
            </div>

            <div className="rounded-[18px] bg-slate-50 p-4">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                Workspace ID
              </p>
              <p className="mt-2 break-all text-[13px] font-bold text-slate-950">
                {user.tenantId}
              </p>
            </div>

            <Link
              href="/my-tasks"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-800 transition hover:bg-slate-50"
            >
              Open My Tasks
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
              Assigned Work
            </p>
            <h2 className="mt-2 text-[24px] font-extrabold tracking-tight text-slate-950">
              Recent Assigned Tasks
            </h2>
          </div>

          <Link
            href="/my-tasks"
            className="inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(37,99,235,0.22)]"
          >
            View all tasks
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {recentTasks.length > 0 ? (
            recentTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-[16px] font-extrabold text-slate-950">
                      {task.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[14px] leading-6 text-slate-600">
                      {task.description || "No description provided."}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] font-bold text-slate-500">
                      <span>Due: {formatDueDate(task.dueDate)}</span>
                      {isOverdue(task) ? (
                        <>
                          <span>•</span>
                          <span className="text-rose-600">Overdue</span>
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] ${badgeClass(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] ${priorityClass(
                        task.priority
                      )}`}
                    >
                      {task.priority || "LOW"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <BriefcaseBusiness className="h-6 w-6 text-slate-500" />
              </div>
              <h3 className="mt-4 text-[18px] font-extrabold text-slate-950">
                No assigned tasks yet
              </h3>
              <p className="mt-2 text-[14px] text-slate-600">
                Once tasks are assigned to you inside a workspace project, they will appear here.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}