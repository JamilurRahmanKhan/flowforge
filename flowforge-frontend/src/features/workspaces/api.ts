import { apiClient } from "@/lib/api-client";
import type { MyWorkspace } from "./types";

export type SwitchWorkspaceRequest = {
  workspaceSlug: string;
};

export type SwitchWorkspaceResponse = {
  accessToken: string;
  tokenType: string;
  userId: string;
  tenantId: string;
  email: string;
  role: string;
  workspaceSlug: string;
  workspaceName: string;
};

export async function getMyWorkspaces() {
  return apiClient<MyWorkspace[]>("/api/users/my-workspaces");
}

export async function switchWorkspace(payload: SwitchWorkspaceRequest) {
  return apiClient<SwitchWorkspaceResponse>("/api/auth/switch-workspace", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}