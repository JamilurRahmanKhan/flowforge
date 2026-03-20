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
  memberMap: Record<string, ProjectMember> = {}
): { label: string; initials: string; tone: string } {
  if (!task.assigneeId) {
    return {
      label: "Unassigned",
      initials: "U",
      tone: "bg-slate-100 text-slate-600",
    };
  }

  const member = memberMap?.[task.assigneeId];

  if (!member) {
    return {
      label: "Unknown member",
      initials: "?",
      tone: "bg-amber-100 text-amber-700",
    };
  }

  const initials =
    member.name
      ?.split(" ")
      .map((part) => part[0]?.toUpperCase())
      .slice(0, 2)
      .join("") || "U";

  return {
    label: member.name,
    initials,
    tone: member.active
      ? "bg-[#e9f0ff] text-[#2563eb]"
      : "bg-slate-100 text-slate-600",
  };
}

export default function ProjectListTabDesktop({
  project,
  tasks,
  memberMap = {},
  activeTaskId,
  onSelectTask,
  onCreateTask,
  onStatusChanged,
  onEditTask,
  onDeleteTask,
}: {
  project: Project;
  tasks: Task[];
  memberMap?: Record<string, ProjectMember>;
  memberNameMap?: Record<string, string>;
  activeTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onCreateTask: () => void;
  onStatusChanged: (task: Task) => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}) {
  const sorted = [...tasks].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  const canCreateTask = !!project?.canCreateTask;
  const canManageProject = !!project?.canManageProject;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Structured View
          </p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">
            List
          </h1>
        </div>

        {canCreateTask ? (
          <button
            type="button"
            onClick={onCreateTask}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            + Add Task
          </button>
        ) : null}
      </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm relative">
          <div className="overflow-x-auto scrollbar-hide scroll-smooth" style={{ scrollBehavior: 'smooth' }}>
            <div className="min-w-[1000px] lg:min-w-[1180px]">
              <div className="grid grid-cols-[1.8fr_0.9fr_0.9fr_1.2fr_1.5fr] lg:grid-cols-[2.1fr_1fr_1fr_1.4fr_1.8fr] gap-3 lg:gap-4 border-b border-slate-200 bg-slate-50 px-4 lg:px-6 py-3 text-xs">
                <div className="font-bold uppercase tracking-wide text-slate-500">
                  Task
                </div>
                <div className="font-bold uppercase tracking-wide text-slate-500">
                  Status
                </div>
                <div className="font-bold uppercase tracking-wide text-slate-500">
                  Priority
                </div>
                <div className="font-bold uppercase tracking-wide text-slate-500">
                  Assignee
                </div>
                <div className="font-bold uppercase tracking-wide text-slate-500">
                  Actions
                </div>
              </div>

              {sorted.length > 0 ? (
                sorted.map((task) => {
                  const assignee = assigneeVisual(task, memberMap);

                  return (
                    <div
                      key={task.id}
                      className={`grid grid-cols-[1.8fr_0.9fr_0.9fr_1.2fr_1.5fr] lg:grid-cols-[2.1fr_1fr_1fr_1.4fr_1.8fr] gap-3 lg:gap-4 border-b border-slate-200 px-4 lg:px-6 py-3 lg:py-4 last:border-b-0 transition text-xs lg:text-sm ${
                        activeTaskId === task.id ? "bg-blue-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onSelectTask(task.id)}
                          className="w-full text-left"
                        >
                          <p className="truncate font-bold text-slate-950">
                            {task.title}
                          </p>
                          <p className="mt-1 line-clamp-1 lg:line-clamp-2 leading-relaxed text-slate-600">
                            {task.description || "No description"}
                          </p>
                        </button>
                      </div>

                      <div className="flex items-center font-medium text-slate-700 whitespace-nowrap">
                        {task.status === "TODO" ? "To Do" : task.status === "IN_PROGRESS" ? "In Progress" : "Done"}
                      </div>

                      <div className="flex items-center font-medium text-slate-700 whitespace-nowrap">
                        {task.priority || "LOW"}
                      </div>

                      <div className="flex items-center min-w-0">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`flex h-6 w-6 lg:h-8 lg:w-8 flex-shrink-0 items-center justify-center rounded-full text-[10px] lg:text-xs font-bold ${assignee.tone}`}
                          >
                            {assignee.initials}
                          </div>
                          <span className="font-medium text-slate-700 truncate hidden lg:inline">
                            {assignee.label}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onStatusChanged(task)}
                          className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 shadow-lg shadow-blue-600/20 whitespace-nowrap"
                        >
                          {actionLabel(task.status)}
                        </button>

                        {canManageProject ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onEditTask(task)}
                              className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 whitespace-nowrap"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteTask(task)}
                              className="rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:border-red-300 whitespace-nowrap"
                            >
                              Delete
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-6 py-12 text-center text-sm font-medium text-slate-500">
                  No tasks available for this project.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          {activeTaskId ? (
            <TaskCommentsPanel taskId={activeTaskId} />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center text-sm font-medium text-slate-500">
              Select a task to view and add comments.
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .overflow-x-auto {
          scroll-behavior: smooth;
        }

        .overflow-x-auto::-webkit-scrollbar {
          height: 6px;
        }

        .overflow-x-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
