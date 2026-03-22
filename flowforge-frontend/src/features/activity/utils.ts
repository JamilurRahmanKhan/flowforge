import type { Project } from "@/features/projects/types";
import type { Task } from "@/features/tasks/types";
import type { ActivityItem } from "./types";

function toIsoOrFallback(value?: string | null) {
  return value || new Date(0).toISOString();
}

export function buildProjectActivity(
  project: Project,
  tasks: Task[]
): ActivityItem[] {
  const items: ActivityItem[] = [];

  items.push({
    id: `project-created-${project.id}`,
    type: "PROJECT_CREATED",
    title: "Project created",
    description: `${project.name} was created with key ${project.key}.`,
    createdAt: toIsoOrFallback(project.createdAt),
    projectId: project.id,
    projectName: project.name,
    taskId: null,
    taskTitle: null,
    userId: project.createdBy,
    userName: null,
    actorName: null,
  });

  items.push({
    id: `project-status-${project.id}-${project.status}`,
    type: project.status === "ARCHIVED" ? "PROJECT_ARCHIVED" : "PROJECT_ACTIVE",
    title:
      project.status === "ARCHIVED"
        ? "Project archived"
        : "Project is active",
    description:
      project.status === "ARCHIVED"
        ? `${project.name} is currently archived.`
        : `${project.name} is currently active.`,
    createdAt: toIsoOrFallback(project.updatedAt || project.createdAt),
    projectId: project.id,
    projectName: project.name,
    taskId: null,
    taskTitle: null,
    userId: project.createdBy,
    userName: null,
    actorName: null,
  });

  if (project.description) {
    items.push({
      id: `project-updated-${project.id}`,
      type: "PROJECT_UPDATED",
      title: "Project details available",
      description:
        "Project description and workflow information have been configured.",
      createdAt: toIsoOrFallback(project.updatedAt || project.createdAt),
      projectId: project.id,
      projectName: project.name,
      taskId: null,
      taskTitle: null,
      userId: project.createdBy,
      userName: null,
      actorName: null,
    });
  }

  for (const task of tasks) {
    items.push({
      id: `task-created-${task.id}`,
      type: "TASK_CREATED",
      title: `Task created: ${task.title}`,
      description: `Status: ${task.status} • Priority: ${task.priority}${
        task.dueDate ? ` • Due: ${new Date(task.dueDate).toLocaleDateString()}` : ""
      }`,
      createdAt: toIsoOrFallback(task.createdAt),
      projectId: task.projectId,
      projectName: project.name,
      taskId: task.id,
      taskTitle: task.title,
      userId: task.createdBy,
      userName: null,
      actorName: null,
    });
  }

  return items.sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return bTime - aTime;
  });
}