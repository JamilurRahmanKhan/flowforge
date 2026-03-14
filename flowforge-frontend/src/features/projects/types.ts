export type Project = {
  id: string;
  tenantId: string;
  name: string;
  key: string;
  description: string | null;
  status: string;
  visibility: string;
  defaultWorkflow: string;
  createdBy: string;
  createdAt: string;
};

export type CreateProjectPayload = {
  name: string;
  key: string;
  description: string;
  visibility: string;
  defaultWorkflow: string;
};

export type UpdateProjectPayload = {
  name: string;
  description: string;
  status?: string;
  visibility?: string;
  defaultWorkflow?: string;
};