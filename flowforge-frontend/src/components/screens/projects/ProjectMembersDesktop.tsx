"use client";

import { useState } from "react";
import {
  assignProjectMember,
  removeProjectMember,
} from "@/features/project-members/api";
import type { ProjectMember } from "@/features/project-members/types";

type Props = {
  projectId: string;
  assignedMembers: ProjectMember[];
  availableMembers: ProjectMember[];
  onMembersChanged: () => Promise<void>;
};

function roleBadgeClass(role: string) {
  const value = role?.toUpperCase?.() || "";

  if (value === "ORG_OWNER") return "bg-purple-100 text-purple-700";
  if (value === "ORG_ADMIN") return "bg-blue-100 text-blue-700";
  if (value === "PROJECT_MANAGER") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function MemberRow({
  member,
  actionLabel,
  actionType,
  onAction,
}: {
  member: ProjectMember;
  actionLabel: string;
  actionType: "assign" | "remove";
  onAction: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);
      await onAction();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-[1fr_1fr_0.7fr_0.7fr] gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8efff] text-[13px] font-extrabold text-[#2563eb]">
          {member.name?.slice(0, 2)?.toUpperCase() || "U"}
        </div>
        <div>
          <p className="text-[15px] font-bold text-slate-900">{member.name}</p>
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
        <button
          type="button"
          disabled={loading}
          onClick={handleClick}
          className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold ${
            actionType === "assign"
              ? "bg-[#2563eb] text-white"
              : "border border-rose-200 text-rose-600"
          } disabled:opacity-60`}
        >
          {loading ? "..." : actionLabel}
        </button>
      </div>
    </div>
  );
}

export default function ProjectMembersDesktop({
  projectId,
  assignedMembers,
  availableMembers,
  onMembersChanged,
}: Props) {
  return (
    <div className="hidden lg:block space-y-8">
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight text-slate-900">
              Assigned Members
            </h2>
            <p className="mt-1 text-[14px] text-slate-500">
              Members currently assigned to this project.
            </p>
          </div>

          <div className="rounded-full bg-[#eef4ff] px-4 py-2 text-[13px] font-extrabold text-[#2563eb]">
            {assignedMembers.length} Assigned
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
          {assignedMembers.length > 0 ? (
            assignedMembers.map((member) => (
              <MemberRow
                key={member.userId}
                member={member}
                actionLabel="Remove"
                actionType="remove"
                onAction={async () => {
                  await removeProjectMember(projectId, member.userId);
                  await onMembersChanged();
                }}
              />
            ))
          ) : (
            <div className="px-6 py-12 text-center text-[14px] font-medium text-slate-400">
              No members assigned to this project yet.
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight text-slate-900">
              Available Members
            </h2>
            <p className="mt-1 text-[14px] text-slate-500">
              Workspace users you can assign to this project.
            </p>
          </div>

          <div className="rounded-full bg-slate-100 px-4 py-2 text-[13px] font-extrabold text-slate-700">
            {availableMembers.length} Available
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
          {availableMembers.length > 0 ? (
            availableMembers.map((member) => (
              <MemberRow
                key={member.userId}
                member={member}
                actionLabel="Assign"
                actionType="assign"
                onAction={async () => {
                  await assignProjectMember(projectId, member.userId);
                  await onMembersChanged();
                }}
              />
            ))
          ) : (
            <div className="px-6 py-12 text-center text-[14px] font-medium text-slate-400">
              No available members left to assign.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}