import { apiClient } from "@/lib/api-client";
import type { Task } from "./types";

export type CreateTaskInput = {
  projectId: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string | null;
  assigneeId?: string | null;
};

export type UpdateTaskInput = {
  title: string;
  description: string;
  priority: string;
  dueDate: string | null;
};

export async function getTasksByProject(projectId: string) {
  return apiClient<Task[]>(`/api/tasks?projectId=${projectId}`);
}

export async function getMyTasks() {
  return apiClient<Task[]>("/api/tasks/my");
}

export async function getTaskById(id: string) {
  return apiClient<Task>(`/api/tasks/${id}`);
}

export async function createTask(input: CreateTaskInput) {
  return apiClient<Task>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateTask(id: string, input: UpdateTaskInput) {
  return apiClient<Task>(`/api/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function updateTaskStatus(id: string, status: string) {
  return apiClient<Task>(`/api/tasks/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteTask(id: string) {
  return apiClient<void>(`/api/tasks/${id}`, {
    method: "DELETE",
  });
}