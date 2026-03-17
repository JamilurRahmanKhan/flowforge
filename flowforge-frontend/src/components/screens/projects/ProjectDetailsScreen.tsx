"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  archiveProject,
  deleteProject,
  getProjectById,
  unarchiveProject,
} from "@/features/projects/api";
import type { Project } from "@/features/projects/types";
import { getTasksByProject } from "@/features/tasks/api";
import type { Task } from "@/features/tasks/types";
import type { ProjectMember } from "@/features/project-members/types";
import {
  getAssignedProjectMembers,
  getAvailableProjectMembers,
} from "@/features/project-members/api";

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
import { buildProjectActivity } from "@/features/activity/utils";
import ProjectActivityDesktop from "./ProjectActivityDesktop";
import ProjectActivityMobile from "./ProjectActivityMobile";

type TabKey = "overview" | "board" | "list" | "members" | "activity";

export default function ProjectDetailsScreen({ id }: { id: string }) {
  const router = useRouter();
  const toastIdRef = useRef(1);

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignedMembers, setAssignedMembers] = useState<ProjectMember[]>([]);
  const [availableMembers, setAvailableMembers] = useState<ProjectMember[]>([]);

  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersLoaded, setMembersLoaded] = useState(false);
  const [membersAttempted, setMembersAttempted] = useState(false);

  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const [openEdit, setOpenEdit] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const [archiveLoading, setArchiveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toasts, setToasts] = useState<ProjectToast[]>([]);

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

  async function refreshProjectTasks() {
    if (!project) return;
    await loadTasksOnly(project.id);
  }

  async function loadMembersOnly() {
    if (!project) return;

    try {
      setMembersLoading(true);
      setMembersAttempted(true);

      const [assigned, available] = await Promise.all([
        getAssignedProjectMembers(project.id),
        getAvailableProjectMembers(project.id),
      ]);

      setAssignedMembers(assigned);
      setAvailableMembers(available);
      setMembersLoaded(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load members";

      setAssignedMembers([]);
      setAvailableMembers([]);
      setMembersLoaded(false);

      pushToast({
        type: "error",
        title: "Failed to load members",
        description: message,
      });
    } finally {
      setMembersLoading(false);
    }
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
        const taskData = await getTasksByProject(id);
        setTasks(taskData);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load tasks";

        if (message === "UNAUTHORIZED") {
          localStorage.removeItem("flowforge_token");
          router.replace("/login");
          return;
        }

        setTasks([]);
        pushToast({
          type: "error",
          title: "Failed to load tasks",
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
  }, [id]);

  useEffect(() => {
    if (
      activeTab === "members" &&
      project &&
      !membersLoaded &&
      !membersLoading &&
      !membersAttempted
    ) {
      loadMembersOnly();
    }
  }, [activeTab, project, membersLoaded, membersLoading, membersAttempted]);

  async function handleArchiveConfirm() {
    if (!project) return;

    try {
      setArchiveLoading(true);
      const updated = await archiveProject(project.id);
      setProject(updated);
      setOpenArchive(false);

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

  const activities = buildProjectActivity(project, tasks);

  let content: React.ReactNode;

  if (activeTab === "overview") {
    content = (
      <>
        <ProjectOverviewMobile
          project={project}
          tasks={tasks}
          onEdit={() => setOpenEdit(true)}
          onCreateTask={() => setOpenCreateTask(true)}
        />
        <ProjectOverviewDesktop
          project={project}
          tasks={tasks}
          onEdit={() => setOpenEdit(true)}
          onCreateTask={() => setOpenCreateTask(true)}
        />
      </>
    );
  } else if (activeTab === "board") {
    content = (
      <>
        <ProjectBoardMobile
          tasks={tasks}
          onCreateTask={() => setOpenCreateTask(true)}
          onStatusChanged={refreshProjectTasks}
          onEditTask={setEditingTask}
          onDeleteTask={setDeletingTask}
        />
        <ProjectBoardDesktop
          tasks={tasks}
          onCreateTask={() => setOpenCreateTask(true)}
          onStatusChanged={refreshProjectTasks}
          onEditTask={setEditingTask}
          onDeleteTask={setDeletingTask}
        />
      </>
    );
  } else if (activeTab === "list") {
    content = (
      <>
        <ProjectListTabMobile
          tasks={tasks}
          onCreateTask={() => setOpenCreateTask(true)}
          onStatusChanged={refreshProjectTasks}
          onEditTask={setEditingTask}
          onDeleteTask={setDeletingTask}
        />
        <ProjectListTabDesktop
          tasks={tasks}
          onCreateTask={() => setOpenCreateTask(true)}
          onStatusChanged={refreshProjectTasks}
          onEditTask={setEditingTask}
          onDeleteTask={setDeletingTask}
        />
      </>
    );
  } else if (activeTab === "members") {
    content = membersLoading ? (
      <div className="rounded-[24px] border border-[#e6ebf3] bg-white px-6 py-10 text-center text-[#64748b] shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        Loading members...
      </div>
    ) : (
      <>
        <ProjectMembersMobile
          projectId={project.id}
          assignedMembers={assignedMembers}
          availableMembers={availableMembers}
          onMembersChanged={loadMembersOnly}
        />
        <ProjectMembersDesktop
          projectId={project.id}
          assignedMembers={assignedMembers}
          availableMembers={availableMembers}
          onMembersChanged={loadMembersOnly}
        />
      </>
    );
  } else {
    content = (
      <>
        <ProjectActivityMobile activities={activities} />
        <ProjectActivityDesktop activities={activities} />
      </>
    );
  }

  return (
    <>
      <ProjectDetailsShell
        project={project}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== "members") {
            setMembersAttempted(false);
          }
        }}
        onArchive={() => {
          if (project.status === "ARCHIVED") {
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
        onUpdated={(updatedProject) => {
          setProject(updatedProject);
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
        onClose={() => setOpenCreateTask(false)}
        onCreated={async () => {
          await loadTasksOnly(project.id);
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
        onClose={() => setEditingTask(null)}
        onUpdated={refreshProjectTasks}
      />

      <DeleteTaskModal
        open={!!deletingTask}
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onDeleted={refreshProjectTasks}
      />

      <ProjectToasts toasts={toasts} onRemove={removeToast} />
    </>
  );
}