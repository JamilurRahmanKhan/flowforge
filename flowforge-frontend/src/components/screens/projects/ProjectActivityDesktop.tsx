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

export default function ProjectActivityDesktop({ activities = [] }: Props) {
  return (
    <div className="hidden lg:block">
      <div className="mb-5">
        <h2 className="text-[22px] font-extrabold tracking-tight text-slate-900">
          Activity Timeline
        </h2>
        <p className="mt-1 text-[14px] text-slate-500">
          Recent project and task events.
        </p>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        {activities.length > 0 ? (
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative flex gap-4">
                <div className="relative z-10">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-lg ${bgFor(
                      activity.type
                    )}`}
                  >
                    <span>{iconFor(activity.type)}</span>
                  </div>
                  {index !== activities.length - 1 && (
                    <div className="absolute left-1/2 top-12 h-[calc(100%+12px)] w-px -translate-x-1/2 bg-slate-200" />
                  )}
                </div>

                <div className="min-w-0 flex-1 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[15px] font-extrabold text-slate-900">
                        {activity.title}
                      </h3>
                      <p className="mt-1 text-[14px] leading-6 text-slate-500">
                        {activity.description}
                      </p>
                    </div>

                    <div className="shrink-0 text-[12px] font-semibold text-slate-400">
                      {formatTime(activity.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-[14px] font-medium text-slate-400">
            No activity found for this project yet.
          </div>
        )}
      </div>
    </div>
  );
}