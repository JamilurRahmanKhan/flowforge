"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Plus, Search } from "lucide-react";
import { clearToken } from "@/lib/auth";

function getTitle(pathname: string) {
  if (pathname.startsWith("/projects/")) return "Project Details";
  if (pathname.startsWith("/projects")) return "Projects";
  if (pathname.startsWith("/my-tasks")) return "My Tasks";
  if (pathname.startsWith("/members")) return "Members";
  if (pathname.startsWith("/activity")) return "Activity";
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/profile")) return "Profile";
  return "Dashboard";
}

function getSubtitle(pathname: string) {
  if (pathname.startsWith("/projects/")) {
    return "Track progress, members, and task activity.";
  }
  if (pathname.startsWith("/projects")) {
    return "Manage active and archived projects across your workspace.";
  }
  if (pathname.startsWith("/my-tasks")) {
    return "Monitor your assigned work and delivery status.";
  }
  if (pathname.startsWith("/members")) {
    return "Manage workspace users and their access.";
  }
  if (pathname.startsWith("/activity")) {
    return "Track the latest actions across your workspace.";
  }
  if (pathname.startsWith("/settings")) {
    return "Configure workspace and application preferences.";
  }
  if (pathname.startsWith("/profile")) {
    return "Manage your account information and preferences.";
  }
  return "Manage your workspace with a premium command center.";
}

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();

  const title = useMemo(() => getTitle(pathname), [pathname]);
  const subtitle = useMemo(() => getSubtitle(pathname), [pathname]);

  function handleLogout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-[#f4f7fb]/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-[24px] font-extrabold tracking-tight text-slate-900">
                {title}
              </h1>
            </div>
          </div>

          <div className="hidden lg:block">
            <h1 className="text-[34px] font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-1 text-[14px] font-medium text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden lg:block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-12 w-[260px] rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-[#2f66f6]"
              placeholder="Search..."
            />
          </div>

          <button className="hidden h-12 w-12 items-center justify-center rounded-full bg-[#eef4ff] text-[#2f66f6] lg:flex">
            <Plus className="h-6 w-6" />
          </button>

          <button className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm lg:h-12 lg:w-12">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-extrabold text-white lg:h-12 lg:w-12">
            JR
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 lg:hidden"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}