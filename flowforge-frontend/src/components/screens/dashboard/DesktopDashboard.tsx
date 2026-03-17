"use client";

import {
  CalendarDays,
  CheckCircle2,
  Folder,
  LayoutGrid,
  Plus,
  Search,
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
  icon: React.ReactNode;
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
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: iconBg }}>
          {icon}
        </div>
        <span className="rounded-full px-3 py-1 text-[11px] font-bold" style={{ backgroundColor: badgeBg, color: badgeText }}>
          {badge}
        </span>
      </div>

      <div className="mt-10">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-slate-400">{title}</p>
        <p className="mt-1 text-[30px] font-extrabold tracking-tight text-slate-900">{value}</p>
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
          checked ? "border-[#2f66f6] bg-[#2f66f6] text-white" : "border-slate-300 bg-white text-transparent"
        }`}
      >
        <CheckCircle2 className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <p className={`truncate text-[16px] font-bold ${checked ? "text-slate-400 line-through" : "text-slate-900"}`}>
          {title}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide" style={{ backgroundColor: tagColor }}>
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
    <div>
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

      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h3 className="mb-4 text-[16px] font-extrabold uppercase tracking-[0.18em] text-[#8ca0c0]">Getting Started</h3>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="rounded-[28px] bg-[#2f66f6] p-6 text-white shadow-[0_10px_30px_rgba(47,102,246,0.25)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="mt-10 text-[20px] font-extrabold">Create your first project</h4>
              <p className="mt-3 text-[14px] text-white/80">Kick off a workspace-ready project with tasks, members, and milestones.</p>
            </div>
            <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff4eb] text-[#f97316]">
                <Plus className="h-5 w-5" />
              </div>
              <h4 className="mt-10 text-[20px] font-extrabold text-slate-900">Plan your backlog</h4>
              <p className="mt-3 text-[14px] text-slate-500">Organize tasks, assign priorities, and keep your team aligned.</p>
            </div>
            <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eefbf2] text-[#22c55e]">
                <Search className="h-5 w-5" />
              </div>
              <h4 className="mt-10 text-[20px] font-extrabold text-slate-900">Track delivery</h4>
              <p className="mt-3 text-[14px] text-slate-500">Review progress at a glance and spot blockers before they grow.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="px-6 py-5">
            <h3 className="text-[16px] font-extrabold uppercase tracking-[0.18em] text-[#8ca0c0]">Today’s Tasks</h3>
          </div>
          <DesktopTaskRow title="Finalize onboarding checklist" tag="Urgent" tagColor="#fee2e2" project="Workspace Setup" timeText="Today" timeColor="text-rose-500" />
          <DesktopTaskRow title="Review project roadmap" tag="Review" tagColor="#dbeafe" project="Platform Growth" timeText="2 PM" />
          <DesktopTaskRow title="Prepare sprint summary" tag="Done" tagColor="#dcfce7" project="Operations" checked timeText="Completed" timeColor="text-emerald-500" />
        </div>
      </section>
    </div>
  );
}