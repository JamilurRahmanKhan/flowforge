"use client";

import Link from "next/link";
import { CheckCircle2, Folder, Home, UserRound } from "lucide-react";
import type { Project } from "@/features/projects/types";

type Props = {
  project: Project;
  onEdit: () => void;
};

function MobileStatCard({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: string;
  colorClass: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}

function MobileTaskRow({
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
        <CheckCircle2 className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{title}</p>
        <p className="text-xs text-slate-500">Assigned to: {assignee}</p>
      </div>

      <span className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-tight ${badgeClass}`}>
        {badge}
      </span>
    </div>
  );
}

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-md -translate-x-1/2 items-center justify-around border-t border-slate-200 bg-white px-4 pb-6 pt-3 lg:hidden">
      <Link href="/dashboard" className="flex flex-col items-center gap-1 text-slate-400">
        <Home className="h-5 w-5" />
        <p className="text-[10px] font-bold uppercase tracking-wider">Home</p>
      </Link>

      <Link href="/projects" className="flex flex-col items-center gap-1 text-[#1f68f9]">
        <Folder className="h-5 w-5" />
        <p className="text-[10px] font-bold uppercase tracking-wider">Projects</p>
      </Link>

      <Link href="/my-tasks" className="flex flex-col items-center gap-1 text-slate-400">
        <CheckCircle2 className="h-5 w-5" />
        <p className="text-[10px] font-bold uppercase tracking-wider">Tasks</p>
      </Link>

      <Link href="/profile" className="flex flex-col items-center gap-1 text-slate-400">
        <UserRound className="h-5 w-5" />
        <p className="text-[10px] font-bold uppercase tracking-wider">Profile</p>
      </Link>
    </nav>
  );
}

export default function ProjectOverviewMobile({ project, onEdit }: Props) {
  return (
    <div className="lg:hidden">
      <main className="pb-24">
        <div className="p-4">
          <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#1f68f9] to-blue-400 text-white shadow-lg shadow-[#1f68f9]/20">
              <span className="text-3xl">🚀</span>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                {project.name}
              </h2>
              <p className="text-sm text-slate-500">Updated 2 hours ago</p>
              <div className="mt-1 flex items-center gap-1">
                <span className="inline-block size-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold capitalize text-emerald-600">
                  {project.status === "ARCHIVED" ? "Archived" : "On Track"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 px-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Description
              </h3>

              <button
                type="button"
                onClick={onEdit}
                className="rounded-full bg-[#1f68f9]/10 px-3 py-1.5 text-xs font-bold text-[#1f68f9]"
              >
                Edit
              </button>
            </div>

            <p className="text-sm leading-relaxed text-slate-600">
              {project.description ||
                "No description added yet for this project."}
            </p>
          </div>
        </div>

        <div className="mb-6 px-4">
          <h3 className="mb-3 px-1 text-sm font-bold uppercase tracking-wider text-slate-400">
            Statistics
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <MobileStatCard label="Open" value="12" colorClass="text-[#1f68f9]" />
            <MobileStatCard label="In Progress" value="08" colorClass="text-amber-500" />
            <MobileStatCard label="In Review" value="05" colorClass="text-purple-500" />
            <MobileStatCard label="Done" value="24" colorClass="text-emerald-500" />
          </div>
        </div>

        <div className="mb-6 px-4">
          <div className="mb-3 flex items-center justify-between px-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Recent Tasks
            </h3>
            <button className="text-xs font-bold text-[#1f68f9]">See All</button>
          </div>

          <div className="space-y-2">
            <MobileTaskRow
              title="Design System Audit"
              assignee="Alex M."
              badge="Active"
              badgeClass="bg-amber-100 text-amber-600"
            />
            <MobileTaskRow
              title="API Authentication Layer"
              assignee="Sarah K."
              badge="Review"
              badgeClass="bg-purple-100 text-purple-600"
            />
          </div>
        </div>

        <div className="mb-6 px-4">
          <h3 className="mb-3 px-1 text-sm font-bold uppercase tracking-wider text-slate-400">
            Recent Activity
          </h3>

          <div className="relative space-y-6 pl-6 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-[2px] before:bg-slate-100">
            <div className="relative">
              <div className="absolute -left-[19px] top-1 size-[10px] rounded-full bg-[#1f68f9] ring-4 ring-white" />
              <p className="text-sm font-medium">
                <span className="font-bold">Jordan L.</span> moved{" "}
                <span className="font-bold text-[#1f68f9]">FF-124</span> to{" "}
                <span className="font-bold text-slate-900">Done</span>
              </p>
              <p className="mt-1 text-xs text-slate-400">15 mins ago</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[19px] top-1 size-[10px] rounded-full bg-slate-300 ring-4 ring-white" />
              <p className="text-sm font-medium">
                <span className="font-bold">System</span> assigned{" "}
                <span className="font-bold">FF-125</span> to{" "}
                <span className="font-bold">Alex M.</span>
              </p>
              <p className="mt-1 text-xs text-slate-400">1 hour ago</p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}