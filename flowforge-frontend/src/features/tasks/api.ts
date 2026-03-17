import { apiClient } from "@/lib/api-client";
import type { CreateTaskPayload, Task } from "./types";

export async function getTasksByProject(projectId: string) {
  return apiClient<Task[]>(`/api/tasks?projectId=${projectId}`);
}

export async function createTask(payload: CreateTaskPayload) {
  return apiClient<Task>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTaskStatus(id: string, status: string) {
  return apiClient<Task>(`/api/tasks/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function updateTask(
  id: string,
  payload: {
    title?: string;
    description?: string;
    priority?: string;
    dueDate?: string;
  }
) {
  return apiClient<Task>(`/api/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(id: string) {
  return apiClient<void>(`/api/tasks/${id}`, {
    method: "DELETE",
  });
}