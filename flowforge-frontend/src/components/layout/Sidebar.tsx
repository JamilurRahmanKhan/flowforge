"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  FolderKanban,
  LayoutGrid,
  Settings,
  UserRound,
  Users,
  Zap,
} from "lucide-react";

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
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[270px] flex-col border-r border-[#e6ebf3] bg-white px-5 py-6">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2563eb] text-white shadow-[0_10px_24px_rgba(37,99,235,0.24)]">
          <Zap className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-[18px] font-extrabold tracking-tight text-[#0f172a]">
            FlowForge
          </h2>
          <p className="text-[11px] font-medium text-[#64748b]">Enterprise</p>
        </div>
      </div>

      <nav className="mt-10 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-[18px] px-4 py-3 text-[15px] font-bold transition ${
                active
                  ? "bg-[#f1f5f9] text-[#0f172a]"
                  : "text-[#475569] hover:bg-[#f8fafc]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 px-2">
        <div className="rounded-[22px] bg-[#0f172a] px-5 py-5 text-white">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/70">
            Pro Plan
          </p>
          <h3 className="mt-3 text-[18px] font-extrabold leading-snug">
            Unlock advanced team collaboration
          </h3>
          <button
            type="button"
            className="mt-4 rounded-full bg-white px-4 py-2 text-[13px] font-extrabold text-[#0f172a]"
          >
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
}