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
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-8 lg:gap-12 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex-1">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
              Workspace Directory
            </p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950">
              Members
            </h1>
            <p className="mt-3 max-w-md text-sm sm:text-base leading-relaxed text-slate-600">
              View all workspace members, their roles, active status, and current project/task workload.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 sm:px-5 sm:py-6">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Total Members
              </p>
              <p className="mt-3 text-3xl sm:text-4xl font-bold text-slate-950">
                {totalMembers}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 sm:px-5 sm:py-6">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Active
              </p>
              <p className="mt-3 text-3xl sm:text-4xl font-bold text-slate-950">
                {activeMembers}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 sm:px-5 sm:py-6">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Projects
              </p>
              <p className="mt-3 text-3xl sm:text-4xl font-bold text-slate-950">
                {totalAssignedProjects}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 sm:px-5 sm:py-6">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Tasks
              </p>
              <p className="mt-3 text-3xl sm:text-4xl font-bold text-slate-950">
                {totalAssignedTasks}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Roles</option>
            <option value="OWNER">Owner</option>
            <option value="ADMIN">Admin</option>
            <option value="MEMBER">Member</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {loading ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm font-medium text-slate-600">
            Loading members...
          </div>
        ) : error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center text-sm font-medium text-slate-500">
            No members found for the current filters.
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 lg:grid">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Member
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Role
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Status
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Projects
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Tasks
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Joined
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="grid gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                      {initials(member.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-950">
                        {member.name}
                      </p>
                      <p className="truncate text-xs text-slate-600">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-sm font-medium text-slate-700">
                    {member.role}
                  </div>

                  <div className="flex items-center">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        member.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {member.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex items-center text-sm font-medium text-slate-700">
                    {member.assignedProjectsCount}
                  </div>

                  <div className="flex items-center text-sm font-medium text-slate-700">
                    {member.assignedTasksCount}
                  </div>

                  <div className="flex items-center text-sm text-slate-600">
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
