"use client";
import Link from "next/link";
import {
  Bell,
  Briefcase,
  CalendarDays,
  Check,
  CheckCircle2,
  Folder,
  Home,
  LayoutGrid,
  Plus,
  UserPlus,
  UserRound,
  Zap,
} from "lucide-react";

function StatCard({
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
    <div className="rounded-[24px] bg-white px-5 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-bold"
          style={{ backgroundColor: badgeBg, color: badgeText }}
        >
          {badge}
        </span>
      </div>

      <div className="mt-7">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
          {title}
        </p>
        <p className="mt-1 text-[20px] font-extrabold tracking-tight text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function GettingStartedCard({
  title,
  step,
  active = false,
  icon,
}: {
  title: string;
  step: string;
  active?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={`min-w-[205px] rounded-[24px] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] ${
        active ? "bg-[#2f66f6] text-white" : "bg-white text-slate-900"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            active ? "bg-white/10 text-white" : "bg-slate-50 text-slate-400"
          }`}
        >
          {icon}
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
            active
              ? "bg-white/15 text-white"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {step}
        </span>
      </div>

      <h3
        className={`mt-10 text-[16px] font-extrabold leading-[1.25] ${
          active ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h3>
    </div>
  );
}

function TaskRow({
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
    <div className="flex items-center gap-4 border-t border-slate-100 px-4 py-4 sm:px-5">
      <button
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
          checked
            ? "border-[#2f66f6] bg-[#2f66f6] text-white"
            : "border-slate-300 bg-white text-transparent"
        }`}
      >
        <Check className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-[15px] font-bold ${
            checked ? "text-slate-400 line-through" : "text-slate-900"
          }`}
        >
          {title}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide"
            style={{ backgroundColor: tagColor }}
          >
            {tag}
          </span>
          <span className="text-[12px] font-medium text-slate-400">{project}</span>
        </div>
      </div>

      <div className={`shrink-0 text-[12px] font-bold ${timeColor}`}>{timeText}</div>
    </div>
  );
}

function BottomNav() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),12px)] pt-2 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-md items-end justify-around">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 px-2 py-1">
          <Home className="h-5 w-5 text-[#2f66f6]" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#2f66f6]">
            Home
          </span>
        </Link>

        <Link href="/my-tasks" className="flex flex-col items-center gap-1 px-2 py-1">
          <CheckCircle2 className="h-5 w-5 text-slate-400" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
            Tasks
          </span>
        </Link>

        <button
          type="button"
          className="relative -mt-8 flex flex-col items-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2f66f6] text-white shadow-[0_14px_30px_rgba(47,102,246,0.38)]">
            <Plus className="h-7 w-7" />
          </div>
          <span className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
            Create
          </span>
        </button>

        <Link href="/projects" className="flex flex-col items-center gap-1 px-2 py-1">
          <LayoutGrid className="h-5 w-5 text-slate-400" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
            Projects
          </span>
        </Link>

        <Link href="/profile" className="flex flex-col items-center gap-1 px-2 py-1">
          <UserPlus className="h-5 w-5 text-slate-400" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
            Team
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function MobileDashboard() {
  return (
    <div className="min-h-screen bg-[#f4f7fb] pb-28">
      <div className="mx-auto w-full max-w-md px-4 pt-3 sm:px-5">
        <header className="flex items-center justify-between rounded-t-[28px] bg-[#f4f7fb] pb-4 pt-1">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2f66f6] text-white shadow-[0_10px_24px_rgba(47,102,246,0.28)]">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-[15px] font-extrabold tracking-tight text-slate-900">
                FlowForge
              </h1>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                Enterprise
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9eefc] text-[#2f66f6]">
              <Plus className="h-6 w-6" />
            </button>

            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
            </div>

            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
              <UserRound className="h-6 w-6 text-slate-500" />
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            icon={<LayoutGrid className="h-5 w-5 text-[#2f66f6]" />}
            title="Open Tasks"
            value="24"
            badge="+12%"
            iconBg="#eef4ff"
            badgeBg="#edf2ff"
            badgeText="#2f66f6"
          />

          <StatCard
            icon={<CalendarDays className="h-5 w-5 text-[#f97316]" />}
            title="Due Soon"
            value="5"
            badge="High"
            iconBg="#fff4eb"
            badgeBg="#fff1e8"
            badgeText="#f97316"
          />

          <StatCard
            icon={<Folder className="h-5 w-5 text-[#a855f7]" />}
            title="Projects"
            value="12"
            badge="Active"
            iconBg="#f7efff"
            badgeBg="#f5eaff"
            badgeText="#a855f7"
          />

          <StatCard
            icon={<Zap className="h-5 w-5 text-[#22c55e]" />}
            title="Activity"
            value="88%"
            badge="Peak"
            iconBg="#eefbf2"
            badgeBg="#eaf9ee"
            badgeText="#22c55e"
          />
        </section>

        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-extrabold uppercase tracking-[0.14em] text-[#8ca0c0]">
              Getting Started
            </h2>
          </div>

          <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">
            <GettingStartedCard
              title="Create your first project"
              step="Completed"
              active
              icon={<CheckCircle2 className="h-5 w-5" />}
            />
            <GettingStartedCard
              title="Invite your team members"
              step="Step 2"
              icon={<UserPlus className="h-5 w-5" />}
            />
            <GettingStartedCard
              title="Set up your profile"
              step="Step 3"
              icon={<UserRound className="h-5 w-5" />}
            />
          </div>
        </section>

        <section className="mt-6 rounded-[28px] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between px-4 pb-4 pt-5 sm:px-5">
            <div>
              <h2 className="text-[18px] font-extrabold tracking-tight text-slate-900">
                My Tasks
              </h2>
              <p className="mt-1 text-[12px] font-medium text-[#8ca0c0]">
                8 active assignments
              </p>
            </div>

            <button className="rounded-full bg-[#eef4ff] px-4 py-2 text-[12px] font-extrabold text-[#2f66f6]">
              View All
            </button>
          </div>

          <TaskRow
            title="Design System Audit"
            tag="HIGH"
            tagColor="#e8efff"
            project="Marketing Web"
            timeText="2h ago"
          />

          <TaskRow
            title="Client Meeting Notes"
            tag="MEDIUM"
            tagColor="#edf2f7"
            project="Client Success"
            checked
            timeText="✓"
            timeColor="text-[#22c55e]"
          />

          <TaskRow
            title="API Integration Layer"
            tag="URGENT"
            tagColor="#fff1e8"
            project="FlowForge API"
            timeText="Today"
            timeColor="text-[#f97316]"
          />
        </section>
      </div>

      <BottomNav />
    </div>
  );
}