import { apiClient } from "@/lib/api-client";
import type { ProjectMember } from "./types";

export async function getAssignedProjectMembers(projectId: string) {
  return apiClient<ProjectMember[]>(`/api/projects/${projectId}/members`);
}

export async function getAvailableProjectMembers(projectId: string) {
  return apiClient<ProjectMember[]>(`/api/projects/${projectId}/members/available`);
}

export async function assignProjectMember(projectId: string, userId: string) {
  return apiClient<void>(`/api/projects/${projectId}/members/${userId}`, {
    method: "POST",
  });
}

export async function removeProjectMember(projectId: string, userId: string) {
  return apiClient<void>(`/api/projects/${projectId}/members/${userId}`, {
    method: "DELETE",
  });
}