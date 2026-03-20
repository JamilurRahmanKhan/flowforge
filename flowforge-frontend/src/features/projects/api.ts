import { apiClient } from "@/lib/api-client";
import type {
  CreateProjectPayload,
  Project,
  ProjectPermissions,
  UpdateProjectPayload,
} from "./types";

export async function getProjects() {
  return apiClient<Project[]>("/api/projects");
}

export async function getProjectPermissions() {
  return apiClient<ProjectPermissions>("/api/projects/permissions");
}

export async function getProjectById(id: string) {
  return apiClient<Project>(`/api/projects/${id}`);
}

export async function createProject(payload: CreateProjectPayload) {
  return apiClient<Project>("/api/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProject(id: string, payload: UpdateProjectPayload) {
  return apiClient<Project>(`/api/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function archiveProject(id: string) {
  return apiClient<Project>(`/api/projects/${id}/archive`, {
    method: "PATCH",
  });
}

export async function unarchiveProject(id: string) {
  return apiClient<Project>(`/api/projects/${id}/unarchive`, {
    method: "PATCH",
  });
}

export async function deleteProject(id: string) {
  return apiClient<void>(`/api/projects/${id}`, {
    method: "DELETE",
  });
}