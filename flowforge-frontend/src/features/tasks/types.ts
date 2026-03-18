export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: string;
  tenantId: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: string;
  dueDate: string | null;
  createdBy: string;
  createdAt: string;
  assigneeId: string | null;
};

export type CreateTaskInput = {
  projectId: string;
  title: string;
  description?: string;
  priority: string;
  dueDate?: string | null;
  assigneeId?: string | null;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string;
  priority?: string;
  dueDate?: string | null;
  assigneeId?: string | null;
};