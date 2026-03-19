"use client";

import TaskCommentsPanel from "@/components/screens/tasks/TaskCommentsPanel";
import type { Project } from "@/features/projects/types";
import type { Task } from "@/features/tasks/types";
import type { ProjectMember } from "@/features/project-members/types";

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

export default function ProjectBoardMobile({
  project,
  tasks,
  memberMap,
  activeTaskId,
  onSelectTask,
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
  onCreateTask: () => void;
  onStatusChanged: (task: Task) => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}) {
  const groups = [
    { title: "To Do", items: tasks.filter((t) => t.status === "TODO") },
    { title: "In Progress", items: tasks.filter((t) => t.status === "IN_PROGRESS") },
    { title: "Done", items: tasks.filter((t) => t.status === "DONE") },
  ];

  const canCreateTask = !!project?.canCreateTask;
  const canManageProject = !!project?.canManageProject;

  function actionLabel(status: string) {
    if (status === "TODO") return "Start";
    if (status === "IN_PROGRESS") return "Mark Done";
    return "Reset";
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
            Workflow View
          </p>
          <h2 className="mt-2 text-[28px] font-extrabold tracking-tight text-[#0f172a]">
            Board
          </h2>
        </div>

        {canCreateTask ? (
          <button
            type="button"
            onClick={onCreateTask}
            className="rounded-full bg-[#2563eb] px-4 py-2 text-[12px] font-extrabold text-white"
          >
            + Add Task
          </button>
        ) : null}
      </div>

      {groups.map((group) => (
        <div
          key={group.title}
          className="rounded-[24px] border border-[#e6ebf3] bg-white p-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[16px] font-extrabold text-[#0f172a]">{group.title}</h3>
            <span className="rounded-full bg-[#f8fafc] px-3 py-1 text-[11px] font-extrabold text-[#475569]">
              {group.items.length}
            </span>
          </div>

          <div className="space-y-3">
            {group.items.length > 0 ? (
              group.items.map((task) => {
                const selected = activeTaskId === task.id;
                const assignee = assigneeVisual(task, memberMap);

                return (
                  <div
                    key={task.id}
                    className={`rounded-[18px] border p-4 ${
                      selected
                        ? "border-[#2563eb] bg-[#f8fbff]"
                        : "border-[#eef2f7] bg-[#f8fafc]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectTask(task.id)}
                      className="block w-full text-left"
                    >
                      <h4 className="text-[15px] font-extrabold text-[#0f172a]">
                        {task.title}
                      </h4>
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

                      {canManageProject ? (
                        <>
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
                        </>
                      ) : null}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-[18px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-4 py-6 text-center text-[13px] font-medium text-[#94a3b8]">
                No tasks here.
              </div>
            )}
          </div>
        </div>
      ))}

      {activeTaskId ? (
        <TaskCommentsPanel taskId={activeTaskId} />
      ) : (
        <div className="rounded-[24px] border border-dashed border-[#dbe4f0] bg-white px-5 py-10 text-center text-[14px] font-medium text-[#94a3b8]">
          Select a task card to view and add comments.
        </div>
      )}
    </div>
  );
}