"use client";

import Link from "next/link";
import { LayoutGrid, FolderKanban, CheckCircle2, Users, Bell, Settings, UserRound } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/my-tasks", label: "My Tasks", icon: CheckCircle2 },
  { href: "/members", label: "Members", icon: Users },
  { href: "/activity", label: "Activity", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export default function Sidebar() {
  return (
    <aside className="hidden h-screen w-[290px] flex-col border-r border-slate-200 bg-white px-5 py-5 md:flex">
      <div className="mb-8">
        <div className="text-lg font-bold">FlowForge</div>
        <div className="text-xs text-slate-500">Enterprise</div>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}