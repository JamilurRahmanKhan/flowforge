"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  FolderKanban,
  CheckCircle2,
  Users,
  Bell,
  Settings,
  UserRound,
  LogOut,
  Zap,
} from "lucide-react";
import { clearToken } from "@/lib/auth";

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
  const router = useRouter();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function handleLogout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <aside className="hidden h-screen w-[280px] shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f66f6] text-white shadow-[0_10px_24px_rgba(47,102,246,0.28)]">
          <Zap className="h-5 w-5" />
        </div>

        <div>
          <div className="text-[18px] font-extrabold tracking-tight text-slate-900">
            FlowForge
          </div>
          <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
            Enterprise
          </div>
        </div>
      </div>

      <nav className="mt-10 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-bold transition ${
                active
                  ? "bg-[#eef4ff] text-[#2f66f6]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="rounded-[28px] bg-[#071a4b] p-6 text-white shadow-[0_10px_30px_rgba(7,26,75,0.18)]">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-white/70">
            Pro Plan
          </p>
          <p className="mt-4 text-[17px] font-extrabold leading-8">
            Unlock advanced
            <br />
            team collaboration
          </p>
          <button className="mt-5 rounded-full bg-white px-5 py-3 text-[14px] font-extrabold text-slate-900">
            Upgrade
          </button>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-[15px] font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}