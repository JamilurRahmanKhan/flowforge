"use client";

import TaskCommentsPanel from "@/components/screens/tasks/TaskCommentsPanel";
import type { Task } from "@/features/tasks/types";

export default function ProjectBoardMobile({
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
  const groups = [
    { title: "To Do", items: tasks.filter((t) => t.status === "TODO") },
    { title: "In Progress", items: tasks.filter((t) => t.status === "IN_PROGRESS") },
    { title: "Done", items: tasks.filter((t) => t.status === "DONE") },
  ];

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

        <button
          type="button"
          onClick={onCreateTask}
          className="rounded-full bg-[#2563eb] px-4 py-2 text-[12px] font-extrabold text-white"
        >
          + Add Task
        </button>
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