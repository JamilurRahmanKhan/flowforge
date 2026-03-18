import { apiClient } from "@/lib/api-client";
import type {
  ChangePasswordInput,
  CurrentUser,
  UpdateProfileInput,
} from "./types";

export async function getCurrentUser() {
  return apiClient<CurrentUser>("/api/users/me");
}

export async function updateProfile(input: UpdateProfileInput) {
  return apiClient<CurrentUser>("/api/users/me", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function changePassword(input: ChangePasswordInput) {
  return apiClient<void>("/api/users/me/password", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}