import { apiClient } from "@/lib/api-client";

export type CurrentUser = {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
};

export async function getCurrentUser() {
  return apiClient<CurrentUser>("/api/users/me");
}