import { apiClient } from "@/lib/api-client";
import type { Comment } from "./types";

export async function getCommentsByTask(taskId: string) {
  return apiClient<Comment[]>(`/api/comments?taskId=${taskId}`);
}

export async function createComment(taskId: string, body: string) {
  return apiClient<Comment>("/api/comments", {
    method: "POST",
    body: JSON.stringify({ taskId, body }),
  });
}