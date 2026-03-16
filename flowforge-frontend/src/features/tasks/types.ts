export type Task = {
  id: string;
  tenantId: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE" | string;
  priority: string;
  dueDate?: string | null;
  createdBy: string;
  createdAt: string;
  assigneeId?: string | null;
};

export type CreateTaskPayload = {
  projectId: string;
  title: string;
  description?: string;
  priority: string;
  dueDate?: string;
};