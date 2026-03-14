"use client";

import type { Project } from "@/features/projects/types";

type Props = {
  project: Project;
  onEdit: () => void;
};

function StatCard({
  title,
  value,
  subtitle,
  colorClass,
  iconBg,
}: {
  title: string;
  value: string;
  subtitle: string;
  colorClass: string;
  iconBg: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className={`flex size-10 items-center justify-center rounded-lg ${iconBg}`}>
          <span className={`text-lg font-bold ${colorClass}`}>●</span>
        </div>
        <span className="flex items-center gap-1 text-sm font-bold text-emerald-500">
          +5%
        </span>
      </div>

      <h3 className="mb-1 text-sm font-semibold text-slate-500">{title}</h3>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}

function RecentTaskRow({
  title,
  assignee,
  badge,
  badgeClass,
}: {
  title: string;
  assignee: string;
  badge: string;
  badgeClass: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
      <div className="flex size-10 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-400">
        <CheckIcon />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">Assigned to: {assignee}</p>
      </div>

      <span className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-tight ${badgeClass}`}>
        {badge}
      </span>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M16.707 5.293a1 1 0 010 1.414l-7.2 7.2a1 1 0 01-1.414 0l-3.2-3.2a1 1 0 111.414-1.414L8.8 11.786l6.493-6.493a1 1 0 011.414 0z" />
    </svg>
  );
}

export default function ProjectOverviewDesktop({ project, onEdit }: Props) {
  return (
    <div className="hidden lg:block">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 grid grid-cols-4 gap-6">
          <StatCard
            title="Completion"
            value="68%"
            subtitle="Project delivery rate"
            colorClass="text-blue-600"
            iconBg="bg-blue-50"
          />
          <StatCard
            title="Tasks Done"
            value="42/60"
            subtitle="Completed tasks"
            colorClass="text-emerald-600"
            iconBg="bg-emerald-50"
          />
          <StatCard
            title="Team Members"
            value="12"
            subtitle="Assigned members"
            colorClass="text-indigo-600"
            iconBg="bg-indigo-50"
          />
          <StatCard
            title="Timeline"
            value="18d"
            subtitle="Estimated remaining"
            colorClass="text-rose-600"
            iconBg="bg-rose-50"
          />
        </div>

        <div className="col-span-8 space-y-6">
          <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Description
                </h3>
                <p className="mt-2 text-[15px] leading-7 text-slate-600">
                  {project.description ||
                    "No description added yet for this project."}
                </p>
              </div>

              <button
                type="button"
                onClick={onEdit}
                className="rounded-full bg-[#1f68f9]/10 px-4 py-2 text-sm font-bold text-[#1f68f9]"
              >
                Edit
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Recent Tasks</h3>
              <button className="rounded-full bg-[#1f68f9] px-4 py-2 text-sm font-bold text-white">
                + New Task
              </button>
            </div>

            <div className="space-y-3">
              <RecentTaskRow
                title="Design System Audit"
                assignee="Alex M."
                badge="Active"
                badgeClass="bg-amber-100 text-amber-600"
              />
              <RecentTaskRow
                title="API Authentication Layer"
                assignee="Sarah K."
                badge="Review"
                badgeClass="bg-purple-100 text-purple-600"
              />
              <RecentTaskRow
                title="Dashboard Layout Polish"
                assignee="Jordan L."
                badge="Done"
                badgeClass="bg-emerald-100 text-emerald-600"
              />
            </div>
          </section>
        </div>

        <div className="col-span-4 space-y-6">
          <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
              Project Info
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Project Name
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {project.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Project Key
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {project.key}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Visibility
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {project.visibility || "PUBLIC"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Workflow
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {project.defaultWorkflow || "Standard Agile (Kanban)"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Status
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {project.status}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
              Recent Activity
            </h3>

            <div className="relative space-y-6 pl-6 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-[2px] before:bg-slate-100">
              <div className="relative">
                <div className="absolute -left-[19px] top-1 size-[10px] rounded-full bg-[#1f68f9] ring-4 ring-white" />
                <p className="text-sm font-medium text-slate-700">
                  <span className="font-bold">Jordan L.</span> moved{" "}
                  <span className="font-bold text-[#1f68f9]">FF-124</span> to{" "}
                  <span className="font-bold text-slate-900">Done</span>
                </p>
                <p className="mt-1 text-xs text-slate-400">15 mins ago</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[19px] top-1 size-[10px] rounded-full bg-slate-300 ring-4 ring-white" />
                <p className="text-sm font-medium text-slate-700">
                  <span className="font-bold">System</span> assigned{" "}
                  <span className="font-bold">FF-125</span> to{" "}
                  <span className="font-bold">Alex M.</span>
                </p>
                <p className="mt-1 text-xs text-slate-400">1 hour ago</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[19px] top-1 size-[10px] rounded-full bg-slate-300 ring-4 ring-white" />
                <p className="text-sm font-medium text-slate-700">
                  <span className="font-bold">Sarah K.</span> updated project
                  workflow settings
                </p>
                <p className="mt-1 text-xs text-slate-400">Yesterday</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}