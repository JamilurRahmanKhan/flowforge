"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProjectById } from "@/features/projects/api";
import type { Project } from "@/features/projects/types";

export default function ProjectOverviewScreen({ id }: { id: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getProjectById(id);
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        Loading project...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="max-w-md rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {error || "Project not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[34px] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between border-b border-slate-200 px-8 py-7">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[34px] font-extrabold tracking-tight text-slate-900">
              {project.name}
            </h1>
            <span className="rounded-full bg-[#dff3e7] px-4 py-1 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#15924f]">
              {project.status}
            </span>
          </div>

          <p className="mt-3 text-[20px] font-semibold text-slate-400">
            {project.key}
          </p>

          {project.description ? (
            <p className="mt-4 max-w-3xl text-[18px] font-medium text-slate-500">
              {project.description}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            className="rounded-full border border-slate-200 px-6 py-3 text-[15px] font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Back
          </Link>
          <button className="rounded-full border border-slate-200 px-6 py-3 text-[15px] font-bold text-slate-600 transition hover:bg-slate-50">
            Archive
          </button>
          <button className="rounded-full border border-rose-200 px-6 py-3 text-[15px] font-bold text-rose-600 transition hover:bg-rose-50">
            Delete
          </button>
        </div>
      </div>

      <div className="border-b border-slate-200 px-8">
        <div className="flex items-center gap-8">
          {["Overview", "Board", "List", "Members", "Activity"].map((item, index) => (
            <button
              key={item}
              className={`border-b-2 px-0 py-5 text-[16px] font-bold transition ${
                index === 0
                  ? "border-[#2f66f6] text-[#2f66f6]"
                  : "border-transparent text-slate-500"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[14px] font-extrabold uppercase tracking-[0.22em] text-[#91a3c5]">
              Project Summary
            </p>
            <h2 className="mt-3 text-[46px] font-extrabold tracking-tight text-slate-900">
              Overview
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-full border border-slate-200 px-6 py-3 text-[15px] font-bold text-slate-600 transition hover:bg-slate-50">
              Edit Project
            </button>
            <button className="rounded-full bg-[#2f66f6] px-6 py-3 text-[15px] font-extrabold text-white shadow-[0_12px_24px_rgba(47,102,246,0.24)] transition hover:scale-[1.01]">
              + Add Task
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <p className="text-[14px] font-extrabold uppercase tracking-[0.2em] text-[#91a3c5]">
              Total Tasks
            </p>
            <p className="mt-5 text-[56px] font-extrabold tracking-tight text-slate-900">
              0
            </p>
            <div className="mt-6 h-2 rounded-full bg-[#e9eff8]">
              <div className="h-2 w-full rounded-full bg-[#2f66f6]" />
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <p className="text-[14px] font-extrabold uppercase tracking-[0.2em] text-[#91a3c5]">
              To Do
            </p>
            <p className="mt-5 text-[56px] font-extrabold tracking-tight text-slate-900">
              0
            </p>
            <div className="mt-6 h-2 rounded-full bg-[#e9eff8]">
              <div className="h-2 w-full rounded-full bg-slate-400" />
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <p className="text-[14px] font-extrabold uppercase tracking-[0.2em] text-[#91a3c5]">
              In Progress
            </p>
            <p className="mt-5 text-[56px] font-extrabold tracking-tight text-slate-900">
              0
            </p>
            <div className="mt-6 h-2 rounded-full bg-[#e9eff8]">
              <div className="h-2 w-full rounded-full bg-[#f59e0b]" />
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <p className="text-[14px] font-extrabold uppercase tracking-[0.2em] text-[#91a3c5]">
              Done
            </p>
            <p className="mt-5 text-[56px] font-extrabold tracking-tight text-slate-900">
              0
            </p>
            <div className="mt-6 h-2 rounded-full bg-[#e9eff8]">
              <div className="h-2 w-full rounded-full bg-[#22c55e]" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-[24px] font-extrabold tracking-tight text-slate-900">
              Recent Tasks
            </h3>

            <div className="mt-8 flex min-h-[220px] items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-[#f8fbff] text-[18px] font-semibold text-slate-400">
              No tasks yet for this project.
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-[24px] font-extrabold tracking-tight text-slate-900">
              Project Info
            </h3>

            <div className="mt-8 space-y-7">
              <div>
                <p className="text-[14px] font-extrabold uppercase tracking-[0.2em] text-[#91a3c5]">
                  Project Key
                </p>
                <p className="mt-2 text-[18px] font-bold text-slate-900">
                  {project.key}
                </p>
              </div>

              <div>
                <p className="text-[14px] font-extrabold uppercase tracking-[0.2em] text-[#91a3c5]">
                  Visibility
                </p>
                <p className="mt-2 text-[18px] font-bold uppercase text-slate-900">
                  {project.visibility}
                </p>
              </div>

              <div>
                <p className="text-[14px] font-extrabold uppercase tracking-[0.2em] text-[#91a3c5]">
                  Default Workflow
                </p>
                <p className="mt-2 text-[18px] font-bold text-slate-900">
                  {project.defaultWorkflow}
                </p>
              </div>

              <div>
                <p className="text-[14px] font-extrabold uppercase tracking-[0.2em] text-[#91a3c5]">
                  Next Due Date
                </p>
                <p className="mt-2 text-[18px] font-bold text-slate-900">
                  No due date
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}