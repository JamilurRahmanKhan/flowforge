"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, MoreHorizontal, Archive, Plus } from "lucide-react";
import { getProjectById, updateProject, archiveProject } from "@/features/projects/api";
import type { Project } from "@/features/projects/types";

export default function ProjectOverviewScreen({ id }: { id: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [defaultWorkflow, setDefaultWorkflow] = useState("Standard Agile (Kanban)");
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      const data = await getProjectById(id);
      setProject(data);
      setName(data.name);
      setDescription(data.description || "");
      setVisibility(data.visibility);
      setDefaultWorkflow(data.defaultWorkflow);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleSave() {
    if (!project) return;

    try {
      const updated = await updateProject(project.id, {
        name,
        description,
        status: project.status,
        visibility,
        defaultWorkflow,
      });
      setProject(updated);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project");
    }
  }

  async function handleArchive() {
    if (!project) return;

    try {
      const archived = await archiveProject(project.id);
      setProject(archived);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive project");
    }
  }

  if (loading) {
    return <div className="p-6">Loading project...</div>;
  }

  if (error) {
    return <div className="p-6 text-rose-700">{error}</div>;
  }

  if (!project) {
    return <div className="p-6">Project not found.</div>;
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px] bg-[#f8fafc] pb-28 shadow-2xl lg:max-w-5xl lg:shadow-none">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 pb-3 pt-10">
          <div className="flex items-center gap-3">
            <Link
              href="/projects"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {project.name}
              </h1>
              <p className="text-xs font-medium text-slate-400">{project.key}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleArchive}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600"
            >
              <Archive className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="overflow-x-auto">
          <div className="flex min-w-max px-4">
            {["Overview", "Board", "List", "Members", "Activity"].map((item, index) => (
              <div
                key={item}
                className={`relative flex items-center justify-center px-4 py-3.5 ${
                  index === 0 ? "text-[#1f68f9]" : "text-slate-500"
                }`}
              >
                <p className={`text-sm ${index === 0 ? "font-bold" : "font-semibold"}`}>{item}</p>
                {index === 0 ? (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-[#1f68f9]" />
                ) : null}
              </div>
            ))}
          </div>
        </nav>
      </header>

      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Project Completion
          </span>
          <span className="rounded-full bg-[#1f68f9]/10 px-2 py-0.5 text-[11px] font-bold text-[#1f68f9]">
            68%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-[68%] rounded-full bg-[#1f68f9]" />
        </div>
      </div>

      <main className="flex flex-col gap-5 p-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Description</h3>
              <p className="text-[11px] text-slate-500">Project basics</p>
            </div>
            <button
              onClick={() => setEditing((prev) => !prev)}
              className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600"
            >
              {editing ? "Close" : "Edit"}
            </button>
          </div>

          {editing ? (
            <div className="space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-[#1f68f9]"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-[#1f68f9]"
                rows={4}
              />
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-[#1f68f9]"
              >
                <option value="PUBLIC">PUBLIC</option>
                <option value="PRIVATE">PRIVATE</option>
              </select>
              <select
                value={defaultWorkflow}
                onChange={(e) => setDefaultWorkflow(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-[#1f68f9]"
              >
                <option>Standard Agile (Kanban)</option>
                <option>Scrum Sprint Cycle</option>
                <option>Bug Tracking Only</option>
              </select>

              <button
                onClick={handleSave}
                className="rounded-xl bg-[#1f68f9] px-5 py-3 text-sm font-bold text-white"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <p className="text-[14px] leading-relaxed text-slate-600">
              {project.description || "No description added yet."}
            </p>
          )}
        </section>

        <section className="grid grid-cols-2 gap-3">
          {[
            ["Open", "12"],
            ["In Progress", "05"],
            ["In Review", "03"],
            ["Done", "28"],
          ].map(([label, value], idx) => (
            <div
              key={label}
              className={`flex aspect-[1.3/1] flex-col justify-between rounded-2xl border p-4 ${
                idx === 3
                  ? "border-emerald-100 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {label}
              </span>
              <div className="flex items-end justify-between">
                <span
                  className={`text-2xl font-bold ${
                    idx === 1
                      ? "text-[#1f68f9]"
                      : idx === 2
                      ? "text-amber-500"
                      : idx === 3
                      ? "text-emerald-600"
                      : "text-slate-900"
                  }`}
                >
                  {value}
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-slate-900">Recent Tasks</h3>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-full bg-[#1f68f9] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm">
                <Plus className="h-3.5 w-3.5" />
                New Task
              </button>
              <button className="text-xs font-bold text-slate-400">See All</button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {["Design system audit", "Onboarding flow refactor"].map((task, idx) => (
              <div
                key={task}
                className={`flex items-center gap-3 p-4 ${idx === 0 ? "border-b border-slate-100" : ""}`}
              >
                <div className="h-5 w-5 rounded-full border-2 border-[#1f68f9]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{task}</p>
                  <span className="mt-1 inline-block rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-red-600">
                    High Priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}