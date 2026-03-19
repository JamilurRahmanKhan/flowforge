export type WorkspaceMember = {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
  assignedProjectsCount: number;
  assignedTasksCount: number;
};

export type AddWorkspaceMemberRequest = {
  email: string;
  role: string;
};