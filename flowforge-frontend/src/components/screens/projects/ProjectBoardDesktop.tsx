"use client";

import type { Task } from "@/features/tasks/types";

type Props = {
  tasks: Task[];
  onCreateTask: () => void;
  onStatusChanged: () => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
};

function columns(tasks: Task[]) {
  return {
    TODO: tasks.filter((task) => task.status === "TODO"),
    IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS"),
    DONE: tasks.filter((task) => task.status === "DONE"),
  };
}

function badge(status: string) {
  if (status === "DONE") return "bg-emerald-100 text-emerald-700";
  if (status === "IN_PROGRESS") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function BoardColumn({
  title,
  tasks,
  onEditTask,
  onDeleteTask,
}: {
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}) {
  return (
    <div className="rounded-[26px] border border-[#e6ebf3] bg-[#f8fafc] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[16px] font-extrabold tracking-tight text-[#0f172a]">
          {title}
        </h3>
        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-[#475569]">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-[22px] border border-[#e6ebf3] bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="line-clamp-2 text-[15px] font-extrabold text-[#0f172a]">
                  {task.title}
                </h4>
                <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${badge(task.status)}`}>
                  {task.status}
                </span>
              </div>

              <p className="mt-3 line-clamp-3 text-[13px] leading-6 text-[#64748b]">
                {task.description || "No description provided for this task."}
              </p>

              <div className="mt-4 flex items-center gap-2">
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
          <div className="rounded-[20px] border border-dashed border-[#dbe4f0] bg-white px-5 py-8 text-center text-[13px] font-medium text-[#94a3b8]">
            No tasks in this column.
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectBoardDesktop({
  tasks,
  onCreateTask,
  onEditTask,
  onDeleteTask,
}: Props) {
  const grouped = columns(tasks);

  return (
    <div className="hidden lg:block space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
            Workflow View
          </p>
          <h2 className="mt-2 text-[34px] font-extrabold tracking-tight text-[#0f172a]">
            Board
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

      <div className="grid grid-cols-3 gap-5">
        <BoardColumn
          title="To Do"
          tasks={grouped.TODO}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
        <BoardColumn
          title="In Progress"
          tasks={grouped.IN_PROGRESS}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
        <BoardColumn
          title="Done"
          tasks={grouped.DONE}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      </div>
    </div>
  );
}