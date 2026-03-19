"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  archiveProject,
  deleteProject,
  getProjectById,
  unarchiveProject,
} from "@/features/projects/api";
import type { Project } from "@/features/projects/types";
import { getTasksByProject, updateTaskStatus } from "@/features/tasks/api";
import type { Task } from "@/features/tasks/types";
import type { ProjectMember } from "@/features/project-members/types";
import {
  getAssignedProjectMembers,
  getAvailableProjectMembers,
} from "@/features/project-members/api";
import { getProjectActivity } from "@/features/activity/api";
import type { ActivityItem } from "@/features/activity/types";

import ProjectDetailsShell from "./ProjectDetailsShell";
import ProjectOverviewDesktop from "./ProjectOverviewDesktop";
import ProjectOverviewMobile from "./ProjectOverviewMobile";
import ProjectBoardDesktop from "./ProjectBoardDesktop";
import ProjectBoardMobile from "./ProjectBoardMobile";
import ProjectListTabDesktop from "./ProjectListTabDesktop";
import ProjectListTabMobile from "./ProjectListTabMobile";
import ProjectMembersDesktop from "./ProjectMembersDesktop";
import ProjectMembersMobile from "./ProjectMembersMobile";
import EditProjectModal from "./EditProjectModal";
import ArchiveProjectModal from "./ArchiveProjectModal";
import DeleteProjectModal from "./DeleteProjectModal";
import CreateTaskModal from "./CreateTaskModal";
import EditTaskModal from "./EditTaskModal";
import DeleteTaskModal from "./DeleteTaskModal";
import ProjectToasts, { type ProjectToast } from "./ProjectToasts";
import ProjectActivityDesktop from "./ProjectActivityDesktop";
import ProjectActivityMobile from "./ProjectActivityMobile";

type TabKey = "overview" | "board" | "list" | "members" | "activity";

function nextStatus(status: string) {
  if (status === "TODO") return "IN_PROGRESS";
  if (status === "IN_PROGRESS") return "DONE";
  return "TODO";
}

function humanizeTaskStatusError(message: string, task: Task) {
  const normalized = (message || "").toLowerCase();

  if (
    normalized.includes("permission") ||
    normalized.includes("forbidden") ||
    normalized.includes("not allowed") ||
    normalized.includes("cannot change") ||
    normalized.includes("not authorized")
  ) {
    return `You cannot change the status of "${task.title}" because it is assigned to another member or you do not have permission.`;
  }

  if (normalized === "request failed") {
    return `You could not update "${task.title}". Please try again or check your access rights.`;
  }

  return message || `You could not update "${task.title}".`;
}

