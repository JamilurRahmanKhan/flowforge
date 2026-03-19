export type Task = {
  id: string;
  tenantId: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: string;
  priority?: string | null;
  dueDate?: string | null;
  createdBy: string;
  createdAt: string;
  assigneeId?: string | null;

  canEdit?: boolean;
  canDelete?: boolean;
  canChangeStatus?: boolean;
};