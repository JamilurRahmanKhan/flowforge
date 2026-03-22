const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

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

export type SwitchWorkspacePayload = {
  workspaceSlug: string;
};

export type AuthResponse = {
  token: string;
  tokenType?: string;
  userId: string;
  tenantId: string;
  email: string;
  role: string;
  organizationId?: string;
  organizationName?: string;
  organizationSlug?: string;
  workspaceSlug?: string;
  workspaceName?: string;
  message?: string;
};

type RawLoginResponse = {
  accessToken: string;
  tokenType: string;
  userId: string;
  tenantId: string;
  email: string;
  role: string;
};

type RawRegisterResponse = {
  organizationId?: string;
  organizationName?: string;
  slug?: string;
  organizationSlug?: string;
  ownerId?: string;
  ownerEmail?: string;
  message?: string;
};

type RawSwitchWorkspaceResponse = {
  accessToken: string;
  tokenType: string;
  userId: string;
  tenantId: string;
  email: string;
  role: string;
  workspaceSlug: string;
  workspaceName: string;
};

async function parseJson(response: Response) {
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await parseJson(response)) as RawLoginResponse & {
    message?: string;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`
    );
  }

  return {
    token: data.accessToken,
    tokenType: data.tokenType,
    userId: data.userId,
    tenantId: data.tenantId,
    email: data.email,
    role: data.role,
  };
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await parseJson(response)) as RawRegisterResponse & {
    message?: string;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`
    );
  }

  return {
    token: "",
    userId: data.ownerId || "",
    tenantId: data.organizationId || "",
    email: data.ownerEmail || "",
    role: "",
    organizationId: data.organizationId,
    organizationName: data.organizationName,
    organizationSlug: data.organizationSlug || data.slug,
    message: data.message || "Workspace created successfully",
  };
}

export async function switchWorkspace(
  payload: SwitchWorkspacePayload,
  token: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/switch-workspace`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = (await parseJson(response)) as RawSwitchWorkspaceResponse & {
    message?: string;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`
    );
  }

  return {
    token: data.accessToken,
    tokenType: data.tokenType,
    userId: data.userId,
    tenantId: data.tenantId,
    email: data.email,
    role: data.role,
    workspaceSlug: data.workspaceSlug,
    workspaceName: data.workspaceName,
  };
}

export const loginRequest = login;
export const registerRequest = register;
export const registerOrg = register;