export default function ProjectDetailsScreen({ id }: { id: string }) {
  const router = useRouter();
  const toastIdRef = useRef(1);

  const [isDesktop, setIsDesktop] = useState(false);

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignedMembers, setAssignedMembers] = useState<ProjectMember[]>([]);
  const [availableMembers, setAvailableMembers] = useState<ProjectMember[]>([]);
  const [projectActivity, setProjectActivity] = useState<ActivityItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);

  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const [archiveLoading, setArchiveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toasts, setToasts] = useState<ProjectToast[]>([]);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const memberNameMap = useMemo(() => {
    const map: Record<string, string> = {};

    for (const member of assignedMembers) {
      map[member.userId] = member.name;
    }

    for (const member of availableMembers) {
      map[member.userId] = member.name;
    }

    return map;
  }, [assignedMembers, availableMembers]);

  const memberMap = useMemo(() => {
    const map: Record<string, ProjectMember> = {};

    for (const member of assignedMembers) {
      map[member.userId] = member;
    }

    for (const member of availableMembers) {
      map[member.userId] = member;
    }

    return map;
  }, [assignedMembers, availableMembers]);

  function pushToast(toast: Omit<ProjectToast, "id">) {
    const nextId = toastIdRef.current++;
    setToasts((prev) => [...prev, { ...toast, id: nextId }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== nextId));
    }, 3500);
  }

  function removeToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  async function loadTasksOnly(projectId: string) {
    const taskData = await getTasksByProject(projectId);
    setTasks(taskData);
  }

  async function loadProjectActivityOnly(projectId: string) {
    try {
      setActivityLoading(true);
      const data = await getProjectActivity(projectId, 25);
      setProjectActivity(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load activity";

      pushToast({
        type: "error",
        title: "Failed to load activity",
        description: message,
      });
    } finally {
      setActivityLoading(false);
    }
  }

  async function loadMembersOnly() {
    if (!project) return;

    try {
      setMembersLoading(true);

      const [assigned, available] = await Promise.all([
        getAssignedProjectMembers(project.id).catch(
          () => [] as ProjectMember[]
        ),
        getAvailableProjectMembers(project.id).catch(
          () => [] as ProjectMember[]
        ),
      ]);

      setAssignedMembers(assigned);
      setAvailableMembers(available);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load members";

      setAssignedMembers([]);
      setAvailableMembers([]);

      pushToast({
        type: "error",
        title: "Failed to load members",
        description: message,
      });
    } finally {
      setMembersLoading(false);
    }
  }

  async function refreshProjectTasks() {
    if (!project) return;
    await loadTasksOnly(project.id);
  }

  async function loadProjectDetails() {
    try {
      setLoading(true);
      setError("");

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("flowforge_token")
          : null;

      if (!token) {
        router.replace("/login");
        return;
      }

      const projectData = await getProjectById(id);
      setProject(projectData);

      try {
        const [taskData, assigned, available, activityData] = await Promise.all([
          getTasksByProject(id),
          getAssignedProjectMembers(id).catch(() => [] as ProjectMember[]),
          getAvailableProjectMembers(id).catch(() => [] as ProjectMember[]),
          getProjectActivity(id, 25).catch(() => [] as ActivityItem[]),
        ]);

        setTasks(taskData);
        setAssignedMembers(assigned);
        setAvailableMembers(available);
        setProjectActivity(activityData);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load project data";

        if (message === "UNAUTHORIZED") {
          localStorage.removeItem("flowforge_token");
          router.replace("/login");
          return;
        }

        pushToast({
          type: "error",
          title: "Partial load issue",
          description: message,
        });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load project";

      if (message === "UNAUTHORIZED") {
        localStorage.removeItem("flowforge_token");
        router.replace("/login");
        return;
      }

      setError(message);
      pushToast({
        type: "error",
        title: "Failed to load project",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjectDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (activeTab === "members" && project) {
      loadMembersOnly();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, project?.id]);

  async function handleArchiveConfirm() {
    if (!project) return;

    try {
      setArchiveLoading(true);
      const updated = await archiveProject(project.id);
      setProject(updated);
      setOpenArchive(false);
      await loadProjectActivityOnly(updated.id);

      pushToast({
        type: "success",
        title: "Project archived",
        description: `${updated.name} was moved to archived projects.`,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to archive project";

      setError(message);
      setOpenArchive(false);

      pushToast({
        type: "error",
        title: "Archive failed",
        description: message,
      });
    } finally {
      setArchiveLoading(false);
    }
  }

  async function handleUnarchive() {
    if (!project) return;

    try {
      const updated = await unarchiveProject(project.id);
      setProject(updated);
      await loadProjectActivityOnly(updated.id);

      pushToast({
        type: "success",
        title: "Project restored",
        description: `${updated.name} is active again.`,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to restore project";

      pushToast({
        type: "error",
        title: "Restore failed",
        description: message,
      });
    }
  }

  async function handleDeleteConfirm() {
    if (!project) return;

    try {
      setDeleteLoading(true);
      await deleteProject(project.id);
      router.push("/projects");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete project";

      setOpenDelete(false);

      pushToast({
        type: "error",
        title: "Delete failed",
        description: message,
      });
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleTaskStatusChange(task: Task) {
    try {
      const updated = await updateTaskStatus(task.id, nextStatus(task.status));

      setTasks((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );

      if (project) {
        await loadProjectActivityOnly(project.id);
      }

      pushToast({
        type: "success",
        title: "Task updated",
        description: `${updated.title} moved to ${updated.status}.`,
      });
    } catch (err) {
      const rawMessage =
        err instanceof Error ? err.message : "Failed to update task status";

      pushToast({
        type: "error",
        title: "You cannot update this task",
        description: humanizeTaskStatusError(rawMessage, task),
      });
    }
  }

  if (loading) {
    return (
      <div className="rounded-[28px] border border-[#e6ebf3] bg-white px-6 py-14 text-center text-[#64748b] shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        Loading project...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
        {error || "Project not found"}
      </div>
    );
  }

  let content: React.ReactNode;

  if (activeTab === "overview") {
    content = isDesktop ? (
      <ProjectOverviewDesktop
        project={project}
        tasks={tasks}
        memberMap={memberMap}
        memberNameMap={memberNameMap}
        activeTaskId={activeTaskId}
        onSelectTask={setActiveTaskId}
        onEdit={() => setOpenEdit(true)}
        onCreateTask={() => setOpenCreateTask(true)}
        onStatusChanged={handleTaskStatusChange}
        onEditTask={setEditingTask}
        onDeleteTask={setDeletingTask}
      />
    ) : (
      <ProjectOverviewMobile
        project={project}
        tasks={tasks}
        memberMap={memberMap}
        memberNameMap={memberNameMap}
        activeTaskId={activeTaskId}
        onSelectTask={setActiveTaskId}
        onEdit={() => setOpenEdit(true)}
        onCreateTask={() => setOpenCreateTask(true)}
        onStatusChanged={handleTaskStatusChange}
        onEditTask={setEditingTask}
        onDeleteTask={setDeletingTask}
      />
    );
  } else if (activeTab === "board") {
    content = isDesktop ? (
      <ProjectBoardDesktop
        project={project}
        tasks={tasks}
        memberMap={memberMap}
        memberNameMap={memberNameMap}
        activeTaskId={activeTaskId}
        onSelectTask={setActiveTaskId}
        onCreateTask={() => setOpenCreateTask(true)}
        onStatusChanged={handleTaskStatusChange}
        onEditTask={setEditingTask}
        onDeleteTask={setDeletingTask}
      />
    ) : (
      <ProjectBoardMobile
        project={project}
        tasks={tasks}
        memberMap={memberMap}
        memberNameMap={memberNameMap}
        activeTaskId={activeTaskId}
        onSelectTask={setActiveTaskId}
        onCreateTask={() => setOpenCreateTask(true)}
        onStatusChanged={handleTaskStatusChange}
        onEditTask={setEditingTask}
        onDeleteTask={setDeletingTask}
      />
    );
  } else if (activeTab === "list") {
    content = isDesktop ? (
      <ProjectListTabDesktop
        project={project}
        tasks={tasks}
        memberMap={memberMap}
        memberNameMap={memberNameMap}
        activeTaskId={activeTaskId}
        onSelectTask={setActiveTaskId}
        onCreateTask={() => setOpenCreateTask(true)}
        onStatusChanged={handleTaskStatusChange}
        onEditTask={setEditingTask}
        onDeleteTask={setDeletingTask}
      />
    ) : (
      <ProjectListTabMobile
        project={project}
        tasks={tasks}
        memberMap={memberMap}
        memberNameMap={memberNameMap}
        activeTaskId={activeTaskId}
        onSelectTask={setActiveTaskId}
        onCreateTask={() => setOpenCreateTask(true)}
        onStatusChanged={handleTaskStatusChange}
        onEditTask={setEditingTask}
        onDeleteTask={setDeletingTask}
      />
    );
  } else if (activeTab === "members") {
    content = membersLoading ? (
      <div className="rounded-[24px] border border-[#e6ebf3] bg-white px-6 py-10 text-center text-[#64748b] shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        Loading members...
      </div>
    ) : isDesktop ? (
      <ProjectMembersDesktop
        projectId={project.id}
        assignedMembers={assignedMembers}
        availableMembers={availableMembers}
        onMembersChanged={async () => {
          await loadMembersOnly();
          await loadProjectActivityOnly(project.id);
        }}
      />
    ) : (
      <ProjectMembersMobile
        projectId={project.id}
        assignedMembers={assignedMembers}
        availableMembers={availableMembers}
        onMembersChanged={async () => {
          await loadMembersOnly();
          await loadProjectActivityOnly(project.id);
        }}
      />
    );
  } else {
    content = isDesktop ? (
      <ProjectActivityDesktop
        activities={projectActivity}
        loading={activityLoading}
      />
    ) : (
      <ProjectActivityMobile
        activities={projectActivity}
        loading={activityLoading}
      />
    );
  }

  return (
    <>
      <ProjectDetailsShell
        project={project}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onArchive={() => {
          if ((project.status || "").toUpperCase() === "ARCHIVED") {
            handleUnarchive();
          } else {
            setOpenArchive(true);
          }
        }}
        onDelete={() => setOpenDelete(true)}
      >
        {content}
      </ProjectDetailsShell>

      <EditProjectModal
        open={openEdit}
        project={project}
        onClose={() => setOpenEdit(false)}
        onUpdated={async (updatedProject) => {
          setProject(updatedProject);
          await loadProjectActivityOnly(updatedProject.id);

          pushToast({
            type: "success",
            title: "Project updated",
            description: `${updatedProject.name} was updated successfully.`,
          });
        }}
        onError={(message) => {
          pushToast({
            type: "error",
            title: "Update failed",
            description: message,
          });
        }}
      />

      <ArchiveProjectModal
        open={openArchive}
        projectName={project.name}
        loading={archiveLoading}
        onClose={() => setOpenArchive(false)}
        onConfirm={handleArchiveConfirm}
      />

      <DeleteProjectModal
        open={openDelete}
        projectName={project.name}
        loading={deleteLoading}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDeleteConfirm}
      />

      <CreateTaskModal
        open={openCreateTask}
        projectId={project.id}
        members={assignedMembers}
        onClose={() => setOpenCreateTask(false)}
        onCreated={async (createdTask) => {
          await Promise.all([
            loadTasksOnly(project.id),
            loadProjectActivityOnly(project.id),
          ]);

          setActiveTaskId(createdTask.id);

          pushToast({
            type: "success",
            title: "Task created",
            description: "The new task was added to this project.",
          });
        }}
        onError={(message) => {
          pushToast({
            type: "error",
            title: "Task creation failed",
            description: message,
          });
        }}
      />

      <EditTaskModal
        open={!!editingTask}
        task={editingTask}
        members={assignedMembers}
        onClose={() => setEditingTask(null)}
        onUpdated={async () => {
          await Promise.all([
            refreshProjectTasks(),
            loadProjectActivityOnly(project.id),
          ]);
        }}
      />

      <DeleteTaskModal
        open={!!deletingTask}
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onDeleted={async () => {
          const deletedTaskId = deletingTask?.id ?? null;

          await Promise.all([
            refreshProjectTasks(),
            loadProjectActivityOnly(project.id),
          ]);

          if (deletedTaskId && activeTaskId === deletedTaskId) {
            setActiveTaskId(null);
          }
        }}
      />

      <ProjectToasts toasts={toasts} onRemove={removeToast} />
    </>
  );
}