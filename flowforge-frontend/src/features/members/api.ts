import { apiClient } from "@/lib/api-client";
import type { AddWorkspaceMemberRequest, WorkspaceMember } from "./types";

export async function getWorkspaceMembers() {
  return apiClient<WorkspaceMember[]>("/api/users");
}

export async function addWorkspaceMember(payload: AddWorkspaceMemberRequest) {
  return apiClient<WorkspaceMember>("/api/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}