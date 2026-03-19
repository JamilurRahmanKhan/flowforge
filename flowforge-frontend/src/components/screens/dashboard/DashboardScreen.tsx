"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboardSummary } from "@/features/dashboard/api";
import type { DashboardSummary } from "@/features/dashboard/types";

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
        {value}
      </p>
      <div
        className="mt-4 h-1 rounded-full"
        style={{ backgroundColor: accent }}
      />
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString();
}

export default function DashboardScreen() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const result = await getDashboardSummary();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center text-sm font-medium text-slate-600 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        Loading dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
        {error || "Dashboard data not available"}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Workspace Overview
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">
          Dashboard
        </h1>
        <p className="mt-3 max-w-md text-sm sm:text-base leading-relaxed text-slate-600">
          Track projects, personal tasks, workload, and recent activity in one place.
        </p>
      </section>

      <section className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Projects" value={data.totalProjects} accent="#2563eb" />
        <StatCard label="Active Projects" value={data.activeProjects} accent="#22c55e" />
        <StatCard label="My Tasks" value={data.myTasks} accent="#f59e0b" />
        <StatCard label="Overdue Tasks" value={data.overdueTasks} accent="#ef4444" />
        <StatCard label="Assigned Projects" value={data.assignedProjects} accent="#64748b" />
      </section>

      <section className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
            My Task Status
          </h2>

          <div className="mt-6 grid gap-3 sm:gap-4 grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                To Do
              </p>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-950">
                {data.todoTasks}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                In Progress
              </p>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-950">
                {data.inProgressTasks}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Done
              </p>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-950">
                {data.doneTasks}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Link
              href="/projects"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              View Projects
            </Link>
            <Link
              href="/my-tasks"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              View My Tasks
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
            Recent Activity
          </h2>

          <div className="mt-6 space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
            {data.recentActivity.length > 0 ? (
              data.recentActivity.map((item, index) => (
                <div
                  key={`${item.type}-${item.createdAt}-${index}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:px-5 sm:py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-bold text-slate-950">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        {item.projectName || "Workspace"} • {formatDate(item.createdAt)}
                      </p>
                    </div>

                    {item.projectId ? (
                      <Link
                        href={`/projects/${item.projectId}`}
                        className="shrink-0 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                      >
                        Open
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center text-sm font-medium text-slate-500">
                No recent activity yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
