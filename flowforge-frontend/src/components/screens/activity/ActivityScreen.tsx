"use client";

import { useEffect, useState } from "react";
import { getWorkspaceActivity } from "@/features/activity/api";
import type { ActivityItem } from "@/features/activity/types";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString();
}

function activityBadge(type: string) {
  if (type === "COMMENT_ADDED") return "bg-violet-100 text-violet-700";
  if (type === "TASK_CREATED") return "bg-blue-100 text-blue-700";
  if (type === "MEMBER_ASSIGNED") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

export default function ActivityScreen() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getWorkspaceActivity(40);
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load activity");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
          Workspace Timeline
        </p>
        <h2 className="mt-3 text-[40px] font-extrabold tracking-tight text-[#0f172a]">
          Activity
        </h2>
        <p className="mt-4 text-[16px] leading-7 text-[#64748b]">
          Follow projects, tasks, comments, and member assignment events across your workspace.
        </p>
      </section>

      <section className="rounded-[28px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        {loading ? (
          <div className="rounded-[20px] border border-[#e6ebf3] bg-[#f8fafc] px-5 py-10 text-center text-sm font-medium text-[#64748b]">
            Loading activity...
          </div>
        ) : error ? (
          <div className="rounded-[20px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-5 py-10 text-center text-sm font-medium text-[#94a3b8]">
            No activity found yet.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.type}-${item.createdAt}-${index}`}
                className="rounded-[22px] border border-[#eef2f7] bg-[#f8fafc] p-5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${activityBadge(item.type)}`}
                  >
                    {item.title}
                  </span>
                  <span className="text-[12px] font-bold text-[#94a3b8]">
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                <p className="mt-3 text-[15px] font-bold text-[#0f172a]">
                  {item.description}
                </p>

                <div className="mt-2 text-[13px] text-[#64748b]">
                  {item.userName ? <span>User: {item.userName}</span> : null}
                  {item.projectName ? <span className="ml-4">Project: {item.projectName}</span> : null}
                  {item.taskTitle ? <span className="ml-4">Task: {item.taskTitle}</span> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}