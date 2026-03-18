"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  archiveProject,
  deleteProject,
  getProjectById,
  unarchiveProject,
} from "@/features/projects/api";
import {
  createTask,
  deleteTask,
  getTasksByProject,
  updateTask,
  updateTaskStatus,
} from "@/features/tasks/api";
import type { Task } from "@/features/tasks/types";
import type { Project } from "@/features/projects/types";
import TaskCommentsPanel from "@/components/screens/tasks/TaskCommentsPanel";
import EditProjectModal from "./EditProjectModal";
import CreateTaskModal from "./CreateTaskModal";
import ProjectDetailsShell, {
  type ProjectTabKey,
} from "./ProjectDetailsShell";

function badgeClass(status: string) {
  if (status === "DONE") return "bg-emerald-100 text-emerald-700";
  if (status === "IN_PROGRESS") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function nextStatus(status: string) {
  if (status === "TODO") return "IN_PROGRESS";
  if (status === "IN_PROGRESS") return "DONE";
  return "TODO";
}

function actionLabel(status: string) {
  if (status === "TODO") return "Start";
  if (status === "IN_PROGRESS") return "Mark Done";
  return "Reset";
}

function formatDueDate(value?: string | null) {
  if (!value) return "No due date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No due date";
  return date.toLocaleDateString();
}

type TaskColumnProps = {
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  tasks: Task[];
  activeTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onStatusChange: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
};

function TaskColumn({
  title,
  status,
  tasks,
  activeTaskId,
  onSelectTask,
  onStatusChange,
  onDeleteTask,
}: TaskColumnProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-[#f8fafc] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[18px] font-extrabold tracking-tight text-slate-900">
          {title}
        </h3>
        <span className="rounded-full bg-white px-3 py-1 text-[12px] font-extrabold text-slate-500">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => {
            const selected = activeTaskId === task.id;

            return (
              <div
                key={task.id}
                className={`rounded-[22px] border p-4 shadow-sm transition ${
                  selected
                    ? "border-[#2563eb] bg-[#f8fbff]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onSelectTask(task.id)}
                    className="min-w-0 text-left"
                  >
                    <h4 className="truncate text-[16px] font-extrabold text-slate-900">
                      {task.title}
                    </h4>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-slate-500">
                      {task.description || "No description provided."}
                    </p>
                  </button>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-extrabold ${badgeClass(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[12px] font-bold text-slate-500">
                    Due: {formatDueDate(task.dueDate)}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onStatusChange(task)}
                      className="rounded-full bg-[#2563eb] px-3 py-1.5 text-[11px] font-extrabold text-white"
                    >
                      {actionLabel(task.status)}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteTask(task.id)}
                      className="rounded-full border border-rose-200 px-3 py-1.5 text-[11px] font-extrabold text-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-[20px] border border-dashed border-slate-200 bg-white px-4 py-16 text-center text-[14px] font-medium text-slate-400">
            No tasks in this column.
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectOverviewScreen({ id }: { id: string }) {
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<ProjectTabKey>("overview");
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

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

  useEffect(() => {
    async function loadProjectTasks() {
      if (!project) return;

      try {
        setTasksLoading(true);
        const data = await getTasksByProject(project.id);
        setTasks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tasks");
      } finally {
        setTasksLoading(false);
      }
    }

    if (project) {
      loadProjectTasks();
    }
  }, [project]);

  const taskCounts = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((task) => task.status === "TODO").length,
      inProgress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
      done: tasks.filter((task) => task.status === "DONE").length,
    };
  }, [tasks]);

  const todoTasks = useMemo(
    () => tasks.filter((task) => task.status === "TODO"),
    [tasks]
  );
  const inProgressTasks = useMemo(
    () => tasks.filter((task) => task.status === "IN_PROGRESS"),
    [tasks]
  );
  const doneTasks = useMemo(
    () => tasks.filter((task) => task.status === "DONE"),
    [tasks]
  );

  const activeTask = useMemo(
    () => tasks.find((task) => task.id === activeTaskId) || null,
    [tasks, activeTaskId]
  );

  async function handleArchiveToggle() {
    if (!project) return;

    try {
      setBusy(true);
      setError("");

      const updated =
        project.status === "ARCHIVED"
          ? await unarchiveProject(project.id)
          : await archiveProject(project.id);

      setProject(updated);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update project status"
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteProject() {
    if (!project) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setBusy(true);
      setError("");
      await deleteProject(project.id);
      router.push("/projects");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete project"
      );
      setBusy(false);
    }
  }

  async function handleTaskStatusChange(task: Task) {
    try {
      const updated = await updateTaskStatus(task.id, nextStatus(task.status));
      setTasks((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task status");
    }
  }

  async function handleTaskDelete(taskId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      if (activeTaskId === taskId) {
        setActiveTaskId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  }

  if (loading) {
    return (
      <div className="rounded-[28px] border border-[#e6ebf3] bg-white px-6 py-16 text-center text-sm font-semibold text-slate-500 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        Loading project...
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
        {error}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
        Project not found
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error ? (
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      ) : null}

      <ProjectDetailsShell
        project={project}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onArchive={handleArchiveToggle}
        onDelete={handleDeleteProject}
        busy={busy}
      >
        {activeTab === "overview" ? (
          <div className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[14px] font-extrabold uppercase tracking-[0.22em] text-[#91a3c5]">
                  Project Summary
                </p>
                <h2 className="mt-3 text-[40px] font-extrabold tracking-tight text-slate-900 lg:text-[46px]">
                  Overview
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setOpenEdit(true)}
                  className="rounded-full border border-slate-200 px-6 py-3 text-[15px] font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Edit Project
                </button>

                <button
                  onClick={() => setOpenCreateTask(true)}
                  className="rounded-full bg-[#2f66f6] px-6 py-3 text-[15px] font-extrabold text-white shadow-[0_12px_24px_rgba(47,102,246,0.24)] transition hover:scale-[1.01]"
                >
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
                  {taskCounts.total}
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
                  {taskCounts.todo}
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
                  {taskCounts.inProgress}
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
                  {taskCounts.done}
                </p>
                <div className="mt-6 h-2 rounded-full bg-[#e9eff8]">
                  <div className="h-2 w-full rounded-full bg-[#22c55e]" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr]">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6">
                <h3 className="text-[24px] font-extrabold tracking-tight text-slate-900">
                  Recent Tasks
                </h3>

                <div className="mt-6 space-y-4">
                  {tasksLoading ? (
                    <div className="rounded-[20px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-5 py-10 text-center text-[14px] font-medium text-[#94a3b8]">
                      Loading tasks...
                    </div>
                  ) : tasks.length > 0 ? (
                    tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`rounded-[22px] border p-5 transition ${
                          activeTaskId === task.id
                            ? "border-[#2563eb] bg-[#f8fbff]"
                            : "border-[#eef2f7] bg-[#f8fafc]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveTaskId((prev) =>
                                  prev === task.id ? null : task.id
                                )
                              }
                              className="truncate text-left text-[16px] font-extrabold text-[#0f172a]"
                            >
                              {task.title}
                            </button>
                            <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-[#64748b]">
                              {task.description || "No description provided."}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${badgeClass(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="text-[12px] font-bold text-[#64748b]">
                            Due: {formatDueDate(task.dueDate)}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleTaskStatusChange(task)}
                              className="rounded-full bg-[#2563eb] px-3 py-1.5 text-[11px] font-extrabold text-white"
                            >
                              {actionLabel(task.status)}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTaskDelete(task.id)}
                              className="rounded-full border border-rose-200 px-3 py-1.5 text-[11px] font-extrabold text-rose-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[20px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-5 py-10 text-center text-[14px] font-medium text-[#94a3b8]">
                      No tasks yet for this project.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
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
                        {tasks
                          .map((task) => task.dueDate)
                          .filter(Boolean)
                          .sort()[0]
                          ? new Date(
                              tasks
                                .map((task) => task.dueDate)
                                .filter(Boolean)
                                .sort()[0] as string
                            ).toLocaleDateString()
                          : "No due date"}
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
            </div>
          </div>
        ) : activeTab === "board" ? (
          <div className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[14px] font-extrabold uppercase tracking-[0.22em] text-[#91a3c5]">
                  Workflow View
                </p>
                <h2 className="mt-3 text-[40px] font-extrabold tracking-tight text-slate-900 lg:text-[46px]">
                  Board
                </h2>
              </div>

              <button
                onClick={() => setOpenCreateTask(true)}
                className="rounded-full bg-[#2f66f6] px-6 py-3 text-[15px] font-extrabold text-white shadow-[0_12px_24px_rgba(47,102,246,0.24)] transition hover:scale-[1.01]"
              >
                + Add Task
              </button>
            </div>

            {tasksLoading ? (
              <div className="rounded-[20px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-5 py-10 text-center text-[14px] font-medium text-[#94a3b8]">
                Loading tasks...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.8fr]">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                  <TaskColumn
                    title="To Do"
                    status="TODO"
                    tasks={todoTasks}
                    activeTaskId={activeTaskId}
                    onSelectTask={setActiveTaskId}
                    onStatusChange={handleTaskStatusChange}
                    onDeleteTask={handleTaskDelete}
                  />

                  <TaskColumn
                    title="In Progress"
                    status="IN_PROGRESS"
                    tasks={inProgressTasks}
                    activeTaskId={activeTaskId}
                    onSelectTask={setActiveTaskId}
                    onStatusChange={handleTaskStatusChange}
                    onDeleteTask={handleTaskDelete}
                  />

                  <TaskColumn
                    title="Done"
                    status="DONE"
                    tasks={doneTasks}
                    activeTaskId={activeTaskId}
                    onSelectTask={setActiveTaskId}
                    onStatusChange={handleTaskStatusChange}
                    onDeleteTask={handleTaskDelete}
                  />
                </div>

                <div>
                  {activeTask ? (
                    <TaskCommentsPanel taskId={activeTask.id} />
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-[#dbe4f0] bg-white px-5 py-10 text-center text-[14px] font-medium text-[#94a3b8]">
                      Select a task card to view and add comments.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-200 bg-[#f8fbff] px-6 py-20 text-center">
            <h3 className="text-[24px] font-extrabold tracking-tight text-slate-900">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h3>
            <p className="mt-3 text-[15px] font-medium text-slate-500">
              This section will be completed in the next phase.
            </p>
          </div>
        )}
      </ProjectDetailsShell>

      <EditProjectModal
        open={openEdit}
        project={project}
        onClose={() => setOpenEdit(false)}
        onUpdated={(updated) => {
          setProject(updated);
          setOpenEdit(false);
        }}
      />

      <CreateTaskModal
        open={openCreateTask}
        projectId={project.id}
        onClose={() => setOpenCreateTask(false)}
        onCreated={(task) => {
          setTasks((prev) => [task, ...prev]);
          setOpenCreateTask(false);
          setActiveTab("overview");
        }}
      />
    </div>
  );
}