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

export default function ProjectMembersDesktop({ members }: Props) {
  return (
    <div className="hidden lg:block">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-extrabold tracking-tight text-slate-900">
            Members
          </h2>
          <p className="mt-1 text-[14px] text-slate-500">
            Workspace members available for this project.
          </p>
        </div>

        <div className="rounded-full bg-[#eef4ff] px-4 py-2 text-[13px] font-extrabold text-[#2563eb]">
          {members.length} Members
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1fr_1fr_0.7fr_0.5fr] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            Name
          </p>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            Email
          </p>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            Role
          </p>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            Status
          </p>
        </div>

        {members.length > 0 ? (
          members.map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-[1fr_1fr_0.7fr_0.5fr] gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8efff] text-[13px] font-extrabold text-[#2563eb]">
                  {member.name?.slice(0, 2)?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-[15px] font-bold text-slate-900">
                    {member.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-[14px] font-medium text-slate-500">
                {member.email}
              </div>

              <div className="flex items-center">
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide ${roleBadgeClass(
                    member.role
                  )}`}
                >
                  {member.role}
                </span>
              </div>

              <div className="flex items-center">
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
          ))
        ) : (
          <div className="px-6 py-12 text-center text-[14px] font-medium text-slate-400">
            No members found in this workspace.
          </div>
        )}
      </div>
    </div>
  );
}