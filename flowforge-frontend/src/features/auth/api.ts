const API_BASE_URL = "http://localhost:8080";

export type LoginPayload = {
  slug: string;
  email: string;
  password: string;
};

export type RegisterPayload = {
  organizationName: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  userId: string;
  tenantId: string;
  email: string;
  role: string;
  organizationId?: string;
  organizationName?: string;
  organizationSlug?: string;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<AuthResponse>(response);
}

export async function register(
  payload: RegisterPayload
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<AuthResponse>(response);
}

export const loginRequest = login;
export const registerRequest = register;