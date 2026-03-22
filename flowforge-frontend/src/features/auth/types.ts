export type LoginPayload = {
  slug: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  tokenType: string;
  userId: string;
  tenantId: string;
  email: string;
  role: string;
};

export type RegisterPayload = {
  organizationName: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  password: string;
};

export type RegisterResponse = {
  organizationId: string;
  organizationName: string;
  slug: string;
  ownerId: string;
  ownerEmail: string;
  message: string;
};

export type SwitchWorkspacePayload = {
  workspaceSlug: string;
};

export type SwitchWorkspaceResponse = {
  token: string;
  tokenType: string;
  userId: string;
  tenantId: string;
  email: string;
  role: string;
  workspaceSlug: string;
  workspaceName: string;
};