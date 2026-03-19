"use client";

import { Building2, Check, ChevronRight, Shield } from "lucide-react";
import type { MyWorkspace } from "@/features/workspaces/types";

type Props = {
  open: boolean;
  workspaces: MyWorkspace[];
  activeSlug: string;
  onClose: () => void;
  onSelect: (workspace: MyWorkspace) => void;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString();
}

function roleTone(role: string) {
  switch (role) {
    case "ORG_OWNER":
      return "bg-violet-100 text-violet-700";
    case "ORG_ADMIN":
      return "bg-blue-100 text-blue-700";
    case "PROJECT_MANAGER":
      return "bg-amber-100 text-amber-700";
    case "MEMBER":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function WorkspaceSwitcherModal({
  open,
  workspaces,
  activeSlug,
  onClose,
  onSelect,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-700 px-6 py-6 text-white">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-blue-100/80">
            Workspace Access
          </p>
          <h2 className="mt-2 text-[28px] font-extrabold tracking-tight">
            Switch Workspace
          </h2>
          <p className="mt-2 text-[14px] leading-6 text-blue-50/85">
            Choose the workspace you want to open. This is useful when your
            account belongs to multiple workspaces.
          </p>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-6">
          <div className="space-y-4">
            {workspaces.map((workspace) => {
              const active = workspace.workspaceSlug === activeSlug;

              return (
                <button
                  key={workspace.tenantId}
                  type="button"
                  onClick={() => onSelect(workspace)}
                  className={`w-full rounded-[24px] border p-5 text-left transition ${
                    active
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-white text-slate-700 shadow-sm">
                        <Building2 className="h-6 w-6" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-[18px] font-extrabold text-slate-950">
                            {workspace.workspaceName}
                          </p>

                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] ${roleTone(
                              workspace.role
                            )}`}
                          >
                            {workspace.role}
                          </span>

                          {active ? (
                            <span className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white">
                              Active
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-2 text-[14px] font-semibold text-slate-600">
                          Slug: {workspace.workspaceSlug}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] font-medium text-slate-500">
                          <Shield className="h-3.5 w-3.5" />
                          <span>Joined {formatDate(workspace.joinedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {active ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                          <Check className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
                          <ChevronRight className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}