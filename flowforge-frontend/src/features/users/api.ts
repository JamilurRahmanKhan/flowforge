import { apiClient } from "@/lib/api-client";
import type { WorkspaceUser } from "./types";

export async function getWorkspaceUsers() {
  return apiClient<WorkspaceUser[]>("/api/users");
}