"use client";

import type { ActivityItem } from "@/features/activity/types";

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString();
}

function getBadgeClass(type: string) {
  if (type === "TASK_CREATED") return "bg-blue-100 text-blue-700";
  if (type === "TASK_STATUS_CHANGED") return "bg-amber-100 text-amber-700";
  if (type === "TASK_UPDATED") return "bg-purple-100 text-purple-700";
  if (type === "TASK_DELETED") return "bg-rose-100 text-rose-700";
  if (type === "COMMENT_ADDED") return "bg-emerald-100 text-emerald-700";
  if (type === "PROJECT_UPDATED") return "bg-indigo-100 text-indigo-700";
  if (type === "PROJECT_ARCHIVED") return "bg-slate-200 text-slate-700";
  if (type === "PROJECT_RESTORED") return "bg-cyan-100 text-cyan-700";
  if (type === "MEMBER_ASSIGNED") return "bg-teal-100 text-teal-700";
  if (type === "MEMBER_REMOVED") return "bg-orange-100 text-orange-700";
  return "bg-slate-100 text-slate-700";
}

function getLabel(type: string) {
  switch (type) {
    case "TASK_CREATED":
      return "Task Created";
    case "TASK_STATUS_CHANGED":
      return "Status Changed";
    case "TASK_UPDATED":
      return "Task Updated";
    case "TASK_DELETED":
      return "Task Deleted";
    case "COMMENT_ADDED":
      return "Comment Added";
    case "PROJECT_UPDATED":
      return "Project Updated";
    case "PROJECT_ARCHIVED":
      return "Project Archived";
    case "PROJECT_RESTORED":
      return "Project Restored";
    case "MEMBER_ASSIGNED":
      return "Member Assigned";
    case "MEMBER_REMOVED":
      return "Member Removed";
    default:
      return "Activity";
  }
}

export default function ProjectActivityMobile({
  activities,
  loading = false,
}: {
  activities: ActivityItem[];
  loading?: boolean;
}) {
  return (
    <div className="space-y-5 lg:hidden">
      <div>
        <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
          Timeline View
        </p>
        <h2 className="mt-2 text-[28px] font-extrabold tracking-tight text-[#0f172a]">
          Activity
        </h2>
      </div>

      {loading ? (
        <div className="rounded-[24px] border border-[#e6ebf3] bg-white px-5 py-10 text-center text-[14px] font-medium text-[#64748b]">
          Loading activity...
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="rounded-[24px] border border-[#e6ebf3] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-[15px] font-extrabold text-[#0f172a]">
                    {activity.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-6 text-[#64748b]">
                    {activity.description}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${getBadgeClass(
                    activity.type
                  )}`}
                >
                  {getLabel(activity.type)}
                </span>
              </div>

              <div className="mt-4 space-y-1 text-[12px]">
                <p className="font-bold text-[#334155]">
                  {activity.actorName || "Unknown user"}
                </p>
                <p className="text-[#94a3b8]">
                  {formatDateTime(activity.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-[#dbe4f0] bg-white px-5 py-10 text-center text-[14px] font-medium text-[#94a3b8]">
          No activity found for this project yet.
        </div>
      )}
    </div>
  );
}