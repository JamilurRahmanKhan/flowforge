"use client";

import type { ActivityItem } from "@/features/activity/types";

type Props = {
  activities?: ActivityItem[];
};

function iconFor(type: ActivityItem["type"]) {
  if (type === "PROJECT_CREATED") return "🚀";
  if (type === "PROJECT_UPDATED") return "🛠️";
  if (type === "PROJECT_ARCHIVED") return "📦";
  if (type === "PROJECT_ACTIVE") return "✅";
  return "📝";
}

function bgFor(type: ActivityItem["type"]) {
  if (type === "PROJECT_CREATED") return "bg-blue-50 text-blue-600";
  if (type === "PROJECT_UPDATED") return "bg-amber-50 text-amber-600";
  if (type === "PROJECT_ARCHIVED") return "bg-slate-100 text-slate-600";
  if (type === "PROJECT_ACTIVE") return "bg-emerald-50 text-emerald-600";
  return "bg-violet-50 text-violet-600";
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString();
}

export default function ProjectActivityMobile({ activities = [] }: Props) {
  return (
    <div className="lg:hidden">
      <div className="mb-5">
        <h2 className="text-[20px] font-extrabold tracking-tight text-slate-900">
          Activity Timeline
        </h2>
        <p className="mt-1 text-[13px] text-slate-500">
          Recent project and task events
        </p>
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg ${bgFor(
                    activity.type
                  )}`}
                >
                  <span>{iconFor(activity.type)}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[15px] font-extrabold text-slate-900">
                      {activity.title}
                    </h3>
                    <p className="text-[13px] leading-6 text-slate-500">
                      {activity.description}
                    </p>
                    <p className="pt-1 text-[11px] font-semibold text-slate-400">
                      {formatTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-[13px] font-medium text-slate-400">
            No activity found for this project yet.
          </div>
        )}
      </div>
    </div>
  );
}