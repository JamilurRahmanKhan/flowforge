import { apiClient } from "@/lib/api-client";
import type { WorkspaceMember } from "./types";

export async function getWorkspaceMembers() {
  return apiClient<WorkspaceMember[]>("/api/users");
}