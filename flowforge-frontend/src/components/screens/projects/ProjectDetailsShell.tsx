"use client";

import type { Project } from "@/features/projects/types";

type TabKey = "overview" | "board" | "list" | "members" | "activity";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "board", label: "Board" },
  { key: "list", label: "List" },
  { key: "members", label: "Members" },
  { key: "activity", label: "Activity" },
];

export default function ProjectDetailsShell({
  project,
  activeTab,
  onTabChange,
  onArchive,
  onDelete,
  children,
}: {
  project: Project;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onArchive: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-[#e6ebf3] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <div className="border-b border-[#e9eef5] px-6 py-5 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => history.back()}
                className="rounded-full border border-[#dbe4f0] px-3 py-2 text-[13px] font-bold text-[#475569]"
              >
                ← Back
              </button>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="truncate text-[30px] font-extrabold tracking-tight text-[#0f172a]">
                    {project.name}
                  </h1>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[0.14em] ${
                      project.status === "ARCHIVED"
                        ? "bg-slate-100 text-slate-600"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="mt-1 text-[14px] font-medium text-[#64748b]">
                  {project.key}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onArchive}
                className="rounded-full border border-[#dbe4f0] px-4 py-2.5 text-[13px] font-extrabold text-[#334155]"
              >
                {project.status === "ARCHIVED" ? "Restore" : "Archive"}
              </button>

              <button
                type="button"
                onClick={onDelete}
                className="rounded-full border border-rose-200 px-4 py-2.5 text-[13px] font-extrabold text-rose-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-[#e9eef5] px-4 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => {
              const active = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onTabChange(tab.key)}
                  className={`relative px-4 py-4 text-[16px] font-bold transition ${
                    active ? "text-[#2563eb]" : "text-[#64748b] hover:text-[#334155]"
                  }`}
                >
                  {tab.label}
                  {active ? (
                    <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#2563eb]" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 py-6 lg:px-8 lg:py-8">{children}</div>
      </section>
    </div>
  );
}