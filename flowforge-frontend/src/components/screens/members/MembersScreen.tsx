"use client";

import { useEffect, useMemo, useState } from "react";
import { getWorkspaceMembers } from "@/features/members/api";
import type { WorkspaceMember } from "@/features/members/types";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString();
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

export default function MembersScreen() {
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function loadMembers() {
      try {
        setLoading(true);
        setError("");
        const data = await getWorkspaceMembers();
        setMembers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load members");
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !normalized ||
        member.name.toLowerCase().includes(normalized) ||
        member.email.toLowerCase().includes(normalized);

      const matchesRole =
        roleFilter === "ALL" || member.role.toUpperCase() === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && member.active) ||
        (statusFilter === "INACTIVE" && !member.active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, search, roleFilter, statusFilter]);

  const totalMembers = members.length;
  const activeMembers = members.filter((member) => member.active).length;
  const totalAssignedProjects = members.reduce(
    (sum, member) => sum + member.assignedProjectsCount,
    0
  );
  const totalAssignedTasks = members.reduce(
    (sum, member) => sum + member.assignedTasksCount,
    0
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
              Workspace Directory
            </p>
            <h2 className="mt-3 text-[40px] font-extrabold tracking-tight text-[#0f172a]">
              Members
            </h2>
            <p className="mt-4 text-[16px] leading-7 text-[#64748b]">
              View all workspace members, their roles, active status, and current project/task workload.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] border border-[#e6ebf3] bg-[#f8fafc] px-5 py-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#94a3b8]">
                Total Members
              </p>
              <p className="mt-2 text-[28px] font-extrabold text-[#0f172a]">
                {totalMembers}
              </p>
            </div>

            <div className="rounded-[24px] border border-[#e6ebf3] bg-[#f8fafc] px-5 py-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#94a3b8]">
                Active
              </p>
              <p className="mt-2 text-[28px] font-extrabold text-[#0f172a]">
                {activeMembers}
              </p>
            </div>

            <div className="rounded-[24px] border border-[#e6ebf3] bg-[#f8fafc] px-5 py-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#94a3b8]">
                Project Assignments
              </p>
              <p className="mt-2 text-[28px] font-extrabold text-[#0f172a]">
                {totalAssignedProjects}
              </p>
            </div>

            <div className="rounded-[24px] border border-[#e6ebf3] bg-[#f8fafc] px-5 py-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#94a3b8]">
                Task Assignments
              </p>
              <p className="mt-2 text-[28px] font-extrabold text-[#0f172a]">
                {totalAssignedTasks}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_0.8fr_0.8fr]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members by name or email..."
            className="rounded-[18px] border border-[#dbe4ef] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563eb]"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-[18px] border border-[#dbe4ef] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563eb]"
          >
            <option value="ALL">All Roles</option>
            <option value="OWNER">OWNER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="MEMBER">MEMBER</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-[18px] border border-[#dbe4ef] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563eb]"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {loading ? (
          <div className="mt-6 rounded-[20px] border border-[#e6ebf3] bg-[#f8fafc] px-5 py-10 text-center text-sm font-medium text-[#64748b]">
            Loading members...
          </div>
        ) : error ? (
          <div className="mt-6 rounded-[20px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
            {error}
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="mt-6 rounded-[20px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-5 py-10 text-center text-sm font-medium text-[#94a3b8]">
            No members found for the current filters.
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-[24px] border border-[#e6ebf3]">
            <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 border-b border-[#edf2f7] bg-[#f8fafc] px-6 py-4 lg:grid">
              <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                Member
              </div>
              <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                Role
              </div>
              <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                Status
              </div>
              <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                Projects
              </div>
              <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                Tasks
              </div>
              <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                Joined
              </div>
            </div>

            <div className="divide-y divide-[#edf2f7]">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="grid gap-4 px-5 py-5 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] lg:px-6"
                >
                  <div className="flex items-center gap-4">
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
                    </div>
                  </div>

                  <div className="flex items-center text-[13px] font-bold text-[#334155]">
                    {member.role}
                  </div>

                  <div className="flex items-center">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${
                        member.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {member.active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>

                  <div className="flex items-center text-[13px] font-bold text-[#334155]">
                    {member.assignedProjectsCount}
                  </div>

                  <div className="flex items-center text-[13px] font-bold text-[#334155]">
                    {member.assignedTasksCount}
                  </div>

                  <div className="flex items-center text-[13px] font-medium text-[#64748b]">
                    {formatDate(member.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}