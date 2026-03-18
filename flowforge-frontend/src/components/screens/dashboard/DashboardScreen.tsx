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
    <div className="rounded-[24px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
        {label}
      </p>
      <p className="mt-3 text-[34px] font-extrabold tracking-tight text-[#0f172a]">
        {value}
      </p>
      <div
        className="mt-4 h-1.5 rounded-full"
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
      <div className="rounded-[28px] border border-[#e6ebf3] bg-white px-6 py-14 text-center text-[#64748b] shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        Loading dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
        {error || "Dashboard data not available"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
          Workspace Overview
        </p>
        <h2 className="mt-3 text-[40px] font-extrabold tracking-tight text-[#0f172a]">
          Dashboard
        </h2>
        <p className="mt-4 text-[16px] leading-7 text-[#64748b]">
          Track projects, personal tasks, workload, and recent activity in one place.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-5 md:grid-cols-2">
        <StatCard label="Total Projects" value={data.totalProjects} accent="#2563eb" />
        <StatCard label="Active Projects" value={data.activeProjects} accent="#22c55e" />
        <StatCard label="My Tasks" value={data.myTasks} accent="#f59e0b" />
        <StatCard label="Overdue Tasks" value={data.overdueTasks} accent="#ef4444" />
        <StatCard label="Assigned Projects" value={data.assignedProjects} accent="#64748b" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <h3 className="text-[22px] font-extrabold tracking-tight text-[#0f172a]">
            My Task Status
          </h3>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[20px] border border-[#e6ebf3] bg-[#f8fafc] p-5">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                To Do
              </p>
              <p className="mt-2 text-[28px] font-extrabold text-[#0f172a]">
                {data.todoTasks}
              </p>
            </div>

            <div className="rounded-[20px] border border-[#e6ebf3] bg-[#f8fafc] p-5">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                In Progress
              </p>
              <p className="mt-2 text-[28px] font-extrabold text-[#0f172a]">
                {data.inProgressTasks}
              </p>
            </div>

            <div className="rounded-[20px] border border-[#e6ebf3] bg-[#f8fafc] p-5">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                Done
              </p>
              <p className="mt-2 text-[28px] font-extrabold text-[#0f172a]">
                {data.doneTasks}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[13px] font-extrabold text-white"
            >
              View Projects
            </Link>
            <Link
              href="/my-tasks"
              className="rounded-full border border-[#dbe4f0] px-5 py-2.5 text-[13px] font-extrabold text-[#334155]"
            >
              View My Tasks
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <h3 className="text-[22px] font-extrabold tracking-tight text-[#0f172a]">
            Recent Activity
          </h3>

          <div className="mt-6 space-y-4">
            {data.recentActivity.length > 0 ? (
              data.recentActivity.map((item, index) => (
                <div
                  key={`${item.type}-${item.createdAt}-${index}`}
                  className="rounded-[20px] border border-[#eef2f7] bg-[#f8fafc] px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[15px] font-extrabold text-[#0f172a]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[13px] leading-6 text-[#64748b]">
                        {item.description}
                      </p>
                      <p className="mt-2 text-[11px] font-bold text-[#94a3b8]">
                        {item.projectName || "Workspace"} • {formatDate(item.createdAt)}
                      </p>
                    </div>

                    {item.projectId ? (
                      <Link
                        href={`/projects/${item.projectId}`}
                        className="shrink-0 rounded-full border border-[#dbe4f0] px-3 py-1.5 text-[11px] font-extrabold text-[#334155]"
                      >
                        Open
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[20px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-5 py-8 text-center text-[14px] font-medium text-[#94a3b8]">
                No recent activity yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}