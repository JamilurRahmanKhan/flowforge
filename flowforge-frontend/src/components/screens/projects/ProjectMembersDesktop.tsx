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

export default function ProjectMembersDesktop({
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
    <div className="hidden lg:block space-y-6">
      {error ? (
        <div className="rounded-[20px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[28px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between">
            <h3 className="text-[22px] font-extrabold tracking-tight text-[#0f172a]">
              Assigned Members
            </h3>
            <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[12px] font-extrabold text-[#2563eb]">
              {assignedMembers.length}
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {assignedMembers.length > 0 ? (
              assignedMembers.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between gap-4 rounded-[22px] border border-[#eef2f7] bg-[#f8fafc] px-5 py-4"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9f0ff] text-sm font-extrabold text-[#2563eb]">
                      {initials(member.name)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-extrabold text-[#0f172a]">
                        {member.name}
                      </p>
                      <p className="truncate text-[13px] text-[#64748b]">
                        {member.email}
                      </p>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(member.userId)}
                    disabled={loadingUserId === member.userId}
                    className="rounded-full border border-rose-200 px-4 py-2 text-[12px] font-extrabold text-rose-600 disabled:opacity-60"
                  >
                    {loadingUserId === member.userId ? "Removing..." : "Remove"}
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-[20px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-5 py-10 text-center text-[14px] font-medium text-[#94a3b8]">
                No assigned members yet.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[28px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between">
            <h3 className="text-[22px] font-extrabold tracking-tight text-[#0f172a]">
              Available Members
            </h3>
            <span className="rounded-full bg-[#f8fafc] px-3 py-1 text-[12px] font-extrabold text-[#475569]">
              {availableMembers.length}
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {availableMembers.length > 0 ? (
              availableMembers.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between gap-4 rounded-[22px] border border-[#eef2f7] bg-[#f8fafc] px-5 py-4"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9f0ff] text-sm font-extrabold text-[#2563eb]">
                      {initials(member.name)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-extrabold text-[#0f172a]">
                        {member.name}
                      </p>
                      <p className="truncate text-[13px] text-[#64748b]">
                        {member.email}
                      </p>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAssign(member.userId)}
                    disabled={loadingUserId === member.userId}
                    className="rounded-full bg-[#2563eb] px-4 py-2 text-[12px] font-extrabold text-white disabled:opacity-60"
                  >
                    {loadingUserId === member.userId ? "Assigning..." : "Assign"}
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-[20px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-5 py-10 text-center text-[14px] font-medium text-[#94a3b8]">
                No available members to assign.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}