"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/features/projects/types";
import {
  archiveProject,
  deleteProject,
  getProjectById,
  unarchiveProject,
} from "@/features/projects/api";
import ProjectDetailsShell from "./ProjectDetailsShell";
import ProjectOverviewDesktop from "./ProjectOverviewDesktop";
import ProjectOverviewMobile from "./ProjectOverviewMobile";
import EditProjectModal from "./EditProjectModal";
import ArchiveProjectModal from "./ArchiveProjectModal";
import DeleteProjectModal from "./DeleteProjectModal";
import ProjectToasts, { type ProjectToast } from "./ProjectToasts";

type TabKey = "overview" | "board" | "list" | "members" | "activity";

export default function ProjectDetailsScreen({ id }: { id: string }) {
  const router = useRouter();
  const toastIdRef = useRef(1);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [openEdit, setOpenEdit] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toasts, setToasts] = useState<ProjectToast[]>([]);

  function pushToast(toast: Omit<ProjectToast, "id">) {
    const id = toastIdRef.current++;
    setToasts((prev) => [...prev, { ...toast, id }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }

  function removeToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  async function loadProject() {
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

      const data = await getProjectById(id);
      setProject(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load project";

      if (message === "UNAUTHORIZED") {
        if (typeof window !== "undefined") {
          localStorage.removeItem("flowforge_token");
        }
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
    loadProject();
  }, [id]);

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
      const deletedProjectName = project.name;

      await deleteProject(project.id);

      pushToast({
        type: "success",
        title: "Project deleted",
        description: `${deletedProjectName} was deleted successfully.`,
      });

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
      <div className="flex min-h-screen items-center justify-center bg-[#f5f6f8] text-[#64748b]">
        Loading project...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f6f8] px-6">
        <div className="max-w-md rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {error || "Project not found"}
        </div>
      </div>
    );
  }

  let content: React.ReactNode;

  if (activeTab === "overview") {
    content = (
      <>
        <ProjectOverviewMobile
          project={project}
          onEdit={() => setOpenEdit(true)}
        />
        <ProjectOverviewDesktop
          project={project}
          onEdit={() => setOpenEdit(true)}
        />
      </>
    );
  } else {
    content = (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 shadow-sm">
        {activeTab} tab will be implemented in the next phase.
      </div>
    );
  }

  return (
    <>
      <ProjectDetailsShell
        project={project}
        activeTab={activeTab}
        onTabChange={setActiveTab}
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

      <ProjectToasts toasts={toasts} onRemove={removeToast} />
    </>
  );
}