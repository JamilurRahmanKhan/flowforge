"use client";

import type { ActivityItem } from "@/features/activity/types";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString();
}

export default function ProjectActivityDesktop({
  activities,
  loading,
}: {
  activities: ActivityItem[];
  loading?: boolean;
}) {
  return (
    <div className="hidden lg:block space-y-6">
      <div>
        <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
          Activity Timeline
        </p>
        <h2 className="mt-2 text-[34px] font-extrabold tracking-tight text-[#0f172a]">
          Activity
        </h2>
      </div>

      <div className="rounded-[28px] border border-[#e6ebf3] bg-white p-6">
        {loading ? (
          <div className="text-sm text-[#64748b]">Loading activity...</div>
        ) : activities.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-5 py-10 text-center text-[14px] font-medium text-[#94a3b8]">
            No activity yet for this project.
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((item, index) => (
              <div
                key={`${item.type}-${item.createdAt}-${index}`}
                className="rounded-[20px] border border-[#eef2f7] bg-[#f8fafc] p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[15px] font-extrabold text-[#0f172a]">
                    {item.title}
                  </p>
                  <p className="text-[12px] font-bold text-[#94a3b8]">
                    {formatDate(item.createdAt)}
                  </p>
                </div>

                <p className="mt-2 text-[14px] leading-6 text-[#64748b]">
                  {item.description}
                </p>

                {item.userName ? (
                  <p className="mt-2 text-[12px] font-bold text-[#334155]">
                    By {item.userName}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}