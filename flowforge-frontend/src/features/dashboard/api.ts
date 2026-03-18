import { apiClient } from "@/lib/api-client";
import type { DashboardSummary } from "./types";

export async function getDashboardSummary() {
  return apiClient<DashboardSummary>("/api/dashboard");
}