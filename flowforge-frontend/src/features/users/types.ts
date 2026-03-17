export type WorkspaceUser = {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt?: string;
};