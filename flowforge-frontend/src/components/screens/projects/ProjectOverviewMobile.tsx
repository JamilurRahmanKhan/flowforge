"use client";

import type { Project } from "@/features/projects/types";
import type { Task } from "@/features/tasks/types";

export default function ProjectOverviewMobile({
  project,
  tasks,
  onEdit,
  onCreateTask,
}: {
  project: Project;
  tasks: Task[];
  onEdit: () => void;
  onCreateTask: () => void;
}) {
  const todo = tasks.filter((task) => task.status === "TODO").length;
  const inProgress = tasks.filter((task) => task.status === "IN_PROGRESS").length;
  const done = tasks.filter((task) => task.status === "DONE").length;

  return (
    <div className="space-y-5 lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
            Project Summary
          </p>
          <h2 className="mt-2 text-[28px] font-extrabold tracking-tight text-[#0f172a]">
            Overview
          </h2>
        </div>

        <button
          type="button"
          onClick={onCreateTask}
          className="rounded-full bg-[#2563eb] px-4 py-2 text-[12px] font-extrabold text-white"
        >
          + Add Task
        </button>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="w-full rounded-[18px] border border-[#dbe4f0] px-4 py-3 text-[13px] font-extrabold text-[#334155]"
      >
        Edit Project
      </button>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[22px] border border-[#e6ebf3] bg-white p-4">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
            Total
          </p>
          <p className="mt-2 text-[26px] font-extrabold text-[#0f172a]">{tasks.length}</p>
        </div>
        <div className="rounded-[22px] border border-[#e6ebf3] bg-white p-4">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
            To Do
          </p>
          <p className="mt-2 text-[26px] font-extrabold text-[#0f172a]">{todo}</p>
        </div>
        <div className="rounded-[22px] border border-[#e6ebf3] bg-white p-4">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
            In Progress
          </p>
          <p className="mt-2 text-[26px] font-extrabold text-[#0f172a]">{inProgress}</p>
        </div>
        <div className="rounded-[22px] border border-[#e6ebf3] bg-white p-4">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
            Done
          </p>
          <p className="mt-2 text-[26px] font-extrabold text-[#0f172a]">{done}</p>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#e6ebf3] bg-white p-5">
        <h3 className="text-[18px] font-extrabold text-[#0f172a]">Project Info</h3>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
              Key
            </p>
            <p className="mt-1 text-[15px] font-bold text-[#0f172a]">{project.key}</p>
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
              Visibility
            </p>
            <p className="mt-1 text-[15px] font-bold text-[#0f172a]">
              {project.visibility || "PRIVATE"}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
              Workflow
            </p>
            <p className="mt-1 text-[15px] font-bold text-[#0f172a]">
              {project.defaultWorkflow || "KANBAN"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}