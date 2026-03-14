"use client";
import Link from "next/link";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Folder,
  LayoutGrid,
  Plus,
  Search,
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
    <div className="min-h-screen bg-[#f4f7fb]">
      <div className="grid min-h-screen grid-cols-[280px_1fr]">
        <aside className="border-r border-slate-200 bg-white px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f66f6] text-white shadow-[0_10px_24px_rgba(47,102,246,0.28)]">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-[17px] font-extrabold tracking-tight text-slate-900">
                FlowForge
              </h1>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                Enterprise
              </p>
            </div>
          </div>

          <nav className="mt-10 space-y-2">
            <Link
              href="/dashboard"
              className="flex w-full items-center gap-3 rounded-2xl bg-[#eef4ff] px-4 py-3 text-left text-[15px] font-bold text-[#2f66f6]"
            >
              <LayoutGrid className="h-4 w-4" />
              Dashboard
            </Link>

            <Link
              href="/projects"
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] font-bold text-slate-600 hover:bg-slate-50"
            >
              <Folder className="h-4 w-4" />
              Projects
            </Link>

            <Link
              href="/my-tasks"
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] font-bold text-slate-600 hover:bg-slate-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              My Tasks
            </Link>

            <Link
              href="/members"
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] font-bold text-slate-600 hover:bg-slate-50"
            >
              <UserPlus className="h-4 w-4" />
              Members
            </Link>

            <Link
              href="/activity"
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] font-bold text-slate-600 hover:bg-slate-50"
            >
              <Bell className="h-4 w-4" />
              Activity
            </Link>
          </nav>
        </aside>

        <main className="min-w-0 px-8 py-6">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-[32px] font-extrabold tracking-tight text-slate-900">
                Dashboard
              </h2>
              <p className="mt-1 text-[14px] font-medium text-slate-500">
                Manage your workspace with a premium command center.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="h-12 w-[280px] rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm focus:border-[#2f66f6] focus:outline-none"
                  placeholder="Search..."
                />
              </div>

              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef4ff] text-[#2f66f6]">
                <Plus className="h-6 w-6" />
              </button>

              <button className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              </button>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-extrabold text-white">
                JR
              </div>
            </div>
          </header>

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

          <section className="mt-8">
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
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[30px] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between px-6 pb-4 pt-6">
              <div>
                <h3 className="text-[28px] font-extrabold tracking-tight text-slate-900">
                  My Tasks
                </h3>
                <p className="mt-1 text-[13px] font-medium text-[#8ca0c0]">
                  8 active assignments
                </p>
              </div>

              <button className="rounded-full bg-[#eef4ff] px-4 py-2 text-[13px] font-extrabold text-[#2f66f6]">
                View All
              </button>
            </div>

            <DesktopTaskRow
              title="Design System Audit"
              tag="HIGH"
              tagColor="#e8efff"
              project="Marketing Web"
              timeText="2h ago"
            />

            <DesktopTaskRow
              title="Client Meeting Notes"
              tag="MEDIUM"
              tagColor="#edf2f7"
              project="Client Success"
              checked
              timeText="✓"
              timeColor="text-[#22c55e]"
            />

            <DesktopTaskRow
              title="API Integration Layer"
              tag="URGENT"
              tagColor="#fff1e8"
              project="FlowForge API"
              timeText="Today"
              timeColor="text-[#f97316]"
            />
          </section>
        </main>
      </div>
    </div>
  );
}