"use client";

import type { ProjectMember } from "@/features/project-members/types";

export default function ProjectMembersDesktop({
  projectId,
  assignedMembers,
  availableMembers,
  onMembersChanged,
}: {
  projectId: string;
  assignedMembers: ProjectMember[];
  availableMembers: ProjectMember[];
  onMembersChanged: () => Promise<void>;
}) {
  return (
    <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
      <section className="rounded-[28px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <h2 className="text-[24px] font-extrabold tracking-tight text-[#0f172a]">
          Assigned Members
        </h2>

        <div className="mt-6 space-y-4">
          {assignedMembers.length > 0 ? (
            assignedMembers.map((member) => (
              <div
                key={member.userId}
                className="rounded-[20px] border border-[#eef2f7] bg-[#f8fafc] px-5 py-4"
              >
                <p className="text-[15px] font-extrabold text-[#0f172a]">{member.name}</p>
                <p className="mt-1 text-[13px] text-[#64748b]">{member.email}</p>
                <p className="mt-2 text-[12px] font-bold text-[#334155]">{member.role}</p>
              </div>
            ))
          ) : (
            <div className="rounded-[20px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-5 py-8 text-center text-[14px] font-medium text-[#94a3b8]">
              No assigned members yet.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <h2 className="text-[24px] font-extrabold tracking-tight text-[#0f172a]">
          Available Members
        </h2>

        <div className="mt-6 space-y-4">
          {availableMembers.length > 0 ? (
            availableMembers.map((member) => (
              <div
                key={member.userId}
                className="rounded-[20px] border border-[#eef2f7] bg-[#f8fafc] px-5 py-4"
              >
                <p className="text-[15px] font-extrabold text-[#0f172a]">{member.name}</p>
                <p className="mt-1 text-[13px] text-[#64748b]">{member.email}</p>
                <p className="mt-2 text-[12px] font-bold text-[#334155]">{member.role}</p>
              </div>
            ))
          ) : (
            <div className="rounded-[20px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-5 py-8 text-center text-[14px] font-medium text-[#94a3b8]">
              No available members left.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}