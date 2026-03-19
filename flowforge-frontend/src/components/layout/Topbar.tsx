"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { clearToken, getToken, setToken } from "@/lib/auth";
import {
  clearActiveWorkspaceSlug,
  getActiveWorkspaceSlug,
  setActiveWorkspaceSlug,
} from "@/lib/workspace-session";
import { getCurrentUser } from "@/features/user/api";
import { getMyWorkspaces } from "@/features/workspaces/api";
import { switchWorkspace } from "@/features/auth/api";
import type { MyWorkspace } from "@/features/workspaces/types";
import WorkspaceSwitcherModal from "./WorkspaceSwitcherModal";

type Props = {
  title?: string;
};

function initials(name: string) {
  return name
    .trim()
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

export default function Topbar({ title }: Props) {
  const [name, setName] = useState("User");
  const [workspaces, setWorkspaces] = useState<MyWorkspace[]>([]);
  const [activeWorkspaceSlug, setActiveWorkspaceSlugState] = useState("");
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [user, workspaceData] = await Promise.all([
          getCurrentUser(),
          getMyWorkspaces(),
        ]);

        setName(user.name);
        setWorkspaces(workspaceData);

        const saved = getActiveWorkspaceSlug();
        const fallback = workspaceData[0]?.workspaceSlug || "";

        const nextActive =
          saved && workspaceData.some((w) => w.workspaceSlug === saved)
            ? saved
            : fallback;

        if (nextActive) {
          setActiveWorkspaceSlug(nextActive);
          setActiveWorkspaceSlugState(nextActive);
        }
      } catch {
        // ignore
      }
    }

    load();
  }, []);

  const activeWorkspace = useMemo(() => {
    return (
      workspaces.find((workspace) => workspace.workspaceSlug === activeWorkspaceSlug) ||
      workspaces[0] ||
      null
    );
  }, [workspaces, activeWorkspaceSlug]);

  const userInitials = useMemo(() => initials(name || "User"), [name]);

  function handleLogout() {
    clearToken();
    clearActiveWorkspaceSlug();
    window.location.href = "/login";
  }

  async function handleSelectWorkspace(workspace: MyWorkspace) {
    try {
      const token = getToken();
      if (!token) {
        handleLogout();
        return;
      }

      setSwitching(true);

      const result = await switchWorkspace(
        { workspaceSlug: workspace.workspaceSlug },
        token
      );

      setToken(result.token);
      setActiveWorkspaceSlug(workspace.workspaceSlug);
      setActiveWorkspaceSlugState(workspace.workspaceSlug);
      setSwitcherOpen(false);

      window.location.href = "/dashboard";
    } catch {
      handleLogout();
    } finally {
      setSwitching(false);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/60 bg-white/90 px-4 py-4 backdrop-blur-md sm:px-6">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-slate-950 sm:text-3xl">
            {title || "FlowForge"}
          </h1>
          <p className="hidden text-xs font-medium text-slate-500 sm:block">
            Premium workspace operations
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {activeWorkspace ? (
            <button
              type="button"
              onClick={() => !switching && setSwitcherOpen(true)}
              className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:bg-slate-50 md:flex"
            >
              <div>
                <p className="max-w-[180px] truncate text-[13px] font-extrabold text-slate-950">
                  {activeWorkspace.workspaceName}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {switching ? "Switching..." : activeWorkspace.role}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>
          ) : null}

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
              {name}
            </div>

          <button
            type="button"
            onClick={handleLogout}
            className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:flex"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <WorkspaceSwitcherModal
        open={switcherOpen}
        workspaces={workspaces}
        activeSlug={activeWorkspaceSlug}
        onClose={() => setSwitcherOpen(false)}
        onSelect={handleSelectWorkspace}
      />
    </>
  );
}