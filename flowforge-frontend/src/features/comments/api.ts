import { apiClient } from "@/lib/api-client";
import type { Comment } from "./types";

type RawComment = {
  id: string;
  tenantId: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: string;
};

function mapComment(raw: RawComment): Comment {
  return {
    id: raw.id,
    tenantId: raw.tenantId,
    taskId: raw.taskId,
    authorId: raw.authorId,
    body: raw.content,
    createdAt: raw.createdAt,
  };
}

export async function getCommentsByTask(taskId: string) {
  const comments = await apiClient<RawComment[]>(`/api/comments?taskId=${taskId}`);
  return comments.map(mapComment);
}

export async function createComment(taskId: string, content: string) {
  const comment = await apiClient<RawComment>("/api/comments", {
    method: "POST",
    body: JSON.stringify({
      taskId,
      content,
    }),
  });

  return mapComment(comment);
}