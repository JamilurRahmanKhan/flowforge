"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  FolderKanban,
  LayoutGrid,
  ListChecks,
  LogOut,
  Settings,
  Users,
  UserCircle,
  X,
} from "lucide-react";
import { clearToken } from "@/lib/auth";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/my-tasks", label: "My Tasks", icon: ListChecks },
  { href: "/members", label: "Members", icon: Users },
  { href: "/activity", label: "Activity", icon: Activity },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

type Props = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

function SidebarContent({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose?: () => void;
}) {
  function handleLogout() {
    clearToken();
    window.location.href = "/login";
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-start justify-between px-5 pb-6 pt-6">
        <div>
          <div className="text-[20px] font-extrabold text-slate-950">FlowForge</div>
          <div className="text-sm text-slate-500">Enterprise</div>
        </div>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-5">
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-[#eef4ff] text-[#2563eb]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200 px-5 py-5">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen = false, onClose }: Props) {
  const pathname = usePathname();

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[290px] shrink-0 border-r border-slate-200 bg-white md:block">
        <SidebarContent pathname={pathname} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/35"
          />
          <aside className="absolute left-0 top-0 h-full w-[84%] max-w-[320px] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
            <SidebarContent pathname={pathname} onClose={onClose} />
          </aside>
        </div>
      ) : null}
    </>
  );
}