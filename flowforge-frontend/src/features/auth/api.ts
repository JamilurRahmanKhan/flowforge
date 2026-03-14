import { apiClient } from "@/lib/api-client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "./types";

export async function login(payload: LoginRequest) {
  return apiClient<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerOrg(payload: RegisterRequest) {
  return apiClient<RegisterResponse>("/api/auth/register-org", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}