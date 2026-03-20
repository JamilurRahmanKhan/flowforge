"use client";

import type { MyWorkspace } from "@/features/workspaces/types";

type Props = {
  open: boolean;
  workspaces: MyWorkspace[];
  activeSlug: string;
  onClose: () => void;
  onSelect: (workspace: MyWorkspace) => void | Promise<void>;
};

export default function WorkspaceSwitcherModal({
  open,
  workspaces,
  activeSlug,
  onClose,
  onSelect,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <button
        type="button"
        aria-label="Close workspace switcher"
        onClick={onClose}
        className="absolute inset-0"
      />

      <div className="relative z-10 w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="mb-5">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
            Workspace Access
          </p>
          <h3 className="mt-2 text-[28px] font-extrabold tracking-tight text-slate-950">
            Switch Workspace
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Choose the workspace you want to open.
          </p>
        </div>

        <div className="space-y-3">
          {workspaces.length > 0 ? (
            workspaces.map((workspace) => {
              const active = workspace.workspaceSlug === activeSlug;

              return (
                <button
                  key={workspace.workspaceSlug}
                  type="button"
                  onClick={() => onSelect(workspace)}
                  className={`flex w-full items-center justify-between rounded-[22px] border px-5 py-4 text-left transition ${
                    active
                      ? "border-[#bfdbfe] bg-[#eff6ff]"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-extrabold text-slate-950">
                      {workspace.workspaceName}
                    </p>
                    <p className="mt-1 truncate text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      {workspace.role} • {workspace.workspaceSlug}
                    </p>
                  </div>

                  {active ? (
                    <span className="rounded-full bg-[#2563eb] px-3 py-1 text-[11px] font-extrabold text-white">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-extrabold text-slate-600">
                      Select
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm font-medium text-slate-500">
              No workspaces found.
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}