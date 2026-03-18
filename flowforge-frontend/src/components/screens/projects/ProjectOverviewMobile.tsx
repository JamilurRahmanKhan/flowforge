"use client";

import TaskCommentsPanel from "@/components/screens/tasks/TaskCommentsPanel";
import type { Project } from "@/features/projects/types";
import type { Task } from "@/features/tasks/types";

function actionLabel(status: string) {
  if (status === "TODO") return "Start";
  if (status === "IN_PROGRESS") return "Mark Done";
  return "Reset";
}

export default function ProjectOverviewMobile({
  project,
  tasks,
  memberNameMap,
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

      <div className="rounded-[24px] border border-[#e6ebf3] bg-white p-5">
        <h3 className="text-[18px] font-extrabold text-[#0f172a]">Recent Tasks</h3>

        <div className="mt-4 space-y-3">
          {tasks.length > 0 ? (
            tasks.slice(0, 5).map((task) => (
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
                  <p className="mt-3 text-[11px] font-bold text-[#64748b]">
                    Assignee:{" "}
                    {task.assigneeId
                      ? memberNameMap[task.assigneeId] || "Unknown member"
                      : "Unassigned"}
                  </p>
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
            ))
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