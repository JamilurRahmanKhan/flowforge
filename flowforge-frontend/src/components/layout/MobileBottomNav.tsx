"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  FolderKanban,
  ListChecks,
  Users,
  MoreHorizontal,
  Bell,
  Settings,
  UserCircle,
  LogOut,
  X,
} from "lucide-react";
import { clearToken } from "@/lib/auth";

type PrimaryNavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type MoreNavItem = {
  href?: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  danger?: boolean;
  action?: () => void;
};

const primaryItems: PrimaryNavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/my-tasks", label: "My Tasks", icon: ListChecks },
  { href: "/members", label: "Members", icon: Users },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [openMore, setOpenMore] = useState(false);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function handleLogout() {
    clearToken();
    setOpenMore(false);
    router.replace("/login");
  }

  const moreItems: MoreNavItem[] = useMemo(
    () => [
      { href: "/activity", label: "Activity", icon: Bell },
      { href: "/settings", label: "Settings", icon: Settings },
      { href: "/profile", label: "Profile", icon: UserCircle },
      {
        label: "Logout",
        icon: LogOut,
        danger: true,
        action: handleLogout,
      },
    ],
    [router]
  );

  const moreActive =
    pathname === "/activity" ||
    pathname.startsWith("/activity/") ||
    pathname === "/settings" ||
    pathname.startsWith("/settings/") ||
    pathname === "/profile" ||
    pathname.startsWith("/profile/");

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e8edf5] bg-white/95 px-3 pt-3 backdrop-blur md:hidden">
        <div className="mx-auto max-w-lg pb-[max(env(safe-area-inset-bottom),12px)]">
          <div className="rounded-[28px] border border-[#dfe7f2] bg-white px-2 py-2 shadow-[0_-12px_28px_rgba(15,23,42,0.08)]">
            <div className="grid grid-cols-5 gap-1">
              {primaryItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-[20px] px-1 py-2 transition active:scale-[0.98]"
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-[16px] transition ${
                        active
                          ? "bg-[#edf4ff] text-[#2563eb]"
                          : "text-[#94a3b8]"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span
                      className={`text-center text-[10px] font-extrabold leading-none tracking-[0.12em] ${
                        active ? "text-[#2563eb]" : "text-[#94a3b8]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={() => setOpenMore(true)}
                className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-[20px] px-1 py-2 transition active:scale-[0.98]"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-[16px] transition ${
                    moreActive
                      ? "bg-[#edf4ff] text-[#2563eb]"
                      : "text-[#94a3b8]"
                  }`}
                >
                  <MoreHorizontal className="h-5 w-5" />
                </div>

                <span
                  className={`text-center text-[10px] font-extrabold leading-none tracking-[0.12em] ${
                    moreActive ? "text-[#2563eb]" : "text-[#94a3b8]"
                  }`}
                >
                  More
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {openMore ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close more menu"
            onClick={() => setOpenMore(false)}
            className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]"
          />

          <div className="absolute inset-x-0 bottom-0 rounded-t-[32px] bg-white px-5 pt-5 shadow-[0_-18px_40px_rgba(15,23,42,0.16)]">
            <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-[#dbe4ef]" />

            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#94a3b8]">
                  Workspace Menu
                </p>
                <h3 className="mt-1 text-[24px] font-extrabold tracking-tight text-[#0f172a]">
                  More
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setOpenMore(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dbe4ef] text-[#475569]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-[max(env(safe-area-inset-bottom),20px)]">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const active = item.href ? isActive(item.href) : false;

                if (item.href) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpenMore(false)}
                      className={`rounded-[24px] border p-4 transition ${
                        active
                          ? "border-[#bfd3ff] bg-[#f5f9ff]"
                          : "border-[#e6ebf3] bg-white"
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-[18px] ${
                          active
                            ? "bg-[#eaf1ff] text-[#2563eb]"
                            : "bg-[#f8fafc] text-[#64748b]"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <p className="mt-4 text-[15px] font-extrabold text-[#0f172a]">
                        {item.label}
                      </p>
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.action}
                    className="rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-left"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-white text-rose-600">
                      <Icon className="h-5 w-5" />
                    </div>

                    <p className="mt-4 text-[15px] font-extrabold text-rose-700">
                      {item.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}