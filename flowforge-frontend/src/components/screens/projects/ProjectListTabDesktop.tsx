"use client";

import TaskCommentsPanel from "@/components/screens/tasks/TaskCommentsPanel";
import type { Task } from "@/features/tasks/types";

export default function ProjectListTabDesktop({
  tasks,
  memberNameMap,
  activeTaskId,
  onSelectTask,
  onCreateTask,
  onStatusChanged,
  onEditTask,
  onDeleteTask,
}: {
  tasks: Task[];
  memberNameMap: Record<string, string>;
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

  function actionLabel(status: string) {
    if (status === "TODO") return "Start";
    if (status === "IN_PROGRESS") return "Mark Done";
    return "Reset";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
            Structured View
          </p>
          <h2 className="mt-2 text-[34px] font-extrabold tracking-tight text-[#0f172a]">
            List
          </h2>
        </div>

        <button
          type="button"
          onClick={onCreateTask}
          className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[13px] font-extrabold text-white"
        >
          + Add Task
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-hidden rounded-[28px] border border-[#e6ebf3] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="overflow-x-auto">
            <div className="min-w-[1120px]">
              <div className="grid grid-cols-[2.2fr_1fr_1fr_1.2fr_1.8fr] gap-4 border-b border-[#edf2f7] bg-[#f8fafc] px-6 py-4">
                <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                  Task
                </div>
                <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                  Status
                </div>
                <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                  Priority
                </div>
                <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                  Assignee
                </div>
                <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                  Actions
                </div>
              </div>

              {sorted.length > 0 ? (
                sorted.map((task) => (
                  <div
                    key={task.id}
                    className={`grid grid-cols-[2.2fr_1fr_1fr_1.2fr_1.8fr] gap-4 border-b border-[#edf2f7] px-6 py-5 last:border-b-0 ${
                      activeTaskId === task.id ? "bg-[#f8fbff]" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onSelectTask(task.id)}
                        className="w-full text-left"
                      >
                        <p className="truncate text-[15px] font-extrabold text-[#0f172a]">
                          {task.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-[13px] leading-6 text-[#64748b]">
                          {task.description || "No description provided."}
                        </p>
                      </button>
                    </div>

                    <div className="text-[13px] font-bold text-[#334155]">{task.status}</div>
                    <div className="text-[13px] font-bold text-[#334155]">
                      {task.priority || "LOW"}
                    </div>
                    <div className="text-[13px] font-bold text-[#334155]">
                      {task.assigneeId
                        ? memberNameMap[task.assigneeId] || "Unknown member"
                        : "Unassigned"}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
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
                <div className="px-6 py-12 text-center text-[14px] font-medium text-[#94a3b8]">
                  No tasks available for this project.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="xl:sticky xl:top-6 xl:self-start">
          {activeTaskId ? (
            <TaskCommentsPanel taskId={activeTaskId} />
          ) : (
            <div className="rounded-[24px] border border-dashed border-[#dbe4f0] bg-white px-5 py-10 text-center text-[14px] font-medium text-[#94a3b8]">
              Select a task to view and add comments.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}