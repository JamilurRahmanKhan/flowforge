"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Mail,
  Plus,
  Search,
  Shield,
  Users,
} from "lucide-react";
import {
  addWorkspaceMember,
  getWorkspaceMembers,
} from "@/features/members/api";
import type {
  AddWorkspaceMemberRequest,
  WorkspaceMember,
} from "@/features/members/types";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString();
}

function initials(name: string) {
  return name
    .trim()
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

function roleTone(role: string) {
  switch (role) {
    case "ORG_OWNER":
      return "bg-violet-100 text-violet-700";
    case "ORG_ADMIN":
      return "bg-blue-100 text-blue-700";
    case "PROJECT_MANAGER":
      return "bg-amber-100 text-amber-700";
    case "MEMBER":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

const ROLE_OPTIONS = ["ORG_ADMIN", "PROJECT_MANAGER", "MEMBER", "VIEWER"];

function StatCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
            {label}
          </p>
          <p className="mt-1 text-[28px] font-extrabold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
      </div>
      <p className="mt-3 text-[13px] leading-6 text-slate-500">{helper}</p>
    </div>
  );
}

export default function MembersScreen() {
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [openCreate, setOpenCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [form, setForm] = useState<AddWorkspaceMemberRequest>({
    email: "",
    role: "MEMBER",
  });

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

  useEffect(() => {
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

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();

    try {
      setCreating(true);
      setCreateError("");
      setCreateSuccess("");

      const created = await addWorkspaceMember({
        email: form.email.trim(),
        role: form.role,
      });

      setMembers((prev) => [created, ...prev]);
      setCreateSuccess(
        `${created.name} was added to the workspace successfully.`
      );
      setForm({
        email: "",
        role: "MEMBER",
      });
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to add workspace member"
      );
      setCreateSuccess("");
    } finally {
      setCreating(false);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[32px] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-700 px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-blue-100/80">
                  Workspace People
                </p>
                <h1 className="mt-3 text-[38px] font-extrabold tracking-tight text-white sm:text-[46px]">
                  Members
                </h1>
                <p className="mt-4 max-w-2xl text-[15px] leading-7 text-blue-50/85">
                  Manage the people inside your workspace, review their roles,
                  and understand how much work is currently assigned across
                  projects and tasks.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCreateError("");
                  setCreateSuccess("");
                  setOpenCreate(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-slate-950 shadow-[0_12px_24px_rgba(15,23,42,0.14)] transition hover:translate-y-[-1px]"
              >
                <Plus className="h-4 w-4" />
                Add Existing User
              </button>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4 sm:p-8">
            <StatCard
              icon={<Users className="h-5 w-5" />}
              label="Total Members"
              value={String(totalMembers)}
              helper="All users currently added to this workspace."
            />
            <StatCard
              icon={<BadgeCheck className="h-5 w-5" />}
              label="Active Users"
              value={String(activeMembers)}
              helper="Members with active accounts ready to work."
            />
            <StatCard
              icon={<BriefcaseBusiness className="h-5 w-5" />}
              label="Project Assignments"
              value={String(totalAssignedProjects)}
              helper="Total project memberships across this workspace."
            />
            <StatCard
              icon={<Shield className="h-5 w-5" />}
              label="Task Assignments"
              value={String(totalAssignedTasks)}
              helper="Total tasks currently assigned to workspace users."
            />
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="grid flex-1 gap-3 lg:grid-cols-[1.5fr_1fr_1fr]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by member name or email..."
                  className="w-full rounded-[18px] border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">All Roles</option>
                <option value="ORG_OWNER">Org Owner</option>
                <option value="ORG_ADMIN">Org Admin</option>
                <option value="PROJECT_MANAGER">Project Manager</option>
                <option value="MEMBER">Member</option>
                <option value="VIEWER">Viewer</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 rounded-[22px] border border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm font-medium text-slate-600">
              Loading workspace members...
            </div>
          ) : error ? (
            <div className="mt-6 rounded-[18px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="mt-6 rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <Users className="mx-auto h-10 w-10 text-slate-400" />
              <h3 className="mt-4 text-[20px] font-extrabold text-slate-950">
                No members found
              </h3>
              <p className="mt-2 text-[14px] text-slate-600">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {filteredMembers.map((member) => (
                <article
                  key={member.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-blue-100 text-[16px] font-extrabold text-blue-700">
                        {initials(member.name)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[18px] font-extrabold text-slate-950">
                          {member.name}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-slate-600">
                          <Mail className="h-3.5 w-3.5" />
                          <span className="truncate">{member.email}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] ${roleTone(
                              member.role
                            )}`}
                          >
                            {member.role}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] ${
                              member.active
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {member.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[360px]">
                      <div className="rounded-[18px] bg-white px-4 py-3">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                          Projects
                        </p>
                        <p className="mt-2 text-[24px] font-extrabold text-slate-950">
                          {member.assignedProjectsCount}
                        </p>
                      </div>

                      <div className="rounded-[18px] bg-white px-4 py-3">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                          Tasks
                        </p>
                        <p className="mt-2 text-[24px] font-extrabold text-slate-950">
                          {member.assignedTasksCount}
                        </p>
                      </div>

                      <div className="rounded-[18px] bg-white px-4 py-3">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                          Added
                        </p>
                        <p className="mt-2 text-[14px] font-bold text-slate-950">
                          {formatDate(member.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {openCreate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-700 px-6 py-6 text-white">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-blue-100/80">
                Workspace Access
              </p>
              <h2 className="mt-2 text-[28px] font-extrabold tracking-tight">
                Add Existing User
              </h2>
              <p className="mt-2 text-[14px] leading-6 text-blue-50/85">
                Add someone who already has a FlowForge account to this
                workspace. They can then be assigned to projects and tasks here.
              </p>
            </div>

            <form onSubmit={handleAddMember} className="space-y-5 p-6">
              <div className="rounded-[18px] border border-blue-100 bg-blue-50 px-4 py-3 text-[13px] leading-6 text-blue-800">
                The user must already have an account in the system. After being
                added, they should log in using their existing email/password
                and this workspace slug.
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  User Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  placeholder="existing-user@example.com"
                  className="w-full rounded-[18px] border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Workspace Role
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full rounded-[18px] border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {createError ? (
                <div className="rounded-[16px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {createError}
                </div>
              ) : null}

              {createSuccess ? (
                <div className="rounded-[16px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {createSuccess}
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenCreate(false)}
                  className="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700"
                >
                  Close
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-full bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(37,99,235,0.22)] disabled:opacity-60"
                >
                  {creating ? "Adding..." : "Add to Workspace"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}