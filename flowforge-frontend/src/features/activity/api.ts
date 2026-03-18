import { apiClient } from "@/lib/api-client";
import type { ActivityItem } from "./types";

export async function getWorkspaceActivity(limit = 30) {
  return apiClient<ActivityItem[]>(`/api/activity?limit=${limit}`);
}

export async function getProjectActivity(projectId: string, limit = 20) {
  return apiClient<ActivityItem[]>(`/api/activity/projects/${projectId}?limit=${limit}`);
}

export async function getRecentActivity(limit = 8) {
  return apiClient<ActivityItem[]>(`/api/activity/recent?limit=${limit}`);
}