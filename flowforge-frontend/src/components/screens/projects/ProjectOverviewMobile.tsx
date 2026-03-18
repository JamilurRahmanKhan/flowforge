"use client";

import TaskCommentsPanel from "@/components/screens/tasks/TaskCommentsPanel";
import type { Project } from "@/features/projects/types";
import type { Task } from "@/features/tasks/types";
import type { ProjectMember } from "@/features/project-members/types";

function actionLabel(status: string) {
  if (status === "TODO") return "Start";
  if (status === "IN_PROGRESS") return "Mark Done";
  return "Reset";
}

function assigneeVisual(
  task: Task,
  memberMap: Record<string, ProjectMember>
): { label: string; initials: string; tone: string } {
  if (!task.assigneeId) {
    return {
      label: "Unassigned",
      initials: "U",
      tone: "bg-slate-100 text-slate-600",
    };
  }

  const member = memberMap[task.assigneeId];
  if (!member) {
    return {
      label: "Unknown member",
      initials: "?",
      tone: "bg-amber-100 text-amber-700",
    };
  }

  const initials = member.name
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  return {
    label: member.name,
    initials,
    tone: member.active
      ? "bg-[#e9f0ff] text-[#2563eb]"
      : "bg-slate-100 text-slate-600",
  };
}

export default function ProjectOverviewMobile({
  project,
  tasks,
  memberMap,
  activeTaskId,
  onSelectTask,
  onEdit,
  onCreateTask,
  onStatusChanged,
  onEditTask,
  onDeleteTask,
}: {
  project: Project;
  tasks: Task[];
  memberMap: Record<string, ProjectMember>;
  memberNameMap: Record<string, string>;
  activeTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onEdit: () => void;
  onCreateTask: () => void;
  onStatusChanged: (task: Task) => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}) {
  const todo = tasks.filter((task) => task.status === "TODO").length;
  const inProgress = tasks.filter((task) => task.status === "IN_PROGRESS").length;
  const done = tasks.filter((task) => task.status === "DONE").length;
  const unassigned = tasks.filter((task) => !task.assigneeId).length;

  return (
    <div className="space-y-5">
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

      <div className="rounded-[22px] border border-[#e6ebf3] bg-white p-4">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
          Unassigned Tasks
        </p>
        <p className="mt-2 text-[26px] font-extrabold text-[#0f172a]">{unassigned}</p>
      </div>

      <div className="rounded-[24px] border border-[#e6ebf3] bg-white p-5">
        <h3 className="text-[18px] font-extrabold text-[#0f172a]">Recent Tasks</h3>

        <div className="mt-4 space-y-3">
          {tasks.length > 0 ? (
            tasks.slice(0, 5).map((task) => {
              const assignee = assigneeVisual(task, memberMap);

              return (
                <div
                  key={task.id}
                  className={`rounded-[18px] border p-4 ${
                    activeTaskId === task.id
                      ? "border-[#2563eb] bg-[#f8fbff]"
                      : "border-[#eef2f7] bg-[#f8fafc]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectTask(task.id)}
                    className="block w-full text-left"
                  >
                    <h4 className="text-[15px] font-extrabold text-[#0f172a]">{task.title}</h4>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-[#64748b]">
                      {task.description || "No description provided."}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-extrabold ${assignee.tone}`}
                      >
                        {assignee.initials}
                      </div>
                      <p className="text-[11px] font-bold text-[#64748b]">
                        {assignee.label}
                      </p>
                    </div>
                  </button>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onStatusChanged(task)}
                      className="rounded-full bg-[#2563eb] px-3 py-1.5 text-[11px] font-extrabold text-white"
                    >
                      {actionLabel(task.status)}
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditTask(task)}
                      className="rounded-full border border-[#dbe4f0] px-3 py-1.5 text-[11px] font-extrabold text-[#334155]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTask(task)}
                      className="rounded-full border border-rose-200 px-3 py-1.5 text-[11px] font-extrabold text-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-[20px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-5 py-8 text-center text-[14px] font-medium text-[#94a3b8]">
              No tasks yet for this project.
            </div>
          )}
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

      {activeTaskId ? (
        <TaskCommentsPanel taskId={activeTaskId} />
      ) : (
        <div className="rounded-[24px] border border-dashed border-[#dbe4f0] bg-white px-5 py-10 text-center text-[14px] font-medium text-[#94a3b8]">
          Select a task to view and add comments.
        </div>
      )}
    </div>
  );
}