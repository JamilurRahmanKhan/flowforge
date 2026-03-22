export type Project = {
  id: string;
  tenantId: string;
  name: string;
  key: string;
  description?: string | null;
  status: string;
  visibility?: string | null;
  defaultWorkflow?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt?: string | null;
  memberCount?: number;
  openTaskCount?: number;
  progress?: number;
  canViewProject?: boolean;
  canManageProject?: boolean;
  canManageMembers?: boolean;
  canManageProjectMembers?: boolean;
  canCreateTask?: boolean;
};

export type ProjectPermissions = {
  canCreateProject: boolean;
};

export type CreateProjectPayload = {
  name: string;
  key: string;
  description?: string | null;
  visibility: string;
  defaultWorkflow: string;
};

export type UpdateProjectPayload = {
  name: string;
  description?: string | null;
  status?: string | null;
  visibility?: string | null;
  defaultWorkflow?: string | null;
};