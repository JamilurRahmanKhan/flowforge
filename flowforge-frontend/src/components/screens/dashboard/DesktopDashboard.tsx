"use client";

import type { ReactNode } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Folder,
  LayoutGrid,
  UserPlus,
  UserRound,
  Zap,
} from "lucide-react";

function DesktopStatCard({
  icon,
  title,
  value,
  badge,
  iconBg,
  badgeBg,
  badgeText,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  badge: string;
  iconBg: string;
  badgeBg: string;
  badgeText: string;
}) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
        <span
          className="rounded-full px-3 py-1 text-[11px] font-bold"
          style={{ backgroundColor: badgeBg, color: badgeText }}
        >
          {badge}
        </span>
      </div>

      <div className="mt-10">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
          {title}
        </p>
        <p className="mt-1 text-[30px] font-extrabold tracking-tight text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function DesktopTaskRow({
  title,
  tag,
  tagColor,
  project,
  checked = false,
  timeText,
  timeColor = "text-slate-400",
}: {
  title: string;
  tag: string;
  tagColor: string;
  project: string;
  checked?: boolean;
  timeText: string;
  timeColor?: string;
}) {
  return (
    <div className="flex items-center gap-4 border-t border-slate-100 px-6 py-5">
      <button
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
          checked
            ? "border-[#2f66f6] bg-[#2f66f6] text-white"
            : "border-slate-300 bg-white text-transparent"
        }`}
      >
        <CheckCircle2 className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-[16px] font-bold ${
            checked ? "text-slate-400 line-through" : "text-slate-900"
          }`}
        >
          {title}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide"
            style={{ backgroundColor: tagColor }}
          >
            {tag}
          </span>
          <span className="text-[12px] font-medium text-slate-400">{project}</span>
        </div>
      </div>

      <div className={`text-[12px] font-bold ${timeColor}`}>{timeText}</div>
    </div>
  );
}

export default function DesktopDashboard() {
  return (
    <div className="space-y-8">
      <section className="grid grid-cols-2 gap-5 2xl:grid-cols-4">
        <DesktopStatCard
          icon={<LayoutGrid className="h-5 w-5 text-[#2f66f6]" />}
          title="Open Tasks"
          value="24"
          badge="+12%"
          iconBg="#eef4ff"
          badgeBg="#edf2ff"
          badgeText="#2f66f6"
        />
        <DesktopStatCard
          icon={<CalendarDays className="h-5 w-5 text-[#f97316]" />}
          title="Due Soon"
          value="5"
          badge="High"
          iconBg="#fff4eb"
          badgeBg="#fff1e8"
          badgeText="#f97316"
        />
        <DesktopStatCard
          icon={<Folder className="h-5 w-5 text-[#a855f7]" />}
          title="Projects"
          value="12"
          badge="Active"
          iconBg="#f7efff"
          badgeBg="#f5eaff"
          badgeText="#a855f7"
        />
        <DesktopStatCard
          icon={<Zap className="h-5 w-5 text-[#22c55e]" />}
          title="Activity"
          value="88%"
          badge="Peak"
          iconBg="#eefbf2"
          badgeBg="#eaf9ee"
          badgeText="#22c55e"
        />
      </section>

      <section>
        <h3 className="mb-4 text-[16px] font-extrabold uppercase tracking-[0.18em] text-[#8ca0c0]">
          Getting Started
        </h3>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="rounded-[28px] bg-[#2f66f6] p-6 text-white shadow-[0_10px_30px_rgba(47,102,246,0.25)]">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold">
                Completed
              </span>
            </div>
            <h4 className="mt-12 text-[24px] font-extrabold leading-tight">
              Create your first project
            </h4>
            <p className="mt-4 max-w-sm text-[16px] font-medium text-white/85">
              Kick off a workspace-ready project with tasks, members, and milestones.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                <UserPlus className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">
                Step 2
              </span>
            </div>
            <h4 className="mt-12 text-[24px] font-extrabold leading-tight text-slate-900">
              Invite your team members
            </h4>
            <p className="mt-4 text-[16px] font-medium text-slate-500">
              Plan your backlog, assign priorities, and keep your team aligned.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                <UserRound className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">
                Step 3
              </span>
            </div>
            <h4 className="mt-12 text-[24px] font-extrabold leading-tight text-slate-900">
              Set up your profile
            </h4>
            <p className="mt-4 text-[16px] font-medium text-slate-500">
              Review progress at a glance and spot blockers before they grow.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between px-6 pb-4 pt-6">
          <div>
            <h3 className="text-[28px] font-extrabold tracking-tight text-slate-900">
              Today&apos;s Tasks
            </h3>
            <p className="mt-1 text-[13px] font-medium text-[#8ca0c0]">
              3 tasks due today
            </p>
          </div>

          <button className="rounded-full bg-[#eef4ff] px-4 py-2 text-[13px] font-extrabold text-[#2f66f6]">
            View All
          </button>
        </div>

        <DesktopTaskRow
          title="Finalize onboarding checklist"
          tag="URGENT"
          tagColor="#ffe7e7"
          project="Workspace Setup"
          timeText="Today"
          timeColor="text-rose-500"
        />

        <DesktopTaskRow
          title="Review project roadmap"
          tag="REVIEW"
          tagColor="#e8efff"
          project="Platform Growth"
          timeText="2 PM"
          timeColor="text-slate-400"
        />

        <DesktopTaskRow
          title="Prepare sprint summary"
          tag="DONE"
          tagColor="#dff3e7"
          project="Operations"
          checked
          timeText="Completed"
          timeColor="text-[#22c55e]"
        />
      </section>
    </div>
  );
}