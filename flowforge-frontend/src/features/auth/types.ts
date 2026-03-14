export type LoginRequest = {
  email: string;
  password: string;
  organizationSlug: string;
};

export type LoginResponse = {
  accessToken: string;
  userId: string;
  tenantId: string;
  email: string;
  role: string;
};

export type RegisterRequest = {
  organizationName: string;
  organizationSlug: string;
  ownerName: string;
  ownerEmail: string;
  password: string;
};

export type RegisterResponse = {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  ownerId: string;
  ownerEmail: string;
};