"use client";

import type { ProjectMember } from "@/features/project-members/types";

export default function ProjectMembersMobile({
  assignedMembers,
  availableMembers,
}: {
  projectId: string;
  assignedMembers: ProjectMember[];
  availableMembers: ProjectMember[];
  onMembersChanged: () => Promise<void>;
}) {
  return (
    <div className="space-y-5 lg:hidden">
      <section className="rounded-[24px] border border-[#e6ebf3] bg-white p-5">
        <h2 className="text-[22px] font-extrabold tracking-tight text-[#0f172a]">
          Assigned Members
        </h2>

        <div className="mt-4 space-y-3">
          {assignedMembers.length > 0 ? (
            assignedMembers.map((member) => (
              <div key={member.userId} className="rounded-[18px] border border-[#eef2f7] bg-[#f8fafc] p-4">
                <p className="text-[15px] font-extrabold text-[#0f172a]">{member.name}</p>
                <p className="mt-1 text-[13px] text-[#64748b]">{member.email}</p>
              </div>
            ))
          ) : (
            <div className="rounded-[18px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-4 py-6 text-center text-[13px] font-medium text-[#94a3b8]">
              No assigned members yet.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[24px] border border-[#e6ebf3] bg-white p-5">
        <h2 className="text-[22px] font-extrabold tracking-tight text-[#0f172a]">
          Available Members
        </h2>

        <div className="mt-4 space-y-3">
          {availableMembers.length > 0 ? (
            availableMembers.map((member) => (
              <div key={member.userId} className="rounded-[18px] border border-[#eef2f7] bg-[#f8fafc] p-4">
                <p className="text-[15px] font-extrabold text-[#0f172a]">{member.name}</p>
                <p className="mt-1 text-[13px] text-[#64748b]">{member.email}</p>
              </div>
            ))
          ) : (
            <div className="rounded-[18px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-4 py-6 text-center text-[13px] font-medium text-[#94a3b8]">
              No available members left.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}