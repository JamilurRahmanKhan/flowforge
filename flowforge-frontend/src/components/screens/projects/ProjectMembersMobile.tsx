"use client";

import type { WorkspaceUser } from "@/features/users/types";

type Props = {
  members: WorkspaceUser[];
};

function roleBadgeClass(role: string) {
  const value = role?.toUpperCase?.() || "";

  if (value === "ORG_OWNER") return "bg-purple-100 text-purple-700";
  if (value === "ORG_ADMIN") return "bg-blue-100 text-blue-700";
  if (value === "PROJECT_MANAGER") return "bg-amber-100 text-amber-700";
  if (value === "MEMBER") return "bg-slate-100 text-slate-700";
  return "bg-slate-100 text-slate-700";
}

export default function ProjectMembersMobile({ members }: Props) {
  return (
    <div className="lg:hidden">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-extrabold tracking-tight text-slate-900">
            Members
          </h2>
          <p className="mt-1 text-[13px] text-slate-500">
            Workspace members
          </p>
        </div>

        <div className="rounded-full bg-[#eef4ff] px-4 py-2 text-[12px] font-extrabold text-[#2563eb]">
          {members.length}
        </div>
      </div>

      <div className="space-y-3">
        {members.length > 0 ? (
          members.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8efff] text-[13px] font-extrabold text-[#2563eb]">
                  {member.name?.slice(0, 2)?.toUpperCase() || "U"}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-bold text-slate-900">
                    {member.name}
                  </p>
                  <p className="mt-1 truncate text-[13px] text-slate-500">
                    {member.email}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide ${roleBadgeClass(
                        member.role
                      )}`}
                    >
                      {member.role}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide ${
                        member.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {member.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-[13px] font-medium text-slate-400">
            No members found in this workspace.
          </div>
        )}
      </div>
    </div>
  );
}