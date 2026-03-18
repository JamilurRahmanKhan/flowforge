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
  onMembersChanged: () => Promise<void> | void;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

function MemberCard({
  member,
  actionLabel,
  actionType,
  loading,
  onAction,
}: {
  member: ProjectMember;
  actionLabel: string;
  actionType: "assign" | "remove";
  loading: boolean;
  onAction: () => void;
}) {
  return (
    <div className="rounded-[20px] border border-[#eef2f7] bg-[#f8fafc] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9f0ff] text-sm font-extrabold text-[#2563eb]">
          {initials(member.name)}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[15px] font-extrabold text-[#0f172a]">
            {member.name}
          </p>
          <p className="truncate text-[13px] text-[#64748b]">{member.email}</p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]">
            {member.role}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={onAction}
          disabled={loading}
          className={
            actionType === "assign"
              ? "w-full rounded-full bg-[#2563eb] px-4 py-2.5 text-[12px] font-extrabold text-white disabled:opacity-60"
              : "w-full rounded-full border border-rose-200 px-4 py-2.5 text-[12px] font-extrabold text-rose-600 disabled:opacity-60"
          }
        >
          {loading ? (actionType === "assign" ? "Assigning..." : "Removing...") : actionLabel}
        </button>
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
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleAssign(userId: string) {
    try {
      setError("");
      setLoadingUserId(userId);
      await assignProjectMember(projectId, userId);
      await onMembersChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign member");
    } finally {
      setLoadingUserId(null);
    }
  }

  async function handleRemove(userId: string) {
    try {
      setError("");
      setLoadingUserId(userId);
      await removeProjectMember(projectId, userId);
      await onMembersChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove member");
    } finally {
      setLoadingUserId(null);
    }
  }

  return (
    <div className="space-y-5 lg:hidden">
      {error ? (
        <div className="rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-[24px] border border-[#e6ebf3] bg-white p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-extrabold text-[#0f172a]">
            Assigned Members
          </h3>
          <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[11px] font-extrabold text-[#2563eb]">
            {assignedMembers.length}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {assignedMembers.length > 0 ? (
            assignedMembers.map((member) => (
              <MemberCard
                key={member.userId}
                member={member}
                actionLabel="Remove"
                actionType="remove"
                loading={loadingUserId === member.userId}
                onAction={() => handleRemove(member.userId)}
              />
            ))
          ) : (
            <div className="rounded-[18px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-4 py-8 text-center text-[13px] font-medium text-[#94a3b8]">
              No assigned members yet.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[24px] border border-[#e6ebf3] bg-white p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-extrabold text-[#0f172a]">
            Available Members
          </h3>
          <span className="rounded-full bg-[#f8fafc] px-3 py-1 text-[11px] font-extrabold text-[#475569]">
            {availableMembers.length}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {availableMembers.length > 0 ? (
            availableMembers.map((member) => (
              <MemberCard
                key={member.userId}
                member={member}
                actionLabel="Assign"
                actionType="assign"
                loading={loadingUserId === member.userId}
                onAction={() => handleAssign(member.userId)}
              />
            ))
          ) : (
            <div className="rounded-[18px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-4 py-8 text-center text-[13px] font-medium text-[#94a3b8]">
              No available members to assign.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}