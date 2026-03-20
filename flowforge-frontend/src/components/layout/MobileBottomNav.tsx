"use client";

import { useEffect, useMemo, useState } from "react";
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
  Building2,
  Check,
} from "lucide-react";
import { clearToken, getToken, setToken } from "@/lib/auth";
import {
  clearActiveWorkspaceSlug,
  getActiveWorkspaceSlug,
  setActiveWorkspaceSlug,
} from "@/lib/workspace-session";
import { getMyWorkspaces } from "@/features/workspaces/api";
import { switchWorkspace } from "@/features/auth/api";
import type { MyWorkspace } from "@/features/workspaces/types";

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
  const [openWorkspacePicker, setOpenWorkspacePicker] = useState(false);

  const [workspaces, setWorkspaces] = useState<MyWorkspace[]>([]);
  const [activeWorkspaceSlug, setActiveWorkspaceSlugState] = useState("");
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [switchingWorkspace, setSwitchingWorkspace] = useState(false);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function handleLogout() {
    clearToken();
    clearActiveWorkspaceSlug();
    setOpenMore(false);
    setOpenWorkspacePicker(false);
    router.replace("/login");
  }

  useEffect(() => {
    async function loadWorkspaces() {
      try {
        setWorkspaceLoading(true);
        const data = await getMyWorkspaces();
        setWorkspaces(data);

        const saved = getActiveWorkspaceSlug();
        const fallback = data[0]?.workspaceSlug || "";
        const current =
          saved && data.some((item) => item.workspaceSlug === saved)
            ? saved
            : fallback;

        setActiveWorkspaceSlugState(current);

        if (current) {
          setActiveWorkspaceSlug(current);
        }
      } catch {
        setWorkspaces([]);
      } finally {
        setWorkspaceLoading(false);
      }
    }

    loadWorkspaces();
  }, []);

  async function handleSelectWorkspace(workspace: MyWorkspace) {
    try {
      const token = getToken();
      if (!token) {
        handleLogout();
        return;
      }

      if (workspace.workspaceSlug === activeWorkspaceSlug) {
        setOpenWorkspacePicker(false);
        setOpenMore(false);
        return;
      }

      setSwitchingWorkspace(true);

      const result = await switchWorkspace(
        { workspaceSlug: workspace.workspaceSlug },
        token
      );

      setToken(result.token);
      setActiveWorkspaceSlug(result.workspaceSlug || workspace.workspaceSlug);
      setActiveWorkspaceSlugState(result.workspaceSlug || workspace.workspaceSlug);

      setOpenWorkspacePicker(false);
      setOpenMore(false);

      window.location.href = "/dashboard";
    } catch {
      handleLogout();
    } finally {
      setSwitchingWorkspace(false);
    }
  }

  const activeWorkspace = useMemo(() => {
    return (
      workspaces.find((item) => item.workspaceSlug === activeWorkspaceSlug) || null
    );
  }, [workspaces, activeWorkspaceSlug]);

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
    []
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
                    moreActive || openMore
                      ? "bg-[#edf4ff] text-[#2563eb]"
                      : "text-[#94a3b8]"
                  }`}
                >
                  <MoreHorizontal className="h-5 w-5" />
                </div>

                <span
                  className={`text-center text-[10px] font-extrabold leading-none tracking-[0.12em] ${
                    moreActive || openMore ? "text-[#2563eb]" : "text-[#94a3b8]"
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
            onClick={() => {
              setOpenMore(false);
              setOpenWorkspacePicker(false);
            }}
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
                onClick={() => {
                  setOpenMore(false);
                  setOpenWorkspacePicker(false);
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dbe4ef] text-[#475569]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setOpenWorkspacePicker((prev) => !prev)}
              className="mb-4 w-full rounded-[24px] border border-[#dbe4ef] bg-[#f8fbff] p-4 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#eaf1ff] text-[#2563eb]">
                  <Building2 className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#94a3b8]">
                    Switch Workspace
                  </p>
                  <p className="mt-1 truncate text-[15px] font-extrabold text-[#0f172a]">
                    {activeWorkspace?.workspaceName || "Choose workspace"}
                  </p>
                  <p className="mt-1 truncate text-[12px] font-bold uppercase tracking-[0.12em] text-[#64748b]">
                    {switchingWorkspace
                      ? "Switching..."
                      : activeWorkspace?.workspaceSlug || "No workspace selected"}
                  </p>
                </div>
              </div>
            </button>

            {openWorkspacePicker ? (
              <div className="mb-4 max-h-[240px] overflow-y-auto rounded-[24px] border border-[#e6ebf3] bg-white p-2">
                {workspaceLoading ? (
                  <div className="px-4 py-5 text-sm font-semibold text-[#64748b]">
                    Loading workspaces...
                  </div>
                ) : workspaces.length === 0 ? (
                  <div className="px-4 py-5 text-sm font-semibold text-[#64748b]">
                    No workspaces found.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {workspaces.map((workspace) => {
                      const selected =
                        workspace.workspaceSlug === activeWorkspaceSlug;

                      return (
                        <button
                          key={workspace.workspaceSlug}
                          type="button"
                          onClick={() => handleSelectWorkspace(workspace)}
                          disabled={switchingWorkspace}
                          className={`flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left transition ${
                            selected
                              ? "bg-[#eef4ff] text-[#2563eb]"
                              : "bg-white text-[#0f172a] hover:bg-[#f8fafc]"
                          } disabled:opacity-60`}
                        >
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-extrabold">
                              {workspace.workspaceName}
                            </p>
                            <p className="mt-1 truncate text-[11px] font-bold uppercase tracking-[0.12em] text-[#64748b]">
                              {workspace.role} • {workspace.workspaceSlug}
                            </p>
                          </div>

                          {selected ? (
                            <Check className="h-4 w-4 shrink-0" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-3 pb-[max(env(safe-area-inset-bottom),20px)]">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const active = item.href ? isActive(item.href) : false;

                if (item.href) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => {
                        setOpenMore(false);
                        setOpenWorkspacePicker(false);
                      }}
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