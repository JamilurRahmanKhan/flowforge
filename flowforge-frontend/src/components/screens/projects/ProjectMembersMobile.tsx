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

function MemberCard({
  projectId,
  member,
  mode,
  onMembersChanged,
}: {
  projectId: string;
  member: ProjectMember;
  mode: "assign" | "remove";
  onMembersChanged: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);

      if (mode === "assign") {
        await assignProjectMember(projectId, member.userId);
      } else {
        await removeProjectMember(projectId, member.userId);
      }

      await onMembersChanged();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleClick}
            className={`mt-4 rounded-full px-3 py-1.5 text-[11px] font-extrabold ${
              mode === "assign"
                ? "bg-[#2563eb] text-white"
                : "border border-rose-200 text-rose-600"
            } disabled:opacity-60`}
          >
            {loading ? "..." : mode === "assign" ? "Assign" : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectMembersMobile({
  projectId,
  assignedMembers,
  availableMembers,
  onMembersChanged,
}: Props) {
  return (
    <div className="lg:hidden space-y-8">
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-extrabold tracking-tight text-slate-900">
              Assigned Members
            </h2>
            <p className="mt-1 text-[13px] text-slate-500">
              Project members
            </p>
          </div>

          <div className="rounded-full bg-[#eef4ff] px-4 py-2 text-[12px] font-extrabold text-[#2563eb]">
            {assignedMembers.length}
          </div>
        </div>

        <div className="space-y-3">
          {assignedMembers.length > 0 ? (
            assignedMembers.map((member) => (
              <MemberCard
                key={member.userId}
                projectId={projectId}
                member={member}
                mode="remove"
                onMembersChanged={onMembersChanged}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-[13px] font-medium text-slate-400">
              No members assigned yet.
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-extrabold tracking-tight text-slate-900">
              Available Members
            </h2>
            <p className="mt-1 text-[13px] text-slate-500">
              Assign more users
            </p>
          </div>

          <div className="rounded-full bg-slate-100 px-4 py-2 text-[12px] font-extrabold text-slate-700">
            {availableMembers.length}
          </div>
        </div>

        <div className="space-y-3">
          {availableMembers.length > 0 ? (
            availableMembers.map((member) => (
              <MemberCard
                key={member.userId}
                projectId={projectId}
                member={member}
                mode="assign"
                onMembersChanged={onMembersChanged}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-[13px] font-medium text-slate-400">
              No available users left.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}