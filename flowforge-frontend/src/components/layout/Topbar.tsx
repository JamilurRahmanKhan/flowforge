"use client";

import { Bell, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

type Props = {
  onLogout: () => void;
};

function pageTitle(pathname: string) {
  if (pathname.startsWith("/projects/")) return "Project Details";
  if (pathname.startsWith("/projects")) return "Projects";
  if (pathname.startsWith("/my-tasks")) return "My Tasks";
  if (pathname.startsWith("/members")) return "Members";
  if (pathname.startsWith("/activity")) return "Activity";
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/profile")) return "Profile";
  return "Dashboard";
}

function pageSubtitle(pathname: string) {
  if (pathname.startsWith("/projects/")) {
    return "Track progress, members, and task activity";
  }
  if (pathname.startsWith("/projects")) {
    return "Manage active and archived projects across your workspace";
  }
  if (pathname.startsWith("/my-tasks")) {
    return "Review your assigned and upcoming work";
  }
  if (pathname.startsWith("/members")) {
    return "View and manage workspace members";
  }
  if (pathname.startsWith("/activity")) {
    return "Track the latest activity across the workspace";
  }
  if (pathname.startsWith("/settings")) {
    return "Manage workspace settings and preferences";
  }
  if (pathname.startsWith("/profile")) {
    return "View your account details";
  }
  return "Manage your workspace with a premium command center";
}

export default function Topbar({ onLogout }: Props) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900">
            {pageTitle(pathname)}
          </h1>
          <p className="mt-1 text-[13px] font-medium text-slate-500">
            {pageSubtitle(pathname)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef4ff] text-[#2563eb]"
          >
            <Bell className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] font-extrabold text-slate-700"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-xs font-extrabold text-white">
            JR
          </div>
        </div>
      </div>
    </header>
  );
